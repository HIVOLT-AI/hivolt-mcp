import { Connection, Keypair } from "@solana/web3.js";
import { z } from "zod";
declare const LuloInitiateWithdrawalBoostedOnlyToolParams: z.ZodObject<{
    mintAddress: z.ZodString;
    amount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    amount: number;
    mintAddress: string;
}, {
    amount: number;
    mintAddress: string;
}>;
export type LuloInitiateWithdrawalBoostedOnlyToolParams = z.infer<typeof LuloInitiateWithdrawalBoostedOnlyToolParams>;
export declare const LuloInitiateWithdrawalBoostedOnlyTool: {
    name: string;
    description: string;
    parameters: {
        mintAddress: z.ZodString;
        amount: z.ZodNumber;
    };
    execute: (input: LuloInitiateWithdrawalBoostedOnlyToolParams) => Promise<{
        txId: string;
    }>;
};
export declare function lulo_initiate_withdrawal_boosted_only(accountKeypair: Keypair, connection: Connection, mintAddress: string, amount: number): Promise<{
    txId: string;
}>;
export {};
//# sourceMappingURL=initiateWithdrawalBoostedOnly.d.ts.map