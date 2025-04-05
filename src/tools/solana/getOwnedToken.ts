import { z } from "zod";
import bs58 from "bs58";
import { Connection, Keypair } from "@solana/web3.js";
import { RPC_URL } from "../../constants/rpc";
import { ENV } from "../../env";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { getTokenMetadata } from "../../helpers/solana";

const SolanaGetOwnedTokenToolParams = z.object({});

export type SolanaGetOwnedTokenToolParams = z.infer<
  typeof SolanaGetOwnedTokenToolParams
>;

export const SolanaGetOwnedTokenTool = {
  name: "SOLANA_GET_OWNED_TOKEN",
  description: "Get the balance of a SPL token in the account",
  parameters: {
    tokenAddress: z.string(),
  },
  execute: async ({}: SolanaGetOwnedTokenToolParams) => {
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

      const tokenBalances = await Promise.all(
        removedZeroBalance.map(async (v) => {
          const mint = v.account.data.parsed.info.mint;
          const mintInfo = await getTokenMetadata(connection, mint);
          return {
            tokenAddress: mint,
            name: mintInfo.name ?? "",
            symbol: mintInfo.symbol ?? "",
            balance: v.account.data.parsed.info.tokenAmount.uiAmount as number,
            decimals: v.account.data.parsed.info.tokenAmount.decimals as number,
          };
        })
      );

      return tokenBalances;
    } catch (error: any) {
      return error.message;
    }
  },
};
