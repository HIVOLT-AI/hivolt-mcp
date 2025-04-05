import { z } from "zod";
export type NetworkType = "Mainnet" | "Testnet" | "Devnet";
export declare const NetworkSchema: z.ZodUnion<[z.ZodLiteral<"Mainnet">, z.ZodLiteral<"Testnet">, z.ZodLiteral<"Devnet">]>;
export declare const ChainSchema: z.ZodUnion<[z.ZodLiteral<"Solana">, z.ZodLiteral<"Ethereum">]>;
//# sourceMappingURL=chain.d.ts.map