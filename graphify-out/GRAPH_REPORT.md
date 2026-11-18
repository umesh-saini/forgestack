# Graph Report - project-setup  (2026-11-18)

## Corpus Check
- 145 files · ~175,158 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 4, .css 1)

## Summary
- 613 nodes · 1572 edges · 35 communities (27 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a8f227d3`
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
- dependencies
- dependencies
- CodePatcher
- vite.config.ts
- 2026-11-18-cli-openspec-ui-templates-and-nextjs-ux/.openspec.yaml
- 2026-11-17-nextgen-archetypes-primitives-and-ai-mcp-enhancements/.openspec.yaml
- scripts

## God Nodes (most connected - your core abstractions)
1. `ProjectConfig` - 87 edges
2. `VirtualFileSystem` - 67 edges
3. `vitest` - 40 edges
4. `FeatureSlice` - 31 edges
5. `react` - 30 edges
6. `DragDropConfigurator()` - 26 edges
7. `lucide-react` - 26 edges
8. `DEPENDENCY_REGISTRY` - 22 edges
9. `generateProjectVfs()` - 16 edges
10. `CodePatcher` - 14 edges

## Surprising Connections (you probably didn't know these)
- `Props` --references--> `ProjectConfig`  [EXTRACTED]
  packages/desktop/src/components/home/ScaffoldConsoleView.tsx → packages/core/src/types/config.ts
- `Props` --references--> `ProjectConfig`  [EXTRACTED]
  packages/desktop/src/components/wizard/AiGovernance.tsx → packages/core/src/types/config.ts
- `Props` --references--> `ProjectConfig`  [EXTRACTED]
  packages/desktop/src/components/wizard/BackendGrid.tsx → packages/core/src/types/config.ts
- `PaletteItem` --references--> `ProjectConfig`  [EXTRACTED]
  packages/desktop/src/components/wizard/DragDropConfigurator.tsx → packages/core/src/types/config.ts
- `Props` --references--> `ProjectConfig`  [EXTRACTED]
  packages/desktop/src/components/wizard/DragDropConfigurator.tsx → packages/core/src/types/config.ts

## Import Cycles
- None detected.

## Communities (35 total, 8 thin omitted)

### Community 0 - "ProjectConfig"
Cohesion: 0.10
Nodes (40): FeatureSlice, RecipeCompositor, createProjectPipeline(), generateProjectVfs(), DEPENDENCY_REGISTRY, getPinnedVersion(), PackageName, resolveDependencies() (+32 more)

### Community 1 - "App.tsx"
Cohesion: 0.14
Nodes (17): App(), ForgeStackAppContent(), FastScaffoldModal(), Props, HomeTemplatesDashboard(), Props, Props, StudioNavbar() (+9 more)

### Community 2 - "cli.ts"
Cohesion: 0.07
Nodes (24): createCli(), runInteractiveWizard(), CURATED_TEMPLATES, CuratedTemplate, findCuratedTemplate(), SavedCustomTemplate, TemplateConfig, TemplateStore (+16 more)

### Community 3 - "desktop/package.json"
Cohesion: 0.17
Nodes (15): devDependencies, tailwindcss@^4.0.0, @tauri-apps/cli@^2.2.0, @types/react@^19.0.8, @types/react-dom@^19.0.3, @vitejs/plugin-react@^4.3.4, name, private (+7 more)

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
Cohesion: 0.05
Nodes (40): devDependencies, typescript@^5.7.3, vitest@^3.0.5, typescript, vitest, name, packageManager, private (+32 more)

### Community 10 - "cli/package.json"
Cohesion: 0.12
Nodes (17): bin, create-forgestack-app, forgestack, description, devDependencies, @types/node@^22.13.4, typescript@^5.7.3, vitest@^3.0.5 (+9 more)

### Community 11 - "compilerOptions"
Cohesion: 0.14
Nodes (13): compilerOptions, declaration, declarationMap, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, noImplicitAny (+5 more)

### Community 12 - "VsCodeWorkspace.tsx"
Cohesion: 0.18
Nodes (14): FileEditorDrawer(), getMonacoLanguage(), Props, FileTreePreview(), filterTree(), Props, TreeItem(), TreeItemProps (+6 more)

### Community 13 - "Badge.tsx"
Cohesion: 0.13
Nodes (11): ArchitectureTopology, Badge(), BadgeProps, BadgeVariant, variantStyles, FileViewerModalProps, Props, Props (+3 more)

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
Cohesion: 0.17
Nodes (12): Props, Props, Step1IdentityArchetype(), Props, Step4ReviewScaffold(), Props, StepperWizard(), CommunicationChannel (+4 more)

### Community 18 - "default.json"
Cohesion: 0.33
Nodes (5): description, identifier, permissions, $schema, windows

### Community 20 - "ScaffoldConsoleView.tsx"
Cohesion: 0.16
Nodes (10): @tauri-apps/api@^2.2.0, @tauri-apps/plugin-dialog@^2.2.0, ExecutionConsole(), Props, Props, ScaffoldConsoleView(), PathSelectorModal(), Props (+2 more)

### Community 21 - "scripts"
Cohesion: 0.50
Nodes (4): scripts, build, prepack, test

### Community 28 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, clsx@^2.1.1, lucide-react@^0.475.0, @monaco-editor/react@^4.7.0, react@^19.0.0, react-dom@^19.0.0, react-router-dom@^7.18.5, tailwind-merge@^3.0.1 (+5 more)

### Community 29 - "dependencies"
Cohesion: 0.25
Nodes (8): dependencies, @clack/prompts@^0.9.1, commander@^13.1.0, @forgestack/core@workspace:*, picocolors@^1.1.1, @forgestack/core@workspace:*, commander, @forgestack/core

### Community 31 - "vite.config.ts"
Cohesion: 0.25
Nodes (6): @tailwindcss/vite@^4.0.0, vite@^6.1.0, __dirname, scaffoldApiPlugin(), @tailwindcss/vite, vite

### Community 32 - "2026-11-18-cli-openspec-ui-templates-and-nextjs-ux/.openspec.yaml"
Cohesion: 0.50
Nodes (3): date, name, schema

### Community 33 - "2026-11-17-nextgen-archetypes-primitives-and-ai-mcp-enhancements/.openspec.yaml"
Cohesion: 0.50
Nodes (3): date, name, schema

### Community 34 - "scripts"
Cohesion: 0.50
Nodes (4): scripts, build, dev, tauri

## Knowledge Gaps
- **1 isolated node(s):** `forgestack-desktop`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 191 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ProjectConfig` connect `ProjectConfig` to `App.tsx`, `cli.ts`, `DragDropConfigurator.tsx`, `VsCodeWorkspace.tsx`, `Badge.tsx`, `lucide-react`, `ScaffoldConsoleView.tsx`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **What connects `forgestack-desktop` to the rest of the system?**
  _1 weakly-connected nodes found - possible missing edges._
- **Should `ProjectConfig` be split into smaller, more focused modules?**
  _Cohesion score 0.09741451209341118 - nodes in this community are weakly interconnected._
- **Why does `zod` connect `core/package.json` to `ProjectConfig`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13793103448275862 - nodes in this community are weakly interconnected._
- **Why does `vitest` connect `ProjectConfig` to `json-merge.ts`, `cli/package.json`, `cli.ts`, `CodePatcher`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Should `cli.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06905370843989769 - nodes in this community are weakly interconnected._