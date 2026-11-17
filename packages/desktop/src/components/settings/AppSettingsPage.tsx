import React, { useState, useEffect } from 'react';
import {
  Moon,
  Sun,
  Terminal,
  Sparkles,
  FolderOpen,
  Package,
  GitBranch,
  DownloadCloud,
  ShieldCheck,
  RotateCcw,
  Check,
  Info,
  Sliders,
  Palette,
  HardDrive,
  Cpu,
} from 'lucide-react';
import type { ThemeId } from '../wizard/Header.js';

export interface AppSettings {
  defaultTargetPath: string;
  defaultPackageManager: 'pnpm' | 'npm' | 'yarn' | 'bun';
  defaultGitInit: boolean;
  defaultAutoInstall: boolean;
  defaultAiEngine: 'openspec' | 'gsd' | 'speckit' | 'all';
  defaultCursorRules: boolean;
  defaultAasSkills: boolean;
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  defaultTargetPath: '/home/dev/Documents',
  defaultPackageManager: 'pnpm',
  defaultGitInit: true,
  defaultAutoInstall: true,
  defaultAiEngine: 'openspec',
  defaultCursorRules: true,
  defaultAasSkills: true,
};

const SETTINGS_KEY = 'forgestack-settings';

export function loadAppSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      return { ...DEFAULT_APP_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {
    // Fallback
  }
  return DEFAULT_APP_SETTINGS;
}

export function saveAppSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

interface Props {
  currentTheme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
  onBrowseFolder: (onSelect: (path: string) => void) => void;
}

export const AppSettingsPage: React.FC<Props> = ({
  currentTheme,
  onThemeChange,
  onBrowseFolder,
}) => {
  const [settings, setSettings] = useState<AppSettings>(() => loadAppSettings());
  const [savedBanner, setSavedBanner] = useState(false);

  useEffect(() => {
    saveAppSettings(settings);
  }, [settings]);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: value };
      saveAppSettings(updated);
      return updated;
    });
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2000);
  };

  const handleResetDefaults = () => {
    if (confirm('Reset all ForgeStack settings to factory defaults?')) {
      setSettings(DEFAULT_APP_SETTINGS);
      saveAppSettings(DEFAULT_APP_SETTINGS);
      onThemeChange('theme-dark');
      setSavedBanner(true);
      setTimeout(() => setSavedBanner(false), 2000);
    }
  };

  const themes: { id: ThemeId; label: string; desc: string; icon: React.ReactNode; previewBg: string; previewBorder: string; previewAccent: string }[] = [
    {
      id: 'theme-dark',
      label: 'Dark Zinc',
      desc: 'Industry standard zinc neutral palette for developer focus.',
      icon: <Moon className="w-4 h-4 text-zinc-300" />,
      previewBg: 'bg-[#09090b]',
      previewBorder: 'border-zinc-800',
      previewAccent: 'bg-blue-500',
    },
    {
      id: 'theme-midnight',
      label: 'Midnight Cyber',
      desc: 'Deep oceanic blue nebula with neon cyan electrical accents.',
      icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
      previewBg: 'bg-[#050816]',
      previewBorder: 'border-blue-950',
      previewAccent: 'bg-cyan-400',
    },
    {
      id: 'theme-matrix',
      label: 'Matrix Terminal',
      desc: 'High-contrast phosphor green CRT aesthetics for shell purists.',
      icon: <Terminal className="w-4 h-4 text-emerald-400" />,
      previewBg: 'bg-[#020d04]',
      previewBorder: 'border-emerald-950',
      previewAccent: 'bg-emerald-400',
    },
    {
      id: 'theme-light',
      label: 'Clean Light',
      desc: 'Daylight high-contrast daylight palette with crisp typographic clarity.',
      icon: <Sun className="w-4 h-4 text-amber-500" />,
      previewBg: 'bg-[#f8fafc]',
      previewBorder: 'border-slate-300',
      previewAccent: 'bg-blue-600',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-150">
      {/* Page Title & Save Indicator */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--text-main)] flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-blue-500" />
            <span>Studio App Settings</span>
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Configure visual appearance, target scaffolding directories, and AI governance defaults.
          </p>
        </div>

        {savedBanner && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono animate-in fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>Saved to local storage</span>
          </div>
        )}
      </div>

      {/* SECTION 1: APPEARANCE & THEMES */}
      <div className="ui-panel rounded-2xl p-6 space-y-5 border">
        <div className="flex items-center gap-2 text-blue-500">
          <Palette className="w-4 h-4" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--text-main)]">
            Appearance & Visual Theme
          </h3>
        </div>
        <p className="text-xs text-[var(--text-muted)]">
          Select your environment palette. Changes persist across application restarts.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {themes.map((th) => (
            <div
              key={th.id}
              onClick={() => onThemeChange(th.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all space-y-3 ${
                currentTheme === th.id
                  ? 'ui-active-ring font-medium shadow-md'
                  : 'ui-card-subtle opacity-75 hover:opacity-100 hover:border-[var(--border-hover)]'
              }`}
            >
              {/* Theme Mock Palette Swatch */}
              <div className={`h-16 rounded-lg ${th.previewBg} ${th.previewBorder} border p-2 flex flex-col justify-between`}>
                <div className="flex items-center justify-between">
                  <div className={`w-3 h-3 rounded-full ${th.previewAccent}`} />
                  {currentTheme === th.id && (
                    <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <div className="w-8 h-1.5 rounded-full bg-slate-500/30" />
                  <div className="w-4 h-1.5 rounded-full bg-slate-500/30" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 font-bold text-xs text-[var(--text-main)]">
                  {th.icon}
                  <span>{th.label}</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] mt-1 leading-snug">
                  {th.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: SCAFFOLDING & ENVIRONMENT DEFAULTS */}
      <div className="ui-panel rounded-2xl p-6 space-y-5 border">
        <div className="flex items-center gap-2 text-emerald-500">
          <HardDrive className="w-4 h-4" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--text-main)]">
            Default Paths & Package Manager
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Target Directory */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--text-main)] block">
              Default Destination Path
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={settings.defaultTargetPath}
                onChange={(e) => updateSetting('defaultTargetPath', e.target.value)}
                className="flex-1 px-3 py-2 ui-input rounded-xl text-xs font-mono"
                placeholder="/home/dev/Documents"
              />
              <button
                type="button"
                onClick={() =>
                  onBrowseFolder((selected) => updateSetting('defaultTargetPath', selected))
                }
                className="px-3 py-2 rounded-xl ui-card-subtle border text-xs font-medium hover:ui-panel cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <FolderOpen className="w-3.5 h-3.5 text-blue-500" />
                <span>Browse</span>
              </button>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              Base folder where newly synthesized stacks will be mounted by default.
            </p>
          </div>

          {/* Package Manager */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--text-main)] block">
              Default Package Manager
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['pnpm', 'npm', 'bun', 'yarn'] as const).map((pm) => (
                <button
                  key={pm}
                  type="button"
                  onClick={() => updateSetting('defaultPackageManager', pm)}
                  className={`py-2 px-3 rounded-xl border text-xs font-mono text-center cursor-pointer transition-all ${
                    settings.defaultPackageManager === pm
                      ? 'ui-active-ring font-bold'
                      : 'ui-card-subtle opacity-75 hover:opacity-100'
                  }`}
                >
                  {pm}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              pnpm is strictly recommended for workspaces, monorepos, and atomic disk caching.
            </p>
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
          <label className="flex items-center gap-3 p-3 rounded-xl ui-card-subtle border cursor-pointer">
            <input
              type="checkbox"
              checked={settings.defaultGitInit}
              onChange={(e) => updateSetting('defaultGitInit', e.target.checked)}
              className="rounded accent-blue-600"
            />
            <div>
              <span className="text-xs font-semibold text-[var(--text-main)] block">
                Initialize Git Repository by Default
              </span>
              <span className="text-[11px] text-[var(--text-muted)]">
                Runs git init and crafts a clean initial commit on scaffold.
              </span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl ui-card-subtle border cursor-pointer">
            <input
              type="checkbox"
              checked={settings.defaultAutoInstall}
              onChange={(e) => updateSetting('defaultAutoInstall', e.target.checked)}
              className="rounded accent-blue-600"
            />
            <div>
              <span className="text-xs font-semibold text-[var(--text-main)] block">
                Auto-Install Dependencies on Scaffold
              </span>
              <span className="text-[11px] text-[var(--text-muted)]">
                Invokes package manager install pipeline immediately upon flushing files.
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* SECTION 3: AI GOVERNANCE DEFAULTS */}
      <div className="ui-panel rounded-2xl p-6 space-y-5 border">
        <div className="flex items-center gap-2 text-indigo-500">
          <ShieldCheck className="w-4 h-4" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--text-main)]">
            AI Governance & Specification Engine Defaults
          </h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--text-main)] block">
              Default Specification & Task Orchestration Engine
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'openspec',
                  label: 'OpenSpec Governance',
                  desc: 'Full specification sync with proposed delta tasks & behavioral checks.',
                },
                {
                  id: 'gsd',
                  label: 'Open-GSD (gsd-core)',
                  desc: 'PROJECT.md, REQUIREMENTS.md, and continuous task state machine.',
                },
                {
                  id: 'speckit',
                  label: 'GitHub Spec-Kit',
                  desc: 'Spec-first constitution, feature templates, and task runner prompts.',
                },
              ].map((eng) => (
                <div
                  key={eng.id}
                  onClick={() => updateSetting('defaultAiEngine', eng.id as any)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-1.5 ${
                    settings.defaultAiEngine === eng.id
                      ? 'ui-active-ring font-semibold'
                      : 'ui-card-subtle opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-[var(--text-main)]">
                    <span>{eng.label}</span>
                    {settings.defaultAiEngine === eng.id && (
                      <Check className="w-3.5 h-3.5 text-blue-500" />
                    )}
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
                    {eng.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
            <label className="flex items-center gap-3 p-3 rounded-xl ui-card-subtle border cursor-pointer">
              <input
                type="checkbox"
                checked={settings.defaultCursorRules}
                onChange={(e) => updateSetting('defaultCursorRules', e.target.checked)}
                className="rounded accent-blue-600"
              />
              <div>
                <span className="text-xs font-semibold text-[var(--text-main)] block">
                  Cursor & Copilot Architecture Rules
                </span>
                <span className="text-[11px] text-[var(--text-muted)]">
                  Stages .cursor/rules/*.mdc enforcing strict TypeScript and layer isolation.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl ui-card-subtle border cursor-pointer">
              <input
                type="checkbox"
                checked={settings.defaultAasSkills}
                onChange={(e) => updateSetting('defaultAasSkills', e.target.checked)}
                className="rounded accent-blue-600"
              />
              <div>
                <span className="text-xs font-semibold text-[var(--text-main)] block">
                  Agentic Awesome Skills (17 Playbooks)
                </span>
                <span className="text-[11px] text-[var(--text-muted)]">
                  Stages clean-code-guard, react-patterns, anti-ui-slop, and accessibility audits.
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* SECTION 4: ABOUT & RESET */}
      <div className="ui-panel rounded-2xl p-6 space-y-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--text-main)]">
              ForgeStack Enterprise Studio v1.2.0
            </h4>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Built with In-Memory Virtual File System (VFS), AST Compositor, and Day-One AI Governance.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetDefaults}
          className="px-4 py-2 rounded-xl ui-card-subtle border text-xs font-medium text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>
    </div>
  );
};
