import React from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Code2,
  FolderOpen,
  Layers,
  Sliders,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ProjectConfig } from '@forgestack/core/browser';
import { ExecutionConsole } from '../console/ExecutionConsole.js';

interface Props {
  config: ProjectConfig;
  fileCount: number;
  isGenerating: boolean;
  isComplete: boolean;
  logs: string[];
  onOpenFolder: () => void;
  onOpenVsCode: () => void;
  onOpenAntigravity?: () => void;
  onStartDevStack?: () => void;
}

export const ScaffoldConsoleView: React.FC<Props> = ({
  config,
  fileCount,
  isGenerating,
  isComplete,
  logs,
  onOpenFolder,
  onOpenVsCode,
  onOpenAntigravity,
  onStartDevStack,
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Templates Hub</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/new')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl ui-card-subtle border text-xs font-semibold hover:border-orange-500/40 text-[var(--text-muted)] hover:text-orange-500 transition-all cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Customize in Studio Wizard</span>
        </button>
      </div>

      {/* Blueprint Summary Card */}
      <div className="ui-panel rounded-2xl p-5 border space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center border border-orange-500/20">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--text-main)]">
                Fast Scaffold Blueprint
              </h3>
              <p className="text-[11px] text-[var(--text-muted)]">
                Atomic disk synthesis from template preset
              </p>
            </div>
          </div>

          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20 font-semibold">
            {fileCount} Files Generated
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl ui-card-subtle border space-y-1">
            <span className="opacity-60 text-[10px] uppercase block">Target Project</span>
            <div className="font-bold text-sm text-orange-500 truncate">{config.name}</div>
            <div className="text-[11px] opacity-70 truncate" title={config.targetPath}>
              {config.targetPath}
            </div>
          </div>

          <div className="p-3 rounded-xl ui-card-subtle border space-y-1">
            <span className="opacity-60 text-[10px] uppercase block">Runtime Topology</span>
            <div className="font-bold text-sm text-emerald-500 truncate">{config.topology}</div>
            <div className="text-[11px] opacity-70">
              Package Manager: <span className="font-bold">{config.packageManager}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl ui-card-subtle border space-y-1">
            <span className="opacity-60 text-[10px] uppercase block">AI Governance</span>
            <div className="font-bold text-sm text-indigo-500 uppercase truncate">
              {config.aiGovernance.engine || 'openspec'}
            </div>
            <div className="text-[11px] opacity-70">
              {config.aiGovernance.claude ? 'Claude Code + ' : ''}
              {config.aiGovernance.rules ? 'Cursor Rules' : 'Standard'}
            </div>
          </div>
        </div>
      </div>

      {/* SCAFFOLDING ENGINE CONSOLE */}
      <ExecutionConsole
        logs={logs}
        isGenerating={isGenerating}
        isComplete={isComplete}
        targetPath={config.targetPath}
        onOpenFolder={onOpenFolder}
        onOpenVsCode={onOpenVsCode}
        onOpenAntigravity={
          onOpenAntigravity ||
          (() => {
            alert(`Project ready for Antigravity at:\n${config.targetPath}`);
          })
        }
        onStartDevStack={onStartDevStack}
      />
    </div>
  );
};
