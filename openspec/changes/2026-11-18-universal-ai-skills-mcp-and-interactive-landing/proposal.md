# Change Proposal: Universal AI Agent Skills, Direct Zero-OAuth MCP Server, and Interactive Showcase Landing Page

## Why

ForgeStack has achieved a robust foundation across its core in-memory AST composition engine (`@forgestack/core`), command-line interface (`@forgestack/cli`), and native multi-platform desktop application (`@forgestack/desktop` via Tauri v2). However, three critical ecosystem gaps restrict its adoption, developer reach, and autonomous AI leverage:

1. **AI Agent Ignorance & Knowledge Friction**: Modern developers and engineering teams utilize a diverse spectrum of autonomous AI coding assistants—including Antigravity, Claude Code, Cursor, Windsurf/Devin Desktop, GitHub Copilot, Cline, Continue, and shared `.agents/skills`. Currently, these agents have no built-in knowledge of ForgeStack's CLI flags, architecture archetypes, AST compositor, in-memory VFS manipulation, or custom template creation. Users are forced to manually instruct agents on how to run or configure the platform.
2. **Absence of Autonomous AI Tool Execution (MCP)**: For an AI agent to scaffold, inspect, or validate projects autonomously without human intervention, it needs a standardized Model Context Protocol (MCP) server. Existing external tools often enforce cumbersome OAuth flows or external cloud dependencies. ForgeStack requires a direct, local stdio/HTTP MCP server with zero OAuth requirements that allows any compliant AI assistant to inspect presets, validate project configurations, preview staged VFS trees in-memory, and scaffold projects directly onto physical disk.
3. **Missing Interactive Product Landing & Showcase**: While the Desktop Studio and CLI are fully operational, the platform lacks a public-facing, high-polish interactive showcase landing page. Taking direct architectural and visual inspiration from the Codezy flagship landing experience (`/home/dev/Documents/Kungfu/Lanet/Codezy/codezy/app/(public)/page.tsx`), ForgeStack requires a kinetic hero with live architecture visualizers, a 4-in-1 interactive stack configurator, feature spotlights, a competitor comparison matrix, changelog history, real desktop application screenshots, and zero-friction download/install options.

---

## What Changes

### 1. Universal AI Agent Skills Suite (`forgestack-agent-skills`)
- **Authoritative Skill Specification (`forgestack/SKILL.md`)**:
  - Detailed reference on how any AI assistant can invoke ForgeStack via CLI or Desktop.
  - Complete flag matrix (`--topology`, `--fe`, `--be`, `--db`, `--orm`, `--auth`, `--state`, `--install`, `--git`).
  - Architecture explanation: In-memory Virtual File System (VFS), AST Compositor, Slices, and Day-One AI Governance.
- **Universal Multi-Agent Exporter & Setup Tool**:
  - Executable via **CLI** (`npx create-forgestack-app --init-ai-skills` or dedicated subcommand `forgestack init-skills`).
  - Executable via **Desktop Studio GUI** (interactive AI configuration card in `/settings`).
  - Automatic detection and one-click provisioning across all major AI agent kits:
    - Shared `.agents/skills/forgestack/SKILL.md` (Universal standard)
    - Antigravity (`~/.gemini/antigravity/skills/forgestack/SKILL.md` / workspace)
    - Claude Code (`.claude/skills/forgestack/SKILL.md` / `CLAUDE.md`)
    - Cursor (`.cursor/rules/forgestack.mdc`)
    - Windsurf / Devin (`.windsurf/rules/forgestack.md`)
    - GitHub Copilot (`.github/copilot-instructions.md`)
    - Cline & Roo Code (`.clinerules` / `.roomodes`)

### 2. Zero-OAuth Model Context Protocol (MCP) Server (`@forgestack/mcp`)
- **Direct Local JSON-RPC MCP Server**:
  - Pure stdio and local HTTP transport with zero OAuth, zero API keys, and zero external cloud reliance.
  - Built on official Model Context Protocol standards.
- **Exposed MCP Tools**:
  - `forgestack_list_presets`: Returns all curated and custom templates with their complete architecture configs.
  - `forgestack_get_stack_options`: Queries available topologies, frontend frameworks, backends, databases, ORMs, auth providers, and AI governance engines.
  - `forgestack_validate_config`: Takes a proposed `ProjectConfig` JSON and validates it against Zod schemas, returning compatibility warnings or dependency conflict analyses.
  - `forgestack_preview_vfs`: Compiles a proposed project in-memory and returns the full virtual file tree and file previews without writing a single byte to disk.
  - `forgestack_scaffold_project`: Takes a configuration and destination directory, compiles the VFS, flushes atomically to physical disk, and optionally runs `git init` and package manager installs.
- **Client Configuration Blueprints**:
  - Drop-in configurations for Claude Desktop (`claude_desktop_config.json`), Cursor MCP settings, and Antigravity MCP configs.

### 3. Interactive Flagship Showcase Landing Page (`/landing`)
- **Visual Design & Architectural Benchmark**:
  - Clean, dark/light reactive kinetic UI modeled after Codezy's high-craft standard (`codezy/app/(public)/page.tsx`).
- **Landing Sections**:
  - **Kinetic Hero**: Live interactive typography, animated floating architecture nodes, one-click terminal copy snippet (`npx create-forgestack-app`), and primary CTAs (`Download for Linux`, `Launch Web Studio`).
  - **Velocity Marquee**: Scrolling architectural technology badges (React 19, Next.js 15, Turborepo, Fastify, Drizzle, Better-Auth, Playwright, Tailwind v4).
  - **Interactive 4-in-1 Stack Playground**: Real-time stack configurator embedded directly on the page, allowing users to toggle frameworks, databases, and governance engines with instant visual feedback.
  - **Desktop App Showcase & Visual Artifacts**: High-resolution studio screenshots, highlighting the Monaco-powered workspace, template manager, and native OS integrations.
  - **Feature Spotlight**: Deep-dive cards into AST Compositor, Zero-Collision Virtual File System, Day-One AI Governance, and Tauri v2 Native Desktop Engine.
  - **Competitor Comparison Matrix**: Feature-by-feature breakdown comparing ForgeStack against create-t3-app, Nx, create-next-app, and manual boilerplate repos.
  - **Changelog & Architecture Roadmap**: Interactive release history timeline (`v1.0.0`, `v1.1.0-preview`) with granular slice additions and stability milestones.
  - **Download & Installation Hub**: Clear download cards for Linux Debian (`.deb`), RedHat (`.rpm`), Standalone (`.AppImage`), and npm CLI instructions.
- **Studio Navigation Integration**:
  - Directly accessible via `/landing` route in `@forgestack/desktop`.
  - Prominently linked in [StudioNavbar.tsx](file:///home/dev/Documents/Kungfu/Test-Task/project-setup/packages/desktop/src/components/layout/StudioNavbar.tsx) with a dedicated "Overview / Showcase" link.

---

## Capabilities

### New Capabilities
- `ai-universal-skills`: Universal multi-agent skill definition and automated provisioning tool across 10+ AI coding agent environments.
- `mcp-server`: Zero-OAuth Model Context Protocol server exposing project validation, VFS preview, and automated scaffolding tools to AI models.
- `interactive-landing`: Flagship, kinetic product showcase landing page featuring real desktop screenshots, live stack configurators, competitor matrix, changelogs, and installer downloads.

---

## Impact & Dependencies

- **Dependencies**:
  - `@modelcontextprotocol/sdk`: Official MCP protocol server SDK.
  - `framer-motion` (or lightweight CSS/Tailwind motion primitives): Smooth kinetic transitions matching the Codezy aesthetic.
- **Affected Packages**:
  - `packages/core`: Add MCP-ready export wrappers and metadata helpers.
  - `packages/cli`: Add `mcp` binary launcher and `init-ai-skills` command.
  - `packages/desktop`: Add `/landing` route, landing components, screenshots, and AI agent setup settings card.
- **Breaking Changes**: None. All additions are additive and preserve 100% backward compatibility.
