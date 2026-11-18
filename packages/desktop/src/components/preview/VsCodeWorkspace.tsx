import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import {
  X,
  Copy,
  Check,
  PanelLeftClose,
  PanelLeftOpen,
  Maximize2,
  Minimize2,
  ChevronRight,
  Layers,
} from 'lucide-react';
import type { TreeNode } from '@forgestack/core/browser';
import { getFileIcon } from '../common/TechIcons.js';
import type { ThemeId } from '../wizard/Header.js';
import { FileTreePreview } from './FileTreePreview.js';
import { FileEditorDrawer } from './FileEditorDrawer.js';

interface Props {
  tree: TreeNode[];
  filesCount: number;
  openTabs: string[];
  activeFilePath: string | null;
  activeFileContent: string | null;
  theme: ThemeId;
  isMaximized: boolean;
  onSelectFile: (filePath: string) => void;
  onCloseTab: (filePath: string) => void;
  onRefresh: () => void;
  onAddCustomFile: (path: string, content: string) => void;
  onToggleMaximize?: () => void;
  onCloseEditor?: () => void;
}

export function getMonacoLanguage(path: string | null): string {
  if (!path) return 'plaintext';
  const lower = path.toLowerCase();
  if (lower.endsWith('.tsx') || lower.endsWith('.ts')) return 'typescript';
  if (
    lower.endsWith('.jsx') ||
    lower.endsWith('.js') ||
    lower.endsWith('.mjs') ||
    lower.endsWith('.cjs')
  )
    return 'javascript';
  if (lower.endsWith('.json')) return 'json';
  if (lower.endsWith('.md') || lower.endsWith('.mdc')) return 'markdown';
  if (lower.endsWith('.css') || lower.endsWith('.scss')) return 'css';
  if (lower.endsWith('.html')) return 'html';
  if (lower.endsWith('.yaml') || lower.endsWith('.yml')) return 'yaml';
  if (lower.includes('dockerfile') || lower.endsWith('.dockerfile')) return 'dockerfile';
  if (lower.endsWith('.sh') || lower.endsWith('.bash')) return 'shell';
  return 'plaintext';
}

export const VsCodeWorkspace: React.FC<Props> = ({
  tree,
  filesCount,
  openTabs,
  activeFilePath,
  activeFileContent,
  theme,
  isMaximized,
  onSelectFile,
  onCloseTab,
  onRefresh,
  onAddCustomFile,
  onToggleMaximize,
  onCloseEditor,
}) => {
  const [isExplorerVisible, setIsExplorerVisible] = useState(true);
  const [copied, setCopied] = useState(false);
  const activeTabRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll active tab into view whenever selection changes
  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [activeFilePath, openTabs]);

  const handleCopy = () => {
    if (!activeFileContent) return;
    navigator.clipboard.writeText(activeFileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const monacoTheme = theme === 'theme-light' ? 'light' : 'vs-dark';
  const language = getMonacoLanguage(activeFilePath);
  const linesCount = activeFileContent ? activeFileContent.split('\n').length : 0;
  const byteSize = activeFileContent
    ? (new TextEncoder().encode(activeFileContent).length / 1024).toFixed(2)
    : '0.00';

  const pathSegments = activeFilePath ? activeFilePath.split('/') : [];
  const hasOpenFile = Boolean(activeFilePath && activeFileContent !== null && openTabs.length > 0);

  return (
    <div className="h-full w-full">
      {/* ─────────────────────────────────────────────────────────────
          1. DESKTOP VIEW (lg:flex): True Side-by-Side VS Code Workspace
          If NO file is open: File tree occupies 100% width cleanly.
          If file IS open: Side-by-side Explorer + Monaco Editor with tabs.
         ───────────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex ui-panel rounded-2xl flex-row h-full shadow-sm overflow-hidden border bg-[var(--bg-surface)]">
        {!hasOpenFile ? (
          /* Clean full-width file explorer when no file is selected */
          <div className="w-full h-full overflow-hidden">
            <FileTreePreview
              tree={tree}
              filesCount={filesCount}
              selectedFilePath={null}
              compact={true}
              onSelectFile={onSelectFile}
              onRefresh={onRefresh}
              onAddCustomFile={onAddCustomFile}
            />
          </div>
        ) : (
          /* Dual-pane side-by-side explorer + editor */
          <>
            {/* Left Column: Explorer Pane */}
            {isExplorerVisible ? (
              <div className="w-64 xl:w-72 border-r flex flex-col shrink-0 h-full overflow-hidden">
                <FileTreePreview
                  tree={tree}
                  filesCount={filesCount}
                  selectedFilePath={activeFilePath}
                  compact={true}
                  onSelectFile={onSelectFile}
                  onRefresh={onRefresh}
                  onAddCustomFile={onAddCustomFile}
                />
              </div>
            ) : (
              /* Collapsed Activity Bar (Icon Strip) */
              <div className="w-12 border-r flex flex-col items-center py-3 bg-[var(--bg-card-subtle)] shrink-0 gap-3">
                <button
                  type="button"
                  onClick={() => setIsExplorerVisible(true)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer relative"
                  title="Expand Explorer (Ctrl+B)"
                >
                  <Layers className="w-4 h-4 text-orange-500" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-orange-500" />
                </button>
              </div>
            )}

            {/* Right Column: Monaco Code Editor & Tabs */}
            <div className="flex-1 min-w-0 flex flex-col h-full bg-[var(--bg-surface)]">
              {/* VS Code Top Tab Bar */}
              <div className="shrink-0 flex items-stretch justify-between border-b bg-[var(--bg-card-subtle)] select-none">
                {/* Horizontal Scrollable Tabs */}
                <div className="flex items-stretch overflow-x-auto scrollbar-none min-w-0">
                  {openTabs.map((tabPath) => {
                    const isActive = tabPath === activeFilePath;
                    const fileName = tabPath.split('/').pop() || tabPath;

                    return (
                      <div
                        key={tabPath}
                        ref={isActive ? activeTabRef : null}
                        onClick={() => onSelectFile(tabPath)}
                        className={`group flex items-center gap-2 px-3.5 py-2 text-xs font-mono cursor-pointer transition-colors border-r shrink-0 select-none ${
                          isActive
                            ? 'bg-[var(--bg-surface)] text-[var(--text-main)] border-t-2 border-t-orange-500 font-semibold shadow-xs'
                            : 'bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:bg-[var(--bg-surface)]/70 hover:text-[var(--text-main)]'
                        }`}
                      >
                        <span className="w-3.5 h-3.5 shrink-0 flex items-center justify-center">
                          {getFileIcon(tabPath)}
                        </span>
                        <span className="truncate max-w-[160px]">{fileName}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCloseTab(tabPath);
                          }}
                          className="p-0.5 rounded hover:bg-slate-500/20 opacity-50 hover:opacity-100 transition-opacity ml-1 cursor-pointer"
                          title="Close tab"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Right Action Bar in Tab Strip */}
                <div className="flex items-center gap-1 px-2 shrink-0 bg-[var(--bg-card-subtle)] border-l">
                  {/* Explorer Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setIsExplorerVisible(!isExplorerVisible)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[var(--text-main)] hover:bg-slate-500/15 transition-colors cursor-pointer"
                    title={isExplorerVisible ? 'Hide Explorer (Ctrl+B)' : 'Show Explorer'}
                  >
                    {isExplorerVisible ? (
                      <PanelLeftClose className="w-4 h-4" />
                    ) : (
                      <PanelLeftOpen className="w-4 h-4 text-orange-500" />
                    )}
                  </button>

                  {/* Copy Code Button */}
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[var(--text-main)] hover:bg-slate-500/15 transition-colors cursor-pointer flex items-center gap-1"
                    title="Copy code to clipboard"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-[10px] font-mono text-emerald-400 font-bold hidden sm:inline">
                          Copied!
                        </span>
                      </>
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  {/* Maximize / Split Toggle Button */}
                  {onToggleMaximize && (
                    <button
                      type="button"
                      onClick={onToggleMaximize}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isMaximized
                          ? 'text-orange-500 bg-orange-500/15'
                          : 'text-slate-400 hover:text-[var(--text-main)] hover:bg-slate-500/15'
                      }`}
                      title={isMaximized ? 'Restore Split Studio View' : 'Maximize Workspace (Zen Mode)'}
                    >
                      {isMaximized ? (
                        <Minimize2 className="w-4 h-4" />
                      ) : (
                        <Maximize2 className="w-4 h-4" />
                      )}
                    </button>
                  )}

                  {/* Close Editor Button */}
                  {onCloseEditor && (
                    <button
                      type="button"
                      onClick={onCloseEditor}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/15 transition-colors cursor-pointer ml-0.5"
                      title="Close editor pane"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Breadcrumb & Metadata Subheader */}
              <div className="px-3 py-1.5 border-b bg-[var(--bg-surface)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] shrink-0">
                <div className="flex items-center gap-1 truncate min-w-0">
                  <span className="opacity-50">staged</span>
                  {pathSegments.map((segment, idx) => (
                    <React.Fragment key={idx}>
                      <ChevronRight className="w-3 h-3 opacity-40 shrink-0" />
                      <span
                        className={
                          idx === pathSegments.length - 1
                            ? 'font-bold text-[var(--text-main)] truncate'
                            : 'opacity-70 truncate'
                        }
                      >
                        {segment}
                      </span>
                    </React.Fragment>
                  ))}
                </div>

                <div className="flex items-center gap-3 shrink-0 text-[10px]">
                  <span className="px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-500 font-bold border border-orange-500/20 uppercase">
                    {language}
                  </span>
                  <span>{linesCount} lines</span>
                  <span>{byteSize} KB</span>
                </div>
              </div>

              {/* Monaco Code Editor */}
              <div className="flex-1 min-h-0 relative">
                <Editor
                  height="100%"
                  language={language}
                  value={activeFileContent ?? undefined}
                  theme={monacoTheme}
                  options={{
                    readOnly: true,
                    fontSize: 12.5,
                    fontFamily:
                      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                    minimap: { enabled: true, maxColumn: 80 },
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    renderLineHighlight: 'all',
                    automaticLayout: true,
                    tabSize: 2,
                    smoothScrolling: true,
                    padding: { top: 10, bottom: 10 },
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MOBILE / SMALL SCREEN VIEW (lg:hidden)
          Falls back to full-height file tree + drawer on small devices
         ───────────────────────────────────────────────────────────── */}
      <div className="block lg:hidden h-full">
        <FileTreePreview
          tree={tree}
          filesCount={filesCount}
          selectedFilePath={activeFilePath}
          onSelectFile={onSelectFile}
          onRefresh={onRefresh}
          onAddCustomFile={onAddCustomFile}
        />
        {activeFilePath && activeFileContent !== null && (
          <FileEditorDrawer
            filePath={activeFilePath}
            content={activeFileContent}
            theme={theme}
            onClose={() => {
              if (onCloseEditor) onCloseEditor();
            }}
          />
        )}
      </div>
    </div>
  );
};
