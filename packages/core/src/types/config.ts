import { z } from 'zod';

export const projectConfigSchema = z.object({
  name: z.string().min(1, 'Project name is required').regex(/^[a-z0-9-_]+$/, 'Project name must be kebab-case or alphanumeric'),
  targetPath: z.string().min(1, 'Target path is required'),
  topology: z.enum([
    'monorepo',
    'separate-folders',
    'micro-frontend',
    'standalone-fe',
    'standalone-be',
    'electron-desktop',
    'nextjs-fullstack',
    'tauri-desktop',
    'ai-agent-rag',
    'distributed-worker',
  ]),
  frontend: z.object({
    framework: z.enum(['react-vite', 'nextjs', 'none']).default('react-vite'),
    styling: z.enum(['tailwind', 'none']).default('tailwind'),
    state: z.enum(['query', 'redux', 'zustand', 'none']).default('query'),
    icons: z.enum(['lucide', 'tabler', 'react-icons', 'phosphor', 'none']).default('lucide').optional(),
    toast: z.enum(['sonner', 'toastify', 'hot-toast', 'none']).default('sonner').optional(),
    forms: z.enum(['rhf-zod', 'tanstack-form', 'formik-yup', 'none']).default('rhf-zod').optional(),
    dateLib: z.enum(['dayjs', 'date-fns', 'moment', 'none']).default('none').optional(),
    uiExtras: z.object({
      toast: z.boolean().default(true),
      icons: z.boolean().default(true),
      forms: z.boolean().default(true),
    }).default({}),
  }).default({}),
  backend: z.object({
    framework: z.enum(['fastify', 'express', 'hono', 'none']).default('fastify'),
    database: z.enum(['postgres', 'mongodb', 'sqlite', 'none']).default('postgres'),
    orm: z.enum(['drizzle', 'prisma', 'mongoose', 'none']).default('drizzle'),
    container: z.boolean().default(true),
    processManager: z.enum(['docker', 'pm2', 'bullmq', 'none']).default('docker').optional(),
  }).default({}),
  queue: z.enum(['bullmq', 'none']).default('none').optional(),
  auth: z.enum(['better-auth', 'none']).default('none').optional(),
  rpc: z.enum(['trpc', 'none']).default('none').optional(),
  testing: z.object({
    e2e: z.enum(['playwright', 'cypress', 'none']).default('none').optional(),
  }).default({}).optional(),
  ci: z.enum(['github-actions', 'none']).default('none').optional(),
  linter: z.enum(['eslint', 'biome', 'none']).default('eslint').optional(),
  deployment: z.enum(['docker', 'vercel', 'cloudflare', 'railway', 'fly', 'none']).default('docker').optional(),
  utilities: z.object({
    frontendHelpers: z.boolean().default(false),
    backendHelpers: z.boolean().default(false),
  }).default({}).optional(),
  aiGovernance: z.object({
    rules: z.boolean().default(true),
    claude: z.boolean().default(true).optional(),
    skills: z.boolean().default(true),
    openSpec: z.boolean().default(true),
    mcp: z.boolean().default(true).optional(),
    engine: z.enum(['openspec', 'gsd', 'speckit', 'all']).default('openspec').optional(),
  }).default({}),
  packageManager: z.enum(['pnpm', 'npm', 'yarn', 'bun']).default('pnpm'),
  git: z.boolean().default(true),
  install: z.boolean().default(false),
});

export type ProjectConfig = z.infer<typeof projectConfigSchema>;
export type ArchitectureTopology = ProjectConfig['topology'];

const FRONTEND_ONLY: ArchitectureTopology[] = ['standalone-fe', 'tauri-desktop', 'electron-desktop'];
const BACKEND_ONLY: ArchitectureTopology[] = ['standalone-be', 'distributed-worker'];
const ORMS_FOR_DB: Record<ProjectConfig['backend']['database'], ProjectConfig['backend']['orm'][]> = {
  postgres: ['drizzle', 'prisma'],
  sqlite: ['drizzle'],
  mongodb: ['mongoose'],
  none: ['none'],
};

/**
 * Makes a config consistent with its topology. Every entry point (CLI flags, wizard, templates,
 * desktop app, MCP server) funnels through generateProjectVfs, which calls this — so a topology
 * that has no backend can't end up running backend slices just because a default leaked through.
 * Throws on choices that can't be reconciled (e.g. SQLite + Mongoose).
 */
export function normalizeConfig(input: ProjectConfig): ProjectConfig {
  const c: ProjectConfig = structuredClone(input);
  const t = c.topology;

  if (FRONTEND_ONLY.includes(t)) {
    c.backend = { ...c.backend, framework: 'none', database: 'none', orm: 'none', container: false, processManager: 'none' };
    if (t !== 'standalone-fe') c.frontend.framework = 'react-vite'; // desktop & federation shells are Vite apps
    c.auth = 'none';
  }
  if (t === 'micro-frontend') c.frontend.framework = 'react-vite'; // federated Vite shell (+ optional apps/api)
  if (t === 'nextjs-fullstack') {
    // Next serves the API through route handlers; DB/ORM stay (used by Next directly).
    c.frontend.framework = 'nextjs';
    c.backend = { ...c.backend, framework: 'none', processManager: 'none' };
  }
  if (BACKEND_ONLY.includes(t)) {
    c.frontend = { ...c.frontend, framework: 'none', styling: 'none', state: 'none', uiExtras: { toast: false, icons: false, forms: false } };
  }
  if (t === 'distributed-worker') {
    c.queue = 'bullmq';
    c.backend.processManager = 'bullmq';
  } else if (c.queue === 'bullmq' && c.backend.framework === 'none') {
    c.queue = 'none';
  }
  if (c.backend.processManager === 'bullmq' && c.backend.framework !== 'none') c.queue = 'bullmq';

  if (c.backend.framework === 'none' && t !== 'nextjs-fullstack') {
    c.backend = { ...c.backend, database: 'none', orm: 'none', container: false };
    c.auth = 'none';
  }
  if (c.backend.database === 'none') c.backend.orm = 'none';
  if (c.frontend.framework === 'none' && c.utilities) c.utilities = { ...c.utilities, frontendHelpers: false };
  if (c.backend.framework === 'none' && c.utilities) c.utilities = { ...c.utilities, backendHelpers: false };

  // tRPC needs a shared contracts package and both ends of the wire.
  const trpcTopology = t === 'monorepo' || t === 'ai-agent-rag';
  if (c.rpc === 'trpc' && (!trpcTopology || c.backend.framework === 'none' || c.frontend.framework === 'none')) c.rpc = 'none';

  const { database, orm } = c.backend;
  if (!ORMS_FOR_DB[database].includes(orm)) {
    throw new Error(`Invalid combination: ${database} does not support ORM '${orm}'. Use one of: ${ORMS_FOR_DB[database].join(', ')}.`);
  }
  if (t === 'ai-agent-rag' && (database !== 'postgres' || orm !== 'drizzle')) {
    throw new Error("Invalid combination: 'ai-agent-rag' stores embeddings with pgvector and requires PostgreSQL + Drizzle.");
  }
  return c;
}
