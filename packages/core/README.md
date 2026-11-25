# @forgestk/core

> Core Virtual File System (VFS), slice-based recipe compositor, and AI-governance engine for [ForgeStack](https://umesh-saini.github.io/forgestack/).

[![npm version](https://img.shields.io/npm/v/@forgestk/core.svg?style=flat-square)](https://www.npmjs.com/package/@forgestk/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://github.com/umesh-saini/forgestack/blob/main/LICENSE)

[Website](https://umesh-saini.github.io/forgestack/) · [GitHub](https://github.com/umesh-saini/forgestack) · [`@forgestk/cli`](https://www.npmjs.com/package/@forgestk/cli)

---

## Overview

`@forgestk/core` powers the ForgeStack CLI, MCP server (`forgestack-mcp`), and Desktop Studio. Instead of cloning static template repositories, it composes projects **in memory** from modular feature slices onto a `VirtualFileSystem`, validates option combinations, and flushes to disk only once the entire file tree is consistent.

### Key Capabilities
- **In-Memory Virtual File System (`VirtualFileSystem`)** — Preview, inspect, and diff generated files before writing anything to disk.
- **Composable Feature Slices (`RecipeCompositor`)** — Monorepos, Next.js 15, React + Vite, Tauri v2, Electron, Fastify/Express/Hono, Drizzle/Prisma/Mongoose, Better-Auth, tRPC, BullMQ, Playwright, Docker, and GitHub Actions.
- **Strict Validation (`normalizeConfig`)** — Rejects incompatible database/ORM/topology combinations early with clear errors.
- **Browser-Safe Entrypoint (`@forgestk/core/browser`)** — Run VFS composition directly in web/desktop UIs without Node `fs` dependencies.
- **AI Skills Provisioner (`provisionAgentSkills`)** — Generates rules and skills for 40 AI coding assistants.

---

## Installation

```bash
pnpm add @forgestk/core
# or
npm install @forgestk/core
```

For the CLI and local MCP server, use [`@forgestk/cli`](https://www.npmjs.com/package/@forgestk/cli):

```bash
npx -p @forgestk/cli create-forgestack-app my-app
```

---

## Programmatic Usage

```ts
import {
  generateProjectVfs,
  normalizeConfig,
  flushVfsToDisk,
  type ProjectConfig,
} from '@forgestk/core';

const config = normalizeConfig({
  projectName: 'my-app',
  topology: 'monorepo',
  packageManager: 'pnpm',
  // ...stack options
} as ProjectConfig);

const vfs = await generateProjectVfs(config);

// Inspect in memory
for (const file of vfs.getAllFiles()) {
  console.log(file.path);
}

// Or write to disk
await flushVfsToDisk(vfs, './my-app');
```

---

## 📄 License

MIT © [ForgeStack Contributors](https://github.com/umesh-saini/forgestack/blob/main/LICENSE)
