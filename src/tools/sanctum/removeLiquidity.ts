import { z } from "zod";
import bs58 from "bs58";
import { ENV } from "../../env";
import { RPC_URL } from "../../constants/rpc";
import {
  Connection,
  Keypair,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import axios from "axios";
import { SANCTUM_TRADE_API_URI } from "../../constants/sanctum";

const SanctumRemoveLiquidityToolParams = z.object({
  lstMint: z.string(),
  amount: z.string(),
  quotedAmount: z.string(),
  priorityFee: z.number(),
});

export type SanctumRemoveLiquidityToolParams = z.infer<
  typeof SanctumRemoveLiquidityToolParams
>;

export const SanctumRemoveLiquidityTool = {
  name: "SANCTUM_REMOVE_LIQUIDITY",
  description:
    "Remove liquidity from sanctum infinite pool with specified token parameters",
  parameters: {
    lstMint: z.string(),
    amount: z.string(),
    quotedAmount: z.string(),
    priorityFee: z.number(),
  },
  execute: async ({
    lstMint,
    amount,
    quotedAmount,
    priorityFee,
  }: SanctumRemoveLiquidityToolParams) => {
    try {
      const secretKey = bs58.decode(ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
      const connection = new Connection(RPC_URL.HELIUS);
      const keypair = Keypair.fromSecretKey(secretKey);

      const client = axios.create({
        baseURL: SANCTUM_TRADE_API_URI,
      });

      const response = await client.post("/v1/liquidity/remove", {
        amount,
        dstLstAcc: null,
        lstMint,
        priorityFee: {
          Auto: {
            max_unit_price_micro_lamports: priorityFee,
            unit_limit: 300000,
          },
        },
        quotedAmount,
        signer: keypair.publicKey.toBase58(),
        srcLstAcc: null,
      });

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

      return txId;
    } catch (error: any) {
      return error.message;
    }
  },
};
