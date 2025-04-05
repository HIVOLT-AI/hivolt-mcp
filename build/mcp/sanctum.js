"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSanctumMcpServer = void 0;
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const addLiquidity_1 = require("../tools/sanctum/addLiquidity");
const getApy_1 = require("../tools/sanctum/getApy");
const getPrice_1 = require("../tools/sanctum/getPrice");
const getTvl_1 = require("../tools/sanctum/getTvl");
const removeLiquidity_1 = require("../tools/sanctum/removeLiquidity");
const getOwnedLst_1 = require("../tools/sanctum/getOwnedLst");
const createSanctumMcpServer = () => {
    const server = new mcp_js_1.McpServer({
        name: "sanctum",
        version: "1.0.0",
    });
    server.tool(getPrice_1.SanctumGetPriceTool.name, getPrice_1.SanctumGetPriceTool.description, getPrice_1.SanctumGetPriceTool.parameters, async ({ inputs }) => {
        const result = await getPrice_1.SanctumGetPriceTool.execute({ inputs });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result),
                },
            ],
        };
    });
    server.tool(getApy_1.SanctumGetApyTool.name, getApy_1.SanctumGetApyTool.description, getApy_1.SanctumGetApyTool.parameters, async ({ inputs }) => {
        const result = await getApy_1.SanctumGetApyTool.execute({ inputs });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result),
                },
            ],
        };
    });
    server.tool(getTvl_1.SanctumGetTvlTool.name, getTvl_1.SanctumGetTvlTool.description, getTvl_1.SanctumGetTvlTool.parameters, async ({ inputs }) => {
        const result = await getTvl_1.SanctumGetTvlTool.execute({ inputs });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result),
                },
            ],
        };
    });
    server.tool(addLiquidity_1.SanctumAddLiquidityTool.name, addLiquidity_1.SanctumAddLiquidityTool.description, addLiquidity_1.SanctumAddLiquidityTool.parameters, async ({ lstMint, amount, quotedAmount, priorityFee, }) => {
        const result = await addLiquidity_1.SanctumAddLiquidityTool.execute({
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
    });
    server.tool(removeLiquidity_1.SanctumRemoveLiquidityTool.name, removeLiquidity_1.SanctumRemoveLiquidityTool.description, removeLiquidity_1.SanctumRemoveLiquidityTool.parameters, async ({ lstMint, amount, quotedAmount, priorityFee, }) => {
        const result = await removeLiquidity_1.SanctumRemoveLiquidityTool.execute({
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
    });
    server.tool(getOwnedLst_1.SanctumGetOwnedLST.name, getOwnedLst_1.SanctumGetOwnedLST.description, getOwnedLst_1.SanctumGetOwnedLST.parameters, async ({}) => {
        const result = await getOwnedLst_1.SanctumGetOwnedLST.execute();
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
exports.createSanctumMcpServer = createSanctumMcpServer;
//# sourceMappingURL=sanctum.js.map