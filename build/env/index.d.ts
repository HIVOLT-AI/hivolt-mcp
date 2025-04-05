import Joi from "joi";
export declare const ENV_SHAPE: {
    readonly PORT: "PORT";
    readonly MONGODB_URL: "MONGODB_URL";
    readonly MONGODB_PASSWORD: "MONGODB_PASSWORD";
    readonly MONGODB_USERNAME: "MONGODB_USERNAME";
    readonly OPENAI_API_KEY: "OPENAI_API_KEY";
    readonly ANTHROPIC_API_KEY: "ANTHROPIC_API_KEY";
    readonly HELIUS_API_KEY: "HELIUS_API_KEY";
    readonly SOLANA_ACCOUNT_PRIVATE_KEY: "SOLANA_ACCOUNT_PRIVATE_KEY";
    readonly EVM_ACCOUNT_PRIVATE_KEY: "EVM_ACCOUNT_PRIVATE_KEY";
    readonly LULO_API_KEY: "LULO_API_KEY";
};
export declare const ENV_SCHEMA: Joi.ObjectSchema<any>;
export declare const ENV: Readonly<{
    PORT: number;
    MONGODB_URL: string;
    MONGODB_PASSWORD: string;
    MONGODB_USERNAME: string;
    OPENAI_API_KEY: string;
    ANTHROPIC_API_KEY: string;
    HELIUS_API_KEY: string;
    SOLANA_ACCOUNT_PRIVATE_KEY: string;
    EVM_ACCOUNT_PRIVATE_KEY: string;
    LULO_API_KEY: string;
} & import("envalid").CleanedEnvAccessors>;
//# sourceMappingURL=index.d.ts.map