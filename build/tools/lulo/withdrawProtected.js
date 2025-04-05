"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuloWithdrawProtectedTool = void 0;
exports.lulo_withdraw_protected = lulo_withdraw_protected;
const bytes_1 = require("@coral-xyz/anchor/dist/cjs/utils/bytes");
const web3_js_1 = require("@solana/web3.js");
const axios_1 = __importDefault(require("axios"));
const rpc_1 = require("../../constants/rpc");
const env_1 = require("../../env");
const lulo_1 = require("../../constants/lulo");
const zod_1 = require("zod");
const LuloWithdrawProtectedToolParams = zod_1.z.object({
    mintAddress: zod_1.z.string(),
    amount: zod_1.z.number(),
});
exports.LuloWithdrawProtectedTool = {
    name: "LULO_WITHDRAW_PROTECTED",
    description: "Withdraw USDC from protected Lulo",
    parameters: {
        mintAddress: zod_1.z.string(),
        amount: zod_1.z.number(),
    },
    execute: async (input) => {
        const secretKey = bytes_1.bs58.decode(env_1.ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
        const connection = new web3_js_1.Connection(rpc_1.RPC_URL.HELIUS);
        const keypair = web3_js_1.Keypair.fromSecretKey(secretKey);
        return await lulo_withdraw_protected(keypair, connection, input.mintAddress, input.amount);
    },
};
async function lulo_withdraw_protected(accountKeypair, connection, mintAddress, amount) {
    try {
        const client = axios_1.default.create({
            baseURL: lulo_1.LULO_API_URI,
        });
        const response = await client.post("/v1/generate.transactions.withdrawProtected?priorityFee=500000", {
            owner: accountKeypair.publicKey.toBase58(),
            mintAddress: mintAddress, // USDC: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
            amount: amount,
        }, {
            headers: {
                "Content-Type": "application/json",
                "x-api-key": env_1.ENV.LULO_API_KEY ?? "",
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
        throw new Error(`Failed to withdraw USDC from protected Lulo: ${error.message}`);
    }
}
//# sourceMappingURL=withdrawProtected.js.map