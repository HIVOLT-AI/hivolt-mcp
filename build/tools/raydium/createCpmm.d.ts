import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { z } from "zod";
import { BN } from "@coral-xyz/anchor";
declare const RaydiumCreateCpmmToolParams: z.ZodObject<{
    mintA: z.ZodString;
    mintB: z.ZodString;
    configId: z.ZodString;
    mintAAmount: z.ZodString;
    mintBAmount: z.ZodString;
    startTime: z.ZodString;
}, "strip", z.ZodTypeAny, {
    startTime: string;
    configId: string;
    mintA: string;
    mintB: string;
    mintAAmount: string;
    mintBAmount: string;
}, {
    startTime: string;
    configId: string;
    mintA: string;
    mintB: string;
    mintAAmount: string;
    mintBAmount: string;
}>;
export type RaydiumCreateCpmmToolParams = z.infer<typeof RaydiumCreateCpmmToolParams>;
export declare const RaydiumCreateCpmmTool: {
    name: string;
    description: string;
    parameters: {
        mintA: z.ZodString;
        mintB: z.ZodString;
        configId: z.ZodString;
        mintAAmount: z.ZodString;
        mintBAmount: z.ZodString;
        startTime: z.ZodString;
    };
    execute: (input: RaydiumCreateCpmmToolParams) => Promise<{
        txId: string;
    }>;
};
export declare function raydium_create_cpmm(accountKeypair: Keypair, connection: Connection, mintA: PublicKey, mintB: PublicKey, configId: PublicKey, mintAAmount: BN, mintBAmount: BN, startTime: BN): Promise<{
    txId: string;
}>;
export {};
//# sourceMappingURL=createCpmm.d.ts.map