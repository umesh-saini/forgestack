import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CornerDownLeft, Search } from 'lucide-react';
import { cx } from '../ui/primitives.js';

export interface PaletteCommand {
  id: string;
  title: string;
  group: string;
  hint?: string;
  icon?: React.ReactNode;
  run: () => void;
}

interface Props {
  open: boolean;
  onClose: () => void;
  commands: PaletteCommand[];
}

export const CommandPalette: React.FC<Props> = ({ open, onClose, commands }) => {
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.title} ${c.group} ${c.hint ?? ''}`.toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  useEffect(() => setIndex(0), [query]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${index}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [index]);

  const runAt = (i: number) => {
    const cmd = results[i];
    if (!cmd) return;
    onClose();
    cmd.run();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIndex((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIndex((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      runAt(index);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  let lastGroup = '';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-center pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
        >
          <div className="absolute inset-0 bg-[var(--scrim)]" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-label="Command palette"
            className="relative w-[560px] h-fit max-h-[420px] flex flex-col bg-surface border border-line rounded-3 shadow-modal overflow-hidden"
            initial={{ y: -8, scale: 0.985 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -4, scale: 0.99 }}
            transition={{ duration: 0.14, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="h-12 flex items-center gap-2.5 px-4 border-b border-line">
              <Search className="w-4 h-4 text-faint" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Go to, scaffold a template, switch theme"
                className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-faint"
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-list"
              />
            </div>
            <div ref={listRef} id="palette-list" role="listbox" className="flex-1 overflow-y-auto py-1.5">
              {results.length === 0 && <p className="px-4 py-6 text-[13px] text-muted">No command matches “{query}”.</p>}
              {results.map((cmd, i) => {
                const header = cmd.group !== lastGroup ? cmd.group : null;
                lastGroup = cmd.group;
                const active = i === index;
                return (
                  <React.Fragment key={cmd.id}>
                    {header && <div className="px-4 pt-2 pb-1 t-label text-faint">{header}</div>}
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      data-index={i}
                      data-selected={active}
                      onMouseMove={() => setIndex(i)}
                      onClick={() => runAt(i)}
                      className={cx('wipe w-[calc(100%-12px)] mx-1.5 h-9 px-2.5 flex items-center gap-2.5 rounded-2 text-left text-[13.5px]')}
                    >
                      {cmd.icon && <span className="w-4 h-4 flex items-center justify-center shrink-0">{cmd.icon}</span>}
                      <span className="flex-1 truncate">{cmd.title}</span>
                      {cmd.hint && <span className="wipe-sub t-mono text-faint truncate max-w-[40%]">{cmd.hint}</span>}
                      {active && <CornerDownLeft className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
