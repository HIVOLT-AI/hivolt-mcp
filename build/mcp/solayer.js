"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSolayerMcpServer = void 0;
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const getInfo_1 = require("../tools/solayer/getInfo");
const stakeWithSolayer_1 = require("../tools/solayer/stakeWithSolayer");
const createSolayerMcpServer = () => {
    const server = new mcp_js_1.McpServer({
        name: "solayer",
        version: "1.0.0",
    });
    server.tool(getInfo_1.SolayerGetInfoTool.name, getInfo_1.SolayerGetInfoTool.description, getInfo_1.SolayerGetInfoTool.parameters, async () => {
        const result = await getInfo_1.SolayerGetInfoTool.execute();
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result),
                },
            ],
        };
    });
    server.tool(stakeWithSolayer_1.SolayerStakeWithSolayerTool.name, stakeWithSolayer_1.SolayerStakeWithSolayerTool.description, stakeWithSolayer_1.SolayerStakeWithSolayerTool.parameters, async ({ amount }) => {
        const result = await stakeWithSolayer_1.SolayerStakeWithSolayerTool.execute({ amount });
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
exports.createSolayerMcpServer = createSolayerMcpServer;
//# sourceMappingURL=solayer.js.map