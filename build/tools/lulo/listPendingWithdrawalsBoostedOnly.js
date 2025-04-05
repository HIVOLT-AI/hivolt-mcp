"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuloListPendingWithdrawalsBoostedOnlyTool = void 0;
exports.lulo_list_pending_withdrawals_boosted_only = lulo_list_pending_withdrawals_boosted_only;
const bytes_1 = require("@coral-xyz/anchor/dist/cjs/utils/bytes");
const web3_js_1 = require("@solana/web3.js");
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../../env");
const lulo_1 = require("../../constants/lulo");
exports.LuloListPendingWithdrawalsBoostedOnlyTool = {
    name: "LULO_LIST_PENDING_WITHDRAWALS_BOOSTED_ONLY",
    description: "List pending withdrawals boosted only",
    parameters: {},
    execute: async () => {
        const secretKey = bytes_1.bs58.decode(env_1.ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
        const keypair = web3_js_1.Keypair.fromSecretKey(secretKey);
        return await lulo_list_pending_withdrawals_boosted_only(keypair);
    },
};
async function lulo_list_pending_withdrawals_boosted_only(accountKeypair) {
    try {
        const client = axios_1.default.create({
            baseURL: lulo_1.LULO_API_URI,
        });
        const response = await client.get(`/v1/account.withdrawals.listPendingWithdrawals?owner=${accountKeypair.publicKey.toBase58()}`, {
            headers: {
                "Content-Type": "application/json",
                "x-api-key": env_1.ENV.LULO_API_KEY ?? "",
            },
        });
        const result = response.data;
        return result;
    }
    catch (error) {
        throw new Error(`Failed to list pending withdrawals: ${error.message}`);
    }
}
// {
//   "pendingWithdrawals": [
//     {
//       "owner": "9vL5L3AgznV3Uz474mEhT3oH95C3ApFWgSAHyiBh5fE8",
//       "withdrawalId": 17,
//       "nativeAmount": "2500001",
//       "createdTimestamp": 1742911049,
//       "cooldownSeconds": "86400",
//       "mintAddress": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
//     }
//   ]
// }
//# sourceMappingURL=listPendingWithdrawalsBoostedOnly.js.map