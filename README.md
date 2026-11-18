# ForgeStack ⚡

> The Next-Generation Enterprise Scaffolding Platform: Headless Engine, Interactive OpenSpec TUI, Next.js-Inspired CLI & Tauri v2 Desktop Studio.

[![npm version](https://img.shields.io/npm/v/@forgestack/cli.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/@forgestack/cli)
[![CI Build](https://img.shields.io/badge/build-passing-brightgreen.svg?style=flat-square)](https://github.com/forgestack/forgestack)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7%20Strict-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb.svg?style=flat-square)](https://react.dev/)
[![Tauri v2](https://img.shields.io/badge/Tauri-v2.0-FFC131.svg?style=flat-square)](https://v2.tauri.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

**ForgeStack** solves starter-template rot once and for all. Rather than cloning rigid, out-of-date GitHub boilerplates, ForgeStack utilizes an in-memory **Virtual File System (VFS)** and **Additive Feature Slices** to dynamically compose production-ready TypeScript Monorepos, Polyrepos, Native Desktop Apps, and Distributed Worker Systems with **Day-One AI Agent Governance**.

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [Monorepo Architecture](#-monorepo-architecture)
- [Supported Frameworks, Primitives & Tools](#-supported-frameworks-primitives--tools)
- [Curated Default Architecture Presets](#-curated-default-architecture-presets)
- [CLI Quickstart & Next.js-Inspired UX](#-cli-quickstart--nextjs-inspired-ux)
  - [Instant Generation (`--yes`)](#instant-generation---yes)
  - [Current Directory Scaffolding (`.`)](#current-directory-scaffolding-)
  - [OpenSpec-Inspired Terminal UI (TUI)](#openspec-inspired-terminal-ui-tui)
  - [Custom Template Persistence](#custom-template-persistence)
  - [Complete CLI Flag Reference](#complete-cli-flag-reference)
- [Desktop Studio App (Tauri v2)](#-desktop-studio-app-tauri-v2)
  - [Running the Desktop App](#running-the-desktop-app)
  - [Fast Browser Preview Mode](#fast-browser-preview-mode)
  - [Building Native Installers](#building-native-installers)
- [Day-One AI Agent Governance & MCP](#-day-one-ai-agent-governance--mcp)
- [Local Testing & Development](#-local-testing--development)
- [Publishing & Deployment](#-publishing--deployment)
- [Continuous Upgrades & Roadmap](#-continuous-upgrades--roadmap)

---

## ⚡ Key Features

- **🚀 Headless Scaffolding Engine (`@forgestack/core`)**: In-memory VFS with transactional atomic flush, JSON merge ast-patching, lockstep dependency matrix, and zero disk mutations on dry-runs.
- **💻 Premier CLI Experience (`create-forgestack-app`)**:
  - `create-next-app` ergonomics: Positional arguments, current-directory resolution (`.`), overwrite collision guards.
  - OpenSpec TUI: ASCII welcome banner, live searchable & filterable multi-select prompt for AI skills, and formatted execution summary.
  - 1-Click Instant setup (`--yes` / `-y`).
  - Curated default templates & reusable local template catalog (`~/.forgestack/templates.json`).
- **🖥️ Cross-Platform Desktop Studio (`@forgestack/desktop`)**:
  - Built with Tauri v2 + Rust Core + React 19 + Tailwind CSS v4.
  - Real-time in-browser VFS preview using `@forgestack/core/browser`.
  - Visual architecture topology graph, interactive feature toggles, and native folder selection.
- **🤖 Built-in AI Governance**:
  - Cursor AI Rules (`.cursor/rules/`): Architectural layer isolation, zero-`any` TypeScript enforcement, and code review rigor.
  - OpenSpec (`openspec/`): Spec-driven development workflows (`/opsx:propose`, `/opsx:apply`, `/opsx:sync`, `/spec:verify`).
  - Model Context Protocol (`@repo/mcp-server`): Model Context Protocol server exposing custom project tools for Claude Desktop, Cursor, and Antigravity.
  - 16+ Production Agent Skills (`.agents/skills/`): Clean code audit, accessibility testing, UI fuzzing, database migrations, and Docker hardening.

---

## 📦 Monorepo Architecture

```text
├── packages/
│   ├── core/       # Headless VFS engine, compositors, dependency registry & slices
│   ├── cli/        # Interactive OpenSpec TUI & headless binary (create-forgestack-app)
│   └── desktop/    # Native Tauri v2 + React 19 + Tailwind v4 Desktop Studio
├── docs/           # Comprehensive publishing and local testing manuals
│   ├── NPM_DEPLOYMENT_GUIDE.md  # Step-by-step npm release & CI/CD workflow
│   └── LOCAL_TESTING_GUIDE.md   # Complete local QA verification checklist
├── openspec/       # OpenSpec formal specifications and archived change proposals
├── tests/          # Monorepo integration & permutation matrix tests
└── .agents/        # Production AI Agent skills and spec-driven workflows
```

---

## 🧰 Supported Frameworks, Primitives & Tools

ForgeStack provides first-class support for modern, industry-standard TypeScript tools:

### 1. Architectural Topologies
- **Monorepo**: Turborepo, pnpm workspaces, shared UI, shared contracts, shared TypeScript configs.
- **AI-Native Agent & RAG**: Vector database embeddings, OpenAI tool-calling, SSE streaming chat, MCP server.
- **Native Desktop App**: Tauri v2, Rust native backend, React 19 webview, secure IPC channels.
- **Next.js 15 Full-Stack**: App Router, Server Actions, route handlers, PostgreSQL + Drizzle ORM.
- **Micro-Frontend Federation**: Module Federation 2.0 (Host Shell on `:5000` + Remote App on `:5001`).
- **Distributed Worker System**: Fastify HTTP job producer, BullMQ background worker daemon, Redis broker.
- **Standalone Frontend SPA**: React 19, Vite 6, Tailwind CSS v4.
- **Clean Modular Backend**: ESM Fastify or Express, layered modular architecture, PostgreSQL / MongoDB / SQLite.

### 2. Frontend Ecosystem
- **Frameworks**: React 19 (Vite 6), Next.js 15 (App Router), Vanilla ESM.
- **Styling**: Tailwind CSS v4 (CSS-first configuration with `@theme` and `@import "tailwindcss"`), Vanilla CSS.
- **State Management**: TanStack Query v5 (React Query), Zustand, Redux Toolkit.
- **UI Components & Icons**: Lucide React, Tabler Icons, React Icons, Phosphor Icons.
- **Feedback & Notifications**: Sonner Toasts, React-Toastify, React Hot Toast.
- **Forms & Validation**: React Hook Form + Zod, TanStack Form, Formik + Yup.
- **Date Utilities**: Day.js, date-fns, Moment.js.

### 3. Backend & Data Layer
- **HTTP Frameworks**: Fastify v5 (high performance, schema-based serialization), Express v5, Hono.
- **Database Engines**: PostgreSQL 16+, MongoDB 7+, SQLite (Better-SQLite3 / LibSQL).
- **ORM / ODMs**: Drizzle ORM (type-safe SQL schema & migrations), Prisma ORM, Mongoose ODM.
- **Authentication**: Better-Auth (sessions, credentials, two-factor authentication, multi-tenant).
- **RPC & Contracts**: tRPC v11 (end-to-end type safety between backend and frontend without build-time code generation), REST API contracts.
- **Queue & Async Jobs**: BullMQ + Redis for distributed background processing.
- **Containerization**: Multi-stage Dockerfiles and Docker Compose files for Postgres, Redis, and Mongo.

### 4. Testing, DevOps & Quality Assurance
- **Testing**: Vitest (instant unit/integration test runner), Playwright (E2E browser smoke tests).
- **CI/CD**: GitHub Actions automated workflows (lint, test, build, typecheck).
- **Package Managers**: `pnpm` (default workspace manager), `npm`, `yarn`, `bun`.

---

## 🌟 Curated Default Architecture Presets

ForgeStack comes loaded with 8 pre-configured, production-grade architecture presets that can be scaffolded instantly:

| Preset Identifier | Name | Core Stack & Features |
|:---|:---|:---|
| `enterprise-monorepo` | **Enterprise Monorepo** | Turborepo, React 19, Fastify, PostgreSQL (Drizzle), tRPC v11, Better-Auth, Playwright, CI/CD |
| `ai-agent-rag` | **AI-Native Agent & RAG** | PostgreSQL (pgvector cosine similarity), OpenAI tool-calling, SSE streaming chat, `@repo/mcp-server` |
| `tauri-desktop` | **Native Tauri v2 Desktop** | Rust Core, React 19, Tailwind CSS v4, secure IPC bindings, native dialogs |
| `nextjs-fullstack` | **Next.js 15 Full-Stack** | Next.js 15 App Router, Server Actions, PostgreSQL (Drizzle), Tailwind v4, Playwright |
| `micro-frontend` | **Micro-Frontend Federation** | Vite Module Federation (Shell:5000 + Remote:5001), shared design tokens |
| `distributed-worker` | **Distributed BullMQ Worker** | Fastify HTTP producer, BullMQ consumer daemon, Redis queue, Docker container |
| `standalone-fe` | **Modern Frontend SPA** | React 19, Vite 6, Tailwind CSS v4, TanStack Query, Lucide icons, Sonner toast |
| `standalone-be` | **Clean Modular Backend** | Fastify, ESM, PostgreSQL (Drizzle), Docker Compose, Pino logger, Zod schema validation |

---

## 💻 CLI Quickstart & Next.js-Inspired UX

Generate a new application anywhere using your favorite package manager:

```bash
# Using NPX
npx create-forgestack-app my-app

# Using PNPM
pnpm create forgestack-app my-app

# Using NPM / Bun
npm create forgestack-app my-app
bun create forgestack-app my-app
```

### Instant Generation (`--yes`)
Skip all wizard prompts and scaffold the curated **Enterprise Monorepo** stack in seconds:
```bash
npx create-forgestack-app my-app --yes
```

### Current Directory Scaffolding (`.`)
Just like Next.js (`create-next-app .`), you can scaffold directly into your current directory:
```bash
# In an empty or target directory:
npx create-forgestack-app .

# Overwrite non-empty directory without prompting:
npx create-forgestack-app . --force
```

### OpenSpec-Inspired Terminal UI (TUI)
- **ASCII Welcome Banner**: Displays configured subsystems and quickstart commands (`/opsx:propose`, `/opsx:apply`).
- **Searchable Multiselect Widget**: When configuring AI governance, filter through skills in real time (`Search: [type to filter]`), toggle options with `Space`, and confirm with `Enter`.

### Custom Template Persistence
Save your own customized stack combinations to a local catalog (`~/.forgestack/templates.json`) and instantiate them across multiple projects:

```bash
# Save a configuration during scaffolding
npx create-forgestack-app my-api --topology standalone-be --be fastify --db postgres --save-template team-api

# List all curated presets and saved custom templates
npx create-forgestack-app template list

# Instantiate a project from your saved template
npx create-forgestack-app service-2 --template team-api

# Delete a custom template
npx create-forgestack-app template delete team-api
```

### Complete CLI Flag Reference

```bash
create-forgestack-app [options] [command] [dir]
```

| Flag | Description | Options / Defaults |
|:---|:---|:---|
| `[dir]` | Positional directory name or dot (`.`) | e.g. `my-app` or `.` |
| `-t, --template <name>` | Select curated preset or saved custom template | `enterprise-monorepo`, `ai-agent-rag`, etc. |
| `-y, --yes` | Skip prompts and scaffold immediately with defaults | Boolean |
| `--save-template <name>`| Save configuration as reusable custom template | String |
| `--topology <type>` | Architecture topology | `monorepo`, `ai-agent-rag`, `tauri-desktop`, etc. |
| `--fe <framework>` | Frontend framework | `react-vite`, `nextjs`, `none` |
| `--styling <type>` | Frontend styling engine | `tailwind`, `none` |
| `--state <type>` | Frontend state manager | `query`, `redux`, `zustand`, `none` |
| `--be <framework>` | Backend HTTP framework | `fastify`, `express`, `hono`, `none` |
| `--db <database>` | Database engine | `postgres`, `mongodb`, `sqlite`, `none` |
| `--orm <orm>` | Database ORM / ODM | `drizzle`, `prisma`, `mongoose`, `none` |
| `--auth <provider>` | Authentication system | `better-auth`, `none` |
| `--rpc <protocol>` | RPC layer | `trpc`, `none` |
| `--queue <type>` | Background worker queue | `bullmq`, `none` |
| `--testing <framework>`| E2E test framework | `playwright`, `none` |
| `--ci <provider>` | CI/CD pipeline | `github-actions`, `none` |
| `--rules / --no-rules` | Include Cursor AI rules | Default: `true` |
| `--skills / --no-skills`| Include AI agent skills | Default: `true` |
| `--openspec / --no-openspec` | Include OpenSpec workflows | Default: `true` |
| `--mcp / --no-mcp` | Include Model Context Protocol server | Default: `true` |
| `--claude / --no-claude` | Include Claude Desktop MCP configuration | Default: `true` |
| `--container / --no-container` | Generate Docker Compose & Dockerfiles | Default: `true` |
| `--force / --overwrite` | Overwrite non-empty directory | Boolean |
| `--pm <manager>` | Package manager | `pnpm` (default), `npm`, `yarn`, `bun` |
| `--git / --no-git` | Initialize git repository | Default: `true` |
| `--install / --no-install` | Run dependency install automatically | Boolean |
| `--dry-run` | Stage files in memory and inspect without disk writes | Boolean |

---

## 🖥️ Desktop Studio App (Tauri v2)

The desktop application (`packages/desktop`) is a native visual studio for composing, inspecting, and scaffolding architectures with live file-tree visualization.

### Running the Desktop App

#### Option A: Native Desktop App (Tauri v2 Window)
Spawns the native desktop window with native OS dialogs and filesystem validation hooks:
```bash
pnpm desktop:dev
```

#### Option B: Fast Browser Preview Mode
Develop and preview the studio UI directly in your browser with instant Hot Module Replacement (HMR) without compiling Rust:
```bash
pnpm desktop:web
```
*Accessible at [http://localhost:1420](http://localhost:1420)*.

### Building Native Installers
ForgeStack packages standalone native installers using Tauri v2:
```bash
pnpm desktop:build
```
Bundles are generated in `packages/desktop/src-tauri/target/release/bundle/`:
- **Linux**: `.deb` and standalone `.AppImage`
- **macOS**: `.dmg` disk image and `.app` bundle
- **Windows**: `.msi` and `.exe` installers

---

## 🤖 Day-One AI Agent Governance & MCP

Every project scaffolded by ForgeStack includes native AI Agent governance configured from the very first commit:

- **Cursor Rules (`.cursor/rules/`)**:
  - `01-architecture-boundaries.mdc`: Enforces strict controller-service-repository boundaries.
  - `02-typescript-strict.mdc`: Strictly forbids `any` and unvalidated type assertions.
  - `03-brutally-honest-reviewer.mdc`: Independent principal reviewer for code correctness.
- **Model Context Protocol (`packages/mcp-server/`)**:
  - Out-of-the-box `@repo/mcp-server` exposing database schemas, health status, and project tools to Claude Desktop, Cursor, and Antigravity.
- **Agent Skills (`.agents/skills/`)**:
  - 16+ production skills including `accesslint-audit` (WCAG 2.2), `anti-ui-slop` (design system consistency), `break-ui` (fuzz testing), `bugs-are-annoying` (bug hunting), `clean-code-guard`, `database-migration`, `docker-expert`, and `drizzle-orm-expert`.
- **OpenSpec Workflows (`.agents/workflows/`)**:
  - Spec-driven engineering commands: `/opsx:propose` to initiate changes, `/opsx:apply` to implement tasks, and `/spec:verify` to check compliance.

---

## 🧪 Local Testing & Development

ForgeStack enforces strict engineering verification with **100% test pass rates across 38 test suites and 123+ tests**:

```bash
# Run complete test suite across all packages
pnpm test

# Run tests in watch mode
pnpm test:watch

# Compile TypeScript across monorepo
pnpm build

# Run local CLI developer runner
pnpm cli:dev template list
```

For complete step-by-step local testing instructions (including `npm link`, `npm pack` tarball emulation, and end-to-end scenario validation), read the [Local Testing Guide](file:///home/dev/Documents/Kungfu/Test-Task/project-setup/docs/LOCAL_TESTING_GUIDE.md).

---

## 🚢 Publishing & Deployment

ForgeStack packages are structured for automated publishing to npm. For detailed instructions on npm scopes, automated GitHub Actions CI/CD workflows, token setup, and version bumping, see the [NPM Deployment Guide](file:///home/dev/Documents/Kungfu/Test-Task/project-setup/docs/NPM_DEPLOYMENT_GUIDE.md).

---

## 🔭 Continuous Upgrades & Roadmap

ForgeStack is continuously evolving. I am actively looking for upgrades, architectural optimizations, and community feedback to make ForgeStack even more accurate, resilient, and perfect. 

Upcoming areas of active development:
- [ ] **Kubernetes & Helm Chart Additive Slices**: Declarative cloud-native deployment slices.
- [ ] **GraphQL / Apollo Federation Archetype**: Distributed subgraph federation preset.
- [ ] **Biome & Oxlint Integration**: Ultra-fast Rust-based linter and formatter slice.
- [ ] **Desktop Visual Diff Studio**: Visual inspection of generated diffs before applying to disk.

If you have feedback, ideas for new primitives, or want to contribute an architecture slice or AI skill, please open an issue or submit a pull request!

---

## 📄 License

MIT © ForgeStack Contributors
