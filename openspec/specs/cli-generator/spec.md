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

### Requirement: Next.js-Inspired Project Directory and Current Directory Resolution
The CLI SHALL accept a positional directory argument and support scaffolding directly into the current directory when `.` is passed.

#### Scenario: Scaffolding with named directory argument
- **Given** a user runs `create-forgestack-app my-new-project`
- **When** the CLI initializes
- **Then** `my-new-project` is set as the project name and the target path resolves to `./my-new-project`

#### Scenario: Scaffolding directly into the current directory with dot notation
- **Given** a user runs `create-forgestack-app .`
- **When** the CLI initializes
- **Then** the target directory is set to `process.cwd()` and the project name defaults to the basename of the current working directory

#### Scenario: Handling existing non-empty directories
- **Given** a user targets a directory that contains existing files
- **When** neither `--force` nor `--overwrite` is specified
- **Then** the CLI prompts the user for confirmation in interactive mode or exits with an informative error in non-interactive mode

### Requirement: OpenSpec-Inspired Interactive Terminal UI with Filterable Selection
The CLI SHALL present an OpenSpec-inspired welcome splash screen and searchable, keyboard-navigable multi-selection prompt widgets.

#### Scenario: Welcome splash screen display
- **Given** a user executes `create-forgestack-app` in an interactive terminal
- **When** the CLI starts up
- **Then** an ASCII banner and overview card displaying configured subsystems and quickstart workflows is rendered

#### Scenario: Searchable filterable AI skills selection
- **Given** the user reaches the AI governance selection step
- **When** multiple skills and tool integrations are displayed
- **Then** the user can type characters into a search buffer to filter the options in real-time, toggle selections with Space, and confirm with Enter

### Requirement: Instant Generation with --yes Flag and Comprehensive CLI Flags
The CLI SHALL provide a `-y` / `--yes` flag to scaffold instantly using curated defaults, and ensure all configuration fields are exposed as command-line flags.

#### Scenario: Instant scaffolding with --yes flag
- **Given** a user runs `create-forgestack-app my-app --yes`
- **When** the command executes
- **Then** all interactive prompts are bypassed, the curated enterprise stack is generated immediately, and dependencies are installed

#### Scenario: Headless configuration using comprehensive flags
- **Given** a user runs `create-forgestack-app my-app --topology ai-agent-rag --auth better-auth --rpc trpc --testing playwright --ci github-actions --no-install`
- **When** the CLI parses the flags
- **Then** the project configuration matches every specified flag without prompting

### Requirement: Biome Linter Selection Flag
The CLI generator SHALL accept a `--linter <eslint | biome | none>` flag to configure code quality tools without interactive prompts.

#### Scenario: Headless configuration with Biome flag
- **Given** a user runs `create-forgestack-app my-app --linter biome`
- **When** the CLI parses arguments
- **Then** the generated project is configured with Biome instead of ESLint and Prettier

### Requirement: Cloud Deployment Descriptor Flag
The CLI generator SHALL accept a `--deploy <docker | vercel | cloudflare | railway | fly | none>` flag to emit deployment manifests for target hosting platforms.

#### Scenario: Specifying cloud deployment target via CLI
- **Given** a user runs `create-forgestack-app my-app --deploy vercel`
- **When** the project is scaffolded
- **Then** the `vercel.json` deployment manifest is staged and flushed into the project root
