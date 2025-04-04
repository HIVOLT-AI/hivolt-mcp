import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAccount,
  getAssociatedTokenAddress,
  getMint,
} from "@solana/spl-token";
import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { NetworkSchema } from "src/types/chain";
import { z } from "zod";
import bs58 from "bs58";
import { ENV } from "src/env";
import { RPC_URL } from "src/constants/rpc";

const SolanaTransferTokenToolParams = z.object({
  to: z.string(),
  amount: z.number(),
  network: NetworkSchema,
  tokenAddress: z.string(),
});

export type SolanaTransferTokenToolParams = z.infer<
  typeof SolanaTransferTokenToolParams
>;

export const SolanaTransferTokenTool = {
  name: "SOLANA_TRANSFER_TOKEN",
  description: "Transfer a SPL token to another address on Solana",
  parameters: {
    to: z.string(),
    amount: z.number(),
    network: NetworkSchema,
    tokenAddress: z.string(),
  },
  execute: async ({
    to,
    amount,
    tokenAddress,
  }: SolanaTransferTokenToolParams) => {
    try {
      const secretKey = bs58.decode(ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
      const connection = new Connection(RPC_URL.HELIUS);
      const keypair = Keypair.fromSecretKey(secretKey);

      const transaction = new Transaction();

      const fromAta = await getAssociatedTokenAddress(
        new PublicKey(tokenAddress),
        keypair.publicKey
      );

      const toAta = await getAssociatedTokenAddress(
        new PublicKey(tokenAddress),
        new PublicKey(to)
      );

      try {
        await getAccount(connection, toAta);
      } catch {
        // Error is thrown if the tokenAccount doesn't exist
        transaction.add(
          createAssociatedTokenAccountInstruction(
            keypair.publicKey,
            toAta,
            new PublicKey(to),
            new PublicKey(tokenAddress)
          )
        );
      }

      const mintInfo = await getMint(connection, new PublicKey(tokenAddress));
      const adjustedAmount = amount * Math.pow(10, mintInfo.decimals);

      transaction.add(
        createTransferInstruction(
          fromAta,
          toAta,
          keypair.publicKey,
          adjustedAmount
        )
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
