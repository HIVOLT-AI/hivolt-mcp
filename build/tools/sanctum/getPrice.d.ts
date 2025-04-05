import { z } from "zod";
declare const SanctumGetPriceToolParams: z.ZodObject<{
    inputs: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    inputs: string[];
}, {
    inputs: string[];
}>;
export type SanctumGetPriceToolParams = z.infer<typeof SanctumGetPriceToolParams>;
export declare const SanctumGetPriceTool: {
    readonly name: "SANCTUM_GET_PRICE";
    readonly description: "Fetch the price of a LST(Liquid Staking Token) list on the Sanctum with specified mint addresses or symbols.";
    readonly parameters: {
        readonly inputs: z.ZodArray<z.ZodString, "many">;
    };
    readonly execute: ({ inputs }: SanctumGetPriceToolParams) => Promise<any>;
};
export {};
//# sourceMappingURL=getPrice.d.ts.map