import { describe, expect, it } from 'vitest';
import { VirtualFileSystem } from '../../../vfs/vfs.js';
import { monorepoKernelSlice } from '../index.js';
import type { ProjectConfig } from '../../../types/config.js';

describe('Monorepo Kernel Slice', () => {
  const config: ProjectConfig = {
    name: 'enterprise-app',
    targetPath: './enterprise-app',
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

  it('should generate valid monorepo root files with Turborepo v2 configuration', () => {
    const vfs = new VirtualFileSystem();
    monorepoKernelSlice.apply(vfs, config);

    expect(vfs.hasFile('pnpm-workspace.yaml')).toBe(true);
    expect(vfs.hasFile('turbo.json')).toBe(true);
    expect(vfs.hasFile('.npmrc')).toBe(true);
    expect(vfs.hasFile('package.json')).toBe(true);

    const turbo = JSON.parse(vfs.getFileContent('turbo.json')!);
    expect(turbo.$schema).toBe('https://turbo.build/schema.json');
    expect(turbo.tasks.build).toBeDefined();
    expect(turbo.tasks.lint).toBeDefined();
    expect(turbo.tasks.typecheck).toBeDefined();

    const pkg = JSON.parse(vfs.getFileContent('package.json')!);
    expect(pkg.name).toBe('enterprise-app');
    expect(pkg.private).toBe(true);
    expect(pkg.scripts.build).toBe('turbo run build');
    expect(pkg.devDependencies.turbo).toBeDefined();
  });
});
