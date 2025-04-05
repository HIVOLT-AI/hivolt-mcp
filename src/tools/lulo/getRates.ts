import axios from "axios";
import { ENV } from "../../env";
import { LULO_API_URI } from "../../constants/lulo";

export const LuloGetRatesTool = {
  name: "LULO_GET_RATES",
  description: "Get Lulo rates",
  parameters: {},
  execute: async () => {
    return await lulo_get_rates();
  },
};

export async function lulo_get_rates(): Promise<LuloRateData> {
  try {
    const client = axios.create({
      baseURL: LULO_API_URI,
    });

    const response = await client.get(`/v1/rates.getRates`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ENV.LULO_API_KEY ?? "",
      },
    });

    const result = response.data;
    return result;
  } catch (error: any) {
    throw new Error(`Failed to get rates: ${error.message}`);
  }
}

type LuloRateData = {
  regular: {
    CURRENT: number;
    "1HR": number;
    "1YR": number;
    "24HR": number;
    "30DAY": number;
    "7DAY": number;
  };
  protected: {
    CURRENT: number;
    "1HR": number;
    "1YR": number;
    "24HR": number;
    "30DAY": number;
    "7DAY": number;
  };
};

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
