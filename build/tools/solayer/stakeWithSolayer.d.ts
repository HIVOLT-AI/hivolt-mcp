import { z } from "zod";
declare const SolayerStakeWithSolayerToolParams: z.ZodObject<{
    amount: z.ZodString;
}, "strip", z.ZodTypeAny, {
    amount: string;
}, {
    amount: string;
}>;
export type SolayerStakeWithSolayerToolParams = z.infer<typeof SolayerStakeWithSolayerToolParams>;
export declare const SolayerStakeWithSolayerTool: {
    name: string;
    description: string;
    parameters: {
        amount: z.ZodString;
    };
    execute: ({ amount }: SolayerStakeWithSolayerToolParams) => Promise<any>;
};
export {};
//# sourceMappingURL=stakeWithSolayer.d.ts.map