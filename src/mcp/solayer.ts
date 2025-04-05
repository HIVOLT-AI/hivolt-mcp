import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  SolayerGetInfoTool,
  //SolayerGetInfoToolParams,
} from "../tools/solayer/getInfo";
import {
  SolayerStakeWithSolayerTool,
  SolayerStakeWithSolayerToolParams,
} from "../tools/solayer/stakeWithSolayer";

export const createSolayerMcpServer = () => {
  const server = new McpServer({
    name: "solayer",
    version: "1.0.0",
  });

  server.tool(
    SolayerGetInfoTool.name,
    SolayerGetInfoTool.description,
    SolayerGetInfoTool.parameters,
    async () => {
      const result = await SolayerGetInfoTool.execute();
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
    SolayerStakeWithSolayerTool.name,
    SolayerStakeWithSolayerTool.description,
    SolayerStakeWithSolayerTool.parameters,
    async ({ amount }: SolayerStakeWithSolayerToolParams) => {
      const result = await SolayerStakeWithSolayerTool.execute({ amount });
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
