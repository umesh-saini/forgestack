import { describe, expect, it } from 'vitest';
import { deepMergeJson, mergePackageJson } from '../json-merge.js';

describe('JSON Merger Utilities', () => {
  it('should deeply merge nested configuration objects', () => {
    const target = {
      compilerOptions: {
        target: 'ES2022',
        module: 'NodeNext',
        strict: true,
      },
      include: ['src/**/*'],
    };

    const source = {
      compilerOptions: {
        jsx: 'react-jsx',
        noImplicitAny: true,
      },
      include: ['tests/**/*'],
    };

    const result = deepMergeJson(target, source);

    expect(result.compilerOptions).toEqual({
      target: 'ES2022',
      module: 'NodeNext',
      strict: true,
      jsx: 'react-jsx',
      noImplicitAny: true,
    });
    expect(result.include).toEqual(['src/**/*', 'tests/**/*']);
  });

  it('should merge package.json while preserving custom scripts and sorting dependencies', () => {
    const basePkg = {
      name: 'my-project',
      version: '0.0.1',
      scripts: {
        build: 'tsc',
        custom: 'node custom.js',
      },
      dependencies: {
        zod: '^3.24.2',
        react: '^19.0.0',
      },
    };

    const slicePkg = {
      scripts: {
        test: 'vitest',
        build: 'vite build', // overrides tsc with vite build
      },
      dependencies: {
        '@tanstack/react-query': '^5.66.0',
      },
      devDependencies: {
        tailwindcss: '^4.0.0',
      },
    };

    const merged = mergePackageJson(basePkg, slicePkg);

    expect(merged.name).toBe('my-project');
    expect(merged.scripts).toEqual({
      build: 'vite build',
      custom: 'node custom.js',
      test: 'vitest',
    });

    // Dependencies should be merged and keys sorted alphabetically
    expect(Object.keys(merged.dependencies as Record<string, string>)).toEqual([
      '@tanstack/react-query',
      'react',
      'zod',
    ]);
  });
});
