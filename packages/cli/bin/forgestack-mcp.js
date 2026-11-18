#!/usr/bin/env node

import { runMcpServer } from '../dist/mcp/server.js';

runMcpServer().catch((err) => {
  console.error('[ForgeStack MCP Fatal Error]:', err);
  process.exit(1);
});
