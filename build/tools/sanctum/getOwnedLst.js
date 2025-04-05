"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SanctumGetOwnedLST = void 0;
const zod_1 = require("zod");
const bs58_1 = __importDefault(require("bs58"));
const env_1 = require("../../env");
const rpc_1 = require("../../constants/rpc");
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const axios_1 = __importDefault(require("axios"));
const sanctum_1 = require("../../constants/sanctum");
const SanctumGetOwnedLSTParams = zod_1.z.object({});
exports.SanctumGetOwnedLST = {
    name: "SANCTUM_GET_OWNED_LST",
    description: "Get the list of LSTs owned by the user",
    parameters: {},
    execute: async () => {
        try {
            const secretKey = bs58_1.default.decode(env_1.ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
            const connection = new web3_js_1.Connection(rpc_1.RPC_URL.HELIUS);
            const keypair = web3_js_1.Keypair.fromSecretKey(secretKey);
            const [tokenAccountData] = await Promise.all([
                connection.getParsedTokenAccountsByOwner(keypair.publicKey, {
                    programId: spl_token_1.TOKEN_PROGRAM_ID,
                }),
            ]);
            const removedZeroBalance = tokenAccountData.value.filter((v) => v.account.data.parsed.info.tokenAmount.uiAmount !== 0);
            const tokens = await Promise.all(removedZeroBalance.map(async (v) => {
                return {
                    tokenAddress: v.account.data.parsed.info.mint,
                    decimals: v.account.data.parsed.info.tokenAmount.decimals,
                    balance: v.account.data.parsed.info.tokenAmount.uiAmount,
                };
            }));
            const lsts = tokens.filter((token) => {
                return token.decimals === 9;
            });
            const addresses = lsts.map((token) => token.tokenAddress);
            const client = axios_1.default.create({
                baseURL: sanctum_1.SANCTUM_STAT_API_URI,
            });
            const response = await client.get("/v1/sol-value/current", {
                params: {
                    lst: addresses,
                },
                paramsSerializer: (params) => {
                    return params.lst.map((value) => `lst=${value}`).join("&");
                },
            });
            const result = Object.keys(response.data.solValues);
            const lstsWithValue = lsts.filter((lst) => {
                return result.includes(lst.tokenAddress);
            });
            return lstsWithValue;
        }
        catch (error) {
            return error.message;
        }
    },
};
//# sourceMappingURL=getOwnedLst.js.map