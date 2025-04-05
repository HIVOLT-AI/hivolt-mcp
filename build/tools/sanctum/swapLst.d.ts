import { z } from "zod";
declare const SanctumSwapLstToolParams: z.ZodObject<{
    input: z.ZodString;
    amount: z.ZodString;
    quotedAmount: z.ZodString;
    priorityFee: z.ZodNumber;
    outputLstMint: z.ZodString;
}, "strip", z.ZodTypeAny, {
    amount: string;
    quotedAmount: string;
    priorityFee: number;
    input: string;
    outputLstMint: string;
}, {
    amount: string;
    quotedAmount: string;
    priorityFee: number;
    input: string;
    outputLstMint: string;
}>;
export type SanctumSwapLstToolParams = z.infer<typeof SanctumSwapLstToolParams>;
export declare const SanctumSwapLstTool: {
    name: string;
    description: string;
    parameters: {
        input: z.ZodString;
        amount: z.ZodString;
        quotedAmount: z.ZodString;
        priorityFee: z.ZodNumber;
        outputLstMint: z.ZodString;
    };
    execute: ({ input, amount, quotedAmount, priorityFee, outputLstMint, }: SanctumSwapLstToolParams) => Promise<any>;
};
export {};
//# sourceMappingURL=swapLst.d.ts.map