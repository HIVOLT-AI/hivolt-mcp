import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RaydiumCreateAmmV4Tool, RaydiumCreateAmmV4ToolParams } from "src/tools/raydium/createAmmV4";
import { RaydiumCreateClmmTool, RaydiumCreateClmmToolParams } from "src/tools/raydium/createClmm";
import { RaydiumCreateCpmmTool, RaydiumCreateCpmmToolParams } from "src/tools/raydium/createCpmm";

export const createRaydiumMcpServer = () => {
  const server = new McpServer({
    name: "raydium",
    version: "1.0.0",
  });

  server.tool(
    RaydiumCreateAmmV4Tool.name,
    RaydiumCreateAmmV4Tool.description,
    RaydiumCreateAmmV4Tool.parameters,
    async (input: RaydiumCreateAmmV4ToolParams) => {
      const result = await RaydiumCreateAmmV4Tool.execute(input);
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
    RaydiumCreateClmmTool.name,
    RaydiumCreateClmmTool.description,
    RaydiumCreateClmmTool.parameters,
    async (input: RaydiumCreateClmmToolParams) => {
      const result = await RaydiumCreateClmmTool.execute(input);
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
    RaydiumCreateCpmmTool.name,
    RaydiumCreateCpmmTool.description,
    RaydiumCreateCpmmTool.parameters,
    async (input: RaydiumCreateCpmmToolParams) => {
      const result = await RaydiumCreateCpmmTool.execute(input);
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
