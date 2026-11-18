import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import {
  AgentToolId,
  AGENT_TARGETS,
  FORGESTACK_CANONICAL_SKILL,
} from './targets.js';

export * from './targets.js';

export interface ProvisionResult {
  targetId: AgentToolId;
  targetName: string;
  filePath: string;
  success: boolean;
  message?: string;
}

/**
 * Provisions ForgeStack skills to the given project directory for the selected AI agents.
 */
export async function provisionAgentSkills(
  targetDir: string,
  selectedTargets: AgentToolId[] = AGENT_TARGETS.map((t) => t.id)
): Promise<ProvisionResult[]> {
  const results: ProvisionResult[] = [];

  for (const targetId of selectedTargets) {
    const target = AGENT_TARGETS.find((t) => t.id === targetId);
    if (!target) continue;

    const fullPath = path.resolve(targetDir, target.relativePath);
    try {
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      const content = target.generateContent(FORGESTACK_CANONICAL_SKILL);
      await fs.writeFile(fullPath, content, 'utf-8');
      results.push({
        targetId: target.id,
        targetName: target.name,
        filePath: fullPath,
        success: true,
      });
    } catch (err: any) {
      results.push({
        targetId: target.id,
        targetName: target.name,
        filePath: fullPath,
        success: false,
        message: err?.message || String(err),
      });
    }
  }

  return results;
}
