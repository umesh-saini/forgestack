import React, { useEffect, useMemo, useRef, useState } from 'react';
import Editor, { type BeforeMount } from '@monaco-editor/react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronDown, Copy, FilePlus2, Maximize2, Minimize2, Search, TerminalSquare, X } from 'lucide-react';
import { normalizeConfig, type ProjectConfig, type TreeNode } from '@forgestack/core/browser';
import type { ThemeId } from '../../theme.js';
import { getFileIcon } from '../common/TechIcons.js';
import { IconButton, TextInput, cx } from '../ui/primitives.js';
import { FileTree } from './FileTree.js';
import type { LogLine } from './run-types.js';

export function getMonacoLanguage(path: string | null): string {
  if (!path) return 'plaintext';
  const p = path.toLowerCase();
  if (p.endsWith('.tsx') || p.endsWith('.ts')) return 'typescript';
  if (/\.(jsx|js|mjs|cjs)$/.test(p)) return 'javascript';
  if (p.endsWith('.json')) return 'json';
  if (p.endsWith('.md') || p.endsWith('.mdc')) return 'markdown';
  if (p.endsWith('.css') || p.endsWith('.scss')) return 'css';
  if (p.endsWith('.html')) return 'html';
  if (p.endsWith('.yaml') || p.endsWith('.yml')) return 'yaml';
  if (p.includes('dockerfile')) return 'dockerfile';
  if (p.endsWith('.sh') || p.endsWith('.bash')) return 'shell';
  if (p.endsWith('.toml')) return 'ini';
  return 'plaintext';
}

/** Monaco themes built from the app tokens so the editor is part of the surface, not a pasted-in VS Code. */
const defineThemes: BeforeMount = (monaco) => {
  monaco.editor.defineTheme('forge-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6E7266', fontStyle: 'italic' },
      { token: 'string', foreground: 'B9C98A' },
      { token: 'keyword', foreground: 'DFE34A' },
      { token: 'number', foreground: '7BA7C9' },
      { token: 'type', foreground: '9FC7B0' },
      { token: 'delimiter', foreground: '9A9E90' },
    ],
    colors: {
      'editor.background': '#121311',
      'editor.foreground': '#ECEDE6',
      'editorLineNumber.foreground': '#3A3D34',
      'editorLineNumber.activeForeground': '#9A9E90',
      'editor.lineHighlightBackground': '#181A16',
      'editor.selectionBackground': '#DFE34A33',
      'editorIndentGuide.background1': '#2A2C26',
      'editorCursor.foreground': '#DFE34A',
      'scrollbarSlider.background': '#2A2C2688',
    },
  });
  monaco.editor.defineTheme('forge-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '86897B', fontStyle: 'italic' },
      { token: 'string', foreground: '4D6A1F' },
      { token: 'keyword', foreground: '6C7218', fontStyle: 'bold' },
      { token: 'number', foreground: '2E5C7A' },
      { token: 'type', foreground: '2F7A55' },
    ],
    colors: {
      'editor.background': '#FAFAF6',
      'editor.foreground': '#1A1B14',
      'editorLineNumber.foreground': '#C4C4B7',
      'editorLineNumber.activeForeground': '#5E6154',
      'editor.lineHighlightBackground': '#F1F1EC',
      'editor.selectionBackground': '#DFE34A66',
      'editorCursor.foreground': '#1A1B14',
    },
  });
};

const editorOptions = {
  readOnly: true,
  minimap: { enabled: false },
  fontSize: 12.5,
  lineHeight: 20,
  fontFamily: "'JetBrains Mono Variable', 'JetBrains Mono', monospace",
  scrollBeyondLastLine: false,
  renderLineHighlight: 'line' as const,
  padding: { top: 12 },
  overviewRulerLanes: 0,
  scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
  automaticLayout: true,
};

interface Props {
  tree: TreeNode[];
  fileCount: number;
  config: ProjectConfig;
  theme: ThemeId;
  openTabs: string[];
  activePath: string | null;
  activeContent: string | null;
  logs: LogLine[];
  isGenerating: boolean;
  isMaximized: boolean;
  onToggleMaximize: () => void;
  onSelectFile: (path: string) => void;
  onCloseTab: (path: string) => void;
  onAddCustomFile: (path: string, content: string) => void;
}

const KEY_FILES = ['package.json', 'README.md', 'turbo.json', 'docker-compose.yml', 'CLAUDE.md', 'tsconfig.json'];

export const PreviewPane: React.FC<Props> = ({
  tree,
  fileCount,
  config,
  theme,
  openTabs,
  activePath,
  activeContent,
  logs,
  isGenerating,
  isMaximized,
  onToggleMaximize,
  onSelectFile,
  onCloseTab,
  onAddCustomFile,
}) => {
  const [view, setView] = useState<'files' | 'config'>('files');
  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState(false);
  const [newPath, setNewPath] = useState('');
  const [copied, setCopied] = useState(false);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const monacoTheme = theme === 'theme-light' ? 'forge-light' : 'forge-dark';

  const hasLogs = logs.length > 0;
  useEffect(() => {
    if (hasLogs) setConsoleOpen(true);
  }, [hasLogs]);

  const normalized = useMemo(() => {
    try {
      return JSON.stringify(normalizeConfig(config), null, 2);
    } catch (e) {
      return `// ${(e as Error).message}\n${JSON.stringify(config, null, 2)}`;
    }
  }, [config]);

  const topLevel = useMemo(() => tree.filter((n) => n.type === 'file' && KEY_FILES.includes(n.name)), [tree]);

  const copy = async (text: string | null) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const lines = activeContent ? activeContent.split('\n').length : 0;

  return (
    <div className="h-full flex flex-col bg-main">
      {/* Toolbar */}
      <div className="h-10 shrink-0 flex items-center gap-2 px-2 border-b border-line">
        <div role="tablist" className="flex h-full">
          {(['files', 'config'] as const).map((v) => (
            <button
              key={v}
              role="tab"
              type="button"
              aria-selected={view === v}
              onClick={() => setView(v)}
              className={cx('relative h-full px-3 text-[13.5px]', view === v ? 'text-fg font-medium' : 'text-muted hover:text-fg')}
            >
              {v === 'files' ? 'Files' : 'Configuration'}
              {view === v && <motion.span layoutId="preview-tab" className="absolute left-2 right-2 -bottom-px h-0.5 bg-fg" />}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <span className="t-mono text-muted tabular mr-1">
          <motion.span key={fileCount} initial={{ opacity: 0.2 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            {fileCount}
          </motion.span>{' '}
          files
        </span>
        <IconButton label="Add file to preview" onClick={() => setAdding((a) => !a)} active={adding}>
          <FilePlus2 className="w-4 h-4" />
        </IconButton>
        <IconButton label={consoleOpen ? 'Hide console' : 'Show console'} onClick={() => setConsoleOpen((o) => !o)} active={consoleOpen}>
          <TerminalSquare className="w-4 h-4" />
        </IconButton>
        <IconButton label={isMaximized ? 'Show configuration' : 'Maximize preview'} onClick={onToggleMaximize}>
          {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </IconButton>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex-1 min-h-0 flex">
          {view === 'files' ? (
            <>
              {/* Tree */}
              <div className="w-[260px] shrink-0 flex flex-col border-r border-line bg-surface">
                <div className="p-2 border-b border-line">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-faint pointer-events-none" />
                    <TextInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter paths" className="pl-8 !h-7" aria-label="Filter files" />
                  </div>
                  <AnimatePresence>
                    {adding && (
                      <motion.form
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!newPath.trim()) return;
                          onAddCustomFile(newPath.trim(), '// Added in ForgeStack Studio\nexport {};\n');
                          setNewPath('');
                          setAdding(false);
                        }}
                      >
                        <TextInput
                          autoFocus
                          value={newPath}
                          onChange={(e) => setNewPath(e.target.value)}
                          placeholder="src/lib/new-file.ts  ↵"
                          className="mt-2 !h-7 font-mono"
                          aria-label="New file path"
                        />
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto">
                  <FileTree tree={tree} query={query} selectedPath={activePath} onSelect={onSelectFile} />
                </div>
              </div>

              {/* Editor */}
              <div className="flex-1 min-w-0 flex flex-col">
                {openTabs.length > 0 && activePath ? (
                  <>
                    <div className="h-8 shrink-0 flex items-stretch border-b border-line bg-surface overflow-x-auto">
                      {openTabs.map((p) => {
                        const on = p === activePath;
                        const name = p.split('/').pop() ?? p;
                        return (
                          <div
                            key={p}
                            className={cx(
                              'group relative flex items-center gap-1.5 pl-3 pr-1 border-r border-line t-mono shrink-0 cursor-pointer',
                              on ? 'bg-main text-fg' : 'text-muted hover:text-fg',
                            )}
                            onClick={() => onSelectFile(p)}
                            title={p}
                          >
                            {on && <motion.span layoutId="editor-tab" className="absolute inset-x-0 top-0 h-0.5 bg-accent" />}
                            <span className="w-3.5 h-3.5 flex items-center [&_svg]:w-3.5 [&_svg]:h-3.5">{getFileIcon(name)}</span>
                            {name}
                            <button
                              type="button"
                              aria-label={`Close ${name}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                onCloseTab(p);
                              }}
                              className={cx('w-5 h-5 flex items-center justify-center rounded-1 hover:bg-raised', !on && 'opacity-0 group-hover:opacity-100')}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    <div className="h-7 shrink-0 flex items-center gap-2 px-3 border-b border-line">
                      <span className="flex-1 min-w-0 truncate t-mono text-faint">{activePath}</span>
                      <span className="t-mono text-faint tabular">{lines} lines</span>
                      <button type="button" onClick={() => copy(activeContent)} className="flex items-center gap-1 text-[12.5px] text-muted hover:text-fg">
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <div className="flex-1 min-h-0">
                      <Editor
                        path={activePath}
                        value={activeContent ?? ''}
                        language={getMonacoLanguage(activePath)}
                        theme={monacoTheme}
                        beforeMount={defineThemes}
                        options={editorOptions}
                        loading={<div className="p-4 t-mono text-faint">Loading editor…</div>}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col justify-center px-10">
                    <p className="t-section">Nothing is written until you scaffold.</p>
                    <p className="text-[13px] text-muted mt-1 max-w-[420px]">
                      Every file here is generated in memory from the configuration on the left and updates as you change it. Open one to read it.
                    </p>
                    {topLevel.length > 0 && (
                      <ul className="mt-5 flex flex-col gap-px max-w-[360px]">
                        {topLevel.map((f) => (
                          <li key={f.path}>
                            <button
                              type="button"
                              onClick={() => onSelectFile(f.path)}
                              className="w-full h-8 px-2 flex items-center gap-2 rounded-2 t-mono text-muted hover:text-fg hover:bg-raised"
                            >
                              <span className="w-3.5 h-3.5 flex items-center [&_svg]:w-3.5 [&_svg]:h-3.5">{getFileIcon(f.name)}</span>
                              {f.path}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="h-8 shrink-0 flex items-center gap-2 px-3 border-b border-line bg-surface">
                <span className="flex-1 t-mono text-faint">Normalized configuration passed to the engine</span>
                <button type="button" onClick={() => copy(normalized)} className="flex items-center gap-1 text-[12.5px] text-muted hover:text-fg">
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy JSON'}
                </button>
              </div>
              <div className="flex-1 min-h-0">
                <Editor path="forgestack.config.json" value={normalized} language="json" theme={monacoTheme} beforeMount={defineThemes} options={editorOptions} />
              </div>
            </div>
          )}
        </div>

        {/* Console */}
        <AnimatePresence initial={false}>
          {consoleOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 240 }}
              exit={{ height: 0 }}
              transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
              className="shrink-0 overflow-hidden border-t border-line bg-sunken"
            >
              <Console logs={logs} isGenerating={isGenerating} onClose={() => setConsoleOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const toneClass: Record<string, string> = {
  info: 'text-fg',
  ok: 'text-ok',
  error: 'text-danger',
  muted: 'text-muted',
};

const Console: React.FC<{ logs: LogLine[]; isGenerating: boolean; onClose: () => void }> = ({ logs, isGenerating, onClose }) => {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => endRef.current?.scrollIntoView({ block: 'end' }), [logs.length]);
  const start = logs[0]?.at ?? 0;

  return (
    <div className="h-[240px] flex flex-col">
      <div className="h-8 shrink-0 flex items-center gap-2 px-3 border-b border-line">
        <span className="t-label text-muted">Console</span>
        {isGenerating && <span className="w-1.5 h-1.5 bg-accent caret" />}
        <span className="flex-1" />
        <IconButton label="Hide console" onClick={onClose} className="!w-6 !h-6">
          <ChevronDown className="w-3.5 h-3.5" />
        </IconButton>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2 t-mono">
        {logs.length === 0 ? (
          <p className="text-faint">Output from scaffolding appears here.</p>
        ) : (
          logs.map((l, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -3 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i < 8 ? i * 0.012 : 0, duration: 0.12 }}
              className="flex gap-3 whitespace-pre-wrap"
            >
              <span className="text-faint tabular shrink-0 w-[52px] text-right">+{((l.at - start) / 1000).toFixed(2)}s</span>
              <span className="text-faint shrink-0 w-[68px]">{l.tag}</span>
              <span className={cx('min-w-0 break-all', toneClass[l.tone ?? 'info'])}>{l.text}</span>
            </motion.div>
          ))
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
};
