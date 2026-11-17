import { describe, expect, it } from 'vitest';
import { VirtualFileSystem } from '../../../vfs/vfs.js';
import { pm2Slice } from '../pm2.js';
import type { ProjectConfig } from '../../../types/config.js';

describe('PM2 Process Manager Slice', () => {
  const pm2Config: ProjectConfig = {
    name: 'pm2-app',
    targetPath: './pm2-app',
    topology: 'standalone-be',
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
      processManager: 'pm2',
    },
    aiGovernance: { rules: true, skills: true, openSpec: true },
    packageManager: 'pnpm',
    git: true,
    install: false,
  };

  it('should scaffold ecosystem.config.cjs with cluster configuration', () => {
    const vfs = new VirtualFileSystem();
    pm2Slice.apply(vfs, pm2Config);

    expect(vfs.hasFile('ecosystem.config.cjs')).toBe(true);
    const content = vfs.getFileContent('ecosystem.config.cjs')!;
    expect(content).toContain('pm2-app-api');
    expect(content).toContain('exec_mode: \'cluster\'');
    expect(content).toContain('instances: \'max\'');
  });
});
