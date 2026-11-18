# CLI Generator Delta Specification

## ADDED Requirements

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
