# CLI Generator Specification

## Purpose

Provides a responsive terminal interface (interactive TUI and scriptable non-interactive CI flags) to capture user architecture choices and invoke the core scaffolding engine.

## Requirements

### Requirement: Interactive Terminal User Interface
The CLI SHALL provide a terminal prompt flow powered by `@clack/prompts` that guides the user through project topology, frontend frameworks, backend runtimes, database engines, and AI rule configurations.

#### Scenario: Complete interactive prompt walk-through
- **WHEN** the user executes the CLI without flags in a supported terminal
- **THEN** the system prompts sequentially for project name, target path, architecture type, frontend options, backend options, database connections, and AI governance rules with interactive single-select and multi-select menus

#### Scenario: Input validation for project name and target path
- **WHEN** the user enters an invalid directory name containing prohibited characters or specifies an existing non-empty directory
- **THEN** the CLI displays an inline validation error and prevents progression until a valid project name or empty path is provided

### Requirement: Scriptable Non-Interactive Execution
The CLI SHALL accept command-line arguments and flags to enable fully automated, non-interactive project generation for CI pipelines and automation scripts.

#### Scenario: Headless generation with CLI flags
- **WHEN** the CLI is invoked with explicit flags such as `--topology monorepo --fe react-vite --be fastify --db postgres --path ./my-app --install`
- **THEN** the CLI bypasses all interactive prompts, validates flag compatibility, and directly executes generation via the core engine

#### Scenario: Incompatible flag combination error
- **WHEN** mutually exclusive flags are passed (such as `--db postgres` combined with `--orm mongoose`)
- **THEN** the CLI terminates immediately with a descriptive error message explaining the incompatibility and exits with code 1

### Requirement: Real-Time Execution Feedback
The CLI SHALL display visual progress indicators and streaming output during virtual staging, atomic disk flush, and package manager installation.

#### Scenario: Visual installation spinner
- **WHEN** the engine is executing package manager installation or git initialization
- **THEN** the CLI displays animated terminal spinners and completion status icons for each lifecycle phase

### Requirement: Interactive Prompts for Next-Gen Archetypes and Primitives
The CLI interactive prompt wizard SHALL allow developers to select Tauri v2, AI RAG, Hono, SQLite, Better-Auth, and tRPC.

#### Scenario: Running Interactive Wizard with Tauri Desktop
- **Given** a developer runs `create-forgestack-app` without flags
- **When** the architecture topology prompt is displayed
- **Then** `tauri-desktop` and `ai-agent-rag` appear as selectable options

#### Scenario: Selecting Hono Framework in CLI
- **Given** a developer selects backend options in interactive mode
- **When** the framework prompt appears
- **Then** `hono` is selectable and generates `@hono/node-server` files

### Requirement: CLI Automation Flags for Extended Tooling
The headless CLI SHALL provide scriptable flags for all newly added architectures, authentication providers, and RPC options.

#### Scenario: Headless Generation with New Flags
- **Given** `create-forgestack-app my-app --topology tauri-desktop --git --no-install`
- **When** the command executes
- **Then** the CLI parses options and scaffolds the complete Tauri v2 native stack
