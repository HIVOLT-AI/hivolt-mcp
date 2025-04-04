import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { Connection, Keypair, TransactionInstruction, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import axios from 'axios';
import { RPC_URL } from 'src/constants/rpc';
import { ENV } from 'src/env';
import { LULO_API_URI } from 'src/constants/lulo';
import { z } from 'zod';

export const LuloGetPoolsTool = {
  name: 'LULO_GET_POOLS',
  description: 'Get Lulo pools',
  parameters: {},
  execute: async () => {
    return await lulo_get_pools();
  },
};

export async function lulo_get_pools(): Promise<LuloPoolData> {
  try {
    const client = axios.create({
      baseURL: LULO_API_URI,
    });

    const response = await client.get(`/v1/pool.getPools`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ENV.LULO_API_KEY ?? '',
        },
      },
    );

    const result = response.data;
    return result;
  } catch (error: any) {
    throw new Error(`Failed to get pools: ${error.message}`);
  }
}

type LuloPoolData = {
  regular: {
    type: string;
    apy: number;
    maxWithdrawalAmount: number;
    price: number;
  };
  protected: {
    type: string;
    apy: number;
    openCapacity: number;
    price: number;
  };
  averagePoolRate: number;
  totalLiquidity: number;
  availableLiquidity: number;
  regularLiquidityAmount: number;
  protectedLiquidityAmount: number;
  regularAvailableAmount: number;
};

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
