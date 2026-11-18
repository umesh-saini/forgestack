# Graph Report - project-setup  (2026-11-18)

## Corpus Check
- 156 files · ~188,872 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 6, .ico 2, .xml 2)

## Summary
- 694 nodes · 1726 edges · 39 communities (31 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `04a8f2ce`
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
- Header.tsx
- VsCodeWorkspace.tsx
- StepperWizard.tsx
- dependencies
- typescript
- 2026-11-17-nextgen-archetypes-primitives-and-ai-mcp-enhancements/.openspec.yaml
- core/package.json
- 2026-11-18-cli-openspec-ui-templates-and-nextjs-ux/.openspec.yaml
- ./browser
- scripts
- CodePatcher

## God Nodes (most connected - your core abstractions)
1. `VirtualFileSystem` - 71 edges
2. `ProjectConfig` - 67 edges
3. `vitest` - 47 edges
4. `FeatureSlice` - 33 edges
5. `react` - 31 edges
6. `lucide-react` - 27 edges
7. `DragDropConfigurator()` - 26 edges
8. `DEPENDENCY_REGISTRY` - 23 edges
9. `generateProjectVfs()` - 18 edges
10. `ForgeStackAppContent()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `vitest@^3.0.5` --declares--> `vitest`  [EXTRACTED]
  packages/cli/package.json → package.json
- `vitest@^3.0.5` --declares--> `vitest`  [EXTRACTED]
  packages/core/package.json → package.json
- `typescript@^5.7.3` --declares--> `typescript`  [EXTRACTED]
  package.json → packages/desktop/package.json
- `typescript@^5.7.3` --declares--> `typescript`  [EXTRACTED]
  packages/cli/package.json → packages/desktop/package.json
- `typescript@^5.7.3` --declares--> `typescript`  [EXTRACTED]
  packages/core/package.json → packages/desktop/package.json

## Import Cycles
- None detected.

## Communities (39 total, 8 thin omitted)

### Community 0 - "ProjectConfig"
Cohesion: 0.09
Nodes (44): FeatureSlice, RecipeCompositor, createProjectPipeline(), generateProjectVfs(), DEPENDENCY_REGISTRY, getPinnedVersion(), PackageName, resolveDependencies() (+36 more)

### Community 1 - "App.tsx"
Cohesion: 0.14
Nodes (15): App(), ForgeStackAppContent(), FastScaffoldModal(), Props, StudioNavbar(), AppSettingsPage(), loadAppSettings(), saveAppSettings() (+7 more)

### Community 2 - "cli.ts"
Cohesion: 0.07
Nodes (25): createCli(), runInteractiveWizard(), CURATED_TEMPLATES, CuratedTemplate, findCuratedTemplate(), SavedCustomTemplate, TemplateConfig, TemplateStore (+17 more)

### Community 3 - "desktop/package.json"
Cohesion: 0.06
Nodes (44): dependencies, clsx@^2.1.1, lucide-react@^0.475.0, @monaco-editor/react@^4.7.0, react@^19.0.0, react-dom@^19.0.0, react-router-dom@^7.18.5, tailwind-merge@^3.0.1 (+36 more)

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
Cohesion: 0.23
Nodes (12): AppSettings, DEFAULT_APP_SETTINGS, Props, Props, UpdateModal(), AppEnvironment, downloadAndInstallUpdate(), DownloadProgress (+4 more)

### Community 10 - "cli/package.json"
Cohesion: 0.18
Nodes (10): bin, create-forgestack-app, forgestack, description, files, main, name, type (+2 more)

### Community 11 - "compilerOptions"
Cohesion: 0.14
Nodes (13): compilerOptions, declaration, declarationMap, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, noImplicitAny (+5 more)

### Community 12 - "steps"
Cohesion: 0.09
Nodes (22): NODE_AUTH_TOKEN, jobs, publish, name, on, push, contents, id-token (+14 more)

### Community 13 - "Badge.tsx"
Cohesion: 0.12
Nodes (12): Badge(), BadgeProps, BadgeVariant, variantStyles, FileViewerModalProps, Props, Props, Props (+4 more)

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
Cohesion: 0.09
Nodes (25): devDependencies, eslint@^10.15.0, @eslint/js@^10.0.1, turbo@^2.11.12, typescript-eslint@^8.73.0, vitest@^3.0.5, name, packageManager (+17 more)

### Community 18 - "default.json"
Cohesion: 0.33
Nodes (5): description, identifier, permissions, $schema, windows

### Community 20 - "tasks"
Cohesion: 0.13
Nodes (14): dependsOn, outputs, outputs, $schema, tasks, build, lint, test (+6 more)

### Community 21 - "scripts"
Cohesion: 0.50
Nodes (4): scripts, build, prepack, test

### Community 28 - "Header.tsx"
Cohesion: 0.21
Nodes (9): Props, HomeTemplatesDashboard(), Props, Props, Props, Props, ThemeId, BUILTIN_TEMPLATES (+1 more)

### Community 29 - "VsCodeWorkspace.tsx"
Cohesion: 0.25
Nodes (12): getFileIcon(), JsonIcon(), FileEditorDrawer(), getMonacoLanguage(), FileTreePreview(), filterTree(), Props, TreeItem() (+4 more)

### Community 30 - "StepperWizard.tsx"
Cohesion: 0.15
Nodes (14): ExecutionConsole(), Props, Props, ScaffoldConsoleView(), Props, Step1IdentityArchetype(), Props, Step4ReviewScaffold() (+6 more)

### Community 31 - "dependencies"
Cohesion: 0.25
Nodes (8): dependencies, @clack/prompts@^0.9.1, commander@^13.1.0, @forgestack/core@workspace:*, picocolors@^1.1.1, @forgestack/core@workspace:*, commander, @forgestack/core

### Community 32 - "typescript"
Cohesion: 0.20
Nodes (11): typescript@^5.7.3, devDependencies, @types/node@^22.13.4, typescript@^5.7.3, vitest@^3.0.5, devDependencies, @types/node@^22.13.4, typescript@^5.7.3 (+3 more)

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
  These have ≤1 connection - possible missing edges. (Counts symbols only; 235 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `ProjectConfig` to `typescript`, `cli.ts`, `core/package.json`, `CodePatcher`, `cli/package.json`, `json-merge.ts`, `package.json`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **What connects `forgestack-desktop` to the rest of the system?**
  _1 weakly-connected nodes found - possible missing edges._
- **Should `ProjectConfig` be split into smaller, more focused modules?**
  _Cohesion score 0.08663911845730028 - nodes in this community are weakly interconnected._
- **Why does `typescript` connect `typescript` to `package.json`, `cli/package.json`, `desktop/package.json`, `core/package.json`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Badge.tsx` to `App.tsx`, `desktop/package.json`, `TechIcons.tsx`, `updaterService.ts`, `Header.tsx`, `VsCodeWorkspace.tsx`, `StepperWizard.tsx`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Should `cli.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07033248081841433 - nodes in this community are weakly interconnected._