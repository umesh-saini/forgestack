# Template Presets Delta Specification

## ADDED Requirements

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
