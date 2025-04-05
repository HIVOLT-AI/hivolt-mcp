"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrcaGetPositionTool = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const zod_1 = require("zod");
const bs58_1 = __importDefault(require("bs58"));
const env_1 = require("../../env");
const rpc_1 = require("../../constants/rpc");
const web3_js_1 = require("@solana/web3.js");
const whirlpools_sdk_1 = require("@orca-so/whirlpools-sdk");
const OrcaGetPositionToolParams = zod_1.z.object({});
exports.OrcaGetPositionTool = {
    name: "ORCA_GET_POSITION",
    description: "Get the position of the Orca pool",
    parameters: {},
    execute: async ({}) => {
        try {
            const secretKey = bs58_1.default.decode(env_1.ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
            const connection = new web3_js_1.Connection(rpc_1.RPC_URL.HELIUS);
            const keypair = web3_js_1.Keypair.fromSecretKey(secretKey);
            const wallet = new anchor_1.Wallet(keypair);
            const ctx = whirlpools_sdk_1.WhirlpoolContext.from(connection, wallet, whirlpools_sdk_1.ORCA_WHIRLPOOL_PROGRAM_ID);
            const client = (0, whirlpools_sdk_1.buildWhirlpoolClient)(ctx);
            const positions = await (0, whirlpools_sdk_1.getAllPositionAccountsByOwner)({
                ctx,
                owner: keypair.publicKey,
            });
            const positionDatas = [
                ...positions.positions.entries(),
                ...positions.positionsWithTokenExtensions.entries(),
            ];
            const result = {};
            for (const [, positionData] of positionDatas) {
                const positionMintAddress = positionData.positionMint;
                const whirlpoolAddress = positionData.whirlpool;
                const whirlpool = await client.getPool(whirlpoolAddress);
                const whirlpoolData = whirlpool.getData();
                const sqrtPrice = whirlpoolData.sqrtPrice;
                const currentTick = whirlpoolData.tickCurrentIndex;
                const mintA = whirlpool.getTokenAInfo();
                const mintB = whirlpool.getTokenBInfo();
                const currentPrice = whirlpools_sdk_1.PriceMath.sqrtPriceX64ToPrice(sqrtPrice, mintA.decimals, mintB.decimals);
                const lowerTick = positionData.tickLowerIndex;
                const upperTick = positionData.tickUpperIndex;
                const lowerPrice = whirlpools_sdk_1.PriceMath.tickIndexToPrice(lowerTick, mintA.decimals, mintB.decimals);
                const upperPrice = whirlpools_sdk_1.PriceMath.tickIndexToPrice(upperTick, mintA.decimals, mintB.decimals);
                const centerPosition = lowerPrice.add(upperPrice).div(2);
                const positionInRange = currentTick > lowerTick && currentTick < upperTick ? true : false;
                const distanceFromCenterBps = Math.ceil(currentPrice
                    .sub(centerPosition)
                    .abs()
                    .div(centerPosition)
                    .mul(10000)
                    .toNumber());
                result[positionMintAddress.toString()] = {
                    whirlpoolAddress: whirlpoolAddress.toString(),
                    positionInRange,
                    distanceFromCenterBps,
                };
            }
            return result;
        }
        catch (error) {
            return error.message;
        }
    },
};
//# sourceMappingURL=getPosition.js.map