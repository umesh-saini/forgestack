import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { FolderOpen } from 'lucide-react';
import type { ProjectConfig } from '@forgestk/core/browser';
import { ARCHETYPES, archetypeOf } from '../../data/catalog.js';
import { Button, ChoiceRow, Field, Segmented, TextInput } from '../ui/primitives.js';
import { ConfigGroup } from '../studio/PickerRow.js';

interface Props {
  config: ProjectConfig;
  onChange: (updater: (prev: ProjectConfig) => ProjectConfig) => void;
  onBrowseFolder: () => void;
}

export const Step1IdentityArchetype: React.FC<Props> = ({ config, onChange, onBrowseFolder }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const nameError = config.name ? null : 'Project name is required.';

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const i = ARCHETYPES.findIndex((a) => a.id === config.topology);
    const next = ARCHETYPES[(i + (e.key === 'ArrowDown' ? 1 : -1) + ARCHETYPES.length) % ARCHETYPES.length];
    onChange(next.apply);
    listRef.current?.querySelectorAll<HTMLElement>('[role="radio"]')[ARCHETYPES.indexOf(next)]?.focus();
  };

  return (
    <div>
      <ConfigGroup title="Project">
        <div className="pt-3 pb-1 flex flex-col gap-3">
          <Field label="Project name" error={nameError} hint="Lowercase letters, numbers, - and _.">
            {(id) => (
              <TextInput
                id={id}
                value={config.name}
                placeholder="my-app"
                className="font-mono"
                onChange={(e) => {
                  const val = e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
                  onChange((prev) => ({ ...prev, name: val, targetPath: prev.targetPath.replace(/[^/]+$/, val) }));
                }}
              />
            )}
          </Field>
          <Field label="Destination">
            {(id) => (
              <div className="flex gap-2">
                <TextInput
                  id={id}
                  value={config.targetPath}
                  className="font-mono"
                  onChange={(e) => onChange((prev) => ({ ...prev, targetPath: e.target.value }))}
                />
                <Button onClick={onBrowseFolder}>
                  <FolderOpen className="w-4 h-4" />
                  Browse
                </Button>
              </div>
            )}
          </Field>
          <div className="flex items-center justify-between h-10">
            <span className="t-label text-muted">Package manager</span>
            <Segmented
              label="Package manager"
              value={config.packageManager}
              onChange={(pm) => onChange((prev) => ({ ...prev, packageManager: pm }))}
              options={(['pnpm', 'npm', 'yarn', 'bun'] as const).map((id) => ({ id, label: id }))}
            />
          </div>
        </div>
      </ConfigGroup>

      <ConfigGroup title="Architecture" aside={<span className="t-mono text-faint">{ARCHETYPES.length} topologies</span>}>
        <div ref={listRef} role="radiogroup" aria-label="Architecture" onKeyDown={onListKey} className="pt-1 flex flex-col gap-px">
          {ARCHETYPES.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i, 8) * 0.012, duration: 0.14 }}
            >
              <ChoiceRow selected={config.topology === a.id} onSelect={() => onChange(a.apply)} title={a.title} meta={a.runtime} />
            </motion.div>
          ))}
        </div>
        <motion.p
          key={config.topology}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 px-3 text-[13px] text-muted"
        >
          {archetypeOf(config.topology).summary}
        </motion.p>
      </ConfigGroup>
    </div>
  );
};
