# Scaffolding Engine Delta Specification

## ADDED Requirements

### Requirement: Native Tauri v2 Desktop Generator Slice
The generator SHALL support scaffolding cross-platform native desktop applications using Tauri v2 (Rust) and React 19 + Tailwind CSS v4.

#### Scenario: Scaffolding a Tauri Desktop Project
- **Given** a ProjectConfig with topology `tauri-desktop`
- **When** `generateProjectVfs(config)` is executed
- **Then** the VFS contains `src-tauri/Cargo.toml`, `src-tauri/tauri.conf.json`, `src-tauri/src/main.rs`, and `src-tauri/src/lib.rs`
- **And** the VFS contains `src/App.tsx`, `package.json`, and `vite.config.ts` configured for port 1420

### Requirement: Hono Web Framework Backend Slice
The generator SHALL support scaffolding lightweight, type-safe Hono web applications using `@hono/node-server`.

#### Scenario: Scaffolding a Standalone Hono Backend
- **Given** a ProjectConfig with backend framework `hono`
- **When** `generateProjectVfs(config)` is executed
- **Then** `package.json` includes `hono` and `@hono/node-server`
- **And** `src/server.ts` imports from `@hono/node-server` and initializes `new Hono()` without Express or Fastify dependencies

### Requirement: SQLite Database Slice with Drizzle ORM
The generator SHALL support scaffolding SQLite embedded databases with Drizzle ORM using `better-sqlite3`.

#### Scenario: Scaffolding SQLite Database
- **Given** a ProjectConfig with backend database `sqlite` and ORM `drizzle`
- **When** `generateProjectVfs(config)` is executed
- **Then** `package.json` contains `better-sqlite3` and `@types/better-sqlite3`
- **And** `src/database/client.ts` initializes `better-sqlite3` and exports Drizzle instance targeting SQLite dialect

### Requirement: AI-Native Agent and RAG Archetype
The generator SHALL support scaffolding full-stack AI applications with Vercel AI SDK and pgvector embeddings.

#### Scenario: Scaffolding AI RAG Stack
- **Given** a ProjectConfig with topology `ai-agent-rag`
- **When** `generateProjectVfs(config)` is executed
- **Then** `apps/api/src/ai/vector-store.ts` configures pgvector columns in Drizzle schema
- **And** `apps/api/src/modules/chat/chat.routes.ts` implements streaming SSE chat completion

### Requirement: Distributed Worker and Task Queue Slice
The generator SHALL support scaffolding asynchronous background workers using BullMQ and Redis.

#### Scenario: Scaffolding Worker Queue Stack
- **Given** a ProjectConfig with backend process manager or task queue `bullmq`
- **When** `generateProjectVfs(config)` is executed
- **Then** `package.json` contains `bullmq` and `ioredis`
- **And** `src/worker.ts` is staged with concurrency and retry handlers

### Requirement: Better-Auth Authentication Primitive
The generator SHALL support scaffolding type-safe authentication schemas and middleware.

#### Scenario: Scaffolding Better-Auth Provider
- **Given** a ProjectConfig with auth primitive `better-auth`
- **When** `generateProjectVfs(config)` is executed
- **Then** database schema files include `user`, `session`, `account`, and `verification` tables
- **And** `src/auth/auth.ts` exports the initialized auth server instance

### Requirement: End-to-End Type Safety via tRPC v11
The generator SHALL support scaffolding tRPC v11 for monorepos connecting frontend and backend.

#### Scenario: Scaffolding tRPC Monorepo
- **Given** a Monorepo ProjectConfig with RPC enabled
- **When** `generateProjectVfs(config)` is executed
- **Then** `apps/api` exports `AppRouter`
- **And** `packages/api-client` exports typed React query hooks

### Requirement: Playwright End-to-End Testing Slice
The generator SHALL support scaffolding cross-browser Playwright test configurations.

#### Scenario: Scaffolding Playwright Test Suite
- **Given** a ProjectConfig with testing extras enabled
- **When** `generateProjectVfs(config)` is executed
- **Then** `playwright.config.ts` is staged at the project root
- **And** a smoke test `tests/e2e/smoke.spec.ts` verifies health and hydration

### Requirement: CI/CD DevOps Pipeline Slice
The generator SHALL support scaffolding GitHub Actions CI matrix workflows.

#### Scenario: Scaffolding GitHub Actions CI Pipeline
- **Given** a ProjectConfig with CI workflows enabled
- **When** `generateProjectVfs(config)` is executed
- **Then** `.github/workflows/ci.yml` is staged with lint, typecheck, test, and build jobs

### Requirement: Standalone Full-Stack SSR Database Synthesis
The generator database slices SHALL support full-stack SSR architectures by ensuring database connection slices apply whenever a database is configured, regardless of whether `backend.framework` is `none`.

#### Scenario: Scaffolding Next.js with Drizzle and PostgreSQL
- **Given** a ProjectConfig with topology `nextjs-fullstack`, database `postgres`, and ORM `drizzle`
- **When** `generateProjectVfs(config)` is executed
- **Then** `src/db/client.ts` and `src/db/schema.ts` are generated within the Next.js directory
- **And** `drizzle.config.ts` is staged with Postgres dialect and migration directories
