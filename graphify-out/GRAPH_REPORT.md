# Graph Report - project-setup  (2026-11-18)

## Corpus Check
- 145 files · ~178,900 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 4, .css 1)

## Summary
- 614 nodes · 1576 edges · 38 communities (30 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6b51a671`
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
- scripts
- cli/package.json
- compilerOptions
- VsCodeWorkspace.tsx
- Badge.tsx
- fs.rs
- .openspec.yaml
- json-merge.ts
- lucide-react
- default.json
- create-forgestack-app.js
- ScaffoldConsoleView.tsx
- scripts
- pnpm-workspace.yaml
- forgestack-desktop
- StudioNavbar.tsx
- dependencies
- CodePatcher
- Step4ReviewScaffold.tsx
- typescript
- 2026-11-17-nextgen-archetypes-primitives-and-ai-mcp-enhancements/.openspec.yaml
- core/package.json
- 2026-11-18-cli-openspec-ui-templates-and-nextjs-ux/.openspec.yaml
- ./browser
- scripts

## God Nodes (most connected - your core abstractions)
1. `ProjectConfig` - 87 edges
2. `VirtualFileSystem` - 67 edges
3. `vitest` - 42 edges
4. `FeatureSlice` - 31 edges
5. `react` - 30 edges
6. `DragDropConfigurator()` - 26 edges
7. `lucide-react` - 26 edges
8. `DEPENDENCY_REGISTRY` - 22 edges
9. `generateProjectVfs()` - 16 edges
10. `CodePatcher` - 14 edges

## Surprising Connections (you probably didn't know these)
- `vitest@^3.0.5` --declares--> `vitest`  [EXTRACTED]
  packages/cli/package.json → packages/core/package.json
- `Props` --references--> `ProjectConfig`  [EXTRACTED]
  packages/desktop/src/components/home/ScaffoldConsoleView.tsx → packages/core/src/types/config.ts
- `Props` --references--> `ProjectConfig`  [EXTRACTED]
  packages/desktop/src/components/wizard/AiGovernance.tsx → packages/core/src/types/config.ts
- `Props` --references--> `ProjectConfig`  [EXTRACTED]
  packages/desktop/src/components/wizard/BackendGrid.tsx → packages/core/src/types/config.ts
- `PaletteItem` --references--> `ProjectConfig`  [EXTRACTED]
  packages/desktop/src/components/wizard/DragDropConfigurator.tsx → packages/core/src/types/config.ts

## Import Cycles
- None detected.

## Communities (38 total, 8 thin omitted)

### Community 0 - "ProjectConfig"
Cohesion: 0.10
Nodes (40): FeatureSlice, RecipeCompositor, createProjectPipeline(), generateProjectVfs(), DEPENDENCY_REGISTRY, getPinnedVersion(), PackageName, resolveDependencies() (+32 more)

### Community 1 - "App.tsx"
Cohesion: 0.18
Nodes (12): App(), ForgeStackAppContent(), FastScaffoldModal(), Props, HomeTemplatesDashboard(), AppSettings, AppSettingsPage(), DEFAULT_APP_SETTINGS (+4 more)

### Community 2 - "cli.ts"
Cohesion: 0.08
Nodes (21): createCli(), runInteractiveWizard(), CURATED_TEMPLATES, CuratedTemplate, findCuratedTemplate(), SavedCustomTemplate, TemplateConfig, TemplateStore (+13 more)

### Community 3 - "desktop/package.json"
Cohesion: 0.05
Nodes (40): ProcessResult, ProcessRunner, ProcessRunOptions, dependencies, clsx@^2.1.1, lucide-react@^0.475.0, @monaco-editor/react@^4.7.0, react@^19.0.0 (+32 more)

### Community 4 - "DragDropConfigurator.tsx"
Cohesion: 0.14
Nodes (38): CursorRulesIcon(), DockerIcon(), DrizzleIcon(), ElectronIcon(), ExpressIcon(), FastifyIcon(), HonoIcon(), IconProps (+30 more)

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

### Community 9 - "scripts"
Cohesion: 0.10
Nodes (20): devDependencies, typescript@^5.7.3, vitest@^3.0.5, typescript, vitest, name, packageManager, private (+12 more)

### Community 10 - "cli/package.json"
Cohesion: 0.18
Nodes (10): bin, create-forgestack-app, forgestack, description, files, main, name, type (+2 more)

### Community 11 - "compilerOptions"
Cohesion: 0.14
Nodes (13): compilerOptions, declaration, declarationMap, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, noImplicitAny (+5 more)

### Community 12 - "VsCodeWorkspace.tsx"
Cohesion: 0.16
Nodes (18): getFileIcon(), JsonIcon(), Props, FileEditorDrawer(), getMonacoLanguage(), Props, FileTreePreview(), filterTree() (+10 more)

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

### Community 17 - "lucide-react"
Cohesion: 0.18
Nodes (11): ClaudeIcon(), FileViewerModalProps, Props, Props, Step1IdentityArchetype(), Props, Step3ToolingGovernance(), Props (+3 more)

### Community 18 - "default.json"
Cohesion: 0.33
Nodes (5): description, identifier, permissions, $schema, windows

### Community 20 - "ScaffoldConsoleView.tsx"
Cohesion: 0.25
Nodes (6): @tauri-apps/api@^2.2.0, @tauri-apps/plugin-dialog@^2.2.0, PathSelectorModal(), Props, @tauri-apps/api, @tauri-apps/plugin-dialog

### Community 21 - "scripts"
Cohesion: 0.50
Nodes (4): scripts, build, prepack, test

### Community 28 - "StudioNavbar.tsx"
Cohesion: 0.40
Nodes (4): react-router-dom@^7.18.5, Props, StudioNavbar(), react-router-dom

### Community 29 - "dependencies"
Cohesion: 0.25
Nodes (8): dependencies, @clack/prompts@^0.9.1, commander@^13.1.0, @forgestack/core@workspace:*, picocolors@^1.1.1, @forgestack/core@workspace:*, commander, @forgestack/core

### Community 31 - "Step4ReviewScaffold.tsx"
Cohesion: 0.19
Nodes (10): ExecutionConsole(), Props, Props, ScaffoldConsoleView(), Props, Step4ReviewScaffold(), CommunicationChannel, Props (+2 more)

### Community 32 - "typescript"
Cohesion: 0.20
Nodes (11): devDependencies, @types/node@^22.13.4, typescript@^5.7.3, vitest@^3.0.5, devDependencies, @types/node@^22.13.4, typescript@^5.7.3, vitest@^3.0.5 (+3 more)

### Community 33 - "2026-11-17-nextgen-archetypes-primitives-and-ai-mcp-enhancements/.openspec.yaml"
Cohesion: 0.50
Nodes (3): date, name, schema

### Community 34 - "core/package.json"
Cohesion: 0.22
Nodes (9): dependencies, zod@^3.24.2, files, main, name, type, types, version (+1 more)

### Community 35 - "2026-11-18-cli-openspec-ui-templates-and-nextjs-ux/.openspec.yaml"
Cohesion: 0.50
Nodes (3): date, name, schema

### Community 36 - "./browser"
Cohesion: 0.50
Nodes (4): import, types, exports, ./browser

### Community 37 - "scripts"
Cohesion: 0.50
Nodes (4): scripts, build, prepack, test

## Knowledge Gaps
- **1 isolated node(s):** `forgestack-desktop`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 192 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ProjectConfig` connect `ProjectConfig` to `App.tsx`, `cli.ts`, `DragDropConfigurator.tsx`, `VsCodeWorkspace.tsx`, `Badge.tsx`, `lucide-react`, `Step4ReviewScaffold.tsx`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **What connects `forgestack-desktop` to the rest of the system?**
  _1 weakly-connected nodes found - possible missing edges._
- **Should `ProjectConfig` be split into smaller, more focused modules?**
  _Cohesion score 0.09741451209341118 - nodes in this community are weakly interconnected._
- **Why does `vitest` connect `ProjectConfig` to `typescript`, `cli.ts`, `core/package.json`, `cli/package.json`, `json-merge.ts`, `CodePatcher`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Should `cli.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0825136612021858 - nodes in this community are weakly interconnected._
- **Why does `react` connect `lucide-react` to `App.tsx`, `desktop/package.json`, `DragDropConfigurator.tsx`, `VsCodeWorkspace.tsx`, `Badge.tsx`, `ScaffoldConsoleView.tsx`, `StudioNavbar.tsx`, `Step4ReviewScaffold.tsx`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Should `desktop/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.0549645390070922 - nodes in this community are weakly interconnected._