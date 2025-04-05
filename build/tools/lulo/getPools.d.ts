export declare const LuloGetPoolsTool: {
    name: string;
    description: string;
    parameters: {};
    execute: () => Promise<LuloPoolData>;
};
export declare function lulo_get_pools(): Promise<LuloPoolData>;
type LuloPoolData = {
    regular: {
        type: string;
        apy: number;
        maxWithdrawalAmount: number;
        price: number;
    };
    protected: {
        type: string;
        apy: number;
        openCapacity: number;
        price: number;
    };
    averagePoolRate: number;
    totalLiquidity: number;
    availableLiquidity: number;
    regularLiquidityAmount: number;
    protectedLiquidityAmount: number;
    regularAvailableAmount: number;
};
export {};
//# sourceMappingURL=getPools.d.ts.map