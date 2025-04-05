import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import DLMM, { PositionBinData } from "@meteora-ag/dlmm";
import { Connection, Keypair } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import { RPC_URL } from "../../constants/rpc";
import { ENV } from "../../env";
import { z } from "zod";

const MeteoraGetListOfPositionsToolParams = z.object({
  poolAddress: z.string(),
});

export type MeteoraGetListOfPositionsToolParams = z.infer<
  typeof MeteoraGetListOfPositionsToolParams
>;

export const MeteoraGetListOfPositionsTool = {
  name: "METEORA_GET_LIST_OF_POSITIONS",
  description: "Get list of positions",
  parameters: {
    poolAddress: z.string(),
  },
  execute: async (input: MeteoraGetListOfPositionsToolParams) => {
    const secretKey = bs58.decode(ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
    const connection = new Connection(RPC_URL.HELIUS);
    const keypair = Keypair.fromSecretKey(secretKey);

    return await meteora_get_list_of_positions(
      keypair,
      connection,
      input.poolAddress
    );
  },
};

export async function meteora_get_list_of_positions(
  accountKeypair: Keypair,
  connection: Connection,
  poolAddress: string
): Promise<PositionBinData[]> {
  try {
    const pool = new PublicKey(poolAddress);
    const dlmmPool = await DLMM.create(connection, pool);

    const { userPositions } = await dlmmPool.getPositionsByUserAndLbPair(
      accountKeypair.publicKey
    );
    const binData = userPositions[0].positionData.positionBinData;
    return binData;
  } catch (error: any) {
    console.error(error);
    throw new Error(`Failed to get list of positions: ${error.message}`);
  }
}
