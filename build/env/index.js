"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = exports.ENV_SCHEMA = exports.ENV_SHAPE = void 0;
const envalid_1 = require("envalid");
const joi_1 = __importDefault(require("joi"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.ENV_SHAPE = {
    PORT: "PORT",
    MONGODB_URL: "MONGODB_URL",
    MONGODB_PASSWORD: "MONGODB_PASSWORD",
    MONGODB_USERNAME: "MONGODB_USERNAME",
    OPENAI_API_KEY: "OPENAI_API_KEY",
    ANTHROPIC_API_KEY: "ANTHROPIC_API_KEY",
    HELIUS_API_KEY: "HELIUS_API_KEY",
    SOLANA_ACCOUNT_PRIVATE_KEY: "SOLANA_ACCOUNT_PRIVATE_KEY",
    EVM_ACCOUNT_PRIVATE_KEY: "EVM_ACCOUNT_PRIVATE_KEY",
    LULO_API_KEY: "LULO_API_KEY",
};
exports.ENV_SCHEMA = joi_1.default.object({
    PORT: joi_1.default.number().required(),
    MONGODB_URL: joi_1.default.string().required(),
    MONGODB_PASSWORD: joi_1.default.string().required(),
    MONGODB_USERNAME: joi_1.default.string().required(),
    OPENAI_API_KEY: joi_1.default.string().required(),
    ANTHROPIC_API_KEY: joi_1.default.string().required(),
    HELIUS_API_KEY: joi_1.default.string().required(),
    SOLANA_ACCOUNT_PRIVATE_KEY: joi_1.default.string().required(),
    EVM_ACCOUNT_PRIVATE_KEY: joi_1.default.string().required(),
    LULO_API_KEY: joi_1.default.string().required(),
});
exports.ENV = (0, envalid_1.cleanEnv)(process.env, {
    PORT: (0, envalid_1.port)({ default: 3000 }),
    MONGODB_URL: (0, envalid_1.str)(),
    MONGODB_PASSWORD: (0, envalid_1.str)(),
    MONGODB_USERNAME: (0, envalid_1.str)(),
    OPENAI_API_KEY: (0, envalid_1.str)(),
    ANTHROPIC_API_KEY: (0, envalid_1.str)(),
    HELIUS_API_KEY: (0, envalid_1.str)(),
    SOLANA_ACCOUNT_PRIVATE_KEY: (0, envalid_1.str)(),
    EVM_ACCOUNT_PRIVATE_KEY: (0, envalid_1.str)(),
    LULO_API_KEY: (0, envalid_1.str)(),
});
//# sourceMappingURL=index.js.map