import { z } from "zod";
declare const SanctumGetOwnedLSTParams: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export type SanctumGetOwnedLSTParams = z.infer<typeof SanctumGetOwnedLSTParams>;
export declare const SanctumGetOwnedLST: {
    name: string;
    description: string;
    parameters: {};
    execute: () => Promise<any>;
};
export {};
//# sourceMappingURL=getOwnedLst.d.ts.map