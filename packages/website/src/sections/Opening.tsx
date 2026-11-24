import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight, Bot, Monitor, Moon, Sun, Terminal } from 'lucide-react';
import { CREATE_CMD, REPO } from '../content.js';
import { SHOTS, SHOT_SIZE } from '../screens.js';
import { CopyButton, EASE, GitHubMark, cx, type Theme } from '../ui.js';

const NAV = [
  ['Studio', '#studio'],
  ['Stack', '#stack'],
  ['CLI', '#cli'],
  ['AI setup', '#ai'],
  ['Releases', '#releases'],
] as const;

export function Header({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    NAV.forEach(([, href]) => {
      const el = document.querySelector(href);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-line bg-main">
      <div className="mx-auto flex h-full max-w-[1360px] items-center gap-8 px-5 sm:px-10">
        <a href="#top" className="flex items-center gap-2.5 text-[15px] font-semibold tracking-[-0.01em]">
          <img src={`${import.meta.env.BASE_URL}favicon.png`} alt="" width={20} height={20} />
          ForgeStack
        </a>
        <nav aria-label="Sections" className="hidden h-full items-center gap-1 md:flex">
          {NAV.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className={cx('relative flex h-full items-center px-3 text-[14px] transition-colors', active === href ? 'text-fg' : 'text-muted hover:text-fg')}
            >
              {label}
              {active === href && <motion.span layoutId="nav-mark" className="absolute inset-x-3 -bottom-px h-0.5 bg-accent" />}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="flex h-9 w-9 items-center justify-center rounded-2 text-muted hover:bg-raised hover:text-fg"
          >
            {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <a href={REPO} className="flex h-9 items-center gap-2 rounded-2 border border-line px-3 text-[14px] hover:border-line-2">
            <GitHubMark /> GitHub
          </a>
        </div>
      </div>
      <motion.div aria-hidden style={{ scaleX: progress }} className="absolute inset-x-0 -bottom-px h-px origin-left bg-accent" />
    </header>
  );
}

/** Types the install command once, then leaves it selectable. */
function TypedCommand({ text }: { text: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setN(text.length);
    let i = 0;
    const t = setInterval(() => {
      i += 2;
      setN(Math.min(i, text.length));
      if (i >= text.length) clearInterval(t);
    }, 28);
    return () => clearInterval(t);
  }, [text]);
  return (
    <code className="block min-w-0 flex-1 overflow-x-auto whitespace-nowrap py-3 text-[14px] no-scrollbar" aria-label={text}>
      <span className="select-none text-faint">$ </span>
      {text.slice(0, n)}
      {n < text.length && <span className="caret ml-px inline-block h-4 w-2 translate-y-0.5 bg-accent" />}
    </code>
  );
}

const PATHS = [
  { icon: Terminal, name: 'CLI', body: 'One command with flags, or an interactive wizard.', href: '#cli' },
  { icon: Monitor, name: 'Studio', body: 'Desktop app with a live preview of every file.', href: '#studio' },
  { icon: Bot, name: 'MCP server', body: 'Your AI agent scaffolds in one tool call.', href: '#ai' },
];

const HEADLINE = ['Compose', 'a', 'TypeScript', 'project', 'before', 'writing', 'a', 'file.'];

export function Opening({ theme }: { theme?: Theme } = {}) {
  const isLight = theme ? theme === 'light' : typeof document !== 'undefined' && document.documentElement.dataset.theme === 'light';
  const frameRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ['start end', 'start 20%'] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return (
    <section id="top" aria-labelledby="top-title" className="relative overflow-hidden">
      <div className="mx-auto max-w-[1360px] px-5 pt-16 sm:px-10 sm:pt-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,600px)] lg:items-end">
          <div>
            <h1 id="top-title" className="max-w-[640px] text-[44px] font-medium leading-[1.02] tracking-[-0.035em] sm:text-[64px]">
              {HEADLINE.map((w, i) => (
                <motion.span
                  key={i}
                  className="inline-block pr-[0.22em]"
                  initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.6, ease: EASE }}
                >
                  {w === 'before' ? <span className="relative">before<motion.span aria-hidden initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.75, duration: 0.45, ease: 'linear' }} className="absolute inset-x-0 -bottom-[0.02em] h-[0.09em] origin-left bg-accent" /></span> : w}
                </motion.span>
              ))}
            </h1>
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.6, ease: EASE }}>
            <p className="mb-6 text-[17px] leading-[1.6] text-muted">
              Pick an architecture and every layer, read the generated files, then write them to disk. Monorepos, full-stack apps, desktop apps and
              workers with auth, database, RPC, CI and AI-agent rules already wired.
            </p>
            <div className="flex items-stretch rounded-3 border border-line-2 bg-sunken pl-4">
              <TypedCommand text={CREATE_CMD} />
              <CopyButton text={CREATE_CMD} label="Copy install command" className="border-l border-line" />
            </div>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
              <a href="#ai" className="group inline-flex items-center gap-1 text-fg underline decoration-line-2 underline-offset-4 hover:decoration-accent">
                Set up your AI agent <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <a href={`${REPO}/releases/latest`} className="group inline-flex items-center gap-1 text-fg underline decoration-line-2 underline-offset-4 hover:decoration-accent">
                Download Studio <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          <ul className="order-2 flex flex-col lg:order-1 lg:pt-6" aria-label="Ways to use ForgeStack">
            {PATHS.map((p, i) => (
              <motion.li
                key={p.name}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.08, duration: 0.5, ease: EASE }}
              >
                <a href={p.href} className="group flex gap-3 border-t border-line py-4 last:border-b">
                  <p.icon size={18} className="mt-0.5 shrink-0 text-muted transition-colors group-hover:text-fg" aria-hidden />
                  <span>
                    <span className="block text-[15px] font-medium">{p.name}</span>
                    <span className="block text-[14px] text-muted">{p.body}</span>
                  </span>
                </a>
              </motion.li>
            ))}
          </ul>

          <motion.div
            ref={frameRef}
            style={{ scale, y }}
            className="order-1 origin-top-left lg:order-2 lg:-mr-[max(40px,calc((100vw-1360px)/2+40px))]"
          >
            <motion.figure
              initial={{ clipPath: 'inset(0 0 100% 0)' }}
              animate={{ clipPath: 'inset(0 0 0% 0)' }}
              transition={{ delay: 0.35, duration: 1, ease: EASE }}
              className="overflow-hidden rounded-t-3 border border-b-0 border-line-2 bg-surface"
            >
              <img
                src={SHOTS.stackDark}
                alt="ForgeStack Studio configuring a Turborepo monorepo: Stack stage with the database picker open, the generated file tree and server.ts in the editor (dark theme)"
                width={SHOT_SIZE.width}
                height={SHOT_SIZE.height}
                className={cx('block w-full', isLight && 'hidden')}
              />
              <img
                src={SHOTS.stackLight}
                alt="ForgeStack Studio configuring a Turborepo monorepo: Stack stage with the database picker open, the generated file tree and server.ts in the editor (light theme)"
                width={SHOT_SIZE.width}
                height={SHOT_SIZE.height}
                className={cx('block w-full', !isLight && 'hidden')}
              />
            </motion.figure>
            {/* Sulphur caption rail — the studio's selection plane, attached to the capture. */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.1, duration: 0.5, ease: 'linear' }}
              className="flex h-11 origin-left items-center gap-6 overflow-x-auto whitespace-nowrap bg-accent px-4 font-mono text-[13px] text-on-accent no-scrollbar"
            >
              <span>enterprise-app</span>
              <span className="opacity-80">Turborepo monorepo</span>
              <span className="opacity-80">pnpm</span>
              <span className="ml-auto">88 files in memory</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
