# Graph Report - project-setup  (2026-11-17)

## Corpus Check
- 89 files · ~125,045 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 4, .css 1)

## Summary
- 447 nodes · 965 edges · 29 communities (21 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `606a69ff`
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
- package.json
- scripts
- fs.rs
- .openspec.yaml
- json-merge.ts
- CodePatcher
- @types/node
- create-forgestack-app.js
- bin
- scripts
- pnpm-workspace.yaml
- forgestack-desktop
- scripts

## God Nodes (most connected - your core abstractions)
1. `ProjectConfig` - 47 edges
2. `VirtualFileSystem` - 46 edges
3. `DragDropConfigurator()` - 28 edges
4. `react` - 17 edges
5. `App()` - 16 edges
6. `FeatureSlice` - 15 edges
7. `lucide-react` - 14 edges
8. `compilerOptions` - 13 edges
9. `CodePatcher` - 11 edges
10. `DEPENDENCY_REGISTRY` - 11 edges

## Surprising Connections (you probably didn't know these)
- `typescript@^5.7.3` --declares--> `typescript`  [EXTRACTED]
  packages/cli/package.json → package.json
- `typescript@^5.7.3` --declares--> `typescript`  [EXTRACTED]
  packages/core/package.json → package.json
- `typescript@^5.7.3` --declares--> `typescript`  [EXTRACTED]
  packages/desktop/package.json → package.json
- `Props` --references--> `ProjectConfig`  [EXTRACTED]
  packages/desktop/src/components/wizard/AiGovernance.tsx → packages/core/src/types/config.ts
- `Props` --references--> `ProjectConfig`  [EXTRACTED]
  packages/desktop/src/components/wizard/BackendGrid.tsx → packages/core/src/types/config.ts

## Import Cycles
- None detected.

## Communities (29 total, 8 thin omitted)

### Community 0 - "ProjectConfig"
Cohesion: 0.17
Nodes (20): FeatureSlice, DEPENDENCY_REGISTRY, getPinnedVersion(), PackageName, resolveDependencies(), cleanModularBackendSlice, dockerSlice, mongodbSlice (+12 more)

### Community 1 - "App.tsx"
Cohesion: 0.08
Nodes (34): ArchitectureTopology, TreeNode, App(), Badge(), BadgeProps, BadgeVariant, variantStyles, ExecutionConsole() (+26 more)

### Community 2 - "cli.ts"
Cohesion: 0.09
Nodes (17): dependencies, @clack/prompts@^0.9.1, commander@^13.1.0, picocolors@^1.1.1, createCli(), runInteractiveWizard(), CliReporter, FlushOptions (+9 more)

### Community 3 - "desktop/package.json"
Cohesion: 0.05
Nodes (46): @forgestack/core@workspace:*, @forgestack/core, RecipeCompositor, createProjectPipeline(), generateProjectVfs(), dependencies, clsx@^2.1.1, @forgestack/core@workspace:* (+38 more)

### Community 4 - "DragDropConfigurator.tsx"
Cohesion: 0.15
Nodes (33): CursorRulesIcon(), DockerIcon(), DrizzleIcon(), ExpressIcon(), FastifyIcon(), HonoIcon(), IconProps, LucideIcon() (+25 more)

### Community 5 - "steps"
Cohesion: 0.08
Nodes (27): name, runs-on, steps, jobs, e2e-matrix, test, node-version, name (+19 more)

### Community 6 - "compilerOptions"
Cohesion: 0.07
Nodes (24): compilerOptions, outDir, rootDir, extends, include, ../../tsconfig.json, compilerOptions, outDir (+16 more)

### Community 7 - "types.ts"
Cohesion: 0.11
Nodes (9): AppendFileAction, CreateFileAction, DeleteFileAction, FileAction, FileActionType, MergeJsonAction, OverwriteFileAction, PatchAstAction (+1 more)

### Community 8 - "tauri.conf.json"
Cohesion: 0.11
Nodes (18): app, security, windows, build, beforeBuildCommand, beforeDevCommand, devUrl, frontendDist (+10 more)

### Community 9 - "core/package.json"
Cohesion: 0.17
Nodes (12): import, types, dependencies, zod@^3.24.2, exports, ./browser, main, name (+4 more)

### Community 10 - "cli/package.json"
Cohesion: 0.18
Nodes (11): description, devDependencies, typescript@^5.7.3, vitest@^3.0.5, files, vitest, main, name (+3 more)

### Community 11 - "compilerOptions"
Cohesion: 0.14
Nodes (13): compilerOptions, declaration, declarationMap, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, noImplicitAny (+5 more)

### Community 12 - "package.json"
Cohesion: 0.20
Nodes (11): devDependencies, typescript@^5.7.3, vitest@^3.0.5, typescript, vitest, name, packageManager, private (+3 more)

### Community 13 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, cli:dev, desktop:build, desktop:dev, desktop:web, lint, test (+2 more)

### Community 14 - "fs.rs"
Cohesion: 0.31
Nodes (5): PathValidationResult, scaffold_project_files(), ScaffoldPayload, validate_target_path(), VirtualFilePayload

### Community 15 - ".openspec.yaml"
Cohesion: 0.50
Nodes (3): date, name, schema

### Community 16 - "json-merge.ts"
Cohesion: 0.62
Nodes (5): deepEquals(), deepMergeJson(), isPlainObject(), mergePackageJson(), sortKeys()

### Community 18 - "@types/node"
Cohesion: 0.29
Nodes (7): @types/node@^22.13.4, @types/node, devDependencies, @types/node@^22.13.4, typescript@^5.7.3, vitest@^3.0.5, vitest

### Community 20 - "bin"
Cohesion: 0.67
Nodes (3): bin, create-forgestack-app, forgestack

### Community 21 - "scripts"
Cohesion: 0.67
Nodes (3): scripts, build, test

### Community 28 - "scripts"
Cohesion: 0.67
Nodes (3): scripts, build, test

## Knowledge Gaps
- **1 isolated node(s):** `forgestack-desktop`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 149 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `typescript` connect `package.json` to `desktop/package.json`, `core/package.json`, `cli/package.json`, `@types/node`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **What connects `forgestack-desktop` to the rest of the system?**
  _1 weakly-connected nodes found - possible missing edges._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08470588235294117 - nodes in this community are weakly interconnected._
- **Why does `ProjectConfig` connect `ProjectConfig` to `App.tsx`, `cli.ts`, `DragDropConfigurator.tsx`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Should `cli.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09024390243902439 - nodes in this community are weakly interconnected._
- **Why does `react` connect `App.tsx` to `desktop/package.json`, `DragDropConfigurator.tsx`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Should `desktop/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05333333333333334 - nodes in this community are weakly interconnected._