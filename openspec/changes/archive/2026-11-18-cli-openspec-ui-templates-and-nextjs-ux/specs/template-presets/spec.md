# Template Presets Delta Specification

## ADDED Requirements

### Requirement: Curated CLI Default Templates
The CLI SHALL provide a catalog of curated default architecture presets that can be selected in a single prompt or via the `--template` flag.

#### Scenario: Selecting curated template from interactive prompt
- **Given** a user initiates project scaffolding
- **When** the setup flow prompt appears
- **Then** the user can choose "Use a Curated Default Template" and select from Enterprise Monorepo, AI Agent RAG, Tauri Desktop, Next.js Fullstack, or Micro-Frontend

#### Scenario: Selecting template via CLI flag
- **Given** a user runs `create-forgestack-app my-ai-app --template ai-agent-rag`
- **When** the command executes
- **Then** the CLI resolves the curated `ai-agent-rag` configuration and scaffolds the complete stack directly

### Requirement: Custom Reusable Template Persistence and Management
The CLI SHALL allow developers to save customized stack configurations to a persistent local catalog (`~/.forgestack/templates.json`) and instantiate or manage them.

#### Scenario: Saving a custom template via interactive prompt
- **Given** a user completes custom stack selection in the wizard
- **When** prompted to save the stack as a template
- **Then** providing a template name persists the configuration to `~/.forgestack/templates.json`

#### Scenario: Saving a custom template via CLI flag
- **Given** a user executes `create-forgestack-app my-app --topology monorepo --auth better-auth --save-template my-team-stack`
- **When** the command finishes scaffolding
- **Then** `my-team-stack` is saved to the local template catalog and is immediately reusable via `--template my-team-stack`

#### Scenario: Listing and deleting saved templates via subcommands
- **Given** saved templates exist in `~/.forgestack/templates.json`
- **When** the user executes `forgestack template list` or `forgestack template delete <name>`
- **Then** the CLI lists all curated and custom templates in a formatted table or removes the specified custom template
