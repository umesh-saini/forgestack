# Design: Standalone Project Website

## Stack

Vite + React 19 + Tailwind CSS v4: the same toolchain as `@forgestack/desktop`, so no new tooling enters the monorepo and the lockfile barely changes. Output is a static `dist/` deployable anywhere.

## Single sources of truth

| Content | Source | Why |
|---|---|---|
| Supported options | `projectConfigSchema` from `@forgestack/core/browser` | Adding an option to the engine updates the site automatically |
| Changelog | `/CHANGELOG.md` imported with Vite `?raw` and parsed by a ~30-line renderer (headings and bullets only) | One file to edit per release; no markdown dependency |
| Screenshots | `packages/desktop/public/screenshots/*` imported directly | No duplicated binaries |

## Structure

One page, anchored sections (`#features`, `#stack`, `#cli`, `#ai`, `#changelog`). No router.

## Theming & accessibility

- Colors are CSS custom properties; dark/light follows `prefers-color-scheme`.
- Semantic landmarks (`header`, `main`, `section`, `footer`), visible focus rings, alt text on screenshots, sufficient contrast in both themes.
- Layout works from 360 px wide; code blocks scroll horizontally instead of overflowing the page.

## Deployment

`.github/workflows/website.yml` builds `@forgestack/website` and publishes `packages/website/dist` to GitHub Pages. The Vite `base` comes from `WEBSITE_BASE` (default `/forgestack/` for a project page).
