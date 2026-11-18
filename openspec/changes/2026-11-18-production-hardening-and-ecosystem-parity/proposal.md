# Monorepo Production Hardening and Ecosystem Parity

## Why
A comprehensive codebase audit revealed critical operational defects in developer tooling, security, and UI parity: (1) root `pnpm run typecheck` fails with 1,459 JSX errors due to root-level NodeNext module resolution crossing into React TSX packages; (2) `pnpm lint` crashes due to missing ESLint dependencies; (3) CI triggers on `main` instead of active branch `master`; (4) Tauri desktop runs with `csp: null`, presenting a dangerous script injection vulnerability; (5) desktop wizard lacks `nextjs-fullstack` and `electron-desktop` topologies; and (6) no root `turbo.json`, `vitest.config.ts`, `.gitattributes`, or `.npmrc` exist. Resolving these issues establishes production-grade reliability across all workspaces.

## What Changes
- Fix root `typecheck` script to check all workspaces without JSX compiler mismatches.
- Add root `turbo.json` and Turborepo pipeline orchestration for build, test, and typecheck caching.
- Configure root `vitest.config.ts` excluding `dist/` and clean duplicate in-source compiled test artifacts.
- Configure ESLint + Prettier to restore working `pnpm lint`.
- Add `.npmrc` with strict pnpm settings and `.gitattributes` to enforce LF line endings.
- Harden Desktop Studio security by configuring strict Tauri Content Security Policy (CSP).
- Add `nextjs-fullstack` and `electron-desktop` visual cards to `packages/desktop/src/components/wizard/TopologySelector.tsx`.
- Align `.github/workflows/ci.yml` trigger branches to `[main, master]` and add release workflow.

## Capabilities
- Monorepo tooling (`typecheck`, `lint`, `test`, `build`) runs with 100% success and Turborepo cache acceleration.
- Tauri desktop application is protected against unauthorized script execution and arbitrary remote code injection.
- Desktop Studio achieves 100% topology parity with `@forgestack/core` and the CLI.
- Cross-platform contributors on Windows/Linux/macOS will not corrupt executable shebangs.

## Impact
- **Packages**: `forgestack-workspace` (root), `packages/desktop`, `packages/cli`, `packages/core`.
- **CI/CD**: Restores automated testing on pushes to `master`.
- **Zero Breaking Changes**: Does not break existing CLI or engine APIs.
