# create-forgestack-app

> Production-grade scaffolding platform for scalable TypeScript monorepos, standalone polyrepos, native desktop apps, and distributed microservices with built-in AI Agent governance.

[![npm version](https://img.shields.io/npm/v/@forgestk/cli.svg?style=flat-square)](https://www.npmjs.com/package/@forgestk/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

---

## ⚡ Quick Start

You can generate a new project instantly using your favorite package manager:

### Using NPX
```bash
npx create-forgestack-app my-app
```

### Using PNPM
```bash
pnpm create forgestack-app my-app
```

### Using NPM / Yarn / Bun
```bash
npm create forgestack-app my-app
# or
yarn create forgestack-app my-app
# or
bun create forgestack-app my-app
```

### Instant 1-Click Setup (`--yes` / `-y`)
Skip all questions and generate the battle-tested **Enterprise Monorepo** preset immediately:
```bash
npx create-forgestack-app my-app --yes
```

### Scaffold Directly Into Current Directory (`.`)
Just like `create-next-app`, you can scaffold inside your current directory by passing `.`:
```bash
npx create-forgestack-app .
# with non-empty directory overwrite flag:
npx create-forgestack-app . --force
```

---

## 🌟 Curated Architecture Presets

ForgeStack comes with 8 battle-tested architecture presets that can be scaffolded instantly via `--template <id>`:

```bash
npx create-forgestack-app my-app --template <id>
```

| Template ID | Preset Name | Stack Highlights |
|:---|:---|:---|
| `enterprise-monorepo` | **Enterprise Monorepo** | Turborepo, React 19, Fastify, PostgreSQL (Drizzle), tRPC v11, Better-Auth, Playwright, CI/CD |
| `ai-agent-rag` | **AI-Native Agent & RAG** | pgvector cosine search, OpenAI tool-calling, SSE streaming chat, `@repo/mcp-server` |
| `tauri-desktop` | **Native Tauri v2 Desktop** | Rust Core, React 19, Tailwind CSS v4, secure IPC bindings |
| `nextjs-fullstack` | **Next.js 15 Full-Stack** | App Router, Server Actions, PostgreSQL (Drizzle), Tailwind v4, Playwright |
| `micro-frontend` | **Micro-Frontend Federation**| Vite Module Federation (Shell:5000 + Remote:5001), isolated contracts |
| `distributed-worker` | **Distributed BullMQ Worker** | Fastify event producer, BullMQ async worker, Redis queue, Docker container |
| `standalone-fe` | **Modern Frontend SPA** | React 19, Vite 6, Tailwind CSS v4, TanStack Query, Lucide icons, Sonner toast |
| `standalone-be` | **Clean Modular Backend** | Fastify, ESM, PostgreSQL (Drizzle), Docker Compose, Pino logging, Zod validation |

---

## 🛠️ CLI Options & Flags

ForgeStack supports 100% headless execution via command-line flags for CI/CD and automated developer environments.

```bash
create-forgestack-app [options] [command] [dir]
```

### Architecture & Frameworks
- `[dir]` - Positional project name or directory (`my-app` or `.` for current folder)
- `-t, --template <name>` - Scaffold using a curated preset or saved custom template
- `-y, --yes` - Skip all interactive prompts and use safe defaults
- `--topology <type>` - `monorepo`, `nextjs-fullstack`, `tauri-desktop`, `electron-desktop`, `ai-agent-rag`, `micro-frontend`, `distributed-worker`, `standalone-fe`, `standalone-be`
- `--fe <framework>` - Frontend framework (`react-vite`, `nextjs`, `none`)
- `--styling <type>` - Frontend styling (`tailwind`, `none`)
- `--state <type>` - Frontend state manager (`query`, `redux`, `zustand`, `none`)
- `--be <framework>` - Backend framework (`fastify`, `express`, `hono`, `none`)
- `--db <database>` - Database engine (`postgres`, `mongodb`, `sqlite`, `none`)
- `--orm <orm>` - Database ORM (`drizzle`, `prisma`, `mongoose`, `none`)
- `--auth <provider>` - Auth system (`better-auth`, `none`)
- `--rpc <protocol>` - RPC contract layer (`trpc`, `none`)
- `--queue <type>` - Queue driver (`bullmq`, `none`)

### AI Governance & DevOps
- `--rules / --no-rules` - Include Cursor AI `.cursor/rules` (default: true)
- `--skills / --no-skills` - Include 16+ production `.agents/skills` (default: true)
- `--openspec / --no-openspec` - Include OpenSpec change management workflows (default: true)
- `--mcp / --no-mcp` - Include Model Context Protocol server package (default: true)
- `--claude / --no-claude` - Include Claude Desktop MCP configuration (default: true)
- `--container / --no-container` - Generate Docker Compose and Dockerfile (default: true)
- `--testing <framework>` - E2E testing framework (`playwright`, `none`)
- `--ci <provider>` - CI/CD pipeline (`github-actions`, `none`)

### Directory & Package Manager
- `--force / --overwrite` - Overwrite non-empty target directory without prompting
- `--pm <manager>` - Package manager (`pnpm`, `npm`, `yarn`, `bun`) (default: `pnpm`)
- `--git / --no-git` - Initialize git repository (default: true)
- `--install / --no-install` - Install dependencies automatically
- `--dry-run` - Preview scaffolded files in memory without modifying disk

---

## 📂 Reusable Custom Templates

You can save any customized stack configuration to your local catalog and reuse it across multiple projects.

### Save a Template
```bash
# Save during scaffolding
npx create-forgestack-app my-app --topology monorepo --auth better-auth --save-template my-team-stack
```

### List Available Templates
```bash
npx create-forgestack-app template list
```

### Delete a Saved Template
```bash
npx create-forgestack-app template delete my-team-stack
```

---

## 🤖 Built-in AI Agent Governance

Every project scaffolded by ForgeStack includes native AI Agent governance:
- **Cursor Rules (`.cursor/rules/`)**: Enforces architectural boundaries, strict TypeScript standards, and code review rigor.
- **Agent Skills (`.agents/skills/`)**: 16+ production skills including accessibility auditing (`accesslint-audit`), UI validation (`anti-ui-slop`, `break-ui`), bug auditing (`bugs-are-annoying`), and database migration guards (`database-migration`).
- **OpenSpec Workflows (`.agents/workflows/`)**: Spec-driven development workflows (`/opsx:propose`, `/opsx:apply`, `/opsx:sync`, `/spec:verify`).
- **MCP Server (`packages/mcp-server/`)**: Ready-to-run Model Context Protocol server exposing project-specific tools to Claude Desktop, Cursor, and Antigravity.

---

## 📄 License

MIT © ForgeStack Contributors
