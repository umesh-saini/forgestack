import React, { useState } from 'react';
import {
  Code2,
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  Box,
  Terminal,
  FolderTree,
  CheckCircle2,
  FileCode,
  ArrowRight,
  GitBranch,
} from 'lucide-react';
import { useThemeAccent } from '../../lib/motion.js';

interface SchematicTab {
  id: string;
  number: string;
  title: string;
  badge: string;
}

const TABS: SchematicTab[] = [
  {
    id: 'ast-vs-clone',
    number: '01',
    title: 'AST Composition Engine',
    badge: 'ZERO MERGE CONFLICTS',
  },
  {
    id: 'vfs-pipeline',
    number: '02',
    title: 'In-Memory VFS Flusher',
    badge: 'RAM STAGING',
  },
  {
    id: 'ai-governance',
    number: '03',
    title: 'Day-One AI Governance',
    badge: '40 AI ECOSYSTEMS',
  },
];

export const ArchitecturalBlueprints: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('ast-vs-clone');
  const accent = useThemeAccent();

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 relative border-t border-[var(--border-color)] bg-[var(--bg-main)]">
      <div className="max-w-[1750px] mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full ui-card-subtle border text-xs font-mono">
            <span className="w-2 h-2 rounded-full" style={{ background: accent }} />
            <span className="font-bold uppercase tracking-wider text-[var(--text-main)]">
              04 · Technical Schematics
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--text-main)]">
            Architectural CAD Blueprints
          </h2>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-[var(--text-muted)]">
            Deep dive into the concrete mechanics of in-memory AST manipulation, transactional rollback,
            and autonomous MCP integration.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-mono transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-orange-600 text-white font-bold shadow-lg shadow-orange-600/25 ring-1 ring-white/20'
                  : 'ui-card-subtle border text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--border-hover)]'
              }`}
            >
              <span className="opacity-70 font-semibold">{tab.number}</span>
              <span>{tab.title}</span>
              <span className="hidden sm:inline text-[9px] px-1.5 py-0.5 rounded bg-black/20 font-mono">
                {tab.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Schematic Display Window */}
        <div className="ui-panel rounded-3xl border border-[var(--border-color)] shadow-2xl p-6 sm:p-10 bg-[var(--bg-surface)]">
          {/* SCHEMATIC 1: AST COMPOSITION VS STATIC CLONING */}
          {activeTab === 'ast-vs-clone' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-mono font-bold">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Programmatic AST Mutation</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
                  Why Static Template Cloners Always Break
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  Legacy scaffolding tools rely on raw string templates or static directory copying.
                  When you combine a database, an auth library, and an RPC protocol, conflicting files overwrite
                  each other, creating syntax errors and broken imports.
                </p>
                <div className="space-y-3 pt-2 font-mono text-xs">
                  <div className="p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-rose-300">
                    <span className="font-bold block text-red-400 pb-1">✗ The Legacy Cloner Failure Mode:</span>
                    Clones fixed files directly to disk → Overwrites tsconfig.json paths → Leaves conflicting dependency versions.
                  </div>
                  <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-300">
                    <span className="font-bold block text-emerald-400 pb-1">✓ The ForgeStack AST Solution:</span>
                    Parses package.json and tsconfig.json as structured trees → Merges dependencies atomically → Zero collisions.
                  </div>
                </div>
              </div>

              {/* Visual CAD Diagram */}
              <div className="lg:col-span-6 p-4 sm:p-6 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] font-mono text-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/5 text-[11px] text-[var(--text-muted)]">
                  <span>SCHEMATIC: AST_RECIPE_PIPELINE.DAG</span>
                  <span className="text-orange-400">STATUS: DETERMINISTIC</span>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span className="text-slate-200">1. Base Topology Slice</span>
                    </div>
                    <span className="text-[10px] text-cyan-400">Turborepo Root + Workspace</span>
                  </div>
                  <div className="flex justify-center text-slate-500">↓ programmatic AST merge</div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-400" />
                      <span className="text-slate-200">2. Backend Framework Slice</span>
                    </div>
                    <span className="text-[10px] text-orange-400">Fastify Modular API + Routes</span>
                  </div>
                  <div className="flex justify-center text-slate-500">↓ AST dependency injection</div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-slate-200">3. ORM & Database Slice</span>
                    </div>
                    <span className="text-[10px] text-emerald-400">PostgreSQL + Drizzle Schema</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCHEMATIC 2: IN-MEMORY VFS FLUSHER */}
          {activeTab === 'vfs-pipeline' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono font-bold">
                  <Box className="w-3.5 h-3.5" />
                  <span>Transactional In-Memory VFS</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
                  100% RAM Staging Before Disk Write
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  Before a single byte touches physical storage, ForgeStack compiles all files in memory.
                  Pre-flight checks verify folder permissions, existing file safety, and path validity.
                  If any stage encounters an issue, the entire transaction rolls back cleanly with zero orphaned files.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs">
                  <div className="p-3 rounded-xl ui-card border space-y-1">
                    <div className="text-[10px] uppercase text-[var(--text-muted)]">Compilation Latency</div>
                    <div className="font-bold text-lg text-cyan-400">&lt; 140ms</div>
                    <div className="text-[10px] opacity-70">RAM-only generation</div>
                  </div>
                  <div className="grid grid-cols-1 p-3 rounded-xl ui-card border space-y-1">
                    <div className="text-[10px] uppercase text-[var(--text-muted)]">Atomic Safety</div>
                    <div className="font-bold text-lg text-emerald-400">Transactional</div>
                    <div className="text-[10px] opacity-70">Pre-flight permission check</div>
                  </div>
                </div>
              </div>

              {/* Interactive File Pipeline Visualizer */}
              <div className="lg:col-span-6 p-4 sm:p-6 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] font-mono text-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/5 text-[11px] text-[var(--text-muted)]">
                  <span>VFS PIPELINE STAGES</span>
                  <span className="text-cyan-400 font-bold">ATOMIC GUARANTEE</span>
                </div>
                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between">
                    <span className="font-bold text-cyan-300">STAGE 1: RAM Compilation</span>
                    <span className="text-[10px] text-cyan-400">42 files staged in RAM</span>
                  </div>
                  <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-between">
                    <span className="font-bold text-orange-300">STAGE 2: Pre-Flight Safety</span>
                    <span className="text-[10px] text-orange-400">Write permissions verified</span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                    <span className="font-bold text-emerald-300">STAGE 3: Atomic Disk Flush</span>
                    <span className="text-[10px] text-emerald-400">Tauri Rust IPC / Web ZIP</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCHEMATIC 3: DAY-ONE AI GOVERNANCE */}
          {activeTab === 'ai-governance' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Universal AI Compatibility</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
                  40 AI Ecosystems Pre-Configured
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  Every scaffolded project includes the canonical open standard skill file
                  at <code className="text-orange-400 font-mono">.agents/skills/forgestack/SKILL.md</code> plus
                  dedicated rules for Antigravity, Claude Code, Cursor, Devin, Zed, Trae, Copilot, Qwen, Codex, and all 40 AI ecosystems supported by OpenSpec.
                  Autonomous agents understand your monorepo topology from the first second.
                </p>
                <div className="p-3 rounded-xl ui-card border space-y-2 font-mono text-xs">
                  <div className="font-bold text-emerald-400">Autonomous Model Context Protocol (MCP):</div>
                  <div className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                    Includes a zero-OAuth local stdio MCP server (<code className="text-slate-200">forgestack-mcp</code>).
                    AI agents can list stack presets, validate configurations, preview VFS trees, and execute scaffolding directly.
                  </div>
                </div>
              </div>

              {/* Supported AI Ecosystem Grid */}
              <div className="lg:col-span-6 p-4 sm:p-6 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] font-mono text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/5 text-[11px] text-[var(--text-muted)]">
                  <span>PROVISIONED AGENT TARGETS</span>
                  <span className="text-emerald-400 font-bold">40 TOOLS SUPPORTED</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                  {[
                    'Shared .agents',
                    'Antigravity',
                    'Claude Code',
                    'Cursor IDE',
                    'Devin Desktop',
                    'GitHub Copilot',
                    'Cline / Roo Code',
                    'Continue.dev',
                    'Zed Agent',
                    'Trae IDE',
                    'Gemini CLI',
                    'Amazon Q Dev',
                    'Qwen Code',
                    'OpenCode',
                    'Codex / OpenAI',
                    'Zoo Code',
                    'Kiro',
                    'Lingma',
                  ].map((agent) => (
                    <div
                      key={agent}
                      className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-300 flex items-center gap-1.5 truncate"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span className="truncate">{agent}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 text-center text-[10px] text-[var(--text-muted)]">
                  + 22 more AI assistants fully integrated with interactive CLI & studio picker
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
