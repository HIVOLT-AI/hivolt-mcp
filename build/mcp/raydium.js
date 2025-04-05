"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRaydiumMcpServer = void 0;
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const createAmmV4_1 = require("../tools/raydium/createAmmV4");
const createClmm_1 = require("../tools/raydium/createClmm");
const createCpmm_1 = require("../tools/raydium/createCpmm");
const createRaydiumMcpServer = () => {
    const server = new mcp_js_1.McpServer({
        name: "raydium",
        version: "1.0.0",
    });
    server.tool(createAmmV4_1.RaydiumCreateAmmV4Tool.name, createAmmV4_1.RaydiumCreateAmmV4Tool.description, createAmmV4_1.RaydiumCreateAmmV4Tool.parameters, async (input) => {
        const result = await createAmmV4_1.RaydiumCreateAmmV4Tool.execute(input);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result),
                },
            ],
        };
    });
    server.tool(createClmm_1.RaydiumCreateClmmTool.name, createClmm_1.RaydiumCreateClmmTool.description, createClmm_1.RaydiumCreateClmmTool.parameters, async (input) => {
        const result = await createClmm_1.RaydiumCreateClmmTool.execute(input);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result),
                },
            ],
        };
    });
    server.tool(createCpmm_1.RaydiumCreateCpmmTool.name, createCpmm_1.RaydiumCreateCpmmTool.description, createCpmm_1.RaydiumCreateCpmmTool.parameters, async (input) => {
        const result = await createCpmm_1.RaydiumCreateCpmmTool.execute(input);
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
exports.createRaydiumMcpServer = createRaydiumMcpServer;
//# sourceMappingURL=raydium.js.map