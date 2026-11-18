import React from 'react';
import {
  Code2,
  Box,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Workflow,
} from 'lucide-react';

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  badge: string;
  description: string;
  bullets: string[];
}

const FEATURES: FeatureCard[] = [
  {
    icon: <Code2 className="w-6 h-6 text-orange-500" />,
    title: 'AST Recipe Compositor',
    badge: 'No String Concatenation',
    description:
      'Unlike legacy CLI scaffolders that concatenate raw text or clone brittle git submodules, ForgeStack inspects and mutates Abstract Syntax Trees directly.',
    bullets: [
      'Atomic JSON dependency merging with zero version drift',
      'TypeScript compiler options and path mappings injected programmatically',
      'Context-aware Tailwind CSS v4 design token synthesis',
    ],
  },
  {
    icon: <Box className="w-6 h-6 text-cyan-400" />,
    title: 'Zero-Collision In-Memory VFS',
    badge: 'RAM-Only Compilation',
    description:
      'All virtual files, directories, and executable bits are staged, inspected, and patched in memory before touching physical storage.',
    bullets: [
      'Pre-flight write permission and directory collision checks',
      '100% browser-safe runtime for instant Monaco editor preview',
      'Transactional disk rollback if physical write encounters an error',
    ],
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
    title: 'Day-One Multi-Engine AI Governance',
    badge: 'Spec-Driven Delivery',
    description:
      'Scaffold projects that autonomous AI coding agents immediately understand and respect without hallucinating or breaking architectural boundaries.',
    bullets: [
      'OpenSpec spec-driven change management (.openspec/specs/)',
      'Open-GSD milestone roadmaps & requirements (gsd/)',
      'GitHub Spec-Kit constitution, prompts, and task runners',
    ],
  },
  {
    icon: <Cpu className="w-6 h-6 text-purple-400" />,
    title: 'Native Desktop Engine (Tauri v2)',
    badge: 'Hardware Access & Rust Core',
    description:
      'A cross-platform native application for developers wanting visual scaffolding combined with direct local hardware permissions.',
    bullets: [
      'Direct atomic file writes to physical disk without cloud latency',
      'Automated background child processes (git init, pnpm install)',
      'Root-aware Debian & AppImage cryptographic auto-updater',
    ],
  },
];

export const FeatureSpotlight: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 relative">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Heading */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20 text-xs font-mono font-bold uppercase tracking-wider">
            <Workflow className="w-3.5 h-3.5" />
            <span>Architectural Rigor</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--text-main)]">
            Engineered for Systems-Grade Stability
          </h2>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-[var(--text-muted)]">
            Explore the technical mechanics powering ForgeStack's zero-merge-conflict composition engine.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((feat, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl ui-panel border shadow-lg hover:border-orange-500/30 transition-all space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl ui-card-subtle border">{feat.icon}</div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-white/5 border text-[var(--text-muted)]">
                  {feat.badge}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-[var(--text-main)]">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)] text-xs font-mono">
                {feat.bullets.map((bullet, bIdx) => (
                  <div key={bIdx} className="flex items-start gap-2 text-[var(--text-muted)]">
                    <span className="text-orange-500 font-bold">›</span>
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
