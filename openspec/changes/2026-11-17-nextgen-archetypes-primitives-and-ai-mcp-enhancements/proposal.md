# Change Proposal: Next-Gen Archetypes, Production Primitives, MCP Integration & Core Alignment

## Why

ForgeStack provides a solid foundational Virtual File System (VFS) and transactional disk flusher. However, an architectural evaluation reveals five critical classes of deficiencies that prevent it from being a truly modern, production-grade enterprise scaffolding platform:

1. **Architectural Disconnects & Silent Fallbacks**:
   - **Hono Backend Fallback**: Despite Hono being selectable in config schemas and the desktop UI, the generator evaluates a binary `isFastify ? fastify : express` check, silently generating Express code and dependencies for Hono selections.
   - **Missing SQLite Engine**: While listed in configuration schemas and dependency registries (`better-sqlite3`), no SQLite slice exists in `packages/core/src/slices/database/`, generating projects with broken or missing database connections.
   - **Next.js Full-Stack Database Disconnect**: In `nextjs-fullstack` configurations with PostgreSQL and Drizzle ORM, `postgresSlice` prematurely aborts because `backend.framework === 'none'`, leaving Next.js applications without database connections, schema files, or migration scripts.
   - **Phantom Micro-Frontend Topology**: The `micro-frontend` topology is an inert alias for `monorepo`. It configures zero Module Federation plugins, no host shell container (`apps/shell`), no remote modules, and no runtime inter-app communication bus.
   - **Hardcoded UI Extras**: Selecting alternate icon sets (`tabler`, `phosphor`) or form libraries (`tanstack-form`, `formik`) installs package dependencies but still generates hardcoded `lucide-react`, `sonner`, and `react-hook-form` implementation code.

2. **Absence of High-Demand Modern Archetypes**:
   - **Native Tauri v2 Desktop Generator**: ForgeStack's own studio is built on Tauri v2, yet it only generates Electron apps for users, missing the opportunity to scaffold lightweight (<15MB installer, <35MB RAM) native desktop applications with Rust backends and React 19 frontends.
   - **AI-Native Agentic / RAG Archetype**: Modern software teams frequently scaffold LLM applications. ForgeStack scaffolds AI rules for human agents, but lacks an archetype for building AI applications (Vercel AI SDK Core, streaming SSE, vector database integration via `pgvector`, and structured function calling).
   - **Event-Driven & Distributed Worker Archetype**: Real-world backends require asynchronous processing. ForgeStack currently supports only synchronous HTTP request-reply servers, with no support for Redis + BullMQ background task workers or WebSocket streaming.

3. **Omission of Core Production Primitives**:
   - **Authentication & Session Security**: Projects are generated with an empty database table and no authentication layer. Teams must manually author password hashing, session cookies, and JWT auth loops.
   - **End-to-End Type Safety (tRPC v11)**: While `@repo/contracts` shares Zod schemas, HTTP calls remain loose Axios/fetch requests. Monorepo setups need tRPC for zero-boilerplate, end-to-end type safety between frontend and backend.
   - **End-to-End Testing (Playwright)**: Scaffolded projects provide only Vitest unit tests, with no browser-level smoke tests or cross-browser validation.
   - **CI/CD DevOps Automation**: No automated GitHub Actions workflows are generated for linting, typechecking, running database migrations, or building Docker images.

4. **Next-Generation AI Governance & MCP Protocol**:
   - Coding agents (Claude Code, Cursor, Antigravity) cannot introspect databases or run internal validation tools without a **Model Context Protocol (MCP)** server. Scaffolding an internal `@repo/mcp-server` equips AI agents with direct, governed project inspection capabilities.

## What Changes

1. **Core Alignment & Bug Fixes**:
   - Implement dedicated Hono HTTP server slice (`@hono/node-server`, Zod validator middleware, native CORS/secure headers).
   - Implement dedicated SQLite database slice using `better-sqlite3` and `drizzle-orm/better-sqlite3` with embedded connection pooling and file-based dev database.
   - Refactor `postgresSlice` and `mongodbSlice` to support full-stack SSR frameworks (`nextjs-fullstack`) where `backend.framework === 'none'` but `backend.database` is defined.
   - Dynamic template generation for UI extras (dynamically importing selected icon packages and generating corresponding form/toast providers).

2. **New Archetypes**:
   - **`tauri-desktop`**: Scaffolds Rust + Tauri v2 (`src-tauri/`) with React 19 + Tailwind CSS v4 and native OS dialog/FS IPC commands.
   - **`ai-agent-rag`**: Scaffolds full-stack LLM application with Vercel AI SDK, `pgvector` Drizzle schema, streaming SSE endpoint, and semantic search utilities.
   - **`micro-frontend` (Real)**: Scaffolds `apps/shell` (host container with `@module-federation/vite`), `apps/remote-dashboard`, and `packages/event-bus`.
   - **`distributed-worker`**: Scaffolds Redis connection pooling, BullMQ persistent worker queue (`src/worker.ts`), and WebSocket pub/sub server.

3. **New Production Primitives**:
   - **Authentication Slice**: Better-Auth integration generating auth schema (`users`, `sessions`, `accounts`), session middleware, and login/register components.
   - **RPC Contracts Slice**: tRPC v11 integration for Monorepos connecting `apps/api` procedures to `apps/web` React hooks.
   - **Playwright E2E Slice**: `playwright.config.ts`, smoke tests verifying server health and frontend hydration.
   - **CI/CD DevOps Slice**: `.github/workflows/ci.yml` matrix pipeline for linting, typechecking, testing, and Docker builds.

4. **AI MCP Tooling**:
   - **`@repo/mcp-server`**: Scaffolds a Model Context Protocol server exposing database schema inspection, project status, and test execution tools to AI assistants.
   - **Antigravity Workflows**: Adds multi-agent automation scripts (`run_workflow` orchestration and swarm configs).

5. **Desktop & CLI Studio Enhancements**:
   - Interactive Architecture Topology Visualizer in Desktop Studio.
   - Live Stack Runner button in Tauri executing `pnpm dev` and `docker compose up`.
   - CLI flags for all new archetypes (`--topology tauri-desktop`, `--auth better-auth`, `--rpc trpc`).

## Capabilities

### New Capabilities
- `scaffolding-engine`: Native Tauri v2, AI RAG with pgvector, real Module Federation, BullMQ workers, Better-Auth, tRPC v11, SQLite, and Hono.
- `template-presets`: Curated presets for Tauri Desktop Studio, AI Agent & RAG Portal, Micro-Frontend Federation, and Distributed Worker API.
- `cli-generator`: CLI interactive wizard and flags supporting new topologies, auth providers, and RPC layers.
- `desktop-app`: Visual architecture topology graph, dynamic configurator grids, and local stack dev runner.
- `ai-governance`: Model Context Protocol (`@repo/mcp-server`) scaffolding and Antigravity workflow definitions.

### Modified Capabilities
- `scaffolding-engine`: Database slices updated to support standalone fullstack Next.js and correct Hono routing.
