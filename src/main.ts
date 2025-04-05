import express from "express";
import { Application } from "express";
import helmet from "helmet";
import { ENV } from "./env";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import dotenv from "dotenv";
import { createSanctumMcpServer } from "./mcp/sanctum";
import { createWormholeMcpServer } from "./mcp/wormhole";
import { createSolanaMcpServer } from "./mcp/solana";
import { createOrcaMcpServer } from "./mcp/orca";

dotenv.config();

const app: Application = express();

export let transport: SSEServerTransport | null = null;

app.use(helmet());
app.use(express.urlencoded({ extended: true }));

// app.use("/sanctum", sanctum);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/sse/sanctum", (req, res) => {
  const server = createSanctumMcpServer();
  transport = new SSEServerTransport("/messages", res);

  server.connect(transport);
});

app.get("/sse/wormhole", (req, res) => {
  const server = createWormholeMcpServer();
  transport = new SSEServerTransport("/messages", res);

  server.connect(transport);
});

app.get("/sse/solana", (req, res) => {
  const server = createSolanaMcpServer();
  transport = new SSEServerTransport("/messages", res);

  server.connect(transport);
});

app.get("/sse/orca", (req, res) => {
  const server = createOrcaMcpServer();
  transport = new SSEServerTransport("/messages", res);

  server.connect(transport);
});

app.post("/messages", (req, res) => {
  if (transport) {
    transport.handlePostMessage(req, res);
  }
});

app.listen(ENV.PORT, () => {
  console.log(`Server is running on port ${ENV.PORT}`);
});
