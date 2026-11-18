import { describe, expect, it } from 'vitest';
import { generateProjectVfs } from '../../../engine/create-pipeline.js';
import type { ProjectConfig } from '../../../types/config.js';

describe('Better-Auth Primitive Slice', () => {
  it('should scaffold Better-Auth server, client, and Drizzle tables for Monorepo with PostgreSQL', async () => {
    const config: ProjectConfig = {
      name: 'monorepo-auth-test',
      targetPath: '/test/monorepo-auth-test',
      topology: 'monorepo',
      frontend: {
        framework: 'react-vite',
        styling: 'tailwind',
        state: 'query',
        uiExtras: { toast: true, icons: true, forms: true },
      },
      backend: {
        framework: 'fastify',
        database: 'postgres',
        orm: 'drizzle',
        container: true,
      },
      auth: 'better-auth',
      aiGovernance: { rules: true, skills: true, openSpec: true },
      packageManager: 'pnpm',
      git: true,
      install: false,
    };

    const vfs = await generateProjectVfs(config);

    // Dependencies
    const apiPkg = JSON.parse(vfs.getFileContent('apps/api/package.json')!);
    expect(apiPkg.dependencies['better-auth']).toBeDefined();

    const webPkg = JSON.parse(vfs.getFileContent('apps/web/package.json')!);
    expect(webPkg.dependencies['better-auth']).toBeDefined();

    // Server Auth Config
    expect(vfs.hasFile('apps/api/src/auth/auth.ts')).toBe(true);
    const authConfig = vfs.getFileContent('apps/api/src/auth/auth.ts')!;
    expect(authConfig).toContain("import { betterAuth } from 'better-auth';");
    expect(authConfig).toContain("import { drizzleAdapter } from 'better-auth/adapters/drizzle';");
    expect(authConfig).toContain("provider: 'pg'");

    // Database Schemas
    expect(vfs.hasFile('apps/api/src/database/schema/auth.ts')).toBe(true);
    const authSchema = vfs.getFileContent('apps/api/src/database/schema/auth.ts')!;
    expect(authSchema).toContain("pgTable('user'");
    expect(authSchema).toContain("pgTable('session'");
    expect(authSchema).toContain("pgTable('account'");
    expect(authSchema).toContain("pgTable('verification'");

    const schemaIndex = vfs.getFileContent('apps/api/src/database/schema/index.ts')!;
    expect(schemaIndex).toContain("export * from './auth.js';");

    // Client Helper
    expect(vfs.hasFile('apps/web/src/auth/client.ts')).toBe(true);
    const clientCode = vfs.getFileContent('apps/web/src/auth/client.ts')!;
    expect(clientCode).toContain("import { createAuthClient } from 'better-auth/react';");
    expect(clientCode).toContain('export const { signIn, signUp, signOut, useSession } = authClient;');

    // Fastify auth routes
    expect(vfs.hasFile('apps/api/src/modules/auth/auth.routes.ts')).toBe(true);
  });

  it('should scaffold Better-Auth for Next.js fullstack with SQLite and Next.js route handler', async () => {
    const config: ProjectConfig = {
      name: 'nextjs-sqlite-auth-test',
      targetPath: '/test/nextjs-sqlite-auth-test',
      topology: 'nextjs-fullstack',
      frontend: {
        framework: 'nextjs',
        styling: 'tailwind',
        state: 'query',
        uiExtras: { toast: true, icons: true, forms: true },
      },
      backend: {
        framework: 'none',
        database: 'sqlite',
        orm: 'drizzle',
        container: false,
      },
      auth: 'better-auth',
      aiGovernance: { rules: true, skills: true, openSpec: true },
      packageManager: 'pnpm',
      git: true,
      install: false,
    };

    const vfs = await generateProjectVfs(config);

    const pkg = JSON.parse(vfs.getFileContent('package.json')!);
    expect(pkg.dependencies['better-auth']).toBeDefined();

    // Server auth configuration
    expect(vfs.hasFile('src/auth/auth.ts')).toBe(true);
    const authConfig = vfs.getFileContent('src/auth/auth.ts')!;
    expect(authConfig).toContain("provider: 'sqlite'");

    // Next.js Route Handler
    expect(vfs.hasFile('src/app/api/auth/[...all]/route.ts')).toBe(true);
    const routeHandler = vfs.getFileContent('src/app/api/auth/[...all]/route.ts')!;
    expect(routeHandler).toContain("import { toNextJsHandler } from 'better-auth/next-js';");

    // SQLite Schema Augmentation
    const schemaContent = vfs.getFileContent('src/db/schema.ts')!;
    expect(schemaContent).toContain("sqliteTable('user'");
    expect(schemaContent).toContain("sqliteTable('session'");
    expect(schemaContent).toContain("sqliteTable('account'");
    expect(schemaContent).toContain("sqliteTable('verification'");

    // React Client Helper
    expect(vfs.hasFile('src/auth/client.ts')).toBe(true);
  });

  it('should scaffold Better-Auth with Prisma ORM models and Hono routes', async () => {
    const config: ProjectConfig = {
      name: 'hono-prisma-auth-test',
      targetPath: '/test/hono-prisma-auth-test',
      topology: 'standalone-be',
      frontend: {
        framework: 'none',
        styling: 'none',
        state: 'none',
        uiExtras: { toast: false, icons: false, forms: false },
      },
      backend: {
        framework: 'hono',
        database: 'postgres',
        orm: 'prisma',
        container: true,
      },
      auth: 'better-auth',
      aiGovernance: { rules: true, skills: true, openSpec: true },
      packageManager: 'pnpm',
      git: true,
      install: false,
    };

    const vfs = await generateProjectVfs(config);

    // Auth config uses prismaAdapter
    expect(vfs.hasFile('src/auth/auth.ts')).toBe(true);
    const authConfig = vfs.getFileContent('src/auth/auth.ts')!;
    expect(authConfig).toContain("import { prismaAdapter } from 'better-auth/adapters/prisma';");
    expect(authConfig).toContain("provider: 'postgresql'");

    // Prisma Schema has models
    const prismaSchema = vfs.getFileContent('prisma/schema.prisma')!;
    expect(prismaSchema).toContain('model User {');
    expect(prismaSchema).toContain('model Session {');
    expect(prismaSchema).toContain('model Account {');
    expect(prismaSchema).toContain('model Verification {');

    // Hono auth route
    expect(vfs.hasFile('src/routes/auth.routes.ts')).toBe(true);
    const honoRoutes = vfs.getFileContent('src/routes/auth.routes.ts')!;
    expect(honoRoutes).toContain('export const authRouter = new Hono();');
  });
});
