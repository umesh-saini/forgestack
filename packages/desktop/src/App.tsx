import React, { useState, useEffect, useCallback } from 'react';
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import {
  generateProjectVfs,
  type ProjectConfig,
  type TreeNode,
  type VirtualFileSystem,
} from '@forgestack/core/browser';
import type { ThemeId } from './components/wizard/Header.js';
import { StudioNavbar } from './components/layout/StudioNavbar.js';
import { HomeTemplatesDashboard } from './components/home/HomeTemplatesDashboard.js';
import { FastScaffoldModal } from './components/home/FastScaffoldModal.js';
import { StepperWizard } from './components/wizard/StepperWizard.js';
import { PathSelectorModal } from './components/wizard/PathSelectorModal.js';
import { VsCodeWorkspace } from './components/preview/VsCodeWorkspace.js';
import { AppSettingsPage, loadAppSettings } from './components/settings/AppSettingsPage.js';
import { ScaffoldConsoleView } from './components/home/ScaffoldConsoleView.js';
import { UpdateModal } from './components/updater/UpdateModal.js';
import {
  getAppEnvironment,
  checkForUpdates,
  type AppEnvironment,
  type UpdateDetails,
} from './services/updaterService.js';
import { type SavedTemplate, BUILTIN_TEMPLATES } from './types/template.js';

function ForgeStackAppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // Load User Preferences & Theme
  const [theme, setTheme] = useState<ThemeId>(() => {
    return (localStorage.getItem('forgestack-theme') as ThemeId) || 'theme-dark';
  });

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('forgestack-theme', theme);
  }, [theme]);

  // Templates Management State (localStorage with BUILTIN_TEMPLATES fallback)
  const [templates, setTemplates] = useState<SavedTemplate[]>(() => {
    try {
      const stored = localStorage.getItem('forgestack-templates');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return BUILTIN_TEMPLATES;
  });

  const saveTemplatesToStorage = (updated: SavedTemplate[]) => {
    setTemplates(updated);
    try {
      localStorage.setItem('forgestack-templates', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Software Updates & Packaging State
  const [appEnv, setAppEnv] = useState<AppEnvironment | null>(null);
  const [updateDetails, setUpdateDetails] = useState<UpdateDetails | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);

  useEffect(() => {
    getAppEnvironment().then((env) => {
      setAppEnv(env);
    });

    // Background update check on startup
    checkForUpdates(false).then((details) => {
      if (details) {
        setUpdateDetails(details);
      }
    });
  }, []);

  const handleManualCheckUpdate = async () => {
    setIsCheckingUpdate(true);
    setIsUpdateModalOpen(true);
    try {
      const details = await checkForUpdates(true);
      setUpdateDetails(details);
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  const handleSimulateUpdate = () => {
    const isDeb = appEnv?.is_deb_or_system ?? false;
    const isAppImage = appEnv?.is_appimage ?? false;
    setUpdateDetails({
      available: true,
      currentVersion: appEnv?.current_version || '1.0.0',
      newVersion: '1.1.0',
      releaseNotes: `### ForgeStack Studio v1.1.0 Highlights\n\n• SvelteKit & Remix fullstack framework adapters\n• Real-time dependency conflict resolver\n• Enhanced AST composition engine for zero-merge-conflict scaffolding\n• Linux system security & packaging performance optimizations`,
      releaseDate: new Date().toISOString(),
      supportsInPlace: isAppImage,
      isDebOrSystem: isDeb || (!isAppImage),
      platform: appEnv?.platform || 'linux',
      downloadUrl: 'https://github.com/forgestack/forgestack/releases/tag/v1.1.0',
      debDownloadUrl: 'https://github.com/forgestack/forgestack/releases/download/v1.1.0/ForgeStack_1.1.0_amd64.deb',
    });
    setIsUpdateModalOpen(true);
  };

  // Active Project Configuration
  const [config, setConfig] = useState<ProjectConfig>(() => {
    const userSettings = loadAppSettings();
    return {
      name: 'enterprise-app',
      targetPath: `${userSettings.defaultTargetPath}/enterprise-app`,
      topology: 'monorepo',
      frontend: {
        framework: 'react-vite',
        styling: 'tailwind',
        state: 'query',
        icons: 'lucide',
        toast: 'sonner',
        forms: 'rhf-zod',
        dateLib: 'none',
        uiExtras: { toast: true, icons: true, forms: true },
      },
      backend: {
        framework: 'fastify',
        database: 'postgres',
        orm: 'drizzle',
        container: true,
        processManager: 'docker',
      },
      utilities: {
        frontendHelpers: false,
        backendHelpers: false,
      },
      aiGovernance: {
        rules: userSettings.defaultCursorRules,
        claude: true,
        skills: userSettings.defaultAasSkills,
        openSpec: true,
        engine: userSettings.defaultAiEngine,
      },
      packageManager: userSettings.defaultPackageManager,
      git: userSettings.defaultGitInit,
      install: userSettings.defaultAutoInstall,
    };
  });

  // Fast Scaffold Modal State
  const [fastScaffoldTemplate, setFastScaffoldTemplate] = useState<SavedTemplate | null>(null);

  // VFS & Staging Preview State
  const [currentVfs, setCurrentVfs] = useState<VirtualFileSystem | null>(null);
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [fileCount, setFileCount] = useState(0);

  // Tab-based File Preview in VS Code Workspace
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [selectedFileContent, setSelectedFileContent] = useState<string | null>(null);
  const [isWorkspaceMaximized, setIsWorkspaceMaximized] = useState(false);

  // Path Selector Modal
  const [isPathModalOpen, setIsPathModalOpen] = useState(false);
  const [browseCallback, setBrowseCallback] = useState<((p: string) => void) | null>(null);

  // Execution & Live Scaffolding Status
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  // Recompile Virtual File System whenever Config changes
  const recompileVfs = useCallback(async (cfgToCompile: ProjectConfig) => {
    try {
      const vfs = await generateProjectVfs(cfgToCompile);
      setCurrentVfs(vfs);
      setTree(vfs.toTree());
      setFileCount(vfs.count());

      // Live reload active file content if currently open in Monaco editor
      if (selectedFilePath) {
        const file = vfs.getFile(selectedFilePath);
        if (file) {
          setSelectedFileContent(file.content);
        }
      }
    } catch (err) {
      console.error('Failed to compile VFS for preview:', err);
    }
  }, [selectedFilePath]);

  useEffect(() => {
    recompileVfs(config);
  }, [config, recompileVfs]);

  // Handle File Selection with Tab Support
  const handleSelectFile = (filePath: string) => {
    if (!currentVfs) return;
    const file = currentVfs.getFile(filePath);
    if (file) {
      setOpenTabs((prev) => (prev.includes(filePath) ? prev : [...prev, filePath]));
      setSelectedFilePath(filePath);
      setSelectedFileContent(file.content);
    }
  };

  // Close specific tab
  const handleCloseTab = (filePath: string) => {
    const nextTabs = openTabs.filter((p) => p !== filePath);
    setOpenTabs(nextTabs);
    if (selectedFilePath === filePath) {
      if (nextTabs.length > 0) {
        const nextActive = nextTabs[nextTabs.length - 1];
        setSelectedFilePath(nextActive);
        const file = currentVfs?.getFile(nextActive);
        setSelectedFileContent(file ? file.content : null);
      } else {
        setSelectedFilePath(null);
        setSelectedFileContent(null);
        setIsWorkspaceMaximized(false);
      }
    }
  };

  // Close full editor pane
  const handleCloseEditor = () => {
    setSelectedFilePath(null);
    setSelectedFileContent(null);
    setOpenTabs([]);
    setIsWorkspaceMaximized(false);
  };

  // Add Custom File In-Memory
  const handleAddCustomFile = (customPath: string, customContent: string) => {
    if (!currentVfs) return;
    currentVfs.applyAction({
      type: 'CREATE',
      path: customPath,
      content: customContent,
    });
    setTree(currentVfs.toTree());
    setFileCount(currentVfs.count());
    handleSelectFile(customPath);
  };

  // Scaffolding Execution Pipeline
  const handleExecuteScaffold = async (cfgToScaffold: ProjectConfig) => {
    setIsGenerating(true);
    setIsComplete(false);
    setLogs([
      `[ForgeStack] Initializing synthesis for project: ${cfgToScaffold.name}...`,
      `[ForgeStack] Target Directory: ${cfgToScaffold.targetPath}`,
      `[ForgeStack] Architecture Topology: ${cfgToScaffold.topology}`,
    ]);

    try {
      const vfs = await generateProjectVfs(cfgToScaffold);
      setLogs((prev) => [
        ...prev,
        `[ForgeStack VFS] Compiled in-memory file system (${vfs.count()} files staged).`,
        `[ForgeStack PRE-FLIGHT] Verifying target directory write permissions...`,
      ]);

      const isTauri =
        typeof window !== 'undefined' &&
        ('__TAURI_INTERNALS__' in window || '__TAURI__' in window);

      if (isTauri) {
        setLogs((prev) => [
          ...prev,
          `[ForgeStack TAURI] Writing files natively via Tauri Rust engine...`,
        ]);
        const { invoke } = await import('@tauri-apps/api/core');
        const files = vfs.getAllFiles().map((f) => ({
          path: f.path,
          content: f.content,
          executable: f.executable,
        }));
        const writtenCount = await invoke<number>('scaffold_project_files', {
          payload: {
            target_path: cfgToScaffold.targetPath,
            files,
            git_init: cfgToScaffold.git,
            run_install: cfgToScaffold.install,
            package_manager: cfgToScaffold.packageManager,
          },
        });
        setLogs((prev) => [
          ...prev,
          `[ForgeStack TAURI] Wrote ${writtenCount} files atomically to ${cfgToScaffold.targetPath}`,
        ]);
      } else {
        setLogs((prev) => [
          ...prev,
          `[ForgeStack FLUSH] Writing files atomically via Vite scaffold API...`,
        ]);
        const response = await fetch('/api/scaffold', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cfgToScaffold),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(
            errData.error || `Scaffolding failed with HTTP status ${response.status}`
          );
        }
        const result = await response.json();
        setLogs((prev) => [
          ...prev,
          `[ForgeStack FLUSH] Wrote ${result.filesWritten} files atomically to ${result.targetPath}`,
        ]);
      }

      setLogs((prev) => [
        ...prev,
        ...(cfgToScaffold.git
          ? ['[ForgeStack GIT] Local git repository initialized & staged.']
          : []),
        ...(cfgToScaffold.install
          ? [`[ForgeStack INSTALL] Dependencies installed via ${cfgToScaffold.packageManager}.`]
          : []),
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

  // Template Lifecycle Handlers
  const handleSaveAsTemplate = (name: string, description: string) => {
    const newTemplate: SavedTemplate = {
      id: `template-${Date.now()}`,
      name,
      description,
      isBuiltIn: false,
      config: { ...config },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveTemplatesToStorage([newTemplate, ...templates]);
  };

  const handleDuplicateTemplate = (templateId: string) => {
    const target = templates.find((t) => t.id === templateId);
    if (!target) return;
    const cloned: SavedTemplate = {
      ...target,
      id: `template-${Date.now()}`,
      name: `${target.name} (Copy)`,
      isBuiltIn: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveTemplatesToStorage([cloned, ...templates]);
  };

  const handleDeleteTemplate = (templateId: string) => {
    saveTemplatesToStorage(templates.filter((t) => t.id !== templateId));
  };

  const handleRenameTemplate = (templateId: string, newName: string) => {
    saveTemplatesToStorage(
      templates.map((t) => (t.id === templateId ? { ...t, name: newName } : t))
    );
  };

  const handleNewStack = () => {
    const userSettings = loadAppSettings();
    setConfig({
      name: 'my-custom-stack',
      targetPath: `${userSettings.defaultTargetPath}/my-custom-stack`,
      topology: 'monorepo',
      frontend: {
        framework: 'react-vite',
        styling: 'tailwind',
        state: 'query',
        icons: 'lucide',
        toast: 'sonner',
        forms: 'rhf-zod',
        dateLib: 'none',
        uiExtras: { toast: true, icons: true, forms: true },
      },
      backend: {
        framework: 'fastify',
        database: 'postgres',
        orm: 'drizzle',
        container: true,
        processManager: 'docker',
      },
      utilities: {
        frontendHelpers: false,
        backendHelpers: false,
      },
      aiGovernance: {
        rules: userSettings.defaultCursorRules,
        claude: true,
        skills: userSettings.defaultAasSkills,
        openSpec: true,
        engine: userSettings.defaultAiEngine,
      },
      packageManager: userSettings.defaultPackageManager,
      git: userSettings.defaultGitInit,
      install: userSettings.defaultAutoInstall,
    });
    navigate('/new');
  };

  const handleEditTemplate = (template: SavedTemplate) => {
    const userSettings = loadAppSettings();
    const base = userSettings.defaultTargetPath || '/home/dev/Documents';
    const rebasedPath = `${base.replace(/\/+$/, '')}/${template.config.name}`;
    setConfig({
      ...template.config,
      targetPath: rebasedPath,
      git: userSettings.defaultGitInit ?? template.config.git,
      install: userSettings.defaultAutoInstall ?? template.config.install,
      packageManager: userSettings.defaultPackageManager || template.config.packageManager,
    });
    navigate('/new');
  };

  // External Action Handlers
  const handleOpenVsCode = async () => {
    try {
      const isTauri =
        typeof window !== 'undefined' &&
        ('__TAURI_INTERNALS__' in window || '__TAURI__' in window);
      if (isTauri) {
        const { invoke } = await import('@tauri-apps/api/core');
        await invoke('open_in_vscode', { path: config.targetPath });
        return;
      }
      const { Command } = await import('@tauri-apps/plugin-shell');
      await Command.create('code', [config.targetPath]).execute();
    } catch {
      alert(`To open in VS Code, run in terminal:\ncode "${config.targetPath}"`);
    }
  };

  const handleOpenFolder = async () => {
    try {
      const isTauri =
        typeof window !== 'undefined' &&
        ('__TAURI_INTERNALS__' in window || '__TAURI__' in window);
      if (isTauri) {
        const { invoke } = await import('@tauri-apps/api/core');
        await invoke('open_in_folder', { path: config.targetPath });
        return;
      }
      const { open } = await import('@tauri-apps/plugin-shell');
      await open(config.targetPath);
    } catch {
      alert(`Target directory located at:\n${config.targetPath}`);
    }
  };

  const handleOpenAntigravity = async () => {
    try {
      const isTauri =
        typeof window !== 'undefined' &&
        ('__TAURI_INTERNALS__' in window || '__TAURI__' in window);
      if (isTauri) {
        const { invoke } = await import('@tauri-apps/api/core');
        await invoke('open_in_vscode', { path: config.targetPath });
        return;
      }
      const { Command } = await import('@tauri-apps/plugin-shell');
      await Command.create('cursor', [config.targetPath]).execute();
    } catch {
      alert(`Project directory ready for Antigravity at:\n${config.targetPath}`);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col font-sans transition-colors selection:bg-orange-500/30 selection:text-white">
      {/* Top Universal Navbar with React Router links */}
      <StudioNavbar
        targetPath={config.targetPath}
        onBrowsePath={() => {
          setBrowseCallback(() => (selected: string) => {
            setConfig((prev) => ({
              ...prev,
              targetPath: selected.endsWith(prev.name) ? selected : `${selected}/${prev.name}`,
            }));
          });
          setIsPathModalOpen(true);
        }}
        onOpenUpdateModal={() => setIsUpdateModalOpen(true)}
        hasUpdate={Boolean(updateDetails?.available)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        <Routes>
          {/* VIEW 1: HOME TEMPLATES DASHBOARD */}
          <Route
            path="/"
            element={
              <HomeTemplatesDashboard
                templates={templates}
                onNewStack={handleNewStack}
                onEditTemplate={handleEditTemplate}
                onFastScaffold={(tpl) => setFastScaffoldTemplate(tpl)}
                onDuplicateTemplate={handleDuplicateTemplate}
                onDeleteTemplate={handleDeleteTemplate}
                onRenameTemplate={handleRenameTemplate}
              />
            }
          />

          {/* VIEW 2: 4-STEP STEPPER STUDIO (/new or /studio) */}
          <Route
            path="/new"
            element={
              <div className="max-w-[1750px] mx-auto p-3 lg:p-5 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  {/* Left Column: 4-Step Progressive Stepper */}
                  <div
                    className={
                      isWorkspaceMaximized
                        ? 'hidden'
                        : selectedFilePath
                        ? 'lg:col-span-5 xl:col-span-4'
                        : 'lg:col-span-7 xl:col-span-7'
                    }
                  >
                    <StepperWizard
                      config={config}
                      fileCount={fileCount}
                      isGenerating={isGenerating}
                      isComplete={isComplete}
                      logs={logs}
                      onChange={setConfig}
                      onBrowseFolder={() => {
                        setBrowseCallback(null);
                        setIsPathModalOpen(true);
                      }}
                      onScaffold={() => handleExecuteScaffold(config)}
                      onSaveAsTemplate={handleSaveAsTemplate}
                      onOpenFolder={handleOpenFolder}
                      onOpenVsCode={handleOpenVsCode}
                      onOpenAntigravity={handleOpenAntigravity}
                      onBackToHome={() => navigate('/')}
                    />
                  </div>

                  {/* Right Column: Integrated VS Code Studio Workspace */}
                  <div
                    className={
                      isWorkspaceMaximized
                        ? 'lg:col-span-12 h-[calc(100vh-85px)] sticky top-16'
                        : selectedFilePath
                        ? 'lg:col-span-7 xl:col-span-8 h-[calc(100vh-85px)] sticky top-16'
                        : 'lg:col-span-5 xl:col-span-5 h-[calc(100vh-85px)] sticky top-16'
                    }
                  >
                    <VsCodeWorkspace
                      tree={tree}
                      filesCount={fileCount}
                      openTabs={openTabs}
                      activeFilePath={selectedFilePath}
                      activeFileContent={selectedFileContent}
                      theme={theme}
                      isMaximized={isWorkspaceMaximized}
                      onSelectFile={handleSelectFile}
                      onCloseTab={handleCloseTab}
                      onRefresh={() => recompileVfs(config)}
                      onAddCustomFile={handleAddCustomFile}
                      onToggleMaximize={() => setIsWorkspaceMaximized(!isWorkspaceMaximized)}
                      onCloseEditor={handleCloseEditor}
                    />
                  </div>
                </div>
              </div>
            }
          />

          <Route
            path="/studio"
            element={<Navigate to="/new" replace />}
          />

          {/* VIEW 3: FAST SCAFFOLD DEDICATED CONSOLE VIEW */}
          <Route
            path="/scaffold"
            element={
              <div className="max-w-[1750px] mx-auto p-3 lg:p-5 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  {/* Left Column: Scaffold Console & Blueprint */}
                  <div
                    className={
                      isWorkspaceMaximized
                        ? 'hidden'
                        : selectedFilePath
                        ? 'lg:col-span-5 xl:col-span-5'
                        : 'lg:col-span-6 xl:col-span-6'
                    }
                  >
                    <ScaffoldConsoleView
                      config={config}
                      fileCount={fileCount}
                      isGenerating={isGenerating}
                      isComplete={isComplete}
                      logs={logs}
                      onOpenFolder={handleOpenFolder}
                      onOpenVsCode={handleOpenVsCode}
                      onOpenAntigravity={handleOpenAntigravity}
                    />
                  </div>

                  {/* Right Column: Integrated VS Code Studio Workspace */}
                  <div
                    className={
                      isWorkspaceMaximized
                        ? 'lg:col-span-12 h-[calc(100vh-85px)] sticky top-16'
                        : selectedFilePath
                        ? 'lg:col-span-7 xl:col-span-7 h-[calc(100vh-85px)] sticky top-16'
                        : 'lg:col-span-6 xl:col-span-6 h-[calc(100vh-85px)] sticky top-16'
                    }
                  >
                    <VsCodeWorkspace
                      tree={tree}
                      filesCount={fileCount}
                      openTabs={openTabs}
                      activeFilePath={selectedFilePath}
                      activeFileContent={selectedFileContent}
                      theme={theme}
                      isMaximized={isWorkspaceMaximized}
                      onSelectFile={handleSelectFile}
                      onCloseTab={handleCloseTab}
                      onRefresh={() => recompileVfs(config)}
                      onAddCustomFile={handleAddCustomFile}
                      onToggleMaximize={() => setIsWorkspaceMaximized(!isWorkspaceMaximized)}
                      onCloseEditor={handleCloseEditor}
                    />
                  </div>
                </div>
              </div>
            }
          />

          {/* VIEW 4: APP SETTINGS PAGE */}
          <Route
            path="/settings"
            element={
              <AppSettingsPage
                currentTheme={theme}
                onThemeChange={setTheme}
                onBrowseFolder={(callback) => {
                  setBrowseCallback(() => callback);
                  setIsPathModalOpen(true);
                }}
                onCheckForUpdates={handleManualCheckUpdate}
                onSimulateUpdate={handleSimulateUpdate}
                isCheckingUpdate={isCheckingUpdate}
                appEnv={appEnv}
                updateDetails={updateDetails}
              />
            }
          />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Fast Scaffold Modal */}
      <FastScaffoldModal
        isOpen={Boolean(fastScaffoldTemplate)}
        template={fastScaffoldTemplate}
        onClose={() => setFastScaffoldTemplate(null)}
        onScaffold={(runConfig: ProjectConfig) => {
          setConfig(runConfig);
          handleExecuteScaffold(runConfig);
          navigate('/scaffold');
        }}
        onBrowseFolder={(_curPath: string, onSelect: (p: string) => void) => {
          setBrowseCallback(() => onSelect);
          setIsPathModalOpen(true);
        }}
      />

      {/* Directory Browser Modal */}
      <PathSelectorModal
        isOpen={isPathModalOpen}
        currentPath={config.targetPath}
        projectName={browseCallback ? '' : config.name}
        onSelectPath={(selected: string) => {
          if (browseCallback) {
            browseCallback(selected);
          } else {
            setConfig((prev) => ({
              ...prev,
              targetPath: selected.endsWith(prev.name) ? selected : `${selected}/${prev.name}`,
            }));
          }
          setIsPathModalOpen(false);
          setBrowseCallback(null);
        }}
        onClose={() => {
          setIsPathModalOpen(false);
          setBrowseCallback(null);
        }}
      />

      {/* Software Update Notification & Installation Modal */}
      <UpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        updateDetails={updateDetails}
        isChecking={isCheckingUpdate}
      />
    </div>
  );
}

export function App() {
  return (
    <HashRouter>
      <ForgeStackAppContent />
    </HashRouter>
  );
}
export default App;
