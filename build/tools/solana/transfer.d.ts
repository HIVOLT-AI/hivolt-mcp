import { z } from "zod";
declare const SolanaTransferToolParams: z.ZodObject<{
    to: z.ZodString;
    amount: z.ZodNumber;
    network: z.ZodUnion<[z.ZodLiteral<"Mainnet">, z.ZodLiteral<"Testnet">, z.ZodLiteral<"Devnet">]>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    to: string;
    network: "Mainnet" | "Testnet" | "Devnet";
}, {
    amount: number;
    to: string;
    network: "Mainnet" | "Testnet" | "Devnet";
}>;
export type SolanaTransferToolParams = z.infer<typeof SolanaTransferToolParams>;
export declare const SolanaTransferTool: {
    name: string;
    description: string;
    parameters: {
        to: z.ZodString;
        amount: z.ZodNumber;
        network: z.ZodUnion<[z.ZodLiteral<"Mainnet">, z.ZodLiteral<"Testnet">, z.ZodLiteral<"Devnet">]>;
    };
    execute: ({ to, amount, network }: SolanaTransferToolParams) => Promise<any>;
};
export {};
//# sourceMappingURL=transfer.d.ts.map