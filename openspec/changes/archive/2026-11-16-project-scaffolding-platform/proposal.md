## Why

Developers face immense friction when bootstrapping modern full-stack web applications. Existing scaffolding tools either force rigid monolithic conventions (e.g., standard Create Next App or Vite starters) or suffer from combinatorial template rot (attempting to maintain hundreds of static repositories for every combination of React, Redux, TanStack Query, Node.js, Fastify/Express, PostgreSQL, and MongoDB). Furthermore, existing generators completely neglect modern AI Agent workflows (such as OpenSpec, Antigravity agents, and Cursor engineering rules), forcing teams to spend days configuring workspace governance, shared type contracts, database pooling, and graceful shutdown lifecycles manually.

ForgeStack solves this by introducing a dual-interface platform (interactive npm CLI and ultra-lightweight Tauri v2 Desktop App) powered by an in-memory, deterministic, layered recipe engine that composably generates production-ready monorepos or polyrepos with Day-One AI agent governance.

## What Changes

- Introduce `@forgestack/core`: A headless, deterministic scaffolding engine with in-memory Virtual File System (VFS) staging, additive layered recipe slices, lockstep dependency matrix resolution, and transactional rollback protection.
- Introduce `@forgestack/cli`: An interactive command-line interface distributed via npm/npx (`npx create-forgestack-app`) with `@clack/prompts` and fully scriptable non-interactive CI flags.
- Introduce `@forgestack/desktop`: A high-performance native desktop application built with Tauri v2 and React/Tailwind, featuring native folder selection, live interactive file-tree preview, real-time dependency inspection, and execution streaming.
- Introduce Composable Feature Slices:
  - **Monorepo Kernel**: pnpm workspaces + Turborepo, shared type contracts (`@repo/contracts`), shared UI components (`@repo/ui`), and lint/TS configurations.
  - **Frontend Slices**: React 19 + TypeScript + Vite, Tailwind CSS v4, TanStack Query v5, Redux Toolkit, Zustand, Sonner toast notifications, Lucide icons, React Hook Form + Zod.
  - **Backend Slices**: Node.js ESM (`"type": "module"`), Clean Modular Architecture (controllers, services, repositories, schemas), Fastify / Express.
  - **Database Integration Slices**: Production connection pooling, query health checks (`SELECT 1`), exponential backoff retry loops, and graceful teardown (`SIGINT`/`SIGTERM`) for PostgreSQL (Drizzle ORM / Prisma) and MongoDB (Mongoose).
  - **AI Agent Governance Slices**: Embedded OpenSpec workflow definitions (`openspec/`), Antigravity agent configurations (`.agents/`), Cursor rules (`.cursor/rules/`), and GitHub Copilot instructions (`.github/copilot-instructions.md`) with brutally honest reviewer rules and boundary enforcement.
  - **Containerization**: Automatic `docker-compose.yml` generation for local database services and multi-stage Dockerfiles.

## Capabilities

### New Capabilities
- `scaffolding-engine`: In-memory Virtual File System (VFS), Layered Recipe Composition, lockstep dependency matrix resolution, AST/slot code patching, atomic disk commit, and transactional rollback on failure.
- `cli-generator`: Interactive TUI via `@clack/prompts` and headless scriptable CLI flags for automated bootstrapping and CI environments.
- `desktop-app`: Tauri v2 cross-platform desktop wizard with native OS folder picker, live file-tree preview, dynamic package dependency inspector, and execution logs.
- `template-presets`: Additive, composable code slices for Monorepo (pnpm + Turborepo), React 19 frontend stack, Node.js ESM clean modular backend, PostgreSQL/MongoDB connection pools, and AI agent rule scaffolding.

### Modified Capabilities
<!-- No existing capabilities to modify; this is a greenfield platform setup. -->

## Impact

- **New Packages Created**:
  - `packages/core`: Core generator logic and recipe resolver.
  - `packages/cli`: Terminal interface and binary entry points.
  - `packages/desktop`: Tauri v2 application (Rust backend + React frontend).
- **Ecosystem Dependencies**:
  - `pnpm` >= 9.x, Node.js >= 20 LTS, Rust toolchain (for Tauri v2 desktop compilation).
- **Target Output Compatibility**:
  - All generated code targets modern LTS runtimes (Node.js 20/22, modern evergreen browsers) with zero peer dependency conflicts.
