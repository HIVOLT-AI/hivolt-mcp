import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { Keypair } from '@solana/web3.js';
import axios from 'axios';
import { ENV } from 'src/env';
import { LULO_API_URI } from 'src/constants/lulo';

export const LuloGetAccountTool = {
  name: 'LULO_GET_ACCOUNT',
  description: 'Get Lulo account information',
  parameters: {},
  execute: async () => {
    const secretKey = bs58.decode(ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
    const keypair = Keypair.fromSecretKey(secretKey);

    return await lulo_get_account(
      keypair,
    );
  },
};

export async function lulo_get_account(
  accountKeypair: Keypair,
): Promise<LuloAccountData> {
  try {
    const client = axios.create({
      baseURL: LULO_API_URI,
    });

    const response = await client.get(`/v1/account.getAccount?owner=${accountKeypair.publicKey.toBase58()}`,
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
    throw new Error(`Failed to get account: ${error.message}`);
  }
}

type LuloAccountData = {
  totalUsdValue: number;
  lusdUsdBalance: number;
  pusdUsdBalance: number;
  maxWithdrawable: {
    protected: Record<string, number>;
    regular: Record<string, number>;
  };
  totalInterestEarned: number;
  protectedInterestEarned: number;
  regularInterestEarned: number;
  blockTime: number;
};

// LuloAccountData
//
// {
//   "totalUsdValue": 0,
//     "lusdUsdBalance": 0,
//       "pusdUsdBalance": 0,
//         "maxWithdrawable": {
//     "protected": {
//       "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": 0
//     },
//     "regular": {
//       "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": 0
//     }
//   },
//   "totalInterestEarned": 0,
//   "protectedInterestEarned": 0,
//   "regularInterestEarned": 0,
//   "blockTime": 1743475802
// }
