# Tasks: Multi-Framework Expansion, Multi-Engine AI Governance, and 4-Step Stepper Studio

## Phase 1: Core Configuration Schema & Types (`@forgestack/core`)

- [x] 1.1 Update `packages/core/src/types/config.ts`:
  - [x] Add `'nextjs'` to frontend frameworks.
  - [x] Add `'electron-desktop'` and `'nextjs-fullstack'` to `topology` enum.
  - [x] Add `dateLib: z.enum(['dayjs', 'date-fns', 'moment', 'none'])` to frontend config.
  - [x] Add `processManager: z.enum(['docker', 'pm2', 'none'])` to backend config.
  - [x] Add `utilities: z.object({ frontendHelpers: z.boolean(), backendHelpers: z.boolean() })` to config.
  - [x] Extend `aiGovernance`: `engine: z.enum(['openspec', 'gsd', 'speckit', 'all'])`.
- [x] 1.2 Update `packages/core/src/registry/dependencies.ts` with pinned versions for:
  - [x] `electron`, `electron-vite`, `vite-plugin-electron`
  - [x] `next`, `react`, `react-dom`
  - [x] `dayjs`, `date-fns`, `moment`
  - [x] `axios`, `jsonwebtoken`, `@types/jsonwebtoken`
  - [x] `pm2`

## Phase 2: Feature Slices Implementation (`@forgestack/core`)

- [x] 2.1 Implement Electron Desktop Slice (`packages/core/src/slices/desktop/electron-vite.ts`):
  - [x] Scaffold `electron.vite.config.ts` for main, preload, and renderer.
  - [x] Scaffold `src/main/index.ts` with `BrowserWindow` creation, `contextIsolation: true`, and IPC handlers.
  - [x] Scaffold `src/preload/index.ts` with user-specified `electronAPI` (`profile:create`, `log:getAll`) via `contextBridge.exposeInMainWorld`.
  - [x] Scaffold `src/preload/index.d.ts` declaring global `Window.electronAPI`.
  - [x] Scaffold `src/renderer/` containing React 19 + Tailwind CSS v4 consuming `window.electronAPI`.
- [x] 2.2 Implement Next.js 15 Full-Stack Slice (`packages/core/src/slices/frontend/nextjs.ts`):
  - [x] Scaffold `next.config.ts`, `app/layout.tsx`, `app/page.tsx`, and `app/globals.css`.
  - [x] Scaffold `app/api/health/route.ts` demonstrating standard Next.js route handlers.
- [x] 2.3 Implement Multi-Engine AI Governance Slices:
  - [x] Implement Open-GSD Slice (`packages/core/src/slices/governance/gsd.ts`):
    - [x] `gsd/PROJECT.md`
    - [x] `gsd/REQUIREMENTS.md`
    - [x] `gsd/ROADMAP.md`
    - [x] `gsd/STATE.md`
    - [x] `.agents/workflows/gsd-plan.md`, `gsd-execute.md`, `gsd-verify.md`
  - [x] Implement GitHub Spec-Kit Slice (`packages/core/src/slices/governance/spec-kit.ts`):
    - [x] `.spec-kit/constitution.md`
    - [x] `.spec-kit/specs/feature-template.md`
    - [x] `.spec-kit/tasks/task-runner.md`
    - [x] `.spec-kit/prompts/implement.prompt.md`
    - [x] `.agents/workflows/speckit-spec.md`, `speckit-implement.md`, `speckit-review.md`
- [x] 2.4 Implement Production Utilities Slice (`packages/core/src/slices/utilities/starter-packs.ts`):
  - [x] Frontend helper pack: `src/lib/axios-client.ts` (interceptors, Bearer token injection, retry), `src/lib/token-manager.ts`, `src/lib/api-gateway.ts`, and barrel `src/lib/index.ts`.
  - [x] Backend helper pack: `src/utils/token-generator.ts` (JWT access/refresh token rotation), `src/utils/password-hasher.ts` (crypto hashing), `src/utils/api-response.ts`, and barrel `src/utils/index.ts`.
- [x] 2.5 Implement PM2 Process Manager Slice (`packages/core/src/slices/backend/pm2.ts`):
  - [x] Scaffold `ecosystem.config.cjs` with clustering, restart limits, and environment variable maps.
- [x] 2.6 Register all slices in `packages/core/src/engine/create-pipeline.ts`.
- [x] 2.7 Write comprehensive unit tests for all new slices and verify 100% pass rate.

## Phase 3: Desktop App Home Landing Dashboard & 4-Step Stepper Studio (`@forgestack/desktop`)

- [x] 3.1 Build Home Landing Dashboard (`packages/desktop/src/components/home/HomeTemplatesDashboard.tsx`):
  - [x] Hero Card 0: Prominent, centered `[+ Create New Stack]` card routing to `/new` (Stepper Studio) with empty starting slots.
  - [x] Template Cards Grid: Renders built-in presets (Monorepo, Next.js 15, Electron, Polyrepo, Fastify API) and user's saved custom templates from `localStorage`.
  - [x] Card Action 1: `⚡ Fast Scaffold` button opening `FastScaffoldModal.tsx` asking only for Project Name + Path, synthesizing immediately.
  - [x] Card Action 2: `Edit` button opening Stepper Studio with template configuration preloaded.
  - [x] Card Action 3: Template management dropdown (Rename, Duplicate, Delete).
- [x] 3.2 Build Fast Scaffold Modal (`packages/desktop/src/components/home/FastScaffoldModal.tsx`):
  - [x] Clean, focused dialog for rapid project creation from a saved template.
  - [x] Project Name input and Destination Path folder browser.
  - [x] One-click synthesis execution.
- [x] 3.3 Design Stepper Wizard State Machine (`packages/desktop/src/components/wizard/StepperWizard.tsx`):
  - [x] 4-step progressive disclosure wizard:
    - Step 1: Project Identity & Target Archetype
    - Step 2: Adaptive Stack Ecosystem
    - Step 3: Tooling, Utilities & AI Governance
    - Step 4: Review, Save Preset & Scaffold
  - [x] Ensure clean starting state with empty slots and explicit selection indicators.
- [x] 3.4 Build Step 1 (`Step1IdentityArchetype.tsx`):
  - [x] Project name input with slug sanitizer.
  - [x] Destination path with native browse button.
  - [x] Package manager buttons (`pnpm`, `npm`, `yarn`, `bun`).
  - [x] Target archetype cards with icons and tags:
    - Full-Stack Monorepo
    - Full-Stack Polyrepo
    - Frontend SPA (Vite)
    - Full-Stack Next.js 15
    - Clean Backend API
    - Electron Desktop App
- [x] 3.5 Build Step 2 (`Step2StackEcosystem.tsx`):
  - [x] Dynamically display only relevant sections based on Step 1 archetype.
  - [x] Frontend tiles: React 19 vs Next.js 15, Tailwind v4, State, Icons, Toast, Forms, Date libraries (`dayjs`, `date-fns`, `moment`).
  - [x] Backend tiles: Fastify vs Express vs Hono, Postgres vs Mongo vs SQLite, Drizzle vs Prisma vs Mongoose.
  - [x] Electron tiles: Secure contextBridge IPC configuration, React 19 renderer, optional embedded backend.
- [x] 3.6 Build Step 3 (`Step3ToolingGovernance.tsx`):
  - [x] Process management: Docker vs PM2 vs None.
  - [x] Utility packs: Frontend Axios interceptors & Token manager, Backend JWT & Password hasher.
  - [x] AI Governance Engine: Selectable OpenSpec vs Open-GSD vs GitHub Spec-Kit.
  - [x] Agentic Awesome Skills: Curated 17 AAS playbooks checklist.
  - [x] Architecture Rules: Cursor `.cursor/rules/*.mdc` and Copilot instructions.
- [x] 3.7 Build Step 4 (`Step4ReviewScaffold.tsx`):
  - [x] Architecture review checklist showing selected components.
  - [x] "Save as Custom Template Preset" dialog storing stack definition in `localStorage`.
  - [x] "Load Saved Preset" dropdown to instantly populate the stepper with saved stacks.
  - [x] One-click scaffold execution trigger with live console streaming.
- [x] 3.8 Update Right-Panel Staging (`FileTreePreview.tsx`):
  - [x] Add VS Code-style action bar matching user reference image:
    - `+ New File` button & inline modal to stage custom files.
    - `+ New Folder` button & inline modal to stage custom folders.
    - `Refresh` button to re-trigger VFS compilation.
    - `Collapse/Expand All` toggle button.
  - [x] Add smooth staggered transitions and animated tree badge counters.

## Phase 4: Integration, Verification & OpenSpec Archival

- [x] 4.1 Update CLI prompts in `packages/cli/src/prompts/wizard.ts` to support new archetypes and options.
- [x] 4.2 Run full monorepo test suite (`pnpm test`) across `@forgestack/core`, `@forgestack/cli`, and `@forgestack/desktop`.
- [x] 4.3 Verify physical disk scaffolding of Electron desktop app, Next.js 15 app, GSD governance, and Spec-Kit governance.
- [x] 4.4 Run `graphify update .` to keep the codebase knowledge graph synchronized.

## Phase 5: Production UX Polish & Workspace Ergonomics

- [x] 5.1 Authentic VS Code Split Workspace (`VsCodeWorkspace.tsx`):
  - [x] Full-width File Explorer when no file is active (no awkward empty placeholder cards).
  - [x] Monaco code editor with syntax highlighting, line numbers, and theme switching.
  - [x] Automatic horizontal scroll into view for active file tabs.
  - [x] Crisp mathematical vector JSON icon (`#F59E0B`).
- [x] 5.2 Decoupled AI Governance & Claude Code Support:
  - [x] Decouple `.cursor` rules from `.agents` skills.
  - [x] Add dedicated Claude Code (`CLAUDE.md`) architecture guardrail generator.
- [x] 5.3 Consolidated Navigation & Standard Spacing:
  - [x] Eliminate duplicate sub-header on Templates Dashboard.
  - [x] Align single `StudioNavbar` to standard 1750px grid container with compact, standard link gap.
  - [x] High-contrast typography across Clean Light and dark themes.
