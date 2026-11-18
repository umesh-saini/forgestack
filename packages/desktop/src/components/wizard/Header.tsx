import React from 'react';
import {
  Database,
  Layers,
  Monitor,
  Moon,
  Play,
  Rocket,
  Server,
  Sparkles,
  Sun,
  Terminal,
} from 'lucide-react';
import type { ProjectConfig } from '@forgestack/core/browser';

export type ThemeId = 'theme-dark' | 'theme-midnight' | 'theme-matrix' | 'theme-light';

interface Props {
  config: ProjectConfig;
  fileCount: number;
  isGenerating: boolean;
  theme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
  onApplyPreset: (presetKey: 'monorepo' | 'separate' | 'spa' | 'fastify-api' | 'mongo-api') => void;
  onScaffold: () => void;
}

export const Header: React.FC<Props> = ({
  config,
  fileCount,
  isGenerating,
  theme,
  onThemeChange,
  onApplyPreset,
  onScaffold,
}) => {
  const themeOptions: { id: ThemeId; label: string; icon: React.ReactNode }[] = [
    { id: 'theme-dark', label: 'Dark', icon: <Moon className="w-3.5 h-3.5" /> },
    { id: 'theme-midnight', label: 'Midnight', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'theme-matrix', label: 'Matrix', icon: <Terminal className="w-3.5 h-3.5" /> },
    { id: 'theme-light', label: 'Light', icon: <Sun className="w-3.5 h-3.5" /> },
  ];

  const presets: { id: 'monorepo' | 'separate' | 'spa' | 'fastify-api' | 'mongo-api'; label: string; icon: React.ReactNode }[] = [
    { id: 'monorepo', label: 'Monorepo', icon: <Rocket className="w-3.5 h-3.5 text-orange-500" /> },
    { id: 'separate', label: 'Polyrepo', icon: <Layers className="w-3.5 h-3.5 text-emerald-500" /> },
    { id: 'spa', label: 'SPA', icon: <Monitor className="w-3.5 h-3.5 text-cyan-500" /> },
    { id: 'fastify-api', label: 'Fastify API', icon: <Server className="w-3.5 h-3.5 text-purple-500" /> },
    { id: 'mongo-api', label: 'Mongo API', icon: <Database className="w-3.5 h-3.5 text-amber-500" /> },
  ];

  return (
    <header className="ui-panel px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-40 transition-colors shadow-sm">
      {/* Brand & Stack Badges */}
      <div className="flex items-center gap-3">
        <img
          src="/app-icon.svg"
          alt="ForgeStack"
          className="w-9 h-9 rounded-xl shadow-md shadow-orange-500/25 object-contain"
        />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-sm tracking-tight flex items-center gap-2">
              ForgeStack Studio
            </h1>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ui-card-subtle opacity-90 border">
              v1.0.0
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5 text-[11px] opacity-80 flex-wrap">
            <span className="font-semibold text-orange-500">
              {config.topology === 'monorepo'
                ? 'Monorepo (Turborepo)'
                : config.topology === 'separate-folders'
                ? 'Polyrepo (frontend/ & backend/)'
                : config.topology === 'micro-frontend'
                ? 'Micro-Frontend'
                : config.topology === 'standalone-fe'
                ? 'Frontend SPA'
                : 'Backend API'}
            </span>
            <span>•</span>
            {config.frontend.framework !== 'none' && (
              <span className="font-mono text-cyan-500">
                React 19 + {config.frontend.styling}
              </span>
            )}
            {config.frontend.framework !== 'none' && config.backend.framework !== 'none' && (
              <span>•</span>
            )}
            {config.backend.framework !== 'none' && (
              <span className="font-mono text-purple-500">
                {config.backend.framework} + {config.backend.database} ({config.backend.orm})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Preset Shortcuts, Theme Switcher & Primary Action */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Presets */}
        <div className="hidden lg:flex items-center rounded-xl ui-card-subtle p-0.5 border">
          <span className="text-[10px] uppercase font-mono opacity-50 px-2">
            Presets:
          </span>
          {presets.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onApplyPreset(p.id)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer flex items-center gap-1.5"
            >
              {p.icon}
              <span>{p.label}</span>
            </button>
          ))}
        </div>

        {/* Theme Switcher Segmented Control */}
        <div className="flex items-center rounded-xl ui-card-subtle p-0.5 border">
          {themeOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onThemeChange(opt.id)}
              title={opt.label}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                theme === opt.id
                  ? 'bg-orange-600 text-white font-semibold shadow-sm'
                  : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {opt.icon}
              <span className="hidden xl:inline text-[11px]">{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Primary Scaffold CTA */}
        <button
          type="button"
          onClick={onScaffold}
          disabled={isGenerating}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-500 hover:to-amber-500 disabled:opacity-50 text-white font-semibold text-xs shadow-md shadow-orange-600/30 ring-1 ring-white/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          {isGenerating ? (
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-white" />
          )}
          <span>{isGenerating ? 'Synthesizing...' : 'Scaffold Project'}</span>
          <span className="ml-1 px-1.5 py-0.5 rounded bg-black/25 text-[10px] font-mono">
            {fileCount} files
          </span>
        </button>
      </div>
    </header>
  );
};
