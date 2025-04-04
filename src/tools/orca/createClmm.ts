import { Wallet } from "@coral-xyz/anchor";
import {
  buildWhirlpoolClient,
  ORCA_WHIRLPOOL_PROGRAM_ID,
  PoolUtil,
  PriceMath,
  WhirlpoolContext,
} from "@orca-so/whirlpools-sdk";
import {
  Connection,
  Keypair,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import { RPC_URL } from "src/constants/rpc";
import { ENV } from "src/env";
import { z } from "zod";
import { Decimal } from "decimal.js";
import { ORCA_FEE_TIER } from "src/constants/orca";

const OrcaCreateClmmToolParams = z.object({
  mint: z.string(),
  pair: z.string(),
  initialPrice: z.number().positive(),
  feeTier: z.number().positive(),
  network: z.string(),
});

export type OrcaCreateClmmToolParams = z.infer<typeof OrcaCreateClmmToolParams>;

export const OrcaCreateClmmTool = {
  name: "ORCA_CREATE_CLMM",
  description: "Create a new Orca CLMM liquidity pool on Solana with Orca",
  parameters: {
    mint: z.string(),
    pair: z.string(),
    initialPrice: z.number().positive(),
    feeTier: z.number().positive(),
    network: z.string(),
  },
  execute: async ({
    mint,
    pair,
    initialPrice,
    feeTier,
    network,
  }: OrcaCreateClmmToolParams) => {
    try {
      const secretKey = bs58.decode(ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
      const connection = new Connection(RPC_URL.HELIUS);
      const keypair = Keypair.fromSecretKey(secretKey);
      let initialPriceDecimal = new Decimal(initialPrice);

      const configAddress =
        network === "Mainnet"
          ? new PublicKey("2LecshUwdy9xi7meFgHtFJQNSKk4KdTrcpvaB56dP2NQ")
          : new PublicKey("FcrweFY1G9HJAHG5inkGB6pKg1HZ6x9UC2WioAfWrGkR");

      const wallet = new Wallet(keypair);

      const ctx = WhirlpoolContext.from(
        connection,
        wallet,
        ORCA_WHIRLPOOL_PROGRAM_ID
      );

      const fetcher = ctx.fetcher;
      const client = buildWhirlpoolClient(ctx);

      const correctTokenOrder = PoolUtil.orderMints(
        new PublicKey(mint),
        new PublicKey(pair)
      ).map((addr) => addr.toString());
      const isCorrectMintOrder =
        correctTokenOrder[0] === new PublicKey(mint).toString();
      let mintA;
      let mintB;
      if (!isCorrectMintOrder) {
        [mintA, mintB] = [new PublicKey(pair), new PublicKey(mint)];
        initialPriceDecimal = new Decimal(1 / initialPriceDecimal.toNumber());
      } else {
        [mintA, mintB] = [new PublicKey(mint), new PublicKey(pair)];
      }
      const mintAAccount = await fetcher.getMintInfo(mintA);
      const mintBAccount = await fetcher.getMintInfo(mintB);
      if (mintAAccount === null || mintBAccount === null) {
        throw Error("Mint account not found");
      }

      const tickSpacing = ORCA_FEE_TIER[feeTier as keyof typeof ORCA_FEE_TIER];
      const initialTick = PriceMath.priceToInitializableTickIndex(
        initialPriceDecimal,
        mintAAccount.decimals,
        mintBAccount.decimals,
        tickSpacing
      );
      const { poolKey, tx: txBuilder } = await client.createPool(
        configAddress,
        mintA,
        mintB,
        tickSpacing,
        initialTick,
        wallet.publicKey
      );

      const txPayload = await txBuilder.build();
      const txPayloadDecompiled = TransactionMessage.decompile(
        (txPayload.transaction as VersionedTransaction).message
      );

      const instructions = txPayloadDecompiled.instructions;
      const { blockhash } = await connection.getLatestBlockhash();

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

      return {
        txId,
        poolAddress: poolKey.toBase58(),
      };
    } catch (error: any) {
      return {
        error: error.message,
      };
    }
  },
};
