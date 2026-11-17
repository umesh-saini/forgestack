# Scaffolding Engine Delta Specification

## Purpose
Extends the deterministic VFS scaffolding engine with support for Electron desktop apps, Next.js 15, multi-engine AI governance, production utilities, and PM2 process management.

## Requirements

### Requirement: Electron Desktop App Synthesis
The scaffolding engine SHALL support synthesizing standalone and full-stack Electron desktop applications using `electron-vite` standards.

#### Scenario: User scaffolds Electron Desktop application
- **WHEN** `topology` is set to `'electron-desktop'`
- **THEN** the VFS contains `electron.vite.config.ts`, `src/main/index.ts`, `src/preload/index.ts`, `src/preload/index.d.ts`, and `src/renderer/`
- **AND** `src/preload/index.ts` exposes `electronAPI` via `contextBridge.exposeInMainWorld` containing `profile:create` and `log:getAll` IPC invocations.

### Requirement: Next.js 15 Full-Stack Synthesis
The scaffolding engine SHALL support synthesizing Next.js 15 applications with App Router and Tailwind CSS v4.

#### Scenario: User scaffolds Next.js application
- **WHEN** `frontend.framework` is `'nextjs'` or `topology` is `'nextjs-fullstack'`
- **THEN** the VFS contains `next.config.ts`, `app/layout.tsx`, `app/page.tsx`, and `app/api/health/route.ts` with valid TypeScript types.

### Requirement: Production Utilities and Date Libraries
The scaffolding engine SHALL synthesize modular, barrel-exported frontend and backend utilities and date libraries.

#### Scenario: User selects Axios interceptor and token utilities
- **WHEN** frontend utilities are enabled
- **THEN** `src/lib/axios-client.ts`, `src/lib/token-manager.ts`, `src/lib/api-gateway.ts`, and `src/lib/index.ts` are generated.

#### Scenario: User selects JWT generator and password hasher
- **WHEN** backend utilities are enabled
- **THEN** `src/utils/token-generator.ts`, `src/utils/password-hasher.ts`, `src/utils/api-response.ts`, and `src/utils/index.ts` are generated.
