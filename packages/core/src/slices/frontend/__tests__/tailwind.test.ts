import { describe, expect, it } from 'vitest';
import { VirtualFileSystem } from '../../../vfs/vfs.js';
import { reactViteSlice } from '../react-vite.js';
import { tailwindSlice } from '../tailwind.js';
import type { ProjectConfig } from '../../../types/config.js';

describe('Tailwind CSS v4 Styling Slice', () => {
  const config: ProjectConfig = {
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

  it('should patch React Vite app with Tailwind v4 imports, plugin, and cn utility', () => {
    const vfs = new VirtualFileSystem();
    reactViteSlice.apply(vfs, config);
    tailwindSlice.apply(vfs, config);

    expect(vfs.hasFile('apps/web/src/lib/utils.ts')).toBe(true);

    const utils = vfs.getFileContent('apps/web/src/lib/utils.ts')!;
    expect(utils).toContain('export function cn');
    expect(utils).toContain('twMerge(clsx(inputs))');

    const css = vfs.getFileContent('apps/web/src/index.css')!;
    expect(css).toContain('@import "tailwindcss";');

    const viteConfig = vfs.getFileContent('apps/web/vite.config.ts')!;
    expect(viteConfig).toContain('@tailwindcss/vite');
    expect(viteConfig).toContain('tailwindcss()');

    const pkg = JSON.parse(vfs.getFileContent('apps/web/package.json')!);
    expect(pkg.dependencies.clsx).toBeDefined();
    expect(pkg.dependencies['tailwind-merge']).toBeDefined();
    expect(pkg.devDependencies.tailwindcss).toBeDefined();
  });
});
