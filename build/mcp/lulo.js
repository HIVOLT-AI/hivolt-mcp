"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLuloMcpServer = void 0;
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const completeWithdrawalBoostedOnly_1 = require("../tools/lulo/completeWithdrawalBoostedOnly");
const deposit_1 = require("../tools/lulo/deposit");
const getAccount_1 = require("../tools/lulo/getAccount");
const getPools_1 = require("../tools/lulo/getPools");
const getRates_1 = require("../tools/lulo/getRates");
const initiateWithdrawalBoostedOnly_1 = require("../tools/lulo/initiateWithdrawalBoostedOnly");
const listPendingWithdrawalsBoostedOnly_1 = require("../tools/lulo/listPendingWithdrawalsBoostedOnly");
const withdrawProtected_1 = require("../tools/lulo/withdrawProtected");
const createLuloMcpServer = () => {
    const server = new mcp_js_1.McpServer({
        name: "lulo",
        version: "1.0.0",
    });
    server.tool(completeWithdrawalBoostedOnly_1.LuloCompleteWithdrawalBoostedOnlyTool.name, completeWithdrawalBoostedOnly_1.LuloCompleteWithdrawalBoostedOnlyTool.description, completeWithdrawalBoostedOnly_1.LuloCompleteWithdrawalBoostedOnlyTool.parameters, async ({ pendingWithdrawalId, }) => {
        const result = await completeWithdrawalBoostedOnly_1.LuloCompleteWithdrawalBoostedOnlyTool.execute({
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
    });
    server.tool(deposit_1.LuloDepositTool.name, deposit_1.LuloDepositTool.description, deposit_1.LuloDepositTool.parameters, async ({ mintAddress, protectedAmount, regularAmount, }) => {
        const result = await deposit_1.LuloDepositTool.execute({
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
    });
    server.tool(getAccount_1.LuloGetAccountTool.name, getAccount_1.LuloGetAccountTool.description, getAccount_1.LuloGetAccountTool.parameters, async () => {
        const result = await getAccount_1.LuloGetAccountTool.execute();
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result),
                },
            ],
        };
    });
    server.tool(getPools_1.LuloGetPoolsTool.name, getPools_1.LuloGetPoolsTool.description, getPools_1.LuloGetPoolsTool.parameters, async () => {
        const result = await getPools_1.LuloGetPoolsTool.execute();
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result),
                },
            ],
        };
    });
    server.tool(getRates_1.LuloGetRatesTool.name, getRates_1.LuloGetRatesTool.description, getRates_1.LuloGetRatesTool.parameters, async () => {
        const result = await getRates_1.LuloGetRatesTool.execute();
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result),
                },
            ],
        };
    });
    server.tool(initiateWithdrawalBoostedOnly_1.LuloInitiateWithdrawalBoostedOnlyTool.name, initiateWithdrawalBoostedOnly_1.LuloInitiateWithdrawalBoostedOnlyTool.description, initiateWithdrawalBoostedOnly_1.LuloInitiateWithdrawalBoostedOnlyTool.parameters, async ({ mintAddress, amount, }) => {
        const result = await initiateWithdrawalBoostedOnly_1.LuloInitiateWithdrawalBoostedOnlyTool.execute({
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
    });
    server.tool(listPendingWithdrawalsBoostedOnly_1.LuloListPendingWithdrawalsBoostedOnlyTool.name, listPendingWithdrawalsBoostedOnly_1.LuloListPendingWithdrawalsBoostedOnlyTool.description, listPendingWithdrawalsBoostedOnly_1.LuloListPendingWithdrawalsBoostedOnlyTool.parameters, async () => {
        const result = await listPendingWithdrawalsBoostedOnly_1.LuloListPendingWithdrawalsBoostedOnlyTool.execute();
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result),
                },
            ],
        };
    });
    server.tool(withdrawProtected_1.LuloWithdrawProtectedTool.name, withdrawProtected_1.LuloWithdrawProtectedTool.description, withdrawProtected_1.LuloWithdrawProtectedTool.parameters, async ({ mintAddress, amount }) => {
        const result = await withdrawProtected_1.LuloWithdrawProtectedTool.execute({
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
    });
    return server;
};
exports.createLuloMcpServer = createLuloMcpServer;
//# sourceMappingURL=lulo.js.map