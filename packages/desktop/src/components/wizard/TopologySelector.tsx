import React from 'react';
import { Check, Cpu, Layers, Monitor, Server, FolderTree } from 'lucide-react';
import type { ArchitectureTopology } from '@forgestack/core/browser';
import { Badge } from '../common/Badge.js';

interface Props {
  value: ArchitectureTopology;
  onChange: (value: ArchitectureTopology) => void;
}

export const TopologySelector: React.FC<Props> = ({ value, onChange }) => {
  const topologies: {
    id: ArchitectureTopology;
    title: string;
    tagline: string;
    desc: string;
    badges: string[];
    icon: React.ReactNode;
  }[] = [
    {
      id: 'monorepo',
      title: 'Enterprise Monorepo',
      tagline: 'Turborepo + pnpm Workspaces',
      desc: 'Shared contracts (@repo/contracts), UI library (@repo/ui), React 19 web app, and Fastify/Express backend.',
      badges: ['apps/web', 'apps/api', 'packages/contracts', 'turbo.json'],
      icon: <Layers className="w-5 h-5 text-blue-500" />,
    },
    {
      id: 'separate-folders',
      title: 'Separate Polyrepo',
      tagline: 'Dedicated frontend/ & backend/ folders',
      desc: 'Clean project root containing isolated frontend/ and backend/ directories with independent package configs.',
      badges: ['frontend/', 'backend/', 'Independent ESM', 'Polyrepo'],
      icon: <FolderTree className="w-5 h-5 text-emerald-500" />,
    },
    {
      id: 'ai-agent-rag',
      title: 'AI Agent & RAG Monorepo',
      tagline: 'pgvector + Tool Calling + MCP',
      desc: 'Full-stack AI workspace with PostgreSQL vector search, OpenAI tool-calling agent, and Model Context Protocol.',
      badges: ['apps/api', 'apps/web', 'pgvector', 'MCP Server'],
      icon: <Cpu className="w-5 h-5 text-purple-500" />,
    },
    {
      id: 'tauri-desktop',
      title: 'Native Tauri v2 Desktop',
      tagline: 'Rust + React 19 + Vite',
      desc: 'Ultra-lightweight native cross-platform desktop application with Rust core and React 19 renderer.',
      badges: ['src-tauri/', 'src/', 'Rust Core', 'React 19'],
      icon: <Monitor className="w-5 h-5 text-amber-500" />,
    },
    {
      id: 'distributed-worker',
      title: 'Distributed Worker Queue',
      tagline: 'Fastify + BullMQ + Redis',
      desc: 'Asynchronous background task processing pipeline with BullMQ worker and Redis Docker container.',
      badges: ['BullMQ', 'Redis', 'Fastify', 'Docker'],
      icon: <Server className="w-5 h-5 text-rose-500" />,
    },
    {
      id: 'micro-frontend',
      title: 'Micro-Frontend Federation',
      tagline: 'apps/shell + apps/web + federation',
      desc: 'Micro-frontend architecture splitting core shell from autonomous micro-applications and shared UI primitives.',
      badges: ['apps/shell', 'apps/web', 'Federation', 'Turborepo'],
      icon: <Cpu className="w-5 h-5 text-cyan-500" />,
    },
    {
      id: 'standalone-fe',
      title: 'Modern Frontend SPA',
      tagline: 'React 19 + TypeScript + Vite',
      desc: 'High-performance clientside application with Tailwind CSS v4, Lucide/Tabler icons, and modern state management.',
      badges: ['React 19', 'Vite 6', 'Tailwind v4', 'Single Package'],
      icon: <Monitor className="w-5 h-5 text-indigo-500" />,
    },
    {
      id: 'standalone-be',
      title: 'Clean Modular Backend',
      tagline: 'Node.js ESM + Fastify / Express',
      desc: 'Domain-driven modular backend with controller/service/repo layers, Zod env validation, and DB pooling.',
      badges: ['Fastify / Express', 'Postgres / Mongo', 'Clean Arch', 'ESM'],
      icon: <Server className="w-5 h-5 text-purple-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {topologies.map((t) => {
        const isSelected = value === t.id;
        return (
          <div
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`group relative p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 flex flex-col justify-between ${
              isSelected
                ? 'ui-active-ring'
                : 'ui-card hover:scale-[1.01]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg ui-card-subtle border">
                  {t.icon}
                </div>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    ✓
                  </span>
                )}
              </div>

              <h3 className="font-semibold text-xs tracking-tight mb-1">
                {t.title}
              </h3>
              <p className="text-[11px] font-mono text-blue-500 mb-2">
                {t.tagline}
              </p>
              <p className="text-xs opacity-70 leading-relaxed mb-3">
                {t.desc}
              </p>
            </div>

            <div className="flex flex-wrap gap-1 pt-2 border-t border-black/5 dark:border-white/5">
              {t.badges.map((badge) => (
                <span
                  key={badge}
                  className="px-1.5 py-0.5 rounded text-[10px] font-mono ui-card-subtle opacity-75"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
