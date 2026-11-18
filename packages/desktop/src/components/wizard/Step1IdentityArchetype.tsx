import React from 'react';
import {
  FolderOpen,
  Package,
  Rocket,
  Layers,
  Monitor,
  Server,
  Laptop,
  Sparkles,
  Check,
} from 'lucide-react';
import type { ProjectConfig, ArchitectureTopology } from '@forgestack/core/browser';

interface Props {
  config: ProjectConfig;
  onChange: (updater: (prev: ProjectConfig) => ProjectConfig) => void;
  onBrowseFolder: () => void;
}

export const Step1IdentityArchetype: React.FC<Props> = ({
  config,
  onChange,
  onBrowseFolder,
}) => {
  const packageManagers: { id: ProjectConfig['packageManager']; name: string; tag?: string }[] = [
    { id: 'pnpm', name: 'pnpm', tag: 'Fastest' },
    { id: 'npm', name: 'npm' },
    { id: 'bun', name: 'bun' },
    { id: 'yarn', name: 'yarn' },
  ];

  const archetypes: {
    id: ArchitectureTopology;
    title: string;
    desc: string;
    icon: React.ReactNode;
    tag: string;
    apply: (prev: ProjectConfig) => ProjectConfig;
  }[] = [
    {
      id: 'monorepo',
      title: 'Enterprise Monorepo',
      desc: 'Turborepo + pnpm workspaces with shared @repo/contracts, @repo/ui, and decoupled apps/',
      icon: <Rocket className="w-5 h-5 text-orange-500" />,
      tag: 'Scale-Ready',
      apply: (prev) => ({
        ...prev,
        topology: 'monorepo',
        frontend: { ...prev.frontend, framework: 'react-vite', styling: 'tailwind' },
        backend: { ...prev.backend, framework: 'fastify', database: 'postgres', orm: 'drizzle' },
        auth: 'better-auth',
        rpc: 'trpc',
      }),
    },
    {
      id: 'ai-agent-rag',
      title: 'AI Agent & RAG Monorepo',
      desc: 'Full-stack AI workspace with PostgreSQL pgvector, OpenAI tool-calling agent, SSE streaming chat, and MCP server',
      icon: <Sparkles className="w-5 h-5 text-purple-500" />,
      tag: 'Vector + MCP',
      apply: (prev) => ({
        ...prev,
        topology: 'ai-agent-rag',
        frontend: { ...prev.frontend, framework: 'react-vite', styling: 'tailwind' },
        backend: { ...prev.backend, framework: 'fastify', database: 'postgres', orm: 'drizzle' },
        auth: 'better-auth',
        rpc: 'trpc',
        aiGovernance: { ...prev.aiGovernance, mcp: true },
      }),
    },
    {
      id: 'tauri-desktop',
      title: 'Native Tauri v2 Desktop',
      desc: 'Ultra-fast Rust desktop application with React 19, Vite, and high-performance cross-platform IPC bindings',
      icon: <Laptop className="w-5 h-5 text-amber-500" />,
      tag: 'Rust + React',
      apply: (prev) => ({
        ...prev,
        topology: 'tauri-desktop',
        frontend: { ...prev.frontend, framework: 'react-vite', styling: 'tailwind' },
        backend: { framework: 'none', database: 'none', orm: 'none', container: false },
      }),
    },
    {
      id: 'micro-frontend',
      title: 'Micro-Frontend Federation',
      desc: 'Vite Module Federation architecture with apps/shell (:5000), apps/remote-dashboard (:5001), and typed @repo/event-bus',
      icon: <Layers className="w-5 h-5 text-teal-500" />,
      tag: 'Federation',
      apply: (prev) => ({
        ...prev,
        topology: 'micro-frontend',
        frontend: { ...prev.frontend, framework: 'react-vite', styling: 'tailwind' },
        backend: { framework: 'none', database: 'none', orm: 'none', container: false },
      }),
    },
    {
      id: 'distributed-worker',
      title: 'Distributed Worker Queue',
      desc: 'Asynchronous task queue worker with Fastify, BullMQ job processor, and Redis Docker container',
      icon: <Server className="w-5 h-5 text-rose-500" />,
      tag: 'BullMQ + Redis',
      apply: (prev) => ({
        ...prev,
        topology: 'distributed-worker',
        frontend: { framework: 'none', styling: 'none', state: 'none', uiExtras: { toast: false, icons: false, forms: false } },
        backend: { framework: 'fastify', database: 'postgres', orm: 'drizzle', container: true, processManager: 'bullmq' },
        queue: 'bullmq',
      }),
    },
    {
      id: 'electron-desktop',
      title: 'Electron Desktop App',
      desc: 'Hardened desktop runtime via electron-vite with React 19 renderer and secure contextBridge IPC',
      icon: <Laptop className="w-5 h-5 text-indigo-500" />,
      tag: 'Native App',
      apply: (prev) => ({
        ...prev,
        topology: 'electron-desktop',
        frontend: { ...prev.frontend, framework: 'react-vite', styling: 'tailwind', dateLib: 'dayjs' },
        backend: { framework: 'none', database: 'none', orm: 'none', container: false },
      }),
    },
    {
      id: 'nextjs-fullstack',
      title: 'Next.js 15 Full-Stack',
      desc: 'Next.js 15 App Router with Tailwind CSS v4, Server Actions, and integrated route handlers',
      icon: <Sparkles className="w-5 h-5 text-cyan-500" />,
      tag: 'React 19 SSR',
      apply: (prev) => ({
        ...prev,
        topology: 'nextjs-fullstack',
        frontend: { ...prev.frontend, framework: 'nextjs', styling: 'tailwind', dateLib: 'date-fns' },
        backend: { framework: 'none', database: 'postgres', orm: 'drizzle', container: true },
      }),
    },
    {
      id: 'separate-folders',
      title: 'Full-Stack Polyrepo',
      desc: 'Clean project root containing isolated frontend/ and backend/ directories with independent package configs',
      icon: <Layers className="w-5 h-5 text-emerald-500" />,
      tag: 'Decoupled',
      apply: (prev) => ({
        ...prev,
        topology: 'separate-folders',
        frontend: { ...prev.frontend, framework: 'react-vite', styling: 'tailwind' },
        backend: { ...prev.backend, framework: 'express', database: 'mongodb', orm: 'mongoose' },
      }),
    },
    {
      id: 'standalone-fe',
      title: 'Frontend SPA (Vite)',
      desc: 'Client-only single page application using React 19, Tailwind CSS v4, and modern state management',
      icon: <Monitor className="w-5 h-5 text-amber-500" />,
      tag: 'Client-Only',
      apply: (prev) => ({
        ...prev,
        topology: 'standalone-fe',
        frontend: { ...prev.frontend, framework: 'react-vite', styling: 'tailwind' },
        backend: { framework: 'none', database: 'none', orm: 'none', container: false },
      }),
    },
    {
      id: 'standalone-be',
      title: 'Clean Backend API',
      desc: 'High-throughput Node.js ESM microservice with Clean Architecture layers, connection pooling, and PM2',
      icon: <Server className="w-5 h-5 text-purple-500" />,
      tag: 'API-Only',
      apply: (prev) => ({
        ...prev,
        topology: 'standalone-be',
        frontend: { framework: 'none', styling: 'none', state: 'none', uiExtras: { toast: false, icons: false, forms: false } },
        backend: { framework: 'fastify', database: 'postgres', orm: 'drizzle', container: false, processManager: 'pm2' },
      }),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="space-y-1">
        <h3 className="font-bold text-base tracking-tight flex items-center gap-2">
          <span>Step 1: Project Identity & Runtime Archetype</span>
        </h3>
        <p className="text-xs opacity-70">
          Define your project name, target path, package manager, and architectural foundation.
        </p>
      </div>

      {/* Inputs: Name, Path & Package Manager */}
      <div className="ui-card-subtle rounded-2xl p-5 border space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          {/* Name */}
          <div className="md:col-span-5">
            <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 opacity-70">
              Project Name
            </label>
            <input
              type="text"
              value={config.name}
              onChange={(e) => {
                const val = e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
                onChange((prev) => ({
                  ...prev,
                  name: val,
                  targetPath: prev.targetPath.replace(/[^/]+$/, val),
                }));
              }}
              placeholder="e.g. enterprise-app"
              className="w-full px-3 py-2 ui-input rounded-xl text-xs font-mono transition-all"
            />
          </div>

          {/* Path */}
          <div className="md:col-span-7">
            <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 opacity-70">
              Destination Directory
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={config.targetPath}
                onChange={(e) =>
                  onChange((prev) => ({ ...prev, targetPath: e.target.value }))
                }
                className="flex-1 px-3 py-2 ui-input rounded-xl text-xs font-mono truncate"
              />
              <button
                type="button"
                onClick={onBrowseFolder}
                className="px-3 py-2 ui-card-subtle hover:opacity-100 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-sm border"
              >
                <FolderOpen className="w-3.5 h-3.5 text-orange-500" />
                <span>Browse</span>
              </button>
            </div>
          </div>
        </div>

        {/* Package Manager Selector */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t flex-wrap">
          <span className="text-xs font-medium opacity-70 flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-orange-500" />
            <span>Package Manager:</span>
          </span>
          <div className="flex rounded-xl ui-panel p-0.5 border">
            {packageManagers.map((pm) => {
              const isSelected = config.packageManager === pm.id;
              return (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => onChange((prev) => ({ ...prev, packageManager: pm.id }))}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-orange-600 text-white font-bold shadow-sm'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <span>{pm.name}</span>
                  {pm.tag && (
                    <span className="text-[9px] px-1 rounded bg-black/20 opacity-80">
                      {pm.tag}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Target Archetype Grid */}
      <div className="space-y-3">
        <label className="block text-[11px] font-bold uppercase tracking-wider opacity-70">
          Select Runtime Archetype
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {archetypes.map((arch) => {
            const isSelected = config.topology === arch.id;

            return (
              <div
                key={arch.id}
                onClick={() => onChange(arch.apply)}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'ui-active-ring shadow-md'
                    : 'ui-panel opacity-70 hover:opacity-100 hover:border-orange-500/40'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
                        {arch.icon}
                      </div>
                      <h4 className="font-bold text-xs">{arch.title}</h4>
                    </div>
                    {isSelected ? (
                      <span className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded ui-card-subtle border opacity-70">
                        {arch.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs opacity-70 leading-relaxed">{arch.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
