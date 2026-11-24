import React, { useId, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { ChoiceRow, cx } from '../ui/primitives.js';

export interface PickerOption<T extends string> {
  id: T;
  label: string;
  meta?: string;
  icon?: React.ReactNode;
  disabledReason?: string;
}

/**
 * Aligned label / value row. The current value is shown; the alternatives open inline
 * beneath it so the configuration never leaves the pane.
 */
export function PickerRow<T extends string>({
  label,
  value,
  options,
  onChange,
  note,
}: {
  label: string;
  value: T;
  options: PickerOption<T>[];
  onChange: (v: T) => void;
  note?: string;
}) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const current = options.find((o) => o.id === value) ?? options[0];

  return (
    <div className="border-b border-line last:border-b-0">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
        className="w-full h-10 flex items-center gap-3 text-left group"
      >
        <span className="w-[136px] shrink-0 text-[13px] text-muted">{label}</span>
        <span className="flex-1 min-w-0 flex items-center gap-2">
          {current?.icon && <span className="w-4 h-4 flex items-center justify-center shrink-0">{current.icon}</span>}
          <span className={cx('truncate text-[13.5px]', value === 'none' ? 'text-faint' : 'text-fg')}>{current?.label}</span>
        </span>
        <span className="t-mono text-faint opacity-0 group-hover:opacity-100 transition-opacity">{options.length} options</span>
        <ChevronDown className={cx('w-4 h-4 text-faint transition-transform duration-200', open && 'rotate-180')} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={listId}
            role="radiogroup"
            aria-label={label}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-2 pl-[148px] flex flex-col gap-px">
              {options.map((o) => (
                <ChoiceRow
                  key={o.id}
                  selected={o.id === value}
                  disabled={Boolean(o.disabledReason)}
                  disabledReason={o.disabledReason}
                  onSelect={() => {
                    onChange(o.id);
                    setOpen(false);
                  }}
                  icon={o.icon}
                  title={o.label}
                  meta={o.disabledReason ?? o.meta}
                  className="!h-8"
                />
              ))}
              {note && <p className="px-3 pt-1 text-[12.5px] text-faint">{note}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Group heading + rows. */
export const ConfigGroup: React.FC<{ title: string; aside?: React.ReactNode; children: React.ReactNode }> = ({
  title,
  aside,
  children,
}) => (
  <section className="mb-6">
    <div className="flex items-center justify-between h-7 border-b border-line-2 mb-0.5">
      <h3 className="t-label text-fg">{title}</h3>
      {aside}
    </div>
    {children}
  </section>
);
