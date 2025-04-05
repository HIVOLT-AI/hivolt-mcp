"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaydiumCreateClmmTool = void 0;
exports.raydium_create_clmm = raydium_create_clmm;
const bytes_1 = require("@coral-xyz/anchor/dist/cjs/utils/bytes");
const web3_js_1 = require("@solana/web3.js");
const rpc_1 = require("../../constants/rpc");
const env_1 = require("../../env");
const zod_1 = require("zod");
const anchor_1 = require("@coral-xyz/anchor");
const raydium_sdk_v2_1 = require("@raydium-io/raydium-sdk-v2");
const spl_token_1 = require("@solana/spl-token");
const decimal_js_1 = __importDefault(require("decimal.js"));
const RaydiumCreateClmmToolParams = zod_1.z.object({
    mint1: zod_1.z.string(),
    mint2: zod_1.z.string(),
    configId: zod_1.z.string(),
    initialPrice: zod_1.z.string(),
    startTime: zod_1.z.string(),
});
exports.RaydiumCreateClmmTool = {
    name: "RAYDIUM_CREATE_CLMM",
    description: "Create CLMM pool",
    parameters: {
        mint1: zod_1.z.string(),
        mint2: zod_1.z.string(),
        configId: zod_1.z.string(),
        initialPrice: zod_1.z.string(),
        startTime: zod_1.z.string(),
    },
    execute: async (input) => {
        const secretKey = bytes_1.bs58.decode(env_1.ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
        const connection = new web3_js_1.Connection(rpc_1.RPC_URL.HELIUS);
        const keypair = web3_js_1.Keypair.fromSecretKey(secretKey);
        return await raydium_create_clmm(keypair, connection, new web3_js_1.PublicKey(input.mint1), new web3_js_1.PublicKey(input.mint2), new web3_js_1.PublicKey(input.configId), new decimal_js_1.default(input.initialPrice), new anchor_1.BN(input.startTime));
    },
};
async function raydium_create_clmm(accountKeypair, connection, mint1, mint2, configId, // V4 CLMM Config ID: 6J2X5j8iGUE9rPpy8h52u9dfy85vPMU8aF4D2KYfrc4h
initialPrice, startTime) {
    try {
        const raydium = await raydium_sdk_v2_1.Raydium.load({
            owner: accountKeypair.publicKey,
            connection,
        });
        const [mintInfo1, mintInfo2] = await connection.getMultipleAccountsInfo([
            mint1,
            mint2,
        ]);
        if (mintInfo1 === null || mintInfo2 === null) {
            throw Error("fetch mint info error");
        }
        const mintDecodeInfo1 = spl_token_1.MintLayout.decode(mintInfo1.data);
        const mintDecodeInfo2 = spl_token_1.MintLayout.decode(mintInfo2.data);
        const mintFormatInfo1 = {
            chainId: 101,
            address: mint1.toString(),
            programId: mintInfo1.owner.toString(),
            logoURI: "",
            symbol: "",
            name: "",
            decimals: mintDecodeInfo1.decimals,
            tags: [],
            extensions: {},
        };
        const mintFormatInfo2 = {
            chainId: 101,
            address: mint2.toString(),
            programId: mintInfo2.owner.toString(),
            logoURI: "",
            symbol: "",
            name: "",
            decimals: mintDecodeInfo2.decimals,
            tags: [],
            extensions: {},
        };
        const response = await raydium.clmm.createPool({
            programId: raydium_sdk_v2_1.CLMM_PROGRAM_ID,
            // programId: DEVNET_PROGRAM_ID.CLMM,
            mint1: mintFormatInfo1,
            mint2: mintFormatInfo2,
            // @ts-expect-error sdk bug
            ammConfig: { id: configId },
            initialPrice,
            startTime,
            txVersion: raydium_sdk_v2_1.TxVersion.V0,
            // computeBudgetConfig: {
            //   units: 600000,
            //   microLamports: 46591500,
            // },
        });
        response.transaction.sign([accountKeypair]);
        const txId = await connection.sendTransaction(response.transaction, {
            maxRetries: 3,
        });
        return { txId };
    }
    catch (error) {
        console.error(error);
        throw new Error(`Failed to create CLMM pool: ${error.message}`);
    }
}
//# sourceMappingURL=createClmm.js.map