# Graph Report - project-setup  (2026-11-18)

## Corpus Check
- 154 files · ~184,878 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 6, .example 1, .css 1)

## Summary
- 665 nodes · 1671 edges · 34 communities (27 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `25b35a6b`
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
- typescript
- 2026-11-17-nextgen-archetypes-primitives-and-ai-mcp-enhancements/.openspec.yaml
- core/package.json
- 2026-11-18-cli-openspec-ui-templates-and-nextjs-ux/.openspec.yaml
- scripts

## God Nodes (most connected - your core abstractions)
1. `ProjectConfig` - 92 edges
2. `VirtualFileSystem` - 71 edges
3. `vitest` - 47 edges
4. `FeatureSlice` - 33 edges
5. `react` - 30 edges
6. `DragDropConfigurator()` - 26 edges
7. `lucide-react` - 26 edges
8. `DEPENDENCY_REGISTRY` - 23 edges
9. `generateProjectVfs()` - 18 edges
10. `createCli()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `typescript@^5.7.3` --declares--> `typescript`  [EXTRACTED]
  packages/desktop/package.json → package.json
- `vitest@^3.0.5` --declares--> `vitest`  [EXTRACTED]
  packages/cli/package.json → package.json
- `vitest@^3.0.5` --declares--> `vitest`  [EXTRACTED]
  packages/core/package.json → package.json
- `typescript@^5.7.3` --declares--> `typescript`  [EXTRACTED]
  packages/cli/package.json → package.json
- `typescript@^5.7.3` --declares--> `typescript`  [EXTRACTED]
  packages/core/package.json → package.json

## Import Cycles
- None detected.

## Communities (34 total, 7 thin omitted)

### Community 0 - "ProjectConfig"
Cohesion: 0.08
Nodes (43): FeatureSlice, RecipeCompositor, createProjectPipeline(), generateProjectVfs(), DEPENDENCY_REGISTRY, getPinnedVersion(), PackageName, resolveDependencies() (+35 more)

### Community 1 - "App.tsx"
Cohesion: 0.09
Nodes (27): App(), ForgeStackAppContent(), ExecutionConsole(), Props, FastScaffoldModal(), Props, HomeTemplatesDashboard(), Props (+19 more)

### Community 2 - "cli.ts"
Cohesion: 0.07
Nodes (25): createCli(), runInteractiveWizard(), CURATED_TEMPLATES, CuratedTemplate, findCuratedTemplate(), SavedCustomTemplate, TemplateConfig, TemplateStore (+17 more)

### Community 3 - "desktop/package.json"
Cohesion: 0.06
Nodes (42): dependencies, clsx@^2.1.1, lucide-react@^0.475.0, @monaco-editor/react@^4.7.0, react@^19.0.0, react-dom@^19.0.0, react-router-dom@^7.18.5, tailwind-merge@^3.0.1 (+34 more)

### Community 4 - "TechIcons.tsx"
Cohesion: 0.06
Nodes (68): ClaudeIcon(), CursorRulesIcon(), DockerIcon(), DrizzleIcon(), ElectronIcon(), ExpressIcon(), FastifyIcon(), getFileIcon() (+60 more)

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

### Community 17 - "package.json"
Cohesion: 0.15
Nodes (15): devDependencies, eslint@^10.15.0, @eslint/js@^10.0.1, turbo@^2.11.12, typescript-eslint@^8.73.0, vitest@^3.0.5, name, packageManager (+7 more)

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

### Community 32 - "typescript"
Cohesion: 0.20
Nodes (11): typescript@^5.7.3, devDependencies, @types/node@^22.13.4, typescript@^5.7.3, vitest@^3.0.5, devDependencies, @types/node@^22.13.4, typescript@^5.7.3 (+3 more)

### Community 33 - "2026-11-17-nextgen-archetypes-primitives-and-ai-mcp-enhancements/.openspec.yaml"
Cohesion: 0.50
Nodes (3): date, name, schema

### Community 34 - "core/package.json"
Cohesion: 0.15
Nodes (13): import, types, dependencies, zod@^3.24.2, exports, ./browser, files, main (+5 more)

### Community 35 - "2026-11-18-cli-openspec-ui-templates-and-nextjs-ux/.openspec.yaml"
Cohesion: 0.50
Nodes (3): date, name, schema

### Community 37 - "scripts"
Cohesion: 0.50
Nodes (4): scripts, build, prepack, test

## Knowledge Gaps
- **1 isolated node(s):** `forgestack-desktop`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 215 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ProjectConfig` connect `ProjectConfig` to `App.tsx`, `cli.ts`, `TechIcons.tsx`, `Badge.tsx`?**
  _High betweenness centrality (0.130) - this node is a cross-community bridge._
- **What connects `forgestack-desktop` to the rest of the system?**
  _1 weakly-connected nodes found - possible missing edges._
- **Should `ProjectConfig` be split into smaller, more focused modules?**
  _Cohesion score 0.08418568056648308 - nodes in this community are weakly interconnected._
- **Why does `vitest` connect `ProjectConfig` to `typescript`, `cli.ts`, `core/package.json`, `cli/package.json`, `json-merge.ts`, `package.json`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Why does `react` connect `TechIcons.tsx` to `App.tsx`, `desktop/package.json`, `Badge.tsx`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Should `cli.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07033248081841433 - nodes in this community are weakly interconnected._