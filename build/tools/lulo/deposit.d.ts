import { Connection, Keypair } from "@solana/web3.js";
import { z } from "zod";
declare const LuloDepositToolParams: z.ZodObject<{
    mintAddress: z.ZodString;
    protectedAmount: z.ZodNumber;
    regularAmount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    mintAddress: string;
    protectedAmount: number;
    regularAmount: number;
}, {
    mintAddress: string;
    protectedAmount: number;
    regularAmount: number;
}>;
export type LuloDepositToolParams = z.infer<typeof LuloDepositToolParams>;
export declare const LuloDepositTool: {
    name: string;
    description: string;
    parameters: {
        mintAddress: z.ZodString;
        protectedAmount: z.ZodNumber;
        regularAmount: z.ZodNumber;
    };
    execute: (input: LuloDepositToolParams) => Promise<{
        txId: string;
    }>;
};
export declare function lulo_deposit(accountKeypair: Keypair, connection: Connection, mintAddress: string, protectedAmount?: number, regularAmount?: number): Promise<{
    txId: string;
}>;
export {};
//# sourceMappingURL=deposit.d.ts.map