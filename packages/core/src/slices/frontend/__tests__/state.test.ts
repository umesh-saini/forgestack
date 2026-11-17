import { describe, expect, it } from 'vitest';
import { VirtualFileSystem } from '../../../vfs/vfs.js';
import { reactViteSlice } from '../react-vite.js';
import { stateSlice } from '../state.js';
import type { ProjectConfig } from '../../../types/config.js';

describe('Frontend State Slice', () => {
  const baseConfig: ProjectConfig = {
    name: 'test-app',
    targetPath: './test-app',
    topology: 'monorepo',
    frontend: {
      framework: 'react-vite',
      styling: 'tailwind',
      state: 'query',
      uiExtras: { toast: false, icons: false, forms: false },
    },
    backend: {
      framework: 'fastify',
      database: 'postgres',
      orm: 'drizzle',
      container: true,
    },
    aiGovernance: { rules: true, skills: true, openSpec: true },
    packageManager: 'pnpm',
    git: true,
    install: false,
  };

  it('should scaffold TanStack Query v5 with custom query hook and QueryProvider wrapper', () => {
    const vfs = new VirtualFileSystem();
    reactViteSlice.apply(vfs, baseConfig);
    stateSlice.apply(vfs, baseConfig);

    expect(vfs.hasFile('apps/web/src/providers/query-provider.tsx')).toBe(true);
    expect(vfs.hasFile('apps/web/src/lib/api-client.ts')).toBe(true);
    expect(vfs.hasFile('apps/web/src/features/auth/api/use-user.ts')).toBe(true);

    const mainTsx = vfs.getFileContent('apps/web/src/main.tsx')!;
    expect(mainTsx).toContain('<QueryProvider>');

    const pkg = JSON.parse(vfs.getFileContent('apps/web/package.json')!);
    expect(pkg.dependencies['@tanstack/react-query']).toBeDefined();
  });

  it('should scaffold Redux Toolkit with typed store and hooks', () => {
    const vfs = new VirtualFileSystem();
    const reduxConfig = {
      ...baseConfig,
      frontend: { ...baseConfig.frontend, state: 'redux' as const },
    };
    reactViteSlice.apply(vfs, reduxConfig);
    stateSlice.apply(vfs, reduxConfig);

    expect(vfs.hasFile('apps/web/src/store/index.ts')).toBe(true);
    expect(vfs.hasFile('apps/web/src/store/hooks.ts')).toBe(true);
    expect(vfs.hasFile('apps/web/src/store/slices/auth-slice.ts')).toBe(true);

    const mainTsx = vfs.getFileContent('apps/web/src/main.tsx')!;
    expect(mainTsx).toContain('<Provider store={store}>');

    const pkg = JSON.parse(vfs.getFileContent('apps/web/package.json')!);
    expect(pkg.dependencies['@reduxjs/toolkit']).toBeDefined();
  });

  it('should scaffold Zustand with devtools store', () => {
    const vfs = new VirtualFileSystem();
    const zustandConfig = {
      ...baseConfig,
      frontend: { ...baseConfig.frontend, state: 'zustand' as const },
    };
    reactViteSlice.apply(vfs, zustandConfig);
    stateSlice.apply(vfs, zustandConfig);

    expect(vfs.hasFile('apps/web/src/store/use-app-store.ts')).toBe(true);

    const storeCode = vfs.getFileContent('apps/web/src/store/use-app-store.ts')!;
    expect(storeCode).toContain('export const useAppStore = create');
    expect(storeCode).toContain('devtools(');

    const pkg = JSON.parse(vfs.getFileContent('apps/web/package.json')!);
    expect(pkg.dependencies.zustand).toBeDefined();
  });
});
