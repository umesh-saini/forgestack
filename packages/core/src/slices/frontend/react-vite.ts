import type { FeatureSlice } from '../../engine/compositor.js';
import { DEPENDENCY_REGISTRY } from '../../registry/dependencies.js';
import type { ProjectConfig } from '../../types/config.js';
import type { VirtualFileSystem } from '../../vfs/vfs.js';

export const reactViteSlice: FeatureSlice = {
  id: 'fe-react-vite',
  name: 'React 19 + TypeScript + Vite Frontend',
  apply: (vfs: VirtualFileSystem, config: ProjectConfig) => {
    if (
      config.frontend.framework !== 'react-vite' ||
      config.topology === 'electron-desktop' ||
      config.topology === 'nextjs-fullstack'
    ) {
      return;
    }

    const basePath =
      config.topology === 'monorepo' || config.topology === 'micro-frontend'
        ? 'apps/web'
        : config.topology === 'separate-folders'
        ? 'frontend'
        : '';
    const resolvePath = (p: string) => (basePath ? `${basePath}/${p}` : p);

    // 1. package.json
    const packageJsonContent = {
      name:
        config.topology === 'monorepo' || config.topology === 'micro-frontend'
          ? '@repo/web'
          : config.topology === 'separate-folders'
          ? `${config.name}-frontend`
          : config.name,
      version: '0.0.1',
      private: true,
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'tsc -b && vite build',
        preview: 'vite preview',
        lint: 'eslint .',
      },
      dependencies: {
        react: DEPENDENCY_REGISTRY.react,
        'react-dom': DEPENDENCY_REGISTRY['react-dom'],
        ...(config.frontend.dateLib === 'dayjs'
          ? { dayjs: DEPENDENCY_REGISTRY.dayjs }
          : config.frontend.dateLib === 'date-fns'
          ? { 'date-fns': DEPENDENCY_REGISTRY['date-fns'] }
          : config.frontend.dateLib === 'moment'
          ? { moment: DEPENDENCY_REGISTRY.moment }
          : {}),
        ...(config.topology === 'monorepo'
          ? {
              '@repo/contracts': 'workspace:*',
              '@repo/ui': 'workspace:*',
            }
          : {}),
      },
      devDependencies: {
        '@types/react': DEPENDENCY_REGISTRY['@types/react'],
        '@types/react-dom': DEPENDENCY_REGISTRY['@types/react-dom'],
        '@vitejs/plugin-react': DEPENDENCY_REGISTRY['@vitejs/plugin-react'],
        typescript: DEPENDENCY_REGISTRY.typescript,
        vite: DEPENDENCY_REGISTRY.vite,
        ...(config.topology === 'monorepo'
          ? { '@repo/typescript-config': 'workspace:*' }
          : {}),
      },
    };

    vfs.applyAction({
      type: 'CREATE',
      path: resolvePath('package.json'),
      content: JSON.stringify(packageJsonContent, null, 2) + '\n',
    });

    // 2. tsconfig.json
    vfs.applyAction({
      type: 'CREATE',
      path: resolvePath('tsconfig.json'),
      content: JSON.stringify(
        {
          ...(config.topology === 'monorepo'
            ? {
                extends: '@repo/typescript-config/react.json',
                compilerOptions: {
                  baseUrl: '.',
                  paths: {
                    '@/*': ['./src/*'],
                  },
                },
              }
            : {
                compilerOptions: {
                  target: 'ES2022',
                  useDefineForClassFields: true,
                  lib: ['ES2022', 'DOM', 'DOM.Iterable'],
                  module: 'ESNext',
                  skipLibCheck: true,
                  moduleResolution: 'Bundler',
                  isolatedModules: true,
                  moduleDetection: 'force',
                  noEmit: true,
                  jsx: 'react-jsx',
                  strict: true,
                  noImplicitAny: true,
                  baseUrl: '.',
                  paths: {
                    '@/*': ['./src/*'],
                  },
                },
              }),
          include: ['src'],
        },
        null,
        2
      ) + '\n',
    });

    // 3. vite.config.ts
    vfs.applyAction({
      type: 'CREATE',
      path: resolvePath('vite.config.ts'),
      content: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
`,
    });

    // 4. index.html
    vfs.applyAction({
      type: 'CREATE',
      path: resolvePath('index.html'),
      content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${config.name}</title>
  </head>
  <body class="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
    });

    // 5. src/main.tsx
    vfs.applyAction({
      type: 'CREATE',
      path: resolvePath('src/main.tsx'),
      content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import './index.css';

/* FORGESTACK_IMPORT_SLOT */

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    /* FORGESTACK_PROVIDER_SLOT */
    <App />
  </React.StrictMode>
);
`,
    });

    // 6. src/App.tsx
    vfs.applyAction({
      type: 'CREATE',
      path: resolvePath('src/App.tsx'),
      content: `import React from 'react';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <header className="max-w-xl space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          ${config.name}
        </h1>
        <p className="text-lg text-zinc-400">
          Scaffolded with ForgeStack. Ready for modern full-stack development.
        </p>
      </header>
    </div>
  );
}
`,
    });

    // 7. src/index.css
    vfs.applyAction({
      type: 'CREATE',
      path: resolvePath('src/index.css'),
      content: `/* Base styles */
body {
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}
`,
    });

    // 8. src/vite-env.d.ts
    vfs.applyAction({
      type: 'CREATE',
      path: resolvePath('src/vite-env.d.ts'),
      content: `/// <reference types="vite/client" />
`,
    });
  },
};
