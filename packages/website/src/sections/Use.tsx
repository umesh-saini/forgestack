import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Search } from 'lucide-react';
import { AI_PROMPT, AI_TOOLS, CLI_EXAMPLES, REPO, SKILLS_CMD, TOKEN_ROWS } from '../content.js';
import { AI_TOOL_NAMES } from '../data.js';
import { Changelog } from '../Changelog.js';
import { CodeBlock, CopyButton, EASE, GitHubMark, SectionHead, cx } from '../ui.js';

/* ───────────────────────── CLI ───────────────────────── */

export function Cli() {
  const [i, setI] = useState(0);
  const ex = CLI_EXAMPLES[i];

  return (
    <section id="cli" aria-labelledby="cli-title" className="mx-auto max-w-[1360px] px-5 py-20 sm:px-10 sm:py-24">
      <SectionHead id="cli" title="One command, your choices" lede="No global install. Every flag is optional; anything you leave out falls back to a default." />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div
          role="tablist"
          aria-label="CLI tasks"
          aria-orientation="vertical"
          className="flex flex-col gap-px"
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
              e.preventDefault();
              const next = (i + (e.key === 'ArrowDown' ? 1 : -1) + CLI_EXAMPLES.length) % CLI_EXAMPLES.length;
              setI(next);
              (e.currentTarget.children[next] as HTMLElement).focus();
            }
          }}
        >
          {CLI_EXAMPLES.map((c, k) => (
            <button
              key={c.title}
              type="button"
              role="tab"
              aria-selected={k === i}
              tabIndex={k === i ? 0 : -1}
              data-selected={k === i}
              onClick={() => setI(k)}
              className={cx('wipe flex h-11 items-center justify-between rounded-2 px-4 text-left text-[15px]', k !== i && 'text-muted hover:bg-raised hover:text-fg')}
            >
              {c.title}
              <span className="wipe-sub font-mono text-[12px] text-faint">{String(k + 1).padStart(2, '0')}</span>
            </button>
          ))}
        </div>

        <div className="min-w-0 rounded-3 border border-line bg-sunken">
          <div className="flex h-11 items-center justify-between border-b border-line pl-4">
            <span className="text-[14px]">{ex.title}</span>
            <CopyButton text={ex.cmd} label={`Copy ${ex.title} command`} className="h-full border-l border-line" />
          </div>
          <div className="min-h-[168px] overflow-x-auto p-5">
            <AnimatePresence mode="wait">
              <motion.pre key={i} className="text-[14px] leading-[1.8]">
                {ex.cmd.split('\n').map((line, n) => (
                  <motion.code
                    key={n}
                    className="block whitespace-pre"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: n * 0.06, duration: 0.25, ease: EASE }}
                  >
                    <span className="select-none text-faint">{n === 0 || !ex.cmd.split('\n')[n - 1].endsWith('\\') ? '$ ' : '  '}</span>
                    {line}
                  </motion.code>
                ))}
              </motion.pre>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── AI setup ───────────────────────── */

function Marquee({ items, reverse, duration }: { items: string[]; reverse?: boolean; duration: number }) {
  return (
    <div className="marquee-host overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <ul
        className="marquee flex w-max gap-px"
        style={{ ['--marquee-duration' as string]: `${duration}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
        aria-hidden
      >
        {[...items, ...items].map((n, i) => (
          <li key={i} className="flex h-11 items-center whitespace-nowrap border border-line bg-main px-5 text-[14px] text-muted">
            {n}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AiSetup() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(AI_TOOLS[0].name);
  const tools = useMemo(() => AI_TOOLS.filter((t) => t.name.toLowerCase().includes(query.trim().toLowerCase())), [query]);
  const tool = AI_TOOLS.find((t) => t.name === selected) ?? AI_TOOLS[0];
  const half = Math.ceil(AI_TOOL_NAMES.length / 2);

  return (
    <section id="ai" aria-labelledby="ai-title" className="border-y border-line bg-sunken py-20 sm:py-28">
      <div className="mx-auto max-w-[1360px] px-5 sm:px-10">
        <SectionHead
          id="ai"
          title="Let your AI agent scaffold it"
          lede="ForgeStack ships a local MCP server: no account, no API key, no network calls. Add it once to your tool’s global config, then ask for a project in plain language."
        />

        <ol className="mb-10 grid gap-px border border-line bg-line sm:grid-cols-3">
          {[
            ['Add the MCP server', 'Pick your tool and copy its configuration.'],
            ['Ask in plain language', 'The agent calls forgestack_scaffold_project.'],
            ['Optionally add the skill', 'Teaches flags and conventions without MCP.'],
          ].map(([t, b], k) => (
            <li key={t} className="flex gap-4 bg-sunken p-5">
              <span className="font-mono text-[13px] text-faint">{k + 1}</span>
              <span>
                <span className="block text-[15px] font-medium">{t}</span>
                <span className="block text-[14px] text-muted">{b}</span>
              </span>
            </li>
          ))}
        </ol>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
          <div>
            <div className="relative mb-2">
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find your tool"
                aria-label="Find your AI tool"
                className="h-10 w-full rounded-2 border border-line bg-main pl-9 pr-3 text-[14px] outline-none placeholder:text-faint focus:border-accent"
              />
            </div>
            <div role="radiogroup" aria-label="AI tool" className="flex flex-col gap-px">
              {tools.map((t) => (
                <button
                  key={t.name}
                  type="button"
                  role="radio"
                  aria-checked={t.name === selected}
                  data-selected={t.name === selected}
                  onClick={() => setSelected(t.name)}
                  className={cx('wipe flex h-10 items-center rounded-2 px-3 text-left text-[14.5px]', t.name !== selected && 'text-muted hover:bg-raised hover:text-fg')}
                >
                  {t.name}
                </button>
              ))}
              {tools.length === 0 && (
                <p className="px-3 py-3 text-[14px] text-muted">
                  Not listed? Any MCP client works with the JSON config shown for Cursor.
                </p>
              )}
            </div>
          </div>

          <div className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.div key={tool.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2, ease: EASE }}>
                <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-[20px] font-medium tracking-[-0.01em]">{tool.name}</h3>
                  <span className="font-mono text-[13px] text-muted">{tool.where}</span>
                </div>
                <CodeBlock code={tool.code} label="MCP configuration" />
              </motion.div>
            </AnimatePresence>
            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              <div>
                <h3 className="mb-2 text-[15px] font-medium">Then ask</h3>
                <CodeBlock code={AI_PROMPT} label="example prompt" wrap />
              </div>
              <div>
                <h3 className="mb-2 text-[15px] font-medium">Skill for Claude Code and Codex</h3>
                <CodeBlock code={SKILLS_CMD} label="skills command" wrap />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <p className="mx-auto mb-4 max-w-[1360px] px-5 text-[14px] text-muted sm:px-10">
          Projects ship rules and skills for {AI_TOOL_NAMES.length} AI tools
        </p>
        <div className="flex flex-col gap-px">
          <Marquee items={AI_TOOL_NAMES.slice(0, half)} duration={70} />
          <Marquee items={AI_TOOL_NAMES.slice(half)} duration={80} reverse />
        </div>
        <ul className="sr-only">
          {AI_TOOL_NAMES.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────────────────── Estimates ───────────────────────── */

export function Estimates() {
  return (
    <section id="estimates" aria-labelledby="estimates-title" className="mx-auto max-w-[1360px] px-5 py-20 sm:px-10">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <SectionHead id="estimates" title="Tokens an agent spends on setup" className="!mb-6" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse text-left text-[14px]">
              <thead>
                <tr className="border-b border-line-2 text-[13px] text-faint">
                  <th scope="col" className="py-3 pr-4 font-medium">Project</th>
                  <th scope="col" className="py-3 pr-4 font-medium">Agent from scratch</th>
                  <th scope="col" className="py-3 pr-4 font-medium">Time</th>
                  <th scope="col" className="py-3 font-medium">With ForgeStack</th>
                </tr>
              </thead>
              <tbody>
                {TOKEN_ROWS.map((r) => (
                  <tr key={r.project} className="border-b border-line">
                    <th scope="row" className="py-4 pr-4 font-normal">{r.project}</th>
                    <td className="py-4 pr-4 font-mono text-[13px] text-muted">{r.scratch}</td>
                    <td className="py-4 pr-4 text-muted">{r.time}</td>
                    <td className="py-4 font-mono text-[13px]">
                      <span className="bg-accent px-1.5 py-0.5 text-on-accent">{r.forge}</span>
                      <span className="ml-2 text-muted">under 1 min</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <aside className="border-l border-line pl-6 text-[14px] text-muted lg:mt-[76px]">
          <h3 className="mb-2 text-[15px] font-medium text-fg">Estimates</h3>
          <p>
            Generated code alone is 2k–15k tokens of output, measured from real projects. Agent sessions usually process 10–100× that, because
            context is re-sent at every step and build errors take several fix loops.
          </p>
          <p className="mt-3">Your numbers depend on model, caching and stack.</p>
        </aside>
      </div>
    </section>
  );
}

/* ───────────────────────── Releases + contribute ───────────────────────── */

export function Releases() {
  return (
    <section id="releases" aria-labelledby="releases-title" className="border-t border-line bg-surface py-20 sm:py-24">
      <div className="mx-auto grid max-w-[1360px] grid-cols-1 gap-12 px-5 sm:px-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <SectionHead id="releases" title="Releases" className="!mb-6" />
          <Changelog />
        </div>
        <aside>
          <h3 className="mb-3 text-[15px] font-medium lg:mt-[76px]">Contribute</h3>
          <ul className="border-t border-line">
            {[
              ['Star the repository', 'Helps other people find it.', REPO],
              ['Report an issue', 'Include the command or options you used.', `${REPO}/issues/new`],
              ['Send a pull request', 'The test matrix tells you if anything breaks.', `${REPO}/pulls`],
            ].map(([t, b, href]) => (
              <li key={t}>
                <a href={href} className="group flex items-start justify-between gap-4 border-b border-line py-4">
                  <span>
                    <span className="block text-[15px]">{t}</span>
                    <span className="block text-[14px] text-muted">{b}</span>
                  </span>
                  <ArrowUpRight size={16} className="mt-1 shrink-0 text-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex h-16 max-w-[1360px] flex-wrap items-center justify-between gap-4 px-5 text-[14px] text-muted sm:px-10">
        <p>ForgeStack, MIT License</p>
        <a href={REPO} className="flex items-center gap-2 hover:text-fg">
          <GitHubMark /> umesh-saini/forgestack
        </a>
      </div>
    </footer>
  );
}
