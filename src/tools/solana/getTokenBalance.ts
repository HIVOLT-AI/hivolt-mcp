import { z } from "zod";
import bs58 from "bs58";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { RPC_URL } from "src/constants/rpc";
import { ENV } from "src/env";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { getTokenMetadata } from "src/helpers/solana";

const SolanaGetTokenBalanceToolParams = z.object({
  tokenAddress: z.string(),
});

export type SolanaGetTokenBalanceToolParams = z.infer<
  typeof SolanaGetTokenBalanceToolParams
>;

export const SolanaGetTokenBalanceTool = {
  name: "SOLANA_GET_TOKEN_BALANCE",
  description: "Get the balance of a SPL token in the account",
  parameters: {
    tokenAddress: z.string(),
  },
  execute: async ({ tokenAddress }: SolanaGetTokenBalanceToolParams) => {
    try {
      const secretKey = bs58.decode(ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
      const connection = new Connection(RPC_URL.HELIUS);
      const keypair = Keypair.fromSecretKey(secretKey);

      const ata = await getAssociatedTokenAddress(
        new PublicKey(tokenAddress),
        keypair.publicKey
      );

      const result = await connection.getParsedAccountInfo(ata);

      const mintInfo = await getTokenMetadata(connection, tokenAddress);

      if (
        result.value?.data &&
        "parsed" in result.value.data &&
        "info" in result.value.data.parsed
      ) {
        return {
          tokenAddress,
          name: mintInfo.name ?? "",
          symbol: mintInfo.symbol ?? "",
          balance: result.value.data.parsed.info.tokenAmount.uiAmount as number,
          decimals: result.value.data.parsed.info.tokenAmount
            .decimals as number,
        };
      }
      return {
        tokenAddress,
        name: mintInfo.name ?? "",
        symbol: mintInfo.symbol ?? "",
        balance: 0,
        decimals: 0,
      };
    } catch (error: any) {
      return error.message;
    }
  },
};
