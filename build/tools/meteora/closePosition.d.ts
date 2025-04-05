import { Connection, Keypair } from "@solana/web3.js";
import { z } from "zod";
declare const MeteoraClosePositionToolParams: z.ZodObject<{
    poolAddress: z.ZodString;
    positionAddress: z.ZodString;
}, "strip", z.ZodTypeAny, {
    poolAddress: string;
    positionAddress: string;
}, {
    poolAddress: string;
    positionAddress: string;
}>;
export type MeteoraClosePositionToolParams = z.infer<typeof MeteoraClosePositionToolParams>;
export declare const MeteoraClosePositionTool: {
    name: string;
    description: string;
    parameters: {
        poolAddress: z.ZodString;
        positionAddress: z.ZodString;
    };
    execute: (input: MeteoraClosePositionToolParams) => Promise<{
        txId: string;
    }>;
};
export declare function meteora_close_position(accountKeypair: Keypair, connection: Connection, poolAddress: string, positionAddress: string): Promise<{
    txId: string;
}>;
export {};
//# sourceMappingURL=closePosition.d.ts.map