/**
 * Central lockstep dependency registry pinning tested, compatible semver ranges.
 * Floating versions ('*', 'latest') and unverified combinations are strictly forbidden.
 */
export const DEPENDENCY_REGISTRY = {
  // Frontend Framework & Core
  react: '^19.0.0',
  'react-dom': '^19.0.0',
  '@types/react': '^19.0.8',
  '@types/react-dom': '^19.0.3',
  '@vitejs/plugin-react': '^4.3.4',
  '@module-federation/vite': '^1.1.0',
  vite: '^6.1.0',
  next: '^15.1.7',

  // Desktop: Electron & Tauri v2
  electron: '^34.2.0',
  'electron-vite': '^3.0.0',
  '@electron-toolkit/utils': '^3.0.0',
  '@electron-toolkit/preload': '^3.0.0',
  '@tauri-apps/api': '^2.2.0',
  '@tauri-apps/cli': '^2.2.0',
  '@tauri-apps/plugin-shell': '^2.2.0',

  // Date Libraries
  dayjs: '^1.11.13',
  'date-fns': '^4.1.0',
  moment: '^2.30.1',

  // Utilities, Security & Authentication
  jsonwebtoken: '^9.0.2',
  '@types/jsonwebtoken': '^9.0.8',
  'better-auth': '^1.1.20',

  // Messaging, Workers & WebSockets
  bullmq: '^5.40.0',
  ioredis: '^5.5.0',
  ws: '^8.18.0',
  '@types/ws': '^8.5.14',

  // RPC & Monorepo Contracts
  '@trpc/server': '^11.0.0',
  '@trpc/client': '^11.0.0',
  '@trpc/react-query': '^11.0.0',

  // AI & Vector
  ai: '^4.1.0',
  '@ai-sdk/openai': '^1.1.0',
  pgvector: '^0.2.0',
  '@modelcontextprotocol/sdk': '^1.5.0',

  // Testing
  '@playwright/test': '^1.50.0',

  // Process Management
  pm2: '^5.4.3',

  // Styling & UI Primitives
  tailwindcss: '^4.0.0',
  '@tailwindcss/vite': '^4.0.0',
  clsx: '^2.1.1',
  'tailwind-merge': '^3.0.1',
  'class-variance-authority': '^0.7.1',
  'lucide-react': '^0.475.0',
  '@tabler/icons-react': '^3.30.0',
  'react-icons': '^5.5.0',
  '@phosphor-icons/react': '^2.1.7',
  sonner: '^2.0.0',
  'react-toastify': '^11.0.5',
  'react-hot-toast': '^2.5.2',
  '@radix-ui/react-dialog': '^1.1.6',
  '@radix-ui/react-dropdown-menu': '^2.1.6',
  '@radix-ui/react-slot': '^1.1.2',

  // Forms & Validation
  'react-hook-form': '^7.54.2',
  '@hookform/resolvers': '^3.10.0',
  zod: '^3.24.2',
  '@tanstack/react-form': '^0.41.0',
  formik: '^2.4.6',
  yup: '^1.6.1',

  // Frontend State Management & Routing
  '@tanstack/react-query': '^5.66.0',
  '@tanstack/react-query-devtools': '^5.66.0',
  '@reduxjs/toolkit': '^2.5.1',
  'react-redux': '^9.2.0',
  '@types/react-redux': '^7.1.34',
  zustand: '^5.0.3',
  'react-router-dom': '^7.1.5',
  axios: '^1.7.9',

  // Backend Frameworks & Core
  fastify: '^5.2.1',
  '@fastify/cors': '^10.0.2',
  '@fastify/helmet': '^13.0.1',
  '@fastify/rate-limit': '^10.2.2',
  express: '^4.21.2',
  cors: '^2.8.5',
  helmet: '^8.0.0',
  'express-rate-limit': '^7.5.0',
  dotenv: '^16.4.7',
  pino: '^9.6.0',
  'pino-pretty': '^13.0.0',
  hono: '^4.7.0',
  '@hono/node-server': '^1.13.8',

  // Databases & ORMs
  pg: '^8.13.1',
  '@types/pg': '^8.11.11',
  'drizzle-orm': '^0.39.1',
  'drizzle-kit': '^0.30.4',
  '@prisma/client': '^6.3.1',
  prisma: '^6.3.1',
  mongoose: '^8.10.0',
  'better-sqlite3': '^11.8.1',
  '@types/better-sqlite3': '^7.6.12',

  // Tooling, Monorepo & TypeScript
  typescript: '^5.7.3',
  turbo: '^2.4.0',
  vitest: '^3.0.5',
  tsup: '^8.3.6',
  tsx: '^4.19.2',
  eslint: '^9.20.0',
  prettier: '^3.5.0',
  '@biomejs/biome': '^1.9.4',
  '@types/node': '^22.13.4',
  '@types/express': '^5.0.0',
  '@types/cors': '^2.8.17',
} as const;

export type PackageName = keyof typeof DEPENDENCY_REGISTRY;

/**
 * Resolves a pinned package version from the central registry.
 * Throws if the package is not cataloged in the lockstep registry.
 */
export function getPinnedVersion(pkg: PackageName): string {
  const version = DEPENDENCY_REGISTRY[pkg];
  if (!version) {
    throw new Error(
      `Package '${pkg}' is not registered in the lockstep DEPENDENCY_REGISTRY. Register it with a pinned version first.`
    );
  }
  return version;
}

/**
 * Resolves a dictionary of package names to their pinned registry versions.
 */
export function resolveDependencies(
  packages: PackageName[]
): Record<string, string> {
  const resolved: Record<string, string> = {};
  for (const pkg of packages) {
    resolved[pkg] = getPinnedVersion(pkg);
  }
  return resolved;
}
