import { describe, expect, it } from 'vitest';
import { generateProjectVfs } from '../../../engine/create-pipeline.js';
import type { ProjectConfig } from '../../../types/config.js';

describe('Tauri v2 Desktop Generator Slice', () => {
  it('should scaffold complete Tauri v2 Rust backend and React 19 frontend', async () => {
    const config: ProjectConfig = {
      name: 'my-tauri-studio',
      targetPath: '/test/my-tauri-studio',
      topology: 'tauri-desktop',
      frontend: {
        framework: 'react-vite',
        styling: 'tailwind',
        state: 'none',
        uiExtras: { toast: false, icons: false, forms: false },
      },
      backend: {
        framework: 'none',
        database: 'none',
        orm: 'none',
        container: false,
      },
      aiGovernance: { rules: true, skills: true, openSpec: true },
      packageManager: 'pnpm',
      git: true,
      install: false,
    };

    const vfs = await generateProjectVfs(config);

    // 1. package.json dependencies and scripts
    const pkg = JSON.parse(vfs.getFileContent('package.json')!);
    expect(pkg.dependencies['@tauri-apps/api']).toBeDefined();
    expect(pkg.devDependencies['@tauri-apps/cli']).toBeDefined();
    expect(pkg.scripts['tauri']).toBe('tauri');
    expect(pkg.scripts['tauri:dev']).toBe('tauri dev');
    expect(pkg.scripts['tauri:build']).toBe('tauri build');

    // 2. vite.config.ts
    expect(vfs.hasFile('vite.config.ts')).toBe(true);
    const viteConfig = vfs.getFileContent('vite.config.ts')!;
    expect(viteConfig).toContain('port: 1420');
    expect(viteConfig).toContain('strictPort: true');
    expect(viteConfig).toContain("ignored: ['**/src-tauri/**']");

    // 3. React 19 UI
    expect(vfs.hasFile('src/App.tsx')).toBe(true);
    const appContent = vfs.getFileContent('src/App.tsx')!;
    expect(appContent).toContain("import { invoke } from '@tauri-apps/api/core';");
    expect(appContent).toContain("await invoke<string>('greet'");

    // 4. Rust Backend (src-tauri)
    expect(vfs.hasFile('src-tauri/Cargo.toml')).toBe(true);
    const cargoToml = vfs.getFileContent('src-tauri/Cargo.toml')!;
    expect(cargoToml).toContain('name = "my_tauri_studio"');
    expect(cargoToml).toContain('tauri = { version = "2"');
    expect(cargoToml).toContain('serde = { version = "1"');

    expect(vfs.hasFile('src-tauri/tauri.conf.json')).toBe(true);
    const tauriConf = JSON.parse(vfs.getFileContent('src-tauri/tauri.conf.json')!);
    expect(tauriConf.productName).toBe('my-tauri-studio');
    expect(tauriConf.build.devUrl).toBe('http://localhost:1420');
    expect(tauriConf.app.windows[0].width).toBe(1024);

    expect(vfs.hasFile('src-tauri/capabilities/default.json')).toBe(true);
    const capabilities = JSON.parse(vfs.getFileContent('src-tauri/capabilities/default.json')!);
    expect(capabilities.permissions).toContain('core:default');

    expect(vfs.hasFile('src-tauri/src/lib.rs')).toBe(true);
    const libRs = vfs.getFileContent('src-tauri/src/lib.rs')!;
    expect(libRs).toContain('#[tauri::command]');
    expect(libRs).toContain('fn greet(name: &str) -> String');

    expect(vfs.hasFile('src-tauri/src/main.rs')).toBe(true);
    const mainRs = vfs.getFileContent('src-tauri/src/main.rs')!;
    expect(mainRs).toContain('my_tauri_studio_lib::run();');
  });

  it('should not scaffold Tauri files for electron or standard monorepo', async () => {
    const config: ProjectConfig = {
      name: 'non-tauri-app',
      targetPath: '/test/non-tauri-app',
      topology: 'standalone-fe',
      frontend: {
        framework: 'react-vite',
        styling: 'tailwind',
        state: 'none',
        uiExtras: { toast: false, icons: false, forms: false },
      },
      backend: {
        framework: 'none',
        database: 'none',
        orm: 'none',
        container: false,
      },
      aiGovernance: { rules: true, skills: true, openSpec: true },
      packageManager: 'pnpm',
      git: true,
      install: false,
    };

    const vfs = await generateProjectVfs(config);

    expect(vfs.hasFile('src-tauri/Cargo.toml')).toBe(false);
    expect(vfs.hasFile('src-tauri/tauri.conf.json')).toBe(false);
  });
});
