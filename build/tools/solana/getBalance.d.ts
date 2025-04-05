import { z } from "zod";
declare const SolanaGetBalanceToolParams: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export type SolanaGetBalanceToolParams = z.infer<typeof SolanaGetBalanceToolParams>;
export declare const SolanaGetBalanceTool: {
    name: string;
    description: string;
    parameters: {};
    execute: ({}: SolanaGetBalanceToolParams) => Promise<any>;
};
export {};
//# sourceMappingURL=getBalance.d.ts.map