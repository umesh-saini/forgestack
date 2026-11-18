# Graph Report - project-setup  (2026-11-17)

## Corpus Check
- 136 files · ~165,379 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 4, .css 1)

## Summary
- 578 nodes · 1479 edges · 31 communities (23 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a1fb54f8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ProjectConfig
- App.tsx
- cli.ts
- desktop/package.json
- DragDropConfigurator.tsx
- steps
- compilerOptions
- types.ts
- tauri.conf.json
- core/package.json
- cli/package.json
- compilerOptions
- RecipeCompositor
- Badge.tsx
- fs.rs
- .openspec.yaml
- json-merge.ts
- package.json
- default.json
- create-forgestack-app.js
- scripts
- bin
- pnpm-workspace.yaml
- forgestack-desktop
- devDependencies
- @types/node
- 2026-11-17-nextgen-archetypes-primitives-and-ai-mcp-enhancements/.openspec.yaml

## God Nodes (most connected - your core abstractions)
1. `ProjectConfig` - 91 edges
2. `VirtualFileSystem` - 67 edges
3. `FeatureSlice` - 31 edges
4. `react` - 30 edges
5. `DragDropConfigurator()` - 26 edges
6. `lucide-react` - 26 edges
7. `DEPENDENCY_REGISTRY` - 22 edges
8. `generateProjectVfs()` - 18 edges
9. `CodePatcher` - 14 edges
10. `ForgeStackAppContent()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `typescript@^5.7.3` --declares--> `typescript`  [EXTRACTED]
  packages/cli/package.json → package.json
- `typescript@^5.7.3` --declares--> `typescript`  [EXTRACTED]
  packages/core/package.json → package.json
- `scaffoldApiPlugin()` --calls--> `generateProjectVfs()`  [EXTRACTED]
  packages/desktop/vite.config.ts → packages/core/src/engine/create-pipeline.ts
- `Props` --references--> `ProjectConfig`  [EXTRACTED]
  packages/desktop/src/components/home/ScaffoldConsoleView.tsx → packages/core/src/types/config.ts
- `Props` --references--> `ProjectConfig`  [EXTRACTED]
  packages/desktop/src/components/wizard/AiGovernance.tsx → packages/core/src/types/config.ts

## Import Cycles
- None detected.

## Communities (31 total, 8 thin omitted)

### Community 0 - "ProjectConfig"
Cohesion: 0.10
Nodes (38): FeatureSlice, generateProjectVfs(), DEPENDENCY_REGISTRY, getPinnedVersion(), PackageName, resolveDependencies(), agentRagSlice, betterAuthSlice (+30 more)

### Community 1 - "App.tsx"
Cohesion: 0.06
Nodes (52): App(), ForgeStackAppContent(), ExecutionConsole(), Props, FastScaffoldModal(), Props, HomeTemplatesDashboard(), Props (+44 more)

### Community 2 - "cli.ts"
Cohesion: 0.10
Nodes (12): createCli(), runInteractiveWizard(), CliReporter, FlushOptions, FlushResult, TransactionalFlusher, projectConfigSchema, ProcessResult (+4 more)

### Community 3 - "desktop/package.json"
Cohesion: 0.06
Nodes (45): dependencies, clsx@^2.1.1, @forgestack/core@workspace:*, lucide-react@^0.475.0, @monaco-editor/react@^4.7.0, react@^19.0.0, react-dom@^19.0.0, react-router-dom@^7.18.5 (+37 more)

### Community 4 - "DragDropConfigurator.tsx"
Cohesion: 0.12
Nodes (43): ClaudeIcon(), CursorRulesIcon(), DockerIcon(), DrizzleIcon(), ElectronIcon(), ExpressIcon(), FastifyIcon(), getFileIcon() (+35 more)

### Community 5 - "steps"
Cohesion: 0.08
Nodes (27): name, runs-on, steps, jobs, e2e-matrix, test, node-version, name (+19 more)

### Community 6 - "compilerOptions"
Cohesion: 0.07
Nodes (24): compilerOptions, outDir, rootDir, extends, include, ../../tsconfig.json, compilerOptions, outDir (+16 more)

### Community 7 - "types.ts"
Cohesion: 0.11
Nodes (10): AppendFileAction, CreateFileAction, DeleteFileAction, FileAction, FileActionType, MergeJsonAction, OverwriteFileAction, PatchAstAction (+2 more)

### Community 8 - "tauri.conf.json"
Cohesion: 0.11
Nodes (18): app, security, windows, build, beforeBuildCommand, beforeDevCommand, devUrl, frontendDist (+10 more)

### Community 9 - "core/package.json"
Cohesion: 0.13
Nodes (15): import, types, dependencies, zod@^3.24.2, exports, ./browser, main, name (+7 more)

### Community 10 - "cli/package.json"
Cohesion: 0.15
Nodes (14): dependencies, @clack/prompts@^0.9.1, commander@^13.1.0, @forgestack/core@workspace:*, picocolors@^1.1.1, description, files, @forgestack/core (+6 more)

### Community 11 - "compilerOptions"
Cohesion: 0.14
Nodes (13): compilerOptions, declaration, declarationMap, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, noImplicitAny (+5 more)

### Community 13 - "Badge.tsx"
Cohesion: 0.14
Nodes (9): ArchitectureTopology, Badge(), BadgeProps, BadgeVariant, variantStyles, Props, Props, Props (+1 more)

### Community 14 - "fs.rs"
Cohesion: 0.18
Nodes (6): PathValidationResult, pick_directory(), scaffold_project_files(), ScaffoldPayload, validate_target_path(), VirtualFilePayload

### Community 15 - ".openspec.yaml"
Cohesion: 0.50
Nodes (3): date, name, schema

### Community 16 - "json-merge.ts"
Cohesion: 0.62
Nodes (5): deepEquals(), deepMergeJson(), isPlainObject(), mergePackageJson(), sortKeys()

### Community 17 - "package.json"
Cohesion: 0.20
Nodes (11): devDependencies, typescript@^5.7.3, vitest@^3.0.5, typescript, vitest, name, packageManager, private (+3 more)

### Community 18 - "default.json"
Cohesion: 0.33
Nodes (5): description, identifier, permissions, $schema, windows

### Community 20 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, cli:dev, desktop:build, desktop:dev, desktop:web, lint, test (+2 more)

### Community 21 - "bin"
Cohesion: 0.27
Nodes (6): bin, create-forgestack-app, forgestack, scripts, build, test

### Community 28 - "devDependencies"
Cohesion: 0.40
Nodes (5): devDependencies, @types/node@^22.13.4, typescript@^5.7.3, vitest@^3.0.5, vitest

### Community 29 - "@types/node"
Cohesion: 0.40
Nodes (5): @types/node, devDependencies, @types/node@^22.13.4, vitest@^3.0.5, vitest

### Community 30 - "2026-11-17-nextgen-archetypes-primitives-and-ai-mcp-enhancements/.openspec.yaml"
Cohesion: 0.50
Nodes (3): date, name, schema

## Knowledge Gaps
- **1 isolated node(s):** `forgestack-desktop`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 178 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ProjectConfig` connect `ProjectConfig` to `App.tsx`, `cli.ts`, `DragDropConfigurator.tsx`, `RecipeCompositor`, `Badge.tsx`?**
  _High betweenness centrality (0.174) - this node is a cross-community bridge._
- **What connects `forgestack-desktop` to the rest of the system?**
  _1 weakly-connected nodes found - possible missing edges._
- **Should `ProjectConfig` be split into smaller, more focused modules?**
  _Cohesion score 0.09507722007722008 - nodes in this community are weakly interconnected._
- **Why does `zod` connect `core/package.json` to `ProjectConfig`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05583308845136644 - nodes in this community are weakly interconnected._
- **Why does `react` connect `App.tsx` to `desktop/package.json`, `DragDropConfigurator.tsx`, `Badge.tsx`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Should `cli.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09957325746799431 - nodes in this community are weakly interconnected._