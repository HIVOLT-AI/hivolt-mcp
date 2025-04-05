"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaydiumCreateCpmmTool = void 0;
exports.raydium_create_cpmm = raydium_create_cpmm;
const bytes_1 = require("@coral-xyz/anchor/dist/cjs/utils/bytes");
const web3_js_1 = require("@solana/web3.js");
const rpc_1 = require("../../constants/rpc");
const env_1 = require("../../env");
const zod_1 = require("zod");
const anchor_1 = require("@coral-xyz/anchor");
const raydium_sdk_v2_1 = require("@raydium-io/raydium-sdk-v2");
const spl_token_1 = require("@solana/spl-token");
const RaydiumCreateCpmmToolParams = zod_1.z.object({
    mintA: zod_1.z.string(),
    mintB: zod_1.z.string(),
    configId: zod_1.z.string(),
    mintAAmount: zod_1.z.string(),
    mintBAmount: zod_1.z.string(),
    startTime: zod_1.z.string(),
});
exports.RaydiumCreateCpmmTool = {
    name: "RAYDIUM_CREATE_CPMM",
    description: "Create CPMM pool",
    parameters: {
        mintA: zod_1.z.string(),
        mintB: zod_1.z.string(),
        configId: zod_1.z.string(),
        mintAAmount: zod_1.z.string(),
        mintBAmount: zod_1.z.string(),
        startTime: zod_1.z.string(),
    },
    execute: async (input) => {
        const secretKey = bytes_1.bs58.decode(env_1.ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
        const connection = new web3_js_1.Connection(rpc_1.RPC_URL.HELIUS);
        const keypair = web3_js_1.Keypair.fromSecretKey(secretKey);
        return await raydium_create_cpmm(keypair, connection, new web3_js_1.PublicKey(input.mintA), new web3_js_1.PublicKey(input.mintB), new web3_js_1.PublicKey(input.configId), new anchor_1.BN(input.mintAAmount), new anchor_1.BN(input.mintBAmount), new anchor_1.BN(input.startTime));
    },
};
async function raydium_create_cpmm(accountKeypair, connection, mintA, mintB, configId, mintAAmount, mintBAmount, startTime) {
    try {
        const raydium = await raydium_sdk_v2_1.Raydium.load({
            owner: accountKeypair.publicKey,
            connection,
        });
        const [mintInfoA, mintInfoB] = await connection.getMultipleAccountsInfo([
            mintA,
            mintB,
        ]);
        if (mintInfoA === null || mintInfoB === null) {
            throw Error("fetch mint info error");
        }
        const mintDecodeInfoA = spl_token_1.MintLayout.decode(mintInfoA.data);
        const mintDecodeInfoB = spl_token_1.MintLayout.decode(mintInfoB.data);
        const mintFormatInfoA = {
            chainId: 101,
            address: mintA.toString(),
            programId: mintInfoA.owner.toString(),
            logoURI: "",
            symbol: "",
            name: "",
            decimals: mintDecodeInfoA.decimals,
            tags: [],
            extensions: {},
        };
        const mintFormatInfoB = {
            chainId: 101,
            address: mintB.toString(),
            programId: mintInfoB.owner.toString(),
            logoURI: "",
            symbol: "",
            name: "",
            decimals: mintDecodeInfoB.decimals,
            tags: [],
            extensions: {},
        };
        const response = await raydium.cpmm.createPool({
            programId: raydium_sdk_v2_1.CREATE_CPMM_POOL_PROGRAM,
            poolFeeAccount: raydium_sdk_v2_1.CREATE_CPMM_POOL_FEE_ACC,
            mintA: mintFormatInfoA,
            mintB: mintFormatInfoB,
            mintAAmount,
            mintBAmount,
            startTime,
            //@ts-expect-error sdk bug
            feeConfig: { id: configId.toString() },
            associatedOnly: false,
            ownerInfo: {
                useSOLBalance: true,
            },
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
        throw new Error(`Failed to create CPMM pool: ${error.message}`);
    }
}
//# sourceMappingURL=createCpmm.js.map