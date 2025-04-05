"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RPC_URL = void 0;
const env_1 = require("../env");
exports.RPC_URL = {
    DEFAULT: "https://api.mainnet-beta.solana.com",
    HELIUS: `https://mainnet.helius-rpc.com/?api-key=${env_1.ENV.HELIUS_API_KEY}`,
};
//# sourceMappingURL=rpc.js.map