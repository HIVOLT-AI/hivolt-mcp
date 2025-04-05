import axios from "axios";
import { SANCTUM_STAT_API_URI } from "../../constants/sanctum";
import { z } from "zod";

const SanctumGetTvlToolParams = z.object({
  inputs: z.array(z.string()),
});

export type SanctumGetTvlToolParams = z.infer<typeof SanctumGetTvlToolParams>;

export const SanctumGetTvlTool = {
  name: "SANCTUM_GET_TVL",
  description:
    "Fetch the TVL of a LST(Liquid Staking Token) list on the Sanctum with specified mint addresses or symbols.",
  parameters: {
    inputs: z.array(z.string()),
  },
  execute: async ({ inputs }: SanctumGetTvlToolParams) => {
    try {
      const client = axios.create({
        baseURL: SANCTUM_STAT_API_URI,
      });

      const response = await client.get("/v1/tvl/current", {
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
