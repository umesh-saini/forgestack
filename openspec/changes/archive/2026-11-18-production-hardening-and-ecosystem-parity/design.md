# Technical Design: Monorepo Production Hardening and Ecosystem Parity

## 1. Root TypeScript Configuration & Workspace Typecheck
### Problem
The root `package.json` specifies `"typecheck": "tsc -b"`. The root `tsconfig.json` has `module: "NodeNext"` and does not specify `"jsx"`. When `tsc -b` runs at root without explicit project references, it attempts to compile the `.tsx` files in `packages/desktop` under NodeNext without JSX support, throwing 1,459 `TS17004: Cannot use JSX unless the '--jsx' flag is provided` errors.
### Solution
Run typecheck across all workspaces independently:
```json
"typecheck": "pnpm --filter \"@forgestack/*\" exec tsc --noEmit"
```
Each workspace compiler configuration (`packages/core/tsconfig.json`, `packages/cli/tsconfig.json`, and `packages/desktop/tsconfig.json`) resolves its own JSX and module resolution correctly.

---

## 2. Turborepo Monorepo Pipeline Orchestration
### Architecture
Add root `turbo.json` with pipeline definitions:
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["build"],
      "cache": false
    },
    "lint": {}
  }
}
```

---

## 3. Tauri Desktop Security Hardening
### Content Security Policy (CSP)
In `packages/desktop/src-tauri/tauri.conf.json`:
Replace `"csp": null` with:
```json
"csp": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:;"
```
This isolates the desktop webview from executing remote third-party scripts while allowing local styles, React inline themes, and secure HTTPS connections.

---

## 4. Desktop Visual Topology Parity
### Architecture
Extend `topologies` in [packages/desktop/src/components/wizard/TopologySelector.tsx](file:///home/dev/Documents/Kungfu/Test-Task/project-setup/packages/desktop/src/components/wizard/TopologySelector.tsx) with:
1. `nextjs-fullstack`:
   - Title: `Next.js 15 Full-Stack`
   - Tagline: `App Router + Server Actions + Drizzle`
   - Badges: `['Next.js 15', 'Tailwind v4', 'Drizzle ORM', 'Server Actions']`
2. `electron-desktop`:
   - Title: `Hardened Electron Studio`
   - Tagline: `electron-vite + React 19 + ContextBridge`
   - Badges: `['Electron', 'React 19', 'ContextBridge', 'Hardened']`

---

## 5. Vitest Configuration & Artifact Cleansing
### Problem
Vitest scans `**/*.test.{js,ts}` by default. Previous builds emitted `.test.js` next to `.test.ts` and in `dist/`, causing duplicate test runs.
### Solution
1. Create root `vitest.config.ts`:
   ```ts
   import { defineConfig } from 'vitest/config';

   export default defineConfig({
     test: {
       exclude: ['**/node_modules/**', '**/dist/**', '**/src-tauri/**'],
       include: ['packages/**/src/**/__tests__/**/*.test.ts', 'tests/**/*.test.ts'],
     },
   });
   ```
2. Remove any accidentally generated `.test.js` files in `src/`.

---

## 6. Monorepo Git & NPM Hygiene
- `.npmrc`: `strict-peer-dependencies=false`, `shamefully-hoist=false`.
- `.gitattributes`: `* text=auto eol=lf`, `packages/cli/bin/* text eol=lf`.
- `.env.example`: Document standard local environment variables.
- CI/CD: Update branch triggers to `[main, master]`.

---

## 7. Biome.js Alternative Linter and Formatter Slice
### Problem
Many modern engineering teams prefer Biome over ESLint + Prettier for sub-millisecond linting, formatting, and zero-dependency maintenance. Currently, scaffolded projects only offer ESLint.
### Architecture
Add `linter` to `projectConfigSchema`:
```ts
linter: z.enum(['eslint', 'biome', 'none']).default('eslint').optional()
```
When `linter === 'biome'`:
- Create `biome.json` at project root with schema, linter recommended rules, and formatter specs (2 spaces, single quotes).
- Add `@biomejs/biome` to devDependencies.
- Update `package.json` scripts:
  - `"lint": "biome check ."`
  - `"format": "biome format --write ."`
  - `"check": "biome check --write ."`
- Expose `--linter <eslint | biome | none>` in CLI and Step 3 of Desktop Studio.

---

## 8. Multi-Cloud Deployment Descriptors Slice
### Problem
Teams frequently deploy generated applications to platforms other than bare Docker containers, such as Vercel, Cloudflare Pages/Workers, Railway, or Fly.io. Scaffolded projects lack turnkey deployment configuration files.
### Architecture
Add `deployment` to `projectConfigSchema`:
```ts
deployment: z.enum(['docker', 'vercel', 'cloudflare', 'railway', 'fly', 'none']).default('docker').optional()
```
Create `packages/core/src/slices/devops/deployment-targets.ts` generating platform-specific descriptors:
1. `vercel`: Emits `vercel.json` with framework presets and headers.
2. `cloudflare`: Emits `wrangler.jsonc` configured for Cloudflare Workers / Pages.
3. `railway`: Emits `railway.json` with build and deploy configurations.
4. `fly`: Emits `fly.toml` with app name, VM sizing, and HTTP service bindings.
Expose `--deploy <target>` flag on CLI and visual selector in Desktop Step 3.
