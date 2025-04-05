"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transport = void 0;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const env_1 = require("./env");
const sse_js_1 = require("@modelcontextprotocol/sdk/server/sse.js");
const dotenv_1 = __importDefault(require("dotenv"));
const sanctum_1 = require("./mcp/sanctum");
const wormhole_1 = require("./mcp/wormhole");
const solana_1 = require("./mcp/solana");
const orca_1 = require("./mcp/orca");
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.transport = null;
app.use((0, helmet_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
// app.use("/sanctum", sanctum);
app.get("/sse/sanctum", (req, res) => {
    const server = (0, sanctum_1.createSanctumMcpServer)();
    exports.transport = new sse_js_1.SSEServerTransport("/messages", res);
    server.connect(exports.transport);
});
app.get("/sse/wormhole", (req, res) => {
    const server = (0, wormhole_1.createWormholeMcpServer)();
    exports.transport = new sse_js_1.SSEServerTransport("/messages", res);
    server.connect(exports.transport);
});
app.get("/sse/solana", (req, res) => {
    const server = (0, solana_1.createSolanaMcpServer)();
    exports.transport = new sse_js_1.SSEServerTransport("/messages", res);
    server.connect(exports.transport);
});
app.get("/sse/orca", (req, res) => {
    const server = (0, orca_1.createOrcaMcpServer)();
    exports.transport = new sse_js_1.SSEServerTransport("/messages", res);
    server.connect(exports.transport);
});
app.post("/messages", (req, res) => {
    if (exports.transport) {
        exports.transport.handlePostMessage(req, res);
    }
});
app.listen(env_1.ENV.PORT, () => {
    console.log(`Server is running on port ${env_1.ENV.PORT}`);
});
//# sourceMappingURL=main.js.map