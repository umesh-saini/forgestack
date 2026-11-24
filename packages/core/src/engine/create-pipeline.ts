import { RecipeCompositor } from './compositor.js';
import { monorepoKernelSlice } from '../slices/monorepo/index.js';
import { microFrontendSlice } from '../slices/monorepo/micro-frontend.js';
import { sharedPackagesSlice } from '../slices/shared-packages/index.js';
import { reactViteSlice } from '../slices/frontend/react-vite.js';
import { nextjsSlice } from '../slices/frontend/nextjs.js';
import { electronViteSlice } from '../slices/desktop/electron-vite.js';
import { tauriAppSlice } from '../slices/desktop/tauri-app.js';
import { agentRagSlice } from '../slices/ai/agent-rag.js';
import { tailwindSlice } from '../slices/frontend/tailwind.js';
import { uiExtrasSlice } from '../slices/frontend/ui-extras.js';
import { stateSlice } from '../slices/frontend/state.js';
import { cleanModularBackendSlice } from '../slices/backend/clean-modular.js';
import { pm2Slice } from '../slices/backend/pm2.js';
import { postgresSlice } from '../slices/database/postgres.js';
import { mongodbSlice } from '../slices/database/mongodb.js';
import { sqliteSlice } from '../slices/database/sqlite.js';
import { betterAuthSlice } from '../slices/auth/better-auth.js';
import { trpcSlice } from '../slices/rpc/trpc.js';
import { aiRulesSlice } from '../slices/governance/ai-rules.js';
import { mcpServerSlice } from '../slices/governance/mcp-server.js';
import { gsdGovernanceSlice } from '../slices/governance/gsd.js';
import { specKitGovernanceSlice } from '../slices/governance/spec-kit.js';
import { starterUtilitiesSlice } from '../slices/utilities/starter-packs.js';
import { dockerSlice } from '../slices/container/docker.js';
import { bullmqWorkerSlice } from '../slices/backend/bullmq-worker.js';
import { playwrightSlice } from '../slices/testing/playwright.js';
import { ciWorkflowsSlice } from '../slices/devops/ci-workflows.js';
import { biomeSlice } from '../slices/tooling/biome.js';
import { eslintSlice } from '../slices/tooling/eslint.js';
import { deploymentTargetsSlice } from '../slices/devops/deployment-targets.js';
import type { FeatureSlice } from './compositor.js';
import { CodePatcher } from '../utils/code-patcher.js';
import { normalizeConfig, type ProjectConfig } from '../types/config.js';
import type { VirtualFileSystem } from '../vfs/vfs.js';

/**
 * Final pass: give every workspace package that has a tsconfig and depends on TypeScript a
 * `typecheck` script, so `turbo run typecheck` covers the whole repo instead of a few packages.
 */
/**
 * pnpm 10 skips dependency build scripts unless allow-listed, which leaves native modules
 * (better-sqlite3), Prisma engines and esbuild/Tailwind binaries broken after install.
 * Allow-list them in every pnpm project root (separate-folders has two independent roots).
 */
const PNPM_BUILT_DEPENDENCIES = ['better-sqlite3', 'esbuild', 'prisma', '@prisma/client', '@prisma/engines', 'sharp', '@tailwindcss/oxide', 'electron', '@swc/core', 'unrs-resolver'];
const pnpmBuildScriptsSlice: FeatureSlice = {
  id: 'tooling-pnpm-built-dependencies',
  name: 'pnpm build-script allow-list',
  apply: (vfs: VirtualFileSystem, config: ProjectConfig) => {
    if (config.packageManager !== 'pnpm') return;
    const roots = config.topology === 'separate-folders' ? ['package.json', 'frontend/package.json', 'backend/package.json'] : ['package.json'];
    for (const path of roots.filter((p) => vfs.hasFile(p))) {
      vfs.applyAction({ type: 'MERGE_JSON', path, content: { pnpm: { onlyBuiltDependencies: PNPM_BUILT_DEPENDENCIES } } });
    }
  },
};

/**
 * Last pass: remove unused injection slots. Inside JSX a leftover `/* FORGESTACK_PROVIDER_SLOT *\/`
 * is text, not a comment, so every React app rendered it on the page.
 */
const cleanSlotsSlice: FeatureSlice = {
  id: 'tooling-clean-slots',
  name: 'Strip unused injection slots',
  apply: (vfs: VirtualFileSystem) => {
    for (const file of vfs.getAllFiles()) {
      if (!/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(file.path) || !file.content.includes('FORGESTACK_')) continue;
      vfs.applyAction({ type: 'OVERWRITE', path: file.path, content: CodePatcher.cleanSlots(file.content) });
    }
  },
};

/** npm links workspace packages by name but can't parse pnpm's `workspace:*` protocol. */
const npmWorkspaceProtocolSlice: FeatureSlice = {
  id: 'tooling-npm-workspace-protocol',
  name: 'npm workspace dependency versions',
  apply: (vfs: VirtualFileSystem, config: ProjectConfig) => {
    if (config.packageManager !== 'npm') return;
    for (const file of vfs.getAllFiles()) {
      if (!(file.path === 'package.json' || file.path.endsWith('/package.json')) || !file.content.includes('"workspace:')) continue;
      vfs.applyAction({ type: 'OVERWRITE', path: file.path, content: file.content.replace(/"workspace:[^"]*"/g, '"*"') });
    }
  },
};

const typecheckScriptsSlice: FeatureSlice = {
  id: 'tooling-typecheck-scripts',
  name: 'Workspace typecheck scripts',
  apply: (vfs: VirtualFileSystem) => {
    for (const file of vfs.getAllFiles()) {
      if (!file.path.endsWith('/package.json')) continue; // nested packages only; root runs turbo
      const dir = file.path.slice(0, -'/package.json'.length);
      if (!vfs.hasFile(`${dir}/tsconfig.json`)) continue;
      const pkg = JSON.parse(file.content);
      const hasTs = Boolean(pkg.devDependencies?.typescript || pkg.dependencies?.typescript);
      if (!hasTs || pkg.scripts?.typecheck) continue;
      vfs.applyAction({ type: 'MERGE_JSON', path: file.path, content: { scripts: { typecheck: 'tsc --noEmit' } } });
    }
  },
};

/**
 * Creates and configures the complete, ordered recipe compositor pipeline.
 */
export function createProjectPipeline(): RecipeCompositor {
  return new RecipeCompositor()
    .registerSlice(monorepoKernelSlice)
    .registerSlice(sharedPackagesSlice)
    .registerSlice(microFrontendSlice)
    .registerSlice(reactViteSlice)
    .registerSlice(nextjsSlice)
    .registerSlice(electronViteSlice)
    .registerSlice(tauriAppSlice)
    .registerSlice(tailwindSlice)
    .registerSlice(uiExtrasSlice)
    .registerSlice(stateSlice)
    .registerSlice(cleanModularBackendSlice)
    .registerSlice(pm2Slice)
    .registerSlice(postgresSlice)
    .registerSlice(mongodbSlice)
    .registerSlice(sqliteSlice)
    .registerSlice(agentRagSlice)
    .registerSlice(betterAuthSlice)
    .registerSlice(trpcSlice)
    .registerSlice(aiRulesSlice)
    .registerSlice(mcpServerSlice)
    .registerSlice(gsdGovernanceSlice)
    .registerSlice(specKitGovernanceSlice)
    .registerSlice(starterUtilitiesSlice)
    .registerSlice(dockerSlice)
    .registerSlice(bullmqWorkerSlice)
    .registerSlice(playwrightSlice)
    .registerSlice(ciWorkflowsSlice)
    .registerSlice(biomeSlice)
    .registerSlice(eslintSlice)
    .registerSlice(deploymentTargetsSlice)
    .registerSlice(typecheckScriptsSlice)
    .registerSlice(npmWorkspaceProtocolSlice)
    .registerSlice(pnpmBuildScriptsSlice)
    .registerSlice(cleanSlotsSlice);
}

/**
 * High-level orchestration function to generate in-memory VFS from a ProjectConfig.
 */
export async function generateProjectVfs(config: ProjectConfig): Promise<VirtualFileSystem> {
  const pipeline = createProjectPipeline();
  return pipeline.compose(normalizeConfig(config));
}
