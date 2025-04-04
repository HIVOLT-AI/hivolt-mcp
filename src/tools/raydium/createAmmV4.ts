import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { Connection, Keypair, PublicKey, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { RPC_URL } from 'src/constants/rpc';
import { ENV } from 'src/env';
import { z } from 'zod';
import { BN } from '@coral-xyz/anchor';
import { Raydium, TxVersion } from '@raydium-io/raydium-sdk-v2';
import {
  AMM_V4,
  FEE_DESTINATION_ID,
  MARKET_STATE_LAYOUT_V3,
  OPEN_BOOK_PROGRAM,
} from "@raydium-io/raydium-sdk-v2";
import { MintLayout } from '@solana/spl-token';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

const RaydiumCreateAmmV4ToolParams = z.object({
  marketId: z.string(),
  baseAmount: z.string(),
  quoteAmount: z.string(),
  startTime: z.string(),
});

export type RaydiumCreateAmmV4ToolParams = z.infer<
  typeof RaydiumCreateAmmV4ToolParams
>;

export const RaydiumCreateAmmV4Tool = {
  name: 'RAYDIUM_CREATE_AMM_V4',
  description: 'Create AMM V4 pool',
  parameters: {
    marketId: z.string(),
    baseAmount: z.string(),
    quoteAmount: z.string(),
    startTime: z.string(),
  },
  execute: async (input: RaydiumCreateAmmV4ToolParams) => {
    const secretKey = bs58.decode(ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
    const connection = new Connection(RPC_URL.HELIUS);
    const keypair = Keypair.fromSecretKey(secretKey);

    return await raydium_create_amm_v4(
      keypair,
      connection,
      input.marketId,
      new BN(input.baseAmount),
      new BN(input.quoteAmount),
      new BN(input.startTime),
    );
  },
};

export async function raydium_create_amm_v4(
  accountKeypair: Keypair,
  connection: Connection,
  marketId: string,
  baseAmount: BN,
  quoteAmount: BN,
  startTime: BN,
): Promise<{ txId: string }> {
  try {
    const raydium = await Raydium.load({
      owner: accountKeypair.publicKey,
      connection,
    });

    const marketBufferInfo = await connection.getAccountInfo(
      new PublicKey(marketId),
    );
    const { baseMint, quoteMint } = MARKET_STATE_LAYOUT_V3.decode(
      marketBufferInfo!.data,
    );

    const baseMintInfo = await connection.getAccountInfo(baseMint);
    const quoteMintInfo = await connection.getAccountInfo(quoteMint);

    if (
      baseMintInfo?.owner.toString() !== TOKEN_PROGRAM_ID.toBase58() ||
      quoteMintInfo?.owner.toString() !== TOKEN_PROGRAM_ID.toBase58()
    ) {
      throw new Error(
        "amm pools with openbook market only support TOKEN_PROGRAM_ID mints, if you want to create pool with token-2022, please create cpmm pool instead",
      );
    }
    if (
      baseAmount
        .mul(quoteAmount)
        .lte(
          new BN(1)
            .mul(new BN(10 ** MintLayout.decode(baseMintInfo.data).decimals))
            .pow(new BN(2)),
        )
    ) {
      throw new Error(
        "initial liquidity too low, try adding more baseAmount/quoteAmount",
      );
    }

    const response = await raydium.liquidity.createPoolV4({
      programId: AMM_V4,
      marketInfo: {
        marketId: new PublicKey(marketId),
        programId: OPEN_BOOK_PROGRAM,
      },
      baseMintInfo: {
        mint: baseMint,
        decimals: MintLayout.decode(baseMintInfo.data).decimals,
      },
      quoteMintInfo: {
        mint: quoteMint,
        decimals: MintLayout.decode(quoteMintInfo.data).decimals,
      },
      baseAmount,
      quoteAmount,

      startTime,
      ownerInfo: {
        useSOLBalance: true,
      },
      associatedOnly: false,
      txVersion: TxVersion.V0,
      feeDestinationId: FEE_DESTINATION_ID,
    });

    response.transaction.sign([accountKeypair]);

    const txId = await connection.sendTransaction(response.transaction, {
      maxRetries: 3,
    });

    return { txId };
  } catch (error: any) {
    console.error(error);
    throw new Error(`Failed to create AMM V4 pool: ${error.message}`);
  }
}
