import { useState, type ReactNode } from 'react';
import { AGENT_TARGETS, projectConfigSchema } from '@forgestack/core/browser';
import { Bot, Bug, Check, Copy, GitPullRequest, Layers, Monitor, Package, ShieldCheck, Star, Terminal, Workflow } from 'lucide-react';
import { Changelog } from './Changelog.js';
import { AI_PROMPT, AI_TOOLS, CLI_EXAMPLES, CREATE_CMD, FEATURES, LABELS, REPO, SKILLS_CMD, STATS, TOKEN_ROWS } from './content.js';
import hubShot from '../../../docs/screenshots/templates-hub.png';
import wizardShot from '../../../docs/screenshots/stepper-studio.png';
import settingsShot from '../../../docs/screenshots/app-settings.png';

// ---------- data from the engine (single source of truth) ----------
type AnySchema = { _def?: { innerType?: AnySchema; values?: readonly string[] }; options?: readonly string[]; shape?: Record<string, AnySchema> };
const unwrap = (s: AnySchema): AnySchema => (s._def?.innerType ? unwrap(s._def.innerType) : s);
const values = (s: AnySchema) => ((unwrap(s).options ?? unwrap(s)._def?.values ?? []) as string[]).filter((v) => v !== 'none');
const shape = projectConfigSchema.shape as unknown as Record<string, AnySchema>;
const sub = (k: string) => unwrap(shape[k]).shape as Record<string, AnySchema>;

const STACK: { group: string; items: string[] }[] = [
  { group: 'Architecture', items: values(shape.topology) },
  { group: 'Frontend', items: [...values(sub('frontend').framework), ...values(sub('frontend').styling), ...values(sub('frontend').state)] },
  { group: 'Backend', items: values(sub('backend').framework) },
  { group: 'Data', items: [...values(sub('backend').database), ...values(sub('backend').orm)] },
  { group: 'Auth, RPC & jobs', items: [...values(shape.auth), ...values(shape.rpc), ...values(shape.queue)] },
  { group: 'UI kits', items: [...values(sub('frontend').icons), ...values(sub('frontend').toast), ...values(sub('frontend').forms), ...values(sub('frontend').dateLib)] },
  { group: 'Quality', items: [...values(sub('testing').e2e), ...values(shape.linter), ...values(shape.ci)] },
  { group: 'Deploy', items: values(shape.deployment) },
  { group: 'Package managers', items: values(shape.packageManager) },
];
const AI_TOOL_NAMES = AGENT_TARGETS.map((t) => t.name);

// ---------- small building blocks ----------
function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // clipboard blocked (e.g. insecure context): the text stays selectable
        }
      }}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-line bg-raised px-2.5 py-1.5 text-xs text-muted transition hover:text-fg"
      aria-label={copied ? 'Copied' : label}
    >
      {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
      <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
}

function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-sunken">
      <div className="flex items-center justify-end border-b border-line px-2 py-1.5">
        <CopyButton text={code} label={label ? `Copy ${label}` : 'Copy command'} />
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Section({ id, eyebrow, title, intro, children }: { id: string; eyebrow: string; title: string; intro?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">{eyebrow}</p>
      <h2 id={`${id}-title`} className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {intro && <p className="mb-10 max-w-3xl text-lg text-muted">{intro}</p>}
      {children}
    </section>
  );
}

const GitHubMark = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

const NAV = [
  ['Features', '#features'],
  ['Stack', '#stack'],
  ['CLI', '#cli'],
  ['AI setup', '#ai'],
  ['Changelog', '#changelog'],
];

export function App() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-3 focus:py-2 focus:text-on-accent">
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <a href="#top" className="flex items-center gap-2 font-bold">
            <Layers className="text-accent" size={22} aria-hidden /> ForgeStack
          </a>
          <nav aria-label="Sections" className="hidden gap-6 text-sm text-muted md:flex">
            {NAV.map(([label, href]) => (
              <a key={href} href={href} className="hover:text-fg">
                {label}
              </a>
            ))}
          </nav>
          <a href={REPO} className="inline-flex items-center gap-2 rounded-lg border border-line bg-raised px-3 py-1.5 text-sm hover:border-accent">
            <GitHubMark /> <Star size={14} aria-hidden /> Star on GitHub
          </a>
        </div>
      </header>

      <main id="main">
        {/* ---------- Hero ---------- */}
        <section id="top" className="relative overflow-hidden border-b border-line">
          <div className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-80 max-w-3xl rounded-full bg-accent/20 blur-3xl" aria-hidden />
          <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-20 text-center sm:px-6 sm:pt-28">
            <p className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-raised px-3 py-1 text-sm text-muted">
              <ShieldCheck size={16} className="text-ok" aria-hidden /> Every option combination tested to build, run and lint
            </p>
            <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-6xl">
              Production-ready TypeScript projects <span className="text-accent">in one command</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
              Monorepos, full-stack apps, desktop apps and workers, with auth, database, RPC, CI and AI-agent rules already wired. Use it
              from the terminal, a desktop app, or let your AI assistant call it.
            </p>
            <div className="mx-auto mt-10 flex max-w-2xl items-center gap-3 rounded-2xl border border-line bg-sunken p-2 pl-4 text-left">
              <Terminal size={18} className="shrink-0 text-accent" aria-hidden />
              <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-sm sm:text-base">{CREATE_CMD}</code>
              <CopyButton text={CREATE_CMD} label="Copy create command" />
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
              <a href="#ai" className="rounded-lg bg-accent px-4 py-2 font-semibold text-on-accent hover:bg-accent-strong">
                Set up with your AI tool
              </a>
              <a href={REPO} className="rounded-lg border border-line bg-raised px-4 py-2 font-semibold hover:border-accent">
                View on GitHub
              </a>
            </div>
          </div>
          <dl className="relative mx-auto grid max-w-6xl grid-cols-2 gap-px border-t border-line bg-line md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="bg-bg px-4 py-6 text-center">
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-3xl font-bold text-fg">{s.value}</dd>
                <dd className="mt-1 text-sm text-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ---------- Features ---------- */}
        <Section id="features" eyebrow="Why ForgeStack" title="Starter templates rot. Composed projects don’t.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <article key={f.title} className="rounded-2xl border border-line bg-raised p-6">
                <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{f.body}</p>
              </article>
            ))}
          </div>
        </Section>

        {/* ---------- Tokens ---------- */}
        <Section
          id="savings"
          eyebrow="Save tokens and time"
          title="Let your AI build features, not boilerplate"
          intro="Asking an AI agent to set up a project from zero means it writes dozens of files, installs, hits build errors and fixes them, re-sending its whole context at every step. With ForgeStack it makes one tool call."
        >
          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-raised text-muted">
                <tr>
                  <th scope="col" className="p-4 font-semibold">Project</th>
                  <th scope="col" className="p-4 font-semibold">AI from scratch (tokens)</th>
                  <th scope="col" className="p-4 font-semibold">Time</th>
                  <th scope="col" className="p-4 font-semibold text-accent">With ForgeStack</th>
                </tr>
              </thead>
              <tbody>
                {TOKEN_ROWS.map((r) => (
                  <tr key={r.project} className="border-t border-line">
                    <th scope="row" className="p-4 font-medium">{r.project}</th>
                    <td className="p-4 text-muted">{r.scratch}</td>
                    <td className="p-4 text-muted">{r.time}</td>
                    <td className="p-4 font-semibold text-ok">{r.forge} tokens · &lt;1 min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted">
            Estimates. The generated code alone is 2k–15k tokens of output (measured); agent sessions typically process 10–100× that because
            context is re-sent on every step and build errors take several fix loops. Your numbers depend on model, caching and stack.
          </p>
        </Section>

        {/* ---------- Stack ---------- */}
        <Section id="stack" eyebrow="Supported stack" title="Mix and match every layer" intro="This list is generated from the engine’s own config schema, so it is always current.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STACK.map((g) => (
              <div key={g.group} className="rounded-2xl border border-line bg-raised p-5">
                <h3 className="mb-3 font-semibold">{g.group}</h3>
                <ul className="flex flex-wrap gap-2">
                  {g.items.map((v) => (
                    <li key={v} className="rounded-md border border-line bg-sunken px-2 py-1 text-xs text-muted">
                      {LABELS[v] ?? v}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* ---------- CLI ---------- */}
        <Section id="cli" eyebrow="Command line" title="One command, your choices" intro="No global install needed. Every flag is optional; anything you leave out falls back to a sensible default.">
          <div className="grid gap-5 lg:grid-cols-2">
            {CLI_EXAMPLES.map((ex) => (
              <div key={ex.title}>
                <h3 className="mb-2 text-sm font-semibold text-muted">{ex.title}</h3>
                <CodeBlock code={ex.cmd} label={ex.title} />
              </div>
            ))}
          </div>
        </Section>

        {/* ---------- AI ---------- */}
        <Section
          id="ai"
          eyebrow="AI assistants"
          title="Let your AI scaffold for you"
          intro="ForgeStack ships a local MCP server (no account, no API key, no network calls). Add it once globally and every AI session can create projects for you."
        >
          <ol className="mb-10 grid gap-4 md:grid-cols-3">
            {[
              ['Add the MCP server', 'Pick your tool below. Use the global/user config so it works in every project.'],
              ['Ask in plain language', 'Describe the stack you want; the agent calls forgestack_scaffold_project.'],
              ['Optional: install the skill', 'Teaches the agent ForgeStack’s flags and conventions, without MCP.'],
            ].map(([t, b], i) => (
              <li key={t} className="rounded-2xl border border-line bg-raised p-5">
                <span className="mb-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent text-sm font-bold text-on-accent">{i + 1}</span>
                <h3 className="mb-1 font-semibold">{t}</h3>
                <p className="text-sm text-muted">{b}</p>
              </li>
            ))}
          </ol>

          <div className="grid gap-6 lg:grid-cols-2">
            {AI_TOOLS.map((t) => (
              <div key={t.name}>
                <h3 className="flex items-center gap-2 font-semibold">
                  <Bot size={18} className="text-accent" aria-hidden /> {t.name}
                </h3>
                <p className="mb-2 text-sm text-muted">{t.where}</p>
                <CodeBlock code={t.code} label={`${t.name} config`} />
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="mb-2 font-semibold">Then just ask</h3>
              <CodeBlock code={AI_PROMPT} label="example prompt" />
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Skills (global for Claude Code and Codex)</h3>
              <CodeBlock code={SKILLS_CMD} label="skills command" />
              <p className="mt-2 text-sm text-muted">Run inside a project folder (with “.” instead of “~”) to add skills for any of the {AI_TOOL_NAMES.length} tools below.</p>
            </div>
          </div>

          <h3 className="mb-3 mt-10 font-semibold">{AI_TOOL_NAMES.length} supported AI tools</h3>
          <ul className="flex flex-wrap gap-2">
            {AI_TOOL_NAMES.map((n) => (
              <li key={n} className="rounded-md border border-line bg-raised px-2 py-1 text-xs text-muted">
                {n}
              </li>
            ))}
          </ul>
        </Section>

        {/* ---------- Desktop ---------- */}
        <Section id="desktop" eyebrow="Desktop studio" title="Prefer clicking? There’s an app for that" intro="A Tauri v2 desktop app with curated templates, a 4-step wizard and a live preview of every file before anything is written.">
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              [hubShot, 'Templates Hub listing curated architecture presets with Fast Scaffold buttons', 'Templates hub'],
              [wizardShot, 'Studio wizard step 1 with project name, package manager, architecture choices and a live staged file tree', 'Studio wizard'],
              [settingsShot, 'Settings page with four themes, default path, package manager and git/install toggles', 'Settings'],
            ].map(([src, alt, caption]) => (
              <figure key={caption} className="overflow-hidden rounded-2xl border border-line bg-raised">
                <img src={src} alt={alt} loading="lazy" className="w-full" width={1280} height={820} />
                <figcaption className="flex items-center gap-2 p-3 text-sm text-muted">
                  <Monitor size={14} aria-hidden /> {caption}
                </figcaption>
              </figure>
            ))}
          </div>
          <a href={`${REPO}/releases`} className="mt-6 inline-flex items-center gap-2 rounded-lg border border-line bg-raised px-4 py-2 text-sm font-semibold hover:border-accent">
            <Package size={16} aria-hidden /> Download from GitHub Releases
          </a>
        </Section>

        {/* ---------- Changelog ---------- */}
        <Section id="changelog" eyebrow="Changelog" title="What’s new">
          <Changelog />
        </Section>

        {/* ---------- Contribute ---------- */}
        <Section id="contribute" eyebrow="Open source" title="Help make it better">
          <div className="grid gap-4 md:grid-cols-3">
            <a href={REPO} className="rounded-2xl border border-line bg-raised p-6 hover:border-accent">
              <Star className="mb-3 text-accent" aria-hidden />
              <h3 className="mb-1 font-semibold">Star the repo</h3>
              <p className="text-sm text-muted">If ForgeStack saved you an afternoon, a star helps others find it. It genuinely makes a difference.</p>
            </a>
            <a href={`${REPO}/issues/new`} className="rounded-2xl border border-line bg-raised p-6 hover:border-accent">
              <Bug className="mb-3 text-accent" aria-hidden />
              <h3 className="mb-1 font-semibold">Report an issue</h3>
              <p className="text-sm text-muted">Found a combination that doesn’t build or a rough edge? Open an issue with the command you ran.</p>
            </a>
            <a href={`${REPO}/pulls`} className="rounded-2xl border border-line bg-raised p-6 hover:border-accent">
              <GitPullRequest className="mb-3 text-accent" aria-hidden />
              <h3 className="mb-1 font-semibold">Send a pull request</h3>
              <p className="text-sm text-muted">New stack options, fixes and docs are welcome. The test matrix tells you if anything breaks.</p>
            </a>
          </div>
        </Section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-muted sm:px-6">
          <p className="flex items-center gap-2">
            <Workflow size={16} aria-hidden /> ForgeStack · MIT License
          </p>
          <a href={REPO} className="flex items-center gap-2 hover:text-fg">
            <GitHubMark /> umesh-saini/forgestack
          </a>
        </div>
      </footer>
    </>
  );
}
