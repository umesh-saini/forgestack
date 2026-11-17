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
