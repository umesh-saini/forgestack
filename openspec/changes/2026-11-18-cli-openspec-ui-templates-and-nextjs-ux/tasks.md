# Implementation Tasks: CLI OpenSpec-Inspired UI, Curated & Reusable Templates, and Next.js Getting Started UX

## Phase 1: Next.js Getting Started Ergonomics & Directory Resolution

- [x] 1.1 Implement Positional Directory & Current Folder (`.`) Resolution:
  - [x] Update `createCli` in `packages/cli/src/cli.ts` to accept optional positional argument `[dir]`.
  - [x] If `dir` is `.`, target `process.cwd()` and use `path.basename(process.cwd())` as default project name.
  - [x] If `dir` is a name, resolve target path to `path.resolve(process.cwd(), dir)`.
  - [x] If directory exists and contains files, prompt confirmation in interactive mode or verify `--force` / `--overwrite` flag.
  - [x] Update `packages/cli/src/prompts/wizard.ts` project name prompt to support entering `.` to scaffold in current directory.
- [x] 1.2 Implement Instant Generation with `--yes` / `-y` Flag:
  - [x] Add `-y, --yes` option to commander CLI in `packages/cli/src/cli.ts`.
  - [x] When `-y` is passed without other flags, bypass wizard prompts and scaffold using the default curated Enterprise Monorepo stack.
  - [x] When `-y` is combined with specific flags (e.g. `--topology tauri-desktop -y`), fill unspecified options with safe defaults.
- [x] 1.3 Verify NPM / NPX Executable Packaging:
  - [x] Verify `packages/cli/bin/create-forgestack-app.js` shebang and permissions.
  - [x] Verify `bin` aliases in `package.json` (`create-forgestack-app` and `forgestack`).
  - [x] Add prepack build script ensuring `dist/` is always up to date.

## Phase 2: OpenSpec-Inspired Terminal UI (TUI) & Searchable Multiselect

- [x] 2.1 Build OpenSpec Welcome Splash Screen:
  - [x] Create `packages/cli/src/ui/splash.ts`.
  - [x] Render styled ASCII banner, version header, configured capability checklist, and quickstart commands matching OpenSpec TUI.
  - [x] Hook splash screen display at the entry point of interactive execution.
- [x] 2.2 Create Searchable / Filterable Multi-Select TUI Component:
  - [x] Create `packages/cli/src/ui/searchable-multiselect.ts` using Node.js readline/raw terminal mode.
  - [x] Support keyboard navigation (`↑`/`↓`), selection toggling (`Space`), real-time character typing filter buffer (`Search: [type to filter]`), backspace character removal, and `Enter` confirmation.
  - [x] Support pagination `(1/3)` when available tools/skills exceed viewport height.
- [x] 2.3 Integrate Searchable Multiselect into Wizard:
  - [x] Replace standard clack multiselect for AI skills and tool integrations in `wizard.ts` with the new searchable selector.
  - [x] Pre-populate detected/recommended skills with visual checkboxes and active tags.
- [x] 2.4 Enhance Scaffolding Reporter & Post-Run Summary:
  - [x] Update `packages/cli/src/ui/reporter.ts` with high-contrast summary cards, files written badge, and contextual next-step commands.

## Phase 3: Curated Default Templates & Setup Flow

- [x] 3.1 Create Curated Template Registry in CLI:
  - [x] Create `packages/cli/src/templates/curated.ts`.
  - [x] Register battle-tested presets: `enterprise-monorepo`, `ai-agent-rag`, `tauri-desktop`, `nextjs-fullstack`, `micro-frontend`, `distributed-worker`, `standalone-fe`, `standalone-be`.
- [x] 3.2 Add Setup Flow Fork in Wizard (`wizard.ts`):
  - [x] Add initial prompt: `Choose your setup flow`:
    - `Use a Curated Default Template (Instant Setup)`
    - `Custom Stack Wizard (Configure every layer)`
    - `Load a Saved Custom Template`
  - [x] Selecting a curated template immediately stages and scaffolds the preset without asking 15+ individual questions.
- [x] 3.3 Add `--template <name>` / `-t <name>` CLI Flag:
  - [x] Add `-t, --template <name>` option to commander CLI.
  - [x] Allow passing any curated or saved template identifier directly from the terminal command.

## Phase 4: Custom Template Persistence & Management

- [x] 4.1 Implement Local Template Catalog Manager:
  - [x] Create `packages/cli/src/templates/store.ts`.
  - [x] Read/write template definitions from `~/.forgestack/templates.json` with schema validation and directory fallback.
  - [x] Provide functions: `listSavedTemplates()`, `saveTemplate(name, description, config)`, `getTemplate(idOrName)`, `deleteTemplate(idOrName)`.
- [x] 4.2 Support Template Saving during Scaffolding:
  - [x] Add `--save-template <name>` flag to commander in `packages/cli/src/cli.ts`.
  - [x] Add post-wizard prompt in interactive mode: `Save this stack configuration as a reusable template? (y/N)`.
  - [x] Persist saved template to local user store with creation timestamp.
- [x] 4.3 Add Template CLI Subcommands (`forgestack template ...`):
  - [x] Add `forgestack template list` command displaying ASCII table of curated and saved templates.
  - [x] Add `forgestack template delete <name>` command to remove a saved template.

## Phase 5: Comprehensive Flag Coverage & Compatibility Validation

- [x] 5.1 Ensure 100% Flag Coverage for All Generator Options:
  - [x] Add `--rules / --no-rules`, `--skills / --no-skills`, `--openspec / --no-openspec`.
  - [x] Add `--force` / `--overwrite` to bypass non-empty directory checks.
  - [x] Ensure every single `ProjectConfig` property can be set without an interactive prompt.
- [x] 5.2 Validate Flag Combinations & Provide Actionable Feedback:
  - [x] Add strict validation for template names, invalid path characters, and conflicting flags.
  - [x] Ensure non-interactive error messages explicitly state which flags conflict and what corrective flags to pass.

## Phase 6: Verification & Test Matrix

- [x] 6.1 Author Unit Tests for Positional Directory & Current Directory Resolution:
  - [x] Create `packages/cli/src/__tests__/directory-resolver.test.ts` testing `my-app`, `.`, existing folder collisions, and `--force`.
- [x] 6.2 Author Unit Tests for Template Store & Persistence:
  - [x] Create `packages/cli/src/__tests__/template-store.test.ts` testing save, list, get, and delete operations.
- [x] 6.3 Author CLI Integration Tests:
  - [x] Create `packages/cli/src/__tests__/cli-templates.test.ts` testing `--yes`, `--template <preset>`, and `--save-template`.
- [x] 6.4 Validate OpenSpec change proposal:
  - [x] Run `npx openspec validate 2026-11-18-cli-openspec-ui-templates-and-nextjs-ux`.
- [x] 6.5 Full Test Suite & Monorepo Build:
  - [x] Run `pnpm test` and `pnpm build` across all workspaces to guarantee zero regressions.
