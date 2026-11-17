// Browser-safe isomorphic exports for UI preview without Node.js runtime bindings (node:fs, node:child_process)
export * from './vfs/types.js';
export * from './vfs/vfs.js';
export * from './registry/dependencies.js';
export * from './types/config.js';
export * from './engine/compositor.js';
export * from './engine/create-pipeline.js';
export * from './utils/json-merge.js';
export * from './utils/code-patcher.js';

// Slices
export * from './slices/monorepo/index.js';
export * from './slices/shared-packages/index.js';
export * from './slices/frontend/react-vite.js';
export * from './slices/frontend/tailwind.js';
export * from './slices/frontend/ui-extras.js';
export * from './slices/frontend/state.js';
export * from './slices/backend/clean-modular.js';
export * from './slices/database/postgres.js';
export * from './slices/database/mongodb.js';
export * from './slices/governance/ai-rules.js';
export * from './slices/governance/gsd.js';
export * from './slices/governance/spec-kit.js';
export * from './slices/frontend/nextjs.js';
export * from './slices/desktop/electron-vite.js';
export * from './slices/utilities/starter-packs.js';
export * from './slices/backend/pm2.js';
export * from './slices/container/docker.js';
