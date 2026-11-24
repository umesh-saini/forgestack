# ForgeStack CLI & Template Store

> 93 nodes · cohesion 0.05

## Key Concepts

- **cli.ts** (33 connections) — `packages/cli/src/cli.ts`
- **wizard.ts** (21 connections) — `packages/cli/src/prompts/wizard.ts`
- **createCli()** (20 connections) — `packages/cli/src/cli.ts`
- **ref_node_path** (20 connections)
- **store.ts** (17 connections) — `packages/cli/src/templates/store.ts`
- **ref_node_fs** (16 connections)
- **server.ts** (15 connections) — `packages/cli/src/mcp/server.ts`
- **desktop/vite.config.ts** (13 connections) — `packages/desktop/vite.config.ts`
- **TemplateStore** (12 connections) — `packages/cli/src/templates/store.ts`
- **agent-provisioner.ts** (12 connections) — `packages/core/src/skills/agent-provisioner.ts`
- **curated.ts** (10 connections) — `packages/cli/src/templates/curated.ts`
- **ref_node_os** (10 connections)
- **TransactionalFlusher** (9 connections) — `packages/core/src/engine/flusher.ts`
- **runInteractiveWizard()** (9 connections) — `packages/cli/src/prompts/wizard.ts`
- **flusher.ts** (9 connections) — `packages/core/src/engine/flusher.ts`
- **ProcessRunner** (8 connections) — `packages/core/src/utils/process-runner.ts`
- **.loadSavedTemplates()** (8 connections) — `packages/cli/src/templates/store.ts`
- **.flush()** (8 connections) — `packages/core/src/engine/flusher.ts`
- **cli-templates.test.ts** (8 connections) — `packages/cli/src/__tests__/cli-templates.test.ts`
- **template-store.test.ts** (8 connections) — `packages/cli/src/__tests__/template-store.test.ts`
- **reporter.ts** (8 connections) — `packages/cli/src/ui/reporter.ts`
- **directory.ts** (8 connections) — `packages/cli/src/utils/directory.ts`
- **flusher.test.ts** (8 connections) — `packages/core/src/engine/__tests__/flusher.test.ts`
- **targets.ts** (8 connections) — `packages/core/src/skills/targets.ts`
- **agent-provisioner.test.ts** (8 connections) — `packages/core/src/skills/__tests__/agent-provisioner.test.ts`
- *... and 68 more nodes in this community*

## Relationships

- [Core Scaffolding Engine & Slices](Core_Scaffolding_Engine_&_Slices.md) (50 shared connections)
- [E2E Combination Matrix & Runtime Testing](E2E_Combination_Matrix_&_Runtime_Testing.md) (8 shared connections)
- [CLI Package Dependencies & Binaries](CLI_Package_Dependencies_&_Binaries.md) (5 shared connections)
- [Desktop App State & Modal Flows](Desktop_App_State_&_Modal_Flows.md) (3 shared connections)
- [Standalone Website & Documentation UI](Standalone_Website_&_Documentation_UI.md) (2 shared connections)
- [Virtual File System & File Actions](Virtual_File_System_&_File_Actions.md) (1 shared connections)

## Source Files

- `packages/cli/package.json`
- `packages/cli/src/__tests__/cli-templates.test.ts`
- `packages/cli/src/__tests__/cli.test.ts`
- `packages/cli/src/__tests__/directory-resolver.test.ts`
- `packages/cli/src/__tests__/mcp-server.test.ts`
- `packages/cli/src/__tests__/template-store.test.ts`
- `packages/cli/src/cli.ts`
- `packages/cli/src/index.ts`
- `packages/cli/src/mcp/server.ts`
- `packages/cli/src/prompts/wizard.ts`
- `packages/cli/src/templates/curated.ts`
- `packages/cli/src/templates/store.ts`
- `packages/cli/src/ui/reporter.ts`
- `packages/cli/src/ui/searchable-multiselect.ts`
- `packages/cli/src/ui/splash.ts`
- `packages/cli/src/utils/directory.ts`
- `packages/core/src/engine/__tests__/flusher.test.ts`
- `packages/core/src/engine/flusher.ts`
- `packages/core/src/skills/__tests__/agent-provisioner.test.ts`
- `packages/core/src/skills/agent-provisioner.ts`

## Audit Trail

- EXTRACTED: 299 (99%)
- INFERRED: 4 (1%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [index](index.md) to navigate.*