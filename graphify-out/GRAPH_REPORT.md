# Graph Report - project-setup  (2026-11-18)

## Corpus Check
- 180 files · ~211,631 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 16 file(s) not represented in the graph (top: (none) 6, .ico 2, .glb 2)

## Summary
- 867 nodes · 2005 edges · 51 communities (41 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `52b51ccd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ProjectConfig
- isTauri
- cli.ts
- ThreeFigureShowcase.tsx
- TechIcons.tsx
- steps
- compilerOptions
- types.ts
- tauri.conf.json
- App.tsx
- cli/package.json
- compilerOptions
- steps
- Badge.tsx
- fs.rs
- dependencies
- json-merge.ts
- package.json
- default.json
- create-forgestack-app.js
- tasks
- scripts
- pnpm-workspace.yaml
- forgestack-desktop
- with
- 2026-11-17-multi-framework-spec-governance-and-stepper-studio/.openspec.yaml
- updaterService.ts
- dependencies
- typescript
- 2026-11-17-nextgen-archetypes-primitives-and-ai-mcp-enhancements/.openspec.yaml
- core/package.json
- 2026-11-18-cli-openspec-ui-templates-and-nextjs-ux/.openspec.yaml
- ./browser
- scripts
- ProjectIdentity.tsx
- AppSettingsPage.tsx
- 2026-11-18-universal-ai-skills-mcp-and-interactive-landing/.openspec.yaml
- bin
- react
- devDependencies
- VsCodeWorkspace.tsx
- desktop/package.json
- vite.config.ts
- StepperWizard.tsx
- scripts

## God Nodes (most connected - your core abstractions)
1. `VirtualFileSystem` - 71 edges
2. `ProjectConfig` - 67 edges
3. `react` - 47 edges
4. `lucide-react` - 39 edges
5. `FeatureSlice` - 33 edges
6. `DragDropConfigurator()` - 26 edges
7. `DEPENDENCY_REGISTRY` - 23 edges
8. `ForgeStackAppContent()` - 19 edges
9. `generateProjectVfs()` - 18 edges
10. `isTauri()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `scaffoldApiPlugin()` --calls--> `generateProjectVfs()`  [EXTRACTED]
  packages/desktop/vite.config.ts → packages/core/src/engine/create-pipeline.ts
- `ForgeStackAppContent()` --calls--> `LandingPage()`  [EXTRACTED]
  packages/desktop/src/App.tsx → packages/desktop/src/components/landing/LandingPage.tsx
- `LandingPage()` --calls--> `ThreeFigureShowcase()`  [EXTRACTED]
  packages/desktop/src/components/landing/LandingPage.tsx → packages/desktop/src/components/landing/ThreeFigureShowcase.tsx
- `SavedTemplate` --references--> `ProjectConfig`  [EXTRACTED]
  packages/desktop/src/types/template.ts → packages/core/src/types/config.ts
- `VirtualFileSystem` --references--> `VirtualFile`  [EXTRACTED]
  packages/core/src/vfs/vfs.ts → packages/core/src/vfs/types.ts

## Import Cycles
- None detected.

## Communities (51 total, 10 thin omitted)

### Community 0 - "ProjectConfig"
Cohesion: 0.08
Nodes (43): FeatureSlice, RecipeCompositor, createProjectPipeline(), generateProjectVfs(), DEPENDENCY_REGISTRY, getPinnedVersion(), PackageName, resolveDependencies() (+35 more)

### Community 1 - "isTauri"
Cohesion: 0.18
Nodes (13): ExecutionConsole(), Props, Props, ScaffoldConsoleView(), Props, StudioNavbar(), Props, Step4ReviewScaffold() (+5 more)

### Community 2 - "cli.ts"
Cohesion: 0.05
Nodes (35): createCli(), createMcpServer(), runMcpServer(), runInteractiveWizard(), CURATED_TEMPLATES, CuratedTemplate, findCuratedTemplate(), SavedCustomTemplate (+27 more)

### Community 3 - "ThreeFigureShowcase.tsx"
Cohesion: 0.07
Nodes (42): @react-three/drei@^10.7.9, @react-three/fiber@^9.8.2, three@^0.187.0, ARCHITECTURE_LAYERS, ArchitectureLayer, CoreScene(), CoreSceneProps, Interactive3DHero() (+34 more)

### Community 4 - "TechIcons.tsx"
Cohesion: 0.10
Nodes (48): ClaudeIcon(), CursorRulesIcon(), DockerIcon(), DrizzleIcon(), ElectronIcon(), ExpressIcon(), FastifyIcon(), getFileIcon() (+40 more)

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

### Community 9 - "App.tsx"
Cohesion: 0.19
Nodes (12): App(), ForgeStackAppContent(), FastScaffoldModal(), Props, HomeTemplatesDashboard(), Props, AppSettingsPage(), loadAppSettings() (+4 more)

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
Cohesion: 0.09
Nodes (14): Badge(), BadgeProps, BadgeVariant, variantStyles, MATRIX_DATA, Row, FeatureCard, FEATURES (+6 more)

### Community 14 - "fs.rs"
Cohesion: 0.17
Nodes (8): AppEnvironment, get_app_environment(), PathValidationResult, pick_directory(), scaffold_project_files(), ScaffoldPayload, validate_target_path(), VirtualFilePayload

### Community 15 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, framer-motion@^14.14.0, lucide-react@^0.475.0, @monaco-editor/react@^4.7.0, react@^19.0.0, react-dom@^19.0.0, react-router-dom@^7.18.5, tailwind-merge@^3.0.1 (+9 more)

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

### Community 29 - "2026-11-17-multi-framework-spec-governance-and-stepper-studio/.openspec.yaml"
Cohesion: 0.50
Nodes (3): date, name, schema

### Community 30 - "updaterService.ts"
Cohesion: 0.22
Nodes (11): Props, UpdateModal(), checkForUpdates(), downloadAndInstallUpdate(), DownloadProgress, getAppEnvironment(), isNewerVersion(), openExternalUrl() (+3 more)

### Community 31 - "dependencies"
Cohesion: 0.20
Nodes (10): dependencies, @clack/prompts@^0.9.1, commander@^13.1.0, @forgestack/core@workspace:*, @modelcontextprotocol/sdk@^1.32.2, picocolors@^1.1.1, @modelcontextprotocol/sdk, @forgestack/core@workspace:* (+2 more)

### Community 32 - "typescript"
Cohesion: 0.33
Nodes (6): @types/node@^22.13.4, devDependencies, @types/node@^22.13.4, typescript@^5.7.3, vitest@^3.0.5, @types/node

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

### Community 39 - "AppSettingsPage.tsx"
Cohesion: 0.17
Nodes (6): AppSettings, DEFAULT_APP_SETTINGS, Props, saveAppSettings(), Props, AppEnvironment

### Community 40 - "2026-11-18-universal-ai-skills-mcp-and-interactive-landing/.openspec.yaml"
Cohesion: 0.50
Nodes (3): date, name, schema

### Community 41 - "bin"
Cohesion: 0.50
Nodes (4): bin, create-forgestack-app, forgestack, forgestack-mcp

### Community 43 - "react"
Cohesion: 0.12
Nodes (21): ArchitecturalBlueprints(), SchematicTab, TABS, ChangelogTimeline(), ReleaseItem, RELEASES, DesktopAppShowcase(), DownloadInstallHub() (+13 more)

### Community 45 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, tailwindcss@^4.0.0, @tauri-apps/cli@^2.2.0, @types/jszip@^3.4.1, @types/react@^19.0.8, @types/react-dom@^19.0.3, @types/three@^0.187.0, typescript@^5.7.3 (+7 more)

### Community 46 - "VsCodeWorkspace.tsx"
Cohesion: 0.27
Nodes (8): FileEditorDrawer(), getMonacoLanguage(), Props, getMonacoLanguage(), Props, VsCodeWorkspace(), Props, ThemeId

### Community 47 - "desktop/package.json"
Cohesion: 0.18
Nodes (10): clsx@^2.1.1, jszip@^3.10.2, @tauri-apps/plugin-process@^2.4.0, name, private, type, version, clsx (+2 more)

### Community 48 - "vite.config.ts"
Cohesion: 0.20
Nodes (8): @tailwindcss/vite@^4.0.0, vite@^6.1.0, @vitejs/plugin-react@^4.3.4, __dirname, scaffoldApiPlugin(), @tailwindcss/vite, vite, @vitejs/plugin-react

### Community 49 - "StepperWizard.tsx"
Cohesion: 0.38
Nodes (4): Props, Step1IdentityArchetype(), Props, StepperWizard()

### Community 50 - "scripts"
Cohesion: 0.50
Nodes (4): scripts, build, dev, tauri

## Knowledge Gaps
- **1 isolated node(s):** `forgestack-desktop`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 310 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `isTauri`, `ThreeFigureShowcase.tsx`, `TechIcons.tsx`, `ProjectIdentity.tsx`, `AppSettingsPage.tsx`, `App.tsx`, `Badge.tsx`, `VsCodeWorkspace.tsx`, `dependencies`, `desktop/package.json`, `StepperWizard.tsx`, `updaterService.ts`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **What connects `forgestack-desktop` to the rest of the system?**
  _1 weakly-connected nodes found - possible missing edges._
- **Should `ProjectConfig` be split into smaller, more focused modules?**
  _Cohesion score 0.08143409302945488 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Badge.tsx` to `isTauri`, `ThreeFigureShowcase.tsx`, `TechIcons.tsx`, `ProjectIdentity.tsx`, `AppSettingsPage.tsx`, `App.tsx`, `react`, `VsCodeWorkspace.tsx`, `dependencies`, `desktop/package.json`, `StepperWizard.tsx`, `updaterService.ts`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Should `cli.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05327281414237936 - nodes in this community are weakly interconnected._
- **Why does `@forgestack/core` connect `dependencies` to `cli/package.json`, `desktop/package.json`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Should `ThreeFigureShowcase.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06845513413506013 - nodes in this community are weakly interconnected._