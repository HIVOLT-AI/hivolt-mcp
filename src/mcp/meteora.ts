import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { MeteoraClosePositionTool, MeteoraClosePositionToolParams } from "src/tools/meteora/closePosition";
import { MeteoraCreateDlmmBalancePositionTool, MeteoraCreateDlmmBalancePositionToolParams } from "src/tools/meteora/createDlmmBalancePosition";
import { MeteoraCreateDlmmImbalancePositionTool, MeteoraCreateDlmmImbalancePositionToolParams } from "src/tools/meteora/createDlmmImbalancePosition";
import { MeteoraCreateDlmmOneSidePositionTool, MeteoraCreateDlmmOneSidePositionToolParams } from "src/tools/meteora/createDlmmOneSidePosition";
import { MeteoraGetDlmmPoolTool, MeteoraGetDlmmPoolToolParams } from "src/tools/meteora/getDlmmPool";
import { MeteoraGetListOfPositionsTool, MeteoraGetListOfPositionsToolParams } from "src/tools/meteora/getListOfPositions";

export const createMeteoraMcpServer = () => {
  const server = new McpServer({
    name: "meteora",
    version: "1.0.0",
  });

  server.tool(
    MeteoraClosePositionTool.name,
    MeteoraClosePositionTool.description,
    MeteoraClosePositionTool.parameters,
    async ({ poolAddress, positionAddress }: MeteoraClosePositionToolParams) => {
      const result = await MeteoraClosePositionTool.execute({ poolAddress, positionAddress });
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
    MeteoraCreateDlmmBalancePositionTool.name,
    MeteoraCreateDlmmBalancePositionTool.description,
    MeteoraCreateDlmmBalancePositionTool.parameters,
    async ({ poolAddress, tokenXMint, tokenXAmount }: MeteoraCreateDlmmBalancePositionToolParams) => {
      const result = await MeteoraCreateDlmmBalancePositionTool.execute({ poolAddress, tokenXMint, tokenXAmount });
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
    MeteoraCreateDlmmImbalancePositionTool.name,
    MeteoraCreateDlmmImbalancePositionTool.description,
    MeteoraCreateDlmmImbalancePositionTool.parameters,
    async ({ poolAddress, tokenXMint, tokenXAmount, solAmount }
      : MeteoraCreateDlmmImbalancePositionToolParams) => {
      const result = await MeteoraCreateDlmmImbalancePositionTool.execute({
        poolAddress, tokenXMint, tokenXAmount, solAmount,
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
    MeteoraCreateDlmmOneSidePositionTool.name,
    MeteoraCreateDlmmOneSidePositionTool.description,
    MeteoraCreateDlmmOneSidePositionTool.parameters,
    async ({ poolAddress, tokenXMint, tokenXAmount }: MeteoraCreateDlmmOneSidePositionToolParams) => {
      const result = await MeteoraCreateDlmmOneSidePositionTool.execute({ poolAddress, tokenXMint, tokenXAmount });
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
    MeteoraGetDlmmPoolTool.name,
    MeteoraGetDlmmPoolTool.description,
    MeteoraGetDlmmPoolTool.parameters,
    async ({ poolAddress }: MeteoraGetDlmmPoolToolParams) => {
      const result = await MeteoraGetDlmmPoolTool.execute({ poolAddress });
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
    MeteoraGetListOfPositionsTool.name,
    MeteoraGetListOfPositionsTool.description,
    MeteoraGetListOfPositionsTool.parameters,
    async ({ poolAddress }: MeteoraGetListOfPositionsToolParams) => {
      const result = await MeteoraGetListOfPositionsTool.execute({ poolAddress });
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
