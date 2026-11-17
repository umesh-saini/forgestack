import { describe, expect, it } from 'vitest';
import { VirtualFileSystem } from '../../../vfs/vfs.js';
import { sharedPackagesSlice } from '../index.js';
import type { ProjectConfig } from '../../../types/config.js';

describe('Shared Packages Slice', () => {
  const config: ProjectConfig = {
    name: 'test-monorepo',
    targetPath: './test-monorepo',
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

  it('should generate @repo/contracts with Zod schemas and type exports', () => {
    const vfs = new VirtualFileSystem();
    sharedPackagesSlice.apply(vfs, config);

    expect(vfs.hasFile('packages/contracts/package.json')).toBe(true);
    expect(vfs.hasFile('packages/contracts/src/auth.contract.ts')).toBe(true);
    expect(vfs.hasFile('packages/contracts/src/index.ts')).toBe(true);

    const contractCode = vfs.getFileContent('packages/contracts/src/auth.contract.ts')!;
    expect(contractCode).toContain('export const loginRequestSchema');
    expect(contractCode).toContain('export type LoginRequestDto');
  });

  it('should generate @repo/ui with Tailwind-styled button component', () => {
    const vfs = new VirtualFileSystem();
    sharedPackagesSlice.apply(vfs, config);

    expect(vfs.hasFile('packages/ui/package.json')).toBe(true);
    expect(vfs.hasFile('packages/ui/src/button.tsx')).toBe(true);

    const buttonCode = vfs.getFileContent('packages/ui/src/button.tsx')!;
    expect(buttonCode).toContain('export const Button');
    expect(buttonCode).toContain('twMerge');
  });

  it('should generate @repo/typescript-config bases', () => {
    const vfs = new VirtualFileSystem();
    sharedPackagesSlice.apply(vfs, config);

    expect(vfs.hasFile('packages/typescript-config/base.json')).toBe(true);
    expect(vfs.hasFile('packages/typescript-config/react.json')).toBe(true);
    expect(vfs.hasFile('packages/typescript-config/node.json')).toBe(true);
  });
});
