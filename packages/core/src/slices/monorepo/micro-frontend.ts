import type { FeatureSlice } from '../../engine/compositor.js';
import { DEPENDENCY_REGISTRY } from '../../registry/dependencies.js';
import type { ProjectConfig } from '../../types/config.js';
import type { VirtualFileSystem } from '../../vfs/vfs.js';

export const microFrontendSlice: FeatureSlice = {
  id: 'monorepo-micro-frontend',
  name: 'True Micro-Frontend Federation (@module-federation/vite)',
  apply: (vfs: VirtualFileSystem, config: ProjectConfig) => {
    if (config.topology !== 'micro-frontend') {
      return;
    }

    // 1. Shared Package: packages/event-bus
    vfs.applyAction({
      type: 'CREATE',
      path: 'packages/event-bus/package.json',
      content: JSON.stringify(
        {
          name: '@repo/event-bus',
          version: '0.0.1',
          private: true,
          type: 'module',
          main: './src/index.ts',
          types: './src/index.ts',
          devDependencies: {
            '@repo/typescript-config': 'workspace:*',
            typescript: DEPENDENCY_REGISTRY.typescript,
          },
        },
        null,
        2
      ) + '\n',
    });

    vfs.applyAction({
      type: 'CREATE',
      path: 'packages/event-bus/tsconfig.json',
      content: JSON.stringify(
        {
          extends: '@repo/typescript-config/base.json',
          include: ['src/**/*'],
        },
        null,
        2
      ) + '\n',
    });

    vfs.applyAction({
      type: 'CREATE',
      path: 'packages/event-bus/src/index.ts',
      content: `export type EventCallback<T = any> = (payload: T) => void;

export class MicroFrontendEventBus {
  private listeners = new Map<string, Set<EventCallback>>();

  subscribe<T = any>(event: string, callback: EventCallback<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Browser CustomEvent listener
    let domListener: ((e: Event) => void) | null = null;
    if (typeof window !== 'undefined') {
      domListener = (e: Event) => {
        const customEvent = e as CustomEvent<T>;
        callback(customEvent.detail);
      };
      window.addEventListener(\`mfe:\${event}\`, domListener);
    }

    return () => {
      this.listeners.get(event)?.delete(callback);
      if (domListener && typeof window !== 'undefined') {
        window.removeEventListener(\`mfe:\${event}\`, domListener);
      }
    };
  }

  publish<T = any>(event: string, payload: T): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((cb) => {
        try {
          cb(payload);
        } catch (err) {
          console.error(\`EventBus handler error on '\${event}':\`, err);
        }
      });
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(\`mfe:\${event}\`, { detail: payload })
      );
    }
  }
}

export const eventBus = new MicroFrontendEventBus();
`,
    });

    // 2. apps/shell (The Host application)
    vfs.applyAction({
      type: 'CREATE',
      path: 'apps/shell/package.json',
      content: JSON.stringify(
        {
          name: '@repo/shell',
          version: '0.0.1',
          private: true,
          type: 'module',
          scripts: {
            dev: 'vite --port 5000',
            build: 'tsc && vite build',
            preview: 'vite preview --port 5000',
          },
          dependencies: {
            react: DEPENDENCY_REGISTRY.react,
            'react-dom': DEPENDENCY_REGISTRY['react-dom'],
            '@module-federation/vite': DEPENDENCY_REGISTRY['@module-federation/vite'],
            '@repo/event-bus': 'workspace:*',
            '@repo/ui': 'workspace:*',
            clsx: DEPENDENCY_REGISTRY.clsx,
            'tailwind-merge': DEPENDENCY_REGISTRY['tailwind-merge'],
            'lucide-react': DEPENDENCY_REGISTRY['lucide-react'],
          },
          devDependencies: {
            '@repo/typescript-config': 'workspace:*',
            typescript: DEPENDENCY_REGISTRY.typescript,
            vite: DEPENDENCY_REGISTRY.vite,
            '@vitejs/plugin-react': DEPENDENCY_REGISTRY['@vitejs/plugin-react'],
            '@types/react': DEPENDENCY_REGISTRY['@types/react'],
            '@types/react-dom': DEPENDENCY_REGISTRY['@types/react-dom'],
          },
        },
        null,
        2
      ) + '\n',
    });

    vfs.applyAction({
      type: 'CREATE',
      path: 'apps/shell/tsconfig.json',
      content: JSON.stringify(
        {
          extends: '@repo/typescript-config/react.json',
          compilerOptions: {
            baseUrl: '.',
            paths: {
              '@/*': ['./src/*'],
            },
          },
          include: ['src/**/*'],
        },
        null,
        2
      ) + '\n',
    });

    vfs.applyAction({
      type: 'CREATE',
      path: 'apps/shell/vite.config.ts',
      content: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        remoteDashboard: {
          type: 'module',
          name: 'remoteDashboard',
          entry: 'http://localhost:5001/remoteEntry.js',
          entryGlobalName: 'remoteDashboard',
          shareScope: 'default',
        },
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
  server: {
    port: 5000,
    origin: 'http://localhost:5000',
  },
});
`,
    });

    vfs.applyAction({
      type: 'CREATE',
      path: 'apps/shell/index.html',
      content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Shell Host Container - Micro-Frontend</title>
  </head>
  <body class="bg-zinc-950 text-zinc-100 min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
    });

    vfs.applyAction({
      type: 'CREATE',
      path: 'apps/shell/src/main.tsx',
      content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`,
    });

    vfs.applyAction({
      type: 'CREATE',
      path: 'apps/shell/src/index.css',
      content: `@import "tailwindcss";\n`,
    });

    vfs.applyAction({
      type: 'CREATE',
      path: 'apps/shell/src/App.tsx',
      content: `import React, { Suspense, useState, useEffect } from 'react';
import { eventBus } from '@repo/event-bus';

// @ts-expect-error Federated remote module
const RemoteDashboardWidget = React.lazy(() => import('remoteDashboard/DashboardWidget'));

export function App() {
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = eventBus.subscribe<{ text: string }>('dashboard:alert', (payload) => {
      setNotification(payload.text);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur px-8 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Host Container (Shell :5000)</h1>
        <div className="flex gap-4 items-center">
          <span className="text-sm text-zinc-400">Micro-Frontend Federation Active</span>
        </div>
      </header>

      {notification && (
        <div className="mx-8 mt-4 p-3 bg-blue-600/20 border border-blue-500 rounded-lg text-sm text-blue-200">
          Received from EventBus: {notification}
        </div>
      )}

      <main className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border border-zinc-800 rounded-xl p-6 bg-zinc-900/30">
          <h2 className="text-lg font-semibold mb-2">Host Native Zone</h2>
          <p className="text-zinc-400 text-sm mb-4">
            This surface is rendered directly by the shell host. It communicates with remotes via @repo/event-bus.
          </p>
          <button
            onClick={() => eventBus.publish('shell:ping', { timestamp: new Date().toISOString() })}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition"
          >
            Dispatch Shell Ping
          </button>
        </div>

        <div className="border border-zinc-800 rounded-xl p-6 bg-zinc-900/30">
          <h2 className="text-lg font-semibold mb-2">Federated Remote Zone (:5001)</h2>
          <Suspense fallback={<div className="text-zinc-500 animate-pulse">Loading Remote Widget...</div>}>
            <RemoteDashboardWidget />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

export default App;
`,
    });

    // 3. apps/remote-dashboard (The Federated Remote application)
    vfs.applyAction({
      type: 'CREATE',
      path: 'apps/remote-dashboard/package.json',
      content: JSON.stringify(
        {
          name: '@repo/remote-dashboard',
          version: '0.0.1',
          private: true,
          type: 'module',
          scripts: {
            dev: 'vite --port 5001',
            build: 'tsc && vite build',
            preview: 'vite preview --port 5001',
          },
          dependencies: {
            react: DEPENDENCY_REGISTRY.react,
            'react-dom': DEPENDENCY_REGISTRY['react-dom'],
            '@module-federation/vite': DEPENDENCY_REGISTRY['@module-federation/vite'],
            '@repo/event-bus': 'workspace:*',
            clsx: DEPENDENCY_REGISTRY.clsx,
            'tailwind-merge': DEPENDENCY_REGISTRY['tailwind-merge'],
          },
          devDependencies: {
            '@repo/typescript-config': 'workspace:*',
            typescript: DEPENDENCY_REGISTRY.typescript,
            vite: DEPENDENCY_REGISTRY.vite,
            '@vitejs/plugin-react': DEPENDENCY_REGISTRY['@vitejs/plugin-react'],
            '@types/react': DEPENDENCY_REGISTRY['@types/react'],
            '@types/react-dom': DEPENDENCY_REGISTRY['@types/react-dom'],
          },
        },
        null,
        2
      ) + '\n',
    });

    vfs.applyAction({
      type: 'CREATE',
      path: 'apps/remote-dashboard/tsconfig.json',
      content: JSON.stringify(
        {
          extends: '@repo/typescript-config/react.json',
          compilerOptions: {
            baseUrl: '.',
            paths: {
              '@/*': ['./src/*'],
            },
          },
          include: ['src/**/*'],
        },
        null,
        2
      ) + '\n',
    });

    vfs.applyAction({
      type: 'CREATE',
      path: 'apps/remote-dashboard/vite.config.ts',
      content: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'remoteDashboard',
      filename: 'remoteEntry.js',
      exposes: {
        './DashboardWidget': './src/DashboardWidget.tsx',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
  server: {
    port: 5001,
    origin: 'http://localhost:5001',
  },
});
`,
    });

    vfs.applyAction({
      type: 'CREATE',
      path: 'apps/remote-dashboard/index.html',
      content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Remote Dashboard - Micro-Frontend</title>
  </head>
  <body class="bg-zinc-950 text-zinc-100 min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
    });

    vfs.applyAction({
      type: 'CREATE',
      path: 'apps/remote-dashboard/src/main.tsx',
      content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`,
    });

    vfs.applyAction({
      type: 'CREATE',
      path: 'apps/remote-dashboard/src/index.css',
      content: `@import "tailwindcss";\n`,
    });

    vfs.applyAction({
      type: 'CREATE',
      path: 'apps/remote-dashboard/src/DashboardWidget.tsx',
      content: `import React, { useState, useEffect } from 'react';
import { eventBus } from '@repo/event-bus';

export function DashboardWidget() {
  const [pingData, setPingData] = useState<string>('Awaiting shell signal...');

  useEffect(() => {
    const unsub = eventBus.subscribe<{ timestamp: string }>('shell:ping', (payload) => {
      setPingData(\`Signal received at \${payload.timestamp}\`);
    });
    return unsub;
  }, []);

  const triggerAlert = () => {
    eventBus.publish('dashboard:alert', { text: \`Alert dispatched from RemoteWidget at \${new Date().toLocaleTimeString()}\` });
  };

  return (
    <div className="border border-emerald-500/30 bg-emerald-950/20 rounded-lg p-4">
      <h3 className="font-semibold text-emerald-400 text-sm mb-2">Federated Remote Dashboard Widget</h3>
      <p className="text-xs text-zinc-300 mb-3">{pingData}</p>
      <button
        onClick={triggerAlert}
        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium transition"
      >
        Send Alert to Host Shell
      </button>
    </div>
  );
}

export default DashboardWidget;
`,
    });

    vfs.applyAction({
      type: 'CREATE',
      path: 'apps/remote-dashboard/src/App.tsx',
      content: `import React from 'react';
import { DashboardWidget } from './DashboardWidget.js';

export function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Remote Dashboard Standalone Preview</h1>
      <DashboardWidget />
    </div>
  );
}

export default App;
`,
    });
  },
};
