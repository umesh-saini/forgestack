import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import type { ProjectConfig } from '@forgestk/core/browser';
import { Step1IdentityArchetype } from './Step1IdentityArchetype.js';
import { Step2StackEcosystem } from './Step2StackEcosystem.js';
import { Step3ToolingGovernance } from './Step3ToolingGovernance.js';
import { Step4ReviewScaffold } from './Step4ReviewScaffold.js';
import { Button, Kbd, cx } from '../ui/primitives.js';
import { isTauri } from '../../services/updaterService.js';
import type { Phase } from '../studio/run-types.js';

type Stage = 1 | 2 | 3 | 4;

interface Props {
  config: ProjectConfig;
  fileCount: number;
  phases: Phase[];
  isGenerating: boolean;
  isComplete: boolean;
  /** null when valid, otherwise the reason scaffolding is blocked */
  blockedReason: string | null;
  onChange: (updater: (prev: ProjectConfig) => ProjectConfig) => void;
  onBrowseFolder: () => void;
  onScaffold: () => void;
  onResetRun: () => void;
  onSaveAsTemplate: (name: string, description: string) => void;
  onOpenFolder: () => void;
  onOpenVsCode: () => void;
}

const STAGES: { n: Stage; title: string }[] = [
  { n: 1, title: 'Identity' },
  { n: 2, title: 'Stack' },
  { n: 3, title: 'Tooling' },
  { n: 4, title: 'Review' },
];

const isMac = typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform);

export const StepperWizard: React.FC<Props> = ({
  config,
  fileCount,
  phases,
  isGenerating,
  isComplete,
  blockedReason,
  onChange,
  onBrowseFolder,
  onScaffold,
  onResetRun,
  onSaveAsTemplate,
  onOpenFolder,
  onOpenVsCode,
}) => {
  const [stage, setStage] = useState<Stage>(1);
  const [dir, setDir] = useState(1);
  const [visited, setVisited] = useState<Set<Stage>>(new Set([1]));
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPos = useRef<Record<number, number>>({});

  const go = (next: Stage) => {
    if (scrollRef.current) scrollPos.current[stage] = scrollRef.current.scrollTop;
    setDir(next > stage ? 1 : -1);
    setStage(next);
    setVisited((v) => new Set(v).add(next));
  };

  // Mod+Enter advances; on Review it scaffolds.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key !== 'Enter') return;
      e.preventDefault();
      if (stage < 4) go((stage + 1) as Stage);
      else if (!blockedReason && !isGenerating) onScaffold();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const running = isGenerating || isComplete;

  return (
    <div className="h-full flex flex-col">
      {/* Stage tabs */}
      <div role="tablist" aria-label="Configuration stages" className="h-10 shrink-0 flex border-b border-line px-2">
        {STAGES.map((s) => {
          const active = s.n === stage;
          const done = visited.has(s.n) && s.n < stage;
          return (
            <button
              key={s.n}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => go(s.n)}
              className={cx(
                'relative h-full px-3 flex items-center gap-2 text-[13.5px] transition-colors',
                active ? 'text-fg font-medium' : 'text-muted hover:text-fg',
              )}
            >
              <span
                className={cx(
                  'w-4 h-4 rounded-1 flex items-center justify-center t-mono !text-[11px] !leading-none border',
                  active ? 'border-fg' : done ? 'bg-fg border-fg text-main' : 'border-line-2 text-faint',
                )}
              >
                {done ? <Check className="w-2.5 h-2.5" strokeWidth={3.5} /> : s.n}
              </span>
              {s.title}
              {active && (
                <motion.span
                  layoutId="stage-underline"
                  className="absolute left-2 right-2 -bottom-px h-0.5 bg-accent"
                  transition={{ type: 'spring', stiffness: 600, damping: 45 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Stage body */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={stage}
            custom={dir}
            initial={{ opacity: 0, x: 12 * dir }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 * dir }}
            transition={{ duration: 0.16, ease: [0.2, 0.8, 0.2, 1] }}
            onAnimationStart={() => {
              if (scrollRef.current) scrollRef.current.scrollTop = scrollPos.current[stage] ?? 0;
            }}
            className="px-5 pt-4 pb-6"
          >
            {stage === 1 && <Step1IdentityArchetype config={config} onChange={onChange} onBrowseFolder={onBrowseFolder} />}
            {stage === 2 && <Step2StackEcosystem config={config} onChange={onChange} />}
            {stage === 3 && <Step3ToolingGovernance config={config} onChange={onChange} />}
            {stage === 4 && (
              <Step4ReviewScaffold
                config={config}
                fileCount={fileCount}
                phases={phases}
                isGenerating={isGenerating}
                isComplete={isComplete}
                onEditStage={go}
                onSaveAsTemplate={onSaveAsTemplate}
                onOpenFolder={onOpenFolder}
                onOpenVsCode={onOpenVsCode}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action bar */}
      <div className="h-12 shrink-0 flex items-center gap-2 px-4 border-t border-line bg-surface">
        {stage > 1 && !running && (
          <Button variant="ghost" onClick={() => go((stage - 1) as Stage)}>
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        )}
        <div className="flex-1 min-w-0 px-1">
          {blockedReason && stage === 4 && <span className="block truncate text-[12.5px] text-danger">{blockedReason}</span>}
        </div>
        {stage < 4 ? (
          <Button variant="secondary" onClick={() => go((stage + 1) as Stage)}>
            {STAGES[stage].title}
            <ArrowRight className="w-4 h-4" />
            <Kbd>{isMac ? '⌘↵' : 'Ctrl ↵'}</Kbd>
          </Button>
        ) : isComplete ? (
          <Button variant="secondary" onClick={onResetRun}>
            Back to configuration
          </Button>
        ) : (
          <Button variant="primary" onClick={onScaffold} disabled={Boolean(blockedReason) || isGenerating}>
            {isGenerating ? 'Scaffolding…' : isTauri() ? 'Scaffold project' : 'Download project ZIP'}
            {!isGenerating && <span className="t-mono opacity-70 tabular">{fileCount}</span>}
          </Button>
        )}
      </div>
    </div>
  );
};
