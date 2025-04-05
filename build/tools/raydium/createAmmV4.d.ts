import { Connection, Keypair } from "@solana/web3.js";
import { z } from "zod";
import { BN } from "@coral-xyz/anchor";
declare const RaydiumCreateAmmV4ToolParams: z.ZodObject<{
    marketId: z.ZodString;
    baseAmount: z.ZodString;
    quoteAmount: z.ZodString;
    startTime: z.ZodString;
}, "strip", z.ZodTypeAny, {
    marketId: string;
    baseAmount: string;
    quoteAmount: string;
    startTime: string;
}, {
    marketId: string;
    baseAmount: string;
    quoteAmount: string;
    startTime: string;
}>;
export type RaydiumCreateAmmV4ToolParams = z.infer<typeof RaydiumCreateAmmV4ToolParams>;
export declare const RaydiumCreateAmmV4Tool: {
    name: string;
    description: string;
    parameters: {
        marketId: z.ZodString;
        baseAmount: z.ZodString;
        quoteAmount: z.ZodString;
        startTime: z.ZodString;
    };
    execute: (input: RaydiumCreateAmmV4ToolParams) => Promise<{
        txId: string;
    }>;
};
export declare function raydium_create_amm_v4(accountKeypair: Keypair, connection: Connection, marketId: string, baseAmount: BN, quoteAmount: BN, startTime: BN): Promise<{
    txId: string;
}>;
export {};
//# sourceMappingURL=createAmmV4.d.ts.map