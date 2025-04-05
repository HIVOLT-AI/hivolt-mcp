"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuloGetAccountTool = void 0;
exports.lulo_get_account = lulo_get_account;
const bytes_1 = require("@coral-xyz/anchor/dist/cjs/utils/bytes");
const web3_js_1 = require("@solana/web3.js");
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../../env");
const lulo_1 = require("../../constants/lulo");
exports.LuloGetAccountTool = {
    name: "LULO_GET_ACCOUNT",
    description: "Get Lulo account information",
    parameters: {},
    execute: async () => {
        const secretKey = bytes_1.bs58.decode(env_1.ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
        const keypair = web3_js_1.Keypair.fromSecretKey(secretKey);
        return await lulo_get_account(keypair);
    },
};
async function lulo_get_account(accountKeypair) {
    try {
        const client = axios_1.default.create({
            baseURL: lulo_1.LULO_API_URI,
        });
        const response = await client.get(`/v1/account.getAccount?owner=${accountKeypair.publicKey.toBase58()}`, {
            headers: {
                "Content-Type": "application/json",
                "x-api-key": env_1.ENV.LULO_API_KEY ?? "",
            },
        });
        const result = response.data;
        return result;
    }
    catch (error) {
        throw new Error(`Failed to get account: ${error.message}`);
    }
}
// LuloAccountData
//
// {
//   "totalUsdValue": 0,
//     "lusdUsdBalance": 0,
//       "pusdUsdBalance": 0,
//         "maxWithdrawable": {
//     "protected": {
//       "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": 0
//     },
//     "regular": {
//       "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": 0
//     }
//   },
//   "totalInterestEarned": 0,
//   "protectedInterestEarned": 0,
//   "regularInterestEarned": 0,
//   "blockTime": 1743475802
// }
//# sourceMappingURL=getAccount.js.map