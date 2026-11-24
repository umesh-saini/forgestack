import React, { useEffect, useId, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, X } from 'lucide-react';

export const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ');

/* ───────────────────────── Buttons ───────────────────────── */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

const buttonBase =
  'inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-2 text-[13px] font-medium whitespace-nowrap select-none ' +
  'transition-[background-color,color,border-color,transform] duration-[90ms] ease-forge active:translate-y-px ' +
  'disabled:opacity-45 disabled:pointer-events-none';

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover active:bg-accent-press',
  secondary: 'bg-raised text-fg border border-line hover:border-line-2',
  ghost: 'text-muted hover:text-fg hover:bg-raised',
  danger: 'text-danger border border-line hover:border-danger',
};

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: 'sm' | 'md' }
>(({ variant = 'secondary', size = 'md', className, type = 'button', ...rest }, ref) => (
  <button
    ref={ref}
    type={type}
    className={cx(buttonBase, buttonVariants[variant], size === 'sm' && 'h-7 px-2 text-[12.5px]', className)}
    {...rest}
  />
));
Button.displayName = 'Button';

export const IconButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string; active?: boolean }
>(({ label, active, className, type = 'button', children, ...rest }, ref) => (
  <button
    ref={ref}
    type={type}
    aria-label={label}
    title={label}
    className={cx(
      'inline-flex items-center justify-center w-7 h-7 rounded-2 text-muted transition-colors duration-[90ms]',
      'hover:text-fg hover:bg-raised disabled:opacity-40 disabled:pointer-events-none',
      active && 'text-fg bg-raised',
      className,
    )}
    {...rest}
  >
    {children}
  </button>
));
IconButton.displayName = 'IconButton';

/* ───────────────────────── Inputs ───────────────────────── */

export const inputClass =
  'w-full h-8 px-2.5 rounded-2 bg-raised border border-line text-[13px] text-fg placeholder:text-faint ' +
  'outline-none transition-colors duration-[90ms] hover:border-line-2 focus:border-accent';

export const TextInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...rest }, ref) => <input ref={ref} className={cx(inputClass, className)} {...rest} />,
);
TextInput.displayName = 'TextInput';

export const Field: React.FC<{
  label: string;
  hint?: React.ReactNode;
  error?: string | null;
  children: (id: string) => React.ReactNode;
  className?: string;
}> = ({ label, hint, error, children, className }) => {
  const id = useId();
  return (
    <div className={cx('flex flex-col gap-1.5 min-w-0', className)}>
      <label htmlFor={id} className="t-label text-muted">
        {label}
      </label>
      {children(id)}
      {error ? (
        <p className="text-[12.5px] text-danger">{error}</p>
      ) : hint ? (
        <p className="text-[12.5px] text-faint">{hint}</p>
      ) : null}
    </div>
  );
};

/* ───────────────────────── Segmented ───────────────────────── */

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
  className,
}: {
  value: T;
  options: { id: T; label: React.ReactNode }[];
  onChange: (v: T) => void;
  label: string;
  className?: string;
}) {
  const layoutId = useId();
  return (
    <div role="radiogroup" aria-label={label} className={cx('inline-flex h-8 p-0.5 rounded-2 bg-raised border border-line', className)}>
      {options.map((o) => {
        const on = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.id)}
            className={cx(
              'relative px-2.5 rounded-1 text-[12.5px] font-mono transition-colors duration-[90ms]',
              on ? 'text-on-accent' : 'text-muted hover:text-fg',
            )}
          >
            {on && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-1 bg-accent"
                transition={{ type: 'spring', stiffness: 600, damping: 40 }}
              />
            )}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ───────────────────────── Selection rows ───────────────────────── */

/** A dense selectable row that uses the sulphur wipe when selected. */
export const ChoiceRow: React.FC<{
  selected: boolean;
  onSelect: () => void;
  title: React.ReactNode;
  meta?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  disabledReason?: string;
  multi?: boolean;
  className?: string;
}> = ({ selected, onSelect, title, meta, icon, disabled, disabledReason, multi, className }) => (
  <button
    type="button"
    role={multi ? 'checkbox' : 'radio'}
    aria-checked={selected}
    aria-disabled={disabled}
    title={disabled ? disabledReason : undefined}
    onClick={() => !disabled && onSelect()}
    data-selected={selected}
    className={cx(
      'wipe group w-full h-10 px-3 flex items-center gap-2.5 text-left rounded-1',
      !selected && !disabled && 'hover:bg-raised',
      disabled && 'opacity-50 cursor-not-allowed hatched',
      className,
    )}
  >
    {icon && <span className="shrink-0 flex items-center justify-center w-4 h-4">{icon}</span>}
    <span className="flex-1 min-w-0 truncate text-[13.5px]">{title}</span>
    {meta && <span className="wipe-sub shrink-0 t-mono text-faint truncate max-w-[45%]">{meta}</span>}
    {multi && (
      <span
        className={cx(
          'shrink-0 w-4 h-4 rounded-1 border flex items-center justify-center',
          selected ? 'border-on-accent/60 bg-on-accent text-accent' : 'border-line-2',
        )}
      >
        {selected && <Check className="w-3 h-3" strokeWidth={3} />}
      </span>
    )}
  </button>
);

/** Label on the left, control on the right. The basic unit of every form in the app. */
export const SettingRow: React.FC<{
  label: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}> = ({ label, description, children, className }) => (
  <div className={cx('flex items-center justify-between gap-6 py-3 border-b border-line last:border-b-0', className)}>
    <div className="min-w-0">
      <div className="text-[13.5px] text-fg">{label}</div>
      {description && <div className="text-[12.5px] text-muted mt-0.5">{description}</div>}
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);

export const Switch: React.FC<{ checked: boolean; onChange: (v: boolean) => void; label: string; disabled?: boolean }> = ({
  checked,
  onChange,
  label,
  disabled,
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={cx(
      'relative w-8 h-[18px] rounded-1 border transition-colors duration-[90ms] disabled:opacity-40',
      checked ? 'bg-accent border-accent' : 'bg-raised border-line-2',
    )}
  >
    <motion.span
      className={cx('absolute top-[2px] w-3 h-3 rounded-[1px]', checked ? 'bg-on-accent' : 'bg-muted')}
      animate={{ left: checked ? 16 : 2 }}
      transition={{ type: 'spring', stiffness: 700, damping: 40 }}
    />
  </button>
);

/* ───────────────────────── Small pieces ───────────────────────── */

export const Kbd: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <kbd className="inline-flex items-center h-5 min-w-5 px-1 rounded-1 border border-line bg-sunken t-mono !text-[11.5px] !leading-none text-muted">
    {children}
  </kbd>
);

export const Tag: React.FC<{ children: React.ReactNode; tone?: 'neutral' | 'ok' | 'danger' | 'accent'; className?: string }> = ({
  children,
  tone = 'neutral',
  className,
}) => (
  <span
    className={cx(
      'inline-flex items-center gap-1 h-5 px-1.5 rounded-1 t-mono !text-[12px] !leading-none whitespace-nowrap',
      tone === 'neutral' && 'bg-raised text-muted border border-line',
      tone === 'ok' && 'text-ok border border-ok/40',
      tone === 'danger' && 'text-danger border border-danger/40',
      tone === 'accent' && 'bg-accent text-on-accent',
      className,
    )}
  >
    {children}
  </span>
);

/** Section heading used inside panes. Literal names, no eyebrows. */
export const PaneHeading: React.FC<{ children: React.ReactNode; aside?: React.ReactNode; className?: string }> = ({
  children,
  aside,
  className,
}) => (
  <div className={cx('flex items-center justify-between gap-3 mb-2', className)}>
    <h3 className="t-section text-fg">{children}</h3>
    {aside}
  </div>
);

/** Indeterminate progress line used for "working" states — no invented percentages. */
export const WorkingLine: React.FC<{ active: boolean }> = ({ active }) => (
  <div className="relative h-px w-full overflow-hidden bg-line">
    {active && <div className="scan absolute inset-y-0 left-0 w-1/4 bg-accent" />}
  </div>
);

/* ───────────────────────── Dialog ───────────────────────── */

export const Dialog: React.FC<{
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  width?: number;
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ open, onClose, title, width = 520, children, footer }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const t = setTimeout(() => panelRef.current?.querySelector<HTMLElement>('input,button,select,textarea')?.focus(), 30);
    return () => {
      window.removeEventListener('keydown', onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.14 }}
        >
          <div className="absolute inset-0 bg-[var(--scrim)]" onClick={onClose} />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative flex flex-col max-h-[calc(100vh-48px)] bg-surface border border-line rounded-3 shadow-modal"
            style={{ width }}
            initial={{ y: 10, scale: 0.985 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 6, scale: 0.99 }}
            transition={{ duration: 0.16, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="flex items-center justify-between h-12 px-4 border-b border-line shrink-0">
              <h2 id={titleId} className="t-section">
                {title}
              </h2>
              <IconButton label="Close" onClick={onClose}>
                <X className="w-4 h-4" />
              </IconButton>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
            {footer && <div className="flex items-center justify-end gap-2 h-14 px-4 border-t border-line shrink-0">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
