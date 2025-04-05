import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import {
  Connection,
  Keypair,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import axios from "axios";
import { RPC_URL } from "../../constants/rpc";
import { ENV } from "../../env";
import { LULO_API_URI } from "../../constants/lulo";
import { z } from "zod";

const LuloDepositToolParams = z.object({
  mintAddress: z.string(),
  protectedAmount: z.number(),
  regularAmount: z.number(),
});

export type LuloDepositToolParams = z.infer<typeof LuloDepositToolParams>;

export const LuloDepositTool = {
  name: "LULO_DEPOSIT",
  description: "Deposit USDC to Lulo",
  parameters: {
    mintAddress: z.string(),
    protectedAmount: z.number(),
    regularAmount: z.number(),
  },
  execute: async (input: LuloDepositToolParams) => {
    const secretKey = bs58.decode(ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
    const connection = new Connection(RPC_URL.HELIUS);
    const keypair = Keypair.fromSecretKey(secretKey);

    return await lulo_deposit(
      keypair,
      connection,
      input.mintAddress,
      input.protectedAmount,
      input.regularAmount
    );
  },
};

export async function lulo_deposit(
  accountKeypair: Keypair,
  connection: Connection,
  mintAddress: string,
  protectedAmount?: number,
  regularAmount?: number
): Promise<{ txId: string }> {
  try {
    const client = axios.create({
      baseURL: LULO_API_URI,
    });
    const response = await client.post(
      "/v1/generate.transactions.deposit?priorityFee=500000",
      {
        owner: accountKeypair.publicKey.toBase58(),
        mintAddress: mintAddress, // USDC: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
        protectedAmount: protectedAmount ?? 0,
        regularAmount: regularAmount ?? 0,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ENV.LULO_API_KEY,
        },
      }
    );

    const txBuffer = Buffer.from(response.data.trasnaction, "base64");
    const tx = VersionedTransaction.deserialize(txBuffer);
    const { blockhash } = await connection.getLatestBlockhash();

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
    throw new Error(`Failed to deposit USDC to Lulo: ${error.message}`);
  }
}
