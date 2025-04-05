import { Keypair } from "@solana/web3.js";
export declare const LuloListPendingWithdrawalsBoostedOnlyTool: {
    name: string;
    description: string;
    parameters: {};
    execute: () => Promise<LuloPendingWithdrawalsDataResponse>;
};
export declare function lulo_list_pending_withdrawals_boosted_only(accountKeypair: Keypair): Promise<LuloPendingWithdrawalsDataResponse>;
type LuloPendingWithdrawalData = {
    withdrawalId: number;
    owner: string;
    mintAddress: string;
    nativeAmount: number;
    status: string;
    createdTimestamp: number;
    cooldownSeconds: number;
};
type LuloPendingWithdrawalsDataResponse = {
    pendingWithdrawals: LuloPendingWithdrawalData[];
};
export {};
//# sourceMappingURL=listPendingWithdrawalsBoostedOnly.d.ts.map