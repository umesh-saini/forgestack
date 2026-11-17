import { z } from 'zod';

export const projectConfigSchema = z.object({
  name: z.string().min(1, 'Project name is required').regex(/^[a-z0-9-_]+$/, 'Project name must be kebab-case or alphanumeric'),
  targetPath: z.string().min(1, 'Target path is required'),
  topology: z.enum(['monorepo', 'separate-folders', 'micro-frontend', 'standalone-fe', 'standalone-be']),
  frontend: z.object({
    framework: z.enum(['react-vite', 'none']).default('react-vite'),
    styling: z.enum(['tailwind', 'none']).default('tailwind'),
    state: z.enum(['query', 'redux', 'zustand', 'none']).default('query'),
    icons: z.enum(['lucide', 'tabler', 'react-icons', 'phosphor', 'none']).default('lucide').optional(),
    toast: z.enum(['sonner', 'toastify', 'hot-toast', 'none']).default('sonner').optional(),
    forms: z.enum(['rhf-zod', 'tanstack-form', 'formik-yup', 'none']).default('rhf-zod').optional(),
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
  }).default({}),
  aiGovernance: z.object({
    rules: z.boolean().default(true),
    skills: z.boolean().default(true),
    openSpec: z.boolean().default(true),
  }).default({}),
  packageManager: z.enum(['pnpm', 'npm', 'yarn', 'bun']).default('pnpm'),
  git: z.boolean().default(true),
  install: z.boolean().default(false),
});

export type ProjectConfig = z.infer<typeof projectConfigSchema>;
export type ArchitectureTopology = ProjectConfig['topology'];
