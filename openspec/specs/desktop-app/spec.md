# Desktop App Specification

## Purpose

Provides a lightweight, cross-platform desktop application built on Tauri v2 that enables visual configuration, live file-tree inspection, native directory selection, and one-click project bootstrapping.

## Requirements

### Requirement: Native System Integration and Folder Selection
The desktop application SHALL integrate directly with the host operating system via Tauri v2 native dialog plugins to allow intuitive folder picking and directory write-permission verification.

#### Scenario: User selects target folder via native file dialog
- **WHEN** the user clicks the "Browse Directory" button in the desktop interface
- **THEN** the operating system native directory picker modal opens, and selecting a valid path populates the target destination input field

#### Scenario: Target directory path safety check
- **WHEN** a selected folder exists and contains pre-existing files
- **THEN** the desktop UI flags a warning indicating the directory is not empty and prompts the user to choose an empty folder or specify a new subfolder name

### Requirement: Live Interactive Virtual File-Tree Preview
The desktop application SHALL display a real-time, interactive file-tree visualization reflecting the exact folder structure and files that will be generated based on current user selections.

#### Scenario: Dynamic file tree updates on selection change
- **WHEN** the user toggles a feature (such as switching database from MongoDB to PostgreSQL or adding Redux Toolkit)
- **THEN** the virtual file tree dynamically adds, removes, or modifies the relevant files and folders in the visual inspector without modifying the host disk

### Requirement: Dependency Manifest Inspector
The desktop application SHALL provide a live dependency inspector showing the resolved `package.json` dependencies, devDependencies, and scripts for the active configuration.

#### Scenario: Previewing resolved dependencies
- **WHEN** the user views the dependency inspection panel before initiating scaffolding
- **THEN** the application renders the exact list of pinned packages and versions that will be installed across all apps and workspace packages

### Requirement: Execution Streaming and Post-Generation Actions
The desktop application SHALL stream real-time logs of the file creation, git commit, and package installation processes, and provide direct shortcuts to open the newly generated project.

#### Scenario: Post-generation shortcut triggers
- **WHEN** project generation successfully concludes
- **THEN** the desktop UI renders success feedback and enables action buttons to "Open in VS Code", "Open in Antigravity", and "Open Containing Folder"

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

### Requirement: Tauri Content Security Policy Hardening
The Desktop application SHALL enforce a strict Content Security Policy (CSP) prohibiting unauthorized remote script execution.

#### Scenario: Enforcing local execution policy
- **Given** the Tauri desktop application window is loaded
- **When** the webview initializes
- **Then** the Content Security Policy header restricts script sources to `'self'` and styles to `'self' 'unsafe-inline'`

### Requirement: Complete Architecture Topology Parity
The Desktop application SHALL expose all 10 engine topologies in the visual selector, including Next.js Full-Stack and Electron Desktop.

#### Scenario: Selecting Next.js 15 Full-Stack in Desktop Studio
- **Given** the user opens Step 1 in the desktop stepper wizard
- **When** the user views the architecture topology selector
- **Then** a visual card for `nextjs-fullstack` is selectable and displays Next.js 15 App Router badges

#### Scenario: Selecting Electron Desktop Studio
- **Given** the user opens Step 1 in the desktop stepper wizard
- **When** the user views the architecture topology selector
- **Then** a visual card for `electron-desktop` is selectable and displays Electron + React 19 badges
