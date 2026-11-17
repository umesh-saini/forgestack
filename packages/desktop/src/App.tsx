import React, { useState, useEffect, useCallback } from 'react';
import {
  generateProjectVfs,
  type ProjectConfig,
  type TreeNode,
  type VirtualFileSystem,
} from '@forgestack/core/browser';
import { Header, type ThemeId } from './components/wizard/Header.js';
import { ProjectIdentity } from './components/wizard/ProjectIdentity.js';
import { DragDropConfigurator } from './components/wizard/DragDropConfigurator.js';
import { PathSelectorModal } from './components/wizard/PathSelectorModal.js';
import { TopologySelector } from './components/wizard/TopologySelector.js';
import { FrontendGrid } from './components/wizard/FrontendGrid.js';
import { BackendGrid } from './components/wizard/BackendGrid.js';
import { AiGovernance } from './components/wizard/AiGovernance.js';
import { FileTreePreview } from './components/preview/FileTreePreview.js';
import { FileViewerModal } from './components/preview/FileViewerModal.js';
import { ExecutionConsole } from './components/console/ExecutionConsole.js';
import { Sparkles, LayoutGrid, Layers, FolderTree } from 'lucide-react';

export function App() {
  const [theme, setTheme] = useState<ThemeId>(() => {
    return (localStorage.getItem('forgestack-theme') as ThemeId) || 'theme-dark';
  });

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('forgestack-theme', theme);
  }, [theme]);

  const [config, setConfig] = useState<ProjectConfig>({
    name: 'enterprise-app',
    targetPath: '/home/dev/Documents/enterprise-app',
    topology: 'monorepo',
    frontend: {
      framework: 'react-vite',
      styling: 'tailwind',
      state: 'query',
      icons: 'lucide',
      toast: 'sonner',
      forms: 'rhf-zod',
      uiExtras: { toast: true, icons: true, forms: true },
    },
    backend: {
      framework: 'fastify',
      database: 'postgres',
      orm: 'drizzle',
      container: true,
    },
    aiGovernance: { rules: true, skills: true, openSpec: true },
    packageManager: 'pnpm',
    git: true,
    install: true,
  });

  const [viewMode, setViewMode] = useState<'canvas' | 'form'>('canvas');
  const [activeTab, setActiveTab] = useState<'architecture' | 'frontend' | 'backend' | 'ai'>('architecture');
  const [currentVfs, setCurrentVfs] = useState<VirtualFileSystem | null>(null);
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [fileCount, setFileCount] = useState(0);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [selectedFileContent, setSelectedFileContent] = useState<string | null>(null);
  const [isPathModalOpen, setIsPathModalOpen] = useState(false);

  const [logs, setLogs] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Update in-memory file tree dynamically whenever configuration changes
  useEffect(() => {
    let active = true;
    generateProjectVfs(config)
      .then((vfs) => {
        if (active) {
          setCurrentVfs(vfs);
          setTree(vfs.toTree());
          setFileCount(vfs.count());
        }
      })
      .catch((err) => {
        console.error('VFS Compilation Error:', err);
      });
    return () => {
      active = false;
    };
  }, [config]);

  // Inspect staged file content
  const handleSelectFile = useCallback((filePath: string) => {
    if (!currentVfs) return;
    const content = currentVfs.getFileContent(filePath);
    if (content !== undefined) {
      setSelectedFilePath(filePath);
      setSelectedFileContent(content);
    }
  }, [currentVfs]);

  // Presets
  const handleApplyPreset = (presetKey: 'monorepo' | 'separate' | 'spa' | 'fastify-api' | 'mongo-api') => {
    switch (presetKey) {
      case 'monorepo':
        setConfig((prev) => ({
          ...prev,
          topology: 'monorepo',
          frontend: {
            framework: 'react-vite',
            styling: 'tailwind',
            state: 'query',
            icons: 'lucide',
            toast: 'sonner',
            forms: 'rhf-zod',
            uiExtras: { toast: true, icons: true, forms: true },
          },
          backend: {
            framework: 'fastify',
            database: 'postgres',
            orm: 'drizzle',
            container: true,
          },
          aiGovernance: { rules: true, skills: true, openSpec: true },
          packageManager: 'pnpm',
        }));
        break;
      case 'separate':
        setConfig((prev) => ({
          ...prev,
          topology: 'separate-folders',
          frontend: {
            framework: 'react-vite',
            styling: 'tailwind',
            state: 'query',
            icons: 'lucide',
            toast: 'sonner',
            forms: 'rhf-zod',
            uiExtras: { toast: true, icons: true, forms: true },
          },
          backend: {
            framework: 'fastify',
            database: 'postgres',
            orm: 'drizzle',
            container: true,
          },
          aiGovernance: { rules: true, skills: true, openSpec: true },
          packageManager: 'pnpm',
        }));
        break;
      case 'spa':
        setConfig((prev) => ({
          ...prev,
          topology: 'standalone-fe',
          frontend: {
            framework: 'react-vite',
            styling: 'tailwind',
            state: 'redux',
            icons: 'tabler',
            toast: 'sonner',
            forms: 'rhf-zod',
            uiExtras: { toast: true, icons: true, forms: true },
          },
          backend: {
            framework: 'none',
            database: 'none',
            orm: 'none',
            container: false,
          },
          aiGovernance: { rules: true, skills: true, openSpec: true },
          packageManager: 'pnpm',
        }));
        break;
      case 'fastify-api':
        setConfig((prev) => ({
          ...prev,
          topology: 'standalone-be',
          frontend: {
            framework: 'none',
            styling: 'none',
            state: 'none',
            uiExtras: { toast: false, icons: false, forms: false },
          },
          backend: {
            framework: 'fastify',
            database: 'postgres',
            orm: 'drizzle',
            container: true,
          },
          aiGovernance: { rules: true, skills: true, openSpec: true },
          packageManager: 'pnpm',
        }));
        break;
      case 'mongo-api':
        setConfig((prev) => ({
          ...prev,
          topology: 'standalone-be',
          frontend: {
            framework: 'none',
            styling: 'none',
            state: 'none',
            uiExtras: { toast: false, icons: false, forms: false },
          },
          backend: {
            framework: 'express',
            database: 'mongodb',
            orm: 'mongoose',
            container: true,
          },
          aiGovernance: { rules: true, skills: true, openSpec: true },
          packageManager: 'pnpm',
        }));
        break;
    }
  };

  const handleScaffold = async () => {
    setIsGenerating(true);
    setIsComplete(false);
    setLogs([
      `[ForgeStack] Initializing synthesis for project: ${config.name}...`,
      `[ForgeStack] Target Directory: ${config.targetPath}`,
      `[ForgeStack] Architecture Topology: ${config.topology}`,
    ]);

    try {
      const vfs = await generateProjectVfs(config);
      setLogs((prev) => [
        ...prev,
        `[ForgeStack VFS] Compiled in-memory file system (${vfs.count()} files staged).`,
        `[ForgeStack PRE-FLIGHT] Verifying target directory write permissions...`,
      ]);

      const isTauri = typeof window !== 'undefined' && ('__TAURI_INTERNALS__' in window || '__TAURI__' in window);

      if (isTauri) {
        setLogs((prev) => [...prev, `[ForgeStack TAURI] Writing files natively via Tauri Rust engine...`]);
        const { invoke } = await import('@tauri-apps/api/core');
        const files = vfs.getAllFiles().map((f) => ({
          path: f.path,
          content: f.content,
          executable: f.executable,
        }));
        const writtenCount = await invoke<number>('scaffold_project_files', {
          payload: {
            target_path: config.targetPath,
            files,
            git_init: config.git,
            run_install: config.install,
            package_manager: config.packageManager,
          },
        });
        setLogs((prev) => [
          ...prev,
          `[ForgeStack TAURI] Wrote ${writtenCount} files atomically to ${config.targetPath}`,
        ]);
      } else {
        setLogs((prev) => [...prev, `[ForgeStack FLUSH] Writing files atomically via Vite scaffold API...`]);
        const response = await fetch('/api/scaffold', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(config),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `Scaffolding failed with HTTP status ${response.status}`);
        }
        const result = await response.json();
        setLogs((prev) => [
          ...prev,
          `[ForgeStack FLUSH] Wrote ${result.filesWritten} files atomically to ${result.targetPath}`,
        ]);
      }

      setLogs((prev) => [
        ...prev,
        ...(config.git ? ['[ForgeStack GIT] Local git repository initialized & staged.'] : []),
        ...(config.install ? [`[ForgeStack INSTALL] Dependencies installed via ${config.packageManager}.`] : []),
        `[ForgeStack SUCCESS] Project scaffolded cleanly on physical disk with Day-One AI Governance!`,
      ]);
      setIsComplete(true);
    } catch (err: any) {
      setLogs((prev) => [
        ...prev,
        `[ForgeStack ERROR] ${err?.message || String(err)}`,
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Keyboard shortcut: Ctrl+Enter or Cmd+Enter to scaffold
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isGenerating) {
          handleScaffold();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [config, isGenerating]);

  // Post generation actions
  const handleOpenVsCode = async () => {
    try {
      const { Command } = await import('@tauri-apps/plugin-shell');
      await Command.create('code', [config.targetPath]).execute();
    } catch {
      alert(`To open in VS Code, run in terminal:\ncode "${config.targetPath}"`);
    }
  };

  const handleOpenAntigravity = async () => {
    alert(`To open in Antigravity, open folder:\n${config.targetPath}`);
  };

  const handleOpenFolder = async () => {
    try {
      const { open } = await import('@tauri-apps/plugin-shell');
      await open(config.targetPath);
    } catch {
      alert(`Target directory located at:\n${config.targetPath}`);
    }
  };

  return (
    <div className={`min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col font-sans selection:bg-blue-500/30 selection:text-white transition-colors`}>
      {/* Background Subtle Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none bg-grid-pattern -z-10 opacity-70" />

      {/* Top Header */}
      <Header
        config={config}
        fileCount={fileCount}
        isGenerating={isGenerating}
        theme={theme}
        onThemeChange={setTheme}
        onApplyPreset={handleApplyPreset}
        onScaffold={handleScaffold}
      />

      {/* Main Studio Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 overflow-hidden max-w-[1700px] w-full mx-auto">
        {/* Left Column: Configuration Workbench */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-5 overflow-y-auto pr-1">
          {/* Section 1: Project Identity & Target Directory */}
          <div className="ui-panel rounded-2xl p-5 shadow-sm space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 opacity-80">
              <span className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-500 flex items-center justify-center font-mono text-[11px]">
                1
              </span>
              <span>Project Identity & Environment</span>
            </h2>
            <ProjectIdentity
              config={config}
              onChange={setConfig}
              onBrowseFolder={() => setIsPathModalOpen(true)}
            />
          </div>

          {/* Section 2: Architecture Studio View Mode Switcher */}
          <div className="ui-panel rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-500 flex items-center justify-center font-mono text-[11px]">
                  2
                </span>
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                  Stack Architecture & Slices
                </span>
              </div>

              {/* View Mode Toggle: Interactive Canvas vs Detail Grids */}
              <div className="flex rounded-xl ui-card-subtle p-0.5 border">
                <button
                  type="button"
                  onClick={() => setViewMode('canvas')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'canvas'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Drag & Drop Canvas</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('form')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'form'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Detail Grids</span>
                </button>
              </div>
            </div>

            {/* View Mode 1: Drag & Drop Configurator */}
            {viewMode === 'canvas' ? (
              <DragDropConfigurator config={config} onChange={setConfig} />
            ) : (
              /* View Mode 2: Classical Detail Grids */
              <div className="space-y-4">
                <div className="flex rounded-xl ui-card-subtle p-0.5 border">
                  <button
                    type="button"
                    onClick={() => setActiveTab('architecture')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      activeTab === 'architecture'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    Topology
                  </button>
                  {config.topology !== 'standalone-be' && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('frontend')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        activeTab === 'frontend'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      Frontend
                    </button>
                  )}
                  {config.topology !== 'standalone-fe' && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('backend')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        activeTab === 'backend'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      Backend
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveTab('ai')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      activeTab === 'ai'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    AI Governance
                  </button>
                </div>

                {activeTab === 'architecture' && (
                  <TopologySelector
                    value={config.topology}
                    onChange={(topology) =>
                      setConfig((prev) => ({
                        ...prev,
                        topology,
                        frontend: {
                          ...prev.frontend,
                          framework: topology !== 'standalone-be' ? 'react-vite' : 'none',
                        },
                        backend: {
                          ...prev.backend,
                          framework:
                            topology !== 'standalone-fe'
                              ? prev.backend.framework === 'none'
                                ? 'fastify'
                                : prev.backend.framework
                              : 'none',
                        },
                      }))
                    }
                  />
                )}

                {activeTab === 'frontend' && (
                  <FrontendGrid
                    frontend={config.frontend}
                    onChange={(frontend) =>
                      setConfig((prev) => ({ ...prev, frontend }))
                    }
                  />
                )}

                {activeTab === 'backend' && (
                  <BackendGrid
                    backend={config.backend}
                    onChange={(backend) =>
                      setConfig((prev) => ({ ...prev, backend }))
                    }
                  />
                )}

                {activeTab === 'ai' && (
                  <AiGovernance
                    aiGovernance={config.aiGovernance}
                    onChange={(aiGovernance) =>
                      setConfig((prev) => ({ ...prev, aiGovernance }))
                    }
                  />
                )}
              </div>
            )}
          </div>

          {/* Section 3: Execution Streaming Console */}
          <ExecutionConsole
            isGenerating={isGenerating}
            isComplete={isComplete}
            logs={logs}
            targetPath={config.targetPath}
            onOpenVsCode={handleOpenVsCode}
            onOpenAntigravity={handleOpenAntigravity}
            onOpenFolder={handleOpenFolder}
          />
        </div>

        {/* Right Column: Virtual File Tree Explorer & Live Inspector */}
        <div className="lg:col-span-5 xl:col-span-5 h-[calc(100vh-100px)] sticky top-20">
          <FileTreePreview
            tree={tree}
            filesCount={fileCount}
            onSelectFile={handleSelectFile}
          />
        </div>
      </main>

      {/* Path Selector Modal */}
      <PathSelectorModal
        isOpen={isPathModalOpen}
        currentPath={config.targetPath}
        projectName={config.name}
        onClose={() => setIsPathModalOpen(false)}
        onSelectPath={(newPath) =>
          setConfig((prev) => ({ ...prev, targetPath: newPath }))
        }
      />

      {/* Code Inspector Modal */}
      <FileViewerModal
        filePath={selectedFilePath}
        content={selectedFileContent}
        onClose={() => {
          setSelectedFilePath(null);
          setSelectedFileContent(null);
        }}
      />
    </div>
  );
}
