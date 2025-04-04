import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { Connection, Keypair, PublicKey, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { RPC_URL } from 'src/constants/rpc';
import { ENV } from 'src/env';
import { z } from 'zod';
import DLMM, { autoFillYByStrategy, StrategyType } from '@meteora-ag/dlmm';
import { getMint } from '@solana/spl-token';
import { BN } from '@coral-xyz/anchor';

const MeteoraCreateDlmmImbalancePositionToolParams = z.object({
  poolAddress: z.string(),
  tokenXMint: z.string(),
  tokenXAmount: z.number(),
  solAmount: z.number(),
});

export type MeteoraCreateDlmmImbalancePositionToolParams = z.infer<
  typeof MeteoraCreateDlmmImbalancePositionToolParams
>;

export const MeteoraCreateDlmmImbalancePositionTool = {
  name: 'METEORA_CREATE_DLMM_IMBALANCE_POSITION',
  description: 'Create DLMM imbalance position',
  parameters: {
    poolAddress: z.string(),
    tokenXMint: z.string(),
    tokenXAmount: z.number(),
    solAmount: z.number(),
  },
  execute: async (input: MeteoraCreateDlmmImbalancePositionToolParams) => {
    const secretKey = bs58.decode(ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
    const connection = new Connection(RPC_URL.HELIUS);
    const keypair = Keypair.fromSecretKey(secretKey);

    return await meteora_create_dlmm_imbalance_position(
      keypair,
      connection,
      input.poolAddress,
      input.tokenXMint,
      input.tokenXAmount,
      input.solAmount,
    );
  },
};

export async function meteora_create_dlmm_imbalance_position(
  accountKeypair: Keypair,
  connection: Connection,
  poolAddress: string,
  tokenXMint: string,
  tokenXAmount: number,
  solAmount: number,
): Promise<{ txId: string }> {
  try {
    const pool = new PublicKey(poolAddress);
    const dlmmPool = await DLMM.create(connection, pool);

    // get active bin
    const activeBin = await dlmmPool.getActiveBin();

    // create balance position
    const TOTAL_RANGE_INTERVAL = 10; // 10 bins on each side of the active bin
    const minBinId = activeBin.binId - TOTAL_RANGE_INTERVAL;
    const maxBinId = activeBin.binId + TOTAL_RANGE_INTERVAL;

    const baseMint = await getMint(connection, new PublicKey(tokenXMint));
    const totalXAmount = new BN(tokenXAmount * 10 ** baseMint.decimals);
    const totalYAmount = new BN(solAmount * 10 ** 9); // SOL

    const newImbalancePosition = new Keypair();

    // create position
    const createPositionTx =
      await dlmmPool.initializePositionAndAddLiquidityByStrategy({
        positionPubKey: newImbalancePosition.publicKey,
        user: accountKeypair.publicKey,
        totalXAmount,
        totalYAmount,
        strategy: {
          maxBinId,
          minBinId,
          strategyType: StrategyType.Spot, // can be StrategyType.Spot, StrategyType.BidAsk, StrategyType.Curve
        },
      });

    const instructions = createPositionTx.instructions;
    const { blockhash } = await connection.getLatestBlockhash();

    const newMessage = new TransactionMessage({
      payerKey: accountKeypair.publicKey,
      recentBlockhash: blockhash,
      instructions,
    }).compileToV0Message();

    const newTx = new VersionedTransaction(newMessage);

    newTx.sign([accountKeypair]);
    const txId = await connection.sendTransaction(newTx, {
      maxRetries: 3,
    });

    return { txId };
  } catch (error: any) {
    throw new Error(`Failed to create DLMM imbalance position: ${error.message}`);
  }
}

// https://github.com/MeteoraAg/dlmm-sdk/tree/main/ts-client
