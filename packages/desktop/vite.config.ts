import { readFileSync } from 'node:fs';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { generateProjectVfs, TransactionalFlusher, ProcessRunner } from '@forgestack/core';

function scaffoldApiPlugin(): Plugin {
  return {
    name: 'forgestack-scaffold-api',
    configureServer(server) {
      server.middlewares.use('/api/scaffold', async (req, res, next) => {
        if (req.method !== 'POST') return next();
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', async () => {
          try {
            const config = JSON.parse(body);
            console.log('[Vite API] Received scaffold request for:', config.name, 'at', config.targetPath);
            const vfs = await generateProjectVfs(config);
            const flushResult = await TransactionalFlusher.flush(vfs, config.targetPath, { force: true });
            console.log('[Vite API] Flushed', flushResult.filesWritten, 'files to', config.targetPath);

            if (config.git) {
              try {
                await ProcessRunner.run('git', ['init'], { cwd: config.targetPath });
                await ProcessRunner.run('git', ['add', '-A'], { cwd: config.targetPath });
                await ProcessRunner.run('git', ['commit', '-m', 'feat: initial scaffold by ForgeStack'], { cwd: config.targetPath });
              } catch (gitErr) {
                console.warn('[Vite API] Git init warning:', gitErr);
              }
            }

            if (config.install) {
              try {
                await ProcessRunner.run(config.packageManager || 'pnpm', ['install'], { cwd: config.targetPath });
              } catch (installErr) {
                console.warn('[Vite API] Install warning:', installErr);
              }
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: true,
                filesWritten: flushResult.filesWritten,
                targetPath: config.targetPath,
              })
            );
          } catch (err: any) {
            console.error('[Vite API] Scaffolding failed:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Scaffolding failed' }));
          }
        });
      });
    },
  };
}

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string };

export default defineConfig({
  define: { __APP_VERSION__: JSON.stringify(version) },
  plugins: [react(), tailwindcss(), scaffoldApiPlugin()],
  clearScreen: false,
  resolve: {
    alias: {
      '@forgestack/core/browser': path.resolve(__dirname, '../core/src/browser.ts'),
      '@forgestack/core': path.resolve(__dirname, '../core/src/index.ts'),
    },
  },
  server: {
    port: 1420,
    strictPort: true,
  },
});
