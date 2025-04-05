import { z } from "zod";
declare const MeteoraGetDlmmPoolToolParams: z.ZodObject<{
    poolAddress: z.ZodString;
}, "strip", z.ZodTypeAny, {
    poolAddress: string;
}, {
    poolAddress: string;
}>;
export type MeteoraGetDlmmPoolToolParams = z.infer<typeof MeteoraGetDlmmPoolToolParams>;
export declare const MeteoraGetDlmmPoolTool: {
    name: string;
    description: string;
    parameters: {
        poolAddress: z.ZodString;
    };
    execute: (input: MeteoraGetDlmmPoolToolParams) => Promise<DlmmPoolInfo>;
};
export declare function meteora_get_dlmm_pool(poolAddress: string): Promise<DlmmPoolInfo>;
type DlmmPoolInfo = {
    address: string;
    name: string;
    mint_x: string;
    mint_y: string;
    reserve_x: string;
    reserve_y: string;
    reserve_x_amount: number;
    reserve_y_amount: number;
    bin_step: number;
    base_fee_percentage: string;
    max_fee_percentage: string;
    protocol_fee_percentage: string;
    liquidity: string;
    reward_mint_x: string;
    reward_mint_y: string;
    fees_24h: number;
    today_fees: number;
    trade_volume_24h: number;
    cumulative_trade_volume: number;
    cumulative_fee_volume: number;
    current_price: number;
    apr: number;
    apy: number;
    farm_apr: number;
    farm_apy: number;
    hide: boolean;
    is_blacklisted: boolean;
    fees: {
        min_30: number;
        hour_1: number;
        hour_2: number;
        hour_4: number;
        hour_12: number;
        hour_24: number;
    };
    fee_tvl_ratio: {
        min_30: number;
        hour_1: number;
        hour_2: number;
        hour_4: number;
        hour_12: number;
        hour_24: number;
    };
    volume: {
        min_30: number;
        hour_1: number;
        hour_2: number;
        hour_4: number;
        hour_12: number;
        hour_24: number;
    };
    tags: string[];
};
export {};
//# sourceMappingURL=getDlmmPool.d.ts.map