# Change Proposal: Multi-Framework Expansion, Multi-Engine AI Governance, and 4-Step Stepper Studio UX

## Why

ForgeStack's current studio provides high composability for React 19 + Vite and Node.js backends, but real-world teams have diverse architectural constraints:
1. **AI Governance Monoculture**: While OpenSpec is powerful, many engineering teams and AI agents standardize on alternative specification frameworks such as **Open-GSD (`gsd-core`)** for milestone/task-driven delivery or **GitHub Spec-Kit (`github/spec-kit`)** for Gherkin/constitution-driven spec systems. Restricting AI governance solely to OpenSpec creates friction for teams using alternative agent conventions.
2. **Missing Essential Frameworks & Runtimes**: Modern full-stack developers frequently bootstrap **Next.js 15** (App Router, Server Actions, SSR) and native desktop cross-platform apps via **Electron** (with `electron-vite` standards, secure `contextBridge` IPC contracts, and preload scripts).
3. **Absence of Production Utility Packs**: Developers repeatedly re-write boilerplate utilities for date manipulation (`dayjs`, `date-fns`, `moment`), frontend API clients (Axios interceptors with automatic Bearer token injection, token refresh, and network retry), backend authentication helpers (JWT token rotation, password hashing), and process management (PM2 `ecosystem.config.cjs` alongside Docker).
4. **Cognitive Overload in Configurator UI**: Displaying all stack options simultaneously in a single unguided layout creates choice paralysis. Users need a guided 4-step stepper wizard that starts with clean empty slots, adapts contextually to their chosen runtime, and provides an animated right-side virtual staging panel with VS Code-grade file tree interactions (New File, New Folder, Refresh, Collapse All) and reusable custom preset saving.

## What Changes

1. **AI Governance Engine Expansion**:
   - Add **Open-GSD (`gsd-core`)** support: scaffolds `gsd/PROJECT.md`, `gsd/REQUIREMENTS.md`, `gsd/ROADMAP.md`, `gsd/STATE.md`, and `.agents/workflows/gsd-*.md`.
   - Add **GitHub Spec-Kit (`github/spec-kit`)** support: scaffolds `.spec-kit/constitution.md`, `.spec-kit/specs/`, `.spec-kit/tasks/`, `.spec-kit/prompts/`, and `.agents/workflows/speckit-*.md`.
   - Support selectable governance engine mode in configuration: `'openspec' | 'gsd' | 'speckit' | 'all' | 'none'`.

2. **New Framework & Runtime Slices**:
   - **Next.js 15 Full-Stack Slice**: App Router, TypeScript, Tailwind CSS v4, API route handlers (`app/api/health/route.ts`), Server Actions, and modular structure.
   - **Electron Desktop App Slice (`electron-vite`)**:
     - Main process (`src/main/index.ts`) with window lifecycle and secure IPC dispatchers.
     - Preload script (`src/preload/index.ts`) exposing typed `electronAPI` via `contextBridge.exposeInMainWorld("electronAPI", electronAPI)` with `contextIsolation: true` and `nodeIntegration: false`.
     - Explicit IPC channels: `profile:create` and `log:getAll`.
     - Renderer process (`src/renderer/`) with React 19 + Tailwind CSS v4.
     - Optional attached backend service for desktop applications requiring local persistence.

3. **Production Utility & Starter Packs**:
   - **Date Manipulation**: Selectable `dayjs`, `date-fns`, `moment`, or native.
   - **Frontend Utilities**: Modular `src/lib/axios-client.ts` (Bearer auth injection, automatic token refresh on 401, retry), `src/lib/token-manager.ts`, and `src/lib/api-gateway.ts` with clean barrel export via `src/lib/index.ts`.
   - **Backend Utilities**: Modular `src/utils/token-generator.ts` (JWT access/refresh token signing & verification), `src/utils/password-hasher.ts` (crypto hashing), and `src/utils/api-response.ts` (standardized envelopes) with clean barrel export via `src/utils/index.ts`.
   - **Process Management**: Selectable `docker` (`Dockerfile` + `docker-compose.yml`), `pm2` (`ecosystem.config.cjs` clustering & auto-restart), or `none`.

4. **Desktop Studio Stepper UX Overhaul**:
   - **Clean Starting Slate**: Starts with empty, unconfigured slots rather than overwhelming defaults.
   - **Step 1: Project Identity & Runtime Archetype**: Name, destination path, package manager (`pnpm`, `npm`, `yarn`, `bun`), and target archetype (`fullstack-monorepo`, `fullstack-polyrepo`, `frontend-spa`, `nextjs-fullstack`, `backend-api`, `electron-desktop`).
   - **Step 2: Context-Aware Framework & Stack Configurator**: Dynamically displays only relevant options (Frontend framework, styling, state, icons, toast, forms, date library; Backend framework, database, ORM; Electron IPC & main/renderer options).
   - **Step 3: Tooling, Utilities & AI Governance**: Select process manager (Docker/PM2), utility packs (Axios interceptor, JWT generator), AI governance engine (OpenSpec / GSD / Spec-Kit), and 17 Agentic Awesome Skills.
   - **Step 4: Review, Save Custom Preset & Scaffold**: Complete architecture breakdown, "Save as Reusable Preset" to localStorage, and one-click disk synthesis with live progress streaming.

5. **Right-Panel Virtual Staging with VS Code-Grade Actions**:
   - Real-time animated tree updates reflecting active selections.
   - Header action bar with VS Code icons:
     - `+ New File`: Interactive modal to add a custom virtual file to the staged tree.
     - `+ New Folder`: Add custom virtual directory.
     - `Refresh`: Force re-compilation of the virtual filesystem.
     - `Collapse / Expand All`: Toggle all tree nodes.
   - Staggered file count badges and click-to-preview file modal.

## Capabilities

### New Capabilities
- `electron-vite-desktop`: Standalone and full-stack Electron desktop applications using `electron-vite`, secure `contextBridge` IPC, and React 19 renderer.
- `nextjs-fullstack`: Next.js 15 App Router configuration with Tailwind CSS v4, API routes, and Server Actions.
- `multi-engine-ai-governance`: Support for Open-GSD and GitHub Spec-Kit in addition to OpenSpec.
- `utility-starter-packs`: Modular, barrel-exported frontend (Axios interceptor, token storage) and backend (JWT generator, password hasher) helpers, date libraries, and PM2 process management.
- `stepper-wizard-ui`: 4-step progressive disclosure wizard in the desktop studio with custom template preset persistence.
- `vscode-tree-toolbar`: Action toolbar on the virtual staging panel with new file/folder creation, refresh, and collapse controls.

### Modified Capabilities
- `scaffolding-engine`: Extended `projectConfigSchema` and compositor pipeline to support new archetypes, date packages, PM2, utilities, and governance engines.
- `desktop-app`: Replaced dense single-view configurator with 4-step stepper and enhanced virtual staging tree.

## Impact

- **Core Engine**: Extends `ProjectConfig` schema with `aiGovernance.engine ('openspec' | 'gsd' | 'speckit')`, `frontend.dateLib`, `backend.processManager ('docker' | 'pm2' | 'none')`, and `utilities` slice.
- **Backwards Compatibility**: All existing presets (`monorepo`, `separate`, `spa`, `fastify-api`, `mongo-api`) remain 100% valid and continue to pass all 53 automated tests.
- **Bundle & Performance**: Dynamic imports and modular slices maintain sub-second in-memory VFS synthesis across all archetypes.
