import { describe, expect, it } from 'vitest';
import { VirtualFileSystem } from '../../../vfs/vfs.js';
import { aiRulesSlice } from '../ai-rules.js';
import type { ProjectConfig } from '../../../types/config.js';

describe('AI Rules & Governance Slice', () => {
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

  it('should scaffold complete AI rules, skills, cursor rules, and OpenSpec configuration', () => {
    const vfs = new VirtualFileSystem();
    aiRulesSlice.apply(vfs, config);

    expect(vfs.hasFile('.cursor/rules/01-architecture-boundaries.mdc')).toBe(true);
    expect(vfs.hasFile('.cursor/rules/02-typescript-strict.mdc')).toBe(true);
    expect(vfs.hasFile('.cursor/rules/03-brutally-honest-reviewer.mdc')).toBe(true);
    expect(vfs.hasFile('.agents/skills/clean-code-guard/SKILL.md')).toBe(true);
    expect(vfs.hasFile('.agents/skills/anti-ui-slop/SKILL.md')).toBe(true);
    expect(vfs.hasFile('.agents/skills/react-patterns/SKILL.md')).toBe(true);
    expect(vfs.hasFile('.agents/skills/tailwind-patterns/SKILL.md')).toBe(true);
    expect(vfs.hasFile('.agents/skills/typescript-pro/SKILL.md')).toBe(true);
    expect(vfs.hasFile('.agents/skills/drizzle-orm-expert/SKILL.md')).toBe(true);
    expect(vfs.hasFile('.agents/skills/postgres-best-practices/SKILL.md')).toBe(true);
    expect(vfs.hasFile('.agents/skills/docker-expert/SKILL.md')).toBe(true);
    expect(vfs.hasFile('.agents/skills/ask-sonner/SKILL.md')).toBe(true);
    expect(vfs.hasFile('.agents/workflows/opsx-propose.md')).toBe(true);
    expect(vfs.hasFile('.github/copilot-instructions.md')).toBe(true);
    expect(vfs.hasFile('openspec/config.yaml')).toBe(true);

    const brutalReviewer = vfs.getFileContent('.cursor/rules/03-brutally-honest-reviewer.mdc')!;
    expect(brutalReviewer).toContain('Brutally Honest Engineering Reviewer');
    expect(brutalReviewer).toContain('Zero Fake Praise');

    const uiSkill = vfs.getFileContent('.agents/skills/anti-ui-slop/SKILL.md')!;
    expect(uiSkill).toContain('name: anti-ui-slop');

    const cleanCodeSkill = vfs.getFileContent('.agents/skills/clean-code-guard/SKILL.md')!;
    expect(cleanCodeSkill).toContain('name: "clean-code-guard"');
  });
});
