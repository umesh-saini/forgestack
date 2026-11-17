import { describe, expect, it } from 'vitest';
import { VirtualFileSystem } from '../../../vfs/vfs.js';
import { cleanModularBackendSlice } from '../../backend/clean-modular.js';
import { mongodbSlice } from '../mongodb.js';
import type { ProjectConfig } from '../../../types/config.js';

describe('MongoDB Database Slice', () => {
  const config: ProjectConfig = {
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
      database: 'mongodb',
      orm: 'mongoose',
      container: false,
    },
    aiGovernance: { rules: true, skills: true, openSpec: true },
    packageManager: 'pnpm',
    git: true,
    install: false,
  };

  it('should scaffold MongoDB with Mongoose model and connection retry loop', () => {
    const vfs = new VirtualFileSystem();
    cleanModularBackendSlice.apply(vfs, config);
    mongodbSlice.apply(vfs, config);

    expect(vfs.hasFile('apps/api/src/database/models/user.model.ts')).toBe(true);
    expect(vfs.hasFile('apps/api/src/database/connection.ts')).toBe(true);

    const modelCode = vfs.getFileContent('apps/api/src/database/models/user.model.ts')!;
    expect(modelCode).toContain('export interface IUser');
    expect(modelCode).toContain('mongoose.model<IUser>');

    const connCode = vfs.getFileContent('apps/api/src/database/connection.ts')!;
    expect(connCode).toContain('mongoose.connect(');
    expect(connCode).toContain('retries -= 1');
    expect(connCode).toContain('isHealthy()');

    const serverCode = vfs.getFileContent('apps/api/src/server.ts')!;
    expect(serverCode).toContain("import { MongoDatabase } from './database/connection.js';");
    expect(serverCode).toContain('await MongoDatabase.connect();');
    expect(serverCode).toContain('await MongoDatabase.disconnect();');

    const pkg = JSON.parse(vfs.getFileContent('apps/api/package.json')!);
    expect(pkg.dependencies.mongoose).toBeDefined();
  });
});
