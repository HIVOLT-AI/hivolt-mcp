import { Wallet } from "@coral-xyz/anchor";
import { z } from "zod";
import bs58 from "bs58";
import { ENV } from "src/env";
import { RPC_URL } from "src/constants/rpc";
import { Connection, Keypair } from "@solana/web3.js";
import {
  buildWhirlpoolClient,
  getAllPositionAccountsByOwner,
  ORCA_WHIRLPOOL_PROGRAM_ID,
  PriceMath,
  WhirlpoolContext,
} from "@orca-so/whirlpools-sdk";
import { OrcaPositionDataMap } from "src/types/orca";

const OrcaGetPositionToolParams = z.object({});

export type OrcaGetPositionToolParams = z.infer<
  typeof OrcaGetPositionToolParams
>;

export const OrcaGetPositionTool = {
  name: "ORCA_GET_POSITION",
  description: "Get the position of the Orca pool",
  parameters: {},
  execute: async ({}: OrcaGetPositionToolParams) => {
    try {
      const secretKey = bs58.decode(ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
      const connection = new Connection(RPC_URL.HELIUS);
      const keypair = Keypair.fromSecretKey(secretKey);

      const wallet = new Wallet(keypair);
      const ctx = WhirlpoolContext.from(
        connection,
        wallet,
        ORCA_WHIRLPOOL_PROGRAM_ID
      );

      const client = buildWhirlpoolClient(ctx);
      const positions = await getAllPositionAccountsByOwner({
        ctx,
        owner: keypair.publicKey,
      });

      const positionDatas = [
        ...positions.positions.entries(),
        ...positions.positionsWithTokenExtensions.entries(),
      ];

      const result: OrcaPositionDataMap = {};

      for (const [, positionData] of positionDatas) {
        const positionMintAddress = positionData.positionMint;
        const whirlpoolAddress = positionData.whirlpool;
        const whirlpool = await client.getPool(whirlpoolAddress);
        const whirlpoolData = whirlpool.getData();
        const sqrtPrice = whirlpoolData.sqrtPrice;
        const currentTick = whirlpoolData.tickCurrentIndex;
        const mintA = whirlpool.getTokenAInfo();
        const mintB = whirlpool.getTokenBInfo();
        const currentPrice = PriceMath.sqrtPriceX64ToPrice(
          sqrtPrice,
          mintA.decimals,
          mintB.decimals
        );
        const lowerTick = positionData.tickLowerIndex;
        const upperTick = positionData.tickUpperIndex;
        const lowerPrice = PriceMath.tickIndexToPrice(
          lowerTick,
          mintA.decimals,
          mintB.decimals
        );
        const upperPrice = PriceMath.tickIndexToPrice(
          upperTick,
          mintA.decimals,
          mintB.decimals
        );
        const centerPosition = lowerPrice.add(upperPrice).div(2);

        const positionInRange =
          currentTick > lowerTick && currentTick < upperTick ? true : false;
        const distanceFromCenterBps = Math.ceil(
          currentPrice
            .sub(centerPosition)
            .abs()
            .div(centerPosition)
            .mul(10000)
            .toNumber()
        );

        result[positionMintAddress.toString()] = {
          whirlpoolAddress: whirlpoolAddress.toString(),
          positionInRange,
          distanceFromCenterBps,
        };
      }

      return result;
    } catch (error: any) {
      return error.message;
    }
  },
};
