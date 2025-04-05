import { z } from "zod";
declare const OrcaGetPositionToolParams: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export type OrcaGetPositionToolParams = z.infer<typeof OrcaGetPositionToolParams>;
export declare const OrcaGetPositionTool: {
    name: string;
    description: string;
    parameters: {};
    execute: ({}: OrcaGetPositionToolParams) => Promise<any>;
};
export {};
//# sourceMappingURL=getPosition.d.ts.map