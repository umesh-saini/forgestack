# Monorepo Production Hardening and Ecosystem Parity

## Why
A comprehensive codebase audit revealed critical operational defects in developer tooling, security, and ecosystem parity: (1) root `pnpm run typecheck` fails with 1,459 JSX errors due to root-level NodeNext module resolution crossing into React TSX packages; (2) `pnpm lint` crashes due to missing ESLint dependencies; (3) CI triggers on `main` instead of active branch `master`; (4) Tauri desktop runs with `csp: null`, presenting a script injection vulnerability; (5) desktop wizard lacks `nextjs-fullstack` and `electron-desktop` topologies; and (6) no root `turbo.json`, `vitest.config.ts`, `.gitattributes`, or `.npmrc` exist. Additionally, developers need modern alternative tooling (Biome.js alongside ESLint) and multi-cloud deployment descriptors (Vercel, Cloudflare, Railway, Fly.io) so teams can scaffold their preferred toolchains without friction.

## What Changes
- Fix root `typecheck` script to check all workspaces without JSX compiler mismatches.
- Add root `turbo.json` and Turborepo pipeline orchestration for build, test, and typecheck caching.
- Configure root `vitest.config.ts` excluding `dist/` and clean duplicate in-source compiled test artifacts.
- Configure ESLint + Prettier to restore working `pnpm lint`.
- Add `.npmrc` with strict pnpm settings and `.gitattributes` to enforce LF line endings.
- Harden Desktop Studio security by configuring strict Tauri Content Security Policy (CSP).
- Add `nextjs-fullstack` and `electron-desktop` visual cards to `packages/desktop/src/components/wizard/TopologySelector.tsx`.
- Add Biome.js alternative linter and formatter slice (`biome.json`, `--linter biome`).
- Add multi-cloud deployment descriptors slice (`vercel.json`, `wrangler.jsonc`, `fly.toml`, `railway.json`, `--deploy <target>`).
- Align `.github/workflows/ci.yml` trigger branches to `[main, master]` and add release workflow.

## Capabilities
- Monorepo tooling (`typecheck`, `lint`, `test`, `build`) runs with 100% success and Turborepo cache acceleration.
- Tauri desktop application is protected against unauthorized script execution and remote code injection.
- Desktop Studio achieves 100% topology parity with `@forgestack/core` and the CLI.
- Developers can choose between ESLint and ultra-fast Biome.js for linting and formatting.
- Scaffolded applications include 1-click cloud deployment configurations for Vercel, Cloudflare, Railway, Fly.io, or Docker.
- Cross-platform contributors on Windows/Linux/macOS will not corrupt executable shebangs.

## Impact
- **Packages**: `forgestack-workspace` (root), `packages/core`, `packages/cli`, `packages/desktop`.
- **CI/CD**: Restores automated testing on pushes to `master`.
- **Zero Breaking Changes**: Fully backwards compatible with existing CLI options and template presets.
