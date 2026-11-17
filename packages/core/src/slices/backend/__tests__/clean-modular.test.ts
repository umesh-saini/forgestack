import { describe, expect, it } from 'vitest';
import { VirtualFileSystem } from '../../../vfs/vfs.js';
import { cleanModularBackendSlice } from '../clean-modular.js';
import type { ProjectConfig } from '../../../types/config.js';

describe('Clean Modular Backend Slice', () => {
  const baseConfig: ProjectConfig = {
    name: 'test-backend',
    targetPath: './test-backend',
    topology: 'monorepo',
    frontend: {
      framework: 'none',
      styling: 'none',
      state: 'none',
      uiExtras: { toast: false, icons: false, forms: false },
    },
    backend: {
      framework: 'fastify',
      database: 'none',
      orm: 'none',
      container: false,
    },
    aiGovernance: { rules: true, skills: true, openSpec: true },
    packageManager: 'pnpm',
    git: true,
    install: false,
  };

  it('should generate Fastify modular backend with Zod env validation and Pino logger', () => {
    const vfs = new VirtualFileSystem();
    cleanModularBackendSlice.apply(vfs, baseConfig);

    expect(vfs.hasFile('apps/api/package.json')).toBe(true);
    expect(vfs.hasFile('apps/api/src/config/env.ts')).toBe(true);
    expect(vfs.hasFile('apps/api/src/shared/utils/logger.ts')).toBe(true);
    expect(vfs.hasFile('apps/api/src/shared/errors/app-error.ts')).toBe(true);
    expect(vfs.hasFile('apps/api/src/modules/health/health.routes.ts')).toBe(true);
    expect(vfs.hasFile('apps/api/src/app.ts')).toBe(true);
    expect(vfs.hasFile('apps/api/src/server.ts')).toBe(true);

    const appCode = vfs.getFileContent('apps/api/src/app.ts')!;
    expect(appCode).toContain('export async function buildApp()');
    expect(appCode).toContain('@fastify/cors');
    expect(appCode).toContain('@fastify/helmet');

    const envCode = vfs.getFileContent('apps/api/src/config/env.ts')!;
    expect(envCode).toContain('export const env = parseEnv()');
  });

  it('should generate Express modular backend when express is selected', () => {
    const vfs = new VirtualFileSystem();
    const expressConfig = {
      ...baseConfig,
      backend: { ...baseConfig.backend, framework: 'express' as const },
    };
    cleanModularBackendSlice.apply(vfs, expressConfig);

    const appCode = vfs.getFileContent('apps/api/src/app.ts')!;
    expect(appCode).toContain('export const app = express()');
    expect(appCode).toContain('cors(');
    expect(appCode).toContain('helmet()');

    const serverCode = vfs.getFileContent('apps/api/src/server.ts')!;
    expect(serverCode).toContain('server = app.listen(');
  });
});
