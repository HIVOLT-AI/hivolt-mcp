import { z } from "zod";
declare const SanctumGetApyToolParams: z.ZodObject<{
    inputs: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    inputs: string[];
}, {
    inputs: string[];
}>;
export type SanctumGetApyToolParams = z.infer<typeof SanctumGetApyToolParams>;
export declare const SanctumGetApyTool: {
    readonly name: "SANCTUM_GET_APY";
    readonly description: "Fetch the APY of a LST(Liquid Staking Token) list on the Sanctum with specified mint addresses or symbols.";
    readonly parameters: {
        readonly inputs: z.ZodArray<z.ZodString, "many">;
    };
    readonly execute: ({ inputs }: SanctumGetApyToolParams) => Promise<any>;
};
export {};
//# sourceMappingURL=getApy.d.ts.map