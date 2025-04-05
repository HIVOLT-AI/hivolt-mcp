import { z } from "zod";
declare const OrcaClosePositionToolParams: z.ZodObject<{
    positionMint: z.ZodString;
}, "strip", z.ZodTypeAny, {
    positionMint: string;
}, {
    positionMint: string;
}>;
export type OrcaClosePositionToolParams = z.infer<typeof OrcaClosePositionToolParams>;
export declare const OrcaClosePositionTool: {
    name: string;
    description: string;
    parameters: {
        positionMint: z.ZodString;
    };
    execute: ({ positionMint }: OrcaClosePositionToolParams) => Promise<{
        txId: string;
        error?: never;
    } | {
        error: any;
        txId?: never;
    }>;
};
export {};
//# sourceMappingURL=closePosition.d.ts.map