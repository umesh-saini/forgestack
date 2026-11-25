import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Copy, FilePlus2, Pencil, Play, Search, SlidersHorizontal, Trash2 } from 'lucide-react';
import { generateProjectVfs, type ProjectConfig } from '@forgestk/core/browser';
import type { SavedTemplate } from '../../types/template.js';
import { archetypeOf, hasBackend, hasFrontend, label } from '../../data/catalog.js';
import { Button, IconButton, Segmented, Tag, TextInput, cx } from '../ui/primitives.js';

interface Props {
  templates: SavedTemplate[];
  onNewStack: () => void;
  onEditTemplate: (template: SavedTemplate) => void;
  onFastScaffold: (template: SavedTemplate) => void;
  onDuplicateTemplate: (templateId: string) => void;
  onDeleteTemplate: (templateId: string) => void;
  onRenameTemplate: (templateId: string, newName: string) => void;
}

type Filter = 'all' | 'curated' | 'saved';

const COLS = 'grid grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_64px] gap-4';

export const HomeTemplatesDashboard: React.FC<Props> = ({
  templates,
  onNewStack,
  onEditTemplate,
  onFastScaffold,
  onDuplicateTemplate,
  onDeleteTemplate,
  onRenameTemplate,
}) => {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(templates[0]?.id ?? null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return templates.filter((t) => {
      if (filter === 'curated' && !t.isBuiltIn) return false;
      if (filter === 'saved' && t.isBuiltIn) return false;
      if (!q) return true;
      return `${t.name} ${t.description} ${t.config.topology} ${t.config.frontend.framework} ${t.config.backend.framework} ${t.config.backend.database}`
        .toLowerCase()
        .includes(q);
    });
  }, [templates, filter, query]);

  const selected = visible.find((t) => t.id === selectedId) ?? visible[0] ?? null;
  const savedCount = templates.filter((t) => !t.isBuiltIn).length;

  // "/" focuses search, as in most dense list tools.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const onListKey = (e: React.KeyboardEvent) => {
    if (!selected) return;
    const i = visible.findIndex((t) => t.id === selected.id);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = visible[Math.max(0, Math.min(visible.length - 1, i + (e.key === 'ArrowDown' ? 1 : -1)))];
      if (next) {
        setSelectedId(next.id);
        listRef.current?.querySelector<HTMLElement>(`[data-id="${next.id}"]`)?.focus();
      }
    } else if (e.key === 'Enter') {
      onEditTemplate(selected);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="h-14 shrink-0 flex items-center gap-3 px-5 border-b border-line">
        <h1 className="t-page mr-2">Templates</h1>
        <div className="relative w-[280px]">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-faint pointer-events-none" />
          <TextInput
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, topology or stack"
            className="pl-8"
            aria-label="Search templates"
          />
        </div>
        <Segmented<Filter>
          label="Template source"
          value={filter}
          onChange={setFilter}
          options={[
            { id: 'all', label: `All ${templates.length}` },
            { id: 'curated', label: 'Curated' },
            { id: 'saved', label: `Saved ${savedCount}` },
          ]}
        />
        <div className="flex-1" />
        <Button variant="secondary" onClick={onNewStack}>
          <FilePlus2 className="w-4 h-4" />
          New project
        </Button>
      </div>

      <div className="flex-1 min-h-0 flex">
        {/* Catalogue */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className={cx(COLS, 'h-9 shrink-0 items-center px-5 border-b border-line t-label text-faint')}>
            <span>Name</span>
            <span>Topology</span>
            <span>Frontend</span>
            <span>Backend</span>
            <span>Database</span>
            <span className="text-right">Source</span>
          </div>

          <div ref={listRef} role="listbox" aria-label="Templates" onKeyDown={onListKey} className="flex-1 overflow-y-auto">
            {visible.length === 0 ? (
              <div className="px-5 py-10">
                <p className="text-[13.5px] text-fg">
                  {filter === 'saved' && !query ? 'No saved templates yet.' : `No template matches “${query}”.`}
                </p>
                <p className="text-[13px] text-muted mt-1">
                  {filter === 'saved' && !query
                    ? 'Configure a project in New project, then use Save as template on the Review stage.'
                    : 'Try a topology like “monorepo” or a database like “postgres”.'}
                </p>
                <div className="flex gap-2 mt-4">
                  {query && (
                    <Button size="sm" onClick={() => setQuery('')}>
                      Clear search
                    </Button>
                  )}
                  <Button size="sm" onClick={onNewStack}>
                    New project
                  </Button>
                </div>
              </div>
            ) : (
              visible.map((t, i) => {
                const on = selected?.id === t.id;
                const c = t.config;
                return (
                  <motion.button
                    key={t.id}
                    type="button"
                    role="option"
                    aria-selected={on}
                    data-id={t.id}
                    data-selected={on}
                    tabIndex={on ? 0 : -1}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i, 8) * 0.012, duration: 0.14 }}
                    onClick={() => setSelectedId(t.id)}
                    onDoubleClick={() => onEditTemplate(t)}
                    className={cx(
                      'wipe w-full h-[52px] px-5 items-center text-left border-b border-line',
                      COLS,
                      !on && 'hover:bg-surface',
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[13.5px] font-medium">{t.name}</span>
                      <span className="wipe-sub block truncate t-mono text-faint">{c.name}</span>
                    </span>
                    <span className="truncate text-[13px]">{archetypeOf(c.topology).title}</span>
                    <span className="wipe-sub truncate text-[13px] text-muted">{hasFrontend(c) ? label(c.frontend.framework) : 'None'}</span>
                    <span className="wipe-sub truncate text-[13px] text-muted">{hasBackend(c) ? label(c.backend.framework) : 'None'}</span>
                    <span className="wipe-sub truncate text-[13px] text-muted">{label(c.backend.database)}</span>
                    <span className="wipe-sub text-right t-mono text-faint">{t.isBuiltIn ? 'curated' : 'saved'}</span>
                  </motion.button>
                );
              })
            )}
          </div>
        </div>

        {/* Inspector */}
        <aside className="w-[424px] shrink-0 border-l border-line bg-surface flex flex-col" aria-label="Template details">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                className="flex-1 min-h-0 flex flex-col"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                transition={{ duration: 0.14, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <TemplateInspector
                  template={selected}
                  onCustomize={() => onEditTemplate(selected)}
                  onScaffold={() => onFastScaffold(selected)}
                  onDuplicate={() => onDuplicateTemplate(selected.id)}
                  onDelete={() => onDeleteTemplate(selected.id)}
                  onRename={(name) => onRenameTemplate(selected.id, name)}
                />
              </motion.div>
            ) : (
              <div className="p-5 text-[13px] text-muted">Select a template to see its layers.</div>
            )}
          </AnimatePresence>
        </aside>
      </div>
    </div>
  );
};

/* ───────────────────────── Inspector ───────────────────────── */

function useFileCount(config: ProjectConfig) {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    let alive = true;
    setCount(null);
    generateProjectVfs(config)
      .then((vfs) => alive && setCount(vfs.count()))
      .catch(() => alive && setCount(-1));
    return () => {
      alive = false;
    };
  }, [config]);
  return count;
}

const TemplateInspector: React.FC<{
  template: SavedTemplate;
  onCustomize: () => void;
  onScaffold: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onRename: (name: string) => void;
}> = ({ template, onCustomize, onScaffold, onDuplicate, onDelete, onRename }) => {
  const c = template.config;
  const fileCount = useFileCount(c);
  const [renaming, setRenaming] = useState(false);
  const [name, setName] = useState(template.name);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const layers: [string, string][] = [
    ['Topology', archetypeOf(c.topology).title],
    ...(hasFrontend(c)
      ? ([
          ['Frontend', label(c.frontend.framework)],
          ['Styling', label(c.frontend.styling)],
          ['State', label(c.frontend.state)],
        ] as [string, string][])
      : []),
    ...(hasBackend(c) ? ([['Backend', label(c.backend.framework)]] as [string, string][]) : []),
    ...(c.backend.database !== 'none'
      ? ([
          ['Database', label(c.backend.database)],
          ['ORM', label(c.backend.orm)],
        ] as [string, string][])
      : []),
    ['Auth', label(c.auth)],
    ['RPC', label(c.rpc)],
    ['End-to-end tests', label(c.testing?.e2e)],
    ['CI', label(c.ci)],
    ['Deployment', label(c.deployment ?? 'docker')],
  ];

  const governance = [
    c.aiGovernance.rules && 'Cursor rules',
    (c.aiGovernance.claude ?? true) && 'CLAUDE.md',
    c.aiGovernance.skills && 'Agent skills',
    (c.aiGovernance.mcp ?? false) && 'MCP server',
  ].filter(Boolean) as string[];

  return (
    <>
      <div className="px-5 pt-5 pb-4 border-b border-line">
        {renaming ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (name.trim()) onRename(name.trim());
              setRenaming(false);
            }}
            className="flex gap-2"
          >
            <TextInput autoFocus value={name} onChange={(e) => setName(e.target.value)} aria-label="Template name" />
            <Button type="submit" size="md">
              Save
            </Button>
          </form>
        ) : (
          <div className="flex items-start justify-between gap-3">
            <h2 className="t-section">{template.name}</h2>
            <div className="flex -mr-1.5 -mt-0.5">
              {!template.isBuiltIn && (
                <IconButton label="Rename" onClick={() => setRenaming(true)}>
                  <Pencil className="w-3.5 h-3.5" />
                </IconButton>
              )}
              <IconButton label="Duplicate" onClick={onDuplicate}>
                <Copy className="w-3.5 h-3.5" />
              </IconButton>
              {!template.isBuiltIn && (
                <IconButton label="Delete" onClick={() => setConfirmDelete(true)} className="hover:!text-danger">
                  <Trash2 className="w-3.5 h-3.5" />
                </IconButton>
              )}
            </div>
          </div>
        )}
        <p className="text-[13px] text-muted mt-1.5">{template.description}</p>

        {confirmDelete && (
          <div className="mt-3 flex items-center justify-between gap-2 p-2 pl-3 rounded-2 border border-danger/50">
            <span className="text-[13px]">Delete “{template.name}”?</span>
            <div className="flex gap-1.5">
              <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="danger" onClick={onDelete}>
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-3">
        <dl>
          {layers.map(([k, v]) => (
            <div key={k} className="h-8 flex items-center justify-between gap-4 border-b border-line last:border-b-0">
              <dt className="text-[13px] text-muted">{k}</dt>
              <dd className={cx('text-[13px] truncate', v === 'None' ? 'text-faint' : 'text-fg')}>{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5">
          <div className="t-label text-muted mb-2">Package manager</div>
          <Tag>{c.packageManager}</Tag>
        </div>
        <div className="mt-4">
          <div className="t-label text-muted mb-2">AI governance</div>
          <div className="flex flex-wrap gap-1.5">
            <Tag>{label(c.aiGovernance.engine ?? 'openspec')}</Tag>
            {governance.map((g) => (
              <Tag key={g}>{g}</Tag>
            ))}
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-line px-5 py-3 flex items-center gap-2">
        <span className="t-mono text-muted tabular mr-auto">
          {fileCount === null ? 'Counting files' : fileCount < 0 ? 'Invalid combination' : `${fileCount} files`}
        </span>
        <Button variant="ghost" onClick={onCustomize}>
          <SlidersHorizontal className="w-4 h-4" />
          Customize
        </Button>
        <Button variant="secondary" onClick={onScaffold}>
          <Play className="w-3.5 h-3.5" />
          Quick scaffold
        </Button>
      </div>
    </>
  );
};
