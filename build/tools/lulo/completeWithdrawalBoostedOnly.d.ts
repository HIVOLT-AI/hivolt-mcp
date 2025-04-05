import { z } from "zod";
declare const LuloCompleteWithdrawalBoostedOnlyToolParams: z.ZodObject<{
    pendingWithdrawalId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    pendingWithdrawalId: number;
}, {
    pendingWithdrawalId: number;
}>;
export type LuloCompleteWithdrawalBoostedOnlyToolParams = z.infer<typeof LuloCompleteWithdrawalBoostedOnlyToolParams>;
export declare const LuloCompleteWithdrawalBoostedOnlyTool: {
    name: string;
    description: string;
    parameters: {
        pendingWithdrawalId: z.ZodNumber;
    };
    execute: (input: LuloCompleteWithdrawalBoostedOnlyToolParams) => Promise<{
        txId: string;
    }>;
};
export {};
//# sourceMappingURL=completeWithdrawalBoostedOnly.d.ts.map