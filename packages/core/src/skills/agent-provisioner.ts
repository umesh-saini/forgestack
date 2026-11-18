import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import {
  AgentToolId,
  AGENT_TARGETS,
  FORGESTACK_CANONICAL_SKILL,
  normalizeAgentToolId,
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
 * Detects AI agent / IDE tool directories present in the target directory.
 */
export async function detectPresentTools(targetDir: string): Promise<AgentToolId[]> {
  const detected: AgentToolId[] = [];

  for (const target of AGENT_TARGETS) {
    if (!target.detectionPaths || target.detectionPaths.length === 0) continue;

    for (const relPath of target.detectionPaths) {
      const fullPath = path.resolve(targetDir, relPath);
      try {
        await fs.access(fullPath);
        detected.push(target.id);
        break;
      } catch {
        // Not present
      }
    }
  }

  return detected;
}

/**
 * Provisions ForgeStack skills to the given project directory for the selected AI agents.
 */
export async function provisionAgentSkills(
  targetDir: string,
  selectedTargets: (AgentToolId | string)[] = AGENT_TARGETS.map((t) => t.id)
): Promise<ProvisionResult[]> {
  const results: ProvisionResult[] = [];
  const normalizedTargets = Array.from(new Set(selectedTargets.map(normalizeAgentToolId)));

  for (const targetId of normalizedTargets) {
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
