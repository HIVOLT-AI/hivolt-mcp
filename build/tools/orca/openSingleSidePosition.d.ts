import { z } from "zod";
declare const OrcaOpenSingleSidePositionToolParams: z.ZodObject<{
    whirlpoolAddress: z.ZodString;
    distanceFromCurrentPriceBps: z.ZodNumber;
    widthBps: z.ZodNumber;
    inputTokenMint: z.ZodString;
    inputAmount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    whirlpoolAddress: string;
    distanceFromCurrentPriceBps: number;
    widthBps: number;
    inputTokenMint: string;
    inputAmount: number;
}, {
    whirlpoolAddress: string;
    distanceFromCurrentPriceBps: number;
    widthBps: number;
    inputTokenMint: string;
    inputAmount: number;
}>;
export type OrcaOpenSingleSidePositionToolParams = z.infer<typeof OrcaOpenSingleSidePositionToolParams>;
export declare const OrcaOpenSingleSidePositionTool: {
    name: string;
    description: string;
    parameters: {
        whirlpoolAddress: z.ZodString;
        distanceFromCurrentPriceBps: z.ZodNumber;
        widthBps: z.ZodNumber;
        inputTokenMint: z.ZodString;
        inputAmount: z.ZodNumber;
    };
    execute: ({ whirlpoolAddress, distanceFromCurrentPriceBps, widthBps, inputTokenMint, inputAmount, }: OrcaOpenSingleSidePositionToolParams) => Promise<{
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
//# sourceMappingURL=openSingleSidePosition.d.ts.map