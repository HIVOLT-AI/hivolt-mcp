import { Connection, Keypair } from "@solana/web3.js";
import { z } from "zod";
declare const MeteoraCreateDlmmImbalancePositionToolParams: z.ZodObject<{
    poolAddress: z.ZodString;
    tokenXMint: z.ZodString;
    tokenXAmount: z.ZodNumber;
    solAmount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    poolAddress: string;
    tokenXMint: string;
    tokenXAmount: number;
    solAmount: number;
}, {
    poolAddress: string;
    tokenXMint: string;
    tokenXAmount: number;
    solAmount: number;
}>;
export type MeteoraCreateDlmmImbalancePositionToolParams = z.infer<typeof MeteoraCreateDlmmImbalancePositionToolParams>;
export declare const MeteoraCreateDlmmImbalancePositionTool: {
    name: string;
    description: string;
    parameters: {
        poolAddress: z.ZodString;
        tokenXMint: z.ZodString;
        tokenXAmount: z.ZodNumber;
        solAmount: z.ZodNumber;
    };
    execute: (input: MeteoraCreateDlmmImbalancePositionToolParams) => Promise<{
        txId: string;
    }>;
};
export declare function meteora_create_dlmm_imbalance_position(accountKeypair: Keypair, connection: Connection, poolAddress: string, tokenXMint: string, tokenXAmount: number, solAmount: number): Promise<{
    txId: string;
}>;
export {};
//# sourceMappingURL=createDlmmImbalancePosition.d.ts.map