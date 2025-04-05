import { z } from "zod";
declare const SanctumRemoveLiquidityToolParams: z.ZodObject<{
    lstMint: z.ZodString;
    amount: z.ZodString;
    quotedAmount: z.ZodString;
    priorityFee: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    lstMint: string;
    amount: string;
    quotedAmount: string;
    priorityFee: number;
}, {
    lstMint: string;
    amount: string;
    quotedAmount: string;
    priorityFee: number;
}>;
export type SanctumRemoveLiquidityToolParams = z.infer<typeof SanctumRemoveLiquidityToolParams>;
export declare const SanctumRemoveLiquidityTool: {
    name: string;
    description: string;
    parameters: {
        lstMint: z.ZodString;
        amount: z.ZodString;
        quotedAmount: z.ZodString;
        priorityFee: z.ZodNumber;
    };
    execute: ({ lstMint, amount, quotedAmount, priorityFee, }: SanctumRemoveLiquidityToolParams) => Promise<any>;
};
export {};
//# sourceMappingURL=removeLiquidity.d.ts.map