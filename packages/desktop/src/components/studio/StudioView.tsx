import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, CheckCircle2, FolderOpen, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ProjectConfig, TreeNode } from '@forgestk/core/browser';
import type { ThemeId } from '../../theme.js';
import { archetypeOf } from '../../data/catalog.js';
import { StepperWizard } from '../wizard/StepperWizard.js';
import { Button } from '../ui/primitives.js';
import { PreviewPane } from './PreviewPane.js';
import { RunPanel } from './RunPanel.js';
import type { LogLine, Phase } from './run-types.js';

export interface StudioProps {
  mode: 'configure' | 'run';
  config: ProjectConfig;
  theme: ThemeId;
  tree: TreeNode[];
  fileCount: number;
  compileState: 'ready' | 'updating' | 'error';
  compileError: string | null;
  logs: LogLine[];
  phases: Phase[];
  isGenerating: boolean;
  isComplete: boolean;
  openTabs: string[];
  activePath: string | null;
  activeContent: string | null;
  isMaximized: boolean;
  onToggleMaximize: () => void;
  onChange: (updater: (prev: ProjectConfig) => ProjectConfig) => void;
  onBrowseFolder: () => void;
  onScaffold: () => void;
  onResetRun: () => void;
  onSaveAsTemplate: (name: string, description: string) => void;
  onOpenFolder: () => void;
  onOpenVsCode: () => void;
  onSelectFile: (path: string) => void;
  onCloseTab: (path: string) => void;
  onAddCustomFile: (path: string, content: string) => void;
}

export const StudioView: React.FC<StudioProps> = (p) => {
  const navigate = useNavigate();
  const arch = archetypeOf(p.config.topology);

  const blockedReason = !p.config.name
    ? 'Project name is required.'
    : !p.config.targetPath
      ? 'Destination is required.'
      : p.compileState === 'error'
        ? (p.compileError ?? 'This combination is invalid.')
        : p.compileState === 'updating'
          ? 'Updating preview…'
          : null;

  return (
    <div className="h-full flex flex-col">
      {/* Project header */}
      <div className="h-12 shrink-0 flex items-center gap-4 px-5 border-b border-line">
        <div className="min-w-0 flex items-baseline gap-3">
          <span className="t-section truncate">{p.config.name || 'untitled'}</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={arch.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.14 }}
              className="text-[13px] text-muted whitespace-nowrap"
            >
              {arch.title}
            </motion.span>
          </AnimatePresence>
        </div>
        <button
          type="button"
          onClick={p.onBrowseFolder}
          disabled={p.mode === 'run'}
          className="min-w-0 max-w-[420px] h-7 px-2 flex items-center gap-1.5 rounded-2 t-mono text-faint hover:text-fg hover:bg-raised disabled:pointer-events-none"
          title="Change destination"
        >
          <FolderOpen className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{p.config.targetPath}</span>
        </button>
        <div className="flex-1" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={p.compileState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5 text-[13px] whitespace-nowrap"
          >
            {p.compileState === 'ready' && (
              <>
                <CheckCircle2 className="w-4 h-4 text-ok" />
                <span className="text-muted">Valid configuration</span>
              </>
            )}
            {p.compileState === 'updating' && (
              <>
                <Loader className="w-4 h-4 text-muted animate-spin" />
                <span className="text-muted">Updating preview</span>
              </>
            )}
            {p.compileState === 'error' && (
              <>
                <AlertTriangle className="w-4 h-4 text-danger" />
                <span className="text-danger max-w-[360px] truncate" title={p.compileError ?? ''}>
                  {p.compileError}
                </span>
              </>
            )}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="flex-1 min-h-0 flex">
        <AnimatePresence initial={false}>
          {!p.isMaximized && (
            <motion.div
              key="config"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 504, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
              className="shrink-0 border-r border-line bg-main overflow-hidden"
            >
              <div className="w-[504px] h-full">
                {p.mode === 'configure' ? (
                  <StepperWizard
                    config={p.config}
                    fileCount={p.fileCount}
                    phases={p.phases}
                    isGenerating={p.isGenerating}
                    isComplete={p.isComplete}
                    blockedReason={blockedReason}
                    onChange={p.onChange}
                    onBrowseFolder={p.onBrowseFolder}
                    onScaffold={p.onScaffold}
                    onResetRun={p.onResetRun}
                    onSaveAsTemplate={p.onSaveAsTemplate}
                    onOpenFolder={p.onOpenFolder}
                    onOpenVsCode={p.onOpenVsCode}
                  />
                ) : (
                  <div className="h-full flex flex-col">
                    <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-5 pb-6">
                      <RunPanel
                        config={p.config}
                        phases={p.phases}
                        isGenerating={p.isGenerating}
                        isComplete={p.isComplete}
                        onOpenFolder={p.onOpenFolder}
                        onOpenVsCode={p.onOpenVsCode}
                      />
                    </div>
                    <div className="h-12 shrink-0 flex items-center justify-between gap-2 px-4 border-t border-line bg-surface">
                      <Button variant="ghost" onClick={() => navigate('/hub')}>
                        Back to Hub
                      </Button>
                      <Button
                        onClick={() => {
                          p.onResetRun();
                          navigate('/new');
                        }}
                        disabled={p.isGenerating}
                      >
                        Edit configuration
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 min-w-0">
          <PreviewPane
            tree={p.tree}
            fileCount={p.fileCount}
            config={p.config}
            theme={p.theme}
            openTabs={p.openTabs}
            activePath={p.activePath}
            activeContent={p.activeContent}
            logs={p.logs}
            isGenerating={p.isGenerating}
            isMaximized={p.isMaximized}
            onToggleMaximize={p.onToggleMaximize}
            onSelectFile={p.onSelectFile}
            onCloseTab={p.onCloseTab}
            onAddCustomFile={p.onAddCustomFile}
          />
        </div>
      </div>
    </div>
  );
};
