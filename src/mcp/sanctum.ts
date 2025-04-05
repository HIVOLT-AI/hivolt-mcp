import { SanctumRemoveLiquidityToolParams } from "../tools/sanctum/removeLiquidity";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  SanctumAddLiquidityTool,
  SanctumAddLiquidityToolParams,
} from "../tools/sanctum/addLiquidity";
import {
  SanctumGetApyTool,
  SanctumGetApyToolParams,
} from "../tools/sanctum/getApy";
import {
  SanctumGetPriceTool,
  SanctumGetPriceToolParams,
} from "../tools/sanctum/getPrice";
import {
  SanctumGetTvlTool,
  SanctumGetTvlToolParams,
} from "../tools/sanctum/getTvl";
import { SanctumRemoveLiquidityTool } from "../tools/sanctum/removeLiquidity";
import {
  SanctumGetOwnedLST,
  SanctumGetOwnedLSTParams,
} from "../tools/sanctum/getOwnedLst";

export const createSanctumMcpServer = () => {
  const server = new McpServer({
    name: "sanctum",
    version: "1.0.0",
  });

  server.tool(
    SanctumGetPriceTool.name,
    SanctumGetPriceTool.description,
    SanctumGetPriceTool.parameters,
    async ({ inputs }: SanctumGetPriceToolParams) => {
      const result = await SanctumGetPriceTool.execute({ inputs });

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
    SanctumGetApyTool.name,
    SanctumGetApyTool.description,
    SanctumGetApyTool.parameters,
    async ({ inputs }: SanctumGetApyToolParams) => {
      const result = await SanctumGetApyTool.execute({ inputs });
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
    SanctumGetTvlTool.name,
    SanctumGetTvlTool.description,
    SanctumGetTvlTool.parameters,
    async ({ inputs }: SanctumGetTvlToolParams) => {
      const result = await SanctumGetTvlTool.execute({ inputs });
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
    SanctumAddLiquidityTool.name,
    SanctumAddLiquidityTool.description,
    SanctumAddLiquidityTool.parameters,
    async ({
      lstMint,
      amount,
      quotedAmount,
      priorityFee,
    }: SanctumAddLiquidityToolParams) => {
      const result = await SanctumAddLiquidityTool.execute({
        lstMint,
        amount,
        quotedAmount,
        priorityFee,
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
    SanctumRemoveLiquidityTool.name,
    SanctumRemoveLiquidityTool.description,
    SanctumRemoveLiquidityTool.parameters,
    async ({
      lstMint,
      amount,
      quotedAmount,
      priorityFee,
    }: SanctumRemoveLiquidityToolParams) => {
      const result = await SanctumRemoveLiquidityTool.execute({
        lstMint,
        amount,
        quotedAmount,
        priorityFee,
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
    SanctumGetOwnedLST.name,
    SanctumGetOwnedLST.description,
    SanctumGetOwnedLST.parameters,
    async ({}: SanctumGetOwnedLSTParams) => {
      const result = await SanctumGetOwnedLST.execute();

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
