import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { Connection, Keypair, PublicKey, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { RPC_URL } from 'src/constants/rpc';
import { ENV } from 'src/env';
import { z } from 'zod';
import DLMM from '@meteora-ag/dlmm';

const MeteoraClosePositionToolParams = z.object({
  poolAddress: z.string(),
  positionAddress: z.string(),
});

export type MeteoraClosePositionToolParams = z.infer<
  typeof MeteoraClosePositionToolParams
>;

export const MeteoraClosePositionTool = {
  name: 'METEORA_CLOSE_POSITION',
  description: 'Close DLMM position',
  parameters: {
    poolAddress: z.string(),
    positionAddress: z.string(),
  },
  execute: async (input: MeteoraClosePositionToolParams) => {
    const secretKey = bs58.decode(ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
    const connection = new Connection(RPC_URL.HELIUS);
    const keypair = Keypair.fromSecretKey(secretKey);

    return await meteora_close_position(
      keypair,
      connection,
      input.poolAddress,
      input.positionAddress,
    );
  },
};

export async function meteora_close_position(
  accountKeypair: Keypair,
  connection: Connection,
  poolAddress: string,
  positionAddress: string,
): Promise<{ txId: string }> {
  try {
    const pool = new PublicKey(poolAddress);
    const dlmmPool = await DLMM.create(connection, pool);

    const position = await dlmmPool.getPosition(new PublicKey(positionAddress));
    const closePositionTx = await dlmmPool.closePosition({
      owner: accountKeypair.publicKey,
      position: position,
    });

    const instructions = closePositionTx.instructions;
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
    throw new Error(`Failed to close DLMM position: ${error.message}`);
  }
}

// https://github.com/MeteoraAg/dlmm-sdk/tree/main/ts-client
