# Graph Report - project-setup  (2026-11-25)

## Corpus Check
- 184 files · ~203,718 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 6, .ico 2, .xml 2)

## Summary
- 1092 nodes · 2632 edges · 66 communities (46 shown, 20 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `848c9675`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Core Scaffolding Engine & Slices
- HomeTemplatesDashboard.tsx
- ForgeStack CLI & Template Store
- E2E Combination Matrix & Runtime Testing
- Desktop Ecosystem & Tech Icons
- CI Workflow & Matrix Testing
- Desktop TypeScript Configuration
- Virtual File System & File Actions
- Tauri Desktop App Configuration
- desktop/src/App.tsx
- CLI Package Dependencies & Binaries
- Root TypeScript Configuration
- Publish Release Workflow
- AppShell.tsx
- Tauri Native File System Commands
- devDependencies
- JSON Merge & Utility Functions
- Root Monorepo Tooling & Dependencies
- Tauri Security & Permissions Capabilities
- create-forgestack-app.js
- Turborepo Pipeline Configuration
- Proof.tsx
- Pnpm Workspace Configuration
- Tauri Cargo Package Definition
- Desktop Release Workflow & Signing
- OpenSpec Multi-Framework Spec Archive
- AppSettingsPage.tsx
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
- cx
- @monaco-editor/react
- dependencies
- primitives.tsx
- desktop/package.json
- FastScaffoldModal.tsx
- scripts
- clsx@^2.1.1
- lucide-react@^0.475.0
- react@^19.0.0
- react-dom@^19.0.0
- tailwind-merge@^3.0.1
- @tauri-apps/plugin-shell
- @types/jszip@^3.4.1
- Opening.tsx
- screens.ts
- Use.tsx
- website/src/App.tsx
- StudioTour.tsx
- website/src/main.tsx
- Changelog.tsx

## God Nodes (most connected - your core abstractions)
1. `ProjectConfig` - 99 edges
2. `VirtualFileSystem` - 73 edges
3. `cx()` - 36 edges
4. `FeatureSlice` - 35 edges
5. `generateProjectVfs()` - 27 edges
6. `DEPENDENCY_REGISTRY` - 25 edges
7. `Button` - 23 edges
8. `ForgeStackAppContent()` - 22 edges
9. `createCli()` - 20 edges
10. `Step2StackEcosystem()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `sweep()` --calls--> `generateProjectVfs()`  [EXTRACTED]
  tests/e2e/combination-matrix.test.ts → packages/core/src/engine/create-pipeline.ts
- `sweep()` --calls--> `normalizeConfig()`  [EXTRACTED]
  tests/e2e/combination-matrix.test.ts → packages/core/src/types/config.ts
- `scaffoldApiPlugin()` --calls--> `generateProjectVfs()`  [EXTRACTED]
  packages/desktop/vite.config.ts → packages/core/src/engine/create-pipeline.ts
- `Props` --references--> `ProjectConfig`  [EXTRACTED]
  packages/desktop/src/components/wizard/Step1IdentityArchetype.tsx → packages/core/src/types/config.ts
- `Props` --references--> `ProjectConfig`  [EXTRACTED]
  packages/desktop/src/components/wizard/Step2StackEcosystem.tsx → packages/core/src/types/config.ts

## Import Cycles
- None detected.

## Communities (66 total, 20 thin omitted)

### Community 0 - "Core Scaffolding Engine & Slices"
Cohesion: 0.07
Nodes (55): FeatureSlice, RecipeCompositor, cleanSlotsSlice, createProjectPipeline(), generateProjectVfs(), npmWorkspaceProtocolSlice, PNPM_BUILT_DEPENDENCIES, pnpmBuildScriptsSlice (+47 more)

### Community 1 - "HomeTemplatesDashboard.tsx"
Cohesion: 0.23
Nodes (24): ArchitectureTopology, Filter, HomeTemplatesDashboard(), TemplateInspector(), useFileCount(), Marker(), RunPanel(), StudioView() (+16 more)

### Community 2 - "ForgeStack CLI & Template Store"
Cohesion: 0.05
Nodes (40): createCli(), spinner(), createMcpServer(), runMcpServer(), runInteractiveWizard(), CURATED_TEMPLATES, CuratedTemplate, findCuratedTemplate() (+32 more)

### Community 3 - "E2E Combination Matrix & Runtime Testing"
Cohesion: 0.07
Nodes (41): BIN_TO_PKG, BUILTINS, checkProject(), EXTS, IMPORT_RE, parseJson(), pkgNameOf(), SHELL (+33 more)

### Community 4 - "Desktop Ecosystem & Tech Icons"
Cohesion: 0.09
Nodes (20): DrizzleIcon(), ExpressIcon(), FastifyIcon(), getFileIcon(), HonoIcon(), IconProps, JsonIcon(), MongoIcon() (+12 more)

### Community 5 - "CI Workflow & Matrix Testing"
Cohesion: 0.06
Nodes (41): name, runs-on, steps, jobs, e2e-matrix, runtime-matrix, static-matrix, test (+33 more)

### Community 6 - "Desktop TypeScript Configuration"
Cohesion: 0.13
Nodes (14): compilerOptions, isolatedModules, jsx, lib, module, moduleDetection, moduleResolution, noEmit (+6 more)

### Community 7 - "Virtual File System & File Actions"
Cohesion: 0.11
Nodes (9): AppendFileAction, CreateFileAction, DeleteFileAction, FileAction, FileActionType, MergeJsonAction, OverwriteFileAction, PatchAstAction (+1 more)

### Community 8 - "Tauri Desktop App Configuration"
Cohesion: 0.08
Nodes (24): app, security, windows, build, beforeBuildCommand, beforeDevCommand, devUrl, frontendDist (+16 more)

### Community 9 - "desktop/src/App.tsx"
Cohesion: 0.17
Nodes (20): App(), defaultConfig(), ForgeStackAppContent(), openWith(), CommandPalette(), log(), WorkingLine(), Notes() (+12 more)

### Community 10 - "CLI Package Dependencies & Binaries"
Cohesion: 0.07
Nodes (31): bin, create-forgestack-app, forgestack, forgestack-mcp, dependencies, @clack/prompts@^0.9.1, commander@^13.1.0, @forgestk/core@workspace:* (+23 more)

### Community 11 - "Root TypeScript Configuration"
Cohesion: 0.14
Nodes (13): compilerOptions, declaration, declarationMap, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, noImplicitAny (+5 more)

### Community 12 - "Publish Release Workflow"
Cohesion: 0.09
Nodes (22): NODE_AUTH_TOKEN, jobs, publish, name, on, push, contents, id-token (+14 more)

### Community 13 - "AppShell.tsx"
Cohesion: 0.40
Nodes (5): AppShell(), NAV, Props, Kbd(), react-router-dom

### Community 14 - "Tauri Native File System Commands"
Cohesion: 0.17
Nodes (8): AppEnvironment, get_app_environment(), PathValidationResult, pick_directory(), scaffold_project_files(), ScaffoldPayload, validate_target_path(), VirtualFilePayload

### Community 15 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, tailwindcss@^4.0.0, @tailwindcss/vite@^4.0.0, @tauri-apps/cli@^2.2.0, @types/react@^19.0.8, @types/react-dom@^19.0.3, typescript@^5.7.3, vite@^6.1.0 (+9 more)

### Community 16 - "JSON Merge & Utility Functions"
Cohesion: 0.62
Nodes (5): deepEquals(), deepMergeJson(), isPlainObject(), mergePackageJson(), sortKeys()

### Community 17 - "Root Monorepo Tooling & Dependencies"
Cohesion: 0.07
Nodes (34): dependencies, @modelcontextprotocol/sdk@^1.32.2, devDependencies, eslint@^10.15.0, @eslint/js@^10.0.1, turbo@^2.11.12, typescript@^5.7.3, typescript-eslint@^8.73.0 (+26 more)

### Community 18 - "Tauri Security & Permissions Capabilities"
Cohesion: 0.33
Nodes (5): description, identifier, permissions, $schema, windows

### Community 20 - "Turborepo Pipeline Configuration"
Cohesion: 0.13
Nodes (14): dependsOn, outputs, outputs, $schema, tasks, build, lint, test (+6 more)

### Community 21 - "Proof.tsx"
Cohesion: 0.19
Nodes (15): LABELS, AI_TOOL_NAMES, AnySchema, PACKAGE_MANAGERS, SAMPLES, shape, STACK, sub() (+7 more)

### Community 28 - "Desktop Release Workflow & Signing"
Cohesion: 0.05
Nodes (37): GITHUB_TOKEN, TAURI_SIGNING_PRIVATE_KEY, TAURI_SIGNING_PRIVATE_KEY_PASSWORD, args, platform, jobs, release, include (+29 more)

### Community 29 - "OpenSpec Multi-Framework Spec Archive"
Cohesion: 0.50
Nodes (3): date, name, schema

### Community 30 - "AppSettingsPage.tsx"
Cohesion: 0.18
Nodes (15): AppSettings, AppSettingsPage(), DEFAULT_APP_SETTINGS, POPULAR, Props, saveAppSettings(), SectionId, SECTIONS (+7 more)

### Community 31 - "Website Deployment Workflow"
Cohesion: 0.06
Nodes (35): runs-on, steps, concurrency, cancel-in-progress, group, environment, needs, runs-on (+27 more)

### Community 32 - "Website Package Dependencies"
Cohesion: 0.07
Nodes (39): dependencies, @fontsource-variable/ibm-plex-sans@^5.3.0, @fontsource-variable/jetbrains-mono@^5.3.0, @forgestk/core@workspace:*, lucide-react@^0.475.0, motion@^14.14.0, react@^19.0.0, react-dom@^19.0.0 (+31 more)

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

### Community 45 - "cx"
Cohesion: 0.14
Nodes (22): TreeNode, collectFiles(), FileTree(), filterTree(), Props, useFreshPaths(), Console(), editorOptions (+14 more)

### Community 47 - "dependencies"
Cohesion: 0.13
Nodes (15): dependencies, @fontsource-variable/jetbrains-mono@^5.3.0, jszip@^3.10.2, motion@^14.14.0, react-router-dom@^7.18.5, @tauri-apps/api@^2.2.0, @tauri-apps/plugin-dialog@^2.2.0, @tauri-apps/plugin-process@^2.4.0 (+7 more)

### Community 48 - "primitives.tsx"
Cohesion: 0.13
Nodes (25): ClaudeIcon(), CursorRulesIcon(), DockerIcon(), OpenSpecIcon(), PaletteCommand, Props, ConfigGroup(), PickerOption (+17 more)

### Community 49 - "desktop/package.json"
Cohesion: 0.22
Nodes (8): @fontsource-variable/ibm-plex-sans@^5.3.0, @forgestk/core@workspace:*, @fontsource-variable/ibm-plex-sans, @forgestk/core, name, private, type, version

### Community 50 - "FastScaffoldModal.tsx"
Cohesion: 0.22
Nodes (13): baseDir(), FastScaffoldModal(), Props, Props, loadAppSettings(), Dialog(), Field(), SettingRow() (+5 more)

### Community 51 - "scripts"
Cohesion: 0.50
Nodes (4): scripts, build, dev, tauri

### Community 59 - "Opening.tsx"
Cohesion: 0.23
Nodes (14): CREATE_CMD, HEADLINE, NAV, Opening(), PATHS, TypedCommand(), AiSetup(), Marquee() (+6 more)

### Community 60 - "screens.ts"
Cohesion: 0.14
Nodes (3): SHOT_SIZE, SHOTS, TOUR

### Community 61 - "Use.tsx"
Cohesion: 0.23
Nodes (10): AI_PROMPT, AI_TOOLS, CLI_EXAMPLES, FEATURES, MCP_ARGS, mcpJson, REPO, SKILLS_CMD (+2 more)

### Community 62 - "website/src/App.tsx"
Cohesion: 0.36
Nodes (11): App(), Header(), StackRail(), Verification(), Cli(), Estimates(), Footer(), Releases() (+3 more)

### Community 63 - "StudioTour.tsx"
Cohesion: 0.44
Nodes (8): Panel, PanelBody(), PinnedTrack(), SnapRail(), StudioTour(), TourHeader(), TrackPanel(), useMedia()

### Community 65 - "Changelog.tsx"
Cohesion: 0.60
Nodes (4): Changelog(), Inline(), parseChangelog(), Release

## Knowledge Gaps
- **5 isolated node(s):** `../../tsconfig.json`, `../../tsconfig.json`, `forgestack-desktop`, `../../tsconfig.json`, `../../tsconfig.json`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 395 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ProjectConfig` connect `Core Scaffolding Engine & Slices` to `HomeTemplatesDashboard.tsx`, `ForgeStack CLI & Template Store`, `E2E Combination Matrix & Runtime Testing`, `Desktop Ecosystem & Tech Icons`, `desktop/src/App.tsx`, `cx`, `primitives.tsx`, `FastScaffoldModal.tsx`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **What connects `../../tsconfig.json`, `../../tsconfig.json`, `forgestack-desktop` to the rest of the system?**
  _5 weakly-connected nodes found - possible missing edges._
- **Should `Core Scaffolding Engine & Slices` be split into smaller, more focused modules?**
  _Cohesion score 0.0722507708119219 - nodes in this community are weakly interconnected._
- **Why does `react-router-dom` connect `AppShell.tsx` to `desktop/package.json`, `cx`, `desktop/src/App.tsx`, `dependencies`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Should `ForgeStack CLI & Template Store` be split into smaller, more focused modules?**
  _Cohesion score 0.0546984572230014 - nodes in this community are weakly interconnected._
- **Why does `zod` connect `Core Engine Package Configuration` to `Core Scaffolding Engine & Slices`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Should `E2E Combination Matrix & Runtime Testing` be split into smaller, more focused modules?**
  _Cohesion score 0.06887755102040816 - nodes in this community are weakly interconnected._