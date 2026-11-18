# Scaffolding Engine Specification

## Purpose

Provides a deterministic, headless scaffolding engine with in-memory Virtual File System (VFS) staging, additive recipe composition, lockstep dependency resolution, and transactional rollback protection.

## Requirements

### Requirement: In-Memory Virtual File System (VFS) Staging
The scaffolding engine SHALL stage all directory paths, file contents, configuration merges, and AST transformations completely in memory prior to committing any write operations to the physical filesystem.

#### Scenario: Successful staging without disk mutation
- **WHEN** the generator engine begins synthesizing project files for a selected configuration
- **THEN** no folders or files are created or modified on the host operating system disk until all composition and validation rules succeed

#### Scenario: Staging collision detection
- **WHEN** multiple feature slices attempt to write conflicting content to the same file path without a registered merge strategy
- **THEN** the engine MUST halt staging and return a diagnostic error identifying the conflicting slices and file path

### Requirement: Additive Layered Recipe Composition
The engine SHALL construct complete project topologies by applying independent, additive feature slices onto a base kernel without relying on monolithic, pre-baked directory templates.

#### Scenario: Applying additive slices
- **WHEN** a user selects a monorepo kernel with Tailwind CSS and TanStack Query slices
- **THEN** the engine applies the base monorepo structure, then sequentially layers the Tailwind and TanStack Query file actions and configuration mutations onto the virtual file system

### Requirement: Deterministic Dependency Lockstep Resolution
The engine SHALL resolve all runtime and development dependencies against an internally pinned, lockstep version registry to prevent peer dependency mismatches and version drift.

#### Scenario: Pinned dependency generation
- **WHEN** `package.json` manifests are compiled for any combination of frontend, backend, or shared packages
- **THEN** all dependency version strings MUST match the exact semver ranges defined in the engine lockstep registry

### Requirement: Transactional Disk Commit and Rollback
The engine SHALL execute physical disk writes within an atomic two-phase commit routine and MUST automatically revert changes if a write, permission check, or lifecycle hook fails.

#### Scenario: Automatic rollback on install or write error
- **WHEN** a physical file write fails due to permissions or an initialization command exits with a non-zero code
- **THEN** the engine MUST delete all partially generated files and directories created during that run, leaving the destination path clean

#### Scenario: Successful atomic flush
- **WHEN** pre-flight target directory validation passes and all virtual staging actions succeed
- **THEN** the engine writes all staged files to disk, initializes a git repository, and executes the designated package manager installation

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
