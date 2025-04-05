"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeteoraGetListOfPositionsTool = void 0;
exports.meteora_get_list_of_positions = meteora_get_list_of_positions;
const bytes_1 = require("@coral-xyz/anchor/dist/cjs/utils/bytes");
const dlmm_1 = __importDefault(require("@meteora-ag/dlmm"));
const web3_js_1 = require("@solana/web3.js");
const web3_js_2 = require("@solana/web3.js");
const rpc_1 = require("../../constants/rpc");
const env_1 = require("../../env");
const zod_1 = require("zod");
const MeteoraGetListOfPositionsToolParams = zod_1.z.object({
    poolAddress: zod_1.z.string(),
});
exports.MeteoraGetListOfPositionsTool = {
    name: "METEORA_GET_LIST_OF_POSITIONS",
    description: "Get list of positions",
    parameters: {
        poolAddress: zod_1.z.string(),
    },
    execute: async (input) => {
        const secretKey = bytes_1.bs58.decode(env_1.ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
        const connection = new web3_js_1.Connection(rpc_1.RPC_URL.HELIUS);
        const keypair = web3_js_1.Keypair.fromSecretKey(secretKey);
        return await meteora_get_list_of_positions(keypair, connection, input.poolAddress);
    },
};
async function meteora_get_list_of_positions(accountKeypair, connection, poolAddress) {
    try {
        const pool = new web3_js_2.PublicKey(poolAddress);
        const dlmmPool = await dlmm_1.default.create(connection, pool);
        const { userPositions } = await dlmmPool.getPositionsByUserAndLbPair(accountKeypair.publicKey);
        const binData = userPositions[0].positionData.positionBinData;
        return binData;
    }
    catch (error) {
        console.error(error);
        throw new Error(`Failed to get list of positions: ${error.message}`);
    }
}
//# sourceMappingURL=getListOfPositions.js.map