# AI Universal Skills Specification

## Purpose
Enables any autonomous AI coding assistant (Antigravity, Claude Code, Cursor, Windsurf, Copilot, Cline, Continue, etc.) to immediately understand, invoke, and scaffold projects using ForgeStack with zero human guidance.

## ADDED Requirements

### Requirement: Authoritative Skill Document
The platform SHALL maintain an authoritative `forgestack/SKILL.md` file formatted with standard YAML frontmatter defining CLI syntax, topologies, slice options, and architecture rules.

#### Scenario: AI agent inspects ForgeStack skill
- **WHEN** an AI assistant reads `forgestack/SKILL.md`
- **THEN** it receives explicit command syntax for all topologies (monorepo, polyrepo, Next.js, Electron, SPA, API)
- **AND** it receives full slice flag options and architectural constraints.

### Requirement: Multi-Agent Skill Provisioner
The platform SHALL support automated provisioning of skills across Shared `.agents/skills`, Antigravity, Claude Code, Cursor, Windsurf, GitHub Copilot, and Cline.

#### Scenario: User runs AI skills initialization
- **WHEN** the user executes `create-forgestack-app --init-ai-skills` or triggers the setup from Desktop settings
- **THEN** valid configuration and skill files are written to the detected or specified agent directories
- **AND** existing unrelated user rules remain untouched.
