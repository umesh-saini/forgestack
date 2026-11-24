import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { LABELS, REPO } from '../content.js';
import { AI_TOOL_NAMES, PACKAGE_MANAGERS, SAMPLES, STACK, TOPOLOGIES } from '../data.js';
import { EASE, SectionHead, cx } from '../ui.js';

const label = (v: string) => LABELS[v] ?? v;
const short = (v: string) => label(v).replace(/\s*\(.*\)$/, '');

/* ───────────────────────── Verification ───────────────────────── */

const LEVELS = [
  {
    level: 'Static',
    coverage: 'Every option combination, 636k+',
    runs: 'Imports resolve, every dependency is declared, every script points at something real.',
    cadence: 'Every push',
  },
  {
    level: 'Runtime',
    coverage: 'Pairwise sample, about 100 projects',
    runs: 'Install, build, lint, migrate, start, then probe against real PostgreSQL, MongoDB and Redis.',
    cadence: 'Nightly',
  },
  {
    level: 'AI targets',
    coverage: `${AI_TOOL_NAMES.length} tools`,
    runs: 'Tests check each tool’s skill file format and install path.',
    cadence: 'Every push',
  },
];

export function Verification() {
  return (
    <section id="verified" aria-labelledby="verified-title" className="mx-auto max-w-[1360px] px-5 py-20 sm:px-10 sm:py-28">
      <SectionHead
        id="verified"
        title="Generated, then proven to run"
        lede="Template repositories rot because nobody runs every variant. ForgeStack composes projects from small slices and runs the combinations."
      />
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-[14px]">
            <thead>
              <tr className="border-b border-line-2 text-[13px] text-faint">
                <th scope="col" className="py-3 pr-4 font-medium">Level</th>
                <th scope="col" className="py-3 pr-4 font-medium">Coverage</th>
                <th scope="col" className="py-3 pr-4 font-medium">What runs</th>
                <th scope="col" className="py-3 font-medium">Cadence</th>
              </tr>
            </thead>
            <tbody>
              {LEVELS.map((l, i) => (
                <motion.tr
                  key={l.level}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.45, ease: EASE }}
                  className="border-b border-line align-top"
                >
                  <th scope="row" className="py-5 pr-4 text-[15px] font-medium">{l.level}</th>
                  <td className="py-5 pr-4 font-mono text-[13px]">{l.coverage}</td>
                  <td className="py-5 pr-4 text-muted">{l.runs}</td>
                  <td className="whitespace-nowrap py-5 text-muted">{l.cadence}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          <a href={`${REPO}/tree/main/scripts/matrix`} className="mt-5 inline-flex items-center gap-1 text-[14px] text-muted underline decoration-line-2 underline-offset-4 hover:text-fg">
            Read the matrix scripts <ArrowUpRight size={14} />
          </a>
        </div>

        <PairGrid />
      </div>
    </section>
  );
}

/** Every architecture × package manager pair, filled as it enters view. Pairwise sampling covers each pair at least once. */
function PairGrid() {
  return (
    <figure>
      <div className="grid gap-px border border-line bg-line" style={{ gridTemplateColumns: `minmax(0,1fr) repeat(${PACKAGE_MANAGERS.length}, 48px)` }}>
        <div className="bg-main" />
        {PACKAGE_MANAGERS.map((pm) => (
          <div key={pm} className="flex h-9 items-center justify-center bg-main font-mono text-[12px] text-muted">
            {pm}
          </div>
        ))}
        {TOPOLOGIES.map((t, r) => (
          <div key={t} className="contents">
            <div className="flex h-8 items-center truncate bg-main px-3 text-[13px] text-muted" title={label(t)}>{short(t)}</div>
            {PACKAGE_MANAGERS.map((pm, c) => (
              <div key={pm} className="relative h-8 bg-main">
                <motion.span
                  className="absolute inset-[5px] bg-accent"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: 0.15 + (r * PACKAGE_MANAGERS.length + c) * 0.018, duration: 0.18, ease: 'linear' }}
                  style={{ originX: 0 }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      <figcaption className="mt-3 text-[13px] text-faint">
        {TOPOLOGIES.length} architectures × {PACKAGE_MANAGERS.length} package managers. The nightly pairwise sample builds and starts every pair at least once.
      </figcaption>
    </figure>
  );
}

/* ───────────────────────── Stack rail ───────────────────────── */

export function StackRail() {
  const railRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const [sample, setSample] = useState<string | null>(SAMPLES[0].id);
  const active = new Set<string>(SAMPLES.find((s) => s.id === sample)?.values ?? []);
  const total = STACK.reduce((n, g) => n + g.items.length, 0);

  const nudge = (dir: 1 | -1) => railRef.current?.scrollBy({ left: dir * 300, behavior: 'smooth' });

  return (
    <section id="stack" aria-labelledby="stack-title" className="border-y border-line bg-surface py-20 sm:py-24">
      <div className="mx-auto max-w-[1360px] px-5 sm:px-10">
        <SectionHead
          id="stack"
          title="Every layer, in any combination"
          lede={`${total} options across ${STACK.length} layers, read from the engine’s config schema. Pick a sample to see one configuration across the layers.`}
          aside={
            <div className="flex flex-wrap items-center gap-1">
              <div role="radiogroup" aria-label="Sample configuration" className="mr-3 flex flex-wrap">
                {SAMPLES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    role="radio"
                    aria-checked={sample === s.id}
                    data-selected={sample === s.id}
                    onClick={() => setSample(sample === s.id ? null : s.id)}
                    className="wipe h-9 rounded-2 px-3 text-[14px]"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
              <button type="button" aria-label="Scroll layers left" onClick={() => nudge(-1)} className="flex h-9 w-9 items-center justify-center rounded-2 border border-line text-muted hover:text-fg">
                <ArrowLeft size={16} />
              </button>
              <button type="button" aria-label="Scroll layers right" onClick={() => nudge(1)} className="flex h-9 w-9 items-center justify-center rounded-2 border border-line text-muted hover:text-fg">
                <ArrowRight size={16} />
              </button>
            </div>
          }
        />
      </div>

      <div
        ref={railRef}
        tabIndex={0}
        role="region"
        aria-label="Supported options by layer"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') nudge(1);
          if (e.key === 'ArrowLeft') nudge(-1);
        }}
        className="no-scrollbar flex cursor-grab snap-x gap-px overflow-x-auto border-y border-line bg-line px-[max(20px,calc((100vw-1360px)/2+40px))] active:cursor-grabbing"
        onPointerDown={(e) => {
          if (e.pointerType !== 'mouse') return;
          drag.current = { x: e.clientX, left: railRef.current!.scrollLeft, moved: false };
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          const dx = e.clientX - drag.current.x;
          if (Math.abs(dx) > 3) drag.current.moved = true;
          railRef.current!.scrollLeft = drag.current.left - dx;
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerLeave={() => (drag.current = null)}
      >
        {STACK.map((g, gi) => (
          <motion.div
            key={g.group}
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: gi * 0.05, duration: 0.45, ease: EASE }}
            className="w-[248px] shrink-0 snap-start select-none bg-main"
          >
            <div className="flex h-12 items-center justify-between border-b border-line px-4">
              <h3 className="text-[14px] font-medium">{g.group}</h3>
              <span className="font-mono text-[12px] text-faint">{g.items.length}</span>
            </div>
            <ul className="flex flex-col gap-px p-2">
              {g.items.map((v) => (
                <li key={v} data-selected={active.has(v)} className={cx('wipe flex min-h-8 items-center rounded-1 px-2 py-1 text-[13.5px] leading-[1.3]', !active.has(v) && 'text-muted')}>
                  {label(v)}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
      <p className="mx-auto mt-4 max-w-[1360px] px-5 text-[13px] text-faint sm:px-10">Drag or scroll sideways. Incompatible picks are rejected with a reason, e.g. SQLite with Mongoose.</p>
    </section>
  );
}
