# Implementation Tasks: Monorepo Production Hardening and Ecosystem Parity

## Phase 1: Developer Tooling & Monorepo Build Hardening

- [x] 1.1 Fix Root Workspace Typecheck Script:
  - [x] Update `"typecheck"` in root `package.json` to `"pnpm --filter \"@forgestack/*\" exec tsc --noEmit"`.
  - [x] Verify that running `pnpm run typecheck` passes with zero errors across all 3 packages.
- [x] 1.2 Configure Turborepo Pipeline Orchestration:
  - [x] Create root `turbo.json` with pipeline stages for `build`, `test`, `typecheck`, and `lint`.
  - [x] Add `"turbo"` to root `devDependencies`.
- [x] 1.3 Configure Root Vitest & Test Artifact Cleansing:
  - [x] Create root `vitest.config.ts` excluding `dist/`, `build/`, and `src-tauri/`.
  - [x] Remove duplicate in-source compiled `.test.js` files in `packages/core/src` and `packages/cli/src`.
- [x] 1.4 Establish Monorepo Linting Foundation:
  - [x] Add ESLint dependencies to root devDependencies.
  - [x] Create root `eslint.config.js`.
  - [x] Verify `pnpm lint` runs successfully.
- [x] 1.5 Monorepo Git & Package Manager Hygiene:
  - [x] Create `.npmrc` with `strict-peer-dependencies=false` and `shamefully-hoist=false`.
  - [x] Create `.gitattributes` enforcing `eol=lf` for Unix shell shebangs.
  - [x] Create `.env.example` documenting environment variables.

## Phase 2: Desktop Studio Security & Topology Parity

- [x] 2.1 Tauri Security Hardening:
  - [x] Update `packages/desktop/src-tauri/tauri.conf.json` replacing `"csp": null` with strict Content Security Policy.
- [x] 2.2 Desktop Topology Parity:
  - [x] Update `packages/desktop/src/components/wizard/TopologySelector.tsx` to include `nextjs-fullstack` and `electron-desktop`.
  - [x] Verify Step 1 renders all 10 topology cards cleanly.

## Phase 3: Biome.js Linter & Multi-Cloud Deployment Slices

- [x] 3.1 Update Project Config Schema:
  - [x] Add `linter: z.enum(['eslint', 'biome', 'none']).default('eslint').optional()` to `projectConfigSchema` in `packages/core/src/types/config.ts`.
  - [x] Add `deployment: z.enum(['docker', 'vercel', 'cloudflare', 'railway', 'fly', 'none']).default('docker').optional()` to `projectConfigSchema`.
- [x] 3.2 Implement Biome Linter Slice:
  - [x] Pin `@biomejs/biome` in `packages/core/src/registry/dependencies.ts`.
  - [x] Create `packages/core/src/slices/tooling/biome.ts` generating `biome.json` and configuring package scripts.
  - [x] Register slice in `packages/core/src/engine/create-pipeline.ts`.
- [x] 3.3 Implement Multi-Cloud Deployment Targets Slice:
  - [x] Create `packages/core/src/slices/devops/deployment-targets.ts` generating `vercel.json`, `wrangler.jsonc`, `fly.toml`, and `railway.json`.
  - [x] Register slice in `packages/core/src/engine/create-pipeline.ts`.
- [x] 3.4 Wire CLI Flags & Desktop Selectors:
  - [x] Add `--linter <eslint | biome | none>` to `packages/cli/src/cli.ts`.
  - [x] Add `--deploy <target>` to `packages/cli/src/cli.ts`.
  - [x] Add linter toggle (ESLint vs Biome) and deployment target selector to Desktop Step 3.

## Phase 4: CI/CD & Release Pipeline Alignment

- [x] 4.1 Fix CI Branch Triggers:
  - [x] Update `.github/workflows/ci.yml` to trigger on `[main, master]`.
- [x] 4.2 Add Automated Release Pipeline:
  - [x] Create `.github/workflows/publish.yml` for automated npm publishing on git tag push (`v*`).

## Phase 5: Verification & Matrix Testing

- [x] 5.1 Unit & Integration Tests:
  - [x] Add unit test verifying Biome slice generation (`biome.json`, package scripts).
  - [x] Add unit test verifying Cloud Deployment slices (`vercel.json`, `wrangler.jsonc`, `fly.toml`, `railway.json`).
  - [x] Add CLI tests for `--linter biome` and `--deploy vercel`.
- [x] 5.2 Run full monorepo build: `pnpm build`.
- [x] 5.3 Run monorepo typecheck: `pnpm typecheck`.
- [x] 5.4 Run full test suite: `pnpm test`.
- [x] 5.5 Validate OpenSpec change proposal: `npx openspec validate 2026-11-18-production-hardening-and-ecosystem-parity`.
