# Change Proposal: CLI OpenSpec-Inspired UI, Curated & Reusable Templates, and Next.js Getting Started UX

## Why

ForgeStack now possesses a comprehensive multi-topology engine and production primitives, but the command-line interface remains basic and rigid. To succeed as a premier NPM package (`npx create-forgestack-app`), the CLI requires four key developer experience enhancements:

1. **Next.js Getting Started UX**: Supporting positional directory arguments (`my-app` or `.`), directory validation, and `-y`/`--yes` instant generation.
2. **OpenSpec-Inspired Terminal UI**: Visual welcome banners, step-by-step guidance, and live searchable/filterable multi-selection for AI agent skills and stack options.
3. **Curated Best Default Templates**: One-click selection of battle-tested presets (Monorepo, AI RAG, Tauri Desktop, Next.js, Micro-Frontend) for instant onboarding.
4. **Custom Template Reuse & Persistence**: Saving customized configurations to a local catalog (`~/.forgestack/templates.json`) so developers can reuse personalized stacks across projects.

## What Changes

1. **Positional Target Directory Resolution (`create-next-app` Style)**:
   - Accept positional argument `[dir]` (e.g. `npx create-forgestack-app my-app`).
   - If argument is `.`, scaffold directly into the current working directory, using the directory basename as the project name.
   - If no argument is passed, prompt: `What is your project named? (my-app, or . for current directory)`.
   - Provide non-empty directory detection with interactive confirmation or `--force` / `--overwrite` override.
   - Support `-y` / `--yes` flag to bypass interactive prompts and scaffold immediately with default curated stack.

2. **OpenSpec-Inspired Interactive Terminal UI**:
   - Rich branded welcome splash banner detailing configured subsystems and quickstart workflows.
   - Interactive searchable and filterable multiselect prompt with keyboard navigation, instant query filtering, and pagination for AI Agent skills and tool integrations.
   - High-contrast visual styling using picocolors and clack formatting with clear step progression.
   - Enhanced post-scaffolding summary card displaying physical file count, architecture topology, and next-step execution commands.

3. **Curated Best Default Templates**:
   - Provide first-class CLI template presets:
     - `enterprise-monorepo`: Turborepo + React 19 + Fastify + Postgres Drizzle + tRPC + Better-Auth + Playwright + CI/CD.
     - `ai-agent-rag`: AI-Native Agent / RAG Monorepo + pgvector + OpenAI Tool Calling + SSE Streaming Chat + MCP.
     - `tauri-desktop`: Native Tauri v2 Desktop + Rust + React 19 + Tailwind v4 + IPC bindings.
     - `nextjs-fullstack`: Next.js 15 Full-Stack + Server Actions + Postgres Drizzle + Tailwind v4.
     - `micro-frontend`: Vite Module Federation host + remote + event-bus.
     - `distributed-worker`: Fastify + BullMQ Redis Task Queue + Docker Compose.
     - `standalone-fe`: React 19 + Vite + Tailwind v4 + TanStack Query.
     - `standalone-be`: Clean Modular Node.js ESM Backend + Postgres Drizzle.
   - Wizard entry point allows choosing between: Curated Template Preset, Custom Stack Step-by-Step, or Saved Custom Template.
   - CLI flag `--template <name>` / `-t <name>` to bypass wizard and scaffold a template immediately.

4. **Custom Template Creation, Storage & Reuse**:
   - Add template storage manager reading/writing `~/.forgestack/templates.json`.
   - Flag `--save-template <name>`: saves current interactive or flag configuration as a named reusable template.
   - Interactive prompt at wizard conclusion: "Save this stack configuration as a reusable template? (y/N)".
   - Dedicated CLI subcommands:
     - `forgestack template list`: outputs formatted list of curated and user-saved templates.
     - `forgestack template save <name>`: persists a configuration as a template.
     - `forgestack template delete <name>`: removes a saved user template.

5. **Universal Flag Coverage**:
   - Ensure every single configuration field is fully controllable via CLI flags (`--topology`, `--fe`, `--styling`, `--state`, `--be`, `--db`, `--orm`, `--auth`, `--rpc`, `--queue`, `--testing`, `--ci`, `--mcp`, `--rules`, `--skills`, `--openspec`, `--container`, `--pm`, `--git`, `--install`, `--yes`, `--dry-run`).

## Capabilities Added / Modified

- `cli-generator`: Added Next.js positional directory and `.` handling, OpenSpec-inspired searchable TUI components, `--yes` / `-y` flag, and universal CLI flags.
- `template-presets`: Added CLI curated default presets registry, file-based custom template persistence (`~/.forgestack/templates.json`), and template management subcommands (`template list`, `template delete`).

## Impact Assessment

- **Compatibility**: Completely backwards compatible with existing `@forgestack/core` engine. Extends `@forgestack/cli` commander commands and prompts.
- **NPM Package Readiness**: Fully packaged for global or `npx` execution as `create-forgestack-app`.
- **Developer Experience**: Drastically reduces scaffolding friction from 15 sequential questions down to 1 command (`npx create-forgestack-app my-app -y` or `--template ai-agent-rag`).
