import type { FeatureSlice } from '../../engine/compositor.js';
import { DEPENDENCY_REGISTRY } from '../../registry/dependencies.js';
import type { ProjectConfig } from '../../types/config.js';
import type { VirtualFileSystem } from '../../vfs/vfs.js';

export const tauriAppSlice: FeatureSlice = {
  id: 'desktop-tauri-app',
  name: 'Native Tauri v2 Desktop Generator (Rust + React 19)',
  apply: (vfs: VirtualFileSystem, config: ProjectConfig) => {
    if (config.topology !== 'tauri-desktop') {
      return;
    }

    const rustCrateName = config.name.replace(/[^a-zA-Z0-9_]/g, '_');
    const identifier = `com.forgestack.${config.name.replace(/[^a-zA-Z0-9]/g, '')}`;

    // 1. package.json
    vfs.applyAction({
      type: 'CREATE',
      path: 'package.json',
      content: JSON.stringify(
        {
          name: config.name,
          version: '0.1.0',
          private: true,
          type: 'module',
          scripts: {
            dev: 'vite',
            build: 'tsc && vite build',
            preview: 'vite preview',
            tauri: 'tauri',
            'tauri:dev': 'tauri dev',
            'tauri:build': 'tauri build',
          },
          dependencies: {
            '@tauri-apps/api': DEPENDENCY_REGISTRY['@tauri-apps/api'],
            '@tauri-apps/plugin-shell': DEPENDENCY_REGISTRY['@tauri-apps/plugin-shell'],
            react: DEPENDENCY_REGISTRY.react,
            'react-dom': DEPENDENCY_REGISTRY['react-dom'],
            clsx: DEPENDENCY_REGISTRY.clsx,
            'tailwind-merge': DEPENDENCY_REGISTRY['tailwind-merge'],
            'lucide-react': DEPENDENCY_REGISTRY['lucide-react'],
          },
          devDependencies: {
            '@tauri-apps/cli': DEPENDENCY_REGISTRY['@tauri-apps/cli'],
            '@types/react': DEPENDENCY_REGISTRY['@types/react'],
            '@types/react-dom': DEPENDENCY_REGISTRY['@types/react-dom'],
            '@vitejs/plugin-react': DEPENDENCY_REGISTRY['@vitejs/plugin-react'],
            tailwindcss: DEPENDENCY_REGISTRY.tailwindcss,
            '@tailwindcss/vite': DEPENDENCY_REGISTRY['@tailwindcss/vite'],
            typescript: DEPENDENCY_REGISTRY.typescript,
            vite: DEPENDENCY_REGISTRY.vite,
          },
        },
        null,
        2
      ) + '\n',
    });

    // 2. tsconfig.json
    vfs.applyAction({
      type: 'CREATE',
      path: 'tsconfig.json',
      content: JSON.stringify(
        {
          compilerOptions: {
            target: 'ES2022',
            useDefineForClassFields: true,
            lib: ['ES2022', 'DOM', 'DOM.Iterable'],
            module: 'ESNext',
            skipLibCheck: true,
            moduleResolution: 'bundler',
            allowImportingTsExtensions: true,
            resolveJsonModule: true,
            isolatedModules: true,
            noEmit: true,
            jsx: 'react-jsx',
            strict: true,
            noUnusedLocals: true,
            noUnusedParameters: true,
            noFallthroughCasesInSwitch: true,
          },
          include: ['src'],
        },
        null,
        2
      ) + '\n',
    });

    // 3. vite.config.ts
    vfs.applyAction({
      type: 'CREATE',
      path: 'vite.config.ts',
      content: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
});
`,
    });

    // 4. index.html
    vfs.applyAction({
      type: 'CREATE',
      path: 'index.html',
      content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${config.name}</title>
  </head>
  <body class="bg-zinc-950 text-zinc-100 min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
    });

    // 5. src/main.tsx
    vfs.applyAction({
      type: 'CREATE',
      path: 'src/main.tsx',
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

    // 6. src/App.tsx with Tauri invoke command
    vfs.applyAction({
      type: 'CREATE',
      path: 'src/App.tsx',
      content: `import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

export function App() {
  const [name, setName] = useState('');
  const [greetMsg, setGreetMsg] = useState('');

  async function handleGreet() {
    try {
      const res = await invoke<string>('greet', { name: name || 'Explorer' });
      setGreetMsg(res);
    } catch (err) {
      console.error('Tauri invoke error:', err);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-zinc-950 text-white">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">Tauri v2 + React 19</h1>
      <p className="text-zinc-400 mb-8">High performance native desktop application generator</p>

      <div className="flex gap-2 mb-4">
        <input
          id="greet-input"
          className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter a name..."
        />
        <button
          type="button"
          onClick={handleGreet}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 font-semibold rounded-lg transition"
        >
          Greet
        </button>
      </div>

      {greetMsg && <p className="text-emerald-400 mt-2 font-mono">{greetMsg}</p>}
    </main>
  );
}

export default App;
`,
    });

    // 7. src/index.css
    vfs.applyAction({
      type: 'CREATE',
      path: 'src/index.css',
      content: `@import "tailwindcss";\n`,
    });

    // 8. src-tauri/Cargo.toml
    vfs.applyAction({
      type: 'CREATE',
      path: 'src-tauri/Cargo.toml',
      content: `[package]
name = "${rustCrateName}"
version = "0.1.0"
description = "Native desktop app powered by Tauri v2 and React 19"
edition = "2021"

[lib]
name = "${rustCrateName}_lib"
crate-type = ["staticlib", "cdylib", "rlib"]

[build-dependencies]
tauri-build = { version = "2", features = [] }

[dependencies]
tauri = { version = "2", features = [] }
tauri-plugin-shell = "2"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
`,
    });

    // 9. src-tauri/build.rs
    vfs.applyAction({
      type: 'CREATE',
      path: 'src-tauri/build.rs',
      content: `fn main() {
    tauri_build::build()
}
`,
    });

    // 10. src-tauri/tauri.conf.json
    vfs.applyAction({
      type: 'CREATE',
      path: 'src-tauri/tauri.conf.json',
      content: JSON.stringify(
        {
          $schema: 'https://schema.tauri.app/config/2',
          productName: config.name,
          version: '0.1.0',
          identifier,
          build: {
            beforeDevCommand: 'pnpm dev',
            devUrl: 'http://localhost:1420',
            beforeBuildCommand: 'pnpm build',
            frontendDist: '../dist',
          },
          app: {
            windows: [
              {
                title: config.name,
                width: 1024,
                height: 768,
                resizable: true,
                fullscreen: false,
              },
            ],
            security: {
              csp: null,
            },
          },
          bundle: {
            active: true,
            targets: 'all',
          },
        },
        null,
        2
      ) + '\n',
    });

    // 11. src-tauri/capabilities/default.json
    vfs.applyAction({
      type: 'CREATE',
      path: 'src-tauri/capabilities/default.json',
      content: JSON.stringify(
        {
          $schema: '../gen/schemas/desktop-schema.json',
          identifier: 'default',
          description: 'Default capabilities for main application window',
          windows: ['main'],
          permissions: ['core:default'],
        },
        null,
        2
      ) + '\n',
    });

    // 12. src-tauri/src/lib.rs
    vfs.applyAction({
      type: 'CREATE',
      path: 'src-tauri/src/lib.rs',
      content: `#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Tauri v2 Rust backend!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
`,
    });

    // 13. src-tauri/src/main.rs
    vfs.applyAction({
      type: 'CREATE',
      path: 'src-tauri/src/main.rs',
      content: `#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    ${rustCrateName}_lib::run();
}
`,
    });
  },
};
