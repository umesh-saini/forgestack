# Change Proposal: Standalone Project Website

## Why

The desktop app shipped a marketing "showcase" landing page inside the product. That page:

- Added `three`, `@react-three/fiber`, `@react-three/drei` and `framer-motion` to an app whose users never see it (2.1 MB main bundle before lazy-loading).
- Mixed two audiences in one codebase: people *evaluating* ForgeStack and people *using* the studio.
- Had no home outside the desktop binary, so there was no public URL to share, link from the README, or deploy.

## What Changes

- **Remove** the landing page, its 3D models, `lib/motion.tsx` and the four 3D/animation dependencies from `@forgestack/desktop`. The desktop root route always shows the Templates Hub.
- **Add** `packages/website` (`@forgestack/website`): a small static site that explains the project and nothing else.
  - Hero with a copyable `npx` command
  - Feature overview and the measured verification numbers
  - Supported stack, derived from `@forgestack/core`'s config schema so it cannot drift
  - CLI examples
  - AI tool setup (MCP + skills) for Claude Code, Codex, Antigravity, Cursor, Gemini CLI and others
  - Changelog, rendered from the repository's `CHANGELOG.md`
  - Desktop screenshots, GitHub star / issue / PR calls to action
- **Add** a GitHub Pages workflow that deploys the site on push to the default branch.

## Non-goals

- No CMS, blog, docs search or i18n.
- No 3D, scroll-jacking or heavy animation; the page must stay fast on low-end machines.
- No duplicated content sources: the stack list comes from core, the changelog from `CHANGELOG.md`.

## Supersedes

The `interactive-landing` capability from `2026-11-18-universal-ai-skills-mcp-and-interactive-landing` (landing page inside the desktop app at `/landing`).
