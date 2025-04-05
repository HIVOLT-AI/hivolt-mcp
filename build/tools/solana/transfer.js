"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaTransferTool = void 0;
const web3_js_1 = require("@solana/web3.js");
const chain_1 = require("../../types/chain");
const zod_1 = require("zod");
const bs58_1 = __importDefault(require("bs58"));
const env_1 = require("../../env");
const rpc_1 = require("../../constants/rpc");
const SolanaTransferToolParams = zod_1.z.object({
    to: zod_1.z.string(),
    amount: zod_1.z.number(),
    network: chain_1.NetworkSchema,
});
exports.SolanaTransferTool = {
    name: "SOLANA_TRANSFER",
    description: "Transfer SOL to another address on Solana",
    parameters: {
        to: zod_1.z.string(),
        amount: zod_1.z.number(),
        network: chain_1.NetworkSchema,
    },
    execute: async ({ to, amount, network }) => {
        try {
            const secretKey = bs58_1.default.decode(env_1.ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
            const connection = new web3_js_1.Connection(rpc_1.RPC_URL.HELIUS);
            const keypair = web3_js_1.Keypair.fromSecretKey(secretKey);
            const transaction = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.transfer({
                fromPubkey: keypair.publicKey,
                toPubkey: new web3_js_1.PublicKey(to),
                lamports: amount * web3_js_1.LAMPORTS_PER_SOL,
            }));
            const txId = await connection.sendTransaction(transaction, [keypair], {
                maxRetries: 3,
            });
            return txId;
        }
        catch (error) {
            return error.message;
        }
    },
};
//# sourceMappingURL=transfer.js.map