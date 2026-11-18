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

## Phase 3: CI/CD & Release Pipeline Alignment

- [ ] 3.1 Fix CI Branch Triggers:
  - [ ] Update `.github/workflows/ci.yml` to trigger on `[main, master]`.
- [ ] 3.2 Add Automated Release Pipeline:
  - [ ] Create `.github/workflows/publish.yml` for automated npm publishing on git tag push (`v*`).

## Phase 4: Verification & Matrix Testing

- [ ] 4.1 Run full monorepo build: `pnpm build`.
- [ ] 4.2 Run monorepo typecheck: `pnpm typecheck`.
- [ ] 4.3 Run full test suite: `pnpm test`.
- [ ] 4.4 Validate OpenSpec change proposal: `npx openspec validate 2026-11-18-production-hardening-and-ecosystem-parity`.
