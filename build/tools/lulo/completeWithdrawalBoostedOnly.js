"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuloCompleteWithdrawalBoostedOnlyTool = void 0;
const bytes_1 = require("@coral-xyz/anchor/dist/cjs/utils/bytes");
const web3_js_1 = require("@solana/web3.js");
const axios_1 = __importDefault(require("axios"));
const rpc_1 = require("../../constants/rpc");
const env_1 = require("../../env");
const lulo_1 = require("../../constants/lulo");
const zod_1 = require("zod");
const LuloCompleteWithdrawalBoostedOnlyToolParams = zod_1.z.object({
    pendingWithdrawalId: zod_1.z.number(),
});
exports.LuloCompleteWithdrawalBoostedOnlyTool = {
    name: "LULO_COMPLETE_WITHDRAWAL_BOOSTED_ONLY",
    description: "Complete withdrawal boosted only",
    parameters: {
        pendingWithdrawalId: zod_1.z.number(),
    },
    execute: async (input) => {
        const secretKey = bytes_1.bs58.decode(env_1.ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
        const connection = new web3_js_1.Connection(rpc_1.RPC_URL.HELIUS);
        const keypair = web3_js_1.Keypair.fromSecretKey(secretKey);
        return await lulo_complete_withdrawal_boosted_only(keypair, connection, input.pendingWithdrawalId);
    },
};
async function lulo_complete_withdrawal_boosted_only(accountKeypair, connection, pendingWithdrawalId) {
    try {
        const client = axios_1.default.create({
            baseURL: lulo_1.LULO_API_URI,
        });
        const response = await client.post("/v1/generate.transactions.completeRegularWithdrawal?priorityFee=500000", {
            owner: accountKeypair.publicKey.toBase58(),
            pendingWithdrawalId: pendingWithdrawalId,
        }, {
            headers: {
                "Content-Type": "application/json",
                "x-api-key": env_1.ENV.LULO_API_KEY,
            },
        });
        const txBuffer = Buffer.from(response.data.trasnaction, "base64");
        const tx = web3_js_1.VersionedTransaction.deserialize(txBuffer);
        const { blockhash } = await connection.getLatestBlockhash();
        const messages = tx.message;
        const instructions = messages.compiledInstructions.map((ix) => {
            return new web3_js_1.TransactionInstruction({
                programId: messages.staticAccountKeys[ix.programIdIndex],
                keys: ix.accountKeyIndexes.map((i) => ({
                    pubkey: messages.staticAccountKeys[i],
                    isSigner: messages.isAccountSigner(i),
                    isWritable: messages.isAccountWritable(i),
                })),
                data: Buffer.from(ix.data, "base64"),
            });
        });
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
        throw new Error(`Failed to complete withdrawal boosted only: ${error.message}`);
    }
}
//# sourceMappingURL=completeWithdrawalBoostedOnly.js.map