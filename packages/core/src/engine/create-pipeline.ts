import { RecipeCompositor } from './compositor.js';
import { monorepoKernelSlice } from '../slices/monorepo/index.js';
import { sharedPackagesSlice } from '../slices/shared-packages/index.js';
import { reactViteSlice } from '../slices/frontend/react-vite.js';
import { nextjsSlice } from '../slices/frontend/nextjs.js';
import { electronViteSlice } from '../slices/desktop/electron-vite.js';
import { tailwindSlice } from '../slices/frontend/tailwind.js';
import { uiExtrasSlice } from '../slices/frontend/ui-extras.js';
import { stateSlice } from '../slices/frontend/state.js';
import { cleanModularBackendSlice } from '../slices/backend/clean-modular.js';
import { pm2Slice } from '../slices/backend/pm2.js';
import { postgresSlice } from '../slices/database/postgres.js';
import { mongodbSlice } from '../slices/database/mongodb.js';
import { aiRulesSlice } from '../slices/governance/ai-rules.js';
import { gsdGovernanceSlice } from '../slices/governance/gsd.js';
import { specKitGovernanceSlice } from '../slices/governance/spec-kit.js';
import { starterUtilitiesSlice } from '../slices/utilities/starter-packs.js';
import { dockerSlice } from '../slices/container/docker.js';
import type { ProjectConfig } from '../types/config.js';
import type { VirtualFileSystem } from '../vfs/vfs.js';

/**
 * Creates and configures the complete, ordered recipe compositor pipeline.
 */
export function createProjectPipeline(): RecipeCompositor {
  return new RecipeCompositor()
    .registerSlice(monorepoKernelSlice)
    .registerSlice(sharedPackagesSlice)
    .registerSlice(reactViteSlice)
    .registerSlice(nextjsSlice)
    .registerSlice(electronViteSlice)
    .registerSlice(tailwindSlice)
    .registerSlice(uiExtrasSlice)
    .registerSlice(stateSlice)
    .registerSlice(cleanModularBackendSlice)
    .registerSlice(pm2Slice)
    .registerSlice(postgresSlice)
    .registerSlice(mongodbSlice)
    .registerSlice(aiRulesSlice)
    .registerSlice(gsdGovernanceSlice)
    .registerSlice(specKitGovernanceSlice)
    .registerSlice(starterUtilitiesSlice)
    .registerSlice(dockerSlice);
}

/**
 * High-level orchestration function to generate in-memory VFS from a ProjectConfig.
 */
export async function generateProjectVfs(config: ProjectConfig): Promise<VirtualFileSystem> {
  const pipeline = createProjectPipeline();
  return pipeline.compose(config);
}
