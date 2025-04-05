import { z } from "zod";
declare const SolanaGetOwnedTokenToolParams: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export type SolanaGetOwnedTokenToolParams = z.infer<typeof SolanaGetOwnedTokenToolParams>;
export declare const SolanaGetOwnedTokenTool: {
    name: string;
    description: string;
    parameters: {
        tokenAddress: z.ZodString;
    };
    execute: ({}: SolanaGetOwnedTokenToolParams) => Promise<any>;
};
export {};
//# sourceMappingURL=getOwnedToken.d.ts.map