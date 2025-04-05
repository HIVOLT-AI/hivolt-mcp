"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWormholeMcpServer = void 0;
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const createWrappedToken_1 = require("../tools/wormhole/createWrappedToken");
const transferToken_1 = require("../tools/wormhole/transferToken");
const createWormholeMcpServer = () => {
    const server = new mcp_js_1.McpServer({
        name: "wormhole",
        version: "1.0.0",
    });
    server.tool(transferToken_1.WormholeTransferTokenTool.name, transferToken_1.WormholeTransferTokenTool.description, transferToken_1.WormholeTransferTokenTool.parameters, async ({ destinationChain, tokenAddress, network, transferAmount, }) => {
        const result = await transferToken_1.WormholeTransferTokenTool.execute({
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
    });
    server.tool(createWrappedToken_1.WormholeCreateWrappedTokenTool.name, createWrappedToken_1.WormholeCreateWrappedTokenTool.description, createWrappedToken_1.WormholeCreateWrappedTokenTool.parameters, async ({ destinationChain, tokenAddress, network, }) => {
        const result = await createWrappedToken_1.WormholeCreateWrappedTokenTool.execute({
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
    });
    return server;
};
exports.createWormholeMcpServer = createWormholeMcpServer;
//# sourceMappingURL=wormhole.js.map