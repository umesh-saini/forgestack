## Context

See `proposal.md` for motivation. The project scaffolding platform (ForgeStack) must support both command-line (`npm` / `npx`) and native desktop user interfaces to generate enterprise-grade TypeScript web applications. The design must accommodate fullstack monorepos, standalone frontends, standalone backends, varying state management libraries, multiple relational and document databases, and AI governance frameworks without incurring combinatorial template rot.

## Goals / Non-Goals

**Goals:**
- Provide a headless, deterministic generator core (`@forgestack/core`) decoupled from UI logic.
- Deliver an interactive terminal UI (`@forgestack/cli`) powered by `@clack/prompts` and a native cross-platform desktop UI (`@forgestack/desktop`) using Tauri v2.
- Implement an in-memory Virtual File System (VFS) to stage file structures, configuration merges, and AST transformations before touching disk.
- Guarantee two-phase commit atomicity with automated rollback to prevent dirty or corrupted project directories on failure.
- Deliver a lockstep dependency registry ensuring zero peer dependency conflicts across all permutations.
- Scaffold battle-tested monorepo architecture using pnpm workspaces and Turborepo with shared type contracts (`@repo/contracts`) and shared UI (`@repo/ui`).
- Provide resilient production database connection singletons (PostgreSQL via Drizzle/Prisma and MongoDB via Mongoose) with connection pooling, startup connectivity checks (`SELECT 1`), exponential retry loops, and graceful shutdown handlers (`SIGINT`/`SIGTERM`).
- Embed first-class AI Agent governance files (`.agents/`, `.cursor/rules/`, `openspec/`, `.github/copilot-instructions.md`) with strictly enforced architectural boundaries.

**Non-Goals:**
- In-browser code editing or runtime execution (this is a native project generator, not an online IDE like StackBlitz).
- Cloud infrastructure provisioning or direct cloud deployment (does not replace Terraform or Pulumi; generates local `docker-compose.yml` only).
- Creating a proprietary package manager (orchestrates existing package managers: `pnpm`, `npm`, `yarn`, `bun`).

## Decisions

### 1. Headless Core Architecture (`@forgestack/core`)
- **Choice:** Decouple all template logic, VFS staging, dependency resolution, and file generation into a standalone TypeScript package.
- **Rationale:** Allows `@forgestack/cli` and `@forgestack/desktop` to act as thin presentation wrappers over the same business logic, guaranteeing identical output across both interfaces. Enables 100% unit test coverage of generation recipes in fast headless runners without UI mocking.
- **Alternatives Considered:** Embedding generator code inside the CLI package and rewriting generation in Rust for Tauri (rejected: severe code duplication and maintenance burden).

### 2. Composable Layered Recipe Model over Static Template Branches
- **Choice:** Assemble projects dynamically from modular, additive slices (Kernel → Framework → State → Database/ORM → Utilities → AI Rules) using in-memory VFS manipulation.
- **Rationale:** Avoids the combinatorial explosion of maintaining 200+ static git branches or directories. A change to Tailwind v4 or React 19 only requires updating a single slice.
- **Alternatives Considered:** Maintaining static repositories for every permutation (rejected: templates decay and rot within months).

### 3. Tauri v2 over Electron for Desktop Application
- **Choice:** Tauri v2 (Rust backend + React/Vite/Tailwind frontend).
- **Rationale:** Tauri produces binaries under 15 MB and uses ~35 MB of RAM at idle, compared to Electron's 150+ MB bundle and 300+ MB RAM usage. Tauri's native Rust plugins provide safe, high-speed OS directory picking and file I/O without Node.js security vulnerabilities.
- **Alternatives Considered:** Electron (rejected: excessive bloat for a wizard tool), Native platform UI like Swift/WPF (rejected: non-cross-platform and separate codebases).

### 4. pnpm Workspaces + Turborepo for Monorepos
- **Choice:** Standardize monorepo output on `pnpm` workspaces orchestrated by Turborepo.
- **Rationale:** `npm` workspaces suffer from flat-hoisting bugs that introduce phantom dependencies and break TypeScript monorepo path mapping. `pnpm` enforces strict content-addressable symlinks, and Turborepo provides intelligent pipeline caching (`build`, `lint`, `test`, `typecheck`).
- **Alternatives Considered:** `npm` workspaces (rejected: phantom dependency leaks), Nx (rejected: excessive proprietary abstraction for standard TypeScript workspaces).

### 5. Central Lockstep Dependency Registry
- **Choice:** Maintain a centralized dictionary of pinned, verified dependency versions (`DEPENDENCY_REGISTRY`) within the core engine.
- **Rationale:** Querying live npm registries during scaffolding causes slow network latency, unpredictable breaking changes from downstream semver bumps, and non-reproducible builds.
- **Alternatives Considered:** Resolving `latest` tag from npm registry dynamically at scaffold time (rejected: breaks builds when libraries publish breaking minor or patch changes).

### 6. Two-Phase Commit Transactional Scaffolding
- **Choice:** Staging in VFS → Target directory pre-flight check → Atomic disk flush → Execution of `git init` and package install → Automatic directory cleanup on failure.
- **Rationale:** Prevents leaving the developer's filesystem in a half-written, corrupt state if an installation aborts or a permission fails.
- **Alternatives Considered:** Writing files directly to disk sequentially as prompts complete (rejected: leaves dirty directories on error).

## Risks / Trade-offs

- **[Risk: Desktop Binary Compilation Overhead]** → *Mitigation:* End-users download pre-compiled native release assets (.dmg, .exe, .AppImage) generated via GitHub Actions; end-users never require Rust or build tools installed on their machines.
- **[Risk: Dependency Rot Over Time]** → *Mitigation:* Implement daily automated CI matrix workflows that run headless generation across all permutations, install dependencies, and run `turbo run build typecheck test` to instantly flag upstream regressions.
- **[Risk: Splicing Syntax Errors into User Files]** → *Mitigation:* Use AST manipulation (`ts-morph`) for complex TypeScript code insertions and deterministic JSON deep-merging for `package.json` and `tsconfig.json`.
