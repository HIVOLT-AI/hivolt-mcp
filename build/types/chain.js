"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainSchema = exports.NetworkSchema = void 0;
const zod_1 = require("zod");
exports.NetworkSchema = zod_1.z.union([
    zod_1.z.literal("Mainnet"),
    zod_1.z.literal("Testnet"),
    zod_1.z.literal("Devnet"),
]);
exports.ChainSchema = zod_1.z.union([
    zod_1.z.literal("Solana"),
    zod_1.z.literal("Ethereum"),
]);
//# sourceMappingURL=chain.js.map