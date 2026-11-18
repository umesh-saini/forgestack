import { describe, expect, it } from 'vitest';
import { generateProjectVfs } from '../../../engine/create-pipeline.js';
import type { ProjectConfig } from '../../../types/config.js';

describe('True Micro-Frontend Federation Slice', () => {
  it('should scaffold apps/shell, apps/remote-dashboard, and packages/event-bus for micro-frontend topology', async () => {
    const config: ProjectConfig = {
      name: 'micro-fe-platform',
      targetPath: '/test/micro-fe-platform',
      topology: 'micro-frontend',
      frontend: {
        framework: 'react-vite',
        styling: 'tailwind',
        state: 'none',
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

    const vfs = await generateProjectVfs(config);

    // 1. Shared EventBus
    expect(vfs.hasFile('packages/event-bus/package.json')).toBe(true);
    const busPkg = JSON.parse(vfs.getFileContent('packages/event-bus/package.json')!);
    expect(busPkg.name).toBe('@repo/event-bus');

    expect(vfs.hasFile('packages/event-bus/src/index.ts')).toBe(true);
    const busCode = vfs.getFileContent('packages/event-bus/src/index.ts')!;
    expect(busCode).toContain('export class MicroFrontendEventBus');
    expect(busCode).toContain('export const eventBus = new MicroFrontendEventBus();');

    // 2. apps/shell (Host Container)
    expect(vfs.hasFile('apps/shell/package.json')).toBe(true);
    const shellPkg = JSON.parse(vfs.getFileContent('apps/shell/package.json')!);
    expect(shellPkg.name).toBe('@repo/shell');
    expect(shellPkg.dependencies['@module-federation/vite']).toBeDefined();
    expect(shellPkg.dependencies['@repo/event-bus']).toBe('workspace:*');

    expect(vfs.hasFile('apps/shell/vite.config.ts')).toBe(true);
    const shellVite = vfs.getFileContent('apps/shell/vite.config.ts')!;
    expect(shellVite).toContain("name: 'shell'");
    expect(shellVite).toContain('remoteDashboard: {');

    expect(vfs.hasFile('apps/shell/src/App.tsx')).toBe(true);
    const shellApp = vfs.getFileContent('apps/shell/src/App.tsx')!;
    expect(shellApp).toContain("import('remoteDashboard/DashboardWidget')");
    expect(shellApp).toContain('eventBus.subscribe');

    // 3. apps/remote-dashboard (Remote Federated Module)
    expect(vfs.hasFile('apps/remote-dashboard/package.json')).toBe(true);
    const remotePkg = JSON.parse(vfs.getFileContent('apps/remote-dashboard/package.json')!);
    expect(remotePkg.name).toBe('@repo/remote-dashboard');
    expect(remotePkg.dependencies['@module-federation/vite']).toBeDefined();

    expect(vfs.hasFile('apps/remote-dashboard/vite.config.ts')).toBe(true);
    const remoteVite = vfs.getFileContent('apps/remote-dashboard/vite.config.ts')!;
    expect(remoteVite).toContain("name: 'remoteDashboard'");
    expect(remoteVite).toContain("'./DashboardWidget': './src/DashboardWidget.tsx'");

    expect(vfs.hasFile('apps/remote-dashboard/src/DashboardWidget.tsx')).toBe(true);
    const widgetCode = vfs.getFileContent('apps/remote-dashboard/src/DashboardWidget.tsx')!;
    expect(widgetCode).toContain('export function DashboardWidget()');
    expect(widgetCode).toContain("eventBus.publish('dashboard:alert'");

    // 4. apps/api exists
    expect(vfs.hasFile('apps/api/package.json')).toBe(true);
  });

  it('should not scaffold micro-frontend apps for standard monorepo', async () => {
    const config: ProjectConfig = {
      name: 'std-monorepo',
      targetPath: '/test/std-monorepo',
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

    const vfs = await generateProjectVfs(config);

    expect(vfs.hasFile('apps/shell/package.json')).toBe(false);
    expect(vfs.hasFile('apps/remote-dashboard/package.json')).toBe(false);
    expect(vfs.hasFile('packages/event-bus/package.json')).toBe(false);
  });
});
