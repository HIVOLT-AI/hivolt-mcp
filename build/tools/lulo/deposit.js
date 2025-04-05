"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuloDepositTool = void 0;
exports.lulo_deposit = lulo_deposit;
const bytes_1 = require("@coral-xyz/anchor/dist/cjs/utils/bytes");
const web3_js_1 = require("@solana/web3.js");
const axios_1 = __importDefault(require("axios"));
const rpc_1 = require("../../constants/rpc");
const env_1 = require("../../env");
const lulo_1 = require("../../constants/lulo");
const zod_1 = require("zod");
const LuloDepositToolParams = zod_1.z.object({
    mintAddress: zod_1.z.string(),
    protectedAmount: zod_1.z.number(),
    regularAmount: zod_1.z.number(),
});
exports.LuloDepositTool = {
    name: "LULO_DEPOSIT",
    description: "Deposit USDC to Lulo",
    parameters: {
        mintAddress: zod_1.z.string(),
        protectedAmount: zod_1.z.number(),
        regularAmount: zod_1.z.number(),
    },
    execute: async (input) => {
        const secretKey = bytes_1.bs58.decode(env_1.ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
        const connection = new web3_js_1.Connection(rpc_1.RPC_URL.HELIUS);
        const keypair = web3_js_1.Keypair.fromSecretKey(secretKey);
        return await lulo_deposit(keypair, connection, input.mintAddress, input.protectedAmount, input.regularAmount);
    },
};
async function lulo_deposit(accountKeypair, connection, mintAddress, protectedAmount, regularAmount) {
    try {
        const client = axios_1.default.create({
            baseURL: lulo_1.LULO_API_URI,
        });
        const response = await client.post("/v1/generate.transactions.deposit?priorityFee=500000", {
            owner: accountKeypair.publicKey.toBase58(),
            mintAddress: mintAddress, // USDC: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
            protectedAmount: protectedAmount ?? 0,
            regularAmount: regularAmount ?? 0,
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
        throw new Error(`Failed to deposit USDC to Lulo: ${error.message}`);
    }
}
//# sourceMappingURL=deposit.js.map