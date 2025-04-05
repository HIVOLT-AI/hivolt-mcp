export declare const LuloGetRatesTool: {
    name: string;
    description: string;
    parameters: {};
    execute: () => Promise<LuloRateData>;
};
export declare function lulo_get_rates(): Promise<LuloRateData>;
type LuloRateData = {
    regular: {
        CURRENT: number;
        "1HR": number;
        "1YR": number;
        "24HR": number;
        "30DAY": number;
        "7DAY": number;
    };
    protected: {
        CURRENT: number;
        "1HR": number;
        "1YR": number;
        "24HR": number;
        "30DAY": number;
        "7DAY": number;
    };
};
export {};
//# sourceMappingURL=getRates.d.ts.map