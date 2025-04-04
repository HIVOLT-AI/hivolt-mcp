import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { NetworkSchema } from "src/types/chain";
import { z } from "zod";
import bs58 from "bs58";
import { ENV } from "src/env";
import { RPC_URL } from "src/constants/rpc";

const SolanaTransferToolParams = z.object({
  to: z.string(),
  amount: z.number(),
  network: NetworkSchema,
});

export type SolanaTransferToolParams = z.infer<typeof SolanaTransferToolParams>;

export const SolanaTransferTool = {
  name: "SOLANA_TRANSFER",
  description: "Transfer SOL to another address on Solana",
  parameters: {
    to: z.string(),
    amount: z.number(),
    network: NetworkSchema,
  },
  execute: async ({ to, amount, network }: SolanaTransferToolParams) => {
    try {
      const secretKey = bs58.decode(ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
      const connection = new Connection(RPC_URL.HELIUS);
      const keypair = Keypair.fromSecretKey(secretKey);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: keypair.publicKey,
          toPubkey: new PublicKey(to),
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );

      const txId = await connection.sendTransaction(transaction, [keypair], {
        maxRetries: 3,
      });

      return txId;
    } catch (error: any) {
      return error.message;
    }
  },
};
