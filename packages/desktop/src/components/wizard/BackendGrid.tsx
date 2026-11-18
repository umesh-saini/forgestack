import React from 'react';
import {
  Check,
  Container,
  Database,
  Layers,
  Server,
  Zap,
} from 'lucide-react';
import type { ProjectConfig } from '@forgestack/core/browser';
import { Badge } from '../common/Badge.js';

interface Props {
  backend: ProjectConfig['backend'];
  onChange: (be: ProjectConfig['backend']) => void;
}

export const BackendGrid: React.FC<Props> = ({ backend, onChange }) => {
  const frameworks: {
    id: ProjectConfig['backend']['framework'];
    name: string;
    tag: string;
    desc: string;
    recommended?: boolean;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'fastify',
      name: 'Fastify v5',
      tag: 'High Performance & Schema-first',
      desc: 'Blazing fast throughput, native JSON schema validation, plugins architecture, and Pino logger.',
      recommended: true,
      icon: <Zap className="w-4 h-4 text-emerald-500" />,
    },
    {
      id: 'express',
      name: 'Express v4',
      tag: 'Classic Node.js Middleware',
      desc: 'Universal middleware ecosystem, Helmet security headers, rate limiting, and standard REST routing.',
      icon: <Server className="w-4 h-4 text-blue-500" />,
    },
    {
      id: 'hono',
      name: 'Hono Web Framework',
      tag: 'Multi-runtime Ultra-light',
      desc: 'Extremely fast, type-safe web framework running smoothly across Node.js, Bun, and Edge runtimes.',
      icon: <Layers className="w-4 h-4 text-amber-500" />,
    },
  ];

  const databases: {
    id: ProjectConfig['backend']['database'];
    name: string;
    tag: string;
    desc: string;
    compatibleOrm: ProjectConfig['backend']['orm'];
    icon: React.ReactNode;
  }[] = [
    {
      id: 'postgres',
      name: 'PostgreSQL',
      tag: 'Relational ACID Database',
      desc: 'Enterprise relational database with pooling, pg-connection-string, and Drizzle/Prisma schema migrations.',
      compatibleOrm: 'drizzle',
      icon: <Database className="w-4 h-4 text-blue-500" />,
    },
    {
      id: 'mongodb',
      name: 'MongoDB',
      tag: 'Document NoSQL Database',
      desc: 'Flexible document datastore with Mongoose ODM connection retry backoff loop and schema models.',
      compatibleOrm: 'mongoose',
      icon: <Database className="w-4 h-4 text-emerald-500" />,
    },
    {
      id: 'sqlite',
      name: 'SQLite (better-sqlite3)',
      tag: 'Embedded Zero-Config SQL',
      desc: 'Zero-configuration embedded disk database ideal for rapid development and edge microservices.',
      compatibleOrm: 'drizzle',
      icon: <Database className="w-4 h-4 text-cyan-500" />,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Framework Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider opacity-70">
            HTTP Engine & Application Server
          </label>
          <span className="text-[11px] font-mono opacity-50">Select 1 engine</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {frameworks.map((item) => {
            const isSelected = backend.framework === item.id;
            return (
              <div
                key={item.id}
                onClick={() => onChange({ ...backend, framework: item.id })}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'ui-active-ring'
                    : 'ui-card hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg ui-card-subtle border">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs flex items-center gap-1.5">
                        {item.name}
                        {item.recommended && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded ui-card-subtle text-emerald-500 font-mono">
                            Fastest
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-emerald-500 font-mono">{item.tag}</p>
                    </div>
                  </div>

                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-orange-600 border-orange-500 text-white'
                        : 'ui-card-subtle opacity-50'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </div>

                <p className="text-[11px] opacity-70 mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Database Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider opacity-70">
            Data Persistence & ORM Layer
          </label>
          <span className="text-[11px] font-mono opacity-50">Configured persistence</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {databases.map((item) => {
            const isSelected = backend.database === item.id;
            return (
              <div
                key={item.id}
                onClick={() =>
                  onChange({
                    ...backend,
                    database: item.id,
                    orm: item.compatibleOrm,
                  })
                }
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'ui-active-ring'
                    : 'ui-card hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg ui-card-subtle border">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs">{item.name}</h4>
                      <p className="text-[10px] text-orange-500 font-mono">
                        ORM: {item.compatibleOrm}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-orange-600 border-orange-500 text-white'
                        : 'ui-card-subtle opacity-50'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </div>

                <p className="text-[11px] opacity-70 mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Container Toggle */}
      <div className="p-3 rounded-xl ui-card-subtle flex items-center justify-between border">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg ui-panel border">
            <Container className="w-4 h-4 text-cyan-500" />
          </div>
          <div>
            <h4 className="text-xs font-semibold">
              Docker Compose Multi-Stage Service
            </h4>
            <p className="text-[11px] opacity-60">
              Auto-generate production Dockerfile with healthchecks and compose services
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onChange({ ...backend, container: !backend.container })}
          className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer border ${
            backend.container
              ? 'bg-cyan-600 text-white border-cyan-500 shadow-sm'
              : 'ui-card opacity-60'
          }`}
        >
          {backend.container ? 'ENABLED' : 'DISABLED'}
        </button>
      </div>
    </div>
  );
};
