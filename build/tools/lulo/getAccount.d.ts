import { Keypair } from "@solana/web3.js";
export declare const LuloGetAccountTool: {
    name: string;
    description: string;
    parameters: {};
    execute: () => Promise<LuloAccountData>;
};
export declare function lulo_get_account(accountKeypair: Keypair): Promise<LuloAccountData>;
type LuloAccountData = {
    totalUsdValue: number;
    lusdUsdBalance: number;
    pusdUsdBalance: number;
    maxWithdrawable: {
        protected: Record<string, number>;
        regular: Record<string, number>;
    };
    totalInterestEarned: number;
    protectedInterestEarned: number;
    regularInterestEarned: number;
    blockTime: number;
};
export {};
//# sourceMappingURL=getAccount.d.ts.map