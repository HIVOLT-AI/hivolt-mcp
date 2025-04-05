import axios from "axios";
import { SANCTUM_STAT_API_URI } from "../../constants/sanctum";
import { z } from "zod";

const SanctumGetPriceToolParams = z.object({
  inputs: z.array(z.string()),
});

export type SanctumGetPriceToolParams = z.infer<
  typeof SanctumGetPriceToolParams
>;

export const SanctumGetPriceTool = {
  name: "SANCTUM_GET_PRICE",
  description:
    "Fetch the price of a LST(Liquid Staking Token) list on the Sanctum with specified mint addresses or symbols.",
  parameters: {
    inputs: z.array(z.string()),
  },
  execute: async ({ inputs }: SanctumGetPriceToolParams) => {
    try {
      const client = axios.create({
        baseURL: SANCTUM_STAT_API_URI,
      });

      const response = await client.get("/v1/sol-value/current", {
        params: {
          lst: inputs,
        },
        paramsSerializer: (params) => {
          return params.lst.map((value: string) => `lst=${value}`).join("&");
        },
      });

      const result = response.data;

      return result;
    } catch (error: any) {
      return error.message;
    }
  },
} as const;
