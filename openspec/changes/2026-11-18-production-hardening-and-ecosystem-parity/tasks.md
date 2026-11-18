# Implementation Tasks: Monorepo Production Hardening and Ecosystem Parity

## Phase 1: Developer Tooling & Monorepo Build Hardening

- [ ] 1.1 Fix Root Workspace Typecheck Script:
  - [ ] Update `"typecheck"` in root `package.json` to `"pnpm --filter \"@forgestack/*\" exec tsc --noEmit"`.
  - [ ] Verify that running `pnpm run typecheck` passes with zero errors across all 3 packages.
- [ ] 1.2 Configure Turborepo Pipeline Orchestration:
  - [ ] Create root `turbo.json` with pipeline stages for `build`, `test`, `typecheck`, and `lint`.
  - [ ] Add `"turbo"` to root `devDependencies`.
- [ ] 1.3 Configure Root Vitest & Test Artifact Cleansing:
  - [ ] Create root `vitest.config.ts` excluding `dist/`, `build/`, and `src-tauri/`.
  - [ ] Remove duplicate in-source compiled `.test.js` files in `packages/core/src` and `packages/cli/src`.
- [ ] 1.4 Establish Monorepo Linting Foundation:
  - [ ] Add ESLint dependencies to root devDependencies.
  - [ ] Create root `eslint.config.js`.
  - [ ] Verify `pnpm lint` runs successfully.
- [ ] 1.5 Monorepo Git & Package Manager Hygiene:
  - [ ] Create `.npmrc` with `strict-peer-dependencies=false` and `shamefully-hoist=false`.
  - [ ] Create `.gitattributes` enforcing `eol=lf` for Unix shell shebangs.
  - [ ] Create `.env.example` documenting environment variables.

## Phase 2: Desktop Studio Security & Topology Parity

- [ ] 2.1 Tauri Security Hardening:
  - [ ] Update `packages/desktop/src-tauri/tauri.conf.json` replacing `"csp": null` with strict Content Security Policy.
- [ ] 2.2 Desktop Topology Parity:
  - [ ] Update `packages/desktop/src/components/wizard/TopologySelector.tsx` to include `nextjs-fullstack` and `electron-desktop`.
  - [ ] Verify Step 1 renders all 10 topology cards cleanly.

## Phase 3: Biome.js Linter & Multi-Cloud Deployment Slices

- [ ] 3.1 Update Project Config Schema:
  - [ ] Add `linter: z.enum(['eslint', 'biome', 'none']).default('eslint').optional()` to `projectConfigSchema` in `packages/core/src/types/config.ts`.
  - [ ] Add `deployment: z.enum(['docker', 'vercel', 'cloudflare', 'railway', 'fly', 'none']).default('docker').optional()` to `projectConfigSchema`.
- [ ] 3.2 Implement Biome Linter Slice:
  - [ ] Pin `@biomejs/biome` in `packages/core/src/registry/dependencies.ts`.
  - [ ] Create `packages/core/src/slices/tooling/biome.ts` generating `biome.json` and configuring package scripts.
  - [ ] Register slice in `packages/core/src/engine/create-pipeline.ts`.
- [ ] 3.3 Implement Multi-Cloud Deployment Targets Slice:
  - [ ] Create `packages/core/src/slices/devops/deployment-targets.ts` generating `vercel.json`, `wrangler.jsonc`, `fly.toml`, and `railway.json`.
  - [ ] Register slice in `packages/core/src/engine/create-pipeline.ts`.
- [ ] 3.4 Wire CLI Flags & Desktop Selectors:
  - [ ] Add `--linter <eslint | biome | none>` to `packages/cli/src/cli.ts`.
  - [ ] Add `--deploy <target>` to `packages/cli/src/cli.ts`.
  - [ ] Add linter toggle (ESLint vs Biome) and deployment target selector to Desktop Step 3.

## Phase 4: CI/CD & Release Pipeline Alignment

- [ ] 4.1 Fix CI Branch Triggers:
  - [ ] Update `.github/workflows/ci.yml` to trigger on `[main, master]`.
- [ ] 4.2 Add Automated Release Pipeline:
  - [ ] Create `.github/workflows/publish.yml` for automated npm publishing on git tag push (`v*`).

## Phase 5: Verification & Matrix Testing

- [ ] 5.1 Unit & Integration Tests:
  - [ ] Add unit test verifying Biome slice generation (`biome.json`, package scripts).
  - [ ] Add unit test verifying Cloud Deployment slices (`vercel.json`, `wrangler.jsonc`, `fly.toml`, `railway.json`).
  - [ ] Add CLI tests for `--linter biome` and `--deploy vercel`.
- [ ] 5.2 Run full monorepo build: `pnpm build`.
- [ ] 5.3 Run monorepo typecheck: `pnpm typecheck`.
- [ ] 5.4 Run full test suite: `pnpm test`.
- [ ] 5.5 Validate OpenSpec change proposal: `npx openspec validate 2026-11-18-production-hardening-and-ecosystem-parity`.
