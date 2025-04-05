"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaydiumCreateAmmV4Tool = void 0;
exports.raydium_create_amm_v4 = raydium_create_amm_v4;
const bytes_1 = require("@coral-xyz/anchor/dist/cjs/utils/bytes");
const web3_js_1 = require("@solana/web3.js");
const rpc_1 = require("../../constants/rpc");
const env_1 = require("../../env");
const zod_1 = require("zod");
const anchor_1 = require("@coral-xyz/anchor");
const raydium_sdk_v2_1 = require("@raydium-io/raydium-sdk-v2");
const raydium_sdk_v2_2 = require("@raydium-io/raydium-sdk-v2");
const spl_token_1 = require("@solana/spl-token");
const spl_token_2 = require("@solana/spl-token");
const RaydiumCreateAmmV4ToolParams = zod_1.z.object({
    marketId: zod_1.z.string(),
    baseAmount: zod_1.z.string(),
    quoteAmount: zod_1.z.string(),
    startTime: zod_1.z.string(),
});
exports.RaydiumCreateAmmV4Tool = {
    name: "RAYDIUM_CREATE_AMM_V4",
    description: "Create AMM V4 pool",
    parameters: {
        marketId: zod_1.z.string(),
        baseAmount: zod_1.z.string(),
        quoteAmount: zod_1.z.string(),
        startTime: zod_1.z.string(),
    },
    execute: async (input) => {
        const secretKey = bytes_1.bs58.decode(env_1.ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
        const connection = new web3_js_1.Connection(rpc_1.RPC_URL.HELIUS);
        const keypair = web3_js_1.Keypair.fromSecretKey(secretKey);
        return await raydium_create_amm_v4(keypair, connection, input.marketId, new anchor_1.BN(input.baseAmount), new anchor_1.BN(input.quoteAmount), new anchor_1.BN(input.startTime));
    },
};
async function raydium_create_amm_v4(accountKeypair, connection, marketId, baseAmount, quoteAmount, startTime) {
    try {
        const raydium = await raydium_sdk_v2_1.Raydium.load({
            owner: accountKeypair.publicKey,
            connection,
        });
        const marketBufferInfo = await connection.getAccountInfo(new web3_js_1.PublicKey(marketId));
        const { baseMint, quoteMint } = raydium_sdk_v2_2.MARKET_STATE_LAYOUT_V3.decode(marketBufferInfo.data);
        const baseMintInfo = await connection.getAccountInfo(baseMint);
        const quoteMintInfo = await connection.getAccountInfo(quoteMint);
        if (baseMintInfo?.owner.toString() !== spl_token_2.TOKEN_PROGRAM_ID.toBase58() ||
            quoteMintInfo?.owner.toString() !== spl_token_2.TOKEN_PROGRAM_ID.toBase58()) {
            throw new Error("amm pools with openbook market only support TOKEN_PROGRAM_ID mints, if you want to create pool with token-2022, please create cpmm pool instead");
        }
        if (baseAmount
            .mul(quoteAmount)
            .lte(new anchor_1.BN(1)
            .mul(new anchor_1.BN(10 ** spl_token_1.MintLayout.decode(baseMintInfo.data).decimals))
            .pow(new anchor_1.BN(2)))) {
            throw new Error("initial liquidity too low, try adding more baseAmount/quoteAmount");
        }
        const response = await raydium.liquidity.createPoolV4({
            programId: raydium_sdk_v2_2.AMM_V4,
            marketInfo: {
                marketId: new web3_js_1.PublicKey(marketId),
                programId: raydium_sdk_v2_2.OPEN_BOOK_PROGRAM,
            },
            baseMintInfo: {
                mint: baseMint,
                decimals: spl_token_1.MintLayout.decode(baseMintInfo.data).decimals,
            },
            quoteMintInfo: {
                mint: quoteMint,
                decimals: spl_token_1.MintLayout.decode(quoteMintInfo.data).decimals,
            },
            baseAmount,
            quoteAmount,
            startTime,
            ownerInfo: {
                useSOLBalance: true,
            },
            associatedOnly: false,
            txVersion: raydium_sdk_v2_1.TxVersion.V0,
            feeDestinationId: raydium_sdk_v2_2.FEE_DESTINATION_ID,
        });
        response.transaction.sign([accountKeypair]);
        const txId = await connection.sendTransaction(response.transaction, {
            maxRetries: 3,
        });
        return { txId };
    }
    catch (error) {
        console.error(error);
        throw new Error(`Failed to create AMM V4 pool: ${error.message}`);
    }
}
//# sourceMappingURL=createAmmV4.js.map