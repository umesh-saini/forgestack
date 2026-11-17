import { describe, expect, it } from 'vitest';
import { VirtualFileSystem } from '../../../vfs/vfs.js';
import { gsdGovernanceSlice } from '../gsd.js';
import { specKitGovernanceSlice } from '../spec-kit.js';
import type { ProjectConfig } from '../../../types/config.js';

describe('Open-GSD and GitHub Spec-Kit Governance Slices', () => {
  const gsdConfig: ProjectConfig = {
    name: 'gsd-app',
    targetPath: './gsd-app',
    topology: 'monorepo',
    frontend: {
      framework: 'react-vite',
      styling: 'tailwind',
      state: 'query',
      uiExtras: { toast: true, icons: true, forms: false },
    },
    backend: { framework: 'fastify', database: 'postgres', orm: 'drizzle', container: true },
    aiGovernance: { rules: true, skills: true, openSpec: true, engine: 'gsd' },
    packageManager: 'pnpm',
    git: true,
    install: false,
  };

  const specKitConfig: ProjectConfig = {
    name: 'speckit-app',
    targetPath: './speckit-app',
    topology: 'monorepo',
    frontend: {
      framework: 'react-vite',
      styling: 'tailwind',
      state: 'query',
      uiExtras: { toast: true, icons: true, forms: false },
    },
    backend: { framework: 'fastify', database: 'postgres', orm: 'drizzle', container: true },
    aiGovernance: { rules: true, skills: true, openSpec: true, engine: 'speckit' },
    packageManager: 'pnpm',
    git: true,
    install: false,
  };

  it('should scaffold Open-GSD structure and workflows', () => {
    const vfs = new VirtualFileSystem();
    gsdGovernanceSlice.apply(vfs, gsdConfig);

    expect(vfs.hasFile('gsd/PROJECT.md')).toBe(true);
    expect(vfs.hasFile('gsd/REQUIREMENTS.md')).toBe(true);
    expect(vfs.hasFile('gsd/ROADMAP.md')).toBe(true);
    expect(vfs.hasFile('gsd/STATE.md')).toBe(true);
    expect(vfs.hasFile('.agents/workflows/gsd-plan.md')).toBe(true);
    expect(vfs.hasFile('.agents/workflows/gsd-execute.md')).toBe(true);
    expect(vfs.hasFile('.agents/workflows/gsd-verify.md')).toBe(true);
  });

  it('should scaffold GitHub Spec-Kit structure and workflows', () => {
    const vfs = new VirtualFileSystem();
    specKitGovernanceSlice.apply(vfs, specKitConfig);

    expect(vfs.hasFile('.spec-kit/constitution.md')).toBe(true);
    expect(vfs.hasFile('.spec-kit/specs/feature-template.md')).toBe(true);
    expect(vfs.hasFile('.spec-kit/tasks/task-runner.md')).toBe(true);
    expect(vfs.hasFile('.spec-kit/prompts/implement.prompt.md')).toBe(true);
    expect(vfs.hasFile('.agents/workflows/speckit-spec.md')).toBe(true);
    expect(vfs.hasFile('.agents/workflows/speckit-implement.md')).toBe(true);
    expect(vfs.hasFile('.agents/workflows/speckit-review.md')).toBe(true);
  });
});
