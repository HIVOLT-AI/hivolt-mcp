import { PositionBinData } from "@meteora-ag/dlmm";
import { Connection, Keypair } from "@solana/web3.js";
import { z } from "zod";
declare const MeteoraGetListOfPositionsToolParams: z.ZodObject<{
    poolAddress: z.ZodString;
}, "strip", z.ZodTypeAny, {
    poolAddress: string;
}, {
    poolAddress: string;
}>;
export type MeteoraGetListOfPositionsToolParams = z.infer<typeof MeteoraGetListOfPositionsToolParams>;
export declare const MeteoraGetListOfPositionsTool: {
    name: string;
    description: string;
    parameters: {
        poolAddress: z.ZodString;
    };
    execute: (input: MeteoraGetListOfPositionsToolParams) => Promise<PositionBinData[]>;
};
export declare function meteora_get_list_of_positions(accountKeypair: Keypair, connection: Connection, poolAddress: string): Promise<PositionBinData[]>;
export {};
//# sourceMappingURL=getListOfPositions.d.ts.map