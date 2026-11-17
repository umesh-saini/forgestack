import React, { useState } from 'react';
import {
  Check,
  ChevronRight,
  Container,
  Database,
  FileCode,
  FolderTree,
  GripVertical,
  Layers,
  Palette,
  Server,
  Sparkles,
  Workflow,
  Wrench,
  X,
} from 'lucide-react';
import type { ProjectConfig } from '@forgestack/core/browser';
import {
  CursorRulesIcon,
  DockerIcon,
  DrizzleIcon,
  ExpressIcon,
  FastifyIcon,
  HonoIcon,
  LucideIcon,
  MongoIcon,
  NestJSIcon,
  OpenSpecIcon,
  PhosphorIcon,
  PnpmIcon,
  PostgresIcon,
  PrismaIcon,
  ReactHookFormIcon,
  ReactHotToastIcon,
  ReactIcon,
  ReactIconsIcon,
  ReactToastifyIcon,
  ReduxIcon,
  SQLiteIcon,
  SonnerIcon,
  TablerIcon,
  TailwindIcon,
  TanStackFormIcon,
  TanStackQueryIcon,
  TurborepoIcon,
  ZustandIcon,
} from '../common/TechIcons.js';

interface Props {
  config: ProjectConfig;
  onChange: (updater: (prev: ProjectConfig) => ProjectConfig) => void;
}

type PaletteCategory =
  | 'all'
  | 'topology'
  | 'frontend'
  | 'icons'
  | 'toast'
  | 'forms'
  | 'state'
  | 'backend'
  | 'database'
  | 'ai';

interface PaletteItem {
  id: string;
  category: PaletteCategory;
  name: string;
  tag: string;
  icon: React.ReactNode;
  targetZone: 'topology' | 'frontend' | 'backend' | 'ai';
  action: (prev: ProjectConfig) => ProjectConfig;
  isActive: (config: ProjectConfig) => boolean;
}

export const DragDropConfigurator: React.FC<Props> = ({ config, onChange }) => {
  const [activeCategory, setActiveCategory] = useState<PaletteCategory>('all');
  const [draggedItem, setDraggedItem] = useState<PaletteItem | null>(null);
  const [dragOverZone, setDragOverZone] = useState<string | null>(null);

  const paletteItems: PaletteItem[] = [
    // 1. Topology
    {
      id: 'topo-monorepo',
      category: 'topology',
      name: 'Turborepo Monorepo',
      tag: 'apps/* + packages/*',
      icon: <TurborepoIcon className="w-5 h-5" />,
      targetZone: 'topology',
      action: (prev) => ({
        ...prev,
        topology: 'monorepo',
        frontend: { ...prev.frontend, framework: 'react-vite' },
        backend: {
          ...prev.backend,
          framework: prev.backend.framework === 'none' ? 'fastify' : prev.backend.framework,
        },
      }),
      isActive: (c) => c.topology === 'monorepo',
    },
    {
      id: 'topo-separate',
      category: 'topology',
      name: 'Separate Folders (Polyrepo)',
      tag: 'frontend/ & backend/',
      icon: <Layers className="w-5 h-5 text-emerald-500" />,
      targetZone: 'topology',
      action: (prev) => ({
        ...prev,
        topology: 'separate-folders',
        frontend: { ...prev.frontend, framework: 'react-vite' },
        backend: {
          ...prev.backend,
          framework: prev.backend.framework === 'none' ? 'fastify' : prev.backend.framework,
        },
      }),
      isActive: (c) => c.topology === 'separate-folders',
    },
    {
      id: 'topo-microfe',
      category: 'topology',
      name: 'Micro-Frontend Federation',
      tag: 'apps/shell + apps/web',
      icon: <Layers className="w-5 h-5 text-cyan-500" />,
      targetZone: 'topology',
      action: (prev) => ({
        ...prev,
        topology: 'micro-frontend',
        frontend: { ...prev.frontend, framework: 'react-vite' },
        backend: {
          ...prev.backend,
          framework: prev.backend.framework === 'none' ? 'fastify' : prev.backend.framework,
        },
      }),
      isActive: (c) => c.topology === 'micro-frontend',
    },
    {
      id: 'topo-spa',
      category: 'topology',
      name: 'Standalone Frontend SPA',
      tag: 'Single React 19 Client',
      icon: <ReactIcon className="w-5 h-5" />,
      targetZone: 'topology',
      action: (prev) => ({
        ...prev,
        topology: 'standalone-fe',
        frontend: { ...prev.frontend, framework: 'react-vite' },
        backend: { ...prev.backend, framework: 'none' },
      }),
      isActive: (c) => c.topology === 'standalone-fe',
    },
    {
      id: 'topo-api',
      category: 'topology',
      name: 'Standalone Backend API',
      tag: 'Single Microservice',
      icon: <FastifyIcon className="w-5 h-5" />,
      targetZone: 'topology',
      action: (prev) => ({
        ...prev,
        topology: 'standalone-be',
        frontend: { ...prev.frontend, framework: 'none' },
        backend: {
          ...prev.backend,
          framework: prev.backend.framework === 'none' ? 'fastify' : prev.backend.framework,
        },
      }),
      isActive: (c) => c.topology === 'standalone-be',
    },

    // 2. Frontend Framework & Styling
    {
      id: 'fe-react',
      category: 'frontend',
      name: 'React 19',
      tag: 'Concurrent Mode + Actions',
      icon: <ReactIcon className="w-5 h-5" />,
      targetZone: 'frontend',
      action: (prev) => ({
        ...prev,
        frontend: { ...prev.frontend, framework: 'react-vite' },
      }),
      isActive: (c) => c.frontend.framework === 'react-vite',
    },
    {
      id: 'fe-tailwind',
      category: 'frontend',
      name: 'Tailwind CSS v4',
      tag: '@tailwindcss/vite Oxide Engine',
      icon: <TailwindIcon className="w-5 h-5" />,
      targetZone: 'frontend',
      action: (prev) => ({
        ...prev,
        frontend: { ...prev.frontend, styling: 'tailwind' },
      }),
      isActive: (c) => c.frontend.styling === 'tailwind',
    },

    // 3. Icons
    {
      id: 'icons-lucide',
      category: 'icons',
      name: 'Lucide Icons',
      tag: 'Modern Feather Evolution',
      icon: <LucideIcon className="w-5 h-5" />,
      targetZone: 'frontend',
      action: (prev) => ({
        ...prev,
        frontend: { ...prev.frontend, icons: 'lucide' },
      }),
      isActive: (c) => (c.frontend.icons || 'lucide') === 'lucide',
    },
    {
      id: 'icons-tabler',
      category: 'icons',
      name: 'Tabler Icons',
      tag: 'Over 5,000 Pixel-perfect Icons',
      icon: <TablerIcon className="w-5 h-5" />,
      targetZone: 'frontend',
      action: (prev) => ({
        ...prev,
        frontend: { ...prev.frontend, icons: 'tabler' },
      }),
      isActive: (c) => c.frontend.icons === 'tabler',
    },
    {
      id: 'icons-react-icons',
      category: 'icons',
      name: 'React Icons',
      tag: 'Universal SVG Bundler',
      icon: <ReactIconsIcon className="w-5 h-5" />,
      targetZone: 'frontend',
      action: (prev) => ({
        ...prev,
        frontend: { ...prev.frontend, icons: 'react-icons' },
      }),
      isActive: (c) => c.frontend.icons === 'react-icons',
    },
    {
      id: 'icons-phosphor',
      category: 'icons',
      name: 'Phosphor Icons',
      tag: 'Flexible Weight Variations',
      icon: <PhosphorIcon className="w-5 h-5" />,
      targetZone: 'frontend',
      action: (prev) => ({
        ...prev,
        frontend: { ...prev.frontend, icons: 'phosphor' },
      }),
      isActive: (c) => c.frontend.icons === 'phosphor',
    },

    // 4. Toast Systems
    {
      id: 'toast-sonner',
      category: 'toast',
      name: 'Sonner Toast',
      tag: 'Emil Kowalski Stacked Toasts',
      icon: <SonnerIcon className="w-5 h-5" />,
      targetZone: 'frontend',
      action: (prev) => ({
        ...prev,
        frontend: { ...prev.frontend, toast: 'sonner' },
      }),
      isActive: (c) => (c.frontend.toast || 'sonner') === 'sonner',
    },
    {
      id: 'toast-toastify',
      category: 'toast',
      name: 'React-Toastify',
      tag: 'Battle-tested Toast Engine',
      icon: <ReactToastifyIcon className="w-5 h-5" />,
      targetZone: 'frontend',
      action: (prev) => ({
        ...prev,
        frontend: { ...prev.frontend, toast: 'toastify' },
      }),
      isActive: (c) => c.frontend.toast === 'toastify',
    },
    {
      id: 'toast-hot',
      category: 'toast',
      name: 'React Hot Toast',
      tag: 'Smoking Lightweight Notifications',
      icon: <ReactHotToastIcon className="w-5 h-5" />,
      targetZone: 'frontend',
      action: (prev) => ({
        ...prev,
        frontend: { ...prev.frontend, toast: 'hot-toast' },
      }),
      isActive: (c) => c.frontend.toast === 'hot-toast',
    },

    // 5. Form Frameworks
    {
      id: 'form-rhf',
      category: 'forms',
      name: 'React Hook Form + Zod',
      tag: 'Uncontrolled Performance + Strict Schemas',
      icon: <ReactHookFormIcon className="w-5 h-5" />,
      targetZone: 'frontend',
      action: (prev) => ({
        ...prev,
        frontend: { ...prev.frontend, forms: 'rhf-zod' },
      }),
      isActive: (c) => (c.frontend.forms || 'rhf-zod') === 'rhf-zod',
    },
    {
      id: 'form-tanstack',
      category: 'forms',
      name: 'TanStack Form + Zod',
      tag: 'Headless Form State Engine',
      icon: <TanStackFormIcon className="w-5 h-5" />,
      targetZone: 'frontend',
      action: (prev) => ({
        ...prev,
        frontend: { ...prev.frontend, forms: 'tanstack-form' },
      }),
      isActive: (c) => c.frontend.forms === 'tanstack-form',
    },

    // 6. State Management & Data Fetching
    {
      id: 'state-query',
      category: 'state',
      name: 'TanStack Query v5',
      tag: 'Automatic Cache, Deduplication & Refetch',
      icon: <TanStackQueryIcon className="w-5 h-5" />,
      targetZone: 'frontend',
      action: (prev) => ({
        ...prev,
        frontend: { ...prev.frontend, state: 'query' },
      }),
      isActive: (c) => (c.frontend.state || 'query') === 'query',
    },
    {
      id: 'state-redux',
      category: 'state',
      name: 'Redux Toolkit',
      tag: 'Central Store + Typed RTK Hooks',
      icon: <ReduxIcon className="w-5 h-5" />,
      targetZone: 'frontend',
      action: (prev) => ({
        ...prev,
        frontend: { ...prev.frontend, state: 'redux' },
      }),
      isActive: (c) => c.frontend.state === 'redux',
    },
    {
      id: 'state-zustand',
      category: 'state',
      name: 'Zustand Store',
      tag: 'Atomic Bear State with Middleware',
      icon: <ZustandIcon className="w-5 h-5" />,
      targetZone: 'frontend',
      action: (prev) => ({
        ...prev,
        frontend: { ...prev.frontend, state: 'zustand' },
      }),
      isActive: (c) => c.frontend.state === 'zustand',
    },

    // 7. Backend Frameworks
    {
      id: 'be-fastify',
      category: 'backend',
      name: 'Fastify v5',
      tag: 'High-throughput Schema HTTP API',
      icon: <FastifyIcon className="w-5 h-5" />,
      targetZone: 'backend',
      action: (prev) => ({
        ...prev,
        backend: { ...prev.backend, framework: 'fastify' },
      }),
      isActive: (c) => c.backend.framework === 'fastify',
    },
    {
      id: 'be-express',
      category: 'backend',
      name: 'Express v4',
      tag: 'Classic Node.js Middleware Engine',
      icon: <ExpressIcon className="w-5 h-5" />,
      targetZone: 'backend',
      action: (prev) => ({
        ...prev,
        backend: { ...prev.backend, framework: 'express' },
      }),
      isActive: (c) => c.backend.framework === 'express',
    },
    {
      id: 'be-hono',
      category: 'backend',
      name: 'Hono Web Framework',
      tag: 'Multi-runtime Ultra-light Fast Router',
      icon: <HonoIcon className="w-5 h-5" />,
      targetZone: 'backend',
      action: (prev) => ({
        ...prev,
        backend: { ...prev.backend, framework: 'hono' },
      }),
      isActive: (c) => c.backend.framework === 'hono',
    },

    // 8. Database & ORM
    {
      id: 'db-postgres-drizzle',
      category: 'database',
      name: 'PostgreSQL + Drizzle ORM',
      tag: 'pg Pool + Health Ping on Boot',
      icon: <PostgresIcon className="w-5 h-5" />,
      targetZone: 'backend',
      action: (prev) => ({
        ...prev,
        backend: { ...prev.backend, database: 'postgres', orm: 'drizzle' },
      }),
      isActive: (c) => c.backend.database === 'postgres' && c.backend.orm === 'drizzle',
    },
    {
      id: 'db-postgres-prisma',
      category: 'database',
      name: 'PostgreSQL + Prisma ORM',
      tag: 'schema.prisma + Generated Client',
      icon: <PrismaIcon className="w-5 h-5" />,
      targetZone: 'backend',
      action: (prev) => ({
        ...prev,
        backend: { ...prev.backend, database: 'postgres', orm: 'prisma' },
      }),
      isActive: (c) => c.backend.database === 'postgres' && c.backend.orm === 'prisma',
    },
    {
      id: 'db-mongodb-mongoose',
      category: 'database',
      name: 'MongoDB + Mongoose ODM',
      tag: 'Connection Retry Backoff Loop',
      icon: <MongoIcon className="w-5 h-5" />,
      targetZone: 'backend',
      action: (prev) => ({
        ...prev,
        backend: { ...prev.backend, database: 'mongodb', orm: 'mongoose' },
      }),
      isActive: (c) => c.backend.database === 'mongodb' && c.backend.orm === 'mongoose',
    },
    {
      id: 'db-sqlite-drizzle',
      category: 'database',
      name: 'SQLite + Drizzle ORM',
      tag: 'Embedded Zero-Config SQL Storage',
      icon: <SQLiteIcon className="w-5 h-5" />,
      targetZone: 'backend',
      action: (prev) => ({
        ...prev,
        backend: { ...prev.backend, database: 'sqlite', orm: 'drizzle' },
      }),
      isActive: (c) => c.backend.database === 'sqlite' && c.backend.orm === 'drizzle',
    },

    // 9. Day-One AI Governance
    {
      id: 'ai-rules',
      category: 'ai',
      name: 'Cursor Architecture Rules',
      tag: '.cursor/rules/*.mdc Strict Constraints',
      icon: <CursorRulesIcon className="w-5 h-5" />,
      targetZone: 'ai',
      action: (prev) => ({
        ...prev,
        aiGovernance: { ...prev.aiGovernance, rules: !prev.aiGovernance.rules },
      }),
      isActive: (c) => c.aiGovernance.rules,
    },
    {
      id: 'ai-skills',
      category: 'ai',
      name: 'Modern UI & Clean Code Skills',
      tag: '.agents/skills/**/SKILL.md Agent Guidance',
      icon: <Sparkles className="w-5 h-5 text-amber-500" />,
      targetZone: 'ai',
      action: (prev) => ({
        ...prev,
        aiGovernance: { ...prev.aiGovernance, skills: !prev.aiGovernance.skills },
      }),
      isActive: (c) => c.aiGovernance.skills,
    },
    {
      id: 'ai-openspec',
      category: 'ai',
      name: 'OpenSpec Governance Workflows',
      tag: 'openspec/ & .agents/workflows/ Sync Commands',
      icon: <OpenSpecIcon className="w-5 h-5" />,
      targetZone: 'ai',
      action: (prev) => ({
        ...prev,
        aiGovernance: { ...prev.aiGovernance, openSpec: !prev.aiGovernance.openSpec },
      }),
      isActive: (c) => c.aiGovernance.openSpec,
    },
  ];

  const categories: { id: PaletteCategory; label: string; count: number }[] = [
    { id: 'all', label: 'All Slices', count: paletteItems.length },
    { id: 'topology', label: 'Topology', count: 5 },
    { id: 'frontend', label: 'Frontend', count: 2 },
    { id: 'icons', label: 'Icons', count: 4 },
    { id: 'toast', label: 'Toasts', count: 3 },
    { id: 'forms', label: 'Forms', count: 2 },
    { id: 'state', label: 'State & Cache', count: 3 },
    { id: 'backend', label: 'Backend', count: 3 },
    { id: 'database', label: 'Database', count: 4 },
    { id: 'ai', label: 'AI Governance', count: 3 },
  ];

  const handleDragStart = (item: PaletteItem) => {
    setDraggedItem(item);
  };

  const handleDrop = (zoneId: string) => {
    if (!draggedItem) return;
    onChange(draggedItem.action);
    setDraggedItem(null);
    setDragOverZone(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Quick Tech Palette Bar with Category Chips */}
      <div className="ui-panel rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Component & Architecture Palette
            </h3>
            <span className="text-[11px] opacity-60">
              (Click to equip or drag onto any architecture pillar)
            </span>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1 rounded ${
                    activeCategory === cat.id ? 'bg-white/20' : 'ui-card-subtle opacity-70 border'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal Quick-Draw Palette Slider */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 max-h-48 overflow-y-auto p-1">
          {paletteItems
            .filter((item) => activeCategory === 'all' || item.category === activeCategory)
            .map((item) => {
              const active = item.isActive(config);
              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(item)}
                  onClick={() => onChange(item.action)}
                  className={`p-2.5 rounded-xl border text-left cursor-grab active:cursor-grabbing transition-all flex items-center gap-2.5 select-none ${
                    active
                      ? 'ui-active-ring'
                      : 'ui-card hover:scale-[1.02]'
                  }`}
                >
                  <div className="p-1.5 rounded-lg ui-card-subtle border shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-semibold truncate">{item.name}</h4>
                      {active && (
                        <span className="w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                          ✓
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] opacity-60 font-mono truncate">{item.tag}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* 2. THE 4 ARCHITECTURE BLUEPRINT PILLARS (Interactive Flow) */}
      <div className="space-y-4">
        {/* PILLAR 1: Workspace Topology & Folder Structure */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverZone('topology');
          }}
          onDragLeave={() => setDragOverZone(null)}
          onDrop={() => handleDrop('topology')}
          className={`ui-panel rounded-2xl p-5 shadow-sm space-y-3 transition-all ${
            dragOverZone === 'topology' ? 'ring-2 ring-blue-500 bg-blue-500/10 border-dashed' : ''
          }`}
        >
          <div className="flex items-center justify-between flex-wrap gap-2 border-b pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center text-xs font-mono font-bold">
                1
              </span>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  Workspace Topology & Folder Structure
                </h3>
                <p className="text-[11px] opacity-60">
                  Select your project workspace layout and boundaries
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-lg ui-card-subtle border text-blue-500">
              {config.topology}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {[
              {
                id: 'monorepo',
                name: 'Turborepo Monorepo',
                desc: 'apps/web + apps/api + packages/*',
                icon: <TurborepoIcon className="w-5 h-5" />,
                tag: 'Enterprise Recommended',
              },
              {
                id: 'separate-folders',
                name: 'Polyrepo Split Folders',
                desc: 'frontend/ & backend/ independent folders',
                icon: <Layers className="w-5 h-5 text-emerald-500" />,
                tag: 'Decoupled',
              },
              {
                id: 'micro-frontend',
                name: 'Micro-Frontend Federation',
                desc: 'apps/shell + apps/web Module Federation',
                icon: <Layers className="w-5 h-5 text-cyan-500" />,
                tag: 'Multi-Team',
              },
              {
                id: 'standalone-fe',
                name: 'Standalone Frontend SPA',
                desc: 'Single React 19 Client with Tailwind v4',
                icon: <ReactIcon className="w-5 h-5" />,
                tag: 'Client-Only',
              },
              {
                id: 'standalone-be',
                name: 'Standalone Backend API',
                desc: 'Single Fastify / Express Microservice',
                icon: <FastifyIcon className="w-5 h-5" />,
                tag: 'API-Only',
              },
            ].map((topo) => {
              const isSelected = config.topology === topo.id;
              return (
                <div
                  key={topo.id}
                  onClick={() =>
                    onChange((prev) => ({
                      ...prev,
                      topology: topo.id as any,
                      frontend: {
                        ...prev.frontend,
                        framework: topo.id !== 'standalone-be' ? 'react-vite' : 'none',
                      },
                      backend: {
                        ...prev.backend,
                        framework:
                          topo.id !== 'standalone-fe'
                            ? prev.backend.framework === 'none'
                              ? 'fastify'
                              : prev.backend.framework
                            : 'none',
                      },
                    }))
                  }
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected ? 'ui-active-ring' : 'ui-card hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="p-2 rounded-lg ui-card-subtle border">{topo.icon}</div>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="mt-2.5">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold">{topo.name}</h4>
                    </div>
                    <p className="text-[11px] opacity-60 font-mono mt-0.5">{topo.desc}</p>
                    <span className="inline-block mt-2 text-[10px] px-1.5 py-0.5 rounded ui-card-subtle border opacity-80">
                      {topo.tag}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PILLAR 2: Frontend Ecosystem & UI Primitives */}
        {config.topology !== 'standalone-be' && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverZone('frontend');
            }}
            onDragLeave={() => setDragOverZone(null)}
            onDrop={() => handleDrop('frontend')}
            className={`ui-panel rounded-2xl p-5 shadow-sm space-y-4 transition-all ${
              dragOverZone === 'frontend'
                ? 'ring-2 ring-cyan-500 bg-cyan-500/10 border-dashed'
                : ''
            }`}
          >
            <div className="flex items-center justify-between flex-wrap gap-2 border-b pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-500 flex items-center justify-center text-xs font-mono font-bold">
                  2
                </span>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider">
                    Frontend Client & UI Ecosystem
                  </h3>
                  <p className="text-[11px] opacity-60">
                    Customize your React 19 UI stack, icons, toasts, forms and state layer
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-lg ui-card-subtle border text-cyan-500">
                React 19 Active
              </span>
            </div>

            {/* Core Framework & Styling (Fixed Standards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl ui-card-subtle border flex items-center gap-3">
                <div className="p-2 rounded-lg ui-panel border">
                  <ReactIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold">React 19</h4>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-500 font-mono font-semibold">
                      Latest
                    </span>
                  </div>
                  <p className="text-[11px] opacity-60 font-mono">
                    Vite 6 Fast HMR • TypeScript Strict • Concurrent Mode
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl ui-card-subtle border flex items-center gap-3">
                <div className="p-2 rounded-lg ui-panel border">
                  <TailwindIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold">Tailwind CSS v4</h4>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-500 font-mono font-semibold">
                      v4 Oxide
                    </span>
                  </div>
                  <p className="text-[11px] opacity-60 font-mono">
                    @tailwindcss/vite • Zero-config CSS Variables • Pure Speed
                  </p>
                </div>
              </div>
            </div>

            {/* Configurable Sub-Systems: Icons, Toast, Forms, State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* 2A: Icon Libraries */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider opacity-70 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-rose-500" />
                  <span>Icon Library:</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'lucide', name: 'Lucide Icons', icon: <LucideIcon className="w-4 h-4" /> },
                    { id: 'tabler', name: 'Tabler Icons', icon: <TablerIcon className="w-4 h-4" /> },
                    { id: 'react-icons', name: 'React Icons', icon: <ReactIconsIcon className="w-4 h-4" /> },
                    { id: 'phosphor', name: 'Phosphor Icons', icon: <PhosphorIcon className="w-4 h-4" /> },
                  ].map((ic) => {
                    const isSelected = (config.frontend.icons || 'lucide') === ic.id;
                    return (
                      <button
                        key={ic.id}
                        type="button"
                        onClick={() =>
                          onChange((prev) => ({
                            ...prev,
                            frontend: { ...prev.frontend, icons: ic.id as any },
                          }))
                        }
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2 cursor-pointer ${
                          isSelected ? 'ui-active-ring' : 'ui-card hover:border-cyan-400'
                        }`}
                      >
                        {ic.icon}
                        <span className="font-medium truncate">{ic.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2B: Toast Notification Architecture */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider opacity-70 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Toast System:</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'sonner', name: 'Sonner', icon: <SonnerIcon className="w-4 h-4" /> },
                    { id: 'toastify', name: 'Toastify', icon: <ReactToastifyIcon className="w-4 h-4" /> },
                    { id: 'hot-toast', name: 'Hot Toast', icon: <ReactHotToastIcon className="w-4 h-4" /> },
                  ].map((t) => {
                    const isSelected = (config.frontend.toast || 'sonner') === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() =>
                          onChange((prev) => ({
                            ...prev,
                            frontend: { ...prev.frontend, toast: t.id as any },
                          }))
                        }
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2 cursor-pointer ${
                          isSelected ? 'ui-active-ring' : 'ui-card hover:border-cyan-400'
                        }`}
                      >
                        {t.icon}
                        <span className="font-medium truncate">{t.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2C: Form Architecture */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider opacity-70 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-pink-500" />
                  <span>Form Architecture:</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      id: 'rhf-zod',
                      name: 'React Hook Form + Zod',
                      desc: 'Standard schema validation',
                      icon: <ReactHookFormIcon className="w-4 h-4" />,
                    },
                    {
                      id: 'tanstack-form',
                      name: 'TanStack Form + Zod',
                      desc: 'Modern headless state',
                      icon: <TanStackFormIcon className="w-4 h-4" />,
                    },
                  ].map((f) => {
                    const isSelected = (config.frontend.forms || 'rhf-zod') === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() =>
                          onChange((prev) => ({
                            ...prev,
                            frontend: { ...prev.frontend, forms: f.id as any },
                          }))
                        }
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2 cursor-pointer ${
                          isSelected ? 'ui-active-ring' : 'ui-card hover:border-cyan-400'
                        }`}
                      >
                        {f.icon}
                        <div className="truncate">
                          <div className="font-medium truncate">{f.name}</div>
                          <div className="text-[10px] opacity-60 font-mono truncate">{f.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2D: State Management & Cache Layer */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider opacity-70 flex items-center gap-1.5">
                  <Workflow className="w-3.5 h-3.5 text-purple-500" />
                  <span>State & Cache Management:</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'query', name: 'TanStack Query v5', icon: <TanStackQueryIcon className="w-4 h-4" /> },
                    { id: 'redux', name: 'Redux Toolkit', icon: <ReduxIcon className="w-4 h-4" /> },
                    { id: 'zustand', name: 'Zustand Store', icon: <ZustandIcon className="w-4 h-4" /> },
                  ].map((st) => {
                    const isSelected = (config.frontend.state || 'query') === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() =>
                          onChange((prev) => ({
                            ...prev,
                            frontend: { ...prev.frontend, state: st.id as any },
                          }))
                        }
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2 cursor-pointer ${
                          isSelected ? 'ui-active-ring' : 'ui-card hover:border-cyan-400'
                        }`}
                      >
                        {st.icon}
                        <span className="font-medium truncate">{st.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PILLAR 3: Backend & Database Engine */}
        {config.topology !== 'standalone-fe' && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverZone('backend');
            }}
            onDragLeave={() => setDragOverZone(null)}
            onDrop={() => handleDrop('backend')}
            className={`ui-panel rounded-2xl p-5 shadow-sm space-y-4 transition-all ${
              dragOverZone === 'backend'
                ? 'ring-2 ring-purple-500 bg-purple-500/10 border-dashed'
                : ''
            }`}
          >
            <div className="flex items-center justify-between flex-wrap gap-2 border-b pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-500 flex items-center justify-center text-xs font-mono font-bold">
                  3
                </span>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider">
                    Backend Service, Database & ORM Engine
                  </h3>
                  <p className="text-[11px] opacity-60">
                    Select your server runtime, database storage and container setup
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-lg ui-card-subtle border text-purple-500">
                {config.backend.framework} + {config.backend.database}
              </span>
            </div>

            {/* 3A: Backend Framework Selection */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider opacity-70 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-purple-500" />
                <span>Backend Framework:</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    id: 'fastify',
                    name: 'Fastify v5',
                    tag: 'High Throughput',
                    icon: <FastifyIcon className="w-5 h-5" />,
                  },
                  {
                    id: 'express',
                    name: 'Express v4',
                    tag: 'Classic Ecosystem',
                    icon: <ExpressIcon className="w-5 h-5" />,
                  },
                  {
                    id: 'hono',
                    name: 'Hono Web',
                    tag: 'Multi-Runtime',
                    icon: <HonoIcon className="w-5 h-5" />,
                  },
                ].map((fw) => {
                  const isSelected = config.backend.framework === fw.id;
                  return (
                    <button
                      key={fw.id}
                      type="button"
                      onClick={() =>
                        onChange((prev) => ({
                          ...prev,
                          backend: { ...prev.backend, framework: fw.id as any },
                        }))
                      }
                      className={`p-3 rounded-xl border text-left text-xs transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected ? 'ui-active-ring' : 'ui-card hover:border-purple-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="p-1.5 rounded-lg ui-card-subtle border">{fw.icon}</div>
                        {isSelected && (
                          <span className="w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                      <div className="mt-2">
                        <h4 className="font-bold text-xs">{fw.name}</h4>
                        <p className="text-[10px] opacity-60 font-mono mt-0.5">{fw.tag}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3B: Database & ORM Selection */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider opacity-70 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-500" />
                <span>Database & ORM Layer:</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {[
                  {
                    db: 'postgres',
                    orm: 'drizzle',
                    name: 'PostgreSQL + Drizzle',
                    tag: 'pg Pool + Health Ping',
                    icon: <PostgresIcon className="w-5 h-5" />,
                  },
                  {
                    db: 'postgres',
                    orm: 'prisma',
                    name: 'PostgreSQL + Prisma',
                    tag: 'schema.prisma + Client',
                    icon: <PrismaIcon className="w-5 h-5" />,
                  },
                  {
                    db: 'mongodb',
                    orm: 'mongoose',
                    name: 'MongoDB + Mongoose',
                    tag: 'Connection Retry Backoff',
                    icon: <MongoIcon className="w-5 h-5" />,
                  },
                  {
                    db: 'sqlite',
                    orm: 'drizzle',
                    name: 'SQLite + Drizzle',
                    tag: 'Embedded Zero-Config',
                    icon: <SQLiteIcon className="w-5 h-5" />,
                  },
                ].map((d) => {
                  const isSelected =
                    config.backend.database === d.db && config.backend.orm === d.orm;
                  return (
                    <button
                      key={`${d.db}-${d.orm}`}
                      type="button"
                      onClick={() =>
                        onChange((prev) => ({
                          ...prev,
                          backend: {
                            ...prev.backend,
                            database: d.db as any,
                            orm: d.orm as any,
                          },
                        }))
                      }
                      className={`p-3 rounded-xl border text-left text-xs transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected ? 'ui-active-ring' : 'ui-card hover:border-purple-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="p-1.5 rounded-lg ui-card-subtle border">{d.icon}</div>
                        {isSelected && (
                          <span className="w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                      <div className="mt-2">
                        <h4 className="font-bold text-xs">{d.name}</h4>
                        <p className="text-[10px] opacity-60 font-mono mt-0.5">{d.tag}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3C: Docker Containerization Toggle */}
            <div className="pt-1">
              <label className="p-3 rounded-xl ui-card-subtle flex items-center justify-between cursor-pointer border hover:border-blue-400 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg ui-panel border">
                    <DockerIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">Containerized Docker Compose Service</h4>
                    <p className="text-[11px] opacity-60 font-mono">
                      Includes multi-stage Dockerfile & docker-compose.yml with automated healthchecks
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.backend.container}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      backend: { ...prev.backend, container: e.target.checked },
                    }))
                  }
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                />
              </label>
            </div>
          </div>
        )}

        {/* PILLAR 4: Day-One AI Governance & Quality Gates */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverZone('ai');
          }}
          onDragLeave={() => setDragOverZone(null)}
          onDrop={() => handleDrop('ai')}
          className={`ui-panel rounded-2xl p-5 shadow-sm space-y-3 transition-all ${
            dragOverZone === 'ai' ? 'ring-2 ring-indigo-500 bg-indigo-500/10 border-dashed' : ''
          }`}
        >
          <div className="flex items-center justify-between flex-wrap gap-2 border-b pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-500 flex items-center justify-center text-xs font-mono font-bold">
                4
              </span>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  Day-One AI Governance & Agent Alignment
                </h3>
                <p className="text-[11px] opacity-60">
                  Embed strict architectural constraints, craftsmanship guidelines and spec sync
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-lg ui-card-subtle border text-indigo-500">
              Active Standards
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                id: 'rules',
                key: 'rules' as const,
                name: 'Cursor Architecture Rules',
                path: '.cursor/rules/*.mdc',
                desc: 'Prevents direct database queries in controllers and eliminates loose casting',
                icon: <CursorRulesIcon className="w-5 h-5" />,
              },
              {
                id: 'skills',
                key: 'skills' as const,
                name: 'Modern UI & Clean Code Skills',
                path: '.agents/skills/**/SKILL.md',
                desc: 'Defensive pooling, WCAG AA contrast, Radix primitives and modular service decoupling',
                icon: <Sparkles className="w-5 h-5 text-amber-500" />,
              },
              {
                id: 'openspec',
                key: 'openSpec' as const,
                name: 'OpenSpec Governance Workflows',
                path: 'openspec/ & .agents/workflows/',
                desc: 'Continuous spec synchronization, delta change tracking and automated verification',
                icon: <OpenSpecIcon className="w-5 h-5" />,
              },
            ].map((ai) => {
              const isEnabled = config.aiGovernance[ai.key];
              return (
                <div
                  key={ai.id}
                  onClick={() =>
                    onChange((prev) => ({
                      ...prev,
                      aiGovernance: {
                        ...prev.aiGovernance,
                        [ai.key]: !prev.aiGovernance[ai.key],
                      },
                    }))
                  }
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    isEnabled ? 'ui-active-ring' : 'ui-card hover:border-indigo-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="p-2 rounded-lg ui-card-subtle border">{ai.icon}</div>
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                    />
                  </div>

                  <div className="mt-2.5">
                    <h4 className="text-xs font-bold">{ai.name}</h4>
                    <span className="inline-block font-mono text-[10px] text-blue-500 mt-0.5">
                      {ai.path}
                    </span>
                    <p className="text-[11px] opacity-60 mt-1 leading-snug">{ai.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
