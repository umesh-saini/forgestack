import React from 'react';
import {
  Code,
  Database,
  Calendar,
  Layers,
  Sparkles,
  Shield,
  Terminal,
  Check,
} from 'lucide-react';
import type { ProjectConfig } from '@forgestack/core/browser';
import {
  ReactIcon,
  NextJsIcon,
  TailwindIcon,
  FastifyIcon,
  ExpressIcon,
  HonoIcon,
  PostgresIcon,
  MongoIcon,
  SqliteIcon,
  DrizzleIcon,
  PrismaIcon,
  ElectronIcon,
} from '../common/TechIcons.js';

interface Props {
  config: ProjectConfig;
  onChange: (updater: (prev: ProjectConfig) => ProjectConfig) => void;
}

export const Step2StackEcosystem: React.FC<Props> = ({ config, onChange }) => {
  const isElectron = config.topology === 'electron-desktop';
  const isNext = config.topology === 'nextjs-fullstack' || config.frontend.framework === 'nextjs';
  const hasFrontend = config.frontend.framework !== 'none' || isElectron || isNext;
  const hasBackend = config.topology !== 'standalone-fe';

  const dateOptions: { id: 'dayjs' | 'date-fns' | 'moment' | 'none'; label: string; desc: string }[] = [
    { id: 'dayjs', label: 'Day.js', desc: 'Fast 2KB immutable date library' },
    { id: 'date-fns', label: 'date-fns', desc: 'Modular functional date toolset' },
    { id: 'moment', label: 'Moment.js', desc: 'Classic comprehensive date package' },
    { id: 'none', label: 'None', desc: 'Standard JavaScript Date object' },
  ];

  const stateOptions: { id: 'query' | 'zustand' | 'redux' | 'none'; label: string }[] = [
    { id: 'query', label: 'TanStack Query v5' },
    { id: 'zustand', label: 'Zustand' },
    { id: 'redux', label: 'Redux Toolkit' },
    { id: 'none', label: 'React Local State' },
  ];

  const iconOptions: { id: 'lucide' | 'tabler' | 'phosphor' | 'react-icons'; label: string }[] = [
    { id: 'lucide', label: 'Lucide Icons' },
    { id: 'tabler', label: 'Tabler Icons' },
    { id: 'phosphor', label: 'Phosphor Icons' },
    { id: 'react-icons', label: 'React Icons' },
  ];

  const toastOptions: { id: 'sonner' | 'toastify' | 'hot-toast'; label: string }[] = [
    { id: 'sonner', label: 'Sonner' },
    { id: 'toastify', label: 'React-Toastify' },
    { id: 'hot-toast', label: 'React Hot Toast' },
  ];

  const formOptions: { id: 'rhf-zod' | 'tanstack-form' | 'formik-yup'; label: string }[] = [
    { id: 'rhf-zod', label: 'React Hook Form + Zod' },
    { id: 'tanstack-form', label: 'TanStack Form' },
    { id: 'formik-yup', label: 'Formik + Yup' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h3 className="font-bold text-base tracking-tight flex items-center gap-2">
          <span>Step 2: Stack Ecosystem & Technical Primitives</span>
        </h3>
        <p className="text-xs opacity-70">
          Tailor frameworks, state management, date packages, and persistence layers for {config.topology}.
        </p>
      </div>


      {/* Frontend Ecosystem Grid */}
      {hasFrontend && (
        <div className="ui-panel rounded-2xl p-5 border space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-cyan-500" />
              <h4 className="font-bold text-xs uppercase tracking-wider">
                Frontend Framework & Primitives
              </h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {config.frontend.framework === 'nextjs' ? 'Next.js 15 App Router' : 'React 19 + Tailwind v4'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Library Selection */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider opacity-70 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-orange-500" />
                <span>Date & Time Library</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {dateOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      onChange((prev) => ({
                        ...prev,
                        frontend: { ...prev.frontend, dateLib: opt.id },
                      }))
                    }
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      config.frontend.dateLib === opt.id
                        ? 'ui-active-ring'
                        : 'ui-card-subtle opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="font-bold text-xs">{opt.label}</div>
                    <div className="text-[10px] opacity-60 leading-tight mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* State Management */}
            {!isElectron && config.frontend.framework !== 'nextjs' && (
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider opacity-70 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-500" />
                  <span>State & Cache Layer</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {stateOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        onChange((prev) => ({
                          ...prev,
                          frontend: { ...prev.frontend, state: opt.id },
                        }))
                      }
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        config.frontend.state === opt.id
                          ? 'ui-active-ring'
                          : 'ui-card-subtle opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="font-bold text-xs">{opt.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* UI Extras: Icons, Toast, Forms */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider opacity-70 block mb-1">
                Icons Library
              </label>
              <select
                value={config.frontend.icons || 'lucide'}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    frontend: { ...prev.frontend, icons: e.target.value as any },
                  }))
                }
                className="w-full px-2.5 py-1.5 ui-input rounded-xl text-xs font-mono"
              >
                {iconOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider opacity-70 block mb-1">
                Toast Notifications
              </label>
              <select
                value={config.frontend.toast || 'sonner'}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    frontend: { ...prev.frontend, toast: e.target.value as any },
                  }))
                }
                className="w-full px-2.5 py-1.5 ui-input rounded-xl text-xs font-mono"
              >
                {toastOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider opacity-70 block mb-1">
                Forms & Validation
              </label>
              <select
                value={config.frontend.forms || 'rhf-zod'}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    frontend: { ...prev.frontend, forms: e.target.value as any },
                  }))
                }
                className="w-full px-2.5 py-1.5 ui-input rounded-xl text-xs font-mono"
              >
                {formOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Backend Ecosystem Grid */}
      {hasBackend && (
        <div className="ui-panel rounded-2xl p-5 border space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-500" />
              <h4 className="font-bold text-xs uppercase tracking-wider">
                Backend Framework & Persistence
              </h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              {config.backend.framework} + {config.backend.database}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Backend Framework */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider opacity-70 block">
                Backend Server
              </label>
              <div className="space-y-1.5">
                {[
                  {
                    id: 'none',
                    label: isNext ? 'None (Next.js Routes Only)' : isElectron ? 'None (IPC Handlers Only)' : 'None (Stateless)',
                    icon: <Terminal className="w-4 h-4 text-slate-500" />,
                  },
                  { id: 'fastify', label: 'Fastify v5', icon: <FastifyIcon className="w-4 h-4" /> },
                  { id: 'express', label: 'Express v4', icon: <ExpressIcon className="w-4 h-4" /> },
                  { id: 'hono', label: 'Hono v4', icon: <HonoIcon className="w-4 h-4" /> },
                ].map((fw) => (
                  <button
                    key={fw.id}
                    type="button"
                    onClick={() =>
                      onChange((prev) => ({
                        ...prev,
                        backend: {
                          ...prev.backend,
                          framework: fw.id as any,
                          ...(fw.id === 'none'
                            ? { database: 'none', orm: 'none' }
                            : prev.backend.database === 'none'
                            ? { database: 'postgres', orm: 'drizzle' }
                            : {}),
                        },
                      }))
                    }
                    className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                      config.backend.framework === fw.id
                        ? 'ui-active-ring font-bold'
                        : 'ui-card-subtle opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {fw.icon}
                      <span>{fw.label}</span>
                    </div>
                    {config.backend.framework === fw.id && <Check className="w-3.5 h-3.5 text-orange-500" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Database & ORM conditional on framework !== 'none' */}
            {config.backend.framework === 'none' ? (
              <div className="col-span-1 md:col-span-2 p-6 rounded-xl ui-card-subtle border border-dashed flex flex-col items-center justify-center text-center space-y-2 opacity-70">
                <Database className="w-6 h-6 text-slate-500" />
                <p className="text-xs font-semibold text-[var(--text-main)]">
                  {isNext
                    ? 'Using Next.js Route Handlers & Server Actions'
                    : isElectron
                    ? 'Using Electron IPC Handlers (profile:create, log:getAll)'
                    : 'No Dedicated Backend Process'}
                </p>
                <p className="text-[11px] text-[var(--text-muted)] max-w-sm">
                  Click Fastify, Express, or Hono to synthesize an independent, decoupled backend server in <code className="text-orange-400">server/</code>.
                </p>
              </div>
            ) : (
              <>
                {/* Database */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider opacity-70 block">
                    Database Engine
                  </label>
                  <div className="space-y-1.5">
                    {[
                      {
                        id: 'postgres',
                        label: 'PostgreSQL',
                        icon: <PostgresIcon className="w-4 h-4 text-blue-400" />,
                        defaultOrm: 'drizzle',
                      },
                      {
                        id: 'mongodb',
                        label: 'MongoDB',
                        icon: <MongoIcon className="w-4 h-4 text-emerald-400" />,
                        defaultOrm: 'mongoose',
                      },
                      {
                        id: 'sqlite',
                        label: 'SQLite',
                        icon: <SqliteIcon className="w-4 h-4 text-cyan-400" />,
                        defaultOrm: 'drizzle',
                      },
                    ].map((db) => (
                      <button
                        key={db.id}
                        type="button"
                        onClick={() =>
                          onChange((prev) => ({
                            ...prev,
                            backend: {
                              ...prev.backend,
                              database: db.id as any,
                              orm: db.defaultOrm as any,
                            },
                          }))
                        }
                        className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                          config.backend.database === db.id
                            ? 'ui-active-ring font-bold'
                            : 'ui-card-subtle opacity-70 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {db.icon}
                          <span>{db.label}</span>
                        </div>
                        {config.backend.database === db.id && <Check className="w-3.5 h-3.5 text-orange-500" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ORM / ODM */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider opacity-70 block">
                    ORM / Data Access
                  </label>
                  <div className="space-y-1.5">
                    {config.backend.database === 'mongodb' ? (
                      <button
                        type="button"
                        className="w-full p-2.5 rounded-xl border ui-active-ring flex items-center justify-between text-xs cursor-default font-bold"
                      >
                        <div className="flex items-center gap-2">
                          <MongoIcon className="w-4 h-4 text-emerald-400" />
                          <span>Mongoose ODM</span>
                        </div>
                        <Check className="w-3.5 h-3.5 text-orange-500" />
                      </button>
                    ) : (
                      [
                        { id: 'drizzle', label: 'Drizzle ORM', icon: <DrizzleIcon className="w-4 h-4" /> },
                        { id: 'prisma', label: 'Prisma ORM', icon: <PrismaIcon className="w-4 h-4" /> },
                      ].map((orm) => (
                        <button
                          key={orm.id}
                          type="button"
                          onClick={() =>
                            onChange((prev) => ({
                              ...prev,
                              backend: { ...prev.backend, orm: orm.id as any },
                            }))
                          }
                          className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                            config.backend.orm === orm.id
                              ? 'ui-active-ring font-bold'
                              : 'ui-card-subtle opacity-70 hover:opacity-100'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {orm.icon}
                            <span>{orm.label}</span>
                          </div>
                          {config.backend.orm === orm.id && <Check className="w-3.5 h-3.5 text-orange-500" />}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
