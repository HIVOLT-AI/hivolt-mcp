"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrcaCreateClmmTool = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const whirlpools_sdk_1 = require("@orca-so/whirlpools-sdk");
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
const rpc_1 = require("../../constants/rpc");
const env_1 = require("../../env");
const zod_1 = require("zod");
const decimal_js_1 = require("decimal.js");
const orca_1 = require("../../constants/orca");
const OrcaCreateClmmToolParams = zod_1.z.object({
    mint: zod_1.z.string(),
    pair: zod_1.z.string(),
    initialPrice: zod_1.z.number().positive(),
    feeTier: zod_1.z.number().positive(),
    network: zod_1.z.string(),
});
exports.OrcaCreateClmmTool = {
    name: "ORCA_CREATE_CLMM",
    description: "Create a new Orca CLMM liquidity pool on Solana with Orca",
    parameters: {
        mint: zod_1.z.string(),
        pair: zod_1.z.string(),
        initialPrice: zod_1.z.number().positive(),
        feeTier: zod_1.z.number().positive(),
        network: zod_1.z.string(),
    },
    execute: async ({ mint, pair, initialPrice, feeTier, network, }) => {
        try {
            const secretKey = bs58_1.default.decode(env_1.ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
            const connection = new web3_js_1.Connection(rpc_1.RPC_URL.HELIUS);
            const keypair = web3_js_1.Keypair.fromSecretKey(secretKey);
            let initialPriceDecimal = new decimal_js_1.Decimal(initialPrice);
            const configAddress = network === "Mainnet"
                ? new web3_js_1.PublicKey("2LecshUwdy9xi7meFgHtFJQNSKk4KdTrcpvaB56dP2NQ")
                : new web3_js_1.PublicKey("FcrweFY1G9HJAHG5inkGB6pKg1HZ6x9UC2WioAfWrGkR");
            const wallet = new anchor_1.Wallet(keypair);
            const ctx = whirlpools_sdk_1.WhirlpoolContext.from(connection, wallet, whirlpools_sdk_1.ORCA_WHIRLPOOL_PROGRAM_ID);
            const fetcher = ctx.fetcher;
            const client = (0, whirlpools_sdk_1.buildWhirlpoolClient)(ctx);
            const correctTokenOrder = whirlpools_sdk_1.PoolUtil.orderMints(new web3_js_1.PublicKey(mint), new web3_js_1.PublicKey(pair)).map((addr) => addr.toString());
            const isCorrectMintOrder = correctTokenOrder[0] === new web3_js_1.PublicKey(mint).toString();
            let mintA;
            let mintB;
            if (!isCorrectMintOrder) {
                [mintA, mintB] = [new web3_js_1.PublicKey(pair), new web3_js_1.PublicKey(mint)];
                initialPriceDecimal = new decimal_js_1.Decimal(1 / initialPriceDecimal.toNumber());
            }
            else {
                [mintA, mintB] = [new web3_js_1.PublicKey(mint), new web3_js_1.PublicKey(pair)];
            }
            const mintAAccount = await fetcher.getMintInfo(mintA);
            const mintBAccount = await fetcher.getMintInfo(mintB);
            if (mintAAccount === null || mintBAccount === null) {
                throw Error("Mint account not found");
            }
            const tickSpacing = orca_1.ORCA_FEE_TIER[feeTier];
            const initialTick = whirlpools_sdk_1.PriceMath.priceToInitializableTickIndex(initialPriceDecimal, mintAAccount.decimals, mintBAccount.decimals, tickSpacing);
            const { poolKey, tx: txBuilder } = await client.createPool(configAddress, mintA, mintB, tickSpacing, initialTick, wallet.publicKey);
            const txPayload = await txBuilder.build();
            const txPayloadDecompiled = web3_js_1.TransactionMessage.decompile(txPayload.transaction.message);
            const instructions = txPayloadDecompiled.instructions;
            const { blockhash } = await connection.getLatestBlockhash();
            const newMessage = new web3_js_1.TransactionMessage({
                payerKey: keypair.publicKey,
                recentBlockhash: blockhash,
                instructions,
            }).compileToV0Message();
            const newTx = new web3_js_1.VersionedTransaction(newMessage);
            newTx.sign([keypair]);
            const txId = await connection.sendTransaction(newTx, {
                maxRetries: 3,
            });
            return {
                txId,
                poolAddress: poolKey.toBase58(),
            };
        }
        catch (error) {
            return {
                error: error.message,
            };
        }
    },
};
//# sourceMappingURL=createClmm.js.map