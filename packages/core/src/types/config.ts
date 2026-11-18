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
