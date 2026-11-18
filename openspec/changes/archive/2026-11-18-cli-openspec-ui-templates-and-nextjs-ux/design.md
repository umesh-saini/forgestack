# Architectural Design: CLI OpenSpec-Inspired UI, Curated & Reusable Templates, and Next.js Getting Started UX

## Overview

This specification designs an advanced, developer-centric terminal experience for `@forgestack/cli` (`create-forgestack-app`). It integrates the intuitive ergonomics of Next.js's `create-next-app` (positional directory resolution, `.` support, non-empty folder confirmation, `-y`/`--yes` instant setup) with an OpenSpec-inspired terminal UI (branded splash banner, keyboard-driven searchable multi-select for AI skills, step-by-step wizard) and a template system allowing instant instantiation of curated presets and persistent local custom templates.

---

## Architecture & Subsystems

```
┌────────────────────────────────────────────────────────────────────────┐
│                        create-forgestack-app                           │
└────────────────────────────────────────────────────────────────────────┘
                                    │
       ┌────────────────────────────┴───────────────────────────┐
       ▼                                                        ▼
┌───────────────────────────────┐              ┌────────────────────────────────┐
│   CLI Parser & Dispatcher     │              │     Template Manager CLI       │
│  (Commander 13 + Flag Engine) │              │  (forgestack template list/del)│
└───────────────────────────────┘              └────────────────────────────────┘
       │                                                        │
       ├─────────────────────────────────┐                      │
       ▼                                 ▼                      ▼
┌──────────────────────────────┐  ┌─────────────────────────────────────────────┐
│  Directory & Path Resolver   │  │           Template Storage Catalog          │
│ - Positional arg / "." / cwd │  │ - Built-in Curated Presets Registry        │
│ - Collision & empty checks   │  │ - Persistent User Store (~/.forgestack)     │
│ - Basename normalization     │  └─────────────────────────────────────────────┘
└──────────────────────────────┘                                │
       │                                                        │
       ▼                                                        ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                    Terminal UI Engine (@clack/prompts + TUI)                  │
│ - OpenSpec-Style Welcome Splash & Workflow Overview                           │
│ - Flow Selector: [Curated Preset] vs [Custom Wizard] vs [Saved Template]      │
│ - Searchable / Filterable Multi-Select Component (Live Query Buffer)          │
│ - Execution Console & Post-Scaffold Next-Steps Summary Card                   │
└───────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                    @forgestack/core Virtual File System                       │
│ - generateProjectVfs(config) -> Atomic TransactionalFlusher -> Disk           │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Directory & Path Resolution (`create-next-app` Inspiration)

### 1.1 Resolution Algorithm
The CLI accepts a positional directory argument: `create-forgestack-app [dir] [options]`.

1. **Explicit Directory (`my-app`)**:
   - `targetPath = path.resolve(process.cwd(), dir)`
   - `projectName = path.basename(targetPath)`
2. **Current Directory (`.` or `./`)**:
   - `targetPath = process.cwd()`
   - `projectName = path.basename(targetPath)`
3. **Unspecified Directory**:
   - In interactive mode: Prompts `What is your project named?` with placeholder `my-app` and default `my-app`. Supports inputting `.` to target the current directory.
   - In non-interactive mode (`--yes` or flags without positional arg): Defaults to `my-app` in `process.cwd()`.

### 1.2 Non-Empty Directory Collision Handling
- If `targetPath` exists and contains files:
  - If `--force` or `--overwrite` is passed: Proceed without prompt.
  - If interactive: Prompt confirmation: `The directory "${projectName}" contains files. Continue and potentially overwrite? (y/N)`.
  - If user cancels or if non-interactive without `--force`: Terminate with clear diagnostic error.

---

## 2. OpenSpec-Inspired Terminal UI (TUI)

### 2.1 Welcome Splash Screen
Before prompts begin, display a framed ASCII and styled overview card matching the OpenSpec CLI visual aesthetic:
- **Header**: `ForgeStack v1.0.0`
- **Tagline**: `The AI-Native Full-Stack Architecture Generator`
- **Configured Subsystems**:
  - Architecture Topology (Monorepo, Micro-Frontend, Tauri, AI RAG, Distributed Worker)
  - Type-Safe End-to-End Contracts (tRPC v11, Zod DTOs)
  - Data Persistence & Migrations (PostgreSQL, SQLite WAL, MongoDB)
  - AI Agent Governance & MCP (Cursor Rules, Skills, Model Context Protocol)
- **Quickstart Guide**:
  - `pnpm dev` - Start full-stack local services
  - `npx openspec validate` - Verify spec contracts

### 2.2 Searchable / Filterable Multi-Select Widget
For selecting AI skills and enhancements from an extensive catalog, standard terminal pickers become cumbersome. The CLI implements a searchable multi-select widget (matching the OpenSpec tools selector from the uploaded screenshots):
- Real-time search query buffer (`Search: [type to filter]`).
- Live filtering of displayed items matching query substring.
- Keyboard navigation:
  - `↑` / `↓` / `k` / `j`: Move active cursor.
  - `Space`: Toggle selection state `[x]` / `[ ]`.
  - `Backspace`: Delete search filter character.
  - `Enter`: Confirm selection.
- Visual status header: `? Select AI Agent Skills & Tool integrations (18 available)` and `Selected: <item1>, <item2>`.
- Page indicator `(1/3)` when choices exceed terminal viewport height.

---

## 3. Curated Default Templates & Template Reuse

### 3.1 Curated Default Presets
Built-in templates baked into the CLI executable:
1. `enterprise-monorepo`: Turborepo, React 19, Fastify, PostgreSQL (Drizzle), tRPC v11, Better-Auth, Playwright, GitHub Actions CI/CD.
2. `ai-agent-rag`: AI-Native Monorepo, React 19 Streaming Chat, Fastify OpenAI Agent, pgvector Drizzle schema, `@repo/mcp-server`.
3. `tauri-desktop`: Tauri v2, Rust native core, React 19, Tailwind CSS v4, secure contextBridge IPC bindings.
4. `nextjs-fullstack`: Next.js 15 App Router, Server Actions, PostgreSQL (Drizzle ORM), Tailwind CSS v4.
5. `micro-frontend`: Vite Module Federation host shell (:5000), remote dashboard (:5001), and typed `@repo/event-bus`.
6. `distributed-worker`: Fastify task producer, BullMQ worker consumer (`src/worker.ts`), Redis 7 Alpine container.
7. `standalone-fe`: React 19 client SPA, Vite 6, Tailwind CSS v4, TanStack Query v5.
8. `standalone-be`: Clean Modular Node.js ESM service, Fastify, PostgreSQL (Drizzle ORM).

### 3.2 Setup Flow Selection
When running interactively, the first prompt after project name presents a high-level fork:
```text
? How would you like to initialize your project?
  > 🌟 Use a Curated Default Template (Instant Setup)
    🛠️  Custom Stack Wizard (Configure every technology & primitive)
    📂 Load a Saved Custom Template
```

### 3.3 Custom Template Persistence (`~/.forgestack/templates.json`)
- **Storage Location**: Stored in user home directory (`path.join(os.homedir(), '.forgestack', 'templates.json')`).
- **Data Schema**:
```typescript
interface StoredTemplate {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  config: Omit<ProjectConfig, 'name' | 'targetPath'>;
}
```
- **Save Hooks**:
  - Interactive: Prompt at wizard conclusion: `Would you like to save this configuration as a reusable template? (y/N)`.
  - Flag: `create-forgestack-app --save-template <name> ...` persists the configured options.
- **CLI Subcommands**:
  - `forgestack template list` (or `create-forgestack-app template list`): Displays an ASCII table of all available curated presets and user saved templates.
  - `forgestack template delete <id>`: Removes a saved template.

---

## 4. Universal CLI Flags & Non-Interactive CI Matrix

Every configuration option must be controllable directly via flags:

| Flag | Values | Description |
|---|---|---|
| `[dir]` | `string` / `.` | Target project directory |
| `-y, --yes` | boolean | Accept default curated stack without prompting |
| `-t, --template <name>` | `string` | Use curated or saved template |
| `--save-template <name>` | `string` | Save current options as reusable template |
| `--topology <type>` | `monorepo`, `ai-agent-rag`, `tauri-desktop`, etc. | Architecture topology |
| `--fe <framework>` | `react-vite`, `nextjs`, `none` | Frontend framework |
| `--styling <type>` | `tailwind`, `none` | Styling engine |
| `--state <type>` | `query`, `redux`, `zustand`, `none` | Frontend state management |
| `--be <framework>` | `fastify`, `express`, `hono`, `none` | Backend framework |
| `--db <engine>` | `postgres`, `mongodb`, `sqlite`, `none` | Database engine |
| `--orm <orm>` | `drizzle`, `prisma`, `mongoose`, `none` | ORM / ODM |
| `--auth <provider>` | `better-auth`, `none` | Authentication provider |
| `--rpc <protocol>` | `trpc`, `none` | End-to-end RPC protocol |
| `--queue <type>` | `bullmq`, `none` | Distributed queue |
| `--testing <framework>` | `playwright`, `none` | E2E testing framework |
| `--ci <provider>` | `github-actions`, `none` | CI/CD automation |
| `--mcp / --no-mcp` | boolean | Include Model Context Protocol server |
| `--rules / --no-rules` | boolean | Include Cursor rules |
| `--skills / --no-skills` | boolean | Include AI Agent skills |
| `--openspec / --no-openspec` | boolean | Include OpenSpec workflows |
| `--container / --no-container` | boolean | Generate Docker compose & Dockerfiles |
| `--pm <manager>` | `pnpm`, `npm`, `yarn`, `bun` | Package manager |
| `--git / --no-git` | boolean | Initialize Git repository |
| `--install / --no-install` | boolean | Run automatic dependency install |
| `--force` | boolean | Allow overwriting non-empty target directory |
| `--dry-run` | boolean | Preview staged VFS files without writing to disk |
