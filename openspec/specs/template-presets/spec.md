# Template Presets Specification

## Purpose

Defines the composable code slices, configurations, and boilerplate templates for monorepos, React 19 frontends, Node.js ESM clean modular backends, database connections, and AI agent governance rules.

## Requirements

### Requirement: Monorepo Architecture with Turborepo and pnpm
The system SHALL generate an enterprise monorepo structure utilizing pnpm workspaces and Turborepo for pipeline orchestration and caching across frontend, backend, and shared packages.

#### Scenario: Monorepo workspace configuration
- **WHEN** the user selects the Monorepo topology
- **THEN** the generated root directory contains `pnpm-workspace.yaml`, `turbo.json`, `apps/web`, `apps/api`, `packages/contracts`, `packages/ui`, and shared configuration packages

#### Scenario: Shared type contracts package
- **WHEN** the monorepo is scaffolded
- **THEN** `packages/contracts` contains typed Zod schemas for shared API request and response DTOs that are directly consumable by both `apps/web` and `apps/api`

### Requirement: Frontend Stack Slices (React 19 + TypeScript)
The system SHALL provide modular frontend slices for React 19 with Vite, Tailwind CSS v4, Lucide icons, Sonner toast notifications, and configurable state/fetching layers (TanStack Query, Redux Toolkit, Zustand).

#### Scenario: Scaffold React with TanStack Query and Sonner
- **WHEN** the frontend slice includes TanStack Query and Sonner
- **THEN** `apps/web/src/providers/` includes a pre-configured `QueryClientProvider` with default cache options and a `<Toaster />` component mounted in the app root

#### Scenario: Scaffold React with Redux Toolkit
- **WHEN** the frontend slice includes Redux Toolkit
- **THEN** `apps/web/src/store/` includes a typed Redux store configuration, root reducer, and pre-typed custom hooks (`useAppDispatch`, `useAppSelector`)

### Requirement: Backend Stack Slices (Node.js ESM Clean Modular Architecture)
The system SHALL generate a Node.js ESM backend with strict separation of concerns into controllers, services, repositories, routes, environment validation, and error middlewares.

#### Scenario: Environment validation at boot
- **WHEN** the backend application starts up
- **THEN** `src/config/env.ts` parses and validates all required environment variables using Zod and immediately aborts process startup if any variable is missing or malformed

#### Scenario: Modular domain routing and controller isolation
- **WHEN** a feature module is generated
- **THEN** domain routes delegate request handling to controller methods, controllers invoke business logic in services, and services interact with repositories without direct database calls in controllers

### Requirement: Production Database Connection Slices
The system SHALL generate resilient database connection singletons with connection pooling, startup connectivity checks, exponential retry backoff, and graceful process shutdown handlers for PostgreSQL and MongoDB.

#### Scenario: PostgreSQL connection pool and health check
- **WHEN** PostgreSQL with Drizzle or Prisma is selected
- **THEN** `src/database/connection.ts` instantiates a pooled client, verifies connectivity with a `SELECT 1` query at boot, and registers hooks to close the pool on `SIGINT` and `SIGTERM` signals

#### Scenario: MongoDB connection with reconnect retry loop
- **WHEN** MongoDB with Mongoose is selected
- **THEN** `src/database/connection.ts` implements a multi-attempt retry loop with exponential delay on startup failure and binds connection status event listeners (`connected`, `disconnected`, `error`)

### Requirement: AI Agent Rules and Governance Scaffolding
The system SHALL scaffold first-class AI agent governance files including `.agents/` workflows, `.agents/skills/` (including modern UI engineering and clean code craftsmanship skills), `.cursor/rules/`, `.github/copilot-instructions.md`, and OpenSpec definitions enforcing architectural boundaries and code rigor.

#### Scenario: AI rule enforcement files generated
- **WHEN** AI Agent governance is enabled
- **THEN** the project includes `.cursor/rules/brutal-reviewer.mdc` prohibiting raw DB queries in controllers and enforcing zero-`any` TypeScript rules, along with pre-configured OpenSpec workflows

#### Scenario: Agent skills for UI and Clean Code installed
- **WHEN** AI Agent governance is scaffolded
- **THEN** the project includes `.agents/skills/modern-ui-engineering/SKILL.md` (defining accessibility, design tokens, Radix primitives, and layout rules) and `.agents/skills/clean-code-craftsmanship/SKILL.md` (defining strict TypeScript, domain separation, and error handling)

### Requirement: Curated Native Tauri Desktop Preset
ForgeStack SHALL provide a built-in preset for high-performance native desktop development using Tauri v2 and React 19.

#### Scenario: Selecting Tauri Desktop Preset
- **Given** the user selects the `preset-tauri-desktop` template
- **When** the template configuration is loaded
- **Then** the topology is `tauri-desktop` with React 19 frontend and Rust backend configuration

### Requirement: Curated AI-Native Agent and RAG Portal Preset
ForgeStack SHALL provide a built-in preset for AI-driven applications with vector search and streaming.

#### Scenario: Selecting AI Agent Preset
- **Given** the user selects the `preset-ai-rag` template
- **When** the template configuration is loaded
- **Then** the topology is `ai-agent-rag` with PostgreSQL, Drizzle ORM, pgvector, and Vercel AI SDK

### Requirement: Curated Distributed Worker API Preset
ForgeStack SHALL provide a built-in preset for background task processing and WebSocket events.

#### Scenario: Selecting Distributed Worker Preset
- **Given** the user selects the `preset-distributed-worker` template
- **When** the template configuration is loaded
- **Then** the topology includes Fastify, Redis, BullMQ queue worker, and WebSocket server

### Requirement: Next.js Full-Stack Preset Database Synthesis
The `preset-nextjs` preset SHALL generate working database connection pools, Drizzle schema, and migration scripts.

#### Scenario: Loading Next.js Preset with Database
- **Given** the user loads `preset-nextjs`
- **When** the template is synthesized to VFS
- **Then** database client and schema files are staged alongside Next.js App Router files

### Requirement: Curated CLI Default Templates
The CLI SHALL provide a catalog of curated default architecture presets that can be selected in a single prompt or via the `--template` flag.

#### Scenario: Selecting curated template from interactive prompt
- **Given** a user initiates project scaffolding
- **When** the setup flow prompt appears
- **Then** the user can choose "Use a Curated Default Template" and select from Enterprise Monorepo, AI Agent RAG, Tauri Desktop, Next.js Fullstack, or Micro-Frontend

#### Scenario: Selecting template via CLI flag
- **Given** a user runs `create-forgestack-app my-ai-app --template ai-agent-rag`
- **When** the command executes
- **Then** the CLI resolves the curated `ai-agent-rag` configuration and scaffolds the complete stack directly

### Requirement: Custom Reusable Template Persistence and Management
The CLI SHALL allow developers to save customized stack configurations to a persistent local catalog (`~/.forgestack/templates.json`) and instantiate or manage them.

#### Scenario: Saving a custom template via interactive prompt
- **Given** a user completes custom stack selection in the wizard
- **When** prompted to save the stack as a template
- **Then** providing a template name persists the configuration to `~/.forgestack/templates.json`

#### Scenario: Saving a custom template via CLI flag
- **Given** a user executes `create-forgestack-app my-app --topology monorepo --auth better-auth --save-template my-team-stack`
- **When** the command finishes scaffolding
- **Then** `my-team-stack` is saved to the local template catalog and is immediately reusable via `--template my-team-stack`

#### Scenario: Listing and deleting saved templates via subcommands
- **Given** saved templates exist in `~/.forgestack/templates.json`
- **When** the user executes `forgestack template list` or `forgestack template delete <name>`
- **Then** the CLI lists all curated and custom templates in a formatted table or removes the specified custom template
