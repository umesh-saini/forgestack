import type { FeatureSlice } from '../../engine/compositor.js';
import { DEPENDENCY_REGISTRY } from '../../registry/dependencies.js';
import type { ProjectConfig } from '../../types/config.js';
import type { VirtualFileSystem } from '../../vfs/vfs.js';

export const electronViteSlice: FeatureSlice = {
  id: 'desktop-electron-vite',
  name: 'Electron Desktop App with electron-vite & Secure IPC',
  apply: (vfs: VirtualFileSystem, config: ProjectConfig) => {
    if (config.topology !== 'electron-desktop') {
      return;
    }

    // 1. package.json
    const packageJson = {
      name: config.name,
      version: '0.1.0',
      description: 'Production desktop application built with electron-vite and React 19',
      main: './out/main/index.js',
      author: 'ForgeStack',
      scripts: {
        format: 'prettier --write "src/**/*.{ts,tsx,css,html}"',
        lint: 'eslint . --ext .js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix',
        typecheck: 'npm run typecheck:node && npm run typecheck:web',
        'typecheck:node': 'tsc --noEmit -p tsconfig.node.json --composite false',
        'typecheck:web': 'tsc --noEmit -p tsconfig.web.json --composite false',
        start: 'electron-vite preview',
        dev: 'electron-vite dev',
        build: 'electron-vite build',
      },
      dependencies: {
        '@electron-toolkit/preload': DEPENDENCY_REGISTRY['@electron-toolkit/preload'],
        '@electron-toolkit/utils': DEPENDENCY_REGISTRY['@electron-toolkit/utils'],
        react: DEPENDENCY_REGISTRY.react,
        'react-dom': DEPENDENCY_REGISTRY['react-dom'],
        clsx: DEPENDENCY_REGISTRY.clsx,
        'tailwind-merge': DEPENDENCY_REGISTRY['tailwind-merge'],
        'lucide-react': DEPENDENCY_REGISTRY['lucide-react'],
        ...(config.frontend.dateLib === 'dayjs'
          ? { dayjs: DEPENDENCY_REGISTRY.dayjs }
          : config.frontend.dateLib === 'date-fns'
          ? { 'date-fns': DEPENDENCY_REGISTRY['date-fns'] }
          : config.frontend.dateLib === 'moment'
          ? { moment: DEPENDENCY_REGISTRY.moment }
          : {}),
      },
      devDependencies: {
        '@types/node': DEPENDENCY_REGISTRY['@types/node'],
        '@types/react': DEPENDENCY_REGISTRY['@types/react'],
        '@types/react-dom': DEPENDENCY_REGISTRY['@types/react-dom'],
        '@vitejs/plugin-react': DEPENDENCY_REGISTRY['@vitejs/plugin-react'],
        electron: DEPENDENCY_REGISTRY.electron,
        'electron-vite': DEPENDENCY_REGISTRY['electron-vite'],
        prettier: DEPENDENCY_REGISTRY.prettier,
        tailwindcss: DEPENDENCY_REGISTRY.tailwindcss,
        '@tailwindcss/vite': DEPENDENCY_REGISTRY['@tailwindcss/vite'],
        typescript: DEPENDENCY_REGISTRY.typescript,
        vite: DEPENDENCY_REGISTRY.vite,
      },
    };

    vfs.applyAction({
      type: 'CREATE',
      path: 'package.json',
      content: JSON.stringify(packageJson, null, 2) + '\n',
    });

    // 2. electron.vite.config.ts
    vfs.applyAction({
      type: 'CREATE',
      path: 'electron.vite.config.ts',
      content: `import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/main/index.ts')
        }
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/preload/index.ts')
        }
      }
    }
  },
  renderer: {
    root: resolve(__dirname, 'src/renderer'),
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@renderer': resolve(__dirname, 'src/renderer/src')
      }
    }
  }
});
`,
    });

    // 3. src/main/index.ts
    vfs.applyAction({
      type: 'CREATE',
      path: 'src/main/index.ts',
      content: `import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 720,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.forgestack.${config.name}');

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // Secure IPC Handlers
  ipcMain.handle('profile:create', async (_event, input: { name: string; email: string; role?: string }) => {
    return {
      id: 'prof_' + Math.random().toString(36).substring(2, 9),
      name: input.name,
      email: input.email,
      role: input.role || 'developer',
      createdAt: new Date().toISOString()
    };
  });

  ipcMain.handle('log:getAll', async () => {
    return [
      { id: 1, message: 'Desktop kernel booted', timestamp: new Date().toISOString() },
      { id: 2, message: 'Secure contextBridge initialized', timestamp: new Date().toISOString() },
      { id: 3, message: 'System readiness: Operational', timestamp: new Date().toISOString() }
    ];
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
`,
    });

    // 4. src/preload/index.ts
    vfs.applyAction({
      type: 'CREATE',
      path: 'src/preload/index.ts',
      content: `import { contextBridge, ipcRenderer } from 'electron';

export interface CreateProfileInput {
  name: string;
  email: string;
  role?: string;
}

export interface ElectronAPI {
  profile: {
    create: (input: CreateProfileInput) => Promise<any>;
  };
  log: {
    getAll: () => Promise<any[]>;
  };
}

const electronAPI: ElectronAPI = {
  profile: {
    create: (input: CreateProfileInput) => ipcRenderer.invoke('profile:create', input),
  },
  log: {
    getAll: () => ipcRenderer.invoke('log:getAll'),
  }
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronAPI', electronAPI);
  } catch (error) {
    console.error('Failed to expose electronAPI to main world:', error);
  }
} else {
  // @ts-ignore fallback for non-isolated contexts
  window.electronAPI = electronAPI;
}
`,
    });

    // 5. src/preload/index.d.ts
    vfs.applyAction({
      type: 'CREATE',
      path: 'src/preload/index.d.ts',
      content: `import type { ElectronAPI } from './index';

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
`,
    });

    // 6. src/renderer/index.html
    vfs.applyAction({
      type: 'CREATE',
      path: 'src/renderer/index.html',
      content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${config.name}</title>
  </head>
  <body class="bg-slate-950 text-slate-100 antialiased selection:bg-blue-500/30 selection:text-white">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
    });

    // 7. src/renderer/src/main.tsx
    vfs.applyAction({
      type: 'CREATE',
      path: 'src/renderer/src/main.tsx',
      content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`,
    });

    // 8. src/renderer/src/index.css
    vfs.applyAction({
      type: 'CREATE',
      path: 'src/renderer/src/index.css',
      content: `@import "tailwindcss";
`,
    });

    // 9. src/renderer/src/App.tsx
    vfs.applyAction({
      type: 'CREATE',
      path: 'src/renderer/src/App.tsx',
      content: `import React, { useState, useEffect } from 'react';
import { Shield, Terminal, UserPlus, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [logs, setLogs] = useState<any[]>([]);
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchLogs = async () => {
    if (window.electronAPI) {
      const allLogs = await window.electronAPI.log.getAll();
      setLogs(allLogs);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName || !profileEmail) return;

    if (window.electronAPI) {
      const res = await window.electronAPI.profile.create({
        name: profileName,
        email: profileEmail,
        role: 'Developer'
      });
      setStatusMessage(\`Profile \${res.name} (\${res.id}) registered successfully!\`);
      setProfileName('');
      setProfileEmail('');
      fetchLogs();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 flex flex-col items-center justify-center font-sans">
      <div className="max-w-2xl w-full space-y-6">
        <header className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
            <Shield className="w-3.5 h-3.5" />
            <span>electron-vite + React 19 + ContextBridge IPC</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">${config.name}</h1>
          <p className="text-slate-400 text-sm">Hardened desktop runtime with isolated IPC communication</p>
        </header>

        {/* Profile Creation Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-blue-400" />
            <span>IPC Dispatch: profile:create</span>
          </h2>
          <form onSubmit={handleCreateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Full Name"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={profileEmail}
              onChange={(e) => setProfileEmail(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="md:col-span-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium text-sm transition-colors cursor-pointer shadow-md shadow-blue-600/20"
            >
              Invoke IPC (profile:create)
            </button>
          </form>
          {statusMessage && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>

        {/* System Logs */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-purple-400" />
              <span>IPC Dispatch: log:getAll</span>
            </h2>
            <button
              onClick={fetchLogs}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 font-mono text-xs space-y-1.5 max-h-48 overflow-y-auto">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between text-slate-400">
                <span className="text-slate-200">{log.message}</span>
                <span className="text-[10px] opacity-60">{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
`,
    });

    // 10. tsconfigs
    vfs.applyAction({
      type: 'CREATE',
      path: 'tsconfig.json',
      content: JSON.stringify(
        {
          compilerOptions: {
            target: 'ESNext',
            useDefineForClassFields: true,
            module: 'ESNext',
            lib: ['ESNext', 'DOM', 'DOM.Iterable'],
            moduleResolution: 'Bundler',
            strict: true,
            jsx: 'react-jsx',
            resolveJsonModule: true,
            isolatedModules: true,
            esModuleInterop: true,
            noEmit: true,
            noUnusedLocals: true,
            noUnusedParameters: true,
            noFallthroughCasesInSwitch: true,
            skipLibCheck: true,
          },
          include: ['src/**/*'],
        },
        null,
        2
      ) + '\n',
    });

    vfs.applyAction({
      type: 'CREATE',
      path: 'tsconfig.node.json',
      content: JSON.stringify(
        {
          compilerOptions: {
            composite: true,
            module: 'ESNext',
            moduleResolution: 'Bundler',
            allowSyntheticDefaultImports: true,
          },
          include: ['electron.vite.config.ts', 'src/main/**/*', 'src/preload/**/*'],
        },
        null,
        2
      ) + '\n',
    });

    vfs.applyAction({
      type: 'CREATE',
      path: 'tsconfig.web.json',
      content: JSON.stringify(
        {
          compilerOptions: {
            composite: true,
            jsx: 'react-jsx',
            module: 'ESNext',
            moduleResolution: 'Bundler',
            allowSyntheticDefaultImports: true,
          },
          include: ['src/renderer/src/**/*'],
        },
        null,
        2
      ) + '\n',
    });

    // 11. .env.example
    const electronEnvLines = [
      '# Electron Desktop Application Environment Variables',
      'MAIN_VITE_API_URL=http://localhost:3000/api',
      `RENDERER_VITE_APP_TITLE=${config.name}`,
      'NODE_ENV=development',
    ];
    vfs.applyAction({
      type: 'CREATE',
      path: '.env.example',
      content: electronEnvLines.join('\n') + '\n',
    });
  },
};
