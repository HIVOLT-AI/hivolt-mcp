import { z } from "zod";
declare const OrcaCreateClmmToolParams: z.ZodObject<{
    mint: z.ZodString;
    pair: z.ZodString;
    initialPrice: z.ZodNumber;
    feeTier: z.ZodNumber;
    network: z.ZodString;
}, "strip", z.ZodTypeAny, {
    mint: string;
    network: string;
    pair: string;
    initialPrice: number;
    feeTier: number;
}, {
    mint: string;
    network: string;
    pair: string;
    initialPrice: number;
    feeTier: number;
}>;
export type OrcaCreateClmmToolParams = z.infer<typeof OrcaCreateClmmToolParams>;
export declare const OrcaCreateClmmTool: {
    name: string;
    description: string;
    parameters: {
        mint: z.ZodString;
        pair: z.ZodString;
        initialPrice: z.ZodNumber;
        feeTier: z.ZodNumber;
        network: z.ZodString;
    };
    execute: ({ mint, pair, initialPrice, feeTier, network, }: OrcaCreateClmmToolParams) => Promise<{
        txId: string;
        poolAddress: string;
        error?: never;
    } | {
        error: any;
        txId?: never;
        poolAddress?: never;
    }>;
};
export {};
//# sourceMappingURL=createClmm.d.ts.map