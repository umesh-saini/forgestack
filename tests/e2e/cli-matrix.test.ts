import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  generateProjectVfs,
  TransactionalFlusher,
  type ProjectConfig,
} from '../../packages/core/src/index.js';

describe('E2E Scaffolding Permutation Matrix', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'forgestack-e2e-'));
  });

  afterEach(async () => {
    if (fs.existsSync(tempDir)) {
      await fs.promises.rm(tempDir, { recursive: true, force: true });
    }
  });

  it('Permutation 1: Monorepo + React 19 + Fastify + Postgres (Drizzle) + TanStack Query + AI Rules', async () => {
    const config: ProjectConfig = {
      name: 'mono-fastify-drizzle',
      targetPath: path.join(tempDir, 'mono-fastify-drizzle'),
      topology: 'monorepo',
      frontend: {
        framework: 'react-vite',
        styling: 'tailwind',
        state: 'query',
        uiExtras: { toast: true, icons: true, forms: true },
      },
      backend: {
        framework: 'fastify',
        database: 'postgres',
        orm: 'drizzle',
        container: true,
      },
      aiGovernance: { rules: true, skills: true, openSpec: true },
      packageManager: 'pnpm',
      git: false,
      install: false,
    };

    const vfs = await generateProjectVfs(config);
    const flushResult = await TransactionalFlusher.flush(vfs, config.targetPath);

    expect(flushResult.filesWritten).toBeGreaterThan(45);
    expect(fs.existsSync(path.join(config.targetPath, 'pnpm-workspace.yaml'))).toBe(true);
    expect(fs.existsSync(path.join(config.targetPath, 'turbo.json'))).toBe(true);
    expect(fs.existsSync(path.join(config.targetPath, 'apps/web/src/providers/query-provider.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(config.targetPath, 'apps/api/src/database/schema/users.ts'))).toBe(true);
    expect(fs.existsSync(path.join(config.targetPath, '.agents/skills/anti-ui-slop/SKILL.md'))).toBe(true);
    expect(fs.existsSync(path.join(config.targetPath, '.agents/skills/clean-code-guard/SKILL.md'))).toBe(true);
    expect(fs.existsSync(path.join(config.targetPath, '.cursor/rules/03-brutally-honest-reviewer.mdc'))).toBe(true);
  });

  it('Permutation 2: Monorepo + React 19 + Express + MongoDB (Mongoose) + Redux Toolkit', async () => {
    const config: ProjectConfig = {
      name: 'mono-express-mongo',
      targetPath: path.join(tempDir, 'mono-express-mongo'),
      topology: 'monorepo',
      frontend: {
        framework: 'react-vite',
        styling: 'tailwind',
        state: 'redux',
        uiExtras: { toast: true, icons: true, forms: false },
      },
      backend: {
        framework: 'express',
        database: 'mongodb',
        orm: 'mongoose',
        container: true,
      },
      aiGovernance: { rules: true, skills: true, openSpec: true },
      packageManager: 'pnpm',
      git: false,
      install: false,
    };

    const vfs = await generateProjectVfs(config);
    const flushResult = await TransactionalFlusher.flush(vfs, config.targetPath);

    expect(flushResult.filesWritten).toBeGreaterThan(45);
    expect(fs.existsSync(path.join(config.targetPath, 'apps/web/src/store/slices/auth-slice.ts'))).toBe(true);
    expect(fs.existsSync(path.join(config.targetPath, 'apps/api/src/database/models/user.model.ts'))).toBe(true);
    expect(fs.existsSync(path.join(config.targetPath, 'docker-compose.yml'))).toBe(true);

    const compose = await fs.promises.readFile(path.join(config.targetPath, 'docker-compose.yml'), 'utf-8');
    expect(compose).toContain('mongo:7-alpine');
  });

  it('Permutation 3: Standalone Frontend + React 19 + Zustand + Tailwind', async () => {
    const config: ProjectConfig = {
      name: 'standalone-react-app',
      targetPath: path.join(tempDir, 'standalone-react-app'),
      topology: 'standalone-fe',
      frontend: {
        framework: 'react-vite',
        styling: 'tailwind',
        state: 'zustand',
        uiExtras: { toast: true, icons: true, forms: true },
      },
      backend: {
        framework: 'none',
        database: 'none',
        orm: 'none',
        container: false,
      },
      aiGovernance: { rules: true, skills: true, openSpec: false },
      packageManager: 'pnpm',
      git: false,
      install: false,
    };

    const vfs = await generateProjectVfs(config);
    const flushResult = await TransactionalFlusher.flush(vfs, config.targetPath);

    expect(fs.existsSync(path.join(config.targetPath, 'vite.config.ts'))).toBe(true);
    expect(fs.existsSync(path.join(config.targetPath, 'src/store/use-app-store.ts'))).toBe(true);
    expect(fs.existsSync(path.join(config.targetPath, 'src/lib/utils.ts'))).toBe(true);
    // Should NOT have backend or monorepo files
    expect(fs.existsSync(path.join(config.targetPath, 'apps'))).toBe(false);
    expect(fs.existsSync(path.join(config.targetPath, 'pnpm-workspace.yaml'))).toBe(false);
  });

  it('Permutation 4: Standalone Backend + Node.js ESM + Fastify + PostgreSQL (Prisma)', async () => {
    const config: ProjectConfig = {
      name: 'standalone-api-service',
      targetPath: path.join(tempDir, 'standalone-api-service'),
      topology: 'standalone-be',
      frontend: {
        framework: 'none',
        styling: 'none',
        state: 'none',
        uiExtras: { toast: false, icons: false, forms: false },
      },
      backend: {
        framework: 'fastify',
        database: 'postgres',
        orm: 'prisma',
        container: true,
      },
      aiGovernance: { rules: true, skills: true, openSpec: true },
      packageManager: 'pnpm',
      git: false,
      install: false,
    };

    const vfs = await generateProjectVfs(config);
    const flushResult = await TransactionalFlusher.flush(vfs, config.targetPath);

    expect(fs.existsSync(path.join(config.targetPath, 'src/server.ts'))).toBe(true);
    expect(fs.existsSync(path.join(config.targetPath, 'prisma/schema.prisma'))).toBe(true);
    expect(fs.existsSync(path.join(config.targetPath, 'src/config/env.ts'))).toBe(true);
    expect(fs.existsSync(path.join(config.targetPath, 'src/modules/health/health.routes.ts'))).toBe(true);
    // Should NOT have frontend files
    expect(fs.existsSync(path.join(config.targetPath, 'src/App.tsx'))).toBe(false);
  });

  it('Permutation 5: Native Tauri v2 Desktop + Rust Core + React 19 + Tailwind v4', async () => {
    const config: ProjectConfig = {
      name: 'tauri-desktop-app',
      targetPath: path.join(tempDir, 'tauri-desktop-app'),
      topology: 'tauri-desktop',
      frontend: {
        framework: 'react-vite',
        styling: 'tailwind',
        state: 'query',
        uiExtras: { toast: true, icons: true, forms: true },
      },
      backend: {
        framework: 'none',
        database: 'none',
        orm: 'none',
        container: false,
      },
      aiGovernance: { rules: true, skills: true, openSpec: true, mcp: true },
      packageManager: 'pnpm',
      git: false,
      install: false,
    };

    const vfs = await generateProjectVfs(config);
    const flushResult = await TransactionalFlusher.flush(vfs, config.targetPath);

    expect(flushResult.filesWritten).toBeGreaterThan(30);
    expect(fs.existsSync(path.join(config.targetPath, 'src-tauri/Cargo.toml'))).toBe(true);
    expect(fs.existsSync(path.join(config.targetPath, 'src-tauri/tauri.conf.json'))).toBe(true);
    expect(fs.existsSync(path.join(config.targetPath, 'src-tauri/src/main.rs'))).toBe(true);
    expect(fs.existsSync(path.join(config.targetPath, 'src/App.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(config.targetPath, 'vite.config.ts'))).toBe(true);

    const cargo = await fs.promises.readFile(path.join(config.targetPath, 'src-tauri/Cargo.toml'), 'utf-8');
    expect(cargo).toContain('tauri = { version = "2"');
  });

  it('Permutation 6: AI-Native Agent / RAG Monorepo + pgvector + Better-Auth + tRPC + Playwright + CI/CD + MCP Server', async () => {
    const config: ProjectConfig = {
      name: 'ai-rag-monorepo',
      targetPath: path.join(tempDir, 'ai-rag-monorepo'),
      topology: 'ai-agent-rag',
      frontend: {
        framework: 'react-vite',
        styling: 'tailwind',
        state: 'query',
        uiExtras: { toast: true, icons: true, forms: true },
      },
      backend: {
        framework: 'fastify',
        database: 'postgres',
        orm: 'drizzle',
        container: true,
      },
      auth: 'better-auth',
      rpc: 'trpc',
      queue: 'none',
      testing: { e2e: 'playwright' },
      ci: 'github-actions',
      aiGovernance: { rules: true, skills: true, openSpec: true, mcp: true },
      packageManager: 'pnpm',
      git: false,
      install: false,
    };

    const vfs = await generateProjectVfs(config);
    const flushResult = await TransactionalFlusher.flush(vfs, config.targetPath);

    expect(flushResult.filesWritten).toBeGreaterThan(90);
    expect(fs.existsSync(path.join(config.targetPath, 'apps/api/src/ai/vector-store.ts'))).toBe(true);
    expect(fs.existsSync(path.join(config.targetPath, 'apps/api/src/ai/agent-service.ts'))).toBe(true);
    expect(fs.existsSync(path.join(config.targetPath, 'apps/api/src/modules/chat/chat.routes.ts'))).toBe(true);
    expect(fs.existsSync(path.join(config.targetPath, 'apps/web/src/hooks/use-agent-chat.ts'))).toBe(true);
    expect(fs.existsSync(path.join(config.targetPath, 'apps/web/src/components/chat-interface.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(config.targetPath, 'packages/mcp-server/src/index.ts'))).toBe(true);
    expect(fs.existsSync(path.join(config.targetPath, '.agents/mcp.json'))).toBe(true);
    expect(fs.existsSync(path.join(config.targetPath, '.github/workflows/ci.yml'))).toBe(true);
    expect(fs.existsSync(path.join(config.targetPath, 'playwright.config.ts'))).toBe(true);
  });

  it('Permutation 7: Micro-Frontend Federation + Module Federation + Typed Event-Bus', async () => {
    const config: ProjectConfig = {
      name: 'micro-frontend-app',
      targetPath: path.join(tempDir, 'micro-frontend-app'),
      topology: 'micro-frontend',
      frontend: {
        framework: 'react-vite',
        styling: 'tailwind',
        state: 'query',
        uiExtras: { toast: true, icons: true, forms: true },
      },
      backend: {
        framework: 'none',
        database: 'none',
        orm: 'none',
        container: false,
      },
      aiGovernance: { rules: true, skills: true, openSpec: true },
      packageManager: 'pnpm',
      git: false,
      install: false,
    };

    const vfs = await generateProjectVfs(config);
    const flushResult = await TransactionalFlusher.flush(vfs, config.targetPath);

    expect(fs.existsSync(path.join(config.targetPath, 'apps/shell/vite.config.ts'))).toBe(true);
    expect(fs.existsSync(path.join(config.targetPath, 'apps/remote-dashboard/vite.config.ts'))).toBe(true);
    expect(fs.existsSync(path.join(config.targetPath, 'packages/event-bus/src/index.ts'))).toBe(true);
  });

  it('Permutation 8: Distributed BullMQ Worker + Fastify + Redis Container', async () => {
    const config: ProjectConfig = {
      name: 'worker-queue-app',
      targetPath: path.join(tempDir, 'worker-queue-app'),
      topology: 'distributed-worker',
      frontend: {
        framework: 'none',
        styling: 'none',
        state: 'none',
        uiExtras: { toast: false, icons: false, forms: false },
      },
      backend: {
        framework: 'fastify',
        database: 'postgres',
        orm: 'drizzle',
        container: true,
        processManager: 'bullmq',
      },
      queue: 'bullmq',
      aiGovernance: { rules: true, skills: true, openSpec: true },
      packageManager: 'pnpm',
      git: false,
      install: false,
    };

    const vfs = await generateProjectVfs(config);
    const flushResult = await TransactionalFlusher.flush(vfs, config.targetPath);

    expect(fs.existsSync(path.join(config.targetPath, 'src/worker.ts'))).toBe(true);
    expect(fs.existsSync(path.join(config.targetPath, 'src/queue/task-queue.ts'))).toBe(true);
    expect(fs.existsSync(path.join(config.targetPath, 'docker-compose.yml'))).toBe(true);
    const compose = await fs.promises.readFile(path.join(config.targetPath, 'docker-compose.yml'), 'utf-8');
    expect(compose).toContain('redis:7-alpine');
  });
});
