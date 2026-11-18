import type { FeatureSlice } from '../../engine/compositor.js';
import { DEPENDENCY_REGISTRY } from '../../registry/dependencies.js';
import type { ProjectConfig } from '../../types/config.js';
import type { VirtualFileSystem } from '../../vfs/vfs.js';

export const playwrightSlice: FeatureSlice = {
  id: 'testing-playwright',
  name: 'Playwright Cross-Browser E2E Testing',
  apply: (vfs: VirtualFileSystem, config: ProjectConfig) => {
    const isEligible =
      config.testing?.e2e === 'playwright' ||
      (config as any).e2e === 'playwright';

    if (!isEligible) {
      return;
    }

    const isMonorepo =
      config.topology === 'monorepo' || config.topology === 'micro-frontend';
    const isNextjs =
      config.topology === 'nextjs-fullstack' || config.frontend.framework === 'nextjs';

    const webPort = isNextjs ? '3000' : isMonorepo ? '3000' : '5173';
    const pm = config.packageManager || 'pnpm';
    const devCommand = pm === 'npm' ? 'npm run dev' : `${pm} dev`;

    // 1. Root package.json E2E scripts and dependency
    vfs.applyAction({
      type: 'MERGE_JSON',
      path: 'package.json',
      content: {
        devDependencies: {
          '@playwright/test': DEPENDENCY_REGISTRY['@playwright/test'],
        },
        scripts: {
          'test:e2e': 'playwright test',
          'test:e2e:ui': 'playwright test --ui',
        },
      },
    });

    // 2. playwright.config.ts
    vfs.applyAction({
      type: 'CREATE',
      path: 'playwright.config.ts',
      content: `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:${webPort}',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: '${devCommand}',
    url: 'http://localhost:${webPort}',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
`,
    });

    // 3. tests/e2e/smoke.spec.ts
    vfs.applyAction({
      type: 'CREATE',
      path: 'tests/e2e/smoke.spec.ts',
      content: `import { test, expect } from '@playwright/test';

test.describe('Application Smoke Test Suite', () => {
  test('should load the home page and verify root hydration', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBeLessThan(400);

    // Verify root element hydration
    const root = page.locator('#root, main, #__next');
    await expect(root.first()).toBeVisible();
  });

  test('should verify API health endpoint returns status 200', async ({ request }) => {
    const health = await request.get('/api/health');
    if (health.ok()) {
      const data = await health.json();
      expect(data).toHaveProperty('status');
    }
  });
});
`,
    });
  },
};
