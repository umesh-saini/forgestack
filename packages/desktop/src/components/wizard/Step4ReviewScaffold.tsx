import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BookmarkPlus, Check } from 'lucide-react';
import type { ProjectConfig } from '@forgestk/core/browser';
import { archetypeOf, hasBackend, hasFrontend, label } from '../../data/catalog.js';
import { Button, Field, TextInput, cx } from '../ui/primitives.js';
import { RunPanel } from '../studio/RunPanel.js';
import type { Phase } from '../studio/run-types.js';

interface Props {
  config: ProjectConfig;
  fileCount: number;
  phases: Phase[];
  isGenerating: boolean;
  isComplete: boolean;
  onEditStage: (stage: 1 | 2 | 3) => void;
  onSaveAsTemplate: (name: string, description: string) => void;
  onOpenFolder: () => void;
  onOpenVsCode: () => void;
}

const on = (b: boolean | undefined, text: string) => (b ? text : null);

export const Step4ReviewScaffold: React.FC<Props> = ({
  config: c,
  fileCount,
  phases,
  isGenerating,
  isComplete,
  onEditStage,
  onSaveAsTemplate,
  onOpenFolder,
  onOpenVsCode,
}) => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState(`${c.name} template`);
  const [desc, setDesc] = useState('');

  const groups: { stage: 1 | 2 | 3; title: string; rows: [string, string | null][] }[] = [
    {
      stage: 1,
      title: 'Identity',
      rows: [
        ['Project name', c.name],
        ['Destination', c.targetPath],
        ['Package manager', c.packageManager],
        ['Architecture', archetypeOf(c.topology).title],
      ],
    },
    {
      stage: 2,
      title: 'Stack',
      rows: [
        ['Frontend', hasFrontend(c) ? label(c.frontend.framework) : null],
        ['State', hasFrontend(c) ? label(c.frontend.state) : null],
        ['Forms', hasFrontend(c) ? label(c.frontend.forms) : null],
        ['Server', hasBackend(c) ? label(c.backend.framework) : c.topology === 'nextjs-fullstack' ? 'Route handlers' : null],
        ['Database', c.backend.database !== 'none' ? `${label(c.backend.database)} with ${label(c.backend.orm)}` : null],
      ],
    },
    {
      stage: 3,
      title: 'Tooling',
      rows: [
        ['Process manager', label(c.backend.processManager ?? 'docker')],
        ['Deployment', label(c.deployment ?? 'docker')],
        ['Application', [on(c.auth === 'better-auth', 'Better-Auth'), on(c.rpc === 'trpc', 'tRPC')].filter(Boolean).join(', ') || null],
        ['Quality', [label(c.linter ?? 'eslint'), on(c.testing?.e2e === 'playwright', 'Playwright'), on(c.ci === 'github-actions', 'GitHub Actions')].filter(Boolean).join(', ')],
        ['AI agents', [label(c.aiGovernance.engine ?? 'openspec'), on(c.aiGovernance.rules, 'Cursor rules'), on(c.aiGovernance.claude ?? true, 'CLAUDE.md'), on(c.aiGovernance.skills, 'skills'), on(c.aiGovernance.mcp ?? true, 'MCP')].filter(Boolean).join(', ')],
        ['After writing', [on(c.git, 'git init'), on(c.install, `${c.packageManager} install`)].filter(Boolean).join(', ') || null],
      ],
    },
  ];

  if (isGenerating || isComplete) {
    return <RunPanel config={c} phases={phases} isGenerating={isGenerating} isComplete={isComplete} onOpenFolder={onOpenFolder} onOpenVsCode={onOpenVsCode} />;
  }

  return (
    <div>
      {groups.map((g) => (
        <section key={g.title} className="mb-6">
          <div className="flex items-center justify-between h-7 border-b border-line-2 mb-0.5">
            <h3 className="t-label text-fg">{g.title}</h3>
            <button type="button" onClick={() => onEditStage(g.stage)} className="text-[12.5px] text-muted hover:text-fg underline-offset-4 hover:underline">
              Edit
            </button>
          </div>
          <dl>
            {g.rows.map(([k, v]) => (
              <div key={k} className="min-h-9 py-1.5 flex items-baseline gap-3 border-b border-line last:border-b-0">
                <dt className="w-[136px] shrink-0 text-[13px] text-muted">{k}</dt>
                <dd className={cx('flex-1 min-w-0 text-[13.5px] break-words', !v && 'text-faint', k === 'Destination' && 't-mono')}>{v ?? 'None'}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}

      <section className="mb-2">
        <div className="flex items-center justify-between h-7 border-b border-line-2 mb-2">
          <h3 className="t-label text-fg">Template</h3>
          <span className="t-mono text-faint tabular">{fileCount} files</span>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          {saved ? (
            <motion.p key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-8 flex items-center gap-2 text-[13px] text-ok">
              <Check className="w-4 h-4" /> Saved to Hub as “{name}”.
            </motion.p>
          ) : saving ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-3 overflow-hidden"
              onSubmit={(e) => {
                e.preventDefault();
                if (!name.trim()) return;
                onSaveAsTemplate(name.trim(), desc.trim() || `${archetypeOf(c.topology).title} saved from Studio`);
                setSaved(true);
                setSaving(false);
                setTimeout(() => setSaved(false), 2500);
              }}
            >
              <Field label="Template name">{(id) => <TextInput id={id} autoFocus value={name} onChange={(e) => setName(e.target.value)} />}</Field>
              <Field label="Description">{(id) => <TextInput id={id} value={desc} placeholder="Optional" onChange={(e) => setDesc(e.target.value)} />}</Field>
              <div className="flex gap-2">
                <Button type="submit">Save template</Button>
                <Button variant="ghost" onClick={() => setSaving(false)}>
                  Cancel
                </Button>
              </div>
            </motion.form>
          ) : (
            <motion.div key="btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Button variant="ghost" onClick={() => setSaving(true)} className="-ml-3">
                <BookmarkPlus className="w-4 h-4" />
                Save as template
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};
