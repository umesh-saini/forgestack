import type { ArchitectureTopology, ProjectConfig } from '@forgestack/core/browser';

export interface Archetype {
  id: ArchitectureTopology;
  title: string;
  /** Short runtime identifier shown in mono beside the title. */
  runtime: string;
  summary: string;
  apply: (prev: ProjectConfig) => ProjectConfig;
}

const NO_FRONTEND: ProjectConfig['frontend'] = {
  framework: 'none',
  styling: 'none',
  state: 'none',
  uiExtras: { toast: false, icons: false, forms: false },
};
const NO_BACKEND: ProjectConfig['backend'] = { framework: 'none', database: 'none', orm: 'none', container: false };

export const ARCHETYPES: Archetype[] = [
  {
    id: 'monorepo',
    title: 'Turborepo monorepo',
    runtime: 'vite + fastify + pg',
    summary: 'apps/web and apps/api with shared @repo/contracts and @repo/ui packages.',
    apply: (prev) => ({
      ...prev,
      topology: 'monorepo',
      frontend: { ...prev.frontend, framework: 'react-vite', styling: 'tailwind' },
      backend: { ...prev.backend, framework: 'fastify', database: 'postgres', orm: 'drizzle' },
      auth: 'better-auth',
      rpc: 'trpc',
    }),
  },
  {
    id: 'ai-agent-rag',
    title: 'AI agent + RAG',
    runtime: 'pgvector + mcp',
    summary: 'pgvector schema, tool-calling agent, streaming chat endpoint and an MCP server.',
    apply: (prev) => ({
      ...prev,
      topology: 'ai-agent-rag',
      frontend: { ...prev.frontend, framework: 'react-vite', styling: 'tailwind' },
      backend: { ...prev.backend, framework: 'fastify', database: 'postgres', orm: 'drizzle' },
      auth: 'better-auth',
      rpc: 'trpc',
      aiGovernance: { ...prev.aiGovernance, mcp: true },
    }),
  },
  {
    id: 'nextjs-fullstack',
    title: 'Next.js full-stack',
    runtime: 'next 15 + app router',
    summary: 'App Router with route handlers and server actions talking to the database directly.',
    apply: (prev) => ({
      ...prev,
      topology: 'nextjs-fullstack',
      frontend: { ...prev.frontend, framework: 'nextjs', styling: 'tailwind', dateLib: 'date-fns' },
      backend: { framework: 'none', database: 'postgres', orm: 'drizzle', container: true },
    }),
  },
  {
    id: 'separate-folders',
    title: 'Separate frontend / backend',
    runtime: 'frontend/ + backend/',
    summary: 'Two independent packages in one repository root.',
    apply: (prev) => ({
      ...prev,
      topology: 'separate-folders',
      frontend: { ...prev.frontend, framework: 'react-vite', styling: 'tailwind' },
      backend: { ...prev.backend, framework: 'express', database: 'mongodb', orm: 'mongoose' },
    }),
  },
  {
    id: 'micro-frontend',
    title: 'Micro-frontends',
    runtime: 'module federation',
    summary: 'apps/shell on :5000, apps/remote-dashboard on :5001 and a typed @repo/event-bus.',
    apply: (prev) => ({
      ...prev,
      topology: 'micro-frontend',
      frontend: { ...prev.frontend, framework: 'react-vite', styling: 'tailwind' },
      backend: NO_BACKEND,
    }),
  },
  {
    id: 'tauri-desktop',
    title: 'Tauri v2 desktop',
    runtime: 'rust + react',
    summary: 'Rust shell with a React 19 + Vite webview and typed IPC commands.',
    apply: (prev) => ({
      ...prev,
      topology: 'tauri-desktop',
      frontend: { ...prev.frontend, framework: 'react-vite', styling: 'tailwind' },
      backend: NO_BACKEND,
    }),
  },
  {
    id: 'electron-desktop',
    title: 'Electron desktop',
    runtime: 'electron-vite',
    summary: 'React 19 renderer with a contextBridge preload and IPC handlers.',
    apply: (prev) => ({
      ...prev,
      topology: 'electron-desktop',
      frontend: { ...prev.frontend, framework: 'react-vite', styling: 'tailwind', dateLib: 'dayjs' },
      backend: NO_BACKEND,
    }),
  },
  {
    id: 'standalone-fe',
    title: 'Frontend only',
    runtime: 'react + vite',
    summary: 'Single-page app with no server package.',
    apply: (prev) => ({
      ...prev,
      topology: 'standalone-fe',
      frontend: { ...prev.frontend, framework: 'react-vite', styling: 'tailwind' },
      backend: NO_BACKEND,
    }),
  },
  {
    id: 'standalone-be',
    title: 'API only',
    runtime: 'fastify + pm2',
    summary: 'Layered Node.js ESM service with connection pooling and a PM2 ecosystem file.',
    apply: (prev) => ({
      ...prev,
      topology: 'standalone-be',
      frontend: NO_FRONTEND,
      backend: { framework: 'fastify', database: 'postgres', orm: 'drizzle', container: false, processManager: 'pm2' },
    }),
  },
  {
    id: 'distributed-worker',
    title: 'BullMQ worker service',
    runtime: 'bullmq + redis',
    summary: 'Fastify producer, BullMQ job processor and a Redis container.',
    apply: (prev) => ({
      ...prev,
      topology: 'distributed-worker',
      frontend: NO_FRONTEND,
      backend: { framework: 'fastify', database: 'postgres', orm: 'drizzle', container: true, processManager: 'bullmq' },
      queue: 'bullmq',
    }),
  },
];

export const archetypeOf = (id: ArchitectureTopology) => ARCHETYPES.find((a) => a.id === id) ?? ARCHETYPES[0];

/** Human names for config values. Unknown values fall back to the raw id. */
export const LABEL: Record<string, string> = {
  'react-vite': 'React 19 + Vite',
  nextjs: 'Next.js 15',
  tailwind: 'Tailwind CSS v4',
  query: 'TanStack Query',
  zustand: 'Zustand',
  redux: 'Redux Toolkit',
  lucide: 'Lucide',
  tabler: 'Tabler',
  phosphor: 'Phosphor',
  'react-icons': 'React Icons',
  sonner: 'Sonner',
  toastify: 'React-Toastify',
  'hot-toast': 'React Hot Toast',
  'rhf-zod': 'React Hook Form + Zod',
  'tanstack-form': 'TanStack Form',
  'formik-yup': 'Formik + Yup',
  dayjs: 'Day.js',
  'date-fns': 'date-fns',
  moment: 'Moment.js',
  fastify: 'Fastify 5',
  express: 'Express 4',
  hono: 'Hono 4',
  postgres: 'PostgreSQL',
  mongodb: 'MongoDB',
  sqlite: 'SQLite',
  drizzle: 'Drizzle',
  prisma: 'Prisma',
  mongoose: 'Mongoose',
  docker: 'Docker',
  pm2: 'PM2',
  bullmq: 'BullMQ',
  'better-auth': 'Better-Auth',
  trpc: 'tRPC 11',
  playwright: 'Playwright',
  cypress: 'Cypress',
  'github-actions': 'GitHub Actions',
  eslint: 'ESLint + Prettier',
  biome: 'Biome',
  vercel: 'Vercel',
  cloudflare: 'Cloudflare',
  railway: 'Railway',
  fly: 'Fly.io',
  openspec: 'OpenSpec',
  gsd: 'Open-GSD',
  speckit: 'Spec-Kit',
  all: 'All engines',
  none: 'None',
};

export const label = (v: string | undefined | null) => (v ? (LABEL[v] ?? v) : 'None');

export const hasFrontend = (c: ProjectConfig) => c.frontend.framework !== 'none';
export const hasBackend = (c: ProjectConfig) => c.backend.framework !== 'none';

/** Frontend, backend and database names for one-line stack summaries. */
export function stackLine(c: ProjectConfig): string[] {
  const parts: string[] = [];
  if (hasFrontend(c)) parts.push(label(c.frontend.framework));
  if (hasBackend(c)) parts.push(label(c.backend.framework));
  if (c.backend.database !== 'none') parts.push(label(c.backend.database));
  return parts;
}
