export declare const SolayerGetInfoTool: {
    name: string;
    description: string;
    parameters: {};
    execute: () => Promise<SolayerInfoResponse>;
};
type SolayerInfoResponse = {
    apy: number;
    depositors: number;
    epoch: number;
    epoch_diff_time: string;
    epoch_end_time: number;
    epoch_start_time: number;
    ssol_holders: number;
    ssol_to_sol: number;
    susd_apy: number;
    susd_holders: number;
    token_tvl_usd: Record<string, string>;
    tvl_sol: string;
    tvl_usd: string;
};
export {};
//# sourceMappingURL=getInfo.d.ts.map