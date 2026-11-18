# Tasks: Universal AI Agent Skills, Direct MCP Server, and Interactive Showcase Landing

## Phase 1: Universal AI Agent Skills Suite

- [ ] 1.1 Author the authoritative ForgeStack skill specification:
  - [ ] Create `packages/core/src/skills/forgestack/SKILL.md` documenting CLI flags, architecture concepts, VFS manipulation, and custom template development.
- [ ] 1.2 Implement the multi-agent skill generator in `@forgestack/core`:
  - [ ] Support generating:
    - [ ] Shared `.agents/skills/forgestack/SKILL.md`
    - [ ] Antigravity / Gemini CLI (`.agents/skills/forgestack/SKILL.md` and global directory)
    - [ ] Claude Code (`.claude/skills/forgestack/SKILL.md` + root `CLAUDE.md`)
    - [ ] Cursor (`.cursor/rules/forgestack.mdc`)
    - [ ] Windsurf / Devin (`.windsurf/rules/forgestack.md`)
    - [ ] GitHub Copilot (`.github/copilot-instructions.md`)
    - [ ] Cline / Roo Code (`.clinerules`)
- [ ] 1.3 Add CLI command to provision AI skills:
  - [ ] Add `create-forgestack-app --init-ai-skills [tool]` or `npx forgestack init-skills`.
- [ ] 1.4 Add Desktop Studio AI Skill Provisioner in Settings:
  - [ ] In `AppSettingsPage.tsx`, add an interactive "AI Assistant Setup & Skills" card allowing users to select their AI agents and write skills to their workspace in one click.
- [ ] 1.5 Unit tests for skill generator across all target formats.

---

## Phase 2: Direct Zero-OAuth Model Context Protocol (MCP) Server

- [ ] 2.1 Add `@modelcontextprotocol/sdk` to `packages/cli` (or dedicated package `@forgestack/mcp`).
- [ ] 2.2 Implement the stdio MCP server (`packages/cli/src/mcp/server.ts`):
  - [ ] Tool: `forgestack_list_presets` (returns curated blueprints and presets).
  - [ ] Tool: `forgestack_get_stack_options` (introspects all available slices, frameworks, and databases).
  - [ ] Tool: `forgestack_validate_config` (validates project configurations against Zod schemas).
  - [ ] Tool: `forgestack_preview_vfs` (in-memory AST compilation returning tree and file previews).
  - [ ] Tool: `forgestack_scaffold_project` (disk synthesis with git and install hooks).
- [ ] 2.3 Expose executable CLI binary:
  - [ ] Add `packages/cli/bin/mcp-server.js` and npm bin entry `forgestack-mcp`.
- [ ] 2.4 Provide client setup configurations:
  - [ ] Claude Desktop setup (`claude_desktop_config.json`).
  - [ ] Cursor MCP config (`.cursor/mcp.json`).
  - [ ] Antigravity MCP config.
- [ ] 2.5 Write automated tests verifying stdio JSON-RPC tool calls and error boundary handling.

---

## Phase 3: Interactive Flagship Showcase Landing Page

- [ ] 3.1 Design motion & layout tokens matching the Codezy aesthetic (`codezy/app/(public)/page.tsx`):
  - [ ] Kinetic typography, ambient background gradients, and smooth scroll effects.
- [ ] 3.2 Build specialized landing components in `packages/desktop/src/components/landing/`:
  - [ ] `LandingPage.tsx`: Top-level assembly with sticky navigation and scroll progress.
  - [ ] `HeroKinetic.tsx`: Animated headline, terminal copy box (`npx create-forgestack-app`), and stack badge pills.
  - [ ] `VelocityMarquee.tsx`: Infinite scrolling marquee displaying technology logos and stack features.
  - [ ] `InteractiveStackSimulator.tsx`: Live 4-in-1 in-browser stack toggle playground showing real-time architecture feedback.
  - [ ] `DesktopAppShowcase.tsx`: Realistic styled desktop app mockups with real studio screenshots.
  - [ ] `FeatureSpotlight.tsx`: Deep-dive cards into AST Compositor, Zero-Collision In-Memory VFS, Day-One AI Governance, and Tauri v2 Engine.
  - [ ] `CompetitorMatrix.tsx`: Feature comparison matrix (ForgeStack vs create-t3-app vs Nx vs manual boilerplates).
  - [ ] `ChangelogTimeline.tsx`: Interactive release history (`v1.0.0`, `v1.1.0-preview`) with granular slice additions.
  - [ ] `DownloadInstallHub.tsx`: Linux `.deb`, `.rpm`, `.AppImage` download CTAs and terminal install instructions.
  - [ ] `LandingFooter.tsx`: Clean footer with GitHub repo links, documentation, and version badge.
- [ ] 3.3 Capture and integrate high-resolution Desktop App Studio screenshots into showcase assets.
- [ ] 3.4 Wire routing and navigation:
  - [ ] Register `/landing` route in `packages/desktop/src/App.tsx`.
  - [ ] Add "Overview / Showcase" link in `StudioNavbar.tsx` for seamless discovery.
- [ ] 3.5 Verify responsive layout on mobile, tablet, and desktop viewports across all 4 themes.

---

## Phase 4: Integration, Verification & OpenSpec Sync

- [ ] 4.1 Run full workspace build (`pnpm build`).
- [ ] 4.2 Run full test suite (`pnpm test`) ensuring 100% test pass rate.
- [ ] 4.3 Run typecheck (`pnpm typecheck`) and linter (`pnpm lint`).
- [ ] 4.4 Update graphify knowledge graph (`graphify update .`).
- [ ] 4.5 Validate OpenSpec change with `openspec validate`.
