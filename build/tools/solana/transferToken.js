"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaTransferTokenTool = void 0;
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const chain_1 = require("../../types/chain");
const zod_1 = require("zod");
const bs58_1 = __importDefault(require("bs58"));
const env_1 = require("../../env");
const rpc_1 = require("../../constants/rpc");
const SolanaTransferTokenToolParams = zod_1.z.object({
    to: zod_1.z.string(),
    amount: zod_1.z.number(),
    network: chain_1.NetworkSchema,
    tokenAddress: zod_1.z.string(),
});
exports.SolanaTransferTokenTool = {
    name: "SOLANA_TRANSFER_TOKEN",
    description: "Transfer a SPL token to another address on Solana",
    parameters: {
        to: zod_1.z.string(),
        amount: zod_1.z.number(),
        network: chain_1.NetworkSchema,
        tokenAddress: zod_1.z.string(),
    },
    execute: async ({ to, amount, tokenAddress, }) => {
        try {
            const secretKey = bs58_1.default.decode(env_1.ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
            const connection = new web3_js_1.Connection(rpc_1.RPC_URL.HELIUS);
            const keypair = web3_js_1.Keypair.fromSecretKey(secretKey);
            const transaction = new web3_js_1.Transaction();
            const fromAta = await (0, spl_token_1.getAssociatedTokenAddress)(new web3_js_1.PublicKey(tokenAddress), keypair.publicKey);
            const toAta = await (0, spl_token_1.getAssociatedTokenAddress)(new web3_js_1.PublicKey(tokenAddress), new web3_js_1.PublicKey(to));
            try {
                await (0, spl_token_1.getAccount)(connection, toAta);
            }
            catch {
                // Error is thrown if the tokenAccount doesn't exist
                transaction.add((0, spl_token_1.createAssociatedTokenAccountInstruction)(keypair.publicKey, toAta, new web3_js_1.PublicKey(to), new web3_js_1.PublicKey(tokenAddress)));
            }
            const mintInfo = await (0, spl_token_1.getMint)(connection, new web3_js_1.PublicKey(tokenAddress));
            const adjustedAmount = amount * Math.pow(10, mintInfo.decimals);
            transaction.add((0, spl_token_1.createTransferInstruction)(fromAta, toAta, keypair.publicKey, adjustedAmount));
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
//# sourceMappingURL=transferToken.js.map