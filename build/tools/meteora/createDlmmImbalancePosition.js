"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeteoraCreateDlmmImbalancePositionTool = void 0;
exports.meteora_create_dlmm_imbalance_position = meteora_create_dlmm_imbalance_position;
const bytes_1 = require("@coral-xyz/anchor/dist/cjs/utils/bytes");
const web3_js_1 = require("@solana/web3.js");
const rpc_1 = require("../../constants/rpc");
const env_1 = require("../../env");
const zod_1 = require("zod");
const dlmm_1 = __importStar(require("@meteora-ag/dlmm"));
const spl_token_1 = require("@solana/spl-token");
const anchor_1 = require("@coral-xyz/anchor");
const MeteoraCreateDlmmImbalancePositionToolParams = zod_1.z.object({
    poolAddress: zod_1.z.string(),
    tokenXMint: zod_1.z.string(),
    tokenXAmount: zod_1.z.number(),
    solAmount: zod_1.z.number(),
});
exports.MeteoraCreateDlmmImbalancePositionTool = {
    name: "METEORA_CREATE_DLMM_IMBALANCE_POSITION",
    description: "Create DLMM imbalance position",
    parameters: {
        poolAddress: zod_1.z.string(),
        tokenXMint: zod_1.z.string(),
        tokenXAmount: zod_1.z.number(),
        solAmount: zod_1.z.number(),
    },
    execute: async (input) => {
        const secretKey = bytes_1.bs58.decode(env_1.ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
        const connection = new web3_js_1.Connection(rpc_1.RPC_URL.HELIUS);
        const keypair = web3_js_1.Keypair.fromSecretKey(secretKey);
        return await meteora_create_dlmm_imbalance_position(keypair, connection, input.poolAddress, input.tokenXMint, input.tokenXAmount, input.solAmount);
    },
};
async function meteora_create_dlmm_imbalance_position(accountKeypair, connection, poolAddress, tokenXMint, tokenXAmount, solAmount) {
    try {
        const pool = new web3_js_1.PublicKey(poolAddress);
        const dlmmPool = await dlmm_1.default.create(connection, pool);
        // get active bin
        const activeBin = await dlmmPool.getActiveBin();
        // create balance position
        const TOTAL_RANGE_INTERVAL = 10; // 10 bins on each side of the active bin
        const minBinId = activeBin.binId - TOTAL_RANGE_INTERVAL;
        const maxBinId = activeBin.binId + TOTAL_RANGE_INTERVAL;
        const baseMint = await (0, spl_token_1.getMint)(connection, new web3_js_1.PublicKey(tokenXMint));
        const totalXAmount = new anchor_1.BN(tokenXAmount * 10 ** baseMint.decimals);
        const totalYAmount = new anchor_1.BN(solAmount * 10 ** 9); // SOL
        const newImbalancePosition = new web3_js_1.Keypair();
        // create position
        const createPositionTx = await dlmmPool.initializePositionAndAddLiquidityByStrategy({
            positionPubKey: newImbalancePosition.publicKey,
            user: accountKeypair.publicKey,
            totalXAmount,
            totalYAmount,
            strategy: {
                maxBinId,
                minBinId,
                strategyType: dlmm_1.StrategyType.Spot, // can be StrategyType.Spot, StrategyType.BidAsk, StrategyType.Curve
            },
        });
        const instructions = createPositionTx.instructions;
        const { blockhash } = await connection.getLatestBlockhash();
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
        throw new Error(`Failed to create DLMM imbalance position: ${error.message}`);
    }
}
// https://github.com/MeteoraAg/dlmm-sdk/tree/main/ts-client
//# sourceMappingURL=createDlmmImbalancePosition.js.map