# @forgestk/cli (`create-forgestack-app` · `forgestack` · `forgestack-mcp`)

> Production-ready TypeScript project scaffolder and local MCP server for monorepos, full-stack apps, desktop apps, and workers—with auth, database, RPC, CI, and AI-agent rules already wired.

[![npm version](https://img.shields.io/npm/v/@forgestk/cli.svg?style=flat-square)](https://www.npmjs.com/package/@forgestk/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://github.com/umesh-saini/forgestack/blob/main/LICENSE)

[Website](https://umesh-saini.github.io/forgestack/) · [GitHub](https://github.com/umesh-saini/forgestack) · [`@forgestk/core`](https://www.npmjs.com/package/@forgestk/core)

---

## ⚡ Quick Start

Run directly with `npx` (no global install needed):

```bash
npx -p @forgestk/cli create-forgestack-app my-app
```

Or skip all prompts with recommended defaults (`--yes` / `-y`):

```bash
npx -p @forgestk/cli create-forgestack-app my-app --yes
cd my-app && pnpm dev
```

### Global Install (Short Commands)

Installing globally exposes `create-forgestack-app`, `forgestack`, and `forgestack-mcp`:

```bash
npm i -g @forgestk/cli

create-forgestack-app my-app
# or
forgestack my-app
```

### Scaffold Into Current Directory (`.`)

```bash
npx -p @forgestk/cli create-forgestack-app .
# overwrite non-empty directory without prompting:
npx -p @forgestk/cli create-forgestack-app . --force
```

---

## 🤖 Local MCP Server (`forgestack-mcp`)

`@forgestk/cli` ships **`forgestack-mcp`**, a local [Model Context Protocol](https://modelcontextprotocol.io) server (no account, no API key, no network calls) with 5 tools:

- `forgestack_list_presets` — List curated and saved templates
- `forgestack_get_stack_options` — List supported topologies, frameworks, databases, ORMs, etc.
- `forgestack_validate_config` — Validate a stack config before generating
- `forgestack_preview_vfs` — Preview the full file tree in memory without touching disk
- `forgestack_scaffold_project` — Generate the project on disk

### Setup in AI Coding Assistants

**Claude Code:**
```bash
claude mcp add --scope user forgestack -- npx -y -p @forgestk/cli forgestack-mcp
```

**Codex (OpenAI):**
```bash
codex mcp add forgestack -- npx -y -p @forgestk/cli forgestack-mcp
```

**Cursor / Antigravity / MCP JSON config:**
```json
{
  "mcpServers": {
    "forgestack": {
      "command": "npx",
      "args": ["-y", "-p", "@forgestk/cli", "forgestack-mcp"]
    }
  }
}
```

---

## 🌟 Curated Architecture Presets

Scaffold any preset instantly via `--template <id>`:

```bash
npx -p @forgestk/cli create-forgestack-app my-app --template <id>
```

| Template ID | Preset Name | Stack Highlights |
|:---|:---|:---|
| `enterprise-monorepo` | **Enterprise Monorepo** | Turborepo, React 19, Fastify, PostgreSQL (Drizzle), tRPC v11, Better-Auth, Playwright, CI/CD |
| `ai-agent-rag` | **AI-Native Agent & RAG** | pgvector cosine search, OpenAI tool-calling, SSE streaming chat, `@repo/mcp-server` |
| `tauri-desktop` | **Native Tauri v2 Desktop** | Rust Core, React 19, Tailwind CSS v4, secure IPC bindings |
| `nextjs-fullstack` | **Next.js 15 Full-Stack** | App Router, Server Actions, PostgreSQL (Drizzle), Tailwind v4, Playwright |
| `micro-frontend` | **Micro-Frontend Federation** | Vite Module Federation (Shell:5000 + Remote:5001), isolated contracts |
| `distributed-worker` | **Distributed BullMQ Worker** | Fastify event producer, BullMQ async worker, Redis queue, Docker container |
| `standalone-fe` | **Modern Frontend SPA** | React 19, Vite 6, Tailwind CSS v4, TanStack Query, Lucide icons, Sonner toast |
| `standalone-be` | **Clean Modular Backend** | Fastify, ESM, PostgreSQL (Drizzle), Docker Compose, Pino logging, Zod validation |

---

## 🛠️ CLI Options & Flags

```bash
create-forgestack-app [options] [command] [dir]
```

### Architecture & Frameworks
- `[dir]` — Positional project name or directory (`my-app` or `.` for current folder)
- `-t, --template <name>` — Scaffold using a curated preset or saved custom template
- `-y, --yes` — Skip all interactive prompts and use safe defaults
- `--topology <type>` — `monorepo`, `nextjs-fullstack`, `tauri-desktop`, `electron-desktop`, `ai-agent-rag`, `micro-frontend`, `distributed-worker`, `standalone-fe`, `standalone-be`
- `--fe <framework>` — Frontend framework (`react-vite`, `nextjs`, `none`)
- `--styling <type>` — Frontend styling (`tailwind`, `none`)
- `--state <type>` — Frontend state manager (`query`, `redux`, `zustand`, `none`)
- `--be <framework>` — Backend framework (`fastify`, `express`, `hono`, `none`)
- `--db <database>` — Database engine (`postgres`, `mongodb`, `sqlite`, `none`)
- `--orm <orm>` — Database ORM / ODM (`drizzle`, `prisma`, `mongoose`, `none`)
- `--auth <provider>` — Auth system (`better-auth`, `none`)
- `--rpc <protocol>` — RPC contract layer (`trpc`, `none`)
- `--queue <type>` — Background queue (`bullmq`, `none`)

### AI Governance, Tooling & DevOps
- `--linter <type>` — Linter & formatter (`eslint`, `biome`, `none`) (default: `eslint`)
- `--deploy <target>` — Deployment target (`docker`, `vercel`, `cloudflare`, `railway`, `fly`, `none`) (default: `docker`)
- `--testing <framework>` / `--e2e <framework>` — E2E testing framework (`playwright`, `none`)
- `--ci <provider>` — CI/CD pipeline (`github-actions`, `none`)
- `--container / --no-container` — Generate Docker Compose and Dockerfile (default: `true`)
- `--rules / --no-rules` — Include Cursor AI `.cursor/rules` (default: `true`)
- `--skills / --no-skills` — Include AI Agent skills (default: `true`)
- `--init-ai-skills` — Provision ForgeStack AI assistant skills across all detected AI tools
- `--openspec / --no-openspec` — Include OpenSpec workflows (default: `true`)
- `--mcp / --no-mcp` — Include Model Context Protocol server package (default: `true`)
- `--claude / --no-claude` — Include Claude Desktop MCP configuration (default: `true`)

### Directory & Package Manager
- `--force` / `--overwrite` — Overwrite non-empty target directory without prompting
- `--pm <manager>` — Package manager (`pnpm`, `npm`, `yarn`, `bun`) (default: `pnpm`)
- `--git / --no-git` — Initialize git repository (default: `true`)
- `--install / --no-install` — Install dependencies automatically
- `--dry-run` — Preview scaffolded files in memory without modifying disk

---

## 🧠 Provision AI Skills (`init-skills`)

Provision ForgeStack's AI assistant rules and skills for **40 AI coding tools** (Claude Code, Cursor, Antigravity, Codex, Windsurf, Copilot, etc.) into any existing repository:

```bash
# Interactive searchable picker
npx -p @forgestk/cli forgestack init-skills

# Provision for specific tools
npx -p @forgestk/cli forgestack init-skills -t claude,cursor,antigravity

# Provision all 40 supported AI tools non-interactively
npx -p @forgestk/cli forgestack init-skills --all
```

---

## 📂 Reusable Custom Templates

Save any customized stack configuration locally and reuse it across projects:

```bash
# Save during scaffolding
npx -p @forgestk/cli create-forgestack-app my-app --topology monorepo --auth better-auth --save-template my-team-stack

# List saved templates
npx -p @forgestk/cli create-forgestack-app template list

# Delete a saved template
npx -p @forgestk/cli create-forgestack-app template delete my-team-stack
```

---

## 📄 License

MIT © [ForgeStack Contributors](https://github.com/umesh-saini/forgestack/blob/main/LICENSE)
