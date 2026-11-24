# Changelog

All notable changes to ForgeStack are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Standalone project website (`packages/website`) with features, supported stack, CLI examples, AI tool setup and this changelog.
- Combination test matrix: every one of ~636,000 interacting option combinations is generated and checked statically (`pnpm test:matrix`).
- Runtime matrix: a pairwise set of ~100 projects is installed, built, linted, unit-tested, migrated against real Postgres/MongoDB/Redis, started, and probed over HTTP, including Better-Auth sign-up and sign-in (`pnpm matrix:runtime`).
- `pnpm verify:templates`: every curated template is scaffolded, installed, built and typechecked in CI.
- Every generated workspace package gets a `typecheck` script; ESLint 9 flat config is generated wherever a package lints.

### Fixed
- The default `--yes` project and 4 other curated templates failed to build.
- Better-Auth and tRPC were generated but never mounted on the server; `ai-agent-rag` wrote them to a dead root `src/`.
- Every React app rendered `/* FORGESTACK_PROVIDER_SLOT */` as visible text, and its Query/Toast providers wrapped nothing.
- npm, yarn and bun monorepos could not install (pnpm-only `packageManager`, no `workspaces`, `workspace:*` under npm).
- SQLite and Prisma projects broke under pnpm 10 (native build scripts blocked); Prisma client is now generated on install.
- Drizzle migrations silently did nothing; the RAG embeddings table and pgvector extension are now migrated.
- `lint` failed on freshly generated projects (ESLint missing, Biome 2.x config on Biome 1.x, a11y issues).
- Tabler icons, Tauri, Electron and micro-frontend projects failed to typecheck or build.
- `docker-compose.yml` referenced `mongo:7-alpine`, which does not exist.
- `--no-install` was ignored with `--yes`; a failed install still reported success (now exits 1).

### Removed
- The showcase landing page inside the desktop app (replaced by the standalone website). Desktop main bundle: 2.1 MB → 0.9 MB.

## [1.0.0] - 2026-11-18

### Added
- Headless scaffolding engine (`@forgestack/core`) with in-memory virtual file system, additive feature slices and transactional flush.
- `create-forgestack-app` CLI with interactive wizard, `--yes` defaults, curated templates and saved custom templates.
- Tauri v2 desktop studio with live file-tree preview, topology visualizer and auto-updater.
- 9 topologies, React/Next.js frontends, Fastify/Express/Hono backends, PostgreSQL/MongoDB/SQLite with Drizzle/Prisma/Mongoose.
- Better-Auth, tRPC v11, BullMQ, Playwright, GitHub Actions, Biome, and deployment descriptors for Docker, Vercel, Cloudflare, Railway and Fly.
- AI governance: Cursor rules, OpenSpec workflows, agent skills, a project MCP server, and `forgestack init-skills` for 40 AI coding tools.
- `forgestack-mcp`: a local, zero-OAuth MCP server that lets AI assistants list presets, validate configs, preview and scaffold projects.
