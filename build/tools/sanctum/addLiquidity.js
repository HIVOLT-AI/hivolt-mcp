"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SanctumAddLiquidityTool = void 0;
const web3_js_1 = require("@solana/web3.js");
const axios_1 = __importDefault(require("axios"));
const sanctum_1 = require("../../constants/sanctum");
const zod_1 = require("zod");
const bs58_1 = __importDefault(require("bs58"));
const env_1 = require("../../env");
const rpc_1 = require("../../constants/rpc");
const SanctumAddLiquidityToolParams = zod_1.z.object({
    lstMint: zod_1.z.string(),
    amount: zod_1.z.string(),
    quotedAmount: zod_1.z.string(),
    priorityFee: zod_1.z.number(),
});
exports.SanctumAddLiquidityTool = {
    name: "SANCTUM_ADD_LIQUIDITY",
    description: "Add liquidity to sanctum infinite pool with specified token parameters.",
    parameters: {
        lstMint: zod_1.z.string(),
        amount: zod_1.z.string(),
        quotedAmount: zod_1.z.string(),
        priorityFee: zod_1.z.number(),
    },
    execute: async ({ lstMint, amount, quotedAmount, priorityFee, }) => {
        try {
            const secretKey = bs58_1.default.decode(env_1.ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
            const connection = new web3_js_1.Connection(rpc_1.RPC_URL.HELIUS);
            const keypair = web3_js_1.Keypair.fromSecretKey(secretKey);
            const client = axios_1.default.create({
                baseURL: sanctum_1.SANCTUM_TRADE_API_URI,
            });
            const response = await client.post("/v1/liquidity/add", {
                amount,
                dstLstAcc: null,
                lstMint,
                priorityFee: {
                    Auto: {
                        max_unit_price_micro_lamports: priorityFee,
                        unit_limit: 300000,
                    },
                },
                quotedAmount,
                signer: keypair.publicKey.toBase58(),
                srcLstAcc: null,
            });
            const txBuffer = Buffer.from(response.data.tx, "base64");
            const { blockhash } = await connection.getLatestBlockhash();
            const tx = web3_js_1.VersionedTransaction.deserialize(txBuffer);
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
                payerKey: keypair.publicKey,
                recentBlockhash: blockhash,
                instructions,
            }).compileToV0Message();
            const newTx = new web3_js_1.VersionedTransaction(newMessage);
            newTx.sign([keypair]);
            const txId = await connection.sendTransaction(newTx, {
                maxRetries: 3,
            });
            return txId;
        }
        catch (error) {
            return error.message;
        }
    },
};
//# sourceMappingURL=addLiquidity.js.map