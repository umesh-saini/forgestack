import { describe, expect, it } from 'vitest';
import { generateProjectVfs, normalizeConfig, type ProjectConfig } from '../../packages/core/src/index.js';
// @ts-expect-error plain ESM helpers shared with scripts/matrix/runtime.mjs
import { allInteractingCombinations, effectiveChoice, pairwise, toConfig } from '../../scripts/matrix/space.mjs';
// @ts-expect-error plain ESM helper
import { checkProject } from '../../scripts/matrix/integrity.mjs';

type Choice = Record<string, string | boolean>;

/** Generates each config and collects integrity problems, grouped so one bug reads as one line. */
async function sweep(choices: Iterable<Choice>) {
  const seen = new Set<string>();
  const problems = new Map<string, { count: number; example: Choice }>();
  let generated = 0;
  for (const choice of choices) {
    let cfg: ProjectConfig;
    try {
      cfg = normalizeConfig(toConfig(choice) as ProjectConfig);
    } catch {
      continue; // rejected combination (e.g. SQLite + Mongoose) — covered by the normalizeConfig test below
    }
    const key = JSON.stringify(cfg);
    if (seen.has(key)) continue;
    seen.add(key);
    generated++;
    if (generated % 250 === 0) {
      await new Promise<void>((resolve) => setImmediate(resolve));
    }
    let found: string[];
    try {
      found = checkProject((await generateProjectVfs(cfg)).getAllFiles(), cfg);
    } catch (e) {
      found = [`generation threw: ${(e as Error).message}`];
    }
    for (const p of found) {
      const g = problems.get(p) ?? { count: 0, example: effectiveChoice(cfg) };
      g.count++;
      problems.set(p, g);
    }
  }
  const report = [...problems].map(([p, g]) => `${g.count}x ${p}\n    e.g. ${JSON.stringify(g.example)}`);
  return { generated, report };
}

describe('Combination matrix (static integrity)', () => {
  it('rejects irreconcilable choices with a clear message', () => {
    const base = toConfig({ ...firstChoice(), topology: 'standalone-be', dbOrm: 'sqlite:drizzle' }) as ProjectConfig;
    expect(() => normalizeConfig({ ...base, backend: { ...base.backend, orm: 'mongoose' } })).toThrow(/sqlite does not support ORM 'mongoose'/);
    expect(() => normalizeConfig({ ...base, topology: 'ai-agent-rag' })).toThrow(/requires PostgreSQL \+ Drizzle/);
  });

  it('every pair of option values (all dimensions, all package managers) generates a consistent project', async () => {
    const { choices } = pairwise(normalizeConfig, { seed: 7 });
    const { generated, report } = await sweep(choices);
    expect(generated).toBeGreaterThan(50);
    expect(report, report.join('\n')).toEqual([]);
  }, 300_000);

  // Every combination of the options that interact in generated code (~5 min). Run with
  // `pnpm test:matrix` (CI does); skipped in the default `pnpm test` to keep it fast.
  it.runIf(process.env.FORGESTACK_FULL_MATRIX === '1')(
    'every combination of interacting options generates a consistent project',
    async () => {
      const { generated, report } = await sweep(allInteractingCombinations());
      expect(generated).toBeGreaterThan(1000);
      expect(report, report.join('\n')).toEqual([]);
    },
    3_600_000
  );
});

function firstChoice(): Choice {
  return allInteractingCombinations().next().value as Choice;
}
