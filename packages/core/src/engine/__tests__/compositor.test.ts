import { describe, expect, it } from 'vitest';
import { RecipeCompositor, type FeatureSlice } from '../compositor.js';
import type { ProjectConfig } from '../../types/config.js';

describe('RecipeCompositor', () => {
  const dummyConfig: ProjectConfig = {
    name: 'test-app',
    targetPath: './test-app',
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
    aiGovernance: { rules: true, skills: true, openSpec: true },
    packageManager: 'pnpm',
    git: true,
    install: false,
  };

  it('should compose slices in ordered pipeline onto VirtualFileSystem', async () => {
    const orderTracker: string[] = [];

    const baseKernelSlice: FeatureSlice = {
      id: 'kernel-monorepo',
      name: 'Monorepo Kernel',
      apply: (vfs) => {
        orderTracker.push('kernel');
        vfs.applyAction({
          type: 'CREATE',
          path: 'pnpm-workspace.yaml',
          content: "packages:\n  - 'apps/*'\n",
        });
      },
    };

    const frontendSlice: FeatureSlice = {
      id: 'fe-react',
      name: 'React 19 Frontend',
      apply: (vfs) => {
        orderTracker.push('frontend');
        vfs.applyAction({
          type: 'CREATE',
          path: 'apps/web/package.json',
          content: '{"name": "web"}',
        });
      },
    };

    const stateSlice: FeatureSlice = {
      id: 'fe-state-query',
      name: 'TanStack Query',
      apply: (vfs) => {
        orderTracker.push('state');
        vfs.applyAction({
          type: 'MERGE_JSON',
          path: 'apps/web/package.json',
          content: {
            dependencies: { '@tanstack/react-query': '^5.66.0' },
          },
        });
      },
    };

    const compositor = new RecipeCompositor()
      .registerSlice(baseKernelSlice)
      .registerSlice(frontendSlice)
      .registerSlice(stateSlice);

    const vfs = await compositor.compose(dummyConfig);

    expect(orderTracker).toEqual(['kernel', 'frontend', 'state']);
    expect(vfs.hasFile('pnpm-workspace.yaml')).toBe(true);
    expect(vfs.hasFile('apps/web/package.json')).toBe(true);

    const webPkg = JSON.parse(vfs.getFileContent('apps/web/package.json')!);
    expect(webPkg.name).toBe('web');
    expect(webPkg.dependencies['@tanstack/react-query']).toBe('^5.66.0');
  });

  it('should propagate diagnostic error on unhandled file collision in slice', async () => {
    const sliceA: FeatureSlice = {
      id: 'slice-a',
      name: 'Slice A',
      apply: (vfs) => {
        vfs.applyAction({
          type: 'CREATE',
          path: 'conflict.txt',
          content: 'A',
        });
      },
    };

    const sliceB: FeatureSlice = {
      id: 'slice-b',
      name: 'Slice B',
      apply: (vfs) => {
        // Unhandled duplicate CREATE on same path
        vfs.applyAction({
          type: 'CREATE',
          path: 'conflict.txt',
          content: 'B',
        });
      },
    };

    const compositor = new RecipeCompositor().registerSlices([sliceA, sliceB]);

    await expect(compositor.compose(dummyConfig)).rejects.toThrowError(
      /Error executing slice 'slice-b'/
    );
  });
});
