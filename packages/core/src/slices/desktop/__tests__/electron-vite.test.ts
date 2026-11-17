import { describe, expect, it } from 'vitest';
import { VirtualFileSystem } from '../../../vfs/vfs.js';
import { electronViteSlice } from '../electron-vite.js';
import type { ProjectConfig } from '../../../types/config.js';

describe('Electron Desktop with electron-vite Slice', () => {
  const electronConfig: ProjectConfig = {
    name: 'my-desktop-app',
    targetPath: './my-desktop-app',
    topology: 'electron-desktop',
    frontend: {
      framework: 'react-vite',
      styling: 'tailwind',
      state: 'none',
      dateLib: 'dayjs',
      uiExtras: { toast: true, icons: true, forms: false },
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

  it('should scaffold complete electron-vite architecture with secure contextBridge IPC', () => {
    const vfs = new VirtualFileSystem();
    electronViteSlice.apply(vfs, electronConfig);

    expect(vfs.hasFile('package.json')).toBe(true);
    expect(vfs.hasFile('electron.vite.config.ts')).toBe(true);
    expect(vfs.hasFile('src/main/index.ts')).toBe(true);
    expect(vfs.hasFile('src/preload/index.ts')).toBe(true);
    expect(vfs.hasFile('src/preload/index.d.ts')).toBe(true);
    expect(vfs.hasFile('src/renderer/index.html')).toBe(true);
    expect(vfs.hasFile('src/renderer/src/App.tsx')).toBe(true);
    expect(vfs.hasFile('src/renderer/src/main.tsx')).toBe(true);
    expect(vfs.hasFile('src/renderer/src/index.css')).toBe(true);

    const preloadContent = vfs.getFileContent('src/preload/index.ts')!;
    expect(preloadContent).toContain('contextBridge.exposeInMainWorld(\'electronAPI\', electronAPI)');
    expect(preloadContent).toContain('ipcRenderer.invoke(\'profile:create\', input)');
    expect(preloadContent).toContain('ipcRenderer.invoke(\'log:getAll\')');

    const mainContent = vfs.getFileContent('src/main/index.ts')!;
    expect(mainContent).toContain('contextIsolation: true');
    expect(mainContent).toContain('nodeIntegration: false');
    expect(mainContent).toContain('ipcMain.handle(\'profile:create\'');
    expect(mainContent).toContain('ipcMain.handle(\'log:getAll\'');

    const pkg = JSON.parse(vfs.getFileContent('package.json')!);
    expect(pkg.devDependencies['electron-vite']).toBeDefined();
    expect(pkg.devDependencies['electron']).toBeDefined();
    expect(pkg.dependencies['dayjs']).toBeDefined();
  });
});
