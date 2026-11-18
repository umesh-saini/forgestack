import { describe, expect, it } from 'vitest';
import { VirtualFileSystem } from '../../../vfs/vfs.js';
import { biomeSlice } from '../biome.js';
import type { ProjectConfig } from '../../../types/config.js';

describe('Biome Tooling Slice', () => {
  const baseConfig: ProjectConfig = {
    name: 'test-app',
    targetPath: './test-app',
    topology: 'standalone-fe',
    linter: 'biome',
    frontend: {
      framework: 'react-vite',
      styling: 'tailwind',
      state: 'query',
      uiExtras: { toast: true, icons: true, forms: true },
    },
    backend: {
      framework: 'none',
      database: 'none',
      orm: 'none',
      container: false,
    },
    aiGovernance: { rules: true, skills: true, openSpec: true },
    packageManager: 'pnpm',
    git: true,
    install: false,
  };

  it('should generate biome.json and update package.json when linter is biome', () => {
    const vfs = new VirtualFileSystem();
    vfs.applyAction({
      type: 'CREATE',
      path: 'package.json',
      content: JSON.stringify({
        name: 'test-app',
        scripts: { build: 'tsc' },
      }),
    });

    biomeSlice.apply(vfs, baseConfig);

    expect(vfs.hasFile('biome.json')).toBe(true);
    const biomeConfig = JSON.parse(vfs.getFileContent('biome.json')!);
    expect(biomeConfig.$schema).toContain('biomejs.dev');
    expect(biomeConfig.formatter.enabled).toBe(true);
    expect(biomeConfig.linter.enabled).toBe(true);

    const pkgJson = JSON.parse(vfs.getFileContent('package.json')!);
    expect(pkgJson.scripts.lint).toBe('biome check .');
    expect(pkgJson.devDependencies['@biomejs/biome']).toBeDefined();
  });

  it('should not generate biome.json when linter is eslint', () => {
    const vfs = new VirtualFileSystem();
    biomeSlice.apply(vfs, { ...baseConfig, linter: 'eslint' });

    expect(vfs.hasFile('biome.json')).toBe(false);
  });
});
