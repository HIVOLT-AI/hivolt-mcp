import { z } from "zod";
declare const SanctumAddLiquidityToolParams: z.ZodObject<{
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
export type SanctumAddLiquidityToolParams = z.infer<typeof SanctumAddLiquidityToolParams>;
export declare const SanctumAddLiquidityTool: {
    name: string;
    description: string;
    parameters: {
        lstMint: z.ZodString;
        amount: z.ZodString;
        quotedAmount: z.ZodString;
        priorityFee: z.ZodNumber;
    };
    execute: ({ lstMint, amount, quotedAmount, priorityFee, }: SanctumAddLiquidityToolParams) => Promise<any>;
};
export {};
//# sourceMappingURL=addLiquidity.d.ts.map