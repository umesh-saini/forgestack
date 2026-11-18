---
name: ui-update
description: Modernize and animate the ForgeStack Desktop Studio UI (Tauri v2 + React 19 + Tailwind v4 webview). Use when adding motion, scroll-driven sections, or react-three-fiber 3D figures to the desktop app, or when the landing/studio UI needs a visual refresh. Covers design tokens, framer-motion patterns, the nine-figure Three.js showcase, and the build/verify loop.
---

# ForgeStack Desktop UI Update Bot

A reusable, repeatable procedure for modernizing the `@forgestack/desktop` UI so it stops reading as "AI generated" and gains real motion + a scroll-driven 3D centerpiece. Follow it end-to-end for a refresh, or pull the relevant section for a targeted change.

---

## 1. What lives where

- Package: `packages/desktop` — React 19 + Vite 6 + Tailwind v4, served by Tauri v2 (`pnpm desktop:dev`) or browser (`pnpm desktop:web` → http://localhost:1420).
- Entry: `packages/desktop/src/main.tsx` → `App.tsx` (HashRouter). Routes: `/` and `/landing` show `LandingPage`; `/hub` shows `HomeTemplatesDashboard`; `/new` shows `StepperWizard` + `VsCodeWorkspace`.
- Landing sections: `packages/desktop/src/components/landing/` (`HeroKinetic`, `VelocityMarquee`, `InteractiveStackSimulator`, `DesktopAppShowcase`, `FeatureSpotlight`, `CompetitorMatrix`, `ChangelogTimeline`, `DownloadInstallHub`, `LandingFooter`, plus the motion + 3D pieces this bot adds).
- Design tokens: `packages/desktop/src/index.css` — theme CSS variables (`--bg-main`, `--bg-surface`, `--bg-card`, `--bg-card-subtle`, `--text-main`, `--text-muted`, `--accent`, `--accent-bg`, `--accent-border`, `--border-color`, `--border-hover`) per `.theme-dark | .theme-midnight | .theme-matrix | .theme-light`. Always read accent color from these vars, never hardcode a hex, so all four themes stay correct.

## 2. Motion stack

- `framer-motion` for entrance, hover, `whileInView` reveals, scroll-linked parallax (`useScroll` + `useTransform`), and a top scroll-progress bar (`useScroll` on the root + a `motion.div` scaleX).
- `@react-three/fiber` (R3F v9, React 19) + `@react-three/drei` for the 3D figures. `three` is the renderer; `@types/three` is a dev dep for TS.
- Conventions:
  - Wrap one-off reveals in the shared `<Reveal>` component (this bot ships it) instead of repeating `whileInView` props.
  - Drive R3F transforms from scroll: `useScroll({ target, offset: ["start start", "end end"] })` → `useSpring(scrollYProgress)` → write into a `useRef` the R3F `useFrame` loop reads. Keep the heavy math in `useFrame`, not React state.
  - `frameloop="always"` only where continuous float is needed; otherwise `"demand"` to save battery in the desktop webview.

## 3. The nine-figure showcase pattern

A sticky mid-landing section where vertical scroll moves nine 3D figures. Each figure maps to a ForgeStack preset/feature.

- Outer track: `relative h-[400vh]` (provides the scroll distance). Inner sticky: `sticky top-0 h-screen` holds the `<Canvas>` plus the heading/label overlay.
- Nine geometries (`THREE.IcosahedronGeometry`, `TorusKnotGeometry`, `BoxGeometry`, `DodecahedronGeometry`, `SphereGeometry`, `ConeGeometry`, `TorusGeometry`, `OctahedronGeometry`, `CylinderGeometry`) arranged along X; scroll progress slides the group along X so the active figure centers, while drei `<Float>` adds idle bob.
- Perf: one Canvas, instanced meshes not required (9 meshes is cheap), `dpr={[1, 1.5]}`, `gl={{ antialias: true }}`, `frameloop="always"`. Read `--accent` from `getComputedStyle(document.documentElement)` once at mount and fall back to `#fb5c0b`.
- Accessibility / perf escape hatches: respect `prefers-reduced-motion` (disable float + scroll-driven motion, show a static grid), and keep the Canvas out of the Tauri build path if WebGL is unavailable (it is in all supported Tauri webviews).

## 4. Anti-patterns (the "don't look AI generated" rules)

- No fixed light-mode-only colors. Use `var(--text-main)`, `var(--accent)`, etc. The landing defaults to dark but the app supports a light theme.
- No wall of identical fade-up cards. Vary the reveal distance, stagger, and the accent per section.
- Motion is meaning, not decoration: parallax ties to scroll; reveals confirm a new section arrived; the 3D figures tie to the scroll position. Skip looping spinners that explain nothing.
- No `any` (project rule). R3F refs are `THREE.Group`, materials `THREE.MeshStandardMaterial`.
- Don't block the build: R3F/drei import from `"@react-three/fiber"` / `"@react-three/drei"`; keep the Canvas client-only (the app is a SPA, so no SSR guard needed, but never import three at module top-level in a way that breaks `tsc`).

## 5. Build & verify (do this before declaring done)

```bash
# from repo root
pnpm --filter @forgestack/desktop exec tsc --noEmit   # types must pass
pnpm --filter @forgestack/desktop build               # tsc -b && vite build
pnpm desktop:web                                      # http://localhost:1420, eyeball / and /landing
```

A green `tsc --noEmit` + `vite build` is the minimum bar. `desktop:web` is the visual check.

## 6. Files this bot owns

- `packages/desktop/src/lib/motion.ts` — `<Reveal>`, `useThemeAccent`, scroll-progress hook.
- `packages/desktop/src/components/landing/ScrollProgress.tsx` — top-of-page progress bar.
- `packages/desktop/src/components/landing/ThreeFigureShowcase.tsx` — the nine-figure sticky 3D section.
- `packages/desktop/src/components/landing/HeroKinetic.tsx` — rewritten with framer-motion parallax + entrance.
- `packages/desktop/src/components/landing/LandingPage.tsx` — wires in the new pieces.
