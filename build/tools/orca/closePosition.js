"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrcaClosePositionTool = void 0;
const zod_1 = require("zod");
const bs58_1 = __importDefault(require("bs58"));
const env_1 = require("../../env");
const web3_js_1 = require("@solana/web3.js");
const rpc_1 = require("../../constants/rpc");
const anchor_1 = require("@coral-xyz/anchor");
const whirlpools_sdk_1 = require("@orca-so/whirlpools-sdk");
const common_sdk_1 = require("@orca-so/common-sdk");
const OrcaClosePositionToolParams = zod_1.z.object({
    positionMint: zod_1.z.string(),
});
exports.OrcaClosePositionTool = {
    name: "ORCA_CLOSE_POSITION",
    description: "Close an existing Orca position in a liquidity pool and withdraw the funds.",
    parameters: {
        positionMint: zod_1.z.string(),
    },
    execute: async ({ positionMint }) => {
        try {
            const secretKey = bs58_1.default.decode(env_1.ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
            const connection = new web3_js_1.Connection(rpc_1.RPC_URL.HELIUS);
            const keypair = web3_js_1.Keypair.fromSecretKey(secretKey);
            const wallet = new anchor_1.Wallet(keypair);
            const ctx = whirlpools_sdk_1.WhirlpoolContext.from(connection, wallet, whirlpools_sdk_1.ORCA_WHIRLPOOL_PROGRAM_ID);
            const client = (0, whirlpools_sdk_1.buildWhirlpoolClient)(ctx);
            const positionAddress = whirlpools_sdk_1.PDAUtil.getPosition(whirlpools_sdk_1.ORCA_WHIRLPOOL_PROGRAM_ID, new web3_js_1.PublicKey(positionMint));
            const position = await client.getPosition(positionAddress.publicKey);
            const whirlpoolAddress = position.getData().whirlpool;
            const whirlpool = await client.getPool(whirlpoolAddress);
            const txBuilder = await whirlpool.closePosition(positionAddress.publicKey, common_sdk_1.Percentage.fromFraction(1, 100));
            const txPayload = await txBuilder[0].build();
            const txPayloadDecompiled = web3_js_1.TransactionMessage.decompile(txPayload.transaction.message);
            const instructions = txPayloadDecompiled.instructions;
            const signers = txPayload.signers;
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
            };
        }
        catch (error) {
            return {
                error: error.message,
            };
        }
    },
};
//# sourceMappingURL=closePosition.js.map