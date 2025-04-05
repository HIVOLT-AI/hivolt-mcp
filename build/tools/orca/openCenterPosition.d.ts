import { z } from "zod";
declare const OrcaOpenCenterPositionToolParams: z.ZodObject<{
    whirlpoolAddress: z.ZodString;
    priceOffsetBps: z.ZodNumber;
    inputTokenMint: z.ZodString;
    inputAmount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    whirlpoolAddress: string;
    inputTokenMint: string;
    inputAmount: number;
    priceOffsetBps: number;
}, {
    whirlpoolAddress: string;
    inputTokenMint: string;
    inputAmount: number;
    priceOffsetBps: number;
}>;
export type OrcaOpenCenterPositionToolParams = z.infer<typeof OrcaOpenCenterPositionToolParams>;
export declare const OrcaOpenCenterPositionTool: {
    name: string;
    description: string;
    parameters: {
        whirlpoolAddress: z.ZodString;
        priceOffsetBps: z.ZodNumber;
        inputTokenMint: z.ZodString;
        inputAmount: z.ZodNumber;
    };
    execute: ({ whirlpoolAddress, priceOffsetBps, inputAmount, inputTokenMint, }: OrcaOpenCenterPositionToolParams) => Promise<{
        txId: string;
        positionMint: string;
        error?: never;
    } | {
        error: any;
        txId?: never;
        positionMint?: never;
    }>;
};
export {};
//# sourceMappingURL=openCenterPosition.d.ts.map