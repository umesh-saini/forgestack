import React, { useState } from 'react';
import {
  Monitor,
  Code2,
  Layers,
  Sparkles,
  RotateCw,
  FolderTree,
  Terminal,
  Check,
  CheckCircle2,
  Sliders,
  FileCode,
  Download,
} from 'lucide-react';

export const DesktopAppShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'monaco' | 'templates' | 'stepper' | 'settings'>('stepper');

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 relative border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/20">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Section Heading */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono font-bold uppercase tracking-wider">
            <Monitor className="w-3.5 h-3.5" />
            <span>Native Desktop Experience</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--text-main)]">
            ForgeStack Studio Desktop Suite
          </h2>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-[var(--text-muted)]">
            Explore the native Tauri v2 desktop environment. Built with real-time Monaco code editing,
            atomic physical disk synthesis, and root-aware packaging detection.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {[
            { id: 'stepper', label: '4-Step Stepper Studio & Monaco View', icon: <Sliders className="w-3.5 h-3.5" /> },
            { id: 'templates', label: 'Templates & Curated Presets Hub', icon: <Layers className="w-3.5 h-3.5" /> },
            { id: 'settings', label: 'Universal AI Agent Skills & Settings', icon: <Sparkles className="w-3.5 h-3.5" /> },
            { id: 'monaco', label: 'In-Memory VFS Code Inspector', icon: <Code2 className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                  : 'ui-card-subtle border text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--border-hover)]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Desktop Application Window Mockup */}
        <div className="ui-panel rounded-2xl border shadow-2xl overflow-hidden ring-1 ring-white/10">
          {/* OS Window Header Bar */}
          <div className="h-10 px-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between select-none">
            {/* Traffic Lights */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>

            {/* Window Title */}
            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
              <span className="font-bold text-slate-200">ForgeStack Studio</span>
              <span>—</span>
              <span className="text-orange-400 font-medium">
                {activeTab === 'stepper' && 'Progressive 4-Step Architecture Synthesis & Monaco Preview'}
                {activeTab === 'templates' && 'Templates Hub & Fast Scaffolder'}
                {activeTab === 'settings' && 'Universal AI Agent Skills Setup & App Settings'}
                {activeTab === 'monaco' && 'Integrated Monaco Studio Workspace'}
              </span>
            </div>

            <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              v1.0.0 (Linux x86_64)
            </div>
          </div>

          {/* Window Canvas / Interactive Screen */}
          <div className="min-h-[420px] p-3 sm:p-5 bg-[var(--bg-main)]">
            {/* SCREEN 1: Stepper Studio & Monaco Editor */}
            {activeTab === 'stepper' && (
              <div className="space-y-3">
                <div className="rounded-xl overflow-hidden border border-slate-700/60 shadow-xl bg-slate-950">
                  <img
                    src="/screenshots/stepper-studio.png"
                    alt="ForgeStack 4-Step Stepper Studio"
                    className="w-full h-auto object-cover max-h-[580px] rounded-xl hover:scale-[1.01] transition-transform duration-300"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)] px-1">
                  <span>Actual Studio Interface: 4-Step Stepper Wizard paired with live Monaco code editor</span>
                  <span className="text-orange-400 font-mono">100% In-Memory VFS Reactivity</span>
                </div>
              </div>
            )}

            {/* SCREEN 2: Templates Hub */}
            {activeTab === 'templates' && (
              <div className="space-y-3">
                <div className="rounded-xl overflow-hidden border border-slate-700/60 shadow-xl bg-slate-950">
                  <img
                    src="/screenshots/templates-hub.png"
                    alt="ForgeStack Templates and Curated Presets Hub"
                    className="w-full h-auto object-cover max-h-[580px] rounded-xl hover:scale-[1.01] transition-transform duration-300"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)] px-1">
                  <span>Actual Studio Interface: Curated presets, custom template management, and instant fast-scaffold</span>
                  <span className="text-cyan-400 font-mono">Instant Scaffold Dialog</span>
                </div>
              </div>
            )}

            {/* SCREEN 3: Universal AI Agent Skills & Settings */}
            {activeTab === 'settings' && (
              <div className="space-y-3">
                <div className="rounded-xl overflow-hidden border border-slate-700/60 shadow-xl bg-slate-950">
                  <img
                    src="/screenshots/app-settings.png"
                    alt="ForgeStack AI Agent Skills and Settings"
                    className="w-full h-auto object-cover max-h-[580px] rounded-xl hover:scale-[1.01] transition-transform duration-300"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)] px-1">
                  <span>Actual Studio Interface: Universal AI skills provisioner, theme picker, and packaging status</span>
                  <span className="text-emerald-400 font-mono">8 Agent Ecosystems Supported</span>
                </div>
              </div>
            )}

            {/* SCREEN 4: In-Memory VFS Code Inspector */}
            {activeTab === 'monaco' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[380px] font-mono text-xs">
                {/* File Tree Explorer */}
                <div className="md:col-span-4 ui-card-subtle border rounded-xl p-3 space-y-2 overflow-y-auto">
                  <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] flex items-center justify-between pb-1 border-b">
                    <span>Explorer</span>
                    <span className="text-orange-400">38 staged</span>
                  </div>
                  <div className="space-y-1 text-slate-300">
                    <div className="flex items-center gap-1.5 text-orange-400 font-bold">
                      <span>▾ 📁 apps/web/src</span>
                    </div>
                    <div className="pl-4 flex items-center gap-1.5 text-cyan-400 bg-white/5 py-1 px-1.5 rounded">
                      <FileCode className="w-3.5 h-3.5" />
                      <span>App.tsx</span>
                    </div>
                    <div className="pl-4 flex items-center gap-1.5 opacity-70">
                      <FileCode className="w-3.5 h-3.5" />
                      <span>main.tsx</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-orange-400 font-bold pt-1">
                      <span>▾ 📁 packages/core</span>
                    </div>
                    <div className="pl-4 flex items-center gap-1.5 opacity-70">
                      <FileCode className="w-3.5 h-3.5" />
                      <span>index.ts</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-orange-400 font-bold pt-1">
                      <span>▾ 📁 .agents/skills</span>
                    </div>
                    <div className="pl-4 flex items-center gap-1.5 opacity-70 text-indigo-400">
                      <FileCode className="w-3.5 h-3.5" />
                      <span>SKILL.md</span>
                    </div>
                  </div>
                </div>

                {/* Editor Content Canvas */}
                <div className="md:col-span-8 ui-input border rounded-xl p-4 flex flex-col justify-between overflow-hidden">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b pb-2 text-[11px]">
                      <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5" />
                        <span>apps/web/src/App.tsx</span>
                      </span>
                      <span className="text-emerald-400 text-[10px]">● In-Memory AST Compiled</span>
                    </div>
                    <pre className="text-slate-300 leading-relaxed text-[11px] overflow-x-auto select-all">
                      <code>{`import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export function App() {
  const { data, isLoading } = useQuery({
    queryKey: ['health'],
    queryFn: () => fetch('/api/health').then(r => r.json()),
  });

  return (
    <div className="p-8 font-sans max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-orange-500">
        ForgeStack Enterprise Monorepo
      </h1>
      <p className="text-slate-400 mt-2">
        Synthesized with React 19, Tailwind CSS v4, and Day-One AI Governance.
      </p>
    </div>
  );
}`}</code>
                    </pre>
                  </div>
                  <div className="border-t pt-2 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>UTF-8 • TypeScript React • Prettier Strict</span>
                    <span className="text-orange-400">Zero merge conflicts</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
