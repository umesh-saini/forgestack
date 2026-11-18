# Implementation Tasks: Next-Gen Archetypes, Production Primitives, MCP Integration & Core Alignment

## Phase 1: Core Fixes & Architectural Realignment (`@forgestack/core`)

- [x] 1.1 Fix Hono Backend Implementation:
  - [x] Integrate `@hono/node-server`, `hono/cors`, and `hono/secure-headers` in `packages/core/src/slices/backend/clean-modular.ts`.
  - [x] Verify `@hono/node-server: ^1.13.8` and `hono: ^4.7.0` in dependency registry.
  - [x] Update `cleanModularBackendSlice` with clean Hono server, app, and route generation when `config.backend.framework === 'hono'`.
  - [x] Write unit tests verifying Hono server generation and route bindings (3/3 passing).
- [x] 1.2 Implement SQLite Database Slice:
  - [x] Create `packages/core/src/slices/database/sqlite.ts`.
  - [x] Add `better-sqlite3: ^11.8.1`, `@types/better-sqlite3: ^7.6.12`, and `drizzle-orm/better-sqlite3` integration.
  - [x] Scaffold `src/database/connection.ts` with WAL pragmas, health checks, and Drizzle schema exports.
  - [x] Stage `drizzle.config.ts` configured for dialect `sqlite`.
  - [x] Write unit tests verifying SQLite database initialization and pipeline composition (3/3 passing).
- [x] 1.3 Fix Next.js Full-Stack Database Integration:
  - [x] Update `postgresSlice`, `sqliteSlice`, and `mongodbSlice` condition checks to allow `topology === 'nextjs-fullstack'` or `frontend.framework === 'nextjs'`.
  - [x] Target `src/db/` inside Next.js folder root for database client and schema files.
  - [x] Add `.env.local` with database connection string for Next.js.
  - [x] Write unit test verifying `preset-nextjs` scaffolds working Drizzle/Postgres files (3/3 passing).
- [x] 1.4 Fix UI Extras Template Interpolation:
  - [x] Update `packages/core/src/slices/frontend/ui-extras.ts` to generate dynamic imports for selected icon libraries (`@tabler/icons-react`, `@phosphor-icons/react`, `react-icons`).
  - [x] Generate matching toast provider for `react-toastify` and `react-hot-toast`.
  - [x] Generate matching form examples for `tanstack-form` and `formik`.

## Phase 2: Production Primitives & Core Tool Packages (`@forgestack/core`)

- [x] 2.1 Implement Better-Auth Authentication Primitive Slice:
  - [x] Create `packages/core/src/slices/auth/better-auth.ts`.
  - [x] Add `better-auth: ^1.1.20` to `DEPENDENCY_REGISTRY`.
  - [x] Scaffold server auth configuration `src/auth/auth.ts` with session cookies and password hashing.
  - [x] Scaffold React client helper `src/auth/client.ts` with `useSession` hook.
  - [x] Inject `user`, `session`, `account`, and `verification` tables into Drizzle / Prisma schemas.
  - [x] Write unit tests verifying authentication slice generation (3/3 passing).
- [x] 2.2 Implement tRPC v11 Monorepo Contracts Slice:
  - [x] Create `packages/core/src/slices/rpc/trpc.ts`.
  - [x] Add `@trpc/server: ^11.0.0-rc`, `@trpc/client: ^11.0.0-rc`, and `@trpc/react-query: ^11.0.0-rc`.
  - [x] Scaffold `apps/api/src/trpc/router.ts` and `apps/api/src/trpc/context.ts`.
  - [x] Scaffold `packages/api-client/src/index.ts` re-exporting typed tRPC React hooks.
  - [x] Wire tRPC provider into `apps/web/src/main.tsx` (2/2 passing).
- [x] 2.3 Implement Distributed Worker & Task Queue Slice:
  - [x] Create `packages/core/src/slices/backend/bullmq-worker.ts`.
  - [x] Add `bullmq: ^5.40.0` and `ioredis: ^5.5.0` to `DEPENDENCY_REGISTRY`.
  - [x] Scaffold `src/worker.ts` with queue worker processor, error listeners, and graceful shutdown hooks.
  - [x] Stage `docker-compose.yml` with Redis service container (3/3 passing).
- [x] 2.4 Implement Cross-Browser Playwright E2E Testing Slice:
  - [x] Create `packages/core/src/slices/testing/playwright.ts`.
  - [x] Add `@playwright/test: ^1.50.0` to `DEPENDENCY_REGISTRY`.
  - [x] Scaffold `playwright.config.ts` with local webserver startup and browser configurations.
  - [x] Scaffold `tests/e2e/smoke.spec.ts` verifying HTTP 200 response and page hydration (2/2 passing).
- [x] 2.5 Implement GitHub Actions CI/CD Pipeline Slice:
  - [x] Create `packages/core/src/slices/devops/ci-workflows.ts`.
  - [x] Scaffold `.github/workflows/ci.yml` running lint, typecheck, test, and build across Node 20 & 22 (2/2 passing).

## Phase 3: High-Value Archetype Slices (`@forgestack/core`)

- [x] 3.1 Implement Native Tauri v2 Desktop Generator Slice:
  - [x] Create `packages/core/src/slices/desktop/tauri-app.ts`.
  - [x] Scaffold `src-tauri/Cargo.toml` with `tauri = { version = "2", features = [] }` and `serde`.
  - [x] Scaffold `src-tauri/tauri.conf.json` with permissions, bundle identifiers, and window sizing.
  - [x] Scaffold `src-tauri/capabilities/default.json` with required core capabilities.
  - [x] Scaffold `src-tauri/src/main.rs` and `src-tauri/src/lib.rs` with sample IPC command `greet`.
  - [x] Scaffold React 19 frontend consuming `window.__TAURI__.core.invoke` (2/2 passing).
- [x] 3.2 Implement AI-Native Agent / RAG Archetype Slice:
  - [x] Create `packages/core/src/slices/ai/agent-rag.ts`.
  - [x] Add `ai: ^4.1.0`, `@ai-sdk/openai: ^1.1.0`, and `pgvector: ^0.2.0` to `DEPENDENCY_REGISTRY`.
  - [x] Scaffold `apps/api/src/ai/vector-store.ts` configuring pgvector extension in Drizzle schema.
  - [x] Scaffold `apps/api/src/modules/chat/chat.routes.ts` streaming tokens via Server-Sent Events (SSE).
  - [x] Scaffold `apps/web/src/hooks/use-agent-chat.ts` handling streaming updates and abort signals (2/2 passing).
- [x] 3.3 Implement True Micro-Frontend Federation Slice:
  - [x] Create `packages/core/src/slices/monorepo/micro-frontend.ts`.
  - [x] Scaffold `apps/shell` with `@module-federation/vite` host configuration.
  - [x] Scaffold `apps/remote-dashboard` with `@module-federation/vite` remote configuration.
  - [x] Scaffold `packages/event-bus` providing typed pub/sub communication between remotes (2/2 passing).
- [x] 3.4 Register all new slices in `packages/core/src/engine/create-pipeline.ts`.

## Phase 4: AI Governance & Model Context Protocol (`@repo/mcp-server`)

- [x] 4.1 Implement Model Context Protocol (MCP) Server Slice:
  - [x] Create `packages/core/src/slices/governance/mcp-server.ts`.
  - [x] Add `@modelcontextprotocol/sdk: ^1.5.0` to `DEPENDENCY_REGISTRY`.
  - [x] Scaffold `packages/mcp-server/package.json` and `tsconfig.json`.
  - [x] Scaffold `packages/mcp-server/src/server.ts` registering tools:
    - `inspect_database_schema`: Introspects Drizzle/Prisma schema files.
    - `run_spec_verification`: Runs `openspec validate` and returns delta errors.
    - `check_route_health`: Dispatches test pings to local endpoints.
  - [x] Scaffold `.cursor/mcp.json` configuring Cursor to connect to `@repo/mcp-server`.
- [x] 4.2 Scaffold Antigravity Multi-Agent Workflow Scripts:
  - [x] Scaffold `.agents/workflows/agent-audit.md` and `spec-verify.md` with multi-agent orchestration instructions.

## Phase 5: CLI & Terminal Wizard Updates (`@forgestack/cli`)

- [x] 5.1 Update CLI Interactive Wizard (`packages/cli/src/prompts/wizard.ts`):
  - [x] Add `tauri-desktop`, `ai-agent-rag`, and `distributed-worker` to topology prompt.
  - [x] Add `hono` to backend framework prompt.
  - [x] Add `sqlite` to database prompt.
  - [x] Add `better-auth` to authentication prompt.
  - [x] Add `trpc` to RPC prompt for monorepos.
- [x] 5.2 Update Commander Flags (`packages/cli/src/cli.ts`):
  - [x] Add `--auth <provider>` (`better-auth`, `none`).
  - [x] Add `--rpc <type>` (`trpc`, `rest`).
  - [x] Add `--testing <framework>` (`playwright`, `vitest`).
  - [x] Update compatibility validations for new flag combinations.

## Phase 6: Desktop Studio Enhancements (`@forgestack/desktop`)

- [x] 6.1 Update Architecture Selector & Presets (`packages/desktop/src/`):
  - [x] Add cards for Tauri v2 Desktop, AI Agent & RAG, and Distributed Workers to `Step1IdentityArchetype.tsx`.
  - [x] Update `BUILTIN_TEMPLATES` in `template.ts` with new presets.
- [x] 6.2 Update Backend & Tooling Grids (`BackendGrid.tsx`, `Step3ToolingGovernance.tsx`):
  - [x] Connect Hono selection to active generator pipeline.
  - [x] Connect SQLite selection to Drizzle SQLite slice.
  - [x] Add Better-Auth and tRPC toggles to Step 3.
- [x] 6.3 Build Architecture Topology Visualizer:
  - [x] Create `packages/desktop/src/components/wizard/TopologyVisualizer.tsx`.
  - [x] Render interactive node graph showing packages and communication channels.
- [x] 6.4 Implement Local Dev Stack Runner:
  - [x] Add "Start Dev Stack" button in `ScaffoldConsoleView.tsx`.
  - [x] Invoke Tauri backend command to spawn `pnpm dev` and Docker Compose, streaming output to console.

## Phase 7: Verification & Test Matrix

- [x] 7.1 Author Vitest unit tests for every newly added slice:
  - [x] `tauri-app.test.ts`
  - [x] `hono.test.ts`
  - [x] `sqlite.test.ts`
  - [x] `agent-rag.test.ts`
  - [x] `better-auth.test.ts`
  - [x] `trpc.test.ts`
  - [x] `mcp-server.test.ts`
- [x] 7.2 Run complete test suite (`pnpm test`) and ensure 100% pass rate.
- [x] 7.3 Execute end-to-end permutation matrix covering all new archetypes.
- [x] 7.4 Validate OpenSpec proposals and specs (`npx openspec validate --specs`).
