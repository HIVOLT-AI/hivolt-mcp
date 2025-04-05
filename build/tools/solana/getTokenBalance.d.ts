import { z } from "zod";
declare const SolanaGetTokenBalanceToolParams: z.ZodObject<{
    tokenAddress: z.ZodString;
}, "strip", z.ZodTypeAny, {
    tokenAddress: string;
}, {
    tokenAddress: string;
}>;
export type SolanaGetTokenBalanceToolParams = z.infer<typeof SolanaGetTokenBalanceToolParams>;
export declare const SolanaGetTokenBalanceTool: {
    name: string;
    description: string;
    parameters: {
        tokenAddress: z.ZodString;
    };
    execute: ({ tokenAddress }: SolanaGetTokenBalanceToolParams) => Promise<any>;
};
export {};
//# sourceMappingURL=getTokenBalance.d.ts.map