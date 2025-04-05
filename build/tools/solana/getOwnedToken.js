"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaGetOwnedTokenTool = void 0;
const zod_1 = require("zod");
const bs58_1 = __importDefault(require("bs58"));
const web3_js_1 = require("@solana/web3.js");
const rpc_1 = require("../../constants/rpc");
const env_1 = require("../../env");
const spl_token_1 = require("@solana/spl-token");
const solana_1 = require("../../helpers/solana");
const SolanaGetOwnedTokenToolParams = zod_1.z.object({});
exports.SolanaGetOwnedTokenTool = {
    name: "SOLANA_GET_OWNED_TOKEN",
    description: "Get the balance of a SPL token in the account",
    parameters: {
        tokenAddress: zod_1.z.string(),
    },
    execute: async ({}) => {
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
            const tokenBalances = await Promise.all(removedZeroBalance.map(async (v) => {
                const mint = v.account.data.parsed.info.mint;
                const mintInfo = await (0, solana_1.getTokenMetadata)(connection, mint);
                return {
                    tokenAddress: mint,
                    name: mintInfo.name ?? "",
                    symbol: mintInfo.symbol ?? "",
                    balance: v.account.data.parsed.info.tokenAmount.uiAmount,
                    decimals: v.account.data.parsed.info.tokenAmount.decimals,
                };
            }));
            return tokenBalances;
        }
        catch (error) {
            return error.message;
        }
    },
};
//# sourceMappingURL=getOwnedToken.js.map