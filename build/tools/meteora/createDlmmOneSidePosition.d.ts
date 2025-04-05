import { Connection, Keypair } from "@solana/web3.js";
import { z } from "zod";
declare const MeteoraCreateDlmmOneSidePositionToolParams: z.ZodObject<{
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
export type MeteoraCreateDlmmOneSidePositionToolParams = z.infer<typeof MeteoraCreateDlmmOneSidePositionToolParams>;
export declare const MeteoraCreateDlmmOneSidePositionTool: {
    name: string;
    description: string;
    parameters: {
        poolAddress: z.ZodString;
        tokenXMint: z.ZodString;
        tokenXAmount: z.ZodNumber;
    };
    execute: (input: MeteoraCreateDlmmOneSidePositionToolParams) => Promise<{
        txId: string;
    }>;
};
export declare function meteora_create_dlmm_one_side_position(accountKeypair: Keypair, connection: Connection, poolAddress: string, tokenXMint: string, tokenXAmount: number): Promise<{
    txId: string;
}>;
export {};
//# sourceMappingURL=createDlmmOneSidePosition.d.ts.map