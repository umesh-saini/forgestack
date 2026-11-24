import React from 'react';
import type { ProjectConfig } from '@forgestack/core/browser';
import {
  DrizzleIcon,
  ExpressIcon,
  FastifyIcon,
  HonoIcon,
  MongoIcon,
  NextJsIcon,
  PostgresIcon,
  PrismaIcon,
  ReactIcon,
  SqliteIcon,
} from '../common/TechIcons.js';
import { archetypeOf, label } from '../../data/catalog.js';
import { ConfigGroup, PickerRow } from '../studio/PickerRow.js';

interface Props {
  config: ProjectConfig;
  onChange: (updater: (prev: ProjectConfig) => ProjectConfig) => void;
}

const ic = 'w-4 h-4';
const FRONTEND_ONLY = ['standalone-fe', 'tauri-desktop', 'electron-desktop', 'micro-frontend'];
const BACKEND_ONLY = ['standalone-be', 'distributed-worker'];

const ReadOnlyRow: React.FC<{ label: string; value: string; icon?: React.ReactNode; reason: string }> = ({ label: l, value, icon, reason }) => (
  <div className="h-10 flex items-center gap-3 border-b border-line last:border-b-0" title={reason}>
    <span className="w-[136px] shrink-0 text-[13px] text-muted">{l}</span>
    <span className="flex-1 min-w-0 flex items-center gap-2">
      {icon}
      <span className="text-[13.5px]">{value}</span>
    </span>
    <span className="t-mono text-faint truncate max-w-[50%]">{reason}</span>
  </div>
);

export const Step2StackEcosystem: React.FC<Props> = ({ config, onChange }) => {
  const t = config.topology;
  const isNext = t === 'nextjs-fullstack';
  const showFrontend = !BACKEND_ONLY.includes(t) && config.frontend.framework !== 'none';
  const serverless = FRONTEND_ONLY.includes(t) && t !== 'micro-frontend';
  const needsPgDrizzle = t === 'ai-agent-rag';
  const db = config.backend.database;

  const setFe = (patch: Partial<ProjectConfig['frontend']>) => onChange((p) => ({ ...p, frontend: { ...p.frontend, ...patch } }));
  const setBe = (patch: Partial<ProjectConfig['backend']>) => onChange((p) => ({ ...p, backend: { ...p.backend, ...patch } }));

  return (
    <div>
      {showFrontend ? (
        <ConfigGroup title="Frontend">
          <ReadOnlyRow
            label="Framework"
            value={label(config.frontend.framework)}
            icon={isNext ? <NextJsIcon className={ic} /> : <ReactIcon className={ic} />}
            reason="set by architecture"
          />
          {!isNext && t !== 'electron-desktop' && (
            <PickerRow
              label="State"
              value={config.frontend.state}
              onChange={(v) => setFe({ state: v })}
              options={[
                { id: 'query', label: 'TanStack Query 5', meta: 'server cache' },
                { id: 'zustand', label: 'Zustand', meta: 'client store' },
                { id: 'redux', label: 'Redux Toolkit', meta: 'client store' },
                { id: 'none', label: 'React state only' },
              ]}
            />
          )}
          <PickerRow
            label="Forms"
            value={config.frontend.forms ?? 'rhf-zod'}
            onChange={(v) => setFe({ forms: v })}
            options={[
              { id: 'rhf-zod', label: 'React Hook Form + Zod' },
              { id: 'tanstack-form', label: 'TanStack Form' },
              { id: 'formik-yup', label: 'Formik + Yup' },
            ]}
          />
          <PickerRow
            label="Icons"
            value={config.frontend.icons ?? 'lucide'}
            onChange={(v) => setFe({ icons: v })}
            options={[
              { id: 'lucide', label: 'Lucide' },
              { id: 'tabler', label: 'Tabler' },
              { id: 'phosphor', label: 'Phosphor' },
              { id: 'react-icons', label: 'React Icons' },
            ]}
          />
          <PickerRow
            label="Toasts"
            value={config.frontend.toast ?? 'sonner'}
            onChange={(v) => setFe({ toast: v })}
            options={[
              { id: 'sonner', label: 'Sonner' },
              { id: 'toastify', label: 'React-Toastify' },
              { id: 'hot-toast', label: 'React Hot Toast' },
            ]}
          />
          <PickerRow
            label="Dates"
            value={config.frontend.dateLib ?? 'none'}
            onChange={(v) => setFe({ dateLib: v })}
            options={[
              { id: 'dayjs', label: 'Day.js', meta: '2 kB' },
              { id: 'date-fns', label: 'date-fns', meta: 'tree-shakable' },
              { id: 'moment', label: 'Moment.js', meta: 'legacy' },
              { id: 'none', label: 'Native Date' },
            ]}
          />
        </ConfigGroup>
      ) : (
        <ConfigGroup title="Frontend">
          <p className="py-3 text-[13px] text-muted">{archetypeOf(t).title} has no frontend package.</p>
        </ConfigGroup>
      )}

      {serverless ? (
        <ConfigGroup title="Backend and data">
          <p className="py-3 text-[13px] text-muted">
            {t === 'electron-desktop'
              ? 'Electron apps talk to the main process through IPC handlers; no server package is generated.'
              : t === 'tauri-desktop'
                ? 'Tauri apps call Rust commands over IPC; no Node server package is generated.'
                : 'Frontend-only projects have no server package.'}
          </p>
        </ConfigGroup>
      ) : (
        <>
          <ConfigGroup title="Backend">
            {isNext ? (
              <ReadOnlyRow label="Server" value="Next.js route handlers" icon={<NextJsIcon className={ic} />} reason="set by architecture" />
            ) : (
              <PickerRow
                label="Server"
                value={config.backend.framework}
                onChange={(v) =>
                  setBe({
                    framework: v,
                    ...(v === 'none'
                      ? { database: 'none' as const, orm: 'none' as const }
                      : config.backend.database === 'none'
                        ? { database: 'postgres' as const, orm: 'drizzle' as const }
                        : {}),
                  })
                }
                options={[
                  { id: 'fastify', label: 'Fastify 5', icon: <FastifyIcon className={ic} /> },
                  { id: 'express', label: 'Express 4', icon: <ExpressIcon className={ic} /> },
                  { id: 'hono', label: 'Hono 4', icon: <HonoIcon className={ic} /> },
                  {
                    id: 'none',
                    label: 'No server',
                    disabledReason: BACKEND_ONLY.includes(t) || needsPgDrizzle ? 'required by architecture' : undefined,
                  },
                ]}
              />
            )}
          </ConfigGroup>

          <ConfigGroup title="Data">
            {config.backend.framework === 'none' && !isNext ? (
              <p className="py-3 text-[13px] text-muted">Pick a server to add a database.</p>
            ) : (
              <>
                <PickerRow
                  label="Database"
                  value={db}
                  onChange={(v) => setBe({ database: v, orm: v === 'mongodb' ? 'mongoose' : v === 'none' ? 'none' : 'drizzle' })}
                  options={[
                    { id: 'postgres', label: 'PostgreSQL', icon: <PostgresIcon className={ic} /> },
                    {
                      id: 'mongodb',
                      label: 'MongoDB',
                      icon: <MongoIcon className={ic} />,
                      disabledReason: needsPgDrizzle ? 'pgvector needs PostgreSQL' : undefined,
                    },
                    {
                      id: 'sqlite',
                      label: 'SQLite',
                      icon: <SqliteIcon className={ic} />,
                      disabledReason: needsPgDrizzle ? 'pgvector needs PostgreSQL' : undefined,
                    },
                  ]}
                />
                <PickerRow
                  label="Data access"
                  value={config.backend.orm}
                  onChange={(v) => setBe({ orm: v })}
                  options={[
                    {
                      id: 'drizzle',
                      label: 'Drizzle ORM',
                      icon: <DrizzleIcon className={ic} />,
                      disabledReason: db === 'mongodb' ? 'MongoDB uses Mongoose' : undefined,
                    },
                    {
                      id: 'prisma',
                      label: 'Prisma ORM',
                      icon: <PrismaIcon className={ic} />,
                      disabledReason:
                        db === 'mongodb'
                          ? 'MongoDB uses Mongoose'
                          : db === 'sqlite'
                            ? 'SQLite supports Drizzle only'
                            : needsPgDrizzle
                              ? 'pgvector schema uses Drizzle'
                              : undefined,
                    },
                    {
                      id: 'mongoose',
                      label: 'Mongoose ODM',
                      icon: <MongoIcon className={ic} />,
                      disabledReason: db !== 'mongodb' ? 'MongoDB only' : undefined,
                    },
                  ]}
                />
              </>
            )}
          </ConfigGroup>
        </>
      )}
    </div>
  );
};
