"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrcaMcpServer = void 0;
const createClmm_1 = require("../tools/orca/createClmm");
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const getPosition_1 = require("../tools/orca/getPosition");
const openCenterPosition_1 = require("../tools/orca/openCenterPosition");
const openSingleSidePosition_1 = require("../tools/orca/openSingleSidePosition");
const closePosition_1 = require("../tools/orca/closePosition");
const createOrcaMcpServer = () => {
    const server = new mcp_js_1.McpServer({
        name: "orca",
        version: "1.0.0",
    });
    server.tool(getPosition_1.OrcaGetPositionTool.name, getPosition_1.OrcaGetPositionTool.description, getPosition_1.OrcaGetPositionTool.parameters, async ({}) => {
        const result = await getPosition_1.OrcaGetPositionTool.execute({});
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result),
                },
            ],
        };
    });
    server.tool(openCenterPosition_1.OrcaOpenCenterPositionTool.name, openCenterPosition_1.OrcaOpenCenterPositionTool.description, openCenterPosition_1.OrcaOpenCenterPositionTool.parameters, async ({ whirlpoolAddress, priceOffsetBps, inputTokenMint, inputAmount, }) => {
        const result = await openCenterPosition_1.OrcaOpenCenterPositionTool.execute({
            whirlpoolAddress,
            priceOffsetBps,
            inputTokenMint,
            inputAmount,
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
    server.tool(openSingleSidePosition_1.OrcaOpenSingleSidePositionTool.name, openSingleSidePosition_1.OrcaOpenSingleSidePositionTool.description, openSingleSidePosition_1.OrcaOpenSingleSidePositionTool.parameters, async ({ whirlpoolAddress, distanceFromCurrentPriceBps, widthBps, inputTokenMint, inputAmount, }) => {
        const result = await openSingleSidePosition_1.OrcaOpenSingleSidePositionTool.execute({
            whirlpoolAddress,
            distanceFromCurrentPriceBps,
            widthBps,
            inputTokenMint,
            inputAmount,
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
    server.tool(createClmm_1.OrcaCreateClmmTool.name, createClmm_1.OrcaCreateClmmTool.description, createClmm_1.OrcaCreateClmmTool.parameters, async ({ mint, pair, initialPrice, feeTier, network, }) => {
        const result = await createClmm_1.OrcaCreateClmmTool.execute({
            mint,
            pair,
            initialPrice,
            feeTier,
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
    });
    server.tool(closePosition_1.OrcaClosePositionTool.name, closePosition_1.OrcaClosePositionTool.description, closePosition_1.OrcaClosePositionTool.parameters, async ({ positionMint }) => {
        const result = await closePosition_1.OrcaClosePositionTool.execute({
            positionMint,
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
exports.createOrcaMcpServer = createOrcaMcpServer;
//# sourceMappingURL=orca.js.map