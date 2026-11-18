# Graph Report - project-setup  (2026-11-18)

## Corpus Check
- 181 files · ~215,016 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: (none) 6, .mdc 2, .ico 2)

## Summary
- 871 nodes · 2017 edges · 45 communities (35 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `35c81ab2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ProjectConfig
- RealTech3DHero.tsx
- cli.ts
- Interactive3DHero.tsx
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
- ThreeFigureShowcase.tsx
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
- FeatureSpotlight.tsx
- dependencies
- typescript
- 2026-11-17-nextgen-archetypes-primitives-and-ai-mcp-enhancements/.openspec.yaml
- core/package.json
- 2026-11-18-cli-openspec-ui-templates-and-nextjs-ux/.openspec.yaml
- ./browser
- scripts
- lucide-react
- 2026-11-18-universal-ai-skills-mcp-and-interactive-landing/.openspec.yaml
- bin
- react
- desktop/package.json

## God Nodes (most connected - your core abstractions)
1. `VirtualFileSystem` - 71 edges
2. `ProjectConfig` - 67 edges
3. `react` - 48 edges
4. `lucide-react` - 40 edges
5. `FeatureSlice` - 33 edges
6. `DragDropConfigurator()` - 26 edges
7. `DEPENDENCY_REGISTRY` - 23 edges
8. `ForgeStackAppContent()` - 19 edges
9. `generateProjectVfs()` - 18 edges
10. `isTauri()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `Props` --references--> `ThemeId`  [EXTRACTED]
  packages/desktop/src/components/preview/FileEditorDrawer.tsx → packages/desktop/src/components/wizard/Header.tsx
- `Props` --references--> `ThemeId`  [EXTRACTED]
  packages/desktop/src/components/preview/VsCodeWorkspace.tsx → packages/desktop/src/components/wizard/Header.tsx
- `scaffoldApiPlugin()` --calls--> `generateProjectVfs()`  [EXTRACTED]
  packages/desktop/vite.config.ts → packages/core/src/engine/create-pipeline.ts
- `provisionAgentSkills()` --indirect_call--> `normalizeAgentToolId()`  [INFERRED]
  packages/core/src/skills/agent-provisioner.ts → packages/core/src/skills/targets.ts
- `ArchitecturalBlueprints()` --calls--> `useThemeAccent()`  [EXTRACTED]
  packages/desktop/src/components/landing/ArchitecturalBlueprints.tsx → packages/desktop/src/lib/motion.tsx

## Import Cycles
- None detected.

## Communities (45 total, 10 thin omitted)

### Community 0 - "ProjectConfig"
Cohesion: 0.08
Nodes (43): FeatureSlice, RecipeCompositor, createProjectPipeline(), generateProjectVfs(), DEPENDENCY_REGISTRY, getPinnedVersion(), PackageName, resolveDependencies() (+35 more)

### Community 1 - "RealTech3DHero.tsx"
Cohesion: 0.13
Nodes (19): @react-three/drei@^10.7.9, @react-three/fiber@^9.8.2, three@^0.187.0, ArchetypeId, ArchetypeMeta, ARCHETYPES, Interactive3DLaboratory(), Lab3DModel() (+11 more)

### Community 2 - "cli.ts"
Cohesion: 0.05
Nodes (35): createCli(), createMcpServer(), runMcpServer(), runInteractiveWizard(), CURATED_TEMPLATES, CuratedTemplate, findCuratedTemplate(), SavedCustomTemplate (+27 more)

### Community 3 - "Interactive3DHero.tsx"
Cohesion: 0.14
Nodes (14): framer-motion@^14.14.0, ARCHITECTURE_LAYERS, ArchitectureLayer, CoreScene(), CoreSceneProps, Interactive3DHero(), LayerMesh(), LayerMeshProps (+6 more)

### Community 4 - "TechIcons.tsx"
Cohesion: 0.08
Nodes (56): @monaco-editor/react@^4.7.0, ClaudeIcon(), CursorRulesIcon(), DockerIcon(), DrizzleIcon(), ElectronIcon(), ExpressIcon(), FastifyIcon() (+48 more)

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
Cohesion: 0.06
Nodes (48): App(), ForgeStackAppContent(), ExecutionConsole(), Props, FastScaffoldModal(), Props, HomeTemplatesDashboard(), Props (+40 more)

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

### Community 15 - "ThreeFigureShowcase.tsx"
Cohesion: 0.24
Nodes (14): buildPalette(), Figure(), FigureDef, FigureProps, FIGURES, hexToRgb(), hsl(), rgba() (+6 more)

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

### Community 38 - "lucide-react"
Cohesion: 0.11
Nodes (9): MATRIX_DATA, Row, container, item, Props, FileViewerModalProps, Props, lucide-react (+1 more)

### Community 40 - "2026-11-18-universal-ai-skills-mcp-and-interactive-landing/.openspec.yaml"
Cohesion: 0.50
Nodes (3): date, name, schema

### Community 41 - "bin"
Cohesion: 0.50
Nodes (4): bin, create-forgestack-app, forgestack, forgestack-mcp

### Community 43 - "react"
Cohesion: 0.17
Nodes (15): ArchitecturalBlueprints(), SchematicTab, TABS, ChangelogTimeline(), ReleaseItem, RELEASES, DesktopAppShowcase(), DownloadInstallHub() (+7 more)

### Community 45 - "desktop/package.json"
Cohesion: 0.05
Nodes (51): dependencies, clsx@^2.1.1, jszip@^3.10.2, lucide-react@^0.475.0, react@^19.0.0, react-dom@^19.0.0, react-router-dom@^7.18.5, tailwind-merge@^3.0.1 (+43 more)

## Knowledge Gaps
- **1 isolated node(s):** `forgestack-desktop`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 315 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `RealTech3DHero.tsx`, `Interactive3DHero.tsx`, `TechIcons.tsx`, `lucide-react`, `App.tsx`, `Badge.tsx`, `desktop/package.json`, `ThreeFigureShowcase.tsx`, `FeatureSpotlight.tsx`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **What connects `forgestack-desktop` to the rest of the system?**
  _1 weakly-connected nodes found - possible missing edges._
- **Should `ProjectConfig` be split into smaller, more focused modules?**
  _Cohesion score 0.08143409302945488 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `lucide-react` to `RealTech3DHero.tsx`, `Interactive3DHero.tsx`, `TechIcons.tsx`, `App.tsx`, `react`, `desktop/package.json`, `Badge.tsx`, `FeatureSpotlight.tsx`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Should `RealTech3DHero.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12857142857142856 - nodes in this community are weakly interconnected._
- **Why does `@forgestack/core` connect `dependencies` to `cli/package.json`, `desktop/package.json`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Should `cli.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05327281414237936 - nodes in this community are weakly interconnected._