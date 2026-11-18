import type { FeatureSlice } from '../../engine/compositor.js';
import type { ProjectConfig } from '../../types/config.js';
import type { VirtualFileSystem } from '../../vfs/vfs.js';

export const deploymentTargetsSlice: FeatureSlice = {
  id: 'devops-deployment-targets',
  name: 'Multi-Cloud Deployment Descriptors',
  apply: (vfs: VirtualFileSystem, config: ProjectConfig) => {
    const deploy = config.deployment;
    if (!deploy || deploy === 'none' || deploy === 'docker') {
      return;
    }

    const isMonorepo =
      config.topology === 'monorepo' ||
      config.topology === 'ai-agent-rag' ||
      config.topology === 'micro-frontend';
    const isNext =
      config.topology === 'nextjs-fullstack' || config.frontend.framework === 'nextjs';

    if (deploy === 'vercel') {
      let vercelConfig: Record<string, unknown>;

      if (isNext) {
        vercelConfig = {
          $schema: 'https://openapi.vercel.sh/vercel.json',
          framework: 'nextjs',
        };
      } else if (isMonorepo) {
        vercelConfig = {
          $schema: 'https://openapi.vercel.sh/vercel.json',
          framework: 'vite',
          buildCommand: 'pnpm --filter @repo/web run build',
          outputDirectory: 'apps/web/dist',
          rewrites: [{ source: '/(.*)', destination: '/index.html' }],
        };
      } else {
        vercelConfig = {
          $schema: 'https://openapi.vercel.sh/vercel.json',
          buildCommand: 'pnpm build',
          outputDirectory: 'dist',
          rewrites: [{ source: '/(.*)', destination: '/index.html' }],
        };
      }

      vfs.applyAction({
        type: 'CREATE',
        path: 'vercel.json',
        content: JSON.stringify(vercelConfig, null, 2) + '\n',
      });
    } else if (deploy === 'cloudflare') {
      const isBackendOnly = config.topology === 'standalone-be';
      const wranglerContent = isBackendOnly
        ? `{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "${config.name}",
  "main": "src/index.ts",
  "compatibility_date": "2024-11-01",
  "compatibility_flags": ["nodejs_compat"]
}
`
        : `{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "${config.name}",
  "compatibility_date": "2024-11-01",
  "assets": {
    "directory": "${isMonorepo ? './apps/web/dist' : './dist'}",
    "binding": "ASSETS"
  }
}
`;

      vfs.applyAction({
        type: 'CREATE',
        path: 'wrangler.jsonc',
        content: wranglerContent,
      });
    } else if (deploy === 'railway') {
      const railwayConfig = {
        $schema: 'https://railway.app/railway.schema.json',
        build: {
          builder: 'NIXPACKS',
        },
        deploy: {
          startCommand: isMonorepo
            ? 'pnpm --filter @repo/api start'
            : isNext
            ? 'pnpm start'
            : 'node dist/server.js',
          restartPolicyType: 'ON_FAILURE',
          restartPolicyMaxRetries: 10,
        },
      };

      vfs.applyAction({
        type: 'CREATE',
        path: 'railway.json',
        content: JSON.stringify(railwayConfig, null, 2) + '\n',
      });
    } else if (deploy === 'fly') {
      const flyToml = `app = "${config.name}"
primary_region = "iad"

[build]

[http_service]
  internal_port = ${isNext ? 3000 : 4000}
  force_https = true
  auto_stop_machines = "stop"
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]

[[vm]]
  size = "shared-cpu-1x"
`;

      vfs.applyAction({
        type: 'CREATE',
        path: 'fly.toml',
        content: flyToml,
      });
    }
  },
};
