import { describe, expect, it } from 'vitest';
import { generateProjectVfs } from '../../../engine/create-pipeline.js';
import type { ProjectConfig } from '../../../types/config.js';

describe('Playwright E2E Testing Slice', () => {
  it('should scaffold Playwright config, smoke tests, and e2e scripts when e2e is playwright', async () => {
    const config: ProjectConfig = {
      name: 'playwright-test-app',
      targetPath: '/test/playwright-test-app',
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
      testing: {
        e2e: 'playwright',
      },
      aiGovernance: { rules: true, skills: true, openSpec: true },
      packageManager: 'pnpm',
      git: true,
      install: false,
    };

    const vfs = await generateProjectVfs(config);

    // Dependencies and scripts in root package.json
    const pkg = JSON.parse(vfs.getFileContent('package.json')!);
    expect(pkg.devDependencies['@playwright/test']).toBeDefined();
    expect(pkg.scripts['test:e2e']).toBe('playwright test');
    expect(pkg.scripts['test:e2e:ui']).toBe('playwright test --ui');

    // Config file
    expect(vfs.hasFile('playwright.config.ts')).toBe(true);
    const configContent = vfs.getFileContent('playwright.config.ts')!;
    expect(configContent).toContain("testDir: './tests/e2e'");
    expect(configContent).toContain("name: 'chromium'");
    expect(configContent).toContain("name: 'firefox'");
    expect(configContent).toContain("name: 'webkit'");
    expect(configContent).toContain('webServer:');

    // Smoke test file
    expect(vfs.hasFile('tests/e2e/smoke.spec.ts')).toBe(true);
    const smokeContent = vfs.getFileContent('tests/e2e/smoke.spec.ts')!;
    expect(smokeContent).toContain("test.describe('Application Smoke Test Suite'");
    expect(smokeContent).toContain("page.goto('/')");
    expect(smokeContent).toContain("request.get('/api/health')");
  });

  it('should not scaffold Playwright files when e2e is none', async () => {
    const config: ProjectConfig = {
      name: 'no-playwright-app',
      targetPath: '/test/no-playwright-app',
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
      testing: {
        e2e: 'none',
      },
      aiGovernance: { rules: true, skills: true, openSpec: true },
      packageManager: 'pnpm',
      git: true,
      install: false,
    };

    const vfs = await generateProjectVfs(config);

    expect(vfs.hasFile('playwright.config.ts')).toBe(false);
    expect(vfs.hasFile('tests/e2e/smoke.spec.ts')).toBe(false);
  });
});
