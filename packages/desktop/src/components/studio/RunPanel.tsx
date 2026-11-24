import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Code2, Copy, FolderOpen, Play, X } from 'lucide-react';
import type { ProjectConfig } from '@forgestack/core/browser';
import { isTauri } from '../../services/updaterService.js';
import { Button, WorkingLine, cx } from '../ui/primitives.js';
import type { Phase } from './run-types.js';

interface Props {
  config: ProjectConfig;
  phases: Phase[];
  isGenerating: boolean;
  isComplete: boolean;
  onOpenFolder: () => void;
  onOpenVsCode: () => void;
}

const Marker: React.FC<{ status: Phase['status'] }> = ({ status }) => (
  <span
    className={cx(
      'w-[18px] h-[18px] shrink-0 rounded-1 flex items-center justify-center border',
      status === 'done' && 'bg-fg border-fg text-main',
      status === 'running' && 'border-accent',
      status === 'pending' && 'border-line-2',
      status === 'error' && 'border-danger text-danger',
    )}
  >
    {status === 'done' && <Check className="w-3 h-3" strokeWidth={3} />}
    {status === 'error' && <X className="w-3 h-3" strokeWidth={3} />}
    {status === 'running' && (
      <motion.span
        className="w-2 h-2 bg-accent"
        animate={{ scale: [1, 0.5, 1] }}
        transition={{ duration: 0.9, repeat: Infinity }}
      />
    )}
  </span>
);

export const RunPanel: React.FC<Props> = ({ config, phases, isGenerating, isComplete, onOpenFolder, onOpenVsCode }) => {
  const [copied, setCopied] = useState(false);
  const failed = phases.some((p) => p.status === 'error');
  const nextCommand = isTauri()
    ? `cd "${config.targetPath}" && ${config.packageManager}${config.install ? '' : ` install && ${config.packageManager}`} run dev`
    : `unzip ${config.name}.zip -d ${config.name} && cd ${config.name} && ${config.packageManager} install`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(nextCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked; command stays selectable
    }
  };

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="t-section">
          {failed ? 'Scaffold failed' : isComplete ? 'Project ready' : isGenerating ? 'Scaffolding' : 'Not started'}
        </h3>
        <span className="t-mono text-faint truncate max-w-[60%]">{isTauri() ? config.targetPath : `${config.name}.zip`}</span>
      </div>
      <WorkingLine active={isGenerating} />

      <ol className="mt-2">
        {phases.map((p, i) => (
          <motion.li
            key={p.id}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="min-h-10 py-2 flex items-start gap-3 border-b border-line last:border-b-0"
          >
            <span className="pt-px">
              <Marker status={p.status} />
            </span>
            <span className="flex-1 min-w-0">
              <span className={cx('block text-[13.5px]', p.status === 'pending' ? 'text-muted' : 'text-fg')}>{p.label}</span>
              {p.detail && <span className="block t-mono text-faint truncate">{p.detail}</span>}
            </span>
          </motion.li>
        ))}
      </ol>

      {isComplete && !failed && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
          <div className="t-label text-muted mb-1.5">Next command</div>
          <div className="flex items-stretch rounded-2 border border-line bg-sunken">
            <code className="flex-1 min-w-0 px-3 py-2 t-mono text-fg truncate select-all">{nextCommand}</code>
            <button
              type="button"
              onClick={copy}
              className="px-3 border-l border-line text-muted hover:text-fg flex items-center gap-1.5 text-[12.5px]"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          {isTauri() && (
            <div className="flex gap-2 mt-3">
              <Button onClick={onOpenFolder}>
                <FolderOpen className="w-4 h-4" />
                Open folder
              </Button>
              <Button onClick={onOpenVsCode}>
                <Code2 className="w-4 h-4" />
                Open in VS Code
              </Button>
              <Button
                variant="ghost"
                onClick={async () => {
                  try {
                    const { invoke } = await import('@tauri-apps/api/core');
                    await invoke('start_dev_stack', { targetPath: config.targetPath, packageManager: config.packageManager });
                  } catch (e) {
                    console.error('Failed to start dev stack:', e);
                  }
                }}
              >
                <Play className="w-3.5 h-3.5" />
                Start dev server
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
