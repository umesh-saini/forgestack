import * as p from '@clack/prompts';
import fs from 'node:fs';
import path from 'node:path';
import color from 'picocolors';
import type { ProjectConfig } from '@forgestack/core';

export async function runInteractiveWizard(initialName?: string): Promise<ProjectConfig> {
  p.intro(color.bgCyan(color.black(' ForgeStack App Generator ')));

  // 1. Project Name & Target Path
  const projectName = await p.text({
    message: 'What is your project name?',
    placeholder: 'my-app',
    defaultValue: initialName || 'my-app',
    validate: (value) => {
      if (!value || value.trim().length === 0) {
        return 'Project name cannot be empty.';
      }
      if (!/^[a-z0-9-_]+$/.test(value.trim())) {
        return 'Project name must contain only lowercase alphanumeric characters, dashes, or underscores.';
      }
      const targetDir = path.resolve(process.cwd(), value.trim());
      if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
        return `Directory '${value.trim()}' already exists and is not empty.`;
      }
    },
  });

  if (p.isCancel(projectName)) {
    p.cancel('Scaffolding cancelled.');
    process.exit(0);
  }

  const sanitizedName = (projectName as string).trim();
  const targetPath = path.resolve(process.cwd(), sanitizedName);

  // 2. Architecture Topology
  const topology = await p.select({
    message: 'Select project architecture topology:',
    options: [
      {
        value: 'monorepo',
        label: 'Enterprise Monorepo (pnpm + Turborepo)',
        hint: 'Recommended: apps/web, apps/api, @repo/contracts, @repo/ui',
      },
      {
        value: 'ai-agent-rag',
        label: 'AI-Native Agent / RAG Monorepo (pgvector + Tool Calling)',
        hint: 'apps/web + apps/api with vector search, streaming chat & MCP',
      },
      {
        value: 'micro-frontend',
        label: 'Micro-Frontend Federation (Module Federation + Shared Bus)',
        hint: 'apps/shell host + apps/remote-dashboard + @repo/event-bus',
      },
      {
        value: 'nextjs-fullstack',
        label: 'Next.js 15 Full-Stack (App Router + Server Actions)',
        hint: 'Modern SSR/RSC with Tailwind CSS v4 & Route Handlers',
      },
      {
        value: 'tauri-desktop',
        label: 'Native Desktop App (Tauri v2 + Rust + React 19)',
        hint: 'High-performance cross-platform desktop with secure IPC',
      },
      {
        value: 'electron-desktop',
        label: 'Electron Desktop App (electron-vite + React 19)',
        hint: 'Secure IPC contextBridge with profile:create & log:getAll',
      },
      {
        value: 'distributed-worker',
        label: 'Distributed Worker Queue (Fastify + BullMQ + Redis)',
        hint: 'Background task processing worker with Redis queue',
      },
      {
        value: 'standalone-fe',
        label: 'Standalone Frontend Only',
        hint: 'Single-package React 19 client application',
      },
      {
        value: 'standalone-be',
        label: 'Standalone Backend Only',
        hint: 'Single-package Node.js ESM server application',
      },
    ],
    initialValue: 'monorepo',
  });

  if (p.isCancel(topology)) {
    p.cancel('Scaffolding cancelled.');
    process.exit(0);
  }

  const selectedTopology = topology as
    | 'monorepo'
    | 'ai-agent-rag'
    | 'micro-frontend'
    | 'standalone-fe'
    | 'standalone-be'
    | 'tauri-desktop'
    | 'electron-desktop'
    | 'distributed-worker'
    | 'nextjs-fullstack';

  const includeFrontend =
    selectedTopology !== 'standalone-be' &&
    selectedTopology !== 'distributed-worker';

  const includeBackend =
    selectedTopology !== 'standalone-fe' &&
    selectedTopology !== 'electron-desktop' &&
    selectedTopology !== 'tauri-desktop' &&
    selectedTopology !== 'micro-frontend' &&
    selectedTopology !== 'nextjs-fullstack';

  // 3. Frontend Features (if FE included)
  let feStyling: 'tailwind' | 'none' = 'tailwind';
  let feState: 'query' | 'redux' | 'zustand' | 'none' = 'query';
  let feExtras = { toast: true, icons: true, forms: true };

  if (includeFrontend) {
    const stateChoice = await p.select({
      message: 'Choose frontend state & data management:',
      options: [
        { value: 'query', label: 'TanStack Query v5 (Recommended for Server State)' },
        { value: 'redux', label: 'Redux Toolkit + React-Redux (Global Client State)' },
        { value: 'zustand', label: 'Zustand (Lightweight Reactive Store)' },
        { value: 'none', label: 'Standard React State (useState / useReducer)' },
      ],
      initialValue: 'query',
    });

    if (p.isCancel(stateChoice)) {
      p.cancel('Scaffolding cancelled.');
      process.exit(0);
    }
    feState = stateChoice as typeof feState;

    const extrasChoice = await p.multiselect({
      message: 'Select frontend enhancements:',
      options: [
        { value: 'tailwind', label: 'Tailwind CSS v4 (Styling & Design Tokens)' },
        { value: 'toast', label: 'Sonner Toast Notifications' },
        { value: 'icons', label: 'Lucide React Icons' },
        { value: 'forms', label: 'React Hook Form + Zod Validation' },
      ],
      initialValues: ['tailwind', 'toast', 'icons', 'forms'],
      required: false,
    });

    if (p.isCancel(extrasChoice)) {
      p.cancel('Scaffolding cancelled.');
      process.exit(0);
    }

    const selectedExtras = extrasChoice as string[];
    feStyling = selectedExtras.includes('tailwind') ? 'tailwind' : 'none';
    feExtras = {
      toast: selectedExtras.includes('toast'),
      icons: selectedExtras.includes('icons'),
      forms: selectedExtras.includes('forms'),
    };
  }

  // 4. Backend Features (if BE included)
  let beFramework: 'fastify' | 'express' | 'hono' | 'none' = 'fastify';
  let beDatabase: 'postgres' | 'mongodb' | 'sqlite' | 'none' = 'postgres';
  let beOrm: 'drizzle' | 'prisma' | 'mongoose' | 'none' = 'drizzle';
  let beContainer = true;

  if (includeBackend) {
    const frameworkChoice = await p.select({
      message: 'Select backend HTTP framework:',
      options: [
        { value: 'fastify', label: 'Fastify (High Performance & Modern Schema Architecture)' },
        { value: 'hono', label: 'Hono (Ultra-Lightweight & Cloudflare/Node.js Multi-Runtime)' },
        { value: 'express', label: 'Express (Classic Node.js HTTP Ecosystem)' },
      ],
      initialValue: 'fastify',
    });

    if (p.isCancel(frameworkChoice)) {
      p.cancel('Scaffolding cancelled.');
      process.exit(0);
    }
    beFramework = frameworkChoice as typeof beFramework;

    const dbChoice = await p.select({
      message: 'Select database engine & ORM / ODM:',
      options: [
        { value: 'postgres-drizzle', label: 'PostgreSQL + Drizzle ORM (Type-Safe & Fast Cold Starts)' },
        { value: 'postgres-prisma', label: 'PostgreSQL + Prisma ORM (Schema-Driven Migrations)' },
        { value: 'sqlite-drizzle', label: 'SQLite + Drizzle ORM (Local Embedded Zero-Config Database)' },
        { value: 'mongodb-mongoose', label: 'MongoDB + Mongoose (Document Database with Pooling)' },
        { value: 'none', label: 'None (In-Memory / Stateless API)' },
      ],
      initialValue: 'postgres-drizzle',
    });

    if (p.isCancel(dbChoice)) {
      p.cancel('Scaffolding cancelled.');
      process.exit(0);
    }

    if (dbChoice === 'postgres-drizzle') {
      beDatabase = 'postgres';
      beOrm = 'drizzle';
    } else if (dbChoice === 'postgres-prisma') {
      beDatabase = 'postgres';
      beOrm = 'prisma';
    } else if (dbChoice === 'sqlite-drizzle') {
      beDatabase = 'sqlite';
      beOrm = 'drizzle';
    } else if (dbChoice === 'mongodb-mongoose') {
      beDatabase = 'mongodb';
      beOrm = 'mongoose';
    } else {
      beDatabase = 'none';
      beOrm = 'none';
    }

    if (beDatabase !== 'none' && beDatabase !== 'sqlite') {
      const containerChoice = await p.confirm({
        message: 'Generate Docker Compose and multi-stage Dockerfile for database?',
        initialValue: true,
      });

      if (p.isCancel(containerChoice)) {
        p.cancel('Scaffolding cancelled.');
        process.exit(0);
      }
      beContainer = Boolean(containerChoice);
    } else {
      beContainer = false;
    }
  }

  // 5. Auth & RPC Primitives
  let authProvider: 'better-auth' | 'none' = 'none';
  if (
    selectedTopology === 'monorepo' ||
    selectedTopology === 'nextjs-fullstack' ||
    selectedTopology === 'ai-agent-rag' ||
    includeBackend
  ) {
    const authChoice = await p.select({
      message: 'Choose authentication provider:',
      options: [
        { value: 'better-auth', label: 'Better-Auth (TypeScript-first Auth & Session Management)' },
        { value: 'none', label: 'None (Public API / Custom Auth)' },
      ],
      initialValue: 'better-auth',
    });

    if (p.isCancel(authChoice)) {
      p.cancel('Scaffolding cancelled.');
      process.exit(0);
    }
    authProvider = authChoice as 'better-auth' | 'none';
  }

  let rpcProtocol: 'trpc' | 'none' = 'none';
  if (selectedTopology === 'monorepo' || selectedTopology === 'ai-agent-rag') {
    const rpcChoice = await p.select({
      message: 'Include end-to-end type-safe RPC contracts?',
      options: [
        { value: 'trpc', label: 'tRPC v11 (Client-Server Type Safety & React Query Integration)' },
        { value: 'none', label: 'Standard REST / Fetch API' },
      ],
      initialValue: 'trpc',
    });

    if (p.isCancel(rpcChoice)) {
      p.cancel('Scaffolding cancelled.');
      process.exit(0);
    }
    rpcProtocol = rpcChoice as 'trpc' | 'none';
  }

  // 6. Testing & CI/CD
  let e2eTesting: 'playwright' | 'none' = 'none';
  if (includeFrontend) {
    const testChoice = await p.select({
      message: 'Select End-to-End (E2E) testing framework:',
      options: [
        { value: 'playwright', label: 'Playwright (Cross-Browser E2E Testing for Chromium, Firefox & WebKit)' },
        { value: 'none', label: 'None (Unit Tests with Vitest only)' },
      ],
      initialValue: 'playwright',
    });

    if (p.isCancel(testChoice)) {
      p.cancel('Scaffolding cancelled.');
      process.exit(0);
    }
    e2eTesting = testChoice as 'playwright' | 'none';
  }

  const ciChoice = await p.select({
    message: 'Configure automated CI/CD pipeline:',
    options: [
      { value: 'github-actions', label: 'GitHub Actions (Lint, Typecheck, Test, E2E Matrix on Node 20 & 22)' },
      { value: 'none', label: 'None (Local verification only)' },
    ],
    initialValue: 'github-actions',
  });

  if (p.isCancel(ciChoice)) {
    p.cancel('Scaffolding cancelled.');
    process.exit(0);
  }
  const ciProvider = ciChoice as 'github-actions' | 'none';

  // 7. AI Agent Governance
  const aiChoice = await p.multiselect({
    message: 'Include AI Agent Rules & Engineering Governance?',
    options: [
      { value: 'rules', label: 'Cursor Rules (.cursor/rules with Brutal Reviewer & Strict TS)' },
      { value: 'skills', label: 'Agent Skills (Modern UI Engineering & Clean Code Craftsmanship)' },
      { value: 'openspec', label: 'OpenSpec Spec-Driven Workflows' },
      { value: 'mcp', label: 'Model Context Protocol (MCP) Server (@repo/mcp-server for Cursor & Antigravity)' },
    ],
    initialValues: ['rules', 'skills', 'openspec', 'mcp'],
    required: false,
  });

  if (p.isCancel(aiChoice)) {
    p.cancel('Scaffolding cancelled.');
    process.exit(0);
  }

  const selectedAi = aiChoice as string[];

  // 8. Installation & Git
  const gitChoice = await p.confirm({
    message: 'Initialize a new git repository?',
    initialValue: true,
  });

  if (p.isCancel(gitChoice)) {
    p.cancel('Scaffolding cancelled.');
    process.exit(0);
  }

  const installChoice = await p.confirm({
    message: 'Install dependencies automatically?',
    initialValue: true,
  });

  if (p.isCancel(installChoice)) {
    p.cancel('Scaffolding cancelled.');
    process.exit(0);
  }

  return {
    name: sanitizedName,
    targetPath,
    topology: selectedTopology,
    frontend: {
      framework:
        selectedTopology === 'nextjs-fullstack'
          ? 'nextjs'
          : includeFrontend
          ? 'react-vite'
          : 'none',
      styling: feStyling,
      state: feState,
      uiExtras: feExtras,
      dateLib: 'none',
    },
    backend: {
      framework: beFramework,
      database: beDatabase,
      orm: beOrm,
      container: beContainer,
      processManager: selectedTopology === 'distributed-worker' ? 'bullmq' : 'docker',
    },
    queue: selectedTopology === 'distributed-worker' ? 'bullmq' : 'none',
    auth: authProvider,
    rpc: rpcProtocol,
    testing: {
      e2e: e2eTesting,
    },
    ci: ciProvider,
    utilities: {
      frontendHelpers: true,
      backendHelpers: includeBackend,
    },
    aiGovernance: {
      rules: selectedAi.includes('rules'),
      skills: selectedAi.includes('skills'),
      openSpec: selectedAi.includes('openspec'),
      mcp: selectedAi.includes('mcp'),
      engine: 'openspec',
    },
    packageManager: 'pnpm',
    git: Boolean(gitChoice),
    install: Boolean(installChoice),
  };
}
