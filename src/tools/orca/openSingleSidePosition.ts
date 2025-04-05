import {
  buildWhirlpoolClient,
  increaseLiquidityQuoteByInputToken,
  NO_TOKEN_EXTENSION_CONTEXT,
  ORCA_WHIRLPOOL_PROGRAM_ID,
  PriceMath,
  TokenExtensionContextForPool,
  WhirlpoolContext,
} from "@orca-so/whirlpools-sdk";
import { z } from "zod";
import bs58 from "bs58";
import { ENV } from "../../env";
import { RPC_URL } from "../../constants/rpc";
import {
  Connection,
  Keypair,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { Wallet } from "@coral-xyz/anchor";
import { Decimal } from "decimal.js";
import { Percentage } from "@orca-so/common-sdk";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

const OrcaOpenSingleSidePositionToolParams = z.object({
  whirlpoolAddress: z.string(),
  distanceFromCurrentPriceBps: z.number(),
  widthBps: z.number(),
  inputTokenMint: z.string(),
  inputAmount: z.number(),
});

export type OrcaOpenSingleSidePositionToolParams = z.infer<
  typeof OrcaOpenSingleSidePositionToolParams
>;

export const OrcaOpenSingleSidePositionTool = {
  name: "ORCA_OPEN_SINGLESIDE_POSITION",
  description: "Open a single-sided liquidity position in an Orca Whirlpool",
  parameters: {
    whirlpoolAddress: z.string(),
    distanceFromCurrentPriceBps: z.number(),
    widthBps: z.number(),
    inputTokenMint: z.string(),
    inputAmount: z.number(),
  },
  execute: async ({
    whirlpoolAddress,
    distanceFromCurrentPriceBps,
    widthBps,
    inputTokenMint,
    inputAmount,
  }: OrcaOpenSingleSidePositionToolParams) => {
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

      const whirlpool = await client.getPool(whirlpoolAddress);
      const whirlpoolData = whirlpool.getData();
      const mintInfoA = whirlpool.getTokenAInfo();
      const mintInfoB = whirlpool.getTokenBInfo();
      const price = PriceMath.sqrtPriceX64ToPrice(
        whirlpoolData.sqrtPrice,
        mintInfoA.decimals,
        mintInfoB.decimals
      );

      const isTokenA = new PublicKey(inputTokenMint).equals(mintInfoA.mint);
      let lowerBoundPrice;
      let upperBoundPrice;
      let lowerTick;
      let upperTick;
      if (isTokenA) {
        lowerBoundPrice = price.mul(1 + distanceFromCurrentPriceBps / 10000);
        upperBoundPrice = lowerBoundPrice.mul(1 + widthBps / 10000);
        upperTick = PriceMath.priceToInitializableTickIndex(
          upperBoundPrice,
          mintInfoA.decimals,
          mintInfoB.decimals,
          whirlpoolData.tickSpacing
        );
        lowerTick = PriceMath.priceToInitializableTickIndex(
          lowerBoundPrice,
          mintInfoA.decimals,
          mintInfoB.decimals,
          whirlpoolData.tickSpacing
        );
      } else {
        lowerBoundPrice = price.mul(1 - distanceFromCurrentPriceBps / 10000);
        upperBoundPrice = lowerBoundPrice.mul(1 - widthBps / 10000);
        lowerTick = PriceMath.priceToInitializableTickIndex(
          upperBoundPrice,
          mintInfoA.decimals,
          mintInfoB.decimals,
          whirlpoolData.tickSpacing
        );
        upperTick = PriceMath.priceToInitializableTickIndex(
          lowerBoundPrice,
          mintInfoA.decimals,
          mintInfoB.decimals,
          whirlpoolData.tickSpacing
        );
      }

      const txBuilderTickArrays = await whirlpool.initTickArrayForTicks([
        lowerTick,
        upperTick,
      ]);
      let instructions: TransactionInstruction[] = [];
      let signers: Keypair[] = [];
      if (txBuilderTickArrays !== null) {
        const txPayloadTickArrays = await txBuilderTickArrays.build();
        const txPayloadTickArraysDecompiled = TransactionMessage.decompile(
          (txPayloadTickArrays.transaction as VersionedTransaction).message
        );
        instructions = instructions.concat(
          txPayloadTickArraysDecompiled.instructions
        );
        signers = signers.concat(txPayloadTickArrays.signers as Keypair[]);
      }

      const tokenExtensionCtx: TokenExtensionContextForPool = {
        ...NO_TOKEN_EXTENSION_CONTEXT,
        tokenMintWithProgramA: mintInfoA,
        tokenMintWithProgramB: mintInfoB,
      };
      const increaseLiquiditQuote = increaseLiquidityQuoteByInputToken(
        new PublicKey(inputTokenMint),
        new Decimal(inputAmount),
        lowerTick,
        upperTick,
        Percentage.fromFraction(1, 100),
        whirlpool,
        tokenExtensionCtx
      );
      const { positionMint, tx: txBuilder } =
        await whirlpool.openPositionWithMetadata(
          lowerTick,
          upperTick,
          increaseLiquiditQuote,
          undefined,
          undefined,
          undefined,
          TOKEN_2022_PROGRAM_ID
        );

      const txPayload = await txBuilder.build();
      const txPayloadDecompiled = TransactionMessage.decompile(
        (txPayload.transaction as VersionedTransaction).message
      );
      instructions = instructions.concat(txPayloadDecompiled.instructions);
      signers = signers.concat(txPayload.signers as Keypair[]);

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
        positionMint: positionMint.toBase58(),
      };
    } catch (error: any) {
      return {
        error: error.message,
      };
    }
  },
};
