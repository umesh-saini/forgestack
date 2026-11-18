# Graph Report - project-setup  (2026-11-18)

## Corpus Check
- 174 files · ~202,019 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 6, .ico 2, .xml 2)

## Summary
- 798 nodes · 1891 edges · 44 communities (35 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5c9a1e70`
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
- FastScaffoldModal.tsx
- StepperWizard.tsx
- dependencies
- typescript
- 2026-11-17-nextgen-archetypes-primitives-and-ai-mcp-enhancements/.openspec.yaml
- core/package.json
- 2026-11-18-cli-openspec-ui-templates-and-nextjs-ux/.openspec.yaml
- ./browser
- scripts
- lucide-react
- AppSettingsPage.tsx
- 2026-11-18-universal-ai-skills-mcp-and-interactive-landing/.openspec.yaml
- bin

## God Nodes (most connected - your core abstractions)
1. `VirtualFileSystem` - 71 edges
2. `ProjectConfig` - 68 edges
3. `react` - 41 edges
4. `lucide-react` - 36 edges
5. `FeatureSlice` - 33 edges
6. `DragDropConfigurator()` - 26 edges
7. `DEPENDENCY_REGISTRY` - 23 edges
8. `generateProjectVfs()` - 20 edges
9. `ForgeStackAppContent()` - 19 edges
10. `createCli()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `scaffoldApiPlugin()` --calls--> `generateProjectVfs()`  [EXTRACTED]
  packages/desktop/vite.config.ts → packages/core/src/engine/create-pipeline.ts
- `ForgeStackAppContent()` --calls--> `ScaffoldConsoleView()`  [EXTRACTED]
  packages/desktop/src/App.tsx → packages/desktop/src/components/home/ScaffoldConsoleView.tsx
- `ForgeStackAppContent()` --calls--> `LandingPage()`  [EXTRACTED]
  packages/desktop/src/App.tsx → packages/desktop/src/components/landing/LandingPage.tsx
- `ForgeStackAppContent()` --calls--> `VsCodeWorkspace()`  [EXTRACTED]
  packages/desktop/src/App.tsx → packages/desktop/src/components/preview/VsCodeWorkspace.tsx
- `ForgeStackAppContent()` --calls--> `UpdateModal()`  [EXTRACTED]
  packages/desktop/src/App.tsx → packages/desktop/src/components/updater/UpdateModal.tsx

## Import Cycles
- None detected.

## Communities (44 total, 9 thin omitted)

### Community 0 - "ProjectConfig"
Cohesion: 0.08
Nodes (43): FeatureSlice, RecipeCompositor, createProjectPipeline(), generateProjectVfs(), DEPENDENCY_REGISTRY, getPinnedVersion(), PackageName, resolveDependencies() (+35 more)

### Community 1 - "App.tsx"
Cohesion: 0.22
Nodes (13): App(), ForgeStackAppContent(), FastScaffoldModal(), HomeTemplatesDashboard(), Props, StudioNavbar(), AppSettingsPage(), loadAppSettings() (+5 more)

### Community 2 - "cli.ts"
Cohesion: 0.06
Nodes (33): createCli(), createMcpServer(), runMcpServer(), runInteractiveWizard(), CURATED_TEMPLATES, CuratedTemplate, findCuratedTemplate(), SavedCustomTemplate (+25 more)

### Community 3 - "desktop/package.json"
Cohesion: 0.05
Nodes (48): dependencies, clsx@^2.1.1, jszip@^3.10.2, lucide-react@^0.475.0, @monaco-editor/react@^4.7.0, react@^19.0.0, react-dom@^19.0.0, react-router-dom@^7.18.5 (+40 more)

### Community 4 - "TechIcons.tsx"
Cohesion: 0.08
Nodes (57): ClaudeIcon(), CursorRulesIcon(), DockerIcon(), DrizzleIcon(), ElectronIcon(), ExpressIcon(), FastifyIcon(), getFileIcon() (+49 more)

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
Cohesion: 0.24
Nodes (9): Props, UpdateModal(), downloadAndInstallUpdate(), DownloadProgress, isNewerVersion(), openExternalUrl(), relaunchApp(), UpdateDetails (+1 more)

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
Cohesion: 0.14
Nodes (8): Badge(), BadgeProps, BadgeVariant, variantStyles, Props, Props, Props, Props

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

### Community 29 - "FastScaffoldModal.tsx"
Cohesion: 0.23
Nodes (8): Props, Props, Props, Props, Props, ThemeId, BUILTIN_TEMPLATES, SavedTemplate

### Community 30 - "StepperWizard.tsx"
Cohesion: 0.21
Nodes (10): ExecutionConsole(), Props, Props, ScaffoldConsoleView(), Props, Step4ReviewScaffold(), CommunicationChannel, Props (+2 more)

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
Cohesion: 0.11
Nodes (24): ChangelogTimeline(), ReleaseItem, RELEASES, CompetitorMatrix(), MATRIX_DATA, Row, DesktopAppShowcase(), DownloadInstallHub() (+16 more)

### Community 39 - "AppSettingsPage.tsx"
Cohesion: 0.22
Nodes (6): AppSettings, DEFAULT_APP_SETTINGS, Props, saveAppSettings(), Props, AppEnvironment

### Community 40 - "2026-11-18-universal-ai-skills-mcp-and-interactive-landing/.openspec.yaml"
Cohesion: 0.50
Nodes (3): date, name, schema

### Community 41 - "bin"
Cohesion: 0.50
Nodes (4): bin, create-forgestack-app, forgestack, forgestack-mcp

## Knowledge Gaps
- **1 isolated node(s):** `forgestack-desktop`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 277 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `lucide-react` to `App.tsx`, `desktop/package.json`, `TechIcons.tsx`, `AppSettingsPage.tsx`, `updaterService.ts`, `Badge.tsx`, `FastScaffoldModal.tsx`, `StepperWizard.tsx`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **What connects `forgestack-desktop` to the rest of the system?**
  _1 weakly-connected nodes found - possible missing edges._
- **Should `ProjectConfig` be split into smaller, more focused modules?**
  _Cohesion score 0.08143409302945488 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `lucide-react` to `App.tsx`, `desktop/package.json`, `TechIcons.tsx`, `AppSettingsPage.tsx`, `updaterService.ts`, `Badge.tsx`, `FastScaffoldModal.tsx`, `StepperWizard.tsx`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Should `cli.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06106442577030812 - nodes in this community are weakly interconnected._
- **Why does `ProjectConfig` connect `ProjectConfig` to `cli.ts`, `FastScaffoldModal.tsx`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Should `desktop/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05254901960784314 - nodes in this community are weakly interconnected._