import { describe, expect, it } from 'vitest';
import { generateProjectVfs } from '../../../engine/create-pipeline.js';
import type { ProjectConfig } from '../../../types/config.js';

describe('GitHub Actions CI/CD Pipeline Slice', () => {
  it('should scaffold .github/workflows/ci.yml with Node 20 & 22 matrix for monorepo and Playwright', async () => {
    const config: ProjectConfig = {
      name: 'ci-monorepo-test',
      targetPath: '/test/ci-monorepo-test',
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
      testing: {
        e2e: 'playwright',
      },
      ci: 'github-actions',
      aiGovernance: { rules: true, skills: true, openSpec: true },
      packageManager: 'pnpm',
      git: true,
      install: false,
    };

    const vfs = await generateProjectVfs(config);

    expect(vfs.hasFile('.github/workflows/ci.yml')).toBe(true);
    const ciContent = vfs.getFileContent('.github/workflows/ci.yml')!;
    expect(ciContent).toContain('name: CI Matrix');
    expect(ciContent).toContain('node-version: [20, 22]');
    expect(ciContent).toContain('uses: actions/checkout@v4');
    expect(ciContent).toContain('uses: pnpm/action-setup@v4');
    expect(ciContent).toContain('pnpm turbo run lint typecheck test build');
    expect(ciContent).toContain('npx playwright install --with-deps');
    expect(ciContent).toContain('pnpm test:e2e');
  });

  it('should not scaffold CI workflow when ci is none', async () => {
    const config: ProjectConfig = {
      name: 'no-ci-app',
      targetPath: '/test/no-ci-app',
      topology: 'standalone-fe',
      frontend: {
        framework: 'react-vite',
        styling: 'tailwind',
        state: 'none',
        uiExtras: { toast: false, icons: false, forms: false },
      },
      backend: {
        framework: 'none',
        database: 'none',
        orm: 'none',
        container: false,
      },
      ci: 'none',
      aiGovernance: { rules: true, skills: true, openSpec: true },
      packageManager: 'pnpm',
      git: true,
      install: false,
    };

    const vfs = await generateProjectVfs(config);

    expect(vfs.hasFile('.github/workflows/ci.yml')).toBe(false);
  });
});
