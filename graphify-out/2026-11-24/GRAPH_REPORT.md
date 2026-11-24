# Graph Report - project-setup  (2026-11-24)

## Corpus Check
- 322 files · ~210,680 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 6, .ico 2, .xml 2)

## Summary
- 990 nodes · 2245 edges · 46 communities (35 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Core Scaffolding Engine & Slices
- Desktop Studio UI Shell & Layout
- Desktop Wizard Step Components & Badges
- ForgeStack CLI & Template Store
- Standalone Website & Documentation UI
- E2E Combination Matrix & Runtime Testing
- Desktop Auto-Updater & Process Services
- Desktop Ecosystem & Tech Icons
- Desktop File Tree & Editor Drawer Preview
- Virtual File System & File Actions
- Desktop App State & Modal Flows
- JSON Merge & Utility Functions
- Tauri Native File System Commands
- CLI Package Dependencies & Binaries
- Root TypeScript Configuration
- Publish Release Workflow
- Desktop Package Dependencies
- Root Monorepo Tooling & Dependencies
- Tauri Security & Permissions Capabilities
- CLI Executable Entrypoint
- Turborepo Pipeline Configuration
- Pnpm Workspace Configuration
- Tauri Cargo Package Definition
- Desktop Release Workflow & Signing
- OpenSpec Multi-Framework Spec Archive
- Website Deployment Workflow
- Website Package Dependencies
- OpenSpec NextGen Archetypes Spec Archive
- Core Engine Package Configuration
- OpenSpec CLI & UI Templates Spec Archive
- Website TypeScript Configuration
- CLI TypeScript Configuration
- Core TypeScript Configuration
- OpenSpec Standalone Website Change
- OpenSpec Universal AI Skills Spec
- Template Verification Script
- CI Workflow & Matrix Testing
- Desktop TypeScript Configuration
- Tauri Desktop App Configuration

## God Nodes (most connected - your core abstractions)
1. `ProjectConfig` - 108 edges
2. `VirtualFileSystem` - 73 edges
3. `FeatureSlice` - 35 edges
4. `DragDropConfigurator()` - 26 edges
5. `generateProjectVfs()` - 25 edges
6. `DEPENDENCY_REGISTRY` - 25 edges
7. `createCli()` - 20 edges
8. `ForgeStackAppContent()` - 19 edges
9. `layoutFor()` - 16 edges
10. `CodePatcher` - 15 edges

## Surprising Connections (you probably didn't know these)
- `sweep()` --calls--> `generateProjectVfs()`  [EXTRACTED]
  tests/e2e/combination-matrix.test.ts → packages/core/src/engine/create-pipeline.ts
- `sweep()` --calls--> `normalizeConfig()`  [EXTRACTED]
  tests/e2e/combination-matrix.test.ts → packages/core/src/types/config.ts
- `Props` --references--> `ProjectConfig`  [EXTRACTED]
  packages/desktop/src/components/home/ScaffoldConsoleView.tsx → packages/core/src/types/config.ts
- `Props` --references--> `ProjectConfig`  [EXTRACTED]
  packages/desktop/src/components/wizard/AiGovernance.tsx → packages/core/src/types/config.ts
- `Props` --references--> `ProjectConfig`  [EXTRACTED]
  packages/desktop/src/components/wizard/BackendGrid.tsx → packages/core/src/types/config.ts

## Import Cycles
- None detected.

## Communities (46 total, 11 thin omitted)

### Community 0 - "Core Scaffolding Engine & Slices"
Cohesion: 0.07
Nodes (55): FeatureSlice, RecipeCompositor, PackageName, ProjectConfig, CodePatcher, ProjectLayout, VirtualFileSystem, createProjectPipeline() (+47 more)

### Community 1 - "Desktop Studio UI Shell & Layout"
Cohesion: 0.16
Nodes (15): Props, Props, Props, Props, CommunicationChannel, Props, TopologyNode, ExecutionConsole() (+7 more)

### Community 13 - "Desktop Wizard Step Components & Badges"
Cohesion: 0.10
Nodes (15): ArchitectureTopology, BadgeProps, BadgeVariant, FileViewerModalProps, Props, Props, Props, Props (+7 more)

### Community 2 - "ForgeStack CLI & Template Store"
Cohesion: 0.05
Nodes (40): CuratedTemplate, SavedCustomTemplate, TemplateConfig, TemplateStore, CliReporter, SearchableItem, SearchableMultiselectOptions, CliSplash (+32 more)

### Community 21 - "Standalone Website & Documentation UI"
Cohesion: 0.08
Nodes (30): AnySchema, Release, App(), CodeBlock(), CopyButton(), GitHubMark(), Section(), sub() (+22 more)

### Community 3 - "E2E Combination Matrix & Runtime Testing"
Cohesion: 0.07
Nodes (41): Choice, checkProject(), parseJson(), pkgNameOf(), createPgDb(), freePort(), hasSql(), http() (+33 more)

### Community 30 - "Desktop Auto-Updater & Process Services"
Cohesion: 0.25
Nodes (9): Props, Props, AppEnvironment, DownloadProgress, UpdateDetails, UpdateModal(), downloadAndInstallUpdate(), openExternalUrl() (+1 more)

### Community 4 - "Desktop Ecosystem & Tech Icons"
Cohesion: 0.13
Nodes (41): IconProps, PaletteCategory, PaletteItem, Props, Props, Props, ClaudeIcon(), CursorRulesIcon() (+33 more)

### Community 46 - "Desktop File Tree & Editor Drawer Preview"
Cohesion: 0.19
Nodes (17): TreeNode, Props, Props, TreeItemProps, Props, Props, ThemeId, getFileIcon() (+9 more)

### Community 7 - "Virtual File System & File Actions"
Cohesion: 0.11
Nodes (9): AppendFileAction, CreateFileAction, DeleteFileAction, FileAction, FileActionType, MergeJsonAction, OverwriteFileAction, PatchAstAction (+1 more)

### Community 9 - "Desktop App State & Modal Flows"
Cohesion: 0.14
Nodes (19): Props, Props, AppSettings, Props, SavedTemplate, App(), ForgeStackAppContent(), FastScaffoldModal() (+11 more)

### Community 16 - "JSON Merge & Utility Functions"
Cohesion: 0.62
Nodes (5): deepEquals(), deepMergeJson(), isPlainObject(), mergePackageJson(), sortKeys()

### Community 14 - "Tauri Native File System Commands"
Cohesion: 0.17
Nodes (8): AppEnvironment, PathValidationResult, ScaffoldPayload, VirtualFilePayload, get_app_environment(), pick_directory(), scaffold_project_files(), validate_target_path()

### Community 10 - "CLI Package Dependencies & Binaries"
Cohesion: 0.07
Nodes (31): bin, create-forgestack-app, forgestack, forgestack-mcp, dependencies, @clack/prompts@^0.9.1, commander@^13.1.0, @forgestack/core@workspace:* (+23 more)

### Community 11 - "Root TypeScript Configuration"
Cohesion: 0.14
Nodes (13): compilerOptions, declaration, declarationMap, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, noImplicitAny (+5 more)

### Community 12 - "Publish Release Workflow"
Cohesion: 0.09
Nodes (22): NODE_AUTH_TOKEN, jobs, publish, name, on, push, contents, id-token (+14 more)

### Community 15 - "Desktop Package Dependencies"
Cohesion: 0.05
Nodes (52): dependencies, clsx@^2.1.1, @forgestack/core@workspace:*, jszip@^3.10.2, lucide-react@^0.475.0, @monaco-editor/react@^4.7.0, react@^19.0.0, react-dom@^19.0.0 (+44 more)

### Community 17 - "Root Monorepo Tooling & Dependencies"
Cohesion: 0.07
Nodes (34): dependencies, @modelcontextprotocol/sdk@^1.32.2, devDependencies, eslint@^10.15.0, @eslint/js@^10.0.1, turbo@^2.11.12, typescript@^5.7.3, typescript-eslint@^8.73.0 (+26 more)

### Community 18 - "Tauri Security & Permissions Capabilities"
Cohesion: 0.33
Nodes (5): description, identifier, permissions, $schema, windows

### Community 20 - "Turborepo Pipeline Configuration"
Cohesion: 0.13
Nodes (14): dependsOn, outputs, outputs, $schema, tasks, build, lint, test (+6 more)

### Community 28 - "Desktop Release Workflow & Signing"
Cohesion: 0.05
Nodes (37): GITHUB_TOKEN, TAURI_SIGNING_PRIVATE_KEY, TAURI_SIGNING_PRIVATE_KEY_PASSWORD, args, platform, jobs, release, include (+29 more)

### Community 29 - "OpenSpec Multi-Framework Spec Archive"
Cohesion: 0.50
Nodes (3): date, name, schema

### Community 31 - "Website Deployment Workflow"
Cohesion: 0.06
Nodes (35): runs-on, steps, concurrency, cancel-in-progress, group, environment, needs, runs-on (+27 more)

### Community 32 - "Website Package Dependencies"
Cohesion: 0.08
Nodes (33): dependencies, @forgestack/core@workspace:*, lucide-react@^0.475.0, react@^19.0.0, react-dom@^19.0.0, description, devDependencies, tailwindcss@^4.0.0 (+25 more)

### Community 33 - "OpenSpec NextGen Archetypes Spec Archive"
Cohesion: 0.50
Nodes (3): date, name, schema

### Community 34 - "Core Engine Package Configuration"
Cohesion: 0.09
Nodes (24): import, types, dependencies, zod@^3.24.2, devDependencies, @types/node@^22.13.4, typescript@^5.7.3, vitest@^3.0.5 (+16 more)

### Community 35 - "OpenSpec CLI & UI Templates Spec Archive"
Cohesion: 0.50
Nodes (3): date, name, schema

### Community 36 - "Website TypeScript Configuration"
Cohesion: 0.13
Nodes (14): compilerOptions, isolatedModules, jsx, lib, module, moduleDetection, moduleResolution, noEmit (+6 more)

### Community 37 - "CLI TypeScript Configuration"
Cohesion: 0.29
Nodes (6): compilerOptions, outDir, rootDir, extends, include, ../../tsconfig.json

### Community 38 - "Core TypeScript Configuration"
Cohesion: 0.29
Nodes (6): compilerOptions, outDir, rootDir, extends, include, ../../tsconfig.json

### Community 39 - "OpenSpec Standalone Website Change"
Cohesion: 0.50
Nodes (3): date, name, schema

### Community 40 - "OpenSpec Universal AI Skills Spec"
Cohesion: 0.50
Nodes (3): date, name, schema

### Community 5 - "CI Workflow & Matrix Testing"
Cohesion: 0.06
Nodes (41): name, runs-on, steps, jobs, e2e-matrix, runtime-matrix, static-matrix, test (+33 more)

### Community 6 - "Desktop TypeScript Configuration"
Cohesion: 0.13
Nodes (14): compilerOptions, isolatedModules, jsx, lib, module, moduleDetection, moduleResolution, noEmit (+6 more)

### Community 8 - "Tauri Desktop App Configuration"
Cohesion: 0.08
Nodes (24): app, security, windows, build, beforeBuildCommand, beforeDevCommand, devUrl, frontendDist (+16 more)

## Knowledge Gaps
- **5 isolated node(s):** `forgestack-desktop`, `../../tsconfig.json`, `../../tsconfig.json`, `../../tsconfig.json`, `../../tsconfig.json`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 360 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ProjectConfig` connect `Core Scaffolding Engine & Slices` to `Desktop Studio UI Shell & Layout`, `ForgeStack CLI & Template Store`, `E2E Combination Matrix & Runtime Testing`, `Desktop Ecosystem & Tech Icons`, `Desktop App State & Modal Flows`, `Desktop Wizard Step Components & Badges`, `Desktop File Tree & Editor Drawer Preview`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **What connects `forgestack-desktop`, `../../tsconfig.json`, `../../tsconfig.json` to the rest of the system?**
  _5 weakly-connected nodes found - possible missing edges._
- **Should `Core Scaffolding Engine & Slices` be split into smaller, more focused modules?**
  _Cohesion score 0.0722507708119219 - nodes in this community are weakly interconnected._
- **Why does `react-router-dom` connect `Desktop Studio UI Shell & Layout` to `Desktop App State & Modal Flows`, `Desktop Package Dependencies`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Should `Desktop Wizard Step Components & Badges` be split into smaller, more focused modules?**
  _Cohesion score 0.1028225806451613 - nodes in this community are weakly interconnected._
- **Why does `generateProjectVfs()` connect `Core Scaffolding Engine & Slices` to `Desktop App State & Modal Flows`, `ForgeStack CLI & Template Store`, `E2E Combination Matrix & Runtime Testing`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Should `ForgeStack CLI & Template Store` be split into smaller, more focused modules?**
  _Cohesion score 0.0546984572230014 - nodes in this community are weakly interconnected._