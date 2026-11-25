import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { FilePlus2, FolderTree, LayoutList, Moon, Play, Settings2, SlidersHorizontal, Sun } from 'lucide-react';
import { generateProjectVfs, type ProjectConfig, type TreeNode, type VirtualFileSystem } from '@forgestk/core/browser';
import { useTheme } from './theme.js';
import { AppShell } from './components/layout/AppShell.js';
import { CommandPalette, type PaletteCommand } from './components/layout/CommandPalette.js';
import { HomeTemplatesDashboard } from './components/home/HomeTemplatesDashboard.js';
import { FastScaffoldModal } from './components/home/FastScaffoldModal.js';
import { StudioView } from './components/studio/StudioView.js';
import { PathSelectorModal } from './components/wizard/PathSelectorModal.js';
import { AppSettingsPage, loadAppSettings } from './components/settings/AppSettingsPage.js';
import { UpdateModal } from './components/updater/UpdateModal.js';
import { log, type LogLine, type Phase } from './components/studio/run-types.js';
import { checkForUpdates, getAppEnvironment, isTauri, type AppEnvironment, type UpdateDetails } from './services/updaterService.js';
import { BUILTIN_TEMPLATES, type SavedTemplate } from './types/template.js';
import { archetypeOf } from './data/catalog.js';

function defaultConfig(name: string): ProjectConfig {
  const s = loadAppSettings();
  return {
    name,
    targetPath: `${s.defaultTargetPath.replace(/\/+$/, '')}/${name}`,
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
    backend: { framework: 'fastify', database: 'postgres', orm: 'drizzle', container: true, processManager: 'docker' },
    utilities: { frontendHelpers: false, backendHelpers: false },
    aiGovernance: {
      rules: s.defaultCursorRules,
      claude: true,
      skills: s.defaultAasSkills,
      openSpec: true,
      engine: s.defaultAiEngine,
    },
    packageManager: s.defaultPackageManager,
    git: s.defaultGitInit,
    install: s.defaultAutoInstall,
  };
}

const openWith = async (cmd: 'open_in_vscode' | 'open_in_folder', path: string, fallback: string) => {
  try {
    if (isTauri()) {
      const { invoke } = await import('@tauri-apps/api/core');
      await invoke(cmd, { path });
      return;
    }
  } catch {
    // fall through
  }
  alert(fallback);
};

function ForgeStackAppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, preference, setPreference, toggle: toggleTheme } = useTheme();

  /* Templates (localStorage, with built-ins as fallback) */
  const [templates, setTemplates] = useState<SavedTemplate[]>(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem('forgestack-templates') ?? 'null');
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // ignore
    }
    return BUILTIN_TEMPLATES;
  });
  const saveTemplates = (updated: SavedTemplate[]) => {
    setTemplates(updated);
    try {
      localStorage.setItem('forgestack-templates', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  /* Updates */
  const [appEnv, setAppEnv] = useState<AppEnvironment | null>(null);
  const [updateDetails, setUpdateDetails] = useState<UpdateDetails | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);

  useEffect(() => {
    getAppEnvironment().then(setAppEnv);
    checkForUpdates(false).then((d) => d && setUpdateDetails(d));
  }, []);

  const handleManualCheckUpdate = async () => {
    setIsCheckingUpdate(true);
    setIsUpdateModalOpen(true);
    try {
      setUpdateDetails(await checkForUpdates(true));
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  const handleSimulateUpdate = () => {
    const isAppImage = appEnv?.is_appimage ?? false;
    setUpdateDetails({
      available: true,
      currentVersion: appEnv?.current_version || __APP_VERSION__,
      newVersion: '1.1.0',
      releaseNotes: `### ForgeStack Studio 1.1.0\n\n- SvelteKit and Remix adapters\n- Dependency conflict resolver\n- Faster file tree compilation`,
      releaseDate: new Date().toISOString(),
      supportsInPlace: isAppImage,
      isDebOrSystem: (appEnv?.is_deb_or_system ?? false) || !isAppImage,
      platform: appEnv?.platform || 'linux',
      downloadUrl: 'https://github.com/umesh-saini/forgestack/releases/tag/v1.1.0',
      debDownloadUrl: 'https://github.com/umesh-saini/forgestack/releases/download/v1.1.0/ForgeStack_1.1.0_amd64.deb',
    });
    setIsUpdateModalOpen(true);
  };

  /* Active configuration and its in-memory file tree */
  const [config, setConfig] = useState<ProjectConfig>(() => defaultConfig('enterprise-app'));
  const [currentVfs, setCurrentVfs] = useState<VirtualFileSystem | null>(null);
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [fileCount, setFileCount] = useState(0);
  const [compileState, setCompileState] = useState<'ready' | 'updating' | 'error'>('updating');
  const [compileError, setCompileError] = useState<string | null>(null);

  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [selectedFileContent, setSelectedFileContent] = useState<string | null>(null);
  const selectedRef = useRef<string | null>(null);
  selectedRef.current = selectedFilePath;
  const [isWorkspaceMaximized, setIsWorkspaceMaximized] = useState(false);

  const [isPathModalOpen, setIsPathModalOpen] = useState(false);
  const [browseCallback, setBrowseCallback] = useState<((p: string) => void) | null>(null);
  const [fastScaffoldTemplate, setFastScaffoldTemplate] = useState<SavedTemplate | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);

  /* Run state */
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);

  const recompileVfs = useCallback(async (cfg: ProjectConfig) => {
    setCompileState('updating');
    try {
      const vfs = await generateProjectVfs(cfg);
      setCurrentVfs(vfs);
      setTree(vfs.toTree());
      setFileCount(vfs.count());
      setCompileState('ready');
      setCompileError(null);
      const sel = selectedRef.current;
      if (sel) {
        const file = vfs.getFile(sel);
        setSelectedFileContent(file ? file.content : null);
      }
    } catch (err) {
      // Keep the previous tree visible; report why this combination is invalid.
      setCompileState('error');
      setCompileError(err instanceof Error ? err.message.replace(/^Invalid combination:\s*/, '') : String(err));
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => recompileVfs(config), 60);
    return () => clearTimeout(t);
  }, [config, recompileVfs]);

  const handleSelectFile = (filePath: string) => {
    const file = currentVfs?.getFile(filePath);
    if (!file) return;
    setOpenTabs((prev) => (prev.includes(filePath) ? prev : [...prev, filePath]));
    setSelectedFilePath(filePath);
    setSelectedFileContent(file.content);
  };

  const handleCloseTab = (filePath: string) => {
    const next = openTabs.filter((p) => p !== filePath);
    setOpenTabs(next);
    if (selectedFilePath === filePath) {
      const last = next[next.length - 1] ?? null;
      setSelectedFilePath(last);
      setSelectedFileContent(last ? (currentVfs?.getFile(last)?.content ?? null) : null);
    }
  };

  const handleAddCustomFile = (path: string, content: string) => {
    if (!currentVfs) return;
    currentVfs.applyAction({ type: 'CREATE', path, content });
    setTree(currentVfs.toTree());
    setFileCount(currentVfs.count());
    handleSelectFile(path);
  };

  const setPhase = (id: string, patch: Partial<Phase>) => setPhases((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const addLog = (...lines: LogLine[]) => setLogs((prev) => [...prev, ...lines]);

  const handleExecuteScaffold = async (cfg: ProjectConfig) => {
    const native = isTauri();
    setIsGenerating(true);
    setIsComplete(false);
    setLogs([log('config', `${cfg.name}: ${archetypeOf(cfg.topology).title}`, 'muted'), log('config', `destination ${cfg.targetPath}`, 'muted')]);
    setPhases(
      native
        ? [
            { id: 'compile', label: 'Compile file tree', status: 'running' },
            { id: 'write', label: 'Write files to disk', detail: cfg.targetPath, status: 'pending' },
            ...(cfg.git ? [{ id: 'git', label: 'Initialize git repository', status: 'pending' as const }] : []),
            ...(cfg.install ? [{ id: 'install', label: `Install dependencies with ${cfg.packageManager}`, status: 'pending' as const }] : []),
          ]
        : [
            { id: 'compile', label: 'Compile file tree', status: 'running' },
            { id: 'zip', label: 'Package ZIP archive', status: 'pending' },
            { id: 'download', label: 'Download', detail: `${cfg.name}.zip`, status: 'pending' },
          ],
    );

    let current = 'compile';
    try {
      const vfs = await generateProjectVfs(cfg);
      addLog(log('vfs', `compiled ${vfs.count()} files in memory`));
      setPhase('compile', { status: 'done', detail: `${vfs.count()} files` });

      if (native) {
        current = 'write';
        setPhase('write', { status: 'running' });
        if (cfg.git) setPhase('git', { status: 'running' });
        if (cfg.install) setPhase('install', { status: 'running' });
        addLog(log('write', `writing to ${cfg.targetPath}`));
        const { invoke } = await import('@tauri-apps/api/core');
        const written = await invoke<number>('scaffold_project_files', {
          payload: {
            target_path: cfg.targetPath,
            files: vfs.getAllFiles().map((f) => ({ path: f.path, content: f.content, executable: f.executable })),
            git_init: cfg.git,
            run_install: cfg.install,
            package_manager: cfg.packageManager,
          },
        });
        addLog(log('write', `wrote ${written} files`, 'ok'));
        setPhase('write', { status: 'done', detail: `${written} files in ${cfg.targetPath}` });
        if (cfg.git) {
          addLog(log('git', 'initialized repository and created first commit', 'ok'));
          setPhase('git', { status: 'done' });
        }
        if (cfg.install) {
          addLog(log('install', `${cfg.packageManager} install finished`, 'ok'));
          setPhase('install', { status: 'done' });
        }
      } else {
        current = 'zip';
        setPhase('zip', { status: 'running' });
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();
        for (const file of vfs.getAllFiles()) zip.file(file.path.replace(/^\/+/, ''), file.content);
        const blob = await zip.generateAsync({ type: 'blob' });
        const kb = (blob.size / 1024).toFixed(1);
        addLog(log('zip', `${cfg.name}.zip, ${kb} KB, ${vfs.count()} files`));
        setPhase('zip', { status: 'done', detail: `${kb} KB` });

        current = 'download';
        setPhase('download', { status: 'running' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${cfg.name}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        addLog(
          log('download', `${cfg.name}.zip saved by the browser`, 'ok'),
          log('note', 'writing to disk, git init and install need the desktop app or the CLI', 'muted'),
        );
        setPhase('download', { status: 'done' });
      }
      setIsComplete(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      addLog(log('error', message, 'error'));
      setPhase(current, { status: 'error', detail: message });
      setIsComplete(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetRun = () => {
    setIsComplete(false);
    setPhases([]);
  };

  /* Template lifecycle */
  const handleSaveAsTemplate = (name: string, description: string) => {
    const now = new Date().toISOString();
    saveTemplates([{ id: `template-${Date.now()}`, name, description, isBuiltIn: false, config: { ...config }, createdAt: now, updatedAt: now }, ...templates]);
  };
  const handleDuplicateTemplate = (id: string) => {
    const t = templates.find((x) => x.id === id);
    if (!t) return;
    const now = new Date().toISOString();
    saveTemplates([{ ...t, id: `template-${Date.now()}`, name: `${t.name} copy`, isBuiltIn: false, createdAt: now, updatedAt: now }, ...templates]);
  };
  const handleDeleteTemplate = (id: string) => saveTemplates(templates.filter((t) => t.id !== id));
  const handleRenameTemplate = (id: string, name: string) =>
    saveTemplates(templates.map((t) => (t.id === id ? { ...t, name, updatedAt: new Date().toISOString() } : t)));

  const handleNewStack = () => {
    resetRun();
    setConfig(defaultConfig('my-app'));
    navigate('/new');
  };

  const handleEditTemplate = (template: SavedTemplate) => {
    const s = loadAppSettings();
    resetRun();
    setConfig({
      ...template.config,
      targetPath: `${(s.defaultTargetPath || '/home/dev/Documents').replace(/\/+$/, '')}/${template.config.name}`,
      git: s.defaultGitInit ?? template.config.git,
      install: s.defaultAutoInstall ?? template.config.install,
      packageManager: s.defaultPackageManager || template.config.packageManager,
    });
    navigate('/new');
  };

  const openBrowse = (cb: ((p: string) => void) | null) => {
    setBrowseCallback(() => cb);
    setIsPathModalOpen(true);
  };

  /* Command palette */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const commands = useMemo<PaletteCommand[]>(
    () => [
      { id: 'go-hub', group: 'Go to', title: 'Templates', icon: <LayoutList className="w-4 h-4" />, run: () => navigate('/hub') },
      { id: 'go-new', group: 'Go to', title: 'Current project', icon: <FolderTree className="w-4 h-4" />, run: () => navigate('/new') },
      { id: 'go-settings', group: 'Go to', title: 'Settings', icon: <Settings2 className="w-4 h-4" />, run: () => navigate('/settings') },
      { id: 'new', group: 'Actions', title: 'New project from defaults', icon: <FilePlus2 className="w-4 h-4" />, run: handleNewStack },
      {
        id: 'theme',
        group: 'Actions',
        title: theme === 'theme-dark' ? 'Switch to light theme' : 'Switch to dark theme',
        icon: theme === 'theme-dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />,
        run: toggleTheme,
      },
      ...templates.flatMap((t) => [
        {
          id: `edit-${t.id}`,
          group: 'Customize template',
          title: t.name,
          hint: archetypeOf(t.config.topology).title,
          icon: <SlidersHorizontal className="w-4 h-4" />,
          run: () => handleEditTemplate(t),
        },
        {
          id: `run-${t.id}`,
          group: 'Quick scaffold',
          title: t.name,
          hint: t.config.name,
          icon: <Play className="w-3.5 h-3.5" />,
          run: () => setFastScaffoldTemplate(t),
        },
      ]),
    ],
    [templates, theme],
  );

  const studioProps = {
    config,
    theme,
    tree,
    fileCount,
    compileState,
    compileError,
    logs,
    phases,
    isGenerating,
    isComplete,
    openTabs,
    activePath: selectedFilePath,
    activeContent: selectedFileContent,
    isMaximized: isWorkspaceMaximized,
    onToggleMaximize: () => setIsWorkspaceMaximized((m) => !m),
    onChange: setConfig,
    onBrowseFolder: () => openBrowse(null),
    onScaffold: () => handleExecuteScaffold(config),
    onResetRun: resetRun,
    onSaveAsTemplate: handleSaveAsTemplate,
    onOpenFolder: () => openWith('open_in_folder', config.targetPath, `Project folder:\n${config.targetPath}`),
    onOpenVsCode: () => openWith('open_in_vscode', config.targetPath, `Open it with:\ncode "${config.targetPath}"`),
    onSelectFile: handleSelectFile,
    onCloseTab: handleCloseTab,
    onAddCustomFile: handleAddCustomFile,
  };

  const hubProps = {
    templates,
    onNewStack: handleNewStack,
    onEditTemplate: handleEditTemplate,
    onFastScaffold: setFastScaffoldTemplate,
    onDuplicateTemplate: handleDuplicateTemplate,
    onDeleteTemplate: handleDeleteTemplate,
    onRenameTemplate: handleRenameTemplate,
  };

  // /new and /scaffold share one surface, so switching between them must not re-animate it.
  const routeKey = ['/new', '/studio', '/scaffold'].includes(location.pathname) ? 'studio' : location.pathname;

  return (
    <AppShell
      theme={theme}
      onToggleTheme={toggleTheme}
      onOpenPalette={() => setPaletteOpen(true)}
      update={updateDetails?.available ? { version: updateDetails.newVersion } : null}
      onOpenUpdate={() => setIsUpdateModalOpen(true)}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={routeKey}
          className="absolute inset-0"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <Routes location={location}>
            <Route path="/" element={<HomeTemplatesDashboard {...hubProps} />} />
            <Route path="/hub" element={<HomeTemplatesDashboard {...hubProps} />} />
            <Route path="/templates" element={<Navigate to="/hub" replace />} />
            <Route path="/new" element={<StudioView mode="configure" {...studioProps} />} />
            <Route path="/studio" element={<Navigate to="/new" replace />} />
            <Route path="/scaffold" element={<StudioView mode="run" {...studioProps} />} />
            <Route
              path="/settings"
              element={
                <AppSettingsPage
                  themePreference={preference}
                  onThemePreferenceChange={setPreference}
                  onBrowseFolder={(cb) => openBrowse(cb)}
                  onCheckForUpdates={handleManualCheckUpdate}
                  onSimulateUpdate={handleSimulateUpdate}
                  isCheckingUpdate={isCheckingUpdate}
                  appEnv={appEnv}
                  updateDetails={updateDetails}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} commands={commands} />

      <FastScaffoldModal
        isOpen={Boolean(fastScaffoldTemplate)}
        template={fastScaffoldTemplate}
        onClose={() => setFastScaffoldTemplate(null)}
        onScaffold={(runConfig) => {
          setConfig(runConfig);
          handleExecuteScaffold(runConfig);
          navigate('/scaffold');
        }}
        onBrowseFolder={(_cur, onSelect) => openBrowse(onSelect)}
      />

      <PathSelectorModal
        isOpen={isPathModalOpen}
        currentPath={config.targetPath}
        projectName={browseCallback ? '' : config.name}
        onSelectPath={(selected) => {
          if (browseCallback) browseCallback(selected);
          else setConfig((prev) => ({ ...prev, targetPath: selected.endsWith(prev.name) ? selected : `${selected}/${prev.name}` }));
          setIsPathModalOpen(false);
          setBrowseCallback(null);
        }}
        onClose={() => {
          setIsPathModalOpen(false);
          setBrowseCallback(null);
        }}
      />

      <UpdateModal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} updateDetails={updateDetails} isChecking={isCheckingUpdate} />
    </AppShell>
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
