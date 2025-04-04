import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SolanaGetBalanceTool } from "src/tools/solana/getBalance";
import { SolanaGetOwnedTokenTool } from "src/tools/solana/getOwnedToken";
import {
  SolanaGetTokenBalanceTool,
  SolanaGetTokenBalanceToolParams,
} from "src/tools/solana/getTokenBalance";
import {
  SolanaTransferTool,
  SolanaTransferToolParams,
} from "src/tools/solana/transfer";
import {
  SolanaTransferTokenTool,
  SolanaTransferTokenToolParams,
} from "src/tools/solana/transferToken";

export const createSolanaMcpServer = () => {
  const server = new McpServer({
    name: "solana",
    version: "1.0.0",
  });

  server.tool(
    SolanaGetBalanceTool.name,
    SolanaGetBalanceTool.description,
    SolanaGetBalanceTool.parameters,
    async () => {
      const result = await SolanaGetBalanceTool.execute({});

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
    SolanaGetOwnedTokenTool.name,
    SolanaGetOwnedTokenTool.description,
    SolanaGetOwnedTokenTool.parameters,
    async () => {
      const result = await SolanaGetOwnedTokenTool.execute({});

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
    SolanaGetTokenBalanceTool.name,
    SolanaGetTokenBalanceTool.description,
    SolanaGetTokenBalanceTool.parameters,
    async ({ tokenAddress }: SolanaGetTokenBalanceToolParams) => {
      const result = await SolanaGetTokenBalanceTool.execute({ tokenAddress });

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
    SolanaTransferTool.name,
    SolanaTransferTool.description,
    SolanaTransferTool.parameters,
    async ({ to, amount, network }: SolanaTransferToolParams) => {
      const result = await SolanaTransferTool.execute({ to, amount, network });

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
    SolanaTransferTokenTool.name,
    SolanaTransferTokenTool.description,
    SolanaTransferTokenTool.parameters,
    async ({
      to,
      amount,
      network,
      tokenAddress,
    }: SolanaTransferTokenToolParams) => {
      const result = await SolanaTransferTokenTool.execute({
        to,
        amount,
        network,
        tokenAddress,
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
