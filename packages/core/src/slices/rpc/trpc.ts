import type { FeatureSlice } from '../../engine/compositor.js';
import { DEPENDENCY_REGISTRY } from '../../registry/dependencies.js';
import type { ProjectConfig } from '../../types/config.js';
import { CodePatcher } from '../../utils/code-patcher.js';
import type { VirtualFileSystem } from '../../vfs/vfs.js';

export const trpcSlice: FeatureSlice = {
  id: 'rpc-trpc',
  name: 'tRPC v11 End-to-End Type Safety Contracts',
  apply: (vfs: VirtualFileSystem, config: ProjectConfig) => {
    if (config.rpc !== 'trpc') {
      return;
    }

    const isMonorepo =
      config.topology === 'monorepo' || config.topology === 'micro-frontend';
    const isSeparate = config.topology === 'separate-folders';

    const apiPath = isMonorepo
      ? 'apps/api'
      : isSeparate
      ? 'backend'
      : config.topology === 'electron-desktop'
      ? 'server'
      : '';
    const resolveApiPath = (p: string) => (apiPath ? `${apiPath}/${p}` : p);

    const webPath = isMonorepo
      ? 'apps/web'
      : isSeparate
      ? 'frontend'
      : '';
    const resolveWebPath = (p: string) => (webPath ? `${webPath}/${p}` : p);

    const hasBackend = config.backend.framework !== 'none';
    const hasFrontend = config.frontend.framework !== 'none';

    // 1. Backend tRPC Integration
    if (hasBackend) {
      vfs.applyAction({
        type: 'MERGE_JSON',
        path: resolveApiPath('package.json'),
        content: {
          dependencies: {
            '@trpc/server': DEPENDENCY_REGISTRY['@trpc/server'],
          },
        },
      });

      // apps/api/src/trpc/context.ts
      vfs.applyAction({
        type: 'CREATE',
        path: resolveApiPath('src/trpc/context.ts'),
        content: `export interface Context {
  user?: {
    id: string;
    email: string;
  };
}

export async function createContext(opts?: any): Promise<Context> {
  return {
    user: opts?.req?.user,
  };
}
`,
      });

      // apps/api/src/trpc/trpc.ts
      vfs.applyAction({
        type: 'CREATE',
        path: resolveApiPath('src/trpc/trpc.ts'),
        content: `import { initTRPC } from '@trpc/server';
import type { Context } from './context.js';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;
`,
      });

      // apps/api/src/trpc/router.ts
      vfs.applyAction({
        type: 'CREATE',
        path: resolveApiPath('src/trpc/router.ts'),
        content: `import { z } from 'zod';
import { router, publicProcedure } from './trpc.js';

export const appRouter = router({
  health: publicProcedure.query(() => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })),
  greeting: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => ({
      message: \`Hello, \${input?.name || 'World'}!\`,
    })),
});

export type AppRouter = typeof appRouter;
`,
      });

      // apps/api/src/trpc/index.ts
      vfs.applyAction({
        type: 'CREATE',
        path: resolveApiPath('src/trpc/index.ts'),
        content: `export * from './trpc.js';
export * from './context.js';
export * from './router.js';
`,
      });
    }

    // 2. Monorepo Shared Client Package (@repo/api-client)
    if (isMonorepo) {
      vfs.applyAction({
        type: 'CREATE',
        path: 'packages/api-client/package.json',
        content: JSON.stringify(
          {
            name: '@repo/api-client',
            version: '0.0.1',
            private: true,
            type: 'module',
            main: './src/index.ts',
            types: './src/index.ts',
            dependencies: {
              '@trpc/client': DEPENDENCY_REGISTRY['@trpc/client'],
              '@trpc/react-query': DEPENDENCY_REGISTRY['@trpc/react-query'],
              '@tanstack/react-query': DEPENDENCY_REGISTRY['@tanstack/react-query'],
              react: DEPENDENCY_REGISTRY.react,
            },
            devDependencies: {
              '@repo/typescript-config': 'workspace:*',
              typescript: DEPENDENCY_REGISTRY.typescript,
            },
          },
          null,
          2
        ) + '\n',
      });

      vfs.applyAction({
        type: 'CREATE',
        path: 'packages/api-client/tsconfig.json',
        content: JSON.stringify(
          {
            extends: '@repo/typescript-config/react.json',
            include: ['src/**/*'],
          },
          null,
          2
        ) + '\n',
      });

      vfs.applyAction({
        type: 'CREATE',
        path: 'packages/api-client/src/index.ts',
        content: `import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../../apps/api/src/trpc/router.js';

export const trpc = createTRPCReact<AppRouter>();
export type { AppRouter };
`,
      });
    }

    // 3. Frontend Web Integration
    if (hasFrontend) {
      vfs.applyAction({
        type: 'MERGE_JSON',
        path: resolveWebPath('package.json'),
        content: {
          dependencies: {
            '@trpc/client': DEPENDENCY_REGISTRY['@trpc/client'],
            '@trpc/react-query': DEPENDENCY_REGISTRY['@trpc/react-query'],
            ...(isMonorepo ? { '@repo/api-client': 'workspace:*' } : {}),
          },
        },
      });

      const apiClientImport = isMonorepo
        ? "import { trpc } from '@repo/api-client';"
        : `import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../${apiPath ? `${apiPath}/` : ''}src/trpc/router.js';
export const trpc = createTRPCReact<AppRouter>();`;

      // Scaffold TRPCProvider in apps/web/src/providers/trpc-provider.tsx
      vfs.applyAction({
        type: 'CREATE',
        path: resolveWebPath('src/providers/trpc-provider.tsx'),
        content: `import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
${apiClientImport}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/trpc',
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
`,
      });

      // Wire TRPCProvider into main.tsx if it exists
      const mainTsxPath = resolveWebPath('src/main.tsx');
      if (vfs.hasFile(mainTsxPath)) {
        vfs.applyAction({
          type: 'PATCH_AST',
          path: mainTsxPath,
          patcher: (content) => {
            let patched = CodePatcher.addImports(content, [
              "import { TRPCProvider } from './providers/trpc-provider.js';",
            ]);
            patched = CodePatcher.wrapProvider(
              patched,
              '<TRPCProvider>',
              '</TRPCProvider>'
            );
            return patched;
          },
        });
      }
    }
  },
};
