import { describe, expect, it } from 'vitest';
import { VirtualFileSystem } from '../../../vfs/vfs.js';
import { reactViteSlice } from '../react-vite.js';
import { uiExtrasSlice } from '../ui-extras.js';
import type { ProjectConfig } from '../../../types/config.js';

describe('UI Extras Slice', () => {
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

  it('should generate ToastProvider, Icon helper, and LoginForm', () => {
    const vfs = new VirtualFileSystem();
    reactViteSlice.apply(vfs, config);
    uiExtrasSlice.apply(vfs, config);

    expect(vfs.hasFile('apps/web/src/providers/toast-provider.tsx')).toBe(true);
    expect(vfs.hasFile('apps/web/src/components/ui/icon.tsx')).toBe(true);
    expect(vfs.hasFile('apps/web/src/components/forms/login-form.tsx')).toBe(true);

    const mainTsx = vfs.getFileContent('apps/web/src/main.tsx')!;
    expect(mainTsx).toContain('<ToastProvider>');
    expect(mainTsx).toContain('</ToastProvider>');

    const pkg = JSON.parse(vfs.getFileContent('apps/web/package.json')!);
    expect(pkg.dependencies.sonner).toBeDefined();
    expect(pkg.dependencies['lucide-react']).toBeDefined();
    expect(pkg.dependencies['react-hook-form']).toBeDefined();
    expect(pkg.dependencies['@hookform/resolvers']).toBeDefined();
  });
});
