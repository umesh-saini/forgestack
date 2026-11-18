import { describe, expect, it } from 'vitest';
import { VirtualFileSystem } from '../../../vfs/vfs.js';
import { cleanModularBackendSlice } from '../../backend/clean-modular.js';
import { sqliteSlice } from '../sqlite.js';
import { generateProjectVfs } from '../../../engine/create-pipeline.js';
import type { ProjectConfig } from '../../../types/config.js';

describe('SQLite Database Slice', () => {
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
      database: 'sqlite',
      orm: 'drizzle',
      container: false,
    },
    aiGovernance: { rules: true, skills: true, openSpec: true },
    packageManager: 'pnpm',
    git: true,
    install: false,
  };

  it('should scaffold SQLite with Drizzle ORM and better-sqlite3 in WAL mode', () => {
    const vfs = new VirtualFileSystem();
    cleanModularBackendSlice.apply(vfs, baseConfig);
    sqliteSlice.apply(vfs, baseConfig);

    expect(vfs.hasFile('apps/api/drizzle.config.ts')).toBe(true);
    expect(vfs.hasFile('apps/api/src/database/schema/users.ts')).toBe(true);
    expect(vfs.hasFile('apps/api/src/database/connection.ts')).toBe(true);

    const drizzleConfig = vfs.getFileContent('apps/api/drizzle.config.ts')!;
    expect(drizzleConfig).toContain("dialect: 'sqlite'");

    const schemaCode = vfs.getFileContent('apps/api/src/database/schema/users.ts')!;
    expect(schemaCode).toContain("sqliteTable('users'");

    const connCode = vfs.getFileContent('apps/api/src/database/connection.ts')!;
    expect(connCode).toContain('better-sqlite3');
    expect(connCode).toContain("pragma('journal_mode = WAL')");
    expect(connCode).toContain('drizzle(this.client');
    expect(connCode).toContain('checkHealth()');

    const serverCode = vfs.getFileContent('apps/api/src/server.ts')!;
    expect(serverCode).toContain("import { Database } from './database/connection.js';");
    expect(serverCode).toContain('await Database.connect();');
    expect(serverCode).toContain('await Database.disconnect();');

    const pkg = JSON.parse(vfs.getFileContent('apps/api/package.json')!);
    expect(pkg.dependencies['drizzle-orm']).toBeDefined();
    expect(pkg.dependencies['better-sqlite3']).toBeDefined();
    expect(pkg.devDependencies['drizzle-kit']).toBeDefined();
    expect(pkg.devDependencies['@types/better-sqlite3']).toBeDefined();
  });

  it('should scaffold SQLite with Prisma ORM when prisma is selected', () => {
    const vfs = new VirtualFileSystem();
    const prismaConfig = {
      ...baseConfig,
      backend: { ...baseConfig.backend, orm: 'prisma' as const },
    };
    cleanModularBackendSlice.apply(vfs, prismaConfig);
    sqliteSlice.apply(vfs, prismaConfig);

    expect(vfs.hasFile('apps/api/prisma/schema.prisma')).toBe(true);
    expect(vfs.hasFile('apps/api/src/database/connection.ts')).toBe(true);

    const schema = vfs.getFileContent('apps/api/prisma/schema.prisma')!;
    expect(schema).toContain('provider = "sqlite"');
    expect(schema).toContain('model User');

    const pkg = JSON.parse(vfs.getFileContent('apps/api/package.json')!);
    expect(pkg.dependencies['@prisma/client']).toBeDefined();
    expect(pkg.devDependencies.prisma).toBeDefined();
  });

  it('should compose through generateProjectVfs with Hono and SQLite', async () => {
    const honoSqliteConfig: ProjectConfig = {
      ...baseConfig,
      backend: {
        framework: 'hono',
        database: 'sqlite',
        orm: 'drizzle',
        container: false,
      },
    };

    const vfs = await generateProjectVfs(honoSqliteConfig);

    expect(vfs.hasFile('apps/api/src/database/connection.ts')).toBe(true);
    expect(vfs.hasFile('apps/api/drizzle.config.ts')).toBe(true);

    const serverCode = vfs.getFileContent('apps/api/src/server.ts')!;
    expect(serverCode).toContain("import { serve } from '@hono/node-server'");
    expect(serverCode).toContain("import { Database } from './database/connection.js';");
    expect(serverCode).toContain('await Database.connect();');
    expect(serverCode).toContain('await Database.disconnect();');
  });
});
