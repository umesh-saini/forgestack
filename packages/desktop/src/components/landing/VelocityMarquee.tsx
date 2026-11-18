import React from 'react';
import {
  Layers,
  Cpu,
  Database,
  ShieldCheck,
  Terminal,
  Zap,
  Sparkles,
  Bot,
  Box,
  Code2,
} from 'lucide-react';

interface TechItem {
  icon: React.ReactNode;
  label: string;
  category: string;
  color: string;
}

const TECH_ITEMS: TechItem[] = [
  { icon: <Layers className="w-4 h-4 text-orange-500" />, label: 'Turborepo Monorepo', category: 'Topology', color: 'border-orange-500/20' },
  { icon: <Code2 className="w-4 h-4 text-cyan-400" />, label: 'React 19 + Tailwind v4', category: 'Frontend', color: 'border-cyan-500/20' },
  { icon: <Zap className="w-4 h-4 text-emerald-400" />, label: 'Next.js 15 App Router', category: 'Fullstack', color: 'border-emerald-500/20' },
  { icon: <Cpu className="w-4 h-4 text-purple-400" />, label: 'Fastify 5 Modular API', category: 'Backend', color: 'border-purple-500/20' },
  { icon: <Database className="w-4 h-4 text-amber-400" />, label: 'PostgreSQL + Drizzle ORM', category: 'Database', color: 'border-amber-500/20' },
  { icon: <ShieldCheck className="w-4 h-4 text-rose-400" />, label: 'Better-Auth Type-Safe Sessions', category: 'Security', color: 'border-rose-500/20' },
  { icon: <Bot className="w-4 h-4 text-blue-400" />, label: 'Zero-OAuth MCP Server', category: 'AI Tools', color: 'border-blue-500/20' },
  { icon: <Sparkles className="w-4 h-4 text-indigo-400" />, label: 'Day-One OpenSpec Governance', category: 'Governance', color: 'border-indigo-500/20' },
  { icon: <Terminal className="w-4 h-4 text-teal-400" />, label: 'Playwright E2E Suite', category: 'Testing', color: 'border-teal-500/20' },
  { icon: <Box className="w-4 h-4 text-orange-400" />, label: 'Tauri v2 Native Rust Core', category: 'Desktop', color: 'border-orange-500/20' },
];

export const VelocityMarquee: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden py-4 border-y border-[var(--border-subtle)] bg-[var(--bg-surface)]/40 backdrop-blur-sm select-none">
      {/* Gradient masks for smooth edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[var(--bg-main)] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[var(--bg-main)] to-transparent z-10 pointer-events-none" />

      <div className="flex w-max animate-marquee space-x-4">
        {[...TECH_ITEMS, ...TECH_ITEMS, ...TECH_ITEMS].map((item, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl ui-card-subtle border ${item.color} shrink-0 hover:scale-[1.02] transition-transform`}
          >
            {item.icon}
            <span className="text-xs font-semibold text-[var(--text-main)]">{item.label}</span>
            <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-black/20 dark:bg-white/10 text-[var(--text-muted)] font-medium">
              {item.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
