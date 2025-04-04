import { z } from "zod";
import bs58 from "bs58";
import { ENV } from "src/env";
import {
  Connection,
  Keypair,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { RPC_URL } from "src/constants/rpc";
import { Wallet } from "@coral-xyz/anchor";
import {
  buildWhirlpoolClient,
  ORCA_WHIRLPOOL_PROGRAM_ID,
  PDAUtil,
  WhirlpoolContext,
} from "@orca-so/whirlpools-sdk";
import { Percentage } from "@orca-so/common-sdk";

const OrcaClosePositionToolParams = z.object({
  positionMint: z.string(),
});

export type OrcaClosePositionToolParams = z.infer<
  typeof OrcaClosePositionToolParams
>;

export const OrcaClosePositionTool = {
  name: "ORCA_CLOSE_POSITION",
  description:
    "Close an existing Orca position in a liquidity pool and withdraw the funds.",
  parameters: {
    positionMint: z.string(),
  },
  execute: async ({ positionMint }: OrcaClosePositionToolParams) => {
    try {
      const secretKey = bs58.decode(ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
      const connection = new Connection(RPC_URL.HELIUS);
      const keypair = Keypair.fromSecretKey(secretKey);

      const wallet = new Wallet(keypair);

      const ctx = WhirlpoolContext.from(
        connection,
        wallet,
        ORCA_WHIRLPOOL_PROGRAM_ID
      );

      const client = buildWhirlpoolClient(ctx);

      const positionAddress = PDAUtil.getPosition(
        ORCA_WHIRLPOOL_PROGRAM_ID,
        new PublicKey(positionMint)
      );

      const position = await client.getPosition(positionAddress.publicKey);
      const whirlpoolAddress = position.getData().whirlpool;
      const whirlpool = await client.getPool(whirlpoolAddress);
      const txBuilder = await whirlpool.closePosition(
        positionAddress.publicKey,
        Percentage.fromFraction(1, 100)
      );
      const txPayload = await txBuilder[0].build();
      const txPayloadDecompiled = TransactionMessage.decompile(
        (txPayload.transaction as VersionedTransaction).message
      );
      const instructions = txPayloadDecompiled.instructions;
      const signers = txPayload.signers as Keypair[];

      const { blockhash } = await connection.getLatestBlockhash();

      const newMessage = new TransactionMessage({
        payerKey: keypair.publicKey,
        recentBlockhash: blockhash,
        instructions,
      }).compileToV0Message();

      const newTx = new VersionedTransaction(newMessage);

      newTx.sign(signers);

      const txId = await connection.sendTransaction(newTx, {
        maxRetries: 3,
      });

      return {
        txId,
      };
    } catch (error: any) {
      return {
        error: error.message,
      };
    }
  },
};
