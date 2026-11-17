import { describe, expect, it } from 'vitest';
import { VirtualFileSystem } from '../../../vfs/vfs.js';
import { starterUtilitiesSlice } from '../starter-packs.js';
import type { ProjectConfig } from '../../../types/config.js';

describe('Starter Utilities Slice', () => {
  const configWithUtils: ProjectConfig = {
    name: 'utils-app',
    targetPath: './utils-app',
    topology: 'separate-folders',
    frontend: {
      framework: 'react-vite',
      styling: 'tailwind',
      state: 'query',
      uiExtras: { toast: true, icons: true, forms: false },
    },
    backend: { framework: 'fastify', database: 'postgres', orm: 'drizzle', container: true },
    utilities: { frontendHelpers: true, backendHelpers: true },
    aiGovernance: { rules: true, skills: true, openSpec: true },
    packageManager: 'pnpm',
    git: true,
    install: false,
  };

  it('should scaffold frontend and backend helper packs with barrel index exports', () => {
    const vfs = new VirtualFileSystem();
    starterUtilitiesSlice.apply(vfs, configWithUtils);

    // Frontend helpers
    expect(vfs.hasFile('frontend/src/lib/token-manager.ts')).toBe(true);
    expect(vfs.hasFile('frontend/src/lib/axios-client.ts')).toBe(true);
    expect(vfs.hasFile('frontend/src/lib/api-gateway.ts')).toBe(true);
    expect(vfs.hasFile('frontend/src/lib/index.ts')).toBe(true);

    const feIndex = vfs.getFileContent('frontend/src/lib/index.ts')!;
    expect(feIndex).toContain('export * from \'./token-manager.js\'');
    expect(feIndex).toContain('export * from \'./axios-client.js\'');
    expect(feIndex).toContain('export * from \'./api-gateway.js\'');

    // Backend helpers
    expect(vfs.hasFile('backend/src/utils/token-generator.ts')).toBe(true);
    expect(vfs.hasFile('backend/src/utils/password-hasher.ts')).toBe(true);
    expect(vfs.hasFile('backend/src/utils/api-response.ts')).toBe(true);
    expect(vfs.hasFile('backend/src/utils/index.ts')).toBe(true);

    const beIndex = vfs.getFileContent('backend/src/utils/index.ts')!;
    expect(beIndex).toContain('export * from \'./token-generator.js\'');
    expect(beIndex).toContain('export * from \'./password-hasher.js\'');
    expect(beIndex).toContain('export * from \'./api-response.js\'');
  });
});
