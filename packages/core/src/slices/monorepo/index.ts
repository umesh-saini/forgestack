import type { FeatureSlice } from '../../engine/compositor.js';
import { DEPENDENCY_REGISTRY } from '../../registry/dependencies.js';
import type { ProjectConfig } from '../../types/config.js';
import type { VirtualFileSystem } from '../../vfs/vfs.js';

const PACKAGE_MANAGER_VERSIONS = { pnpm: 'pnpm@10.33.4', npm: 'npm@10.9.2', yarn: 'yarn@4.6.0', bun: 'bun@1.2.2' } as const;

export const monorepoKernelSlice: FeatureSlice = {
  id: 'kernel-monorepo',
  name: 'Monorepo Kernel (pnpm + Turborepo)',
  apply: (vfs: VirtualFileSystem, config: ProjectConfig) => {
    const pm = config.packageManager;
    if (config.topology === 'separate-folders') {
      vfs.applyAction({
        type: 'CREATE',
        path: 'package.json',
        content: JSON.stringify(
          {
            name: config.name,
            version: '0.0.1',
            private: true,
            scripts: {
              // Two independent apps: one install/build at the root sets up both.
              postinstall: `cd frontend && ${pm} install && cd ../backend && ${pm} install`,
              build: `cd frontend && ${pm} run build && cd ../backend && ${pm} run build`,
              'dev:frontend': `cd frontend && ${pm} run dev`,
              'dev:backend': `cd backend && ${pm} run dev`,
              'build:frontend': `cd frontend && ${pm} run build`,
              'build:backend': `cd backend && ${pm} run build`,
            },
          },
          null,
          2
        ) + '\n',
      });

      vfs.applyAction({
        type: 'CREATE',
        path: 'README.md',
        content: `# ${config.name}\n\nFullstack application with separate \`frontend/\` and \`backend/\` directories.\n`,
      });

      vfs.applyAction({
        type: 'CREATE',
        path: '.env.example',
        content: `# Root Environment Variables (see frontend/.env.example and backend/.env.example for details)\nNODE_ENV=development\nPORT=3000\n`,
      });
      return;
    }

    if (
      config.topology !== 'monorepo' &&
      config.topology !== 'micro-frontend' &&
      config.topology !== 'ai-agent-rag'
    ) {
      return;
    }

    // Yarn 4 defaults to Plug'n'Play, which Vite/Next/tsc tooling here doesn't expect.
    if (pm === 'yarn') {
      vfs.applyAction({ type: 'CREATE', path: '.yarnrc.yml', content: 'nodeLinker: node-modules\n' });
    }

    // 1. Root pnpm-workspace.yaml
    vfs.applyAction({
      type: 'CREATE',
      path: 'pnpm-workspace.yaml',
      content: `packages:
  - 'apps/*'
  - 'packages/*'
`,
    });

    // 2. Root turbo.json (Turborepo v2 schema)
    vfs.applyAction({
      type: 'CREATE',
      path: 'turbo.json',
      content: JSON.stringify(
        {
          $schema: 'https://turbo.build/schema.json',
          ui: 'tui',
          tasks: {
            build: {
              dependsOn: ['^build'],
              inputs: ['$TURBO_DEFAULT$', '.env*'],
              outputs: ['dist/**', '.next/**', '!.next/cache/**'],
            },
            lint: {
              dependsOn: ['^lint'],
            },
            typecheck: {
              dependsOn: ['^typecheck'],
            },
            test: {
              dependsOn: ['^build'],
              inputs: ['$TURBO_DEFAULT$', 'src/**'],
            },
            dev: {
              cache: false,
              persistent: true,
            },
            clean: {
              cache: false,
            },
          },
        },
        null,
        2
      ) + '\n',
    });

    // 3. Root .npmrc
    vfs.applyAction({
      type: 'CREATE',
      path: '.npmrc',
      content: `shamefully-hoist=false
strict-peer-dependencies=false
auto-install-peers=true
`,
    });

    // 4. Root .gitignore
    vfs.applyAction({
      type: 'CREATE',
      path: '.gitignore',
      content: `# Dependencies
node_modules/
.pnpm-store/

# Production builds
dist/
build/
.next/
out/

# Environment files
.env
.env.local
.env.*.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Turborepo cache
.turbo/

# OS and IDE files
.DS_Store
*.pem
.idea/
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
`,
    });

    // 5. Root package.json
    vfs.applyAction({
      type: 'CREATE',
      path: 'package.json',
      content: JSON.stringify(
        {
          name: config.name,
          version: '0.0.1',
          private: true,
          type: 'module',
          packageManager: PACKAGE_MANAGER_VERSIONS[pm],
          // pnpm reads pnpm-workspace.yaml; npm, yarn and bun read this field
          ...(pm === 'pnpm' ? {} : { workspaces: ['apps/*', 'packages/*'] }),
          scripts: {
            build: 'turbo run build',
            dev: 'turbo run dev',
            lint: 'turbo run lint',
            typecheck: 'turbo run typecheck',
            test: 'turbo run test',
            clean: 'turbo run clean && rm -rf node_modules',
          },
          devDependencies: {
            turbo: DEPENDENCY_REGISTRY.turbo,
            typescript: DEPENDENCY_REGISTRY.typescript,
            prettier: DEPENDENCY_REGISTRY.prettier,
          },
        },
        null,
        2
      ) + '\n',
    });

    // 6. Root README.md
    vfs.applyAction({
      type: 'CREATE',
      path: 'README.md',
      content: `# ${config.name}

Generated with **ForgeStack** - Production-Grade Architecture.

## Architecture
- **Workspaces:** \`pnpm\` workspaces
- **Orchestration:** [Turborepo](https://turbo.build)
- **Frontend:** \`apps/web\`
- **Backend:** \`apps/api\`
- **Shared Contracts:** \`packages/contracts\`
- **Shared UI:** \`packages/ui\`

## Getting Started

1. Install dependencies:
   \`\`\`bash
   pnpm install
   \`\`\`

2. Run development servers:
   \`\`\`bash
   pnpm dev
   \`\`\`

3. Build all apps and packages:
   \`\`\`bash
   pnpm build
   \`\`\`

4. Run typecheck and tests:
   \`\`\`bash
   pnpm typecheck
   pnpm test
   \`\`\`
`,
    });

    // 7. Root .env.example
    vfs.applyAction({
      type: 'CREATE',
      path: '.env.example',
      content: `# Monorepo Global Environment Variables
NODE_ENV=development
PORT=3000
API_PORT=3001
WEB_PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/${config.name.replace(/[^a-zA-Z0-9_]/g, '_')}
`,
    });
  },
};
