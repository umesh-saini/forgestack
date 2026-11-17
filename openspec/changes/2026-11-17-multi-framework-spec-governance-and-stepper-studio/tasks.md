# Tasks: Multi-Framework Expansion, Multi-Engine AI Governance, and 4-Step Stepper Studio

## Phase 1: Core Configuration Schema & Types (`@forgestack/core`)

- [ ] 1.1 Update `packages/core/src/types/config.ts`:
  - [ ] Add `'nextjs'` to frontend frameworks.
  - [ ] Add `'electron-desktop'` and `'nextjs-fullstack'` to `topology` enum.
  - [ ] Add `dateLib: z.enum(['dayjs', 'date-fns', 'moment', 'none'])` to frontend config.
  - [ ] Add `processManager: z.enum(['docker', 'pm2', 'none'])` to backend config.
  - [ ] Add `utilities: z.object({ frontendHelpers: z.boolean(), backendHelpers: z.boolean() })` to config.
  - [ ] Extend `aiGovernance`: `engine: z.enum(['openspec', 'gsd', 'speckit', 'all'])`.
- [ ] 1.2 Update `packages/core/src/registry/dependencies.ts` with pinned versions for:
  - [ ] `electron`, `electron-vite`, `vite-plugin-electron`
  - [ ] `next`, `react`, `react-dom`
  - [ ] `dayjs`, `date-fns`, `moment`
  - [ ] `axios`, `jsonwebtoken`, `@types/jsonwebtoken`
  - [ ] `pm2`

## Phase 2: Feature Slices Implementation (`@forgestack/core`)

- [ ] 2.1 Implement Electron Desktop Slice (`packages/core/src/slices/desktop/electron-vite.ts`):
  - [ ] Scaffold `electron.vite.config.ts` for main, preload, and renderer.
  - [ ] Scaffold `src/main/index.ts` with `BrowserWindow` creation, `contextIsolation: true`, and IPC handlers.
  - [ ] Scaffold `src/preload/index.ts` with user-specified `electronAPI` (`profile:create`, `log:getAll`) via `contextBridge.exposeInMainWorld`.
  - [ ] Scaffold `src/preload/index.d.ts` declaring global `Window.electronAPI`.
  - [ ] Scaffold `src/renderer/` containing React 19 + Tailwind CSS v4 consuming `window.electronAPI`.
- [ ] 2.2 Implement Next.js 15 Full-Stack Slice (`packages/core/src/slices/frontend/nextjs.ts`):
  - [ ] Scaffold `next.config.ts`, `app/layout.tsx`, `app/page.tsx`, and `app/globals.css`.
  - [ ] Scaffold `app/api/health/route.ts` demonstrating standard Next.js route handlers.
- [ ] 2.3 Implement Multi-Engine AI Governance Slices:
  - [ ] Implement Open-GSD Slice (`packages/core/src/slices/governance/gsd.ts`):
    - [ ] `gsd/PROJECT.md`
    - [ ] `gsd/REQUIREMENTS.md`
    - [ ] `gsd/ROADMAP.md`
    - [ ] `gsd/STATE.md`
    - [ ] `.agents/workflows/gsd-plan.md`, `gsd-execute.md`, `gsd-verify.md`
  - [ ] Implement GitHub Spec-Kit Slice (`packages/core/src/slices/governance/spec-kit.ts`):
    - [ ] `.spec-kit/constitution.md`
    - [ ] `.spec-kit/specs/feature-template.md`
    - [ ] `.spec-kit/tasks/task-runner.md`
    - [ ] `.spec-kit/prompts/implement.prompt.md`
    - [ ] `.agents/workflows/speckit-spec.md`, `speckit-implement.md`, `speckit-review.md`
- [ ] 2.4 Implement Production Utilities Slice (`packages/core/src/slices/utilities/starter-packs.ts`):
  - [ ] Frontend helper pack: `src/lib/axios-client.ts` (interceptors, Bearer token injection, retry), `src/lib/token-manager.ts`, `src/lib/api-gateway.ts`, and barrel `src/lib/index.ts`.
  - [ ] Backend helper pack: `src/utils/token-generator.ts` (JWT access/refresh token rotation), `src/utils/password-hasher.ts` (crypto hashing), `src/utils/api-response.ts`, and barrel `src/utils/index.ts`.
- [ ] 2.5 Implement PM2 Process Manager Slice (`packages/core/src/slices/backend/pm2.ts`):
  - [ ] Scaffold `ecosystem.config.cjs` with clustering, restart limits, and environment variable maps.
- [ ] 2.6 Register all slices in `packages/core/src/engine/create-pipeline.ts`.
- [ ] 2.7 Write comprehensive unit tests for all new slices and verify 100% pass rate.

## Phase 3: Desktop App Home Landing Dashboard & 4-Step Stepper Studio (`@forgestack/desktop`)

- [ ] 3.1 Build Home Landing Dashboard (`packages/desktop/src/components/home/HomeTemplatesDashboard.tsx`):
  - [ ] Hero Card 0: Prominent, centered `[+ Create New Stack]` card routing to `/new` (Stepper Studio) with empty starting slots.
  - [ ] Template Cards Grid: Renders built-in presets (Monorepo, Next.js 15, Electron, Polyrepo, Fastify API) and user's saved custom templates from `localStorage`.
  - [ ] Card Action 1: `⚡ Fast Scaffold` button opening `FastScaffoldModal.tsx` asking only for Project Name + Path, synthesizing immediately.
  - [ ] Card Action 2: `Edit` button opening Stepper Studio with template configuration preloaded.
  - [ ] Card Action 3: Template management dropdown (Rename, Duplicate, Delete).
- [ ] 3.2 Build Fast Scaffold Modal (`packages/desktop/src/components/home/FastScaffoldModal.tsx`):
  - [ ] Clean, focused dialog for rapid project creation from a saved template.
  - [ ] Project Name input and Destination Path folder browser.
  - [ ] One-click synthesis execution.
- [ ] 3.3 Design Stepper Wizard State Machine (`packages/desktop/src/components/wizard/StepperWizard.tsx`):
  - [ ] 4-step progressive disclosure wizard:
    - Step 1: Project Identity & Target Archetype
    - Step 2: Adaptive Stack Ecosystem
    - Step 3: Tooling, Utilities & AI Governance
    - Step 4: Review, Save Preset & Scaffold
  - [ ] Ensure clean starting state with empty slots and explicit selection indicators.
- [ ] 3.4 Build Step 1 (`Step1IdentityArchetype.tsx`):
  - [ ] Project name input with slug sanitizer.
  - [ ] Destination path with native browse button.
  - [ ] Package manager buttons (`pnpm`, `npm`, `yarn`, `bun`).
  - [ ] Target archetype cards with icons and tags:
    - Full-Stack Monorepo
    - Full-Stack Polyrepo
    - Frontend SPA (Vite)
    - Full-Stack Next.js 15
    - Clean Backend API
    - Electron Desktop App
- [ ] 3.5 Build Step 2 (`Step2StackEcosystem.tsx`):
  - [ ] Dynamically display only relevant sections based on Step 1 archetype.
  - [ ] Frontend tiles: React 19 vs Next.js 15, Tailwind v4, State, Icons, Toast, Forms, Date libraries (`dayjs`, `date-fns`, `moment`).
  - [ ] Backend tiles: Fastify vs Express vs Hono, Postgres vs Mongo vs SQLite, Drizzle vs Prisma vs Mongoose.
  - [ ] Electron tiles: Secure contextBridge IPC configuration, React 19 renderer, optional embedded backend.
- [ ] 3.6 Build Step 3 (`Step3ToolingGovernance.tsx`):
  - [ ] Process management: Docker vs PM2 vs None.
  - [ ] Utility packs: Frontend Axios interceptors & Token manager, Backend JWT & Password hasher.
  - [ ] AI Governance Engine: Selectable OpenSpec vs Open-GSD vs GitHub Spec-Kit.
  - [ ] Agentic Awesome Skills: Curated 17 AAS playbooks checklist.
  - [ ] Architecture Rules: Cursor `.cursor/rules/*.mdc` and Copilot instructions.
- [ ] 3.7 Build Step 4 (`Step4ReviewScaffold.tsx`):
  - [ ] Architecture review checklist showing selected components.
  - [ ] "Save as Custom Template Preset" dialog storing stack definition in `localStorage`.
  - [ ] "Load Saved Preset" dropdown to instantly populate the stepper with saved stacks.
  - [ ] One-click scaffold execution trigger with live console streaming.
- [ ] 3.8 Update Right-Panel Staging (`FileTreePreview.tsx`):
  - [ ] Add VS Code-style action bar matching user reference image:
    - `+ New File` button & inline modal to stage custom files.
    - `+ New Folder` button & inline modal to stage custom folders.
    - `Refresh` button to re-trigger VFS compilation.
    - `Collapse/Expand All` toggle button.
  - [ ] Add smooth staggered transitions and animated tree badge counters.

## Phase 4: Integration, Verification & OpenSpec Archival

- [ ] 4.1 Update CLI prompts in `packages/cli/src/prompts/wizard.ts` to support new archetypes and options.
- [ ] 4.2 Run full monorepo test suite (`pnpm test`) across `@forgestack/core`, `@forgestack/cli`, and `@forgestack/desktop`.
- [ ] 4.3 Verify physical disk scaffolding of Electron desktop app, Next.js 15 app, GSD governance, and Spec-Kit governance.
- [ ] 4.4 Run `graphify update .` to keep the codebase knowledge graph synchronized.
