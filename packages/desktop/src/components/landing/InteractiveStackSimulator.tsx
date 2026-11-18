import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Database,
  ShieldCheck,
  Cpu,
  Zap,
  ArrowRight,
  Code2,
  FileCode,
  CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const InteractiveStackSimulator: React.FC = () => {
  const navigate = useNavigate();

  const [topology, setTopology] = useState<'monorepo' | 'nextjs-fullstack' | 'electron-desktop' | 'separate-folders'>('monorepo');
  const [frontend, setFrontend] = useState<'react-vite' | 'nextjs'>('react-vite');
  const [database, setDatabase] = useState<'postgres-drizzle' | 'postgres-prisma' | 'mongodb'>('postgres-drizzle');
  const [governance, setGovernance] = useState<'openspec' | 'gsd' | 'speckit'>('openspec');

  // Computed metrics based on interactive selections
  const computedFiles =
    topology === 'monorepo' ? 42 : topology === 'nextjs-fullstack' ? 34 : topology === 'electron-desktop' ? 38 : 31;
  const computedVfsTime = '< 180ms';

  const handleLaunchStudio = () => {
    navigate('/new');
  };

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 relative">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Section Heading */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Interactive Simulator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--text-main)]">
            Compose Your Architecture in Real-Time
          </h2>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-[var(--text-muted)]">
            Test drive ForgeStack's in-memory compositor directly in your browser. Toggle archetypes,
            databases, and AI governance engines to preview instantaneous VFS synthesis.
          </p>
        </div>

        {/* 4-in-1 Interactive Simulator Card */}
        <div className="ui-panel rounded-3xl border shadow-2xl p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Controls: 4 Toggles */}
            <div className="lg:col-span-7 space-y-6">
              {/* Control 1: Topology */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-orange-500" />
                  <span>1. Architecture Topology</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'monorepo', label: 'Turborepo Monorepo', badge: 'Recommended' },
                    { id: 'nextjs-fullstack', label: 'Next.js 15 Full-Stack', badge: 'App Router' },
                    { id: 'electron-desktop', label: 'Electron Desktop App', badge: 'Desktop GUI' },
                    { id: 'separate-folders', label: 'Polyrepo (FE & BE)', badge: 'Clean Folders' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setTopology(item.id as any);
                        if (item.id === 'nextjs-fullstack') setFrontend('nextjs');
                        else if (frontend === 'nextjs') setFrontend('react-vite');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        topology === item.id
                          ? 'border-orange-500/50 bg-orange-500/10 font-bold shadow-sm'
                          : 'ui-card-subtle opacity-70 hover:opacity-100 hover:border-[var(--border-hover)]'
                      }`}
                    >
                      <div className="text-xs text-[var(--text-main)]">{item.label}</div>
                      <span className="text-[10px] text-orange-400 font-mono">{item.badge}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Control 2: Frontend */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>2. Frontend Framework & Styling</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFrontend('react-vite')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      frontend === 'react-vite'
                        ? 'border-cyan-500/50 bg-cyan-500/10 font-bold'
                        : 'ui-card-subtle opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="text-xs text-[var(--text-main)]">React 19 + Tailwind v4</div>
                    <span className="text-[10px] text-cyan-400 font-mono">TanStack Query v5 + Sonner</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFrontend('nextjs');
                      setTopology('nextjs-fullstack');
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      frontend === 'nextjs'
                        ? 'border-cyan-500/50 bg-cyan-500/10 font-bold'
                        : 'ui-card-subtle opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="text-xs text-[var(--text-main)]">Next.js 15 App Router</div>
                    <span className="text-[10px] text-cyan-400 font-mono">Server Actions + TypeScript</span>
                  </button>
                </div>
              </div>

              {/* Control 3: Database & ORM */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-amber-400" />
                  <span>3. Database & Type-Safe ORM</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'postgres-drizzle', name: 'PostgreSQL', orm: 'Drizzle ORM' },
                    { id: 'postgres-prisma', name: 'PostgreSQL', orm: 'Prisma Client' },
                    { id: 'mongodb', name: 'MongoDB', orm: 'Mongoose ODM' },
                  ].map((db) => (
                    <button
                      key={db.id}
                      type="button"
                      onClick={() => setDatabase(db.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        database === db.id
                          ? 'border-amber-500/50 bg-amber-500/10 font-bold'
                          : 'ui-card-subtle opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="text-xs text-[var(--text-main)]">{db.name}</div>
                      <span className="text-[10px] text-amber-400 font-mono">{db.orm}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Control 4: AI Governance */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>4. Day-One AI Governance Engine</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'openspec', name: 'OpenSpec', sub: 'Spec-Driven Delta' },
                    { id: 'gsd', name: 'Open-GSD', sub: 'Milestone Roadmap' },
                    { id: 'speckit', name: 'Spec-Kit', sub: 'GitHub Constitution' },
                  ].map((gov) => (
                    <button
                      key={gov.id}
                      type="button"
                      onClick={() => setGovernance(gov.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        governance === gov.id
                          ? 'border-indigo-500/50 bg-indigo-500/10 font-bold'
                          : 'ui-card-subtle opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="text-xs text-[var(--text-main)]">{gov.name}</div>
                      <span className="text-[10px] text-indigo-400 font-mono">{gov.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Display: Live Synthesized Architecture Blueprint */}
            <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl ui-input border space-y-6 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-xs font-bold text-[var(--text-main)] flex items-center gap-2">
                    <Zap className="w-4 h-4 text-orange-500" />
                    <span>In-Memory Synthesis Blueprint</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Live Reactive VFS
                  </span>
                </div>

                {/* Architecture Topology Flow */}
                <div className="space-y-2.5 font-mono text-xs">
                  <div className="p-2.5 rounded-xl ui-card-subtle border flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Topology:</span>
                    <span className="font-bold text-orange-400">{topology}</span>
                  </div>

                  <div className="p-2.5 rounded-xl ui-card-subtle border flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Frontend:</span>
                    <span className="font-bold text-cyan-400">
                      {frontend === 'nextjs' ? 'Next.js 15 (App Router)' : 'React 19 + Tailwind v4'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl ui-card-subtle border flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Database & ORM:</span>
                    <span className="font-bold text-amber-400">{database}</span>
                  </div>

                  <div className="p-2.5 rounded-xl ui-card-subtle border flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">AI Governance:</span>
                    <span className="font-bold text-indigo-400">{governance}</span>
                  </div>
                </div>

                {/* 3 Stats Pills */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="p-3 rounded-xl ui-card-subtle border text-center">
                    <div className="text-lg font-mono font-bold text-[var(--text-main)]">
                      {computedFiles} files
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)]">Virtual In-Memory Staging</div>
                  </div>
                  <div className="p-3 rounded-xl ui-card-subtle border text-center">
                    <div className="text-lg font-mono font-bold text-emerald-400">
                      {computedVfsTime}
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)]">AST Compositor Latency</div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleLaunchStudio}
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-orange-600/30"
              >
                <span>Launch in Studio Wizard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
