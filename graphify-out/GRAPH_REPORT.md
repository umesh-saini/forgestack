# Graph Report - project-setup  (2026-11-18)

## Corpus Check
- 174 files · ~201,587 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 6, .ico 2, .xml 2)

## Summary
- 793 nodes · 1874 edges · 45 communities (35 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `79a7976d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ProjectConfig
- App.tsx
- cli.ts
- desktop/package.json
- TechIcons.tsx
- steps
- compilerOptions
- types.ts
- tauri.conf.json
- updaterService.ts
- cli/package.json
- compilerOptions
- steps
- Badge.tsx
- fs.rs
- .openspec.yaml
- json-merge.ts
- package.json
- default.json
- create-forgestack-app.js
- tasks
- scripts
- pnpm-workspace.yaml
- forgestack-desktop
- with
- VsCodeWorkspace.tsx
- StepperWizard.tsx
- dependencies
- typescript
- 2026-11-17-nextgen-archetypes-primitives-and-ai-mcp-enhancements/.openspec.yaml
- core/package.json
- 2026-11-18-cli-openspec-ui-templates-and-nextjs-ux/.openspec.yaml
- ./browser
- scripts
- lucide-react
- ScaffoldConsoleView.tsx
- 2026-11-18-universal-ai-skills-mcp-and-interactive-landing/.openspec.yaml
- bin
- FileViewerModal.tsx

## God Nodes (most connected - your core abstractions)
1. `VirtualFileSystem` - 72 edges
2. `ProjectConfig` - 69 edges
3. `react` - 41 edges
4. `lucide-react` - 36 edges
5. `FeatureSlice` - 33 edges
6. `DragDropConfigurator()` - 26 edges
7. `DEPENDENCY_REGISTRY` - 23 edges
8. `generateProjectVfs()` - 22 edges
9. `ForgeStackAppContent()` - 18 edges
10. `createCli()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `scaffoldApiPlugin()` --calls--> `generateProjectVfs()`  [EXTRACTED]
  packages/desktop/vite.config.ts → packages/core/src/engine/create-pipeline.ts
- `createCli()` --calls--> `generateProjectVfs()`  [EXTRACTED]
  packages/cli/src/cli.ts → packages/core/src/engine/create-pipeline.ts
- `createMcpServer()` --calls--> `generateProjectVfs()`  [EXTRACTED]
  packages/cli/src/mcp/server.ts → packages/core/src/engine/create-pipeline.ts
- `ForgeStackAppContent()` --calls--> `generateProjectVfs()`  [EXTRACTED]
  packages/desktop/src/App.tsx → packages/core/src/engine/create-pipeline.ts
- `ForgeStackAppContent()` --calls--> `FastScaffoldModal()`  [EXTRACTED]
  packages/desktop/src/App.tsx → packages/desktop/src/components/home/FastScaffoldModal.tsx

## Import Cycles
- None detected.

## Communities (45 total, 10 thin omitted)

### Community 0 - "ProjectConfig"
Cohesion: 0.08
Nodes (43): FeatureSlice, RecipeCompositor, createProjectPipeline(), generateProjectVfs(), DEPENDENCY_REGISTRY, getPinnedVersion(), PackageName, resolveDependencies() (+35 more)

### Community 1 - "App.tsx"
Cohesion: 0.14
Nodes (16): App(), FastScaffoldModal(), Props, HomeTemplatesDashboard(), Props, Props, StudioNavbar(), AppSettings (+8 more)

### Community 2 - "cli.ts"
Cohesion: 0.06
Nodes (33): createCli(), createMcpServer(), runMcpServer(), runInteractiveWizard(), CURATED_TEMPLATES, CuratedTemplate, findCuratedTemplate(), SavedCustomTemplate (+25 more)

### Community 3 - "desktop/package.json"
Cohesion: 0.06
Nodes (43): dependencies, clsx@^2.1.1, lucide-react@^0.475.0, @monaco-editor/react@^4.7.0, react@^19.0.0, react-dom@^19.0.0, react-router-dom@^7.18.5, tailwind-merge@^3.0.1 (+35 more)

### Community 4 - "TechIcons.tsx"
Cohesion: 0.13
Nodes (41): ClaudeIcon(), CursorRulesIcon(), DockerIcon(), DrizzleIcon(), ElectronIcon(), ExpressIcon(), FastifyIcon(), HonoIcon() (+33 more)

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
Cohesion: 0.08
Nodes (24): app, security, windows, build, beforeBuildCommand, beforeDevCommand, devUrl, frontendDist (+16 more)

### Community 9 - "updaterService.ts"
Cohesion: 0.19
Nodes (16): @tauri-apps/plugin-shell@^2.2.0, ForgeStackAppContent(), Props, UpdateModal(), PathSelectorModal(), checkForUpdates(), downloadAndInstallUpdate(), DownloadProgress (+8 more)

### Community 10 - "cli/package.json"
Cohesion: 0.18
Nodes (12): description, devDependencies, typescript@^5.7.3, vitest@^3.0.5, files, typescript, vitest, main (+4 more)

### Community 11 - "compilerOptions"
Cohesion: 0.14
Nodes (13): compilerOptions, declaration, declarationMap, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, noImplicitAny (+5 more)

### Community 12 - "steps"
Cohesion: 0.09
Nodes (22): NODE_AUTH_TOKEN, jobs, publish, name, on, push, contents, id-token (+14 more)

### Community 13 - "Badge.tsx"
Cohesion: 0.12
Nodes (11): Badge(), BadgeProps, BadgeVariant, variantStyles, Props, Props, Props, Props (+3 more)

### Community 14 - "fs.rs"
Cohesion: 0.17
Nodes (8): AppEnvironment, get_app_environment(), PathValidationResult, pick_directory(), scaffold_project_files(), ScaffoldPayload, validate_target_path(), VirtualFilePayload

### Community 15 - ".openspec.yaml"
Cohesion: 0.50
Nodes (3): date, name, schema

### Community 16 - "json-merge.ts"
Cohesion: 0.62
Nodes (5): deepEquals(), deepMergeJson(), isPlainObject(), mergePackageJson(), sortKeys()

### Community 17 - "package.json"
Cohesion: 0.08
Nodes (31): dependencies, @modelcontextprotocol/sdk@^1.32.2, devDependencies, eslint@^10.15.0, @eslint/js@^10.0.1, turbo@^2.11.12, typescript@^5.7.3, typescript-eslint@^8.73.0 (+23 more)

### Community 18 - "default.json"
Cohesion: 0.33
Nodes (5): description, identifier, permissions, $schema, windows

### Community 20 - "tasks"
Cohesion: 0.13
Nodes (14): dependsOn, outputs, outputs, $schema, tasks, build, lint, test (+6 more)

### Community 21 - "scripts"
Cohesion: 0.50
Nodes (4): scripts, build, prepack, test

### Community 28 - "with"
Cohesion: 0.05
Nodes (37): GITHUB_TOKEN, TAURI_SIGNING_PRIVATE_KEY, TAURI_SIGNING_PRIVATE_KEY_PASSWORD, args, platform, jobs, release, include (+29 more)

### Community 29 - "VsCodeWorkspace.tsx"
Cohesion: 0.18
Nodes (16): getFileIcon(), JsonIcon(), FileEditorDrawer(), getMonacoLanguage(), Props, FileTreePreview(), filterTree(), Props (+8 more)

### Community 30 - "StepperWizard.tsx"
Cohesion: 0.24
Nodes (9): Step1IdentityArchetype(), Props, Step4ReviewScaffold(), Props, StepperWizard(), CommunicationChannel, Props, TopologyNode (+1 more)

### Community 31 - "dependencies"
Cohesion: 0.20
Nodes (10): dependencies, @clack/prompts@^0.9.1, commander@^13.1.0, @forgestack/core@workspace:*, @modelcontextprotocol/sdk@^1.32.2, picocolors@^1.1.1, @modelcontextprotocol/sdk, @forgestack/core@workspace:* (+2 more)

### Community 32 - "typescript"
Cohesion: 0.25
Nodes (8): @types/node@^22.13.4, devDependencies, @types/node@^22.13.4, typescript@^5.7.3, vitest@^3.0.5, typescript@^5.7.3, @types/node, typescript

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

### Community 38 - "lucide-react"
Cohesion: 0.12
Nodes (21): ChangelogTimeline(), ReleaseItem, RELEASES, CompetitorMatrix(), MATRIX_DATA, Row, DesktopAppShowcase(), DownloadInstallHub() (+13 more)

### Community 39 - "ScaffoldConsoleView.tsx"
Cohesion: 0.24
Nodes (5): ExecutionConsole(), Props, Props, ScaffoldConsoleView(), Props

### Community 40 - "2026-11-18-universal-ai-skills-mcp-and-interactive-landing/.openspec.yaml"
Cohesion: 0.50
Nodes (3): date, name, schema

### Community 41 - "bin"
Cohesion: 0.50
Nodes (4): bin, create-forgestack-app, forgestack, forgestack-mcp

## Knowledge Gaps
- **1 isolated node(s):** `forgestack-desktop`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 276 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Badge.tsx` to `App.tsx`, `desktop/package.json`, `TechIcons.tsx`, `lucide-react`, `ScaffoldConsoleView.tsx`, `updaterService.ts`, `FileViewerModal.tsx`, `VsCodeWorkspace.tsx`, `StepperWizard.tsx`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **What connects `forgestack-desktop` to the rest of the system?**
  _1 weakly-connected nodes found - possible missing edges._
- **Should `ProjectConfig` be split into smaller, more focused modules?**
  _Cohesion score 0.08143409302945488 - nodes in this community are weakly interconnected._
- **Why does `ProjectConfig` connect `ProjectConfig` to `App.tsx`, `cli.ts`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14153846153846153 - nodes in this community are weakly interconnected._
- **Why does `VirtualFileSystem` connect `ProjectConfig` to `App.tsx`, `cli.ts`, `types.ts`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Should `cli.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06106442577030812 - nodes in this community are weakly interconnected._