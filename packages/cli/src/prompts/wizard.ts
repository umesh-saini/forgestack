import * as p from '@clack/prompts';
import fs from 'node:fs';
import path from 'node:path';
import color from 'picocolors';
import { type ProjectConfig, projectConfigSchema } from '@forgestk/core';
import { resolveProjectDirectory, validateProjectNameOrDot } from '../utils/directory.js';
import { CliSplash } from '../ui/splash.js';
import { searchableMultiselect } from '../ui/searchable-multiselect.js';
import { CURATED_TEMPLATES } from '../templates/curated.js';
import { TemplateStore } from '../templates/store.js';

export async function runInteractiveWizard(initialName?: string): Promise<ProjectConfig> {
  CliSplash.showWelcome();
  p.intro(color.bgCyan(color.black(' ForgeStack App Generator ')));

  // 1. Project Name & Target Path
  let sanitizedName = 'my-app';
  let targetPath = path.resolve(process.cwd(), sanitizedName);

  if (initialName) {
    const resolved = resolveProjectDirectory(initialName);
    sanitizedName = resolved.projectName;
    targetPath = resolved.targetPath;

    if (!resolved.isEmpty) {
      const confirmOverwrite = await p.confirm({
        message: `Target directory "${targetPath}" is not empty. Continue and potentially overwrite existing files?`,
        initialValue: false,
      });
      if (!confirmOverwrite || p.isCancel(confirmOverwrite)) {
        p.cancel('Scaffolding cancelled to protect existing files.');
        process.exit(0);
      }
    }
  } else {
    const projectName = await p.text({
      message: 'What is your project named?',
      placeholder: 'my-app (or . for current directory)',
      defaultValue: 'my-app',
      validate: (value) => validateProjectNameOrDot(value),
    });

    if (p.isCancel(projectName)) {
      p.cancel('Scaffolding cancelled.');
      process.exit(0);
    }

    const resolved = resolveProjectDirectory(projectName as string);
    sanitizedName = resolved.projectName;
    targetPath = resolved.targetPath;

    if (!resolved.isEmpty) {
      const confirmOverwrite = await p.confirm({
        message: `Target directory "${targetPath}" is not empty. Continue and potentially overwrite existing files?`,
        initialValue: false,
      });
      if (!confirmOverwrite || p.isCancel(confirmOverwrite)) {
        p.cancel('Scaffolding cancelled to protect existing files.');
        process.exit(0);
      }
    }
  }

  // 2. Setup Flow Selector
  const savedTemplates = TemplateStore.loadSavedTemplates();

  const flowChoice = await p.select({
    message: 'How would you like to initialize your project?',
    options: [
      {
        value: 'curated',
        label: '🌟 Use a Curated Default Template (Instant Setup)',
        hint: 'Recommended: Enterprise Monorepo, AI RAG, Tauri Desktop, Next.js',
      },
      {
        value: 'wizard',
        label: '🛠️  Custom Stack Wizard (Configure every layer)',
        hint: 'Customize every framework, database, primitive, and AI tool',
      },
      ...(savedTemplates.length > 0
        ? [
            {
              value: 'saved',
              label: `📂 Load a Saved Custom Template (${savedTemplates.length} available)`,
              hint: 'Instantiate a previously saved team stack from ~/.forgestack',
            },
          ]
        : []),
    ],
    initialValue: 'curated',
  });

  if (p.isCancel(flowChoice)) {
    p.cancel('Scaffolding cancelled.');
    process.exit(0);
  }

  if (flowChoice === 'curated') {
    const templateChoice = await p.select({
      message: 'Select a curated default template:',
      options: CURATED_TEMPLATES.map((t) => ({
        value: t.id,
        label: `${t.name} (${t.tagline})`,
        hint: t.description,
      })),
      initialValue: 'enterprise-monorepo',
    });

    if (p.isCancel(templateChoice)) {
      p.cancel('Scaffolding cancelled.');
      process.exit(0);
    }

    const curated = CURATED_TEMPLATES.find((t) => t.id === templateChoice)!;

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

    return projectConfigSchema.parse({
      name: sanitizedName,
      targetPath,
      git: Boolean(gitChoice),
      install: Boolean(installChoice),
      ...curated.config,
    });
  }

  if (flowChoice === 'saved') {
    const templateChoice = await p.select({
      message: 'Select one of your saved templates:',
      options: savedTemplates.map((t) => ({
        value: t.id,
        label: t.name,
        hint: t.description,
      })),
    });

    if (p.isCancel(templateChoice)) {
      p.cancel('Scaffolding cancelled.');
      process.exit(0);
    }

    const saved = savedTemplates.find((t) => t.id === templateChoice)!;

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

    return projectConfigSchema.parse({
      name: sanitizedName,
      targetPath,
      git: Boolean(gitChoice),
      install: Boolean(installChoice),
      ...saved.config,
    });
  }

  // 3. Architecture Topology
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
  const selectedAi = await searchableMultiselect({
    message: 'Select AI Agent Governance & Tool Integrations',
    items: [
      {
        id: 'rules',
        label: 'Cursor Rules (.cursor/rules)',
        hint: 'Brutal Reviewer & Strict TS',
        selected: true,
      },
      {
        id: 'skills',
        label: 'AAS Agent Skills (17 Engineering Playbooks)',
        hint: 'Clean Code Guard & Anti-UI Slop',
        selected: true,
      },
      {
        id: 'openspec',
        label: 'OpenSpec Spec-Driven Workflows',
        hint: 'opsx-* automated changes',
        selected: true,
      },
      {
        id: 'mcp',
        label: 'Model Context Protocol (MCP) Server',
        hint: '@repo/mcp-server for Cursor & Antigravity',
        selected: true,
      },
      {
        id: 'claude',
        label: 'Claude Code Configuration (CLAUDE.md)',
        hint: 'Architecture commands & conventions',
        selected: true,
      },
    ],
    initialSelected: ['rules', 'skills', 'openspec', 'mcp', 'claude'],
  });

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

  // 9. Optional: Save as Reusable Custom Template
  const saveChoice = await p.confirm({
    message: 'Save this customized configuration as a reusable template?',
    initialValue: false,
  });

  if (!p.isCancel(saveChoice) && saveChoice) {
    const templateName = await p.text({
      message: 'Enter template name:',
      placeholder: `${sanitizedName}-preset`,
      defaultValue: `${sanitizedName}-preset`,
      validate: (v) => (!v || !v.trim() ? 'Template name cannot be empty.' : undefined),
    });

    if (!p.isCancel(templateName) && templateName) {
      TemplateStore.saveCustomTemplate(
        (templateName as string).trim(),
        `Custom template based on ${sanitizedName} (${selectedTopology})`,
        {
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
            claude: selectedAi.includes('claude'),
            engine: 'openspec',
          },
          packageManager: 'pnpm',
        }
      );
      p.log.success(
        color.green(`Saved template "${(templateName as string).trim()}" to ~/.forgestack/templates.json`)
      );
    }
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
      claude: selectedAi.includes('claude'),
      engine: 'openspec',
    },
    packageManager: 'pnpm',
    git: Boolean(gitChoice),
    install: Boolean(installChoice),
  };
}
