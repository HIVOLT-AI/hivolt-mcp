import { ENV } from "../env";

export const RPC_URL: Record<string, string> = {
  DEFAULT: "https://api.mainnet-beta.solana.com",
  HELIUS: `https://mainnet.helius-rpc.com/?api-key=${ENV.HELIUS_API_KEY}`,
};
