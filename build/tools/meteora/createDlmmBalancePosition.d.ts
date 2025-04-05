import { Connection, Keypair } from "@solana/web3.js";
import { z } from "zod";
declare const MeteoraCreateDlmmBalancePositionToolParams: z.ZodObject<{
    poolAddress: z.ZodString;
    tokenXMint: z.ZodString;
    tokenXAmount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    poolAddress: string;
    tokenXMint: string;
    tokenXAmount: number;
}, {
    poolAddress: string;
    tokenXMint: string;
    tokenXAmount: number;
}>;
export type MeteoraCreateDlmmBalancePositionToolParams = z.infer<typeof MeteoraCreateDlmmBalancePositionToolParams>;
export declare const MeteoraCreateDlmmBalancePositionTool: {
    name: string;
    description: string;
    parameters: {
        poolAddress: z.ZodString;
        tokenXMint: z.ZodString;
        tokenXAmount: z.ZodNumber;
    };
    execute: (input: MeteoraCreateDlmmBalancePositionToolParams) => Promise<{
        txId: string;
    }>;
};
export declare function meteora_create_dlmm_balance_position(accountKeypair: Keypair, connection: Connection, poolAddress: string, tokenXMint: string, tokenXAmount: number): Promise<{
    txId: string;
}>;
export {};
//# sourceMappingURL=createDlmmBalancePosition.d.ts.map