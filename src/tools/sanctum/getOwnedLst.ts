import { z } from "zod";
import bs58 from "bs58";
import { ENV } from "src/env";
import { RPC_URL } from "src/constants/rpc";
import { Connection, Keypair } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import axios from "axios";
import { SANCTUM_STAT_API_URI } from "src/constants/sanctum";

const SanctumGetOwnedLSTParams = z.object({});

export type SanctumGetOwnedLSTParams = z.infer<typeof SanctumGetOwnedLSTParams>;

export const SanctumGetOwnedLST = {
  name: "SANCTUM_GET_OWNED_LST",
  description: "Get the list of LSTs owned by the user",
  parameters: {},
  execute: async () => {
    try {
      const secretKey = bs58.decode(ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
      const connection = new Connection(RPC_URL.HELIUS);
      const keypair = Keypair.fromSecretKey(secretKey);

      const [tokenAccountData] = await Promise.all([
        connection.getParsedTokenAccountsByOwner(keypair.publicKey, {
          programId: TOKEN_PROGRAM_ID,
        }),
      ]);

      const removedZeroBalance = tokenAccountData.value.filter(
        (v) => v.account.data.parsed.info.tokenAmount.uiAmount !== 0
      );

      const tokens = await Promise.all(
        removedZeroBalance.map(async (v) => {
          return {
            tokenAddress: v.account.data.parsed.info.mint as string,
            decimals: v.account.data.parsed.info.tokenAmount.decimals as number,
            balance: v.account.data.parsed.info.tokenAmount.uiAmount as number,
          };
        })
      );

      const lsts = tokens.filter((token) => {
        return token.decimals === 9;
      });

      const addresses = lsts.map((token) => token.tokenAddress);

      const client = axios.create({
        baseURL: SANCTUM_STAT_API_URI,
      });

      const response = await client.get("/v1/sol-value/current", {
        params: {
          lst: addresses,
        },
        paramsSerializer: (params) => {
          return params.lst.map((value: string) => `lst=${value}`).join("&");
        },
      });

      const result = Object.keys(response.data.solValues);

      const lstsWithValue = lsts.filter((lst) => {
        return result.includes(lst.tokenAddress);
      });

      return lstsWithValue;
    } catch (error: any) {
      return error.message;
    }
  },
};
