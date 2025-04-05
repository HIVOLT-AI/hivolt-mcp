import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { z } from "zod";
import { BN } from "@coral-xyz/anchor";
import Decimal from "decimal.js";
declare const RaydiumCreateClmmToolParams: z.ZodObject<{
    mint1: z.ZodString;
    mint2: z.ZodString;
    configId: z.ZodString;
    initialPrice: z.ZodString;
    startTime: z.ZodString;
}, "strip", z.ZodTypeAny, {
    initialPrice: string;
    startTime: string;
    mint1: string;
    mint2: string;
    configId: string;
}, {
    initialPrice: string;
    startTime: string;
    mint1: string;
    mint2: string;
    configId: string;
}>;
export type RaydiumCreateClmmToolParams = z.infer<typeof RaydiumCreateClmmToolParams>;
export declare const RaydiumCreateClmmTool: {
    name: string;
    description: string;
    parameters: {
        mint1: z.ZodString;
        mint2: z.ZodString;
        configId: z.ZodString;
        initialPrice: z.ZodString;
        startTime: z.ZodString;
    };
    execute: (input: RaydiumCreateClmmToolParams) => Promise<{
        txId: string;
    }>;
};
export declare function raydium_create_clmm(accountKeypair: Keypair, connection: Connection, mint1: PublicKey, mint2: PublicKey, configId: PublicKey, // V4 CLMM Config ID: 6J2X5j8iGUE9rPpy8h52u9dfy85vPMU8aF4D2KYfrc4h
initialPrice: Decimal, startTime: BN): Promise<{
    txId: string;
}>;
export {};
//# sourceMappingURL=createClmm.d.ts.map