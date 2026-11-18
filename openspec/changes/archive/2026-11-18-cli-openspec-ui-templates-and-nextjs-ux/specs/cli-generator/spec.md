# CLI Generator Delta Specification

## ADDED Requirements

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
