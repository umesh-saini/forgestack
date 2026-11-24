# Tasks: Standalone Project Website

## Phase 1: Remove the in-app landing page
- [x] 1.1 Delete `packages/desktop/src/components/landing/`, `src/lib/motion.tsx` and `public/models/`
- [x] 1.2 Root route always renders the Templates Hub; remove `/landing` route and navbar "Showcase" link
- [x] 1.3 Point "Get Desktop App" at GitHub Releases
- [x] 1.4 Remove `three`, `@react-three/fiber`, `@react-three/drei`, `framer-motion`, `@types/three`; delete unused animation CSS
- [x] 1.5 Desktop typechecks and builds

## Phase 2: Website package
- [x] 2.1 Scaffold `packages/website` (Vite + React 19 + Tailwind v4)
- [x] 2.2 Sections: hero, features, verification numbers, stack, CLI, AI setup, screenshots, changelog, contribute/star
- [x] 2.3 Stack section derived from `projectConfigSchema`
- [x] 2.4 Changelog rendered from `CHANGELOG.md`
- [x] 2.5 Responsive (360 px+), dark/light, accessible landmarks and focus states
- [x] 2.6 `pnpm --filter @forgestack/website build` passes; included in root `pnpm build`

## Phase 3: Delivery
- [x] 3.1 GitHub Pages workflow
- [x] 3.2 README links to the site
- [ ] 3.3 Enable GitHub Pages (Settings → Pages → Source: GitHub Actions) after the repository is pushed
