import { describe, expect, it } from 'vitest';
import { VirtualFileSystem } from '../../../vfs/vfs.js';
import { deploymentTargetsSlice } from '../deployment-targets.js';
import type { ProjectConfig } from '../../../types/config.js';

describe('Multi-Cloud Deployment Targets Slice', () => {
  const baseConfig: ProjectConfig = {
    name: 'test-cloud-app',
    targetPath: './test-cloud-app',
    topology: 'standalone-fe',
    frontend: {
      framework: 'react-vite',
      styling: 'tailwind',
      state: 'query',
      uiExtras: { toast: true, icons: true, forms: true },
    },
    backend: {
      framework: 'none',
      database: 'none',
      orm: 'none',
      container: false,
    },
    aiGovernance: { rules: true, skills: true, openSpec: true },
    packageManager: 'pnpm',
    git: true,
    install: false,
  };

  it('should generate vercel.json for Vercel deployment', () => {
    const vfs = new VirtualFileSystem();
    deploymentTargetsSlice.apply(vfs, { ...baseConfig, deployment: 'vercel' });

    expect(vfs.hasFile('vercel.json')).toBe(true);
    const vercel = JSON.parse(vfs.getFileContent('vercel.json')!);
    expect(vercel.$schema).toContain('vercel.sh');
    expect(vercel.rewrites).toBeDefined();
  });

  it('should generate wrangler.jsonc for Cloudflare deployment', () => {
    const vfs = new VirtualFileSystem();
    deploymentTargetsSlice.apply(vfs, { ...baseConfig, deployment: 'cloudflare' });

    expect(vfs.hasFile('wrangler.jsonc')).toBe(true);
    const wrangler = vfs.getFileContent('wrangler.jsonc')!;
    expect(wrangler).toContain('compatibility_date');
    expect(wrangler).toContain('ASSETS');
  });

  it('should generate railway.json for Railway deployment', () => {
    const vfs = new VirtualFileSystem();
    deploymentTargetsSlice.apply(vfs, { ...baseConfig, deployment: 'railway' });

    expect(vfs.hasFile('railway.json')).toBe(true);
    const railway = JSON.parse(vfs.getFileContent('railway.json')!);
    expect(railway.build.builder).toBe('NIXPACKS');
  });

  it('should generate fly.toml for Fly.io deployment', () => {
    const vfs = new VirtualFileSystem();
    deploymentTargetsSlice.apply(vfs, { ...baseConfig, deployment: 'fly' });

    expect(vfs.hasFile('fly.toml')).toBe(true);
    const fly = vfs.getFileContent('fly.toml')!;
    expect(fly).toContain('app = "test-cloud-app"');
    expect(fly).toContain('internal_port');
  });

  it('should ignore cloud generation when deployment is docker or none', () => {
    const vfs = new VirtualFileSystem();
    deploymentTargetsSlice.apply(vfs, { ...baseConfig, deployment: 'docker' });
    expect(vfs.hasFile('vercel.json')).toBe(false);
    expect(vfs.hasFile('wrangler.jsonc')).toBe(false);
    expect(vfs.hasFile('railway.json')).toBe(false);
    expect(vfs.hasFile('fly.toml')).toBe(false);
  });
});
