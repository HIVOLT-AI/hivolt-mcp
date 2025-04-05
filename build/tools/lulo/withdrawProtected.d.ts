import { Connection, Keypair } from "@solana/web3.js";
import { z } from "zod";
declare const LuloWithdrawProtectedToolParams: z.ZodObject<{
    mintAddress: z.ZodString;
    amount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    amount: number;
    mintAddress: string;
}, {
    amount: number;
    mintAddress: string;
}>;
export type LuloWithdrawProtectedToolParams = z.infer<typeof LuloWithdrawProtectedToolParams>;
export declare const LuloWithdrawProtectedTool: {
    name: string;
    description: string;
    parameters: {
        mintAddress: z.ZodString;
        amount: z.ZodNumber;
    };
    execute: (input: LuloWithdrawProtectedToolParams) => Promise<{
        txId: string;
    }>;
};
export declare function lulo_withdraw_protected(accountKeypair: Keypair, connection: Connection, mintAddress: string, amount: number): Promise<{
    txId: string;
}>;
export {};
//# sourceMappingURL=withdrawProtected.d.ts.map