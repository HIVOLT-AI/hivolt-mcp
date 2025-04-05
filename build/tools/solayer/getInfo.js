"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolayerGetInfoTool = void 0;
const axios_1 = __importDefault(require("axios"));
const solayer_1 = require("../../constants/solayer");
exports.SolayerGetInfoTool = {
    name: "SOLAYER_GET_INFO",
    description: "Get info of Solayer.",
    parameters: {},
    execute: async () => {
        try {
            const client = axios_1.default.create({
                baseURL: solayer_1.SOLAYER_API_URI,
            });
            const response = await client.get(`/api/info`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const result = response.data;
            return result;
        }
        catch (error) {
            throw new Error(`Failed to get info: ${error.message}`);
        }
    },
};
// {
//   "apy": 9.37,
//   "depositors": 0,
//   "epoch": 765,
//   "epoch_diff_time": "2h31m26s",
//   "epoch_end_time": 1743638694962,
//   "epoch_start_time": 1743465894962,
//   "ssol_holders": 0,
//   "ssol_to_sol": 1.06987092,
//   "susd_apy": 3.97,
//   "susd_holders": 0,
//   "token_tvl_usd": {
//     "sBBSOL": "948916.4019",
//     "sBNSOL": "615181.585588",
//     "sBSOL": "526913.47010115",
//     "sHSOL": "211859.905527",
//     "sHUBSOL": "217670.89431517",
//     "sINF": "4016902.852919",
//     "sJITOSOL": "2787392.44150452",
//     "sJSOL": "81796.43686023",
//     "sJupSOL": "620468.40465498",
//     "sLST": "28677.2839236",
//     "sMSOL": "1585760.06616",
//     "sSOL": "83335573.97186255",
//     "sUSD": "11582529.526",
//     "sVSOL": "1387.35014698"
//   },
//   "tvl_sol": "1020986.92420929",
//   "tvl_usd": "127664205.00313014"
// }
//# sourceMappingURL=getInfo.js.map