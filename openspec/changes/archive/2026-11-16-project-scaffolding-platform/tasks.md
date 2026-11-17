## 1. Core Generator Engine (@forgestack/core)

- [x] 1.1 Implement in-memory Virtual File System (VFS) staging buffer (`packages/core/src/vfs/vfs.ts`) defining `VirtualFile` (`path`, `content`, `encoding`, `executable`), `FileAction` types (`CREATE`, `OVERWRITE`, `MERGE_JSON`, `PATCH_AST`, `APPEND`, `DELETE`), and action dispatcher; verify with unit tests in `packages/core/src/vfs/__tests__/vfs.test.ts` proving zero physical filesystem mutations occur during all staging operations.
- [x] 1.2 Implement central lockstep dependency registry (`packages/core/src/registry/dependencies.ts`) pinning exact semver ranges for React 19 (`^19.0.0`), `@tanstack/react-query` (`^5.66.0`), `@reduxjs/toolkit` (`^2.5.1`), `zustand` (`^5.0.3`), `tailwindcss` (`^4.0.0`), `sonner` (`^2.0.0`), `lucide-react` (`^0.475.0`), `zod` (`^3.24.2`), `drizzle-orm` (`^0.39.1`), `drizzle-kit` (`^0.30.4`), `pg` (`^8.13.1`), `mongoose` (`^8.10.0`), `fastify` (`^5.2.1`), `express` (`^4.21.2`), `pino` (`^9.6.0`), `typescript` (`^5.7.3`), `turbo` (`^2.4.0`), `vitest` (`^3.0.5`), and `tsup` (`^8.3.6`); verify with registry unit tests verifying every dependency has a defined, pinned version string without floating wildcards (`*`) or `latest`.
- [x] 1.3 Implement additive recipe compositor (`packages/core/src/engine/compositor.ts`) that executes an ordered pipeline: Base Kernel (`monorepo` | `standalone-fe` | `standalone-be`) → Framework Slice → Styling Slice → State Slice → Database Slice → Utility Slice → AI Rules Slice → Container Slice; verify with unit tests checking that file collision exceptions are thrown for unhandled collisions while valid slices compose deterministically.
- [x] 1.4 Implement recursive JSON deep-merger (`packages/core/src/utils/json-merge.ts`) for combining scripts, dependencies, devDependencies, and tsconfig compilerOptions; verify that merging `package.json` preserving custom script keys and merges dependencies without duplicate entries.
- [x] 1.5 Implement code injection patcher (`packages/core/src/utils/code-patcher.ts`) using tokenized injection slots (`/* FORGESTACK_PROVIDER_SLOT */`, `/* FORGESTACK_ROUTE_SLOT */`) and AST manipulation via `ts-morph` for wrapping JSX trees and registering Fastify/Express routes; verify with unit tests verifying syntax validity of transformed TypeScript output.
- [x] 1.6 Implement transactional two-phase commit disk flusher (`packages/core/src/engine/flusher.ts`) with pre-flight checks (destination write permissions, directory emptiness check), atomic VFS flushing, and an automated rollback routine that cleans up partially written directories if an I/O error or cancellation occurs; verify with unit tests using mock filesystem failures confirming complete cleanup.
- [x] 1.7 Implement child process execution runner (`packages/core/src/utils/process-runner.ts`) with streaming event emitters for `git init`, `git add -A`, initial commit, and package manager installs (`pnpm install`, `npm install`, `bun install`); verify with tests capturing process stdout/stderr streams and handling non-zero exit codes gracefully.

## 2. Composable Templates and Feature Slices

- [x] 2.1 Build Monorepo kernel slice (`packages/core/src/slices/monorepo/index.ts`) creating root `pnpm-workspace.yaml` (including `apps/*` and `packages/*`), `turbo.json` (defining pipelines for `build`, `lint`, `typecheck`, `test`, `dev`), `.npmrc` (`shamefully-hoist=false`, `strict-peer-dependencies=false`), root `.gitignore`, and root `package.json` with workspace scripts; verify with schema tests that `turbo.json` adheres to Turborepo v2 schema.
- [x] 2.2 Build shared monorepo packages slice (`packages/core/src/slices/shared-packages/index.ts`):
  - `packages/contracts`: `package.json` (`@repo/contracts`), `src/auth.contract.ts` (Zod schemas for `loginRequestSchema`, `userResponseSchema`), `src/index.ts`;
  - `packages/ui`: `package.json` (`@repo/ui`), `src/button.tsx`, `src/dialog.tsx`, `src/index.ts`;
  - `packages/typescript-config`: `base.json`, `react.json`, `node.json`;
  - `packages/eslint-config`: `base.js`, `react.js`, `node.js`;
  verify cross-workspace symlink resolution and TypeScript type imports between packages.
- [x] 2.3 Build React 19 + TypeScript + Vite frontend slice (`packages/core/src/slices/frontend/react-vite.ts`) creating `apps/web/vite.config.ts` (with `@vitejs/plugin-react` and path alias `@/` pointing to `src/`), `apps/web/index.html`, `apps/web/src/main.tsx`, `apps/web/src/App.tsx`, and `apps/web/tsconfig.json`; verify Vite configuration starts up without error in a test sandbox.
- [x] 2.4 Build Tailwind CSS v4 styling slice (`packages/core/src/slices/frontend/tailwind.ts`) creating `apps/web/src/index.css` with `@import "tailwindcss";`, `apps/web/src/lib/utils.ts` exporting `cn(...inputs: ClassValue[]): string` using `clsx` and `twMerge`; verify that classes are properly parsed and merged in utility tests.
- [x] 2.5 Build frontend feedback & UI component slices (`packages/core/src/slices/frontend/ui-extras.ts`):
  - Sonner toast notifications: `apps/web/src/providers/toast-provider.tsx` mounting `<Toaster position="top-right" richColors closeButton />`;
  - Lucide React icon integration: tree-shakeable imports and icon wrapper;
  - Form validation: React Hook Form + Zod resolver (`@hookform/resolvers/zod`);
  verify provider mounts cleanly in `App.tsx` and exports working toast and form examples.
- [x] 2.6 Build frontend state management slices (`packages/core/src/slices/frontend/state.ts`):
  - TanStack Query v5: `apps/web/src/providers/query-provider.tsx` with `QueryClient`, default options (`staleTime: 5 mins`, `retry: 1`), and custom hook `apps/web/src/features/auth/api/use-user.ts` querying `@repo/contracts` types;
  - Redux Toolkit: `apps/web/src/store/index.ts`, typed hooks `useAppDispatch` / `useAppSelector`, and `authSlice.ts`;
  - Zustand: `apps/web/src/store/use-app-store.ts` with devtools middleware;
  verify each state slice compiles and dispatches actions or manages queries without TypeScript errors.
- [x] 2.7 Build Node.js ESM backend application slice (`packages/core/src/slices/backend/clean-modular.ts`):
  - `apps/api/package.json` with `"type": "module"`, scripts for `build`, `start`, `dev` (using `tsx watch`);
  - `apps/api/tsconfig.json` with `moduleResolution: "NodeNext"`;
  - `apps/api/src/config/env.ts` validating `NODE_ENV`, `PORT`, `DATABASE_URL`, `DATABASE_POOL_MIN`, `DATABASE_POOL_MAX`, `CORS_ORIGIN` using Zod and immediately aborting on validation failure;
  - Clean Modular folder hierarchy: `src/modules/health/` (controller, routes), `src/modules/auth/` (controller, service, repository, routes, schema), `src/shared/errors/app-error.ts`, `src/shared/middleware/error-handler.ts`, `src/shared/utils/logger.ts` (Pino);
  - `apps/api/src/app.ts` configuring CORS, Helmet, rate limiting, and route mounting;
  - `apps/api/src/server.ts` with HTTP listener and signal handlers (`SIGTERM`, `SIGINT`) triggering graceful shutdown;
  verify backend boots up and responds with 200 OK on `/api/health`.
- [x] 2.8 Build PostgreSQL database integration slice (`packages/core/src/slices/database/postgres.ts`):
  - Drizzle ORM option: `apps/api/src/database/connection.ts` with `pg.Pool` connection pool, `drizzle(pool, { schema })`, connectivity verification with `SELECT 1`, `checkHealth()` method, and `pool.end()` hook; `src/database/schema/users.ts` with Drizzle `pgTable`; `drizzle.config.ts`;
  - Prisma option: `apps/api/prisma/schema.prisma` with datasource postgresql and client generator; `src/database/connection.ts` with PrismaClient singleton and disconnect hook;
  verify database connection code handles connection timeouts, logs connection status via Pino, and releases active pool connections on shutdown.
- [x] 2.9 Build MongoDB database integration slice (`packages/core/src/slices/database/mongodb.ts`):
  - Mongoose integration: `apps/api/src/database/connection.ts` with `mongoose.connect()` configuring `maxPoolSize`, `minPoolSize`, retry loop with exponential backoff (5 retries), connection lifecycle event listeners (`connected`, `disconnected`, `error`), and `mongoose.disconnect()` shutdown handler;
  - `apps/api/src/database/models/user.model.ts` with typed Mongoose schema;
  verify retry logic backs off upon simulated network failure and connection state listeners report accurate statuses.
- [x] 2.10 Build AI Agent governance and rules slice (`packages/core/src/slices/governance/ai-rules.ts`):
  - `.cursor/rules/01-architecture-boundaries.mdc` (prohibiting raw database queries in controllers and enforcing service boundaries);
  - `.cursor/rules/02-typescript-strict.mdc` (enforcing strict TypeScript, zero `any`, and mandatory Zod schemas for external payloads);
  - `.cursor/rules/03-brutally-honest-reviewer.mdc` (mandating independent technical critique, zero fake praise, and uncompromising correctness);
  - `.agents/skills/modern-ui-engineering/SKILL.md` (guidance for accessible design tokens, Radix UI headless primitives, Tailwind v4, and CLS/INP optimization);
  - `.agents/skills/clean-code-craftsmanship/SKILL.md` (guidance for strict TypeScript, domain-driven modular separation, Zod contract validation, and connection resilience);
  - `.agents/skills/db-migration/SKILL.md` (instructions for applying/rolling back schema migrations);
  - `.agents/skills/api-contract-sync/SKILL.md` (instructions for synchronizing `@repo/contracts` with route definitions);
  - `.agents/workflows/` (`opsx-propose.md`, `opsx-apply.md`, `opsx-sync.md`);
  - `.github/copilot-instructions.md`;
  - `openspec/config.yaml`;
  verify all markdown rule and skill files match OpenSpec schema and validation rules.
- [x] 2.11 Build Docker containerization slice (`packages/core/src/slices/container/docker.ts`):
  - Multi-stage `apps/api/Dockerfile` (node:22-alpine base, builder, and production runner stages);
  - `docker-compose.yml` pre-configured with selected database service (`postgres:16-alpine` with healthcheck `pg_isready -U postgres`, or `mongo:7-alpine`), mapped ports, and named persistent data volumes;
  verify with `docker compose config` that generated compose definitions are syntactically valid.

## 3. CLI Interface (@forgestack/cli)

- [x] 3.1 Implement interactive terminal user interface (`packages/cli/src/prompts/wizard.ts`) powered by `@clack/prompts`:
  - Step 1: Text prompt for project name (validating against kebab-case regex and checking target directory status);
  - Step 2: Select prompt for architecture topology (Monorepo, Standalone Frontend, Standalone Backend);
  - Step 3: Multiselect prompt for frontend libraries (Tailwind CSS, TanStack Query, Redux Toolkit, Zustand, Sonner, Lucide Icons);
  - Step 4: Select prompt for backend framework (Fastify, Express);
  - Step 5: Select prompt for database engine and ORM (PostgreSQL + Drizzle, PostgreSQL + Prisma, MongoDB + Mongoose, None);
  - Step 6: Multiselect prompt for AI agent governance rules (OpenSpec, Cursor Rules, Antigravity Agents, Copilot Instructions);
  - Step 7: Confirm prompt for automatic package installation and git repository initialization;
  verify prompt navigation, keyboard selection, and default fallback options.
- [x] 3.2 Implement non-interactive CLI flags parser (`packages/cli/src/cli.ts`) using Commander/CAC:
  - Supports `--name <string>`, `--topology <monorepo|frontend|backend>`, `--fe <react-vite>`, `--be <fastify|express>`, `--db <postgres|mongo|none>`, `--orm <drizzle|prisma|mongoose>`, `--state <query|redux|zustand>`, `--pm <pnpm|npm|yarn|bun>`, `--install`, `--git`, `--dry-run`;
  - Validate flag compatibility (e.g., throwing error if `--db mongo` is paired with `--orm drizzle`);
  verify headless execution produces identical VFS tree to interactive prompt selections.
- [x] 3.3 Implement CLI output renderer (`packages/cli/src/ui/reporter.ts`) featuring:
  - Formatted ASCII banner and step headers;
  - Animated terminal spinners during VFS staging, atomic disk flush, git init, and package installation;
  - Structured summary box displaying scaffolded paths, configuration choices, and explicit next-step commands (`cd <project>`, `pnpm dev`);
  verify clean error rendering with stack trace suppression for expected user errors.
- [x] 3.4 Configure binary executable entry point (`packages/cli/bin/create-forgestack-app.js`) with shebang (`#!/usr/bin/env node`), execute permissions, and `bin` field mapping in `packages/cli/package.json`; verify local execution via `npm pack` and direct test run in a temporary directory.

## 4. Desktop Application (@forgestack/desktop)

- [x] 4.1 Scaffold Tauri v2 desktop application structure (`packages/desktop/src-tauri` and `packages/desktop/src`):
  - Configure `src-tauri/Cargo.toml` with `tauri = { version = "2", features = [...] }`, `tauri-plugin-dialog`, and `tauri-plugin-shell`;
  - Configure `src-tauri/tauri.conf.json` with app identifier `com.forgestack.desktop`, window dimensions (1100x750), minimum bounds, and secure CSP;
  verify desktop window launches with native OS title bar and React frontend mounts properly.
- [x] 4.2 Implement native directory picker IPC bridge (`packages/desktop/src-tauri/src/commands/fs.rs`):
  - Rust command invoking Tauri dialog plugin to open native system folder chooser;
  - Rust path validator checking folder existence, write permissions, and file count;
  - React hook `useDirectoryPicker` binding the dialog to the UI input field;
  verify native file dialog opens on macOS/Linux/Windows and returns absolute path with write verification.
- [x] 4.3 Build desktop wizard configuration UI (`packages/desktop/src/components/wizard/`):
  - Topology selector cards with visual architecture diagrams;
  - Frontend feature selection grid with iconography and badge toggles;
  - Backend and database matrix with dynamic ORM dropdown filtering based on database engine selection;
  - AI Governance toggle cards;
  verify interactive form state updates reactive configuration object correctly.
- [x] 4.4 Build live virtual file-tree visualization component (`packages/desktop/src/components/preview/FileTreePreview.tsx`):
  - Queries `@forgestack/core` to generate in-memory VFS hierarchy without touching disk;
  - Renders collapsible folder tree with file-type icons (TypeScript, React, JSON, Markdown, Docker);
  - Live dependency inspector panel displaying resolved `package.json` dependencies for the current configuration;
  verify tree updates instantly (<50ms) as the user toggles different feature slices.
- [x] 4.5 Build execution streaming console and post-scaffold actions (`packages/desktop/src/components/console/ExecutionConsole.tsx`):
  - Real-time progress bar tracking staging, writing, and dependency installation phases;
  - Terminal log window streaming stdout/stderr from package installation;
  - Action buttons enabled upon successful completion: "Open in VS Code" (invoking `code <path>`), "Open in Antigravity" (invoking `agy <path>`), "Open Containing Folder", and "Copy Run Command";
  verify process output streaming and system launcher execution.

## 5. End-to-End Testing and Validation

- [x] 5.1 Implement comprehensive unit test suite in `packages/core/src/__tests__/`:
  - Unit tests for VFS operations (create, overwrite, merge, append);
  - Unit tests for all individual slices verifying expected file existence;
  - Unit tests for dependency registry version stability;
  - Unit tests for rollback manager simulating failed file writes;
  verify all core tests pass with >90% code coverage.
- [x] 5.2 Implement automated CLI permutation test runner (`tests/e2e/cli-matrix.test.ts`):
  - Generates projects for all primary combinations:
    1. Monorepo + React 19 + Fastify + PostgreSQL (Drizzle) + TanStack Query + Tailwind + AI Rules;
    2. Monorepo + React 19 + Express + MongoDB (Mongoose) + Redux Toolkit + Sonner;
    3. Standalone Frontend + React 19 + Zustand + Tailwind;
    4. Standalone Backend + Node.js ESM + Fastify + PostgreSQL (Prisma);
  - Executes `pnpm install`, `turbo run build`, and `turbo run test` on each generated project in isolated temp directories;
  verify all generated combinations install dependencies cleanly without peer dependency conflicts and pass build and test phases.
- [x] 5.3 Configure automated CI pipeline (`.github/workflows/ci.yml`):
  - Triggers on pull requests and pushes to `main`;
  - Runs lint, typecheck, and unit tests across `@forgestack/core`, `@forgestack/cli`, and `@forgestack/desktop`;
  - Runs daily scheduled cron matrix building and compiling all target project combinations;
  verify GitHub Actions workflow syntax and trigger mechanisms.
