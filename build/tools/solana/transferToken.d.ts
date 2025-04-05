import { z } from "zod";
declare const SolanaTransferTokenToolParams: z.ZodObject<{
    to: z.ZodString;
    amount: z.ZodNumber;
    network: z.ZodUnion<[z.ZodLiteral<"Mainnet">, z.ZodLiteral<"Testnet">, z.ZodLiteral<"Devnet">]>;
    tokenAddress: z.ZodString;
}, "strip", z.ZodTypeAny, {
    amount: number;
    tokenAddress: string;
    to: string;
    network: "Mainnet" | "Testnet" | "Devnet";
}, {
    amount: number;
    tokenAddress: string;
    to: string;
    network: "Mainnet" | "Testnet" | "Devnet";
}>;
export type SolanaTransferTokenToolParams = z.infer<typeof SolanaTransferTokenToolParams>;
export declare const SolanaTransferTokenTool: {
    name: string;
    description: string;
    parameters: {
        to: z.ZodString;
        amount: z.ZodNumber;
        network: z.ZodUnion<[z.ZodLiteral<"Mainnet">, z.ZodLiteral<"Testnet">, z.ZodLiteral<"Devnet">]>;
        tokenAddress: z.ZodString;
    };
    execute: ({ to, amount, tokenAddress, }: SolanaTransferTokenToolParams) => Promise<any>;
};
export {};
//# sourceMappingURL=transferToken.d.ts.map