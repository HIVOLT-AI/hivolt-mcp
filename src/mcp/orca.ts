import {
  OrcaCreateClmmTool,
  OrcaCreateClmmToolParams,
} from "../tools/orca/createClmm";
import { OrcaOpenSingleSidePositionToolParams } from "../tools/orca/openSingleSidePosition";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  OrcaGetPositionTool,
  OrcaGetPositionToolParams,
} from "../tools/orca/getPosition";
import {
  OrcaOpenCenterPositionTool,
  OrcaOpenCenterPositionToolParams,
} from "../tools/orca/openCenterPosition";
import { OrcaOpenSingleSidePositionTool } from "../tools/orca/openSingleSidePosition";
import {
  OrcaClosePositionTool,
  OrcaClosePositionToolParams,
} from "../tools/orca/closePosition";

export const createOrcaMcpServer = () => {
  const server = new McpServer({
    name: "orca",
    version: "1.0.0",
  });

  server.tool(
    OrcaGetPositionTool.name,
    OrcaGetPositionTool.description,
    OrcaGetPositionTool.parameters,
    async ({}: OrcaGetPositionToolParams) => {
      const result = await OrcaGetPositionTool.execute({});

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result),
          },
        ],
      };
    }
  );

  server.tool(
    OrcaOpenCenterPositionTool.name,
    OrcaOpenCenterPositionTool.description,
    OrcaOpenCenterPositionTool.parameters,
    async ({
      whirlpoolAddress,
      priceOffsetBps,
      inputTokenMint,
      inputAmount,
    }: OrcaOpenCenterPositionToolParams) => {
      const result = await OrcaOpenCenterPositionTool.execute({
        whirlpoolAddress,
        priceOffsetBps,
        inputTokenMint,
        inputAmount,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result),
          },
        ],
      };
    }
  );

  server.tool(
    OrcaOpenSingleSidePositionTool.name,
    OrcaOpenSingleSidePositionTool.description,
    OrcaOpenSingleSidePositionTool.parameters,
    async ({
      whirlpoolAddress,
      distanceFromCurrentPriceBps,
      widthBps,
      inputTokenMint,
      inputAmount,
    }: OrcaOpenSingleSidePositionToolParams) => {
      const result = await OrcaOpenSingleSidePositionTool.execute({
        whirlpoolAddress,
        distanceFromCurrentPriceBps,
        widthBps,
        inputTokenMint,
        inputAmount,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result),
          },
        ],
      };
    }
  );

  server.tool(
    OrcaCreateClmmTool.name,
    OrcaCreateClmmTool.description,
    OrcaCreateClmmTool.parameters,
    async ({
      mint,
      pair,
      initialPrice,
      feeTier,
      network,
    }: OrcaCreateClmmToolParams) => {
      const result = await OrcaCreateClmmTool.execute({
        mint,
        pair,
        initialPrice,
        feeTier,
        network,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result),
          },
        ],
      };
    }
  );

  server.tool(
    OrcaClosePositionTool.name,
    OrcaClosePositionTool.description,
    OrcaClosePositionTool.parameters,
    async ({ positionMint }: OrcaClosePositionToolParams) => {
      const result = await OrcaClosePositionTool.execute({
        positionMint,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result),
          },
        ],
      };
    }
  );

  return server;
};
