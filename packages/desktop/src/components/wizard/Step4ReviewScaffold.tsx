import React, { useState } from 'react';
import {
  Rocket,
  Bookmark,
  CheckCircle2,
  FolderOpen,
  Terminal,
  Layers,
  Code,
  Database,
  Shield,
  Loader2,
  BookmarkPlus,
  Save,
} from 'lucide-react';
import type { ProjectConfig } from '@forgestack/core/browser';
import { ExecutionConsole } from '../console/ExecutionConsole.js';
import { TopologyVisualizer } from './TopologyVisualizer.js';
import { isTauri } from '../../services/updaterService.js';

interface Props {
  config: ProjectConfig;
  fileCount: number;
  isGenerating: boolean;
  isComplete: boolean;
  logs: string[];
  onScaffold: () => void;
  onSaveAsTemplate: (name: string, description: string) => void;
  onOpenFolder: () => void;
  onOpenVsCode: () => void;
  onOpenAntigravity?: () => void;
}

export const Step4ReviewScaffold: React.FC<Props> = ({
  config,
  fileCount,
  isGenerating,
  isComplete,
  logs,
  onScaffold,
  onSaveAsTemplate,
  onOpenFolder,
  onOpenVsCode,
  onOpenAntigravity,
}) => {
  const [templateName, setTemplateName] = useState(`${config.name}-template`);
  const [templateDesc, setTemplateDesc] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    if (!templateName.trim()) return;
    onSaveAsTemplate(
      templateName.trim(),
      templateDesc.trim() || `Custom stack with ${config.topology} topology`
    );
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsSaving(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h3 className="font-bold text-base tracking-tight flex items-center gap-2">
          <span>Step 4: Architecture Review & Synthesis</span>
        </h3>
        <p className="text-xs opacity-70">
          Review your composed stack, save it as a reusable template preset, and trigger physical disk synthesis.
        </p>
      </div>

      {/* Architecture Matrix Card */}
      <div className="ui-panel rounded-2xl p-5 border space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-500" />
            <h4 className="font-bold text-xs uppercase tracking-wider">
              Selected Architecture Blueprint
            </h4>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 font-semibold">
            {fileCount} Files Staged
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl ui-card-subtle border space-y-1">
            <span className="opacity-60 text-[10px] uppercase block">Target Project</span>
            <div className="font-bold text-sm text-orange-400">{config.name}</div>
            <div className="text-[11px] opacity-70 truncate">{config.targetPath}</div>
          </div>

          <div className="p-3 rounded-xl ui-card-subtle border space-y-1">
            <span className="opacity-60 text-[10px] uppercase block">Runtime Topology</span>
            <div className="font-bold text-sm text-emerald-400">{config.topology}</div>
            <div className="text-[11px] opacity-70">Package Manager: {config.packageManager}</div>
          </div>

          <div className="p-3 rounded-xl ui-card-subtle border space-y-1">
            <span className="opacity-60 text-[10px] uppercase block">Frontend Stack</span>
            <div className="font-semibold text-cyan-400">
              {config.frontend.framework} + {config.frontend.styling}
            </div>
            <div className="text-[10px] opacity-70">
              Date: {config.frontend.dateLib || 'none'} • Icons: {config.frontend.icons || 'lucide'} • Toast: {config.frontend.toast || 'sonner'}
            </div>
          </div>

          <div className="p-3 rounded-xl ui-card-subtle border space-y-1">
            <span className="opacity-60 text-[10px] uppercase block">Backend & Persistence</span>
            <div className="font-semibold text-purple-400">
              {config.backend.framework} + {config.backend.database} ({config.backend.orm})
            </div>
            <div className="text-[10px] opacity-70">
              Process: {config.backend.processManager || 'docker'} • Container: {String(config.backend.container)}
            </div>
          </div>
        </div>

        {/* AI Governance & Utilities Badges */}
        <div className="p-3 rounded-xl ui-card-subtle border flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="font-medium">Governance Engine:</span>
            <span className="font-mono text-emerald-400 font-bold">
              {config.aiGovernance.engine || 'openspec'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {config.utilities?.frontendHelpers && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                + Frontend Utilities (Axios)
              </span>
            )}
            {config.utilities?.backendHelpers && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                + Backend Utilities (JWT)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Topology Visualizer */}
      <TopologyVisualizer config={config} />

      {/* Save as Custom Template Preset Section */}
      <div className="ui-panel rounded-2xl p-5 border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-500 flex items-center justify-center shrink-0">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--text-main)]">
                Save as Reusable Custom Template
              </h4>
              <p className="text-[11px] opacity-70">
                Preserve this architecture composition to fast-scaffold future projects in one click from the Templates Hub.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsSaving(!isSaving)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              isSaving
                ? 'bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-300 dark:hover:bg-zinc-700'
                : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
            }`}
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Cancel' : 'Save Preset'}</span>
          </button>
        </div>

        {isSaving && (
          <div className="p-4 rounded-xl ui-card-subtle border space-y-3 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider opacity-70 block mb-1">
                  Template Name
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g. My Next.js Enterprise Starter"
                  className="w-full px-3 py-1.5 ui-input rounded-xl text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider opacity-70 block mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={templateDesc}
                  onChange={(e) => setTemplateDesc(e.target.value)}
                  placeholder="e.g. Production Next.js stack with Drizzle and Spec-Kit"
                  className="w-full px-3 py-1.5 ui-input rounded-xl text-xs"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={handleSave}
                disabled={saveSuccess}
                className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Saved to Templates!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Confirm & Save Preset</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Synthesis Trigger Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-orange-600/10 via-amber-600/10 to-rose-600/10 border border-orange-500/20">
        <div className="min-w-0 flex-1 space-y-1">
          <h4 className="font-bold text-sm tracking-tight text-[var(--text-main)]">
            {isTauri() ? 'Ready to Synthesize Architecture' : 'Ready to Export Architecture'}
          </h4>
          {isTauri() ? (
            <p className="text-xs opacity-70 truncate font-mono">
              Writes {fileCount} staged files atomically to <span className="font-semibold text-[var(--text-main)]">{config.targetPath}</span>
            </p>
          ) : (
            <p className="text-xs opacity-70 truncate font-mono text-orange-400">
              Bundles {fileCount} staged files into an instant client-side <span className="font-semibold text-[var(--text-main)]">{config.name}.zip</span> download
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onScaffold}
          disabled={isGenerating}
          className="shrink-0 whitespace-nowrap px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white text-xs md:text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-orange-600/20 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              <span>Synthesizing...</span>
            </>
          ) : (
            <>
              <Rocket className="w-4 h-4 shrink-0" />
              <span>{isTauri() ? `Scaffold Project (${fileCount} files)` : `Download Project .ZIP (${fileCount} files)`}</span>
            </>
          )}
        </button>
      </div>

      {/* Execution Terminal Console */}
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
      />
    </div>
  );
};
