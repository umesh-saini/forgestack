# ai-governance Specification

## Purpose
TBD - created by archiving change 2026-11-17-nextgen-archetypes-primitives-and-ai-mcp-enhancements. Update Purpose after archive.

## Requirements

### Requirement: Model Context Protocol (MCP) Server Scaffolding
The generator SHALL support scaffolding an internal Model Context Protocol package (`packages/mcp-server`) exposing database schema introspection, spec verification, and health check tools.

#### Scenario: Scaffolding Monorepo with MCP Server
- **Given** a ProjectConfig with AI governance enabled
- **When** `generateProjectVfs(config)` is executed
- **Then** `packages/mcp-server/package.json` contains `@modelcontextprotocol/sdk`
- **And** `packages/mcp-server/src/server.ts` registers tools for database introspection and OpenSpec validation

### Requirement: Antigravity Multi-Agent Workflow Scripts
The generator SHALL scaffold workflow scripts enabling AI agents to orchestrate multi-step code generation and validation loops.

#### Scenario: Scaffolding Antigravity Workflows
- **Given** a ProjectConfig with AI governance engine set to `openspec` or `all`
- **When** `generateProjectVfs(config)` is executed
- **Then** `.agents/workflows/agent-audit.md` and `.agents/workflows/spec-verify.md` are staged with agent execution instructions
