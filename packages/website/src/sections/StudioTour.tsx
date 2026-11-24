import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SHOT_SIZE, TOUR } from '../screens.js';
import { EASE, cx, type Theme } from '../ui.js';

const N = TOUR.length;

function useMedia(query: string) {
  const [match, setMatch] = useState(() => typeof matchMedia !== 'undefined' && matchMedia(query).matches);
  useEffect(() => {
    const mq = matchMedia(query);
    const on = () => setMatch(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}

type Panel = (typeof TOUR)[number];

function PanelBody({ p, i, theme }: { p: Panel; i: number; theme?: Theme }) {
  const isLight = theme ? theme === 'light' : typeof document !== 'undefined' && document.documentElement.dataset.theme === 'light';
  return (
    <div className="grid h-full gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <figure className="min-h-0 overflow-hidden rounded-3 border border-line-2 bg-surface">
        <img
          src={p.srcDark ?? p.src}
          alt={`${p.alt} (dark theme)`}
          width={SHOT_SIZE.width}
          height={SHOT_SIZE.height}
          loading={i === 0 ? 'eager' : 'lazy'}
          className={cx('block h-full w-full object-cover object-left-top', isLight && 'hidden')}
        />
        <img
          src={p.srcLight ?? p.src}
          alt={`${p.alt} (light theme)`}
          width={SHOT_SIZE.width}
          height={SHOT_SIZE.height}
          loading={i === 0 ? 'eager' : 'lazy'}
          className={cx('block h-full w-full object-cover object-left-top', !isLight && 'hidden')}
        />
      </figure>
      <div className="flex flex-col">
        <span className="font-mono text-[13px] text-faint">
          {String(i + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
        </span>
        <h3 className="mt-3 text-[24px] font-medium leading-[1.2] tracking-[-0.02em]">{p.title}</h3>
        <p className="mt-3 text-[15px] text-muted">{p.body}</p>
        <dl className="mt-auto border-t border-line pt-1">
          {p.facts.map(([k, v]) => (
            <div key={k} className="flex h-10 items-center justify-between gap-4 border-b border-line text-[14px]">
              <dt className="text-muted">{k}</dt>
              <dd className="truncate font-mono text-[13px]">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function TrackPanel({ p, i, progress, theme }: { p: Panel; i: number; progress: MotionValue<number>; theme?: Theme }) {
  const opacity = useTransform(progress, (v) => 1 - Math.min(1, Math.abs(v * (N - 1) - i)) * 0.65);
  const scale = useTransform(progress, (v) => 1 - Math.min(1, Math.abs(v * (N - 1) - i)) * 0.04);
  return (
    <motion.article style={{ opacity, scale }} className="h-full w-[min(1120px,calc(100vw-160px))] shrink-0" aria-roledescription="slide" aria-label={p.label}>
      <PanelBody p={p} i={i} theme={theme} />
    </motion.article>
  );
}

export function StudioTour({ theme }: { theme?: Theme } = {}) {
  const desktop = useMedia('(min-width: 1024px)');
  const reduced = useMedia('(prefers-reduced-motion: reduce)');
  const pinned = desktop && !reduced;

  return (
    <section id="studio" aria-labelledby="studio-title" className="border-y border-line bg-sunken">
      {pinned ? <PinnedTrack theme={theme} /> : <SnapRail theme={theme} />}
    </section>
  );
}

function TourHeader({ active, onGo }: { active: number; onGo: (i: number) => void }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div>
        <h2 id="studio-title" className="text-[34px] font-medium leading-[1.1] tracking-[-0.025em] sm:text-[40px]">
          ForgeStack Studio
        </h2>
        <p className="mt-2 text-[16px] text-muted">The desktop app for Linux, macOS and Windows. Configure on the left, read the generated project on the right.</p>
      </div>
      <div className="flex flex-wrap items-center gap-1">
        <nav aria-label="Studio tour" className="mr-3 flex flex-wrap">
          {TOUR.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onGo(i)}
              data-selected={i === active}
              aria-current={i === active ? 'step' : undefined}
              className="wipe h-9 rounded-2 px-3 text-[14px]"
            >
              {p.label}
            </button>
          ))}
        </nav>
        <button type="button" aria-label="Previous" onClick={() => onGo(Math.max(0, active - 1))} disabled={active === 0} className="flex h-9 w-9 items-center justify-center rounded-2 border border-line text-muted hover:text-fg disabled:opacity-30">
          <ArrowLeft size={16} />
        </button>
        <button type="button" aria-label="Next" onClick={() => onGo(Math.min(N - 1, active + 1))} disabled={active === N - 1} className="flex h-9 w-9 items-center justify-center rounded-2 border border-line text-muted hover:text-fg disabled:opacity-30">
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function PinnedTrack({ theme }: { theme?: Theme }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(0);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const x = useTransform(progress, (v) => -v * overflow);
  const bar = useTransform(progress, [0, 1], ['0%', '100%']);

  useLayoutEffect(() => {
    const measure = () => {
      if (!trackRef.current || !viewportRef.current) return;
      setOverflow(Math.max(0, trackRef.current.scrollWidth - viewportRef.current.clientWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    if (viewportRef.current) ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', (v) => setActive(Math.round(v * (N - 1))));

  const go = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (travel * i) / (N - 1) + 1, behavior: 'smooth' });
  };

  return (
    <div ref={sectionRef} style={{ height: `${N * 90 + 30}vh` }} className="relative">
      <div className="sticky top-16 flex h-[calc(100vh-64px)] flex-col overflow-hidden py-10">
        <div className="mx-auto w-full max-w-[1360px] px-10">
          <TourHeader active={active} onGo={go} />
          <div className="relative mt-6 h-px bg-line">
            <motion.div style={{ width: bar }} className="absolute inset-y-0 left-0 bg-accent" />
          </div>
        </div>
        <div ref={viewportRef} className="mt-8 min-h-0 flex-1 overflow-hidden">
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex h-full gap-8 pl-[max(40px,calc((100vw-1360px)/2+40px))] pr-[max(40px,calc((100vw-1360px)/2+40px))]"
          >
            {TOUR.map((p, i) => (
              <TrackPanel key={p.id} p={p} i={i} progress={progress} theme={theme} />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function SnapRail({ theme }: { theme?: Theme }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const go = (i: number) => {
    const el = railRef.current?.children[i] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  };

  return (
    <div className="py-16">
      <div className="mx-auto max-w-[1360px] px-5 sm:px-10">
        <TourHeader active={active} onGo={go} />
      </div>
      <div
        ref={railRef}
        onScroll={(e) => {
          const el = e.currentTarget;
          const w = (el.children[0] as HTMLElement | undefined)?.offsetWidth ?? 1;
          setActive(Math.round(el.scrollLeft / (w + 20)));
        }}
        className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 sm:px-10"
      >
        {TOUR.map((p, i) => (
          <motion.article
            key={p.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
            className={cx('w-[86vw] max-w-[760px] shrink-0 snap-start')}
          >
            <PanelBody p={p} i={i} theme={theme} />
          </motion.article>
        ))}
      </div>
    </div>
  );
}
