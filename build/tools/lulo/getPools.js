"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuloGetPoolsTool = void 0;
exports.lulo_get_pools = lulo_get_pools;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../../env");
const lulo_1 = require("../../constants/lulo");
exports.LuloGetPoolsTool = {
    name: "LULO_GET_POOLS",
    description: "Get Lulo pools",
    parameters: {},
    execute: async () => {
        return await lulo_get_pools();
    },
};
async function lulo_get_pools() {
    try {
        const client = axios_1.default.create({
            baseURL: lulo_1.LULO_API_URI,
        });
        const response = await client.get(`/v1/pool.getPools`, {
            headers: {
                "Content-Type": "application/json",
                "x-api-key": env_1.ENV.LULO_API_KEY ?? "",
            },
        });
        const result = response.data;
        return result;
    }
    catch (error) {
        throw new Error(`Failed to get pools: ${error.message}`);
    }
}
// {
//   "regular": {
//     "type": "regular",
//     "apy": 0.05362,
//     "maxWithdrawalAmount": 6522716.075627998,
//     "price": 1.0265194276154868
//   },
//   "protected": {
//     "type": "protected",
//     "apy": 0.03391,
//     "openCapacity": 10969601.169450996,
//     "price": 1.013087634928608
//   },
//   "averagePoolRate": 0.044989999999999995,
//   "totalLiquidity": 18184662.880863,
//   "availableLiquidity": 18092032.575819,
//   "regularLiquidityAmount": 10471727.472168999,
//   "protectedLiquidityAmount": 7712877.666794,
//   "regularAvailableAmount": 10379154.909024999
// }
//# sourceMappingURL=getPools.js.map