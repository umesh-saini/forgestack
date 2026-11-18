import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';
import { provisionAgentSkills, AGENT_TARGETS } from '../agent-provisioner.js';

describe('Universal AI Agent Provisioner', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'forgestack-agent-test-'));
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('provisions skills across all supported agent ecosystems', async () => {
    const results = await provisionAgentSkills(tempDir);
    expect(results).toHaveLength(AGENT_TARGETS.length);
    expect(results.every((r) => r.success)).toBe(true);

    // Verify key files were physically created and have content
    const sharedSkill = await fs.readFile(
      path.join(tempDir, '.agents/skills/forgestack/SKILL.md'),
      'utf-8'
    );
    expect(sharedSkill).toContain('name: forgestack');
    expect(sharedSkill).toContain('npx create-forgestack-app');

    const cursorRule = await fs.readFile(
      path.join(tempDir, '.cursor/rules/forgestack.mdc'),
      'utf-8'
    );
    expect(cursorRule).toContain('globs: "**/*"');
    expect(cursorRule).toContain('ForgeStack: Enterprise Project Scaffolding');

    const copilotInstructions = await fs.readFile(
      path.join(tempDir, '.github/copilot-instructions.md'),
      'utf-8'
    );
    expect(copilotInstructions).toContain('ForgeStack Scaffolding Guidelines for GitHub Copilot');

    const clineRules = await fs.readFile(
      path.join(tempDir, '.clinerules'),
      'utf-8'
    );
    expect(clineRules).toContain('ForgeStack: Enterprise Project Scaffolding');
  });

  it('provisions only selected targets when filtered', async () => {
    const results = await provisionAgentSkills(tempDir, ['cursor', 'claude']);
    expect(results).toHaveLength(2);
    expect(results.map((r) => r.targetId)).toEqual(['cursor', 'claude']);

    const cursorExists = await fs
      .stat(path.join(tempDir, '.cursor/rules/forgestack.mdc'))
      .then(() => true)
      .catch(() => false);
    expect(cursorExists).toBe(true);

    const clineExists = await fs
      .stat(path.join(tempDir, '.clinerules'))
      .then(() => true)
      .catch(() => false);
    expect(clineExists).toBe(false);
  });
});
