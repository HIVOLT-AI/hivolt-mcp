"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaGetTokenBalanceTool = void 0;
const zod_1 = require("zod");
const bs58_1 = __importDefault(require("bs58"));
const web3_js_1 = require("@solana/web3.js");
const rpc_1 = require("../../constants/rpc");
const env_1 = require("../../env");
const spl_token_1 = require("@solana/spl-token");
const solana_1 = require("../../helpers/solana");
const SolanaGetTokenBalanceToolParams = zod_1.z.object({
    tokenAddress: zod_1.z.string(),
});
exports.SolanaGetTokenBalanceTool = {
    name: "SOLANA_GET_TOKEN_BALANCE",
    description: "Get the balance of a SPL token in the account",
    parameters: {
        tokenAddress: zod_1.z.string(),
    },
    execute: async ({ tokenAddress }) => {
        try {
            const secretKey = bs58_1.default.decode(env_1.ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
            const connection = new web3_js_1.Connection(rpc_1.RPC_URL.HELIUS);
            const keypair = web3_js_1.Keypair.fromSecretKey(secretKey);
            const ata = await (0, spl_token_1.getAssociatedTokenAddress)(new web3_js_1.PublicKey(tokenAddress), keypair.publicKey);
            const result = await connection.getParsedAccountInfo(ata);
            const mintInfo = await (0, solana_1.getTokenMetadata)(connection, tokenAddress);
            if (result.value?.data &&
                "parsed" in result.value.data &&
                "info" in result.value.data.parsed) {
                return {
                    tokenAddress,
                    name: mintInfo.name ?? "",
                    symbol: mintInfo.symbol ?? "",
                    balance: result.value.data.parsed.info.tokenAmount.uiAmount,
                    decimals: result.value.data.parsed.info.tokenAmount
                        .decimals,
                };
            }
            return {
                tokenAddress,
                name: mintInfo.name ?? "",
                symbol: mintInfo.symbol ?? "",
                balance: 0,
                decimals: 0,
            };
        }
        catch (error) {
            return error.message;
        }
    },
};
//# sourceMappingURL=getTokenBalance.js.map