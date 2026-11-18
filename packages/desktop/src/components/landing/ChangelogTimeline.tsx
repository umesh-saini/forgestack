import React from 'react';
import { Sparkles, CheckCircle2, History, Tag, ArrowUpRight } from 'lucide-react';

interface ReleaseItem {
  version: string;
  date: string;
  status: 'current' | 'upcoming';
  headline: string;
  highlights: string[];
}

const RELEASES: ReleaseItem[] = [
  {
    version: 'v1.0.0',
    date: 'November 2026',
    status: 'current',
    headline: 'Certified Production Release: Multi-Platform Tauri v2 + Monorepo Core',
    highlights: [
      'In-Memory Virtual File System (VFS) with atomic disk flushing and transactional rollback',
      'Dual runtime targeting: Node.js CLI flusher + browser-safe pure memory AST compositor',
      'Native Desktop Linux bundles: Debian package (.deb), RedHat (.rpm), and standalone AppImage',
      'Tauri v2 cryptographic auto-updater with root-aware /usr/bin Debian fallback detection',
      'Interactive Stepper Studio with live Monaco editor and customizable templates dashboard',
      'Next.js 15 App Router and Electron Desktop (electron-vite) scaffolding slices',
      '100% test coverage with 40 passing test suites (131 tests)',
    ],
  },
  {
    version: 'v1.1.0',
    date: 'Preview / Active Development',
    status: 'upcoming',
    headline: 'Universal AI Agent Skills & Zero-OAuth Model Context Protocol',
    highlights: [
      'Universal AI Agent Skills exporter for 8 ecosystems (Shared, Antigravity, Claude, Cursor, Windsurf, Copilot, Cline, Continue)',
      'Local stdio Model Context Protocol (MCP) server for direct autonomous AI tool invocation without OAuth',
      'Flagship interactive showcase landing page with live in-browser stack simulator',
      'Dynamic SvelteKit and Remix fullstack framework adapter slices',
    ],
  },
];

export const ChangelogTimeline: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 relative">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Section Heading */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20 text-xs font-mono font-bold uppercase tracking-wider">
            <History className="w-3.5 h-3.5" />
            <span>Release History & Roadmap</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--text-main)]">
            Architectural Evolution
          </h2>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-[var(--text-muted)]">
            Track ForgeStack's verified releases and upcoming core capabilities.
          </p>
        </div>

        {/* Timeline Stack */}
        <div className="space-y-6">
          {RELEASES.map((rel, idx) => (
            <div
              key={idx}
              className={`p-6 sm:p-8 rounded-2xl border ui-panel space-y-4 ${
                rel.status === 'current'
                  ? 'border-orange-500/40 shadow-lg shadow-orange-500/5'
                  : 'border-[var(--border-subtle)] opacity-90'
              }`}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-base font-extrabold text-orange-500">
                    {rel.version}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase border ${
                      rel.status === 'current'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                    }`}
                  >
                    {rel.status === 'current' ? 'Production Certified' : 'Upcoming Preview'}
                  </span>
                </div>
                <span className="text-xs font-mono text-[var(--text-muted)]">{rel.date}</span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-[var(--text-main)]">
                {rel.headline}
              </h3>

              <ul className="space-y-2 pt-2 border-t border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
                {rel.highlights.map((item, hIdx) => (
                  <li key={hIdx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
