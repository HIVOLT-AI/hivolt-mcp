import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  WormholeCreateWrappedTokenTool,
  WormholeCreateWrappedTokenToolParams,
} from "../tools/wormhole/createWrappedToken";
import {
  WormholeTransferTokenTool,
  WormholeTransferTokenToolParams,
} from "../tools/wormhole/transferToken";

export const createWormholeMcpServer = () => {
  const server = new McpServer({
    name: "wormhole",
    version: "1.0.0",
  });

  server.tool(
    WormholeTransferTokenTool.name,
    WormholeTransferTokenTool.description,
    WormholeTransferTokenTool.parameters,
    async ({
      destinationChain,
      tokenAddress,
      network,
      transferAmount,
    }: WormholeTransferTokenToolParams) => {
      const result = await WormholeTransferTokenTool.execute({
        destinationChain,
        tokenAddress,
        network,
        transferAmount,
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
    WormholeCreateWrappedTokenTool.name,
    WormholeCreateWrappedTokenTool.description,
    WormholeCreateWrappedTokenTool.parameters,
    async ({
      destinationChain,
      tokenAddress,
      network,
    }: WormholeCreateWrappedTokenToolParams) => {
      const result = await WormholeCreateWrappedTokenTool.execute({
        destinationChain,
        tokenAddress,
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

  return server;
};
