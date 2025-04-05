"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuloGetRatesTool = void 0;
exports.lulo_get_rates = lulo_get_rates;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../../env");
const lulo_1 = require("../../constants/lulo");
exports.LuloGetRatesTool = {
    name: "LULO_GET_RATES",
    description: "Get Lulo rates",
    parameters: {},
    execute: async () => {
        return await lulo_get_rates();
    },
};
async function lulo_get_rates() {
    try {
        const client = axios_1.default.create({
            baseURL: lulo_1.LULO_API_URI,
        });
        const response = await client.get(`/v1/rates.getRates`, {
            headers: {
                "Content-Type": "application/json",
                "x-api-key": env_1.ENV.LULO_API_KEY ?? "",
            },
        });
        const result = response.data;
        return result;
    }
    catch (error) {
        throw new Error(`Failed to get rates: ${error.message}`);
    }
}
// {
//   "regular": {
//     "CURRENT": 5.361737287044537,
//     "1HR": 5.352833333333333,
//     "1YR": 6.149049862132353,
//     "24HR": 5.219689655172414,
//     "30DAY": 6.149049862132353,
//     "7DAY": 5.356581602373887
//   },
//   "protected": {
//     "CURRENT": 3.3912778882139367,
//     "1HR": 3.385666666666667,
//     "1YR": 3.4463903952205883,
//     "24HR": 3.3047724137931036,
//     "30DAY": 3.4463903952205883,
//     "7DAY": 3.40368743818002
//   }
// }
//# sourceMappingURL=getRates.js.map