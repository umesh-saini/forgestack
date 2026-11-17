# Graph Report - project-setup  (2026-11-17)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 443 nodes · 962 edges · 28 communities (20 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `22dd938c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 25
- Community 27

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

## Communities (28 total, 8 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.17
Nodes (20): FeatureSlice, DEPENDENCY_REGISTRY, getPinnedVersion(), PackageName, resolveDependencies(), cleanModularBackendSlice, dockerSlice, mongodbSlice (+12 more)

### Community 1 - "Community 1"
Cohesion: 0.08
Nodes (34): ArchitectureTopology, TreeNode, App(), Badge(), BadgeProps, BadgeVariant, variantStyles, ExecutionConsole() (+26 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (17): createCli(), runInteractiveWizard(), CliReporter, RecipeCompositor, createProjectPipeline(), generateProjectVfs(), FlushOptions, FlushResult (+9 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (38): dependencies, clsx@^2.1.1, lucide-react@^0.475.0, react@^19.0.0, react-dom@^19.0.0, tailwind-merge@^3.0.1, @tauri-apps/api@^2.2.0, @tauri-apps/plugin-dialog@^2.2.0 (+30 more)

### Community 4 - "Community 4"
Cohesion: 0.15
Nodes (33): CursorRulesIcon(), DockerIcon(), DrizzleIcon(), ExpressIcon(), FastifyIcon(), HonoIcon(), IconProps, LucideIcon() (+25 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (27): name, runs-on, steps, jobs, e2e-matrix, test, node-version, name (+19 more)

### Community 6 - "Community 6"
Cohesion: 0.07
Nodes (24): compilerOptions, outDir, rootDir, extends, include, ../../tsconfig.json, compilerOptions, outDir (+16 more)

### Community 7 - "Community 7"
Cohesion: 0.11
Nodes (9): AppendFileAction, CreateFileAction, DeleteFileAction, FileAction, FileActionType, MergeJsonAction, OverwriteFileAction, PatchAstAction (+1 more)

### Community 8 - "Community 8"
Cohesion: 0.11
Nodes (18): app, security, windows, build, beforeBuildCommand, beforeDevCommand, devUrl, frontendDist (+10 more)

### Community 9 - "Community 9"
Cohesion: 0.13
Nodes (15): import, types, dependencies, zod@^3.24.2, exports, ./browser, main, name (+7 more)

### Community 10 - "Community 10"
Cohesion: 0.16
Nodes (13): description, devDependencies, @types/node@^22.13.4, typescript@^5.7.3, vitest@^3.0.5, files, @types/node, vitest (+5 more)

### Community 11 - "Community 11"
Cohesion: 0.14
Nodes (13): compilerOptions, declaration, declarationMap, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, noImplicitAny (+5 more)

### Community 12 - "Community 12"
Cohesion: 0.20
Nodes (11): devDependencies, typescript@^5.7.3, vitest@^3.0.5, typescript, vitest, name, packageManager, private (+3 more)

### Community 13 - "Community 13"
Cohesion: 0.20
Nodes (10): scripts, build, cli:dev, desktop:build, desktop:dev, desktop:web, lint, test (+2 more)

### Community 14 - "Community 14"
Cohesion: 0.31
Nodes (5): PathValidationResult, scaffold_project_files(), ScaffoldPayload, validate_target_path(), VirtualFilePayload

### Community 15 - "Community 15"
Cohesion: 0.25
Nodes (8): dependencies, @clack/prompts@^0.9.1, commander@^13.1.0, @forgestack/core@workspace:*, picocolors@^1.1.1, @forgestack/core, @forgestack/core@workspace:*, commander

### Community 16 - "Community 16"
Cohesion: 0.62
Nodes (5): deepEquals(), deepMergeJson(), isPlainObject(), mergePackageJson(), sortKeys()

### Community 18 - "Community 18"
Cohesion: 0.40
Nodes (5): devDependencies, @types/node@^22.13.4, typescript@^5.7.3, vitest@^3.0.5, vitest

### Community 20 - "Community 20"
Cohesion: 0.67
Nodes (3): bin, create-forgestack-app, forgestack

### Community 21 - "Community 21"
Cohesion: 0.67
Nodes (3): scripts, build, test

## Knowledge Gaps
- **1 isolated node(s):** `forgestack-desktop`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 146 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `typescript` connect `Community 12` to `Community 3`, `Community 9`, `Community 10`, `Community 18`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **What connects `forgestack-desktop` to the rest of the system?**
  _1 weakly-connected nodes found - possible missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.08470588235294117 - nodes in this community are weakly interconnected._
- **Why does `ProjectConfig` connect `Community 0` to `Community 1`, `Community 2`, `Community 4`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.08383838383838384 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Community 1` to `Community 3`, `Community 4`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.06882591093117409 - nodes in this community are weakly interconnected._