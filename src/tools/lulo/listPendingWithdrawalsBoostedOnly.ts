import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { Keypair } from '@solana/web3.js';
import axios from 'axios';
import { ENV } from 'src/env';
import { LULO_API_URI } from 'src/constants/lulo';

export const LuloListPendingWithdrawalsBoostedOnlyTool = {
  name: 'LULO_LIST_PENDING_WITHDRAWALS_BOOSTED_ONLY',
  description: 'List pending withdrawals boosted only',
  parameters: {},
  execute: async () => {
    const secretKey = bs58.decode(ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
    const keypair = Keypair.fromSecretKey(secretKey);

    return await lulo_list_pending_withdrawals_boosted_only(
      keypair,
    );
  },
};

export async function lulo_list_pending_withdrawals_boosted_only(
  accountKeypair: Keypair,
): Promise<LuloPendingWithdrawalsDataResponse> {
  try {
    const client = axios.create({
      baseURL: LULO_API_URI,
    });

    const response = await client.get(`/v1/account.withdrawals.listPendingWithdrawals?owner=${accountKeypair.publicKey.toBase58()}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ENV.LULO_API_KEY ?? '',
        },
      },
    );

    const result = response.data
    return result;
  } catch (error: any) {
    throw new Error(`Failed to list pending withdrawals: ${error.message}`);
  }
}

type LuloPendingWithdrawalData = {
  withdrawalId: number;
  owner: string;
  mintAddress: string;
  nativeAmount: number;
  status: string;
  createdTimestamp: number;
  cooldownSeconds: number;
};

type LuloPendingWithdrawalsDataResponse = {
  pendingWithdrawals: LuloPendingWithdrawalData[];
};

// {
//   "pendingWithdrawals": [
//     {
//       "owner": "9vL5L3AgznV3Uz474mEhT3oH95C3ApFWgSAHyiBh5fE8",
//       "withdrawalId": 17,
//       "nativeAmount": "2500001",
//       "createdTimestamp": 1742911049,
//       "cooldownSeconds": "86400",
//       "mintAddress": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
//     }
//   ]
// }
