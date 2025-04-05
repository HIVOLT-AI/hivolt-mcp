"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrcaOpenCenterPositionTool = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const bs58_1 = __importDefault(require("bs58"));
const whirlpools_sdk_1 = require("@orca-so/whirlpools-sdk");
const web3_js_1 = require("@solana/web3.js");
const rpc_1 = require("../../constants/rpc");
const env_1 = require("../../env");
const zod_1 = require("zod");
const decimal_js_1 = require("decimal.js");
const common_sdk_1 = require("@orca-so/common-sdk");
const spl_token_1 = require("@solana/spl-token");
const OrcaOpenCenterPositionToolParams = zod_1.z.object({
    whirlpoolAddress: zod_1.z.string(),
    priceOffsetBps: zod_1.z.number(),
    inputTokenMint: zod_1.z.string(),
    inputAmount: zod_1.z.number(),
});
exports.OrcaOpenCenterPositionTool = {
    name: "ORCA_OPEN_CENTER_POSITION",
    description: "Open a center position in the Orca pool",
    parameters: {
        whirlpoolAddress: zod_1.z.string(),
        priceOffsetBps: zod_1.z.number(),
        inputTokenMint: zod_1.z.string(),
        inputAmount: zod_1.z.number(),
    },
    execute: async ({ whirlpoolAddress, priceOffsetBps, inputAmount, inputTokenMint, }) => {
        try {
            const secretKey = bs58_1.default.decode(env_1.ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
            const connection = new web3_js_1.Connection(rpc_1.RPC_URL.HELIUS);
            const keypair = web3_js_1.Keypair.fromSecretKey(secretKey);
            const wallet = new anchor_1.Wallet(keypair);
            const ctx = whirlpools_sdk_1.WhirlpoolContext.from(connection, wallet, whirlpools_sdk_1.ORCA_WHIRLPOOL_PROGRAM_ID);
            const client = (0, whirlpools_sdk_1.buildWhirlpoolClient)(ctx);
            const whirlpool = await client.getPool(whirlpoolAddress);
            const whirlpoolData = whirlpool.getData();
            const mintInfoA = whirlpool.getTokenAInfo();
            const mintInfoB = whirlpool.getTokenBInfo();
            const price = whirlpools_sdk_1.PriceMath.sqrtPriceX64ToPrice(whirlpoolData.sqrtPrice, mintInfoA.decimals, mintInfoB.decimals);
            const lowerPrice = price.mul(1 - priceOffsetBps / 10000);
            const upperPrice = price.mul(1 + priceOffsetBps / 10000);
            const lowerTick = whirlpools_sdk_1.PriceMath.priceToInitializableTickIndex(lowerPrice, mintInfoA.decimals, mintInfoB.decimals, whirlpoolData.tickSpacing);
            const upperTick = whirlpools_sdk_1.PriceMath.priceToInitializableTickIndex(upperPrice, mintInfoA.decimals, mintInfoB.decimals, whirlpoolData.tickSpacing);
            const txBuilderTickArrays = await whirlpool.initTickArrayForTicks([
                lowerTick,
                upperTick,
            ]);
            let instructions = [];
            let signers = [];
            if (txBuilderTickArrays !== null) {
                const txPayloadTickArrays = await txBuilderTickArrays.build();
                const txPayloadTickArraysDecompiled = web3_js_1.TransactionMessage.decompile(txPayloadTickArrays.transaction.message);
                const instructionsTickArrays = txPayloadTickArraysDecompiled.instructions;
                instructions = instructions.concat(instructionsTickArrays);
                signers = signers.concat(txPayloadTickArrays.signers);
            }
            const tokenExtensionCtx = {
                ...whirlpools_sdk_1.NO_TOKEN_EXTENSION_CONTEXT,
                tokenMintWithProgramA: mintInfoA,
                tokenMintWithProgramB: mintInfoB,
            };
            const increaseLiquiditQuote = (0, whirlpools_sdk_1.increaseLiquidityQuoteByInputToken)(new web3_js_1.PublicKey(inputTokenMint), new decimal_js_1.Decimal(inputAmount), lowerTick, upperTick, common_sdk_1.Percentage.fromFraction(1, 100), whirlpool, tokenExtensionCtx);
            const { positionMint, tx: txBuilder } = await whirlpool.openPositionWithMetadata(lowerTick, upperTick, increaseLiquiditQuote, undefined, undefined, undefined, spl_token_1.TOKEN_2022_PROGRAM_ID);
            const txPayload = await txBuilder.build();
            const txPayloadDecompiled = web3_js_1.TransactionMessage.decompile(txPayload.transaction.message);
            instructions = instructions.concat(txPayloadDecompiled.instructions);
            signers = signers.concat(txPayload.signers);
            const { blockhash } = await connection.getLatestBlockhash();
            const newMessage = new web3_js_1.TransactionMessage({
                payerKey: keypair.publicKey,
                recentBlockhash: blockhash,
                instructions,
            }).compileToV0Message();
            const newTx = new web3_js_1.VersionedTransaction(newMessage);
            newTx.sign(signers);
            const txId = await connection.sendTransaction(newTx, {
                maxRetries: 3,
            });
            return {
                txId,
                positionMint: positionMint.toBase58(),
            };
        }
        catch (error) {
            return {
                error: error.message,
            };
        }
    },
};
//# sourceMappingURL=openCenterPosition.js.map