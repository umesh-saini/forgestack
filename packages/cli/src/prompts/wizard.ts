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
        value: 'nextjs-fullstack',
        label: 'Next.js 15 Full-Stack (App Router + Server Actions)',
        hint: 'Modern SSR/RSC with Tailwind CSS v4 & Route Handlers',
      },
      {
        value: 'electron-desktop',
        label: 'Electron Desktop App (electron-vite + React 19)',
        hint: 'Secure IPC contextBridge with profile:create & log:getAll',
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
    | 'standalone-fe'
    | 'standalone-be'
    | 'electron-desktop'
    | 'nextjs-fullstack';
  const includeFrontend = selectedTopology !== 'standalone-be';
  const includeBackend =
    selectedTopology !== 'standalone-fe' &&
    selectedTopology !== 'electron-desktop' &&
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
  let beFramework: 'fastify' | 'express' | 'none' = 'fastify';
  let beDatabase: 'postgres' | 'mongodb' | 'none' = 'postgres';
  let beOrm: 'drizzle' | 'prisma' | 'mongoose' | 'none' = 'drizzle';
  let beContainer = true;

  if (includeBackend) {
    const frameworkChoice = await p.select({
      message: 'Select backend HTTP framework:',
      options: [
        { value: 'fastify', label: 'Fastify (High Performance & Modern Schema Architecture)' },
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
    } else if (dbChoice === 'mongodb-mongoose') {
      beDatabase = 'mongodb';
      beOrm = 'mongoose';
    } else {
      beDatabase = 'none';
      beOrm = 'none';
    }

    if (beDatabase !== 'none') {
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

  // 5. AI Agent Governance
  const aiChoice = await p.multiselect({
    message: 'Include AI Agent Rules & Engineering Governance?',
    options: [
      { value: 'rules', label: 'Cursor Rules (.cursor/rules with Brutal Reviewer & Strict TS)' },
      { value: 'skills', label: 'Agent Skills (Modern UI Engineering & Clean Code Craftsmanship)' },
      { value: 'openspec', label: 'OpenSpec Spec-Driven Workflows' },
    ],
    initialValues: ['rules', 'skills', 'openspec'],
    required: false,
  });

  if (p.isCancel(aiChoice)) {
    p.cancel('Scaffolding cancelled.');
    process.exit(0);
  }

  const selectedAi = aiChoice as string[];

  // 6. Installation & Git
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
    },
    utilities: {
      frontendHelpers: true,
      backendHelpers: includeBackend,
    },
    aiGovernance: {
      rules: selectedAi.includes('rules'),
      skills: selectedAi.includes('skills'),
      openSpec: selectedAi.includes('openspec'),
      engine: 'openspec',
    },
    packageManager: 'pnpm',
    git: Boolean(gitChoice),
    install: Boolean(installChoice),
  };
}
