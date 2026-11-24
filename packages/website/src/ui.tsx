import { useEffect, useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { Check, Copy } from 'lucide-react';

export const cx = (...p: (string | false | null | undefined)[]) => p.filter(Boolean).join(' ');
export const EASE = [0.2, 0.8, 0.2, 1] as const;

export type Theme = 'dark' | 'light';

/** Respects the OS until the visitor picks; the pick is stored and applied as data-theme. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('forgestack-site-theme') : null;
    if (stored === 'dark' || stored === 'light') return stored;
    return typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  const toggle = () =>
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      localStorage.setItem('forgestack-site-theme', next);
      return next;
    });
  return { theme, toggle };
}

export function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked (insecure context): the text stays selectable
    }
  };
  return { copied, copy };
}

export function CopyButton({ text, label, className }: { text: string; label: string; className?: string }) {
  const { copied, copy } = useCopy();
  return (
    <button
      type="button"
      onClick={() => copy(text)}
      aria-label={copied ? 'Copied' : label}
      className={cx(
        'inline-flex shrink-0 items-center gap-1.5 px-3 text-[13px] text-muted transition-colors hover:text-fg',
        className,
      )}
    >
      {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
      <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
}

export function CodeBlock({ code, label, className, wrap }: { code: string; label: string; className?: string; wrap?: boolean }) {
  return (
    <div className={cx('relative rounded-3 border border-line bg-sunken', className)}>
      <div className="flex h-9 items-center justify-between border-b border-line pl-3">
        <span className="font-mono text-[12px] text-faint">{label}</span>
        <CopyButton text={code} label={`Copy ${label}`} className="h-full border-l border-line" />
      </div>
      <pre className={cx('p-4 text-[13px] leading-[1.7]', wrap ? 'whitespace-pre-wrap break-words' : 'overflow-x-auto')}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

/** Heading + optional lede. No eyebrow labels. */
export function SectionHead({ id, title, lede, aside, className }: { id: string; title: ReactNode; lede?: ReactNode; aside?: ReactNode; className?: string }) {
  return (
    <div className={cx('mb-10 flex flex-wrap items-end justify-between gap-6', className)}>
      <div className="max-w-[640px]">
        <motion.h2
          id={`${id}-title`}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: EASE }}
          className="text-[34px] font-medium leading-[1.1] tracking-[-0.025em] sm:text-[40px]"
        >
          {title}
        </motion.h2>
        {lede && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
            className="mt-3 text-[16px] text-muted"
          >
            {lede}
          </motion.p>
        )}
      </div>
      {aside}
    </div>
  );
}

export const GitHubMark = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);
