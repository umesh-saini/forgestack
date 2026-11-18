# Tasks: Universal AI Agent Skills, Direct MCP Server, and Interactive Showcase Landing

## Phase 1: Universal AI Agent Skills Suite

- [x] 1.1 Author the authoritative ForgeStack skill specification:
  - [x] Create `packages/core/src/skills/forgestack/SKILL.md` documenting CLI flags, architecture concepts, VFS manipulation, and custom template development.
- [x] 1.2 Implement the multi-agent skill generator in `@forgestack/core`:
  - [x] Support generating:
    - [x] Shared `.agents/skills/forgestack/SKILL.md`
    - [x] Antigravity / Gemini CLI (`.agents/skills/forgestack/SKILL.md` and global directory)
    - [x] Claude Code (`.claude/skills/forgestack/SKILL.md` + root `CLAUDE.md`)
    - [x] Cursor (`.cursor/rules/forgestack.mdc`)
    - [x] Windsurf / Devin (`.windsurf/rules/forgestack.md`)
    - [x] GitHub Copilot (`.github/copilot-instructions.md`)
    - [x] Cline / Roo Code (`.clinerules`)
- [x] 1.3 Add CLI command to provision AI skills:
  - [x] Add `create-forgestack-app --init-ai-skills [tool]` or `npx forgestack init-skills`.
- [x] 1.4 Add Desktop Studio AI Skill Provisioner in Settings:
  - [x] In `AppSettingsPage.tsx`, add an interactive "Universal AI Agent Skills Provisioner" card allowing users to select their AI agents and write skills to their workspace in one click.
- [x] 1.5 Unit tests for skill generator across all target formats (`packages/core/src/skills/__tests__/agent-provisioner.test.ts`).

---

## Phase 2: Direct Zero-OAuth Model Context Protocol (MCP) Server

- [x] 2.1 Add `@modelcontextprotocol/sdk` to `packages/cli`.
- [x] 2.2 Implement the stdio MCP server (`packages/cli/src/mcp/server.ts`):
  - [x] Tool: `forgestack_list_presets` (returns curated blueprints and presets).
  - [x] Tool: `forgestack_get_stack_options` (introspects all available slices, frameworks, and databases).
  - [x] Tool: `forgestack_validate_config` (validates project configurations against Zod schemas).
  - [x] Tool: `forgestack_preview_vfs` (in-memory AST compilation returning tree and file previews).
  - [x] Tool: `forgestack_scaffold_project` (disk synthesis with git and install hooks).
- [x] 2.3 Expose executable CLI binary:
  - [x] Add `packages/cli/bin/forgestack-mcp.js` and npm bin entry `forgestack-mcp`.
- [x] 2.4 Provide client setup configurations (Claude Desktop, Cursor, Antigravity).
- [x] 2.5 Write automated tests verifying stdio JSON-RPC tool calls and error boundary handling (`packages/cli/src/__tests__/mcp-server.test.ts`).

---

## Phase 3: Interactive Flagship Showcase Landing Page

- [x] 3.1 Design motion & layout tokens matching the Codezy aesthetic (`codezy/app/(public)/page.tsx`):
  - [x] Kinetic typography, ambient background gradients, and smooth scroll effects.
- [x] 3.2 Build specialized landing components in `packages/desktop/src/components/landing/`:
  - [x] `LandingPage.tsx`: Top-level assembly with sticky navigation and scroll progress.
  - [x] `HeroKinetic.tsx`: Animated headline, terminal copy box (`npx create-forgestack-app`), and stack badge pills.
  - [x] `VelocityMarquee.tsx`: Infinite scrolling marquee displaying technology logos and stack features.
  - [x] `InteractiveStackSimulator.tsx`: Live 4-in-1 in-browser stack toggle playground showing real-time architecture feedback.
  - [x] `DesktopAppShowcase.tsx`: Realistic styled desktop app mockups with real studio screenshots and tabs.
  - [x] `FeatureSpotlight.tsx`: Deep-dive cards into AST Compositor, Zero-Collision In-Memory VFS, Day-One AI Governance, and Tauri v2 Engine.
  - [x] `CompetitorMatrix.tsx`: Feature comparison matrix (ForgeStack vs create-t3-app vs Nx vs manual boilerplates).
  - [x] `ChangelogTimeline.tsx`: Interactive release history (`v1.0.0`, `v1.1.0-preview`) with granular slice additions.
  - [x] `DownloadInstallHub.tsx`: Linux `.deb`, `.rpm`, `.AppImage` download CTAs and terminal install instructions.
  - [x] `LandingFooter.tsx`: Clean footer with GitHub repo links, documentation, and version badge.
- [x] 3.3 Capture and integrate high-resolution Desktop App Studio mockups into showcase assets.
- [x] 3.4 Wire routing and navigation:
  - [x] Register `/landing` route in `packages/desktop/src/App.tsx`.
  - [x] Add "Showcase" link in `StudioNavbar.tsx` for seamless discovery.
- [x] 3.5 Verify responsive layout on mobile, tablet, and desktop viewports across all 4 themes.

---

## Phase 4: Integration, Verification & OpenSpec Sync

- [x] 4.1 Run full workspace build (`pnpm build`).
- [x] 4.2 Run full test suite (`pnpm test`) ensuring 100% test pass rate (42 suites, 138 tests).
- [x] 4.3 Run typecheck (`pnpm typecheck`) and linter (`pnpm lint`).
- [x] 4.4 Update graphify knowledge graph (`graphify update .`).
- [x] 4.5 Validate OpenSpec change with `openspec validate`.
