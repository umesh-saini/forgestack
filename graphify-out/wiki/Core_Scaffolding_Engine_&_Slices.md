# Core Scaffolding Engine & Slices

> 140 nodes · cohesion 0.07

## Key Concepts

- **ProjectConfig** (108 connections) — `packages/core/src/types/config.ts`
- **create-pipeline.ts** (90 connections) — `packages/core/src/engine/create-pipeline.ts`
- **VirtualFileSystem** (73 connections) — `packages/core/src/vfs/vfs.ts`
- **config.ts** (72 connections) — `packages/core/src/types/config.ts`
- **vfs.ts** (61 connections) — `packages/core/src/vfs/vfs.ts`
- **browser.ts** (60 connections) — `packages/core/src/browser.ts`
- **core/src/index.ts** (45 connections) — `packages/core/src/index.ts`
- **ref_vitest** (44 connections)
- **compositor.ts** (40 connections) — `packages/core/src/engine/compositor.ts`
- **FeatureSlice** (35 connections) — `packages/core/src/engine/compositor.ts`
- **dependencies.ts** (30 connections) — `packages/core/src/registry/dependencies.ts`
- **generateProjectVfs()** (25 connections) — `packages/core/src/engine/create-pipeline.ts`
- **DEPENDENCY_REGISTRY** (25 connections) — `packages/core/src/registry/dependencies.ts`
- **layout.ts** (20 connections) — `packages/core/src/utils/layout.ts`
- **clean-modular.ts** (18 connections) — `packages/core/src/slices/backend/clean-modular.ts`
- **react-vite.ts** (18 connections) — `packages/core/src/slices/frontend/react-vite.ts`
- **mongodb.ts** (17 connections) — `packages/core/src/slices/database/mongodb.ts`
- **postgres.ts** (17 connections) — `packages/core/src/slices/database/postgres.ts`
- **sqlite.ts** (17 connections) — `packages/core/src/slices/database/sqlite.ts`
- **state.ts** (17 connections) — `packages/core/src/slices/frontend/state.ts`
- **ui-extras.ts** (17 connections) — `packages/core/src/slices/frontend/ui-extras.ts`
- **layoutFor()** (16 connections) — `packages/core/src/utils/layout.ts`
- **better-auth.ts** (16 connections) — `packages/core/src/slices/auth/better-auth.ts`
- **trpc.ts** (16 connections) — `packages/core/src/slices/rpc/trpc.ts`
- **CodePatcher** (15 connections) — `packages/core/src/utils/code-patcher.ts`
- *... and 115 more nodes in this community*

## Relationships

- [ForgeStack CLI & Template Store](ForgeStack_CLI_&_Template_Store.md) (50 shared connections)
- [Desktop Wizard Step Components & Badges](Desktop_Wizard_Step_Components_&_Badges.md) (20 shared connections)
- [Virtual File System & File Actions](Virtual_File_System_&_File_Actions.md) (16 shared connections)
- [Desktop App State & Modal Flows](Desktop_App_State_&_Modal_Flows.md) (14 shared connections)
- [Desktop Ecosystem & Tech Icons](Desktop_Ecosystem_&_Tech_Icons.md) (10 shared connections)
- [Desktop Studio UI Shell & Layout](Desktop_Studio_UI_Shell_&_Layout.md) (9 shared connections)
- [Desktop File Tree & Editor Drawer Preview](Desktop_File_Tree_&_Editor_Drawer_Preview.md) (6 shared connections)
- [E2E Combination Matrix & Runtime Testing](E2E_Combination_Matrix_&_Runtime_Testing.md) (5 shared connections)
- [JSON Merge & Utility Functions](JSON_Merge_&_Utility_Functions.md) (3 shared connections)
- [Standalone Website & Documentation UI](Standalone_Website_&_Documentation_UI.md) (1 shared connections)
- [Core Engine Package Configuration](Core_Engine_Package_Configuration.md) (1 shared connections)

## Source Files

- `packages/core/src/browser.ts`
- `packages/core/src/engine/__tests__/compositor.test.ts`
- `packages/core/src/engine/compositor.ts`
- `packages/core/src/engine/create-pipeline.ts`
- `packages/core/src/index.ts`
- `packages/core/src/registry/__tests__/dependencies.test.ts`
- `packages/core/src/registry/dependencies.ts`
- `packages/core/src/slices/ai/__tests__/agent-rag.test.ts`
- `packages/core/src/slices/ai/agent-rag.ts`
- `packages/core/src/slices/auth/__tests__/better-auth.test.ts`
- `packages/core/src/slices/auth/better-auth.ts`
- `packages/core/src/slices/backend/__tests__/bullmq-worker.test.ts`
- `packages/core/src/slices/backend/__tests__/clean-modular.test.ts`
- `packages/core/src/slices/backend/__tests__/pm2.test.ts`
- `packages/core/src/slices/backend/bullmq-worker.ts`
- `packages/core/src/slices/backend/clean-modular.ts`
- `packages/core/src/slices/backend/pm2.ts`
- `packages/core/src/slices/container/__tests__/docker.test.ts`
- `packages/core/src/slices/container/docker.ts`
- `packages/core/src/slices/database/__tests__/mongodb.test.ts`

## Audit Trail

- EXTRACTED: 838 (100%)
- INFERRED: 0 (0%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [index](index.md) to navigate.*