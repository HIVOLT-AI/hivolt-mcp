import { z } from "zod";

export type NetworkType = "Mainnet" | "Testnet" | "Devnet";

export const NetworkSchema = z.union([
  z.literal("Mainnet"),
  z.literal("Testnet"),
  z.literal("Devnet"),
]);

export const ChainSchema = z.union([
  z.literal("Solana"),
  z.literal("Ethereum"),
]);
