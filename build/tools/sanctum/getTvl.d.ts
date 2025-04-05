import { z } from "zod";
declare const SanctumGetTvlToolParams: z.ZodObject<{
    inputs: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    inputs: string[];
}, {
    inputs: string[];
}>;
export type SanctumGetTvlToolParams = z.infer<typeof SanctumGetTvlToolParams>;
export declare const SanctumGetTvlTool: {
    readonly name: "SANCTUM_GET_TVL";
    readonly description: "Fetch the TVL of a LST(Liquid Staking Token) list on the Sanctum with specified mint addresses or symbols.";
    readonly parameters: {
        readonly inputs: z.ZodArray<z.ZodString, "many">;
    };
    readonly execute: ({ inputs }: SanctumGetTvlToolParams) => Promise<any>;
};
export {};
//# sourceMappingURL=getTvl.d.ts.map