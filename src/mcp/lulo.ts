import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  LuloCompleteWithdrawalBoostedOnlyTool,
  LuloCompleteWithdrawalBoostedOnlyToolParams,
} from "../tools/lulo/completeWithdrawalBoostedOnly";
import { LuloDepositTool, LuloDepositToolParams } from "../tools/lulo/deposit";
import { LuloGetAccountTool } from "../tools/lulo/getAccount";
import { LuloGetPoolsTool } from "../tools/lulo/getPools";
import { LuloGetRatesTool } from "../tools/lulo/getRates";
import { LuloInitiateWithdrawalBoostedOnlyToolParams } from "../tools/lulo/initiateWithdrawalBoostedOnly";
import { LuloInitiateWithdrawalBoostedOnlyTool } from "../tools/lulo/initiateWithdrawalBoostedOnly";
import { LuloListPendingWithdrawalsBoostedOnlyTool } from "../tools/lulo/listPendingWithdrawalsBoostedOnly";
import { LuloWithdrawProtectedTool } from "../tools/lulo/withdrawProtected";
import { LuloWithdrawProtectedToolParams } from "../tools/lulo/withdrawProtected";

export const createLuloMcpServer = () => {
  const server = new McpServer({
    name: "lulo",
    version: "1.0.0",
  });

  server.tool(
    LuloCompleteWithdrawalBoostedOnlyTool.name,
    LuloCompleteWithdrawalBoostedOnlyTool.description,
    LuloCompleteWithdrawalBoostedOnlyTool.parameters,
    async ({
      pendingWithdrawalId,
    }: LuloCompleteWithdrawalBoostedOnlyToolParams) => {
      const result = await LuloCompleteWithdrawalBoostedOnlyTool.execute({
        pendingWithdrawalId,
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
    LuloDepositTool.name,
    LuloDepositTool.description,
    LuloDepositTool.parameters,
    async ({
      mintAddress,
      protectedAmount,
      regularAmount,
    }: LuloDepositToolParams) => {
      const result = await LuloDepositTool.execute({
        mintAddress,
        protectedAmount,
        regularAmount,
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
    LuloGetAccountTool.name,
    LuloGetAccountTool.description,
    LuloGetAccountTool.parameters,
    async () => {
      const result = await LuloGetAccountTool.execute();
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
    LuloGetPoolsTool.name,
    LuloGetPoolsTool.description,
    LuloGetPoolsTool.parameters,
    async () => {
      const result = await LuloGetPoolsTool.execute();
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
    LuloGetRatesTool.name,
    LuloGetRatesTool.description,
    LuloGetRatesTool.parameters,
    async () => {
      const result = await LuloGetRatesTool.execute();
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
    LuloInitiateWithdrawalBoostedOnlyTool.name,
    LuloInitiateWithdrawalBoostedOnlyTool.description,
    LuloInitiateWithdrawalBoostedOnlyTool.parameters,
    async ({
      mintAddress,
      amount,
    }: LuloInitiateWithdrawalBoostedOnlyToolParams) => {
      const result = await LuloInitiateWithdrawalBoostedOnlyTool.execute({
        mintAddress,
        amount,
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
    LuloListPendingWithdrawalsBoostedOnlyTool.name,
    LuloListPendingWithdrawalsBoostedOnlyTool.description,
    LuloListPendingWithdrawalsBoostedOnlyTool.parameters,
    async () => {
      const result = await LuloListPendingWithdrawalsBoostedOnlyTool.execute();
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
    LuloWithdrawProtectedTool.name,
    LuloWithdrawProtectedTool.description,
    LuloWithdrawProtectedTool.parameters,
    async ({ mintAddress, amount }: LuloWithdrawProtectedToolParams) => {
      const result = await LuloWithdrawProtectedTool.execute({
        mintAddress,
        amount,
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
