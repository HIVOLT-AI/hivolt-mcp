"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolayerStakeWithSolayerTool = void 0;
const web3_js_1 = require("@solana/web3.js");
const axios_1 = __importDefault(require("axios"));
const zod_1 = require("zod");
const bs58_1 = __importDefault(require("bs58"));
const env_1 = require("../../env");
const rpc_1 = require("../../constants/rpc");
const solayer_1 = require("../../constants/solayer");
const SolayerStakeWithSolayerToolParams = zod_1.z.object({
    amount: zod_1.z.string(),
});
exports.SolayerStakeWithSolayerTool = {
    name: "SOLAYER_STAKE_SOL",
    description: "Stake SOL with Solayer.",
    parameters: {
        amount: zod_1.z.string(),
    },
    execute: async ({ amount }) => {
        try {
            const secretKey = bs58_1.default.decode(env_1.ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
            const connection = new web3_js_1.Connection(rpc_1.RPC_URL.HELIUS);
            const keypair = web3_js_1.Keypair.fromSecretKey(secretKey);
            const client = axios_1.default.create({
                baseURL: solayer_1.SOLAYER_API_URI,
            });
            const response = await client.post(`/api/action/restake/ssol?amount=${amount}`, {
                account: keypair.publicKey.toBase58(),
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
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
            return { txId };
        }
        catch (error) {
            return error.message;
        }
    },
};
//# sourceMappingURL=stakeWithSolayer.js.map