// Single source of truth for ForgeStack's option space.
// Used by tests/e2e/combination-matrix.test.ts (static, every combination) and
// scripts/matrix/runtime.mjs (install + build + run a pairwise sample).

export const DIMENSIONS = {
  // --- options that interact with each other in generated code ---
  topology: ['monorepo', 'separate-folders', 'micro-frontend', 'standalone-fe', 'standalone-be', 'electron-desktop', 'nextjs-fullstack', 'tauri-desktop', 'ai-agent-rag', 'distributed-worker'],
  feFramework: ['react-vite', 'nextjs'],
  styling: ['tailwind', 'none'],
  state: ['query', 'redux', 'zustand', 'none'],
  backend: ['fastify', 'express', 'hono'],
  dbOrm: ['postgres:drizzle', 'postgres:prisma', 'sqlite:drizzle', 'mongodb:mongoose', 'none:none'],
  auth: ['better-auth', 'none'],
  rpc: ['trpc', 'none'],
  queue: ['bullmq', 'none'],
  frontendHelpers: [true, false],
  backendHelpers: [true, false],
  linter: ['eslint', 'biome', 'none'],
  e2e: ['playwright', 'cypress', 'none'],
  // --- leaf options (each mostly adds its own files) ---
  uiExtras: ['toast,icons,forms', 'none', 'toast', 'icons', 'forms', 'toast,icons', 'icons,forms', 'toast,forms'],
  icons: ['lucide', 'tabler', 'react-icons', 'phosphor', 'none'],
  toast: ['sonner', 'toastify', 'hot-toast', 'none'],
  forms: ['rhf-zod', 'tanstack-form', 'formik-yup', 'none'],
  dateLib: ['dayjs', 'date-fns', 'moment', 'none'],
  container: [true, false],
  processManager: ['docker', 'pm2', 'none'],
  ci: ['github-actions', 'none'],
  deployment: ['docker', 'vercel', 'cloudflare', 'railway', 'fly', 'none'],
  governance: ['rules,skills,openSpec,mcp,claude', 'none', 'rules', 'skills', 'openSpec', 'mcp', 'claude'],
  engine: ['openspec', 'gsd', 'speckit', 'all'],
  packageManager: ['pnpm', 'npm', 'yarn', 'bun'],
};

export const INTERACTING = ['topology', 'feFramework', 'styling', 'state', 'backend', 'dbOrm', 'auth', 'rpc', 'queue', 'frontendHelpers', 'backendHelpers', 'linter', 'e2e'];
export const LEAF = Object.keys(DIMENSIONS).filter((d) => !INTERACTING.includes(d));

/** Turns a choice ({dim: value}) into a raw ProjectConfig (before normalizeConfig). */
export function toConfig(choice, name = 'matrix-app', targetPath = `/tmp/${name}`) {
  const [database, orm] = choice.dbOrm.split(':');
  const extras = choice.uiExtras === 'none' ? [] : choice.uiExtras.split(',');
  const gov = choice.governance === 'none' ? [] : choice.governance.split(',');
  return {
    name,
    targetPath,
    topology: choice.topology,
    frontend: {
      framework: choice.feFramework,
      styling: choice.styling,
      state: choice.state,
      icons: choice.icons,
      toast: choice.toast,
      forms: choice.forms,
      dateLib: choice.dateLib,
      uiExtras: { toast: extras.includes('toast'), icons: extras.includes('icons'), forms: extras.includes('forms') },
    },
    backend: { framework: choice.backend, database, orm, container: choice.container, processManager: choice.processManager },
    queue: choice.queue,
    auth: choice.auth,
    rpc: choice.rpc,
    testing: { e2e: choice.e2e },
    ci: choice.ci,
    linter: choice.linter,
    deployment: choice.deployment,
    utilities: { frontendHelpers: choice.frontendHelpers, backendHelpers: choice.backendHelpers },
    aiGovernance: {
      rules: gov.includes('rules'),
      skills: gov.includes('skills'),
      openSpec: gov.includes('openSpec'),
      mcp: gov.includes('mcp'),
      claude: gov.includes('claude'),
      engine: choice.engine,
    },
    packageManager: choice.packageManager,
    git: false,
    install: false,
  };
}

/** Deterministic PRNG (mulberry32) so matrix runs are reproducible. */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Every combination of the INTERACTING options. Leaf options vary deterministically per
 * combination so each leaf value is exercised across all topologies too.
 */
export function* allInteractingCombinations() {
  const dims = INTERACTING;
  const idx = new Array(dims.length).fill(0);
  let n = 0;
  while (true) {
    const choice = {};
    dims.forEach((d, i) => (choice[d] = DIMENSIONS[d][idx[i]]));
    const r = rng(n++);
    for (const d of LEAF) choice[d] = DIMENSIONS[d][Math.floor(r() * DIMENSIONS[d].length)];
    yield choice;
    let k = dims.length - 1;
    while (k >= 0 && ++idx[k] === DIMENSIONS[dims[k]].length) idx[k--] = 0;
    if (k < 0) return;
  }
}

/** Projects a normalized config back onto dimension values (what was actually generated). */
export function effectiveChoice(cfg) {
  const extras = ['toast', 'icons', 'forms'].filter((k) => cfg.frontend.uiExtras?.[k]);
  const gov = ['rules', 'skills', 'openSpec', 'mcp', 'claude'].filter((k) => cfg.aiGovernance[k]);
  return {
    topology: cfg.topology,
    feFramework: cfg.frontend.framework,
    styling: cfg.frontend.styling,
    state: cfg.frontend.state,
    backend: cfg.backend.framework,
    dbOrm: `${cfg.backend.database}:${cfg.backend.orm}`,
    auth: cfg.auth ?? 'none',
    rpc: cfg.rpc ?? 'none',
    queue: cfg.queue ?? 'none',
    frontendHelpers: Boolean(cfg.utilities?.frontendHelpers),
    backendHelpers: Boolean(cfg.utilities?.backendHelpers),
    linter: cfg.linter ?? 'eslint',
    e2e: cfg.testing?.e2e ?? 'none',
    uiExtras: extras.length ? extras.join(',') : 'none',
    icons: cfg.frontend.icons,
    toast: cfg.frontend.toast,
    forms: cfg.frontend.forms,
    dateLib: cfg.frontend.dateLib,
    container: cfg.backend.container,
    processManager: cfg.backend.processManager,
    ci: cfg.ci,
    deployment: cfg.deployment,
    governance: gov.length ? gov.join(',') : 'none',
    engine: cfg.aiGovernance.engine,
    packageManager: cfg.packageManager,
  };
}

const pairsOf = (eff, dims) => {
  const out = [];
  for (let i = 0; i < dims.length; i++)
    for (let j = i + 1; j < dims.length; j++) out.push(`${dims[i]}=${eff[dims[i]]}|${dims[j]}=${eff[dims[j]]}`);
  return out;
};

/**
 * Greedy all-pairs covering set over `dims`: every pair of values that can actually co-occur
 * (after normalization) appears in at least one returned config.
 * `normalize` is core's normalizeConfig; configs it rejects are skipped.
 * `restrict` limits a dimension's values (e.g. { packageManager: ['pnpm', 'npm'] }).
 */
export function pairwise(normalize, { dims = Object.keys(DIMENSIONS), restrict = {}, seed = 1, candidates = 60, samples = 40000 } = {}) {
  const r = rng(seed);
  const values = (d) => restrict[d] ?? DIMENSIONS[d];
  const randomChoice = () => {
    const c = {};
    for (const d of Object.keys(DIMENSIONS)) c[d] = values(d)[Math.floor(r() * values(d).length)];
    return c;
  };
  const tryNormalize = (choice) => {
    try {
      return normalize(toConfig(choice));
    } catch {
      return null;
    }
  };
  // Target = every pair seen in a large random sample of valid, normalized configs.
  const uncovered = new Set();
  for (let i = 0; i < samples; i++) {
    const cfg = tryNormalize(randomChoice());
    if (cfg) for (const p of pairsOf(effectiveChoice(cfg), dims)) uncovered.add(p);
  }
  const total = uncovered.size;
  const picked = [];
  let unreachable = 0;
  const parse = (v) => (v === 'true' ? true : v === 'false' ? false : v);
  while (uncovered.size) {
    // Seed every candidate with one still-uncovered pair so rare pairs can't stall the loop.
    const target = uncovered.values().next().value;
    const pinned = Object.fromEntries(target.split('|').map((kv) => kv.split('=')).map(([k, v]) => [k, parse(v)]));
    let best = null;
    let bestGain = 0;
    for (let i = 0; i < candidates * 5 && !(best && i >= candidates); i++) {
      const choice = { ...randomChoice(), ...pinned };
      const cfg = tryNormalize(choice);
      if (!cfg) continue;
      const gain = pairsOf(effectiveChoice(cfg), dims).filter((p) => uncovered.has(p)).length;
      if (gain > bestGain) [best, bestGain] = [{ choice, cfg }, gain];
    }
    if (best) {
      for (const p of pairsOf(effectiveChoice(best.cfg), dims)) uncovered.delete(p);
      picked.push(best.choice);
    }
    // Pinning the pair didn't produce it (normalization rewrites it); it was only reachable by chance.
    if (uncovered.delete(target)) unreachable++;
  }
  return { choices: picked, totalPairs: total, unreachable };
}
