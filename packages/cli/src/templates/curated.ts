import type { ProjectConfig } from '@forgestack/core';

export interface CuratedTemplate {
  id: string;
  name: string;
  tagline: string;
  description: string;
  config: Omit<ProjectConfig, 'name' | 'targetPath' | 'git' | 'install'>;
}

export const CURATED_TEMPLATES: CuratedTemplate[] = [
  {
    id: 'enterprise-monorepo',
    name: 'Enterprise Monorepo',
    tagline: 'Turborepo + React 19 + Fastify + Drizzle + tRPC',
    description:
      'Turborepo monorepo with React 19, Fastify backend, PostgreSQL (Drizzle), tRPC v11, Better-Auth, Playwright, and GitHub Actions CI/CD.',
    config: {
      topology: 'monorepo',
      frontend: {
        framework: 'react-vite',
        styling: 'tailwind',
        state: 'query',
        uiExtras: { toast: true, icons: true, forms: true },
        dateLib: 'none',
      },
      backend: {
        framework: 'fastify',
        database: 'postgres',
        orm: 'drizzle',
        container: true,
        processManager: 'docker',
      },
      auth: 'better-auth',
      rpc: 'trpc',
      testing: { e2e: 'playwright' },
      ci: 'github-actions',
      utilities: { frontendHelpers: true, backendHelpers: true },
      aiGovernance: {
        rules: true,
        skills: true,
        openSpec: true,
        mcp: true,
        claude: true,
        engine: 'openspec',
      },
      packageManager: 'pnpm',
    },
  },
  {
    id: 'ai-agent-rag',
    name: 'AI-Native Agent & RAG',
    tagline: 'pgvector + Tool Calling + SSE Chat + MCP',
    description:
      'Full-stack AI monorepo with PostgreSQL pgvector cosine similarity search, OpenAI tool-calling agent, streaming SSE chat, and @repo/mcp-server.',
    config: {
      topology: 'ai-agent-rag',
      frontend: {
        framework: 'react-vite',
        styling: 'tailwind',
        state: 'query',
        uiExtras: { toast: true, icons: true, forms: true },
        dateLib: 'none',
      },
      backend: {
        framework: 'fastify',
        database: 'postgres',
        orm: 'drizzle',
        container: true,
        processManager: 'docker',
      },
      auth: 'better-auth',
      rpc: 'trpc',
      testing: { e2e: 'playwright' },
      ci: 'github-actions',
      utilities: { frontendHelpers: true, backendHelpers: true },
      aiGovernance: {
        rules: true,
        skills: true,
        openSpec: true,
        mcp: true,
        claude: true,
        engine: 'openspec',
      },
      packageManager: 'pnpm',
    },
  },
  {
    id: 'tauri-desktop',
    name: 'Native Tauri v2 Desktop',
    tagline: 'Rust Core + React 19 + Tailwind CSS v4',
    description:
      'Ultra-lightweight native cross-platform desktop application with Tauri v2, Rust native backend, React 19 webview, and IPC bindings.',
    config: {
      topology: 'tauri-desktop',
      frontend: {
        framework: 'react-vite',
        styling: 'tailwind',
        state: 'query',
        uiExtras: { toast: true, icons: true, forms: true },
        dateLib: 'none',
      },
      backend: {
        framework: 'none',
        database: 'none',
        orm: 'none',
        container: false,
        processManager: 'none',
      },
      auth: 'none',
      rpc: 'none',
      testing: { e2e: 'none' },
      ci: 'github-actions',
      utilities: { frontendHelpers: false, backendHelpers: false },
      aiGovernance: {
        rules: true,
        skills: true,
        openSpec: true,
        mcp: true,
        claude: true,
        engine: 'openspec',
      },
      packageManager: 'pnpm',
    },
  },
  {
    id: 'nextjs-fullstack',
    name: 'Next.js 15 Full-Stack',
    tagline: 'App Router + Server Actions + PostgreSQL (Drizzle)',
    description:
      'Next.js 15 App Router with Tailwind CSS v4, Server Actions, PostgreSQL connection pooling (Drizzle ORM), and Playwright E2E.',
    config: {
      topology: 'nextjs-fullstack',
      frontend: {
        framework: 'nextjs',
        styling: 'tailwind',
        state: 'query',
        uiExtras: { toast: true, icons: true, forms: true },
        dateLib: 'none',
      },
      backend: {
        framework: 'none',
        database: 'postgres',
        orm: 'drizzle',
        container: true,
        processManager: 'docker',
      },
      auth: 'better-auth',
      rpc: 'none',
      testing: { e2e: 'playwright' },
      ci: 'github-actions',
      utilities: { frontendHelpers: true, backendHelpers: true },
      aiGovernance: {
        rules: true,
        skills: true,
        openSpec: true,
        mcp: true,
        claude: true,
        engine: 'openspec',
      },
      packageManager: 'pnpm',
    },
  },
  {
    id: 'micro-frontend',
    name: 'Micro-Frontend Federation',
    tagline: 'Module Federation (Shell:5000 + Remote:5001)',
    description:
      'True Vite Module Federation monorepo with apps/shell host container, apps/remote-dashboard, and typed @repo/event-bus.',
    config: {
      topology: 'micro-frontend',
      frontend: {
        framework: 'react-vite',
        styling: 'tailwind',
        state: 'query',
        uiExtras: { toast: true, icons: true, forms: true },
        dateLib: 'none',
      },
      backend: {
        framework: 'none',
        database: 'none',
        orm: 'none',
        container: false,
        processManager: 'none',
      },
      auth: 'none',
      rpc: 'none',
      testing: { e2e: 'none' },
      ci: 'github-actions',
      utilities: { frontendHelpers: false, backendHelpers: false },
      aiGovernance: {
        rules: true,
        skills: true,
        openSpec: true,
        mcp: false,
        claude: true,
        engine: 'openspec',
      },
      packageManager: 'pnpm',
    },
  },
  {
    id: 'distributed-worker',
    name: 'Distributed BullMQ Worker',
    tagline: 'Fastify Producer + BullMQ Consumer + Redis',
    description:
      'Asynchronous task processing pipeline with Fastify event producer, BullMQ consumer worker, and Redis 7 Docker container.',
    config: {
      topology: 'distributed-worker',
      frontend: {
        framework: 'none',
        styling: 'none',
        state: 'none',
        uiExtras: { toast: false, icons: false, forms: false },
        dateLib: 'none',
      },
      backend: {
        framework: 'fastify',
        database: 'postgres',
        orm: 'drizzle',
        container: true,
        processManager: 'bullmq',
      },
      queue: 'bullmq',
      auth: 'none',
      rpc: 'none',
      testing: { e2e: 'none' },
      ci: 'github-actions',
      utilities: { frontendHelpers: false, backendHelpers: true },
      aiGovernance: {
        rules: true,
        skills: true,
        openSpec: true,
        mcp: false,
        claude: true,
        engine: 'openspec',
      },
      packageManager: 'pnpm',
    },
  },
  {
    id: 'standalone-fe',
    name: 'Modern Frontend SPA',
    tagline: 'React 19 + Vite 6 + Tailwind v4',
    description:
      'High-performance clientside single page application with TanStack Query, Tailwind CSS v4, Lucide icons, and Sonner toast.',
    config: {
      topology: 'standalone-fe',
      frontend: {
        framework: 'react-vite',
        styling: 'tailwind',
        state: 'query',
        uiExtras: { toast: true, icons: true, forms: true },
        dateLib: 'none',
      },
      backend: {
        framework: 'none',
        database: 'none',
        orm: 'none',
        container: false,
        processManager: 'none',
      },
      auth: 'none',
      rpc: 'none',
      testing: { e2e: 'playwright' },
      ci: 'github-actions',
      utilities: { frontendHelpers: true, backendHelpers: false },
      aiGovernance: {
        rules: true,
        skills: true,
        openSpec: true,
        mcp: false,
        claude: true,
        engine: 'openspec',
      },
      packageManager: 'pnpm',
    },
  },
  {
    id: 'standalone-be',
    name: 'Clean Modular Backend',
    tagline: 'Node.js ESM + Fastify + PostgreSQL (Drizzle)',
    description:
      'Domain-driven modular Node.js ESM backend microservice with controller/service/repo layers, Zod env validation, and PostgreSQL connection pool.',
    config: {
      topology: 'standalone-be',
      frontend: {
        framework: 'none',
        styling: 'none',
        state: 'none',
        uiExtras: { toast: false, icons: false, forms: false },
        dateLib: 'none',
      },
      backend: {
        framework: 'fastify',
        database: 'postgres',
        orm: 'drizzle',
        container: true,
        processManager: 'docker',
      },
      auth: 'none',
      rpc: 'none',
      testing: { e2e: 'none' },
      ci: 'github-actions',
      utilities: { frontendHelpers: false, backendHelpers: true },
      aiGovernance: {
        rules: true,
        skills: true,
        openSpec: true,
        mcp: false,
        claude: true,
        engine: 'openspec',
      },
      packageManager: 'pnpm',
    },
  },
];

export function findCuratedTemplate(idOrName: string): CuratedTemplate | undefined {
  const normalized = idOrName.toLowerCase().trim();
  return CURATED_TEMPLATES.find(
    (t) =>
      t.id.toLowerCase() === normalized ||
      t.name.toLowerCase() === normalized
  );
}
