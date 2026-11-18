# Desktop App Delta Specification

## ADDED Requirements

### Requirement: Interactive Architecture Topology Visualizer
The Desktop Studio SHALL render an interactive visual diagram displaying how frontend, backend, database, and packages connect.

#### Scenario: Viewing Architecture Topology
- **Given** a user navigates to Step 1 or Step 4 in the Stepper Studio
- **When** the architecture card is selected
- **Then** a visual node graph displays packages (`apps/*`, `packages/*`) and communication links

### Requirement: One-Click Local Stack Runner
The Desktop Studio SHALL provide an action to run the scaffolded project stack locally via Tauri child process management.

#### Scenario: Running Local Dev Stack
- **Given** a project has been successfully synthesized to disk
- **When** the user clicks "Start Dev Stack"
- **Then** the studio spawns `pnpm dev` and Docker containers in the background, streaming output to the Execution Console

### Requirement: Reactive File Tree Preview for Dynamic Stacks
The live interactive virtual file-tree preview SHALL correctly reflect Hono, SQLite, Tauri v2, and Better-Auth files as users change configuration choices in the studio.

#### Scenario: Selecting SQLite in Desktop Wizard
- **Given** the user selects SQLite in BackendGrid
- **When** the virtual file tree preview updates
- **Then** the preview displays `better-sqlite3` database client and schema files
