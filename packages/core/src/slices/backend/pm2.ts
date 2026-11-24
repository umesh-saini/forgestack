import type { FeatureSlice } from '../../engine/compositor.js';
import type { ProjectConfig } from '../../types/config.js';
import type { VirtualFileSystem } from '../../vfs/vfs.js';
import { layoutFor } from '../../utils/layout.js';

export const pm2Slice: FeatureSlice = {
  id: 'be-pm2',
  name: 'PM2 Production Process Manager',
  apply: (vfs: VirtualFileSystem, config: ProjectConfig) => {
    if (config.backend.processManager !== 'pm2' || config.backend.framework === 'none') {
      return;
    }

    const resolvePath = layoutFor(config).be;

    vfs.applyAction({
      type: 'CREATE',
      path: resolvePath('ecosystem.config.cjs'),
      content: `module.exports = {
  apps: [
    {
      name: '${config.name}-api',
      script: './dist/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 4000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
      error_file: './logs/pm2-err.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 8000,
    },
  ],
};
`,
    });
  },
};
