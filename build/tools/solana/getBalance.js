"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaGetBalanceTool = void 0;
const zod_1 = require("zod");
const bs58_1 = __importDefault(require("bs58"));
const web3_js_1 = require("@solana/web3.js");
const rpc_1 = require("../../constants/rpc");
const env_1 = require("../../env");
const SolanaGetBalanceToolParams = zod_1.z.object({});
exports.SolanaGetBalanceTool = {
    name: "SOLANA_GET_BALANCE",
    description: "Get the balance of SOL in the account",
    parameters: {},
    execute: async ({}) => {
        try {
            const secretKey = bs58_1.default.decode(env_1.ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
            const connection = new web3_js_1.Connection(rpc_1.RPC_URL.HELIUS);
            const keypair = web3_js_1.Keypair.fromSecretKey(secretKey);
            const balance = await connection.getBalance(keypair.publicKey);
            return balance;
        }
        catch (error) {
            return error.message;
        }
    },
};
//# sourceMappingURL=getBalance.js.map