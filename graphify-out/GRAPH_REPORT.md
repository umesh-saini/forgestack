# Graph Report - project-setup  (2026-11-18)

## Corpus Check
- 154 files · ~184,902 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 6, .ico 2, .xml 2)

## Summary
- 668 nodes · 1659 edges · 39 communities (31 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e52cdf6b`
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
- scripts
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
- bin
- VsCodeWorkspace.tsx
- StepperWizard.tsx
- dependencies
- typescript
- 2026-11-17-nextgen-archetypes-primitives-and-ai-mcp-enhancements/.openspec.yaml
- core/package.json
- 2026-11-18-cli-openspec-ui-templates-and-nextjs-ux/.openspec.yaml
- ScaffoldConsoleView.tsx
- scripts
- CodePatcher

## God Nodes (most connected - your core abstractions)
1. `VirtualFileSystem` - 71 edges
2. `ProjectConfig` - 67 edges
3. `vitest` - 47 edges
4. `FeatureSlice` - 33 edges
5. `react` - 30 edges
6. `DragDropConfigurator()` - 26 edges
7. `lucide-react` - 26 edges
8. `DEPENDENCY_REGISTRY` - 23 edges
9. `generateProjectVfs()` - 18 edges
10. `createCli()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `vitest@^3.0.5` --declares--> `vitest`  [EXTRACTED]
  packages/cli/package.json → package.json
- `vitest@^3.0.5` --declares--> `vitest`  [EXTRACTED]
  packages/core/package.json → package.json
- `typescript@^5.7.3` --declares--> `typescript`  [EXTRACTED]
  packages/desktop/package.json → package.json
- `typescript@^5.7.3` --declares--> `typescript`  [EXTRACTED]
  packages/cli/package.json → package.json
- `typescript@^5.7.3` --declares--> `typescript`  [EXTRACTED]
  packages/core/package.json → package.json

## Import Cycles
- None detected.

## Communities (39 total, 8 thin omitted)

### Community 0 - "ProjectConfig"
Cohesion: 0.09
Nodes (42): FeatureSlice, RecipeCompositor, createProjectPipeline(), generateProjectVfs(), DEPENDENCY_REGISTRY, getPinnedVersion(), PackageName, resolveDependencies() (+34 more)

### Community 1 - "App.tsx"
Cohesion: 0.17
Nodes (14): App(), ForgeStackAppContent(), FastScaffoldModal(), Props, HomeTemplatesDashboard(), Props, StudioNavbar(), AppSettings (+6 more)

### Community 2 - "cli.ts"
Cohesion: 0.07
Nodes (25): createCli(), runInteractiveWizard(), CURATED_TEMPLATES, CuratedTemplate, findCuratedTemplate(), SavedCustomTemplate, TemplateConfig, TemplateStore (+17 more)

### Community 3 - "desktop/package.json"
Cohesion: 0.08
Nodes (29): clsx@^2.1.1, tailwind-merge@^3.0.1, devDependencies, tailwindcss@^4.0.0, @tailwindcss/vite@^4.0.0, @tauri-apps/cli@^2.2.0, @types/react@^19.0.8, @types/react-dom@^19.0.3 (+21 more)

### Community 4 - "TechIcons.tsx"
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
Cohesion: 0.10
Nodes (20): app, security, windows, build, beforeBuildCommand, beforeDevCommand, devUrl, frontendDist (+12 more)

### Community 9 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, cli:dev, desktop:build, desktop:dev, desktop:web, lint, test (+2 more)

### Community 10 - "cli/package.json"
Cohesion: 0.14
Nodes (15): dependencies, @clack/prompts@^0.9.1, commander@^13.1.0, @forgestack/core@workspace:*, picocolors@^1.1.1, description, files, main (+7 more)

### Community 11 - "compilerOptions"
Cohesion: 0.14
Nodes (13): compilerOptions, declaration, declarationMap, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, noImplicitAny (+5 more)

### Community 12 - "steps"
Cohesion: 0.09
Nodes (22): NODE_AUTH_TOKEN, jobs, publish, name, on, push, contents, id-token (+14 more)

### Community 13 - "Badge.tsx"
Cohesion: 0.11
Nodes (13): Badge(), BadgeProps, BadgeVariant, variantStyles, Props, FileViewerModalProps, Props, Props (+5 more)

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
Cohesion: 0.14
Nodes (16): devDependencies, eslint@^10.15.0, @eslint/js@^10.0.1, turbo@^2.11.12, typescript@^5.7.3, typescript-eslint@^8.73.0, vitest@^3.0.5, name (+8 more)

### Community 18 - "default.json"
Cohesion: 0.33
Nodes (5): description, identifier, permissions, $schema, windows

### Community 20 - "tasks"
Cohesion: 0.13
Nodes (14): dependsOn, outputs, outputs, $schema, tasks, build, lint, test (+6 more)

### Community 21 - "scripts"
Cohesion: 0.50
Nodes (4): scripts, build, prepack, test

### Community 28 - "bin"
Cohesion: 0.67
Nodes (3): bin, create-forgestack-app, forgestack

### Community 29 - "VsCodeWorkspace.tsx"
Cohesion: 0.16
Nodes (16): @monaco-editor/react@^4.7.0, FileEditorDrawer(), getMonacoLanguage(), Props, FileTreePreview(), filterTree(), Props, TreeItem() (+8 more)

### Community 30 - "StepperWizard.tsx"
Cohesion: 0.19
Nodes (10): Props, Step1IdentityArchetype(), Props, Step4ReviewScaffold(), Props, StepperWizard(), CommunicationChannel, Props (+2 more)

### Community 31 - "dependencies"
Cohesion: 0.14
Nodes (13): dependencies, lucide-react@^0.475.0, react@^19.0.0, react-dom@^19.0.0, @tauri-apps/api@^2.2.0, @tauri-apps/plugin-dialog@^2.2.0, @tauri-apps/plugin-shell@^2.2.0, PathSelectorModal() (+5 more)

### Community 32 - "typescript"
Cohesion: 0.20
Nodes (11): devDependencies, @types/node@^22.13.4, typescript@^5.7.3, vitest@^3.0.5, devDependencies, @types/node@^22.13.4, typescript@^5.7.3, vitest@^3.0.5 (+3 more)

### Community 33 - "2026-11-17-nextgen-archetypes-primitives-and-ai-mcp-enhancements/.openspec.yaml"
Cohesion: 0.50
Nodes (3): date, name, schema

### Community 34 - "core/package.json"
Cohesion: 0.15
Nodes (13): import, types, dependencies, zod@^3.24.2, exports, ./browser, files, main (+5 more)

### Community 35 - "2026-11-18-cli-openspec-ui-templates-and-nextjs-ux/.openspec.yaml"
Cohesion: 0.50
Nodes (3): date, name, schema

### Community 36 - "ScaffoldConsoleView.tsx"
Cohesion: 0.28
Nodes (6): react-router-dom@^7.18.5, ExecutionConsole(), Props, Props, ScaffoldConsoleView(), react-router-dom

### Community 37 - "scripts"
Cohesion: 0.50
Nodes (4): scripts, build, prepack, test

## Knowledge Gaps
- **1 isolated node(s):** `forgestack-desktop`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 232 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `ProjectConfig` to `typescript`, `cli.ts`, `core/package.json`, `CodePatcher`, `cli/package.json`, `json-merge.ts`, `package.json`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **What connects `forgestack-desktop` to the rest of the system?**
  _1 weakly-connected nodes found - possible missing edges._
- **Should `ProjectConfig` be split into smaller, more focused modules?**
  _Cohesion score 0.09180666077217801 - nodes in this community are weakly interconnected._
- **Why does `typescript` connect `typescript` to `package.json`, `cli/package.json`, `desktop/package.json`, `core/package.json`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Should `cli.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07033248081841433 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Badge.tsx` to `App.tsx`, `desktop/package.json`, `TechIcons.tsx`, `ScaffoldConsoleView.tsx`, `VsCodeWorkspace.tsx`, `StepperWizard.tsx`, `dependencies`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Should `desktop/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.08064516129032258 - nodes in this community are weakly interconnected._