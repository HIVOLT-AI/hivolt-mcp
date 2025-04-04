import { z } from "zod";
import bs58 from "bs58";
import { Connection, Keypair } from "@solana/web3.js";
import { RPC_URL } from "src/constants/rpc";
import { ENV } from "src/env";

const SolanaGetBalanceToolParams = z.object({});

export type SolanaGetBalanceToolParams = z.infer<
  typeof SolanaGetBalanceToolParams
>;

export const SolanaGetBalanceTool = {
  name: "SOLANA_GET_BALANCE",
  description: "Get the balance of SOL in the account",
  parameters: {},
  execute: async ({}: SolanaGetBalanceToolParams) => {
    try {
      const secretKey = bs58.decode(ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
      const connection = new Connection(RPC_URL.HELIUS);
      const keypair = Keypair.fromSecretKey(secretKey);

      const balance = await connection.getBalance(keypair.publicKey);

      return balance;
    } catch (error: any) {
      return error.message;
    }
  },
};
