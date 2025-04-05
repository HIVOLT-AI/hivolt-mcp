import {
  Connection,
  Keypair,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import axios from "axios";
import { z } from "zod";
import bs58 from "bs58";
import { ENV } from "../../env";
import { RPC_URL } from "../../constants/rpc";
import { SOLAYER_API_URI } from "../../constants/solayer";

const SolayerStakeWithSolayerToolParams = z.object({
  amount: z.string(),
});

export type SolayerStakeWithSolayerToolParams = z.infer<
  typeof SolayerStakeWithSolayerToolParams
>;

export const SolayerStakeWithSolayerTool = {
  name: "SOLAYER_STAKE_SOL",
  description: "Stake SOL with Solayer.",
  parameters: {
    amount: z.string(),
  },
  execute: async ({ amount }: SolayerStakeWithSolayerToolParams) => {
    try {
      const secretKey = bs58.decode(ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
      const connection = new Connection(RPC_URL.HELIUS);
      const keypair = Keypair.fromSecretKey(secretKey);

      const client = axios.create({
        baseURL: SOLAYER_API_URI,
      });

      const response = await client.post(
        `/api/action/restake/ssol?amount=${amount}`,
        {
          account: keypair.publicKey.toBase58(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const txBuffer = Buffer.from(response.data.tx, "base64");
      const { blockhash } = await connection.getLatestBlockhash();

      const tx = VersionedTransaction.deserialize(txBuffer);

      const messages = tx.message;

      const instructions = messages.compiledInstructions.map((ix) => {
        return new TransactionInstruction({
          programId: messages.staticAccountKeys[ix.programIdIndex],
          keys: ix.accountKeyIndexes.map((i) => ({
            pubkey: messages.staticAccountKeys[i],
            isSigner: messages.isAccountSigner(i),
            isWritable: messages.isAccountWritable(i),
          })),
          data: Buffer.from(ix.data as any, "base64"),
        });
      });

      const newMessage = new TransactionMessage({
        payerKey: keypair.publicKey,
        recentBlockhash: blockhash,
        instructions,
      }).compileToV0Message();

      const newTx = new VersionedTransaction(newMessage);

      newTx.sign([keypair]);
      const txId = await connection.sendTransaction(newTx, {
        maxRetries: 3,
      });

      return { txId };
    } catch (error: any) {
      return error.message;
    }
  },
};
