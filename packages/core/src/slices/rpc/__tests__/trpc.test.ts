import { describe, expect, it } from 'vitest';
import { generateProjectVfs } from '../../../engine/create-pipeline.js';
import type { ProjectConfig } from '../../../types/config.js';

describe('tRPC v11 Contracts Slice', () => {
  it('should scaffold tRPC v11 monorepo router, @repo/api-client, and web provider', async () => {
    const config: ProjectConfig = {
      name: 'monorepo-trpc-test',
      targetPath: '/test/monorepo-trpc-test',
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
      rpc: 'trpc',
      aiGovernance: { rules: true, skills: true, openSpec: true },
      packageManager: 'pnpm',
      git: true,
      install: false,
    };

    const vfs = await generateProjectVfs(config);

    // 1. Backend apps/api
    const apiPkg = JSON.parse(vfs.getFileContent('apps/api/package.json')!);
    expect(apiPkg.dependencies['@trpc/server']).toBeDefined();

    expect(vfs.hasFile('apps/api/src/trpc/router.ts')).toBe(true);
    const routerContent = vfs.getFileContent('apps/api/src/trpc/router.ts')!;
    expect(routerContent).toContain('export const appRouter = router({');
    expect(routerContent).toContain('export type AppRouter = typeof appRouter;');

    expect(vfs.hasFile('apps/api/src/trpc/context.ts')).toBe(true);
    expect(vfs.hasFile('apps/api/src/trpc/trpc.ts')).toBe(true);

    // 2. Shared packages/api-client
    expect(vfs.hasFile('packages/api-client/package.json')).toBe(true);
    const clientPkg = JSON.parse(vfs.getFileContent('packages/api-client/package.json')!);
    expect(clientPkg.name).toBe('@repo/api-client');
    expect(clientPkg.dependencies['@trpc/client']).toBeDefined();
    expect(clientPkg.dependencies['@trpc/react-query']).toBeDefined();

    expect(vfs.hasFile('packages/api-client/src/index.ts')).toBe(true);
    const clientIndex = vfs.getFileContent('packages/api-client/src/index.ts')!;
    expect(clientIndex).toContain('export const trpc = createTRPCReact<AppRouter>();');

    // 3. Frontend apps/web
    const webPkg = JSON.parse(vfs.getFileContent('apps/web/package.json')!);
    expect(webPkg.dependencies['@repo/api-client']).toBe('workspace:*');
    expect(webPkg.dependencies['@trpc/client']).toBeDefined();
    expect(webPkg.dependencies['@trpc/react-query']).toBeDefined();

    expect(vfs.hasFile('apps/web/src/providers/trpc-provider.tsx')).toBe(true);
    const providerContent = vfs.getFileContent('apps/web/src/providers/trpc-provider.tsx')!;
    expect(providerContent).toContain('export function TRPCProvider(');
    expect(providerContent).toContain('<trpc.Provider client={trpcClient} queryClient={queryClient}>');

    // main.tsx wrapping
    const mainTsx = vfs.getFileContent('apps/web/src/main.tsx')!;
    expect(mainTsx).toContain("import { TRPCProvider } from './providers/trpc-provider.js';");
    expect(mainTsx).toContain('<TRPCProvider>');
    expect(mainTsx).toContain('</TRPCProvider>');
  });

  it('should not scaffold tRPC when rpc is none', async () => {
    const config: ProjectConfig = {
      name: 'monorepo-no-trpc-test',
      targetPath: '/test/monorepo-no-trpc-test',
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
      rpc: 'none',
      aiGovernance: { rules: true, skills: true, openSpec: true },
      packageManager: 'pnpm',
      git: true,
      install: false,
    };

    const vfs = await generateProjectVfs(config);

    expect(vfs.hasFile('packages/api-client/package.json')).toBe(false);
    expect(vfs.hasFile('apps/api/src/trpc/router.ts')).toBe(false);
  });
});
