import { describe, expect, it } from 'vitest';
import { VirtualFileSystem } from '../../../vfs/vfs.js';
import { reactViteSlice } from '../react-vite.js';
import type { ProjectConfig } from '../../../types/config.js';

describe('React 19 + Vite Frontend Slice', () => {
  const monorepoConfig: ProjectConfig = {
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

  it('should generate frontend inside apps/web for monorepo topology', () => {
    const vfs = new VirtualFileSystem();
    reactViteSlice.apply(vfs, monorepoConfig);

    expect(vfs.hasFile('apps/web/package.json')).toBe(true);
    expect(vfs.hasFile('apps/web/vite.config.ts')).toBe(true);
    expect(vfs.hasFile('apps/web/index.html')).toBe(true);
    expect(vfs.hasFile('apps/web/src/main.tsx')).toBe(true);
    expect(vfs.hasFile('apps/web/src/App.tsx')).toBe(true);

    const viteConfig = vfs.getFileContent('apps/web/vite.config.ts')!;
    expect(viteConfig).toContain('@vitejs/plugin-react');
    expect(viteConfig).toContain("'/api'");

    const mainTsx = vfs.getFileContent('apps/web/src/main.tsx')!;
    expect(mainTsx).toContain('/* FORGESTACK_PROVIDER_SLOT */');
  });

  it('should generate frontend at root for standalone-fe topology', () => {
    const vfs = new VirtualFileSystem();
    reactViteSlice.apply(vfs, { ...monorepoConfig, topology: 'standalone-fe' });

    expect(vfs.hasFile('package.json')).toBe(true);
    expect(vfs.hasFile('vite.config.ts')).toBe(true);
    expect(vfs.hasFile('src/main.tsx')).toBe(true);
  });
});
