"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMeteoraMcpServer = void 0;
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const closePosition_1 = require("../tools/meteora/closePosition");
const createDlmmBalancePosition_1 = require("../tools/meteora/createDlmmBalancePosition");
const createDlmmImbalancePosition_1 = require("../tools/meteora/createDlmmImbalancePosition");
const createDlmmOneSidePosition_1 = require("../tools/meteora/createDlmmOneSidePosition");
const getDlmmPool_1 = require("../tools/meteora/getDlmmPool");
const getListOfPositions_1 = require("../tools/meteora/getListOfPositions");
const createMeteoraMcpServer = () => {
    const server = new mcp_js_1.McpServer({
        name: "meteora",
        version: "1.0.0",
    });
    server.tool(closePosition_1.MeteoraClosePositionTool.name, closePosition_1.MeteoraClosePositionTool.description, closePosition_1.MeteoraClosePositionTool.parameters, async ({ poolAddress, positionAddress, }) => {
        const result = await closePosition_1.MeteoraClosePositionTool.execute({
            poolAddress,
            positionAddress,
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
    server.tool(createDlmmBalancePosition_1.MeteoraCreateDlmmBalancePositionTool.name, createDlmmBalancePosition_1.MeteoraCreateDlmmBalancePositionTool.description, createDlmmBalancePosition_1.MeteoraCreateDlmmBalancePositionTool.parameters, async ({ poolAddress, tokenXMint, tokenXAmount, }) => {
        const result = await createDlmmBalancePosition_1.MeteoraCreateDlmmBalancePositionTool.execute({
            poolAddress,
            tokenXMint,
            tokenXAmount,
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
    server.tool(createDlmmImbalancePosition_1.MeteoraCreateDlmmImbalancePositionTool.name, createDlmmImbalancePosition_1.MeteoraCreateDlmmImbalancePositionTool.description, createDlmmImbalancePosition_1.MeteoraCreateDlmmImbalancePositionTool.parameters, async ({ poolAddress, tokenXMint, tokenXAmount, solAmount, }) => {
        const result = await createDlmmImbalancePosition_1.MeteoraCreateDlmmImbalancePositionTool.execute({
            poolAddress,
            tokenXMint,
            tokenXAmount,
            solAmount,
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
    server.tool(createDlmmOneSidePosition_1.MeteoraCreateDlmmOneSidePositionTool.name, createDlmmOneSidePosition_1.MeteoraCreateDlmmOneSidePositionTool.description, createDlmmOneSidePosition_1.MeteoraCreateDlmmOneSidePositionTool.parameters, async ({ poolAddress, tokenXMint, tokenXAmount, }) => {
        const result = await createDlmmOneSidePosition_1.MeteoraCreateDlmmOneSidePositionTool.execute({
            poolAddress,
            tokenXMint,
            tokenXAmount,
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
    server.tool(getDlmmPool_1.MeteoraGetDlmmPoolTool.name, getDlmmPool_1.MeteoraGetDlmmPoolTool.description, getDlmmPool_1.MeteoraGetDlmmPoolTool.parameters, async ({ poolAddress }) => {
        const result = await getDlmmPool_1.MeteoraGetDlmmPoolTool.execute({ poolAddress });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result),
                },
            ],
        };
    });
    server.tool(getListOfPositions_1.MeteoraGetListOfPositionsTool.name, getListOfPositions_1.MeteoraGetListOfPositionsTool.description, getListOfPositions_1.MeteoraGetListOfPositionsTool.parameters, async ({ poolAddress }) => {
        const result = await getListOfPositions_1.MeteoraGetListOfPositionsTool.execute({
            poolAddress,
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
exports.createMeteoraMcpServer = createMeteoraMcpServer;
//# sourceMappingURL=meteora.js.map