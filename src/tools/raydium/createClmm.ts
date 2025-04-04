import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { Connection, Keypair, PublicKey, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { RPC_URL } from 'src/constants/rpc';
import { ENV } from 'src/env';
import { z } from 'zod';
import { BN } from '@coral-xyz/anchor';
import { CLMM_PROGRAM_ID, Raydium, TxVersion } from '@raydium-io/raydium-sdk-v2';
import {
  AMM_V4,
  FEE_DESTINATION_ID,
  MARKET_STATE_LAYOUT_V3,
  OPEN_BOOK_PROGRAM,
} from "@raydium-io/raydium-sdk-v2";
import { MintLayout } from '@solana/spl-token';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import Decimal from 'decimal.js';

const RaydiumCreateClmmToolParams = z.object({
  mint1: z.string(),
  mint2: z.string(),
  configId: z.string(),
  initialPrice: z.string(),
  startTime: z.string(),
});

export type RaydiumCreateClmmToolParams = z.infer<
  typeof RaydiumCreateClmmToolParams
>;

export const RaydiumCreateClmmTool = {
  name: 'RAYDIUM_CREATE_CLMM',
  description: 'Create CLMM pool',
  parameters: {
    mint1: z.string(),
    mint2: z.string(),
    configId: z.string(),
    initialPrice: z.string(),
    startTime: z.string(),
  },
  execute: async (input: RaydiumCreateClmmToolParams) => {
    const secretKey = bs58.decode(ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
    const connection = new Connection(RPC_URL.HELIUS);
    const keypair = Keypair.fromSecretKey(secretKey);

    return await raydium_create_clmm(
      keypair,
      connection,
      new PublicKey(input.mint1),
      new PublicKey(input.mint2),
      new PublicKey(input.configId),
      new Decimal(input.initialPrice),
      new BN(input.startTime),
    );
  },
};

export async function raydium_create_clmm(
  accountKeypair: Keypair,
  connection: Connection,
  mint1: PublicKey,
  mint2: PublicKey,
  configId: PublicKey, // V4 CLMM Config ID: 6J2X5j8iGUE9rPpy8h52u9dfy85vPMU8aF4D2KYfrc4h
  initialPrice: Decimal,
  startTime: BN,
): Promise<{ txId: string }> {
  try {
    const raydium = await Raydium.load({
      owner: accountKeypair.publicKey,
      connection,
    });

    const [mintInfo1, mintInfo2] = await connection.getMultipleAccountsInfo(
      [mint1, mint2],
    );
    if (mintInfo1 === null || mintInfo2 === null) {
      throw Error("fetch mint info error");
    }
    const mintDecodeInfo1 = MintLayout.decode(mintInfo1.data);
    const mintDecodeInfo2 = MintLayout.decode(mintInfo2.data);

    const mintFormatInfo1 = {
      chainId: 101,
      address: mint1.toString(),
      programId: mintInfo1.owner.toString(),
      logoURI: "",
      symbol: "",
      name: "",
      decimals: mintDecodeInfo1.decimals,
      tags: [],
      extensions: {},
    };
    const mintFormatInfo2 = {
      chainId: 101,
      address: mint2.toString(),
      programId: mintInfo2.owner.toString(),
      logoURI: "",
      symbol: "",
      name: "",
      decimals: mintDecodeInfo2.decimals,
      tags: [],
      extensions: {},
    };

    const response = await raydium.clmm.createPool({
      programId: CLMM_PROGRAM_ID,
      // programId: DEVNET_PROGRAM_ID.CLMM,
      mint1: mintFormatInfo1,
      mint2: mintFormatInfo2,
      // @ts-expect-error sdk bug
      ammConfig: { id: configId },
      initialPrice,
      startTime,
      txVersion: TxVersion.V0,
      // computeBudgetConfig: {
      //   units: 600000,
      //   microLamports: 46591500,
      // },
    });

    response.transaction.sign([accountKeypair]);

    const txId = await connection.sendTransaction(response.transaction, {
      maxRetries: 3,
    });

    return { txId };
  } catch (error: any) {
    console.error(error);
    throw new Error(`Failed to create CLMM pool: ${error.message}`);
  }
}
