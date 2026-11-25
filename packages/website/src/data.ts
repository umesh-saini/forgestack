import { AGENT_TARGETS, projectConfigSchema } from '@forgestk/core/browser';

// Read option values straight from the engine's zod schema so the site never drifts from the engine.
type AnySchema = { _def?: { innerType?: AnySchema; values?: readonly string[] }; options?: readonly string[]; shape?: Record<string, AnySchema> };
const unwrap = (s: AnySchema): AnySchema => (s._def?.innerType ? unwrap(s._def.innerType) : s);
const values = (s: AnySchema) => ((unwrap(s).options ?? unwrap(s)._def?.values ?? []) as string[]).filter((v) => v !== 'none');
const shape = projectConfigSchema.shape as unknown as Record<string, AnySchema>;
const sub = (k: string) => unwrap(shape[k]).shape as Record<string, AnySchema>;

export const STACK: { group: string; items: string[] }[] = [
  { group: 'Architecture', items: values(shape.topology) },
  { group: 'Frontend', items: [...values(sub('frontend').framework), ...values(sub('frontend').styling), ...values(sub('frontend').state)] },
  { group: 'Backend', items: values(sub('backend').framework) },
  { group: 'Data', items: [...values(sub('backend').database), ...values(sub('backend').orm)] },
  { group: 'Auth, RPC, jobs', items: [...values(shape.auth), ...values(shape.rpc), ...values(shape.queue)] },
  { group: 'UI kits', items: [...values(sub('frontend').icons), ...values(sub('frontend').toast), ...values(sub('frontend').forms), ...values(sub('frontend').dateLib)] },
  { group: 'Quality', items: [...values(sub('testing').e2e), ...values(shape.linter), ...values(shape.ci)] },
  { group: 'Deploy', items: values(shape.deployment) },
  { group: 'Package manager', items: values(shape.packageManager) },
];

export const TOPOLOGIES = values(shape.topology);
export const PACKAGE_MANAGERS = values(shape.packageManager);
export const AI_TOOL_NAMES = AGENT_TARGETS.map((t) => t.name);
export { AGENT_TARGETS };

/** Sample configurations highlighted on the stack rail. */
export const SAMPLES = [
  {
    id: 'monorepo',
    name: 'Enterprise monorepo',
    values: ['monorepo', 'react-vite', 'tailwind', 'query', 'fastify', 'postgres', 'drizzle', 'better-auth', 'trpc', 'lucide', 'sonner', 'rhf-zod', 'dayjs', 'playwright', 'eslint', 'github-actions', 'docker', 'pnpm'],
  },
  {
    id: 'next',
    name: 'Next.js full-stack',
    values: ['nextjs-fullstack', 'nextjs', 'tailwind', 'postgres', 'drizzle', 'better-auth', 'lucide', 'sonner', 'rhf-zod', 'date-fns', 'eslint', 'github-actions', 'vercel', 'pnpm'],
  },
  {
    id: 'api',
    name: 'Hono API',
    values: ['standalone-be', 'hono', 'postgres', 'drizzle', 'better-auth', 'biome', 'docker', 'npm'],
  },
] as const;
