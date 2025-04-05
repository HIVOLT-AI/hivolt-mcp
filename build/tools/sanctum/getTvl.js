"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SanctumGetTvlTool = void 0;
const axios_1 = __importDefault(require("axios"));
const sanctum_1 = require("../../constants/sanctum");
const zod_1 = require("zod");
const SanctumGetTvlToolParams = zod_1.z.object({
    inputs: zod_1.z.array(zod_1.z.string()),
});
exports.SanctumGetTvlTool = {
    name: "SANCTUM_GET_TVL",
    description: "Fetch the TVL of a LST(Liquid Staking Token) list on the Sanctum with specified mint addresses or symbols.",
    parameters: {
        inputs: zod_1.z.array(zod_1.z.string()),
    },
    execute: async ({ inputs }) => {
        try {
            const client = axios_1.default.create({
                baseURL: sanctum_1.SANCTUM_STAT_API_URI,
            });
            const response = await client.get("/v1/tvl/current", {
                params: {
                    lst: inputs,
                },
                paramsSerializer: (params) => {
                    return params.lst.map((value) => `lst=${value}`).join("&");
                },
            });
            const result = response.data;
            return result;
        }
        catch (error) {
            return error.message;
        }
    },
};
//# sourceMappingURL=getTvl.js.map