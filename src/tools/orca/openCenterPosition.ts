import { Wallet } from "@coral-xyz/anchor";
import bs58 from "bs58";
import {
  buildWhirlpoolClient,
  increaseLiquidityQuoteByInputToken,
  NO_TOKEN_EXTENSION_CONTEXT,
  ORCA_WHIRLPOOL_PROGRAM_ID,
  PriceMath,
  TokenExtensionContextForPool,
  WhirlpoolContext,
} from "@orca-so/whirlpools-sdk";
import {
  Connection,
  Keypair,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { RPC_URL } from "../../constants/rpc";
import { ENV } from "../../env";
import { z } from "zod";
import { Decimal } from "decimal.js";
import { Percentage } from "@orca-so/common-sdk";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

const OrcaOpenCenterPositionToolParams = z.object({
  whirlpoolAddress: z.string(),
  priceOffsetBps: z.number(),
  inputTokenMint: z.string(),
  inputAmount: z.number(),
});

export type OrcaOpenCenterPositionToolParams = z.infer<
  typeof OrcaOpenCenterPositionToolParams
>;

export const OrcaOpenCenterPositionTool = {
  name: "ORCA_OPEN_CENTER_POSITION",
  description: "Open a center position in the Orca pool",
  parameters: {
    whirlpoolAddress: z.string(),
    priceOffsetBps: z.number(),
    inputTokenMint: z.string(),
    inputAmount: z.number(),
  },
  execute: async ({
    whirlpoolAddress,
    priceOffsetBps,
    inputAmount,
    inputTokenMint,
  }: OrcaOpenCenterPositionToolParams) => {
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

      const lowerPrice = price.mul(1 - priceOffsetBps / 10000);
      const upperPrice = price.mul(1 + priceOffsetBps / 10000);
      const lowerTick = PriceMath.priceToInitializableTickIndex(
        lowerPrice,
        mintInfoA.decimals,
        mintInfoB.decimals,
        whirlpoolData.tickSpacing
      );
      const upperTick = PriceMath.priceToInitializableTickIndex(
        upperPrice,
        mintInfoA.decimals,
        mintInfoB.decimals,
        whirlpoolData.tickSpacing
      );

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
        const instructionsTickArrays =
          txPayloadTickArraysDecompiled.instructions;
        instructions = instructions.concat(instructionsTickArrays);
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
