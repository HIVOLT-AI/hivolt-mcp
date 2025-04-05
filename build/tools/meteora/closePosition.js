"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeteoraClosePositionTool = void 0;
exports.meteora_close_position = meteora_close_position;
const bytes_1 = require("@coral-xyz/anchor/dist/cjs/utils/bytes");
const web3_js_1 = require("@solana/web3.js");
const rpc_1 = require("../../constants/rpc");
const env_1 = require("../../env");
const zod_1 = require("zod");
const dlmm_1 = __importDefault(require("@meteora-ag/dlmm"));
const MeteoraClosePositionToolParams = zod_1.z.object({
    poolAddress: zod_1.z.string(),
    positionAddress: zod_1.z.string(),
});
exports.MeteoraClosePositionTool = {
    name: "METEORA_CLOSE_POSITION",
    description: "Close DLMM position",
    parameters: {
        poolAddress: zod_1.z.string(),
        positionAddress: zod_1.z.string(),
    },
    execute: async (input) => {
        const secretKey = bytes_1.bs58.decode(env_1.ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
        const connection = new web3_js_1.Connection(rpc_1.RPC_URL.HELIUS);
        const keypair = web3_js_1.Keypair.fromSecretKey(secretKey);
        return await meteora_close_position(keypair, connection, input.poolAddress, input.positionAddress);
    },
};
async function meteora_close_position(accountKeypair, connection, poolAddress, positionAddress) {
    try {
        const pool = new web3_js_1.PublicKey(poolAddress);
        const dlmmPool = await dlmm_1.default.create(connection, pool);
        const position = await dlmmPool.getPosition(new web3_js_1.PublicKey(positionAddress));
        const closePositionTx = await dlmmPool.closePosition({
            owner: accountKeypair.publicKey,
            position: position,
        });
        const instructions = closePositionTx.instructions;
        const { blockhash } = await connection.getLatestBlockhash();
        const newMessage = new web3_js_1.TransactionMessage({
            payerKey: accountKeypair.publicKey,
            recentBlockhash: blockhash,
            instructions,
        }).compileToV0Message();
        const newTx = new web3_js_1.VersionedTransaction(newMessage);
        newTx.sign([accountKeypair]);
        const txId = await connection.sendTransaction(newTx, {
            maxRetries: 3,
        });
        return { txId };
    }
    catch (error) {
        throw new Error(`Failed to close DLMM position: ${error.message}`);
    }
}
// https://github.com/MeteoraAg/dlmm-sdk/tree/main/ts-client
//# sourceMappingURL=closePosition.js.map