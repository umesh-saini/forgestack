import { describe, expect, it } from 'vitest';
import { VirtualFileSystem } from '../../../vfs/vfs.js';
import { cleanModularBackendSlice } from '../../backend/clean-modular.js';
import { postgresSlice } from '../postgres.js';
import type { ProjectConfig } from '../../../types/config.js';

describe('PostgreSQL Database Slice', () => {
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
      database: 'postgres',
      orm: 'drizzle',
      container: false,
    },
    aiGovernance: { rules: true, skills: true, openSpec: true },
    packageManager: 'pnpm',
    git: true,
    install: false,
  };

  it('should scaffold PostgreSQL with Drizzle ORM and patch server lifecycle', () => {
    const vfs = new VirtualFileSystem();
    cleanModularBackendSlice.apply(vfs, baseConfig);
    postgresSlice.apply(vfs, baseConfig);

    expect(vfs.hasFile('apps/api/drizzle.config.ts')).toBe(true);
    expect(vfs.hasFile('apps/api/src/database/schema/users.ts')).toBe(true);
    expect(vfs.hasFile('apps/api/src/database/connection.ts')).toBe(true);

    const connCode = vfs.getFileContent('apps/api/src/database/connection.ts')!;
    expect(connCode).toContain('new Pool(');
    expect(connCode).toContain('drizzle(this.pool');
    expect(connCode).toContain('SELECT 1');
    expect(connCode).toContain('checkHealth()');

    const serverCode = vfs.getFileContent('apps/api/src/server.ts')!;
    expect(serverCode).toContain("import { Database } from './database/connection.js';");
    expect(serverCode).toContain('await Database.connect();');
    expect(serverCode).toContain('await Database.disconnect();');

    const pkg = JSON.parse(vfs.getFileContent('apps/api/package.json')!);
    expect(pkg.dependencies['drizzle-orm']).toBeDefined();
    expect(pkg.dependencies.pg).toBeDefined();
  });

  it('should scaffold PostgreSQL with Prisma ORM when prisma is selected', () => {
    const vfs = new VirtualFileSystem();
    const prismaConfig = {
      ...baseConfig,
      backend: { ...baseConfig.backend, orm: 'prisma' as const },
    };
    cleanModularBackendSlice.apply(vfs, prismaConfig);
    postgresSlice.apply(vfs, prismaConfig);

    expect(vfs.hasFile('apps/api/prisma/schema.prisma')).toBe(true);
    expect(vfs.hasFile('apps/api/src/database/connection.ts')).toBe(true);

    const schema = vfs.getFileContent('apps/api/prisma/schema.prisma')!;
    expect(schema).toContain('provider = "postgresql"');
    expect(schema).toContain('model User');

    const pkg = JSON.parse(vfs.getFileContent('apps/api/package.json')!);
    expect(pkg.dependencies['@prisma/client']).toBeDefined();
  });
});
