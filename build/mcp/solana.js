"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSolanaMcpServer = void 0;
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const getBalance_1 = require("../tools/solana/getBalance");
const getOwnedToken_1 = require("../tools/solana/getOwnedToken");
const getTokenBalance_1 = require("../tools/solana/getTokenBalance");
const transfer_1 = require("../tools/solana/transfer");
const transferToken_1 = require("../tools/solana/transferToken");
const createSolanaMcpServer = () => {
    const server = new mcp_js_1.McpServer({
        name: "solana",
        version: "1.0.0",
    });
    server.tool(getBalance_1.SolanaGetBalanceTool.name, getBalance_1.SolanaGetBalanceTool.description, getBalance_1.SolanaGetBalanceTool.parameters, async () => {
        const result = await getBalance_1.SolanaGetBalanceTool.execute({});
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result),
                },
            ],
        };
    });
    server.tool(getOwnedToken_1.SolanaGetOwnedTokenTool.name, getOwnedToken_1.SolanaGetOwnedTokenTool.description, getOwnedToken_1.SolanaGetOwnedTokenTool.parameters, async () => {
        const result = await getOwnedToken_1.SolanaGetOwnedTokenTool.execute({});
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result),
                },
            ],
        };
    });
    server.tool(getTokenBalance_1.SolanaGetTokenBalanceTool.name, getTokenBalance_1.SolanaGetTokenBalanceTool.description, getTokenBalance_1.SolanaGetTokenBalanceTool.parameters, async ({ tokenAddress }) => {
        const result = await getTokenBalance_1.SolanaGetTokenBalanceTool.execute({ tokenAddress });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result),
                },
            ],
        };
    });
    server.tool(transfer_1.SolanaTransferTool.name, transfer_1.SolanaTransferTool.description, transfer_1.SolanaTransferTool.parameters, async ({ to, amount, network }) => {
        const result = await transfer_1.SolanaTransferTool.execute({ to, amount, network });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result),
                },
            ],
        };
    });
    server.tool(transferToken_1.SolanaTransferTokenTool.name, transferToken_1.SolanaTransferTokenTool.description, transferToken_1.SolanaTransferTokenTool.parameters, async ({ to, amount, network, tokenAddress, }) => {
        const result = await transferToken_1.SolanaTransferTokenTool.execute({
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
    });
    return server;
};
exports.createSolanaMcpServer = createSolanaMcpServer;
//# sourceMappingURL=solana.js.map