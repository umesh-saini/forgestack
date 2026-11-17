import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import {
  Check,
  Copy,
  X,
  FileCode,
  Columns,
  Maximize2,
  Minimize2,
  Loader2,
} from 'lucide-react';
import { getFileIcon } from '../common/TechIcons.js';
import type { ThemeId } from '../wizard/Header.js';

interface Props {
  filePath: string | null;
  content: string | null;
  theme: ThemeId;
  onClose: () => void;
}

function getMonacoLanguage(path: string | null): string {
  if (!path) return 'plaintext';
  const lower = path.toLowerCase();
  if (lower.endsWith('.tsx') || lower.endsWith('.ts')) return 'typescript';
  if (lower.endsWith('.jsx') || lower.endsWith('.js') || lower.endsWith('.mjs') || lower.endsWith('.cjs')) return 'javascript';
  if (lower.endsWith('.json')) return 'json';
  if (lower.endsWith('.md') || lower.endsWith('.mdc')) return 'markdown';
  if (lower.endsWith('.css') || lower.endsWith('.scss')) return 'css';
  if (lower.endsWith('.html')) return 'html';
  if (lower.endsWith('.yaml') || lower.endsWith('.yml')) return 'yaml';
  if (lower.includes('dockerfile') || lower.endsWith('.dockerfile')) return 'dockerfile';
  if (lower.endsWith('.sh') || lower.endsWith('.bash')) return 'shell';
  return 'plaintext';
}

export const FileEditorDrawer: React.FC<Props> = ({
  filePath,
  content,
  theme,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState<'normal' | 'wide' | 'full'>('normal');

  if (!filePath || content === null) {
    return null;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const linesCount = content.split('\n').length;
  const byteSize = (new TextEncoder().encode(content).length / 1024).toFixed(2);
  const language = getMonacoLanguage(filePath);
  const monacoTheme = theme === 'theme-light' ? 'light' : 'vs-dark';

  const widthClass =
    drawerWidth === 'full'
      ? 'w-full md:w-[92vw]'
      : drawerWidth === 'wide'
      ? 'w-full md:w-[750px] lg:w-[850px]'
      : 'w-full md:w-[540px] lg:w-[620px]';

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex shadow-2xl animate-in slide-in-from-right duration-200 lg:hidden">
      {/* Backdrop overlay for mobile drawer */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity -z-10"
        onClick={onClose}
      />

      {/* Main Drawer Panel */}
      <div
        className={`${widthClass} h-full ui-panel border-l flex flex-col transition-all duration-200 bg-[var(--bg-surface)] overflow-hidden shadow-2xl`}
      >
        {/* Top Header / Action Toolbar matching user screenshot */}
        <div className="px-4 py-3 border-b flex items-center justify-between gap-3 bg-[var(--bg-card-subtle)] shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-md bg-blue-500/10 border border-blue-500/20">
              {getFileIcon(filePath)}
            </span>
            <div className="truncate">
              <h4 className="text-xs font-mono font-semibold truncate text-[var(--text-main)]">
                {filePath}
              </h4>
              <p className="text-[10px] font-mono text-[var(--text-muted)]">
                {language.toUpperCase()} • {linesCount} lines • {byteSize} KB
              </p>
            </div>
          </div>

          {/* Right Header Controls with split panel icon */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Split panel width toggle matching user screenshot [|] */}
            <button
              type="button"
              onClick={() =>
                setDrawerWidth((prev) =>
                  prev === 'normal' ? 'wide' : prev === 'wide' ? 'full' : 'normal'
                )
              }
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={`Switch width (${drawerWidth})`}
            >
              {drawerWidth === 'full' ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : drawerWidth === 'wide' ? (
                <Maximize2 className="w-3.5 h-3.5" />
              ) : (
                <Columns className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Copy button */}
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Copy file contents"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close editor (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Monaco Editor Container */}
        <div className="flex-1 w-full h-full relative overflow-hidden bg-transparent">
          <Editor
            height="100%"
            language={language}
            value={content}
            theme={monacoTheme}
            loading={
              <div className="h-full w-full flex items-center justify-center gap-2 text-xs opacity-60">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                <span>Loading Monaco Editor...</span>
              </div>
            }
            options={{
              readOnly: true,
              minimap: { enabled: true },
              lineNumbers: 'on',
              fontSize: 13,
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              renderWhitespace: 'selection',
              smoothScrolling: true,
              cursorBlinking: 'smooth',
              automaticLayout: true,
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            }}
          />
        </div>
      </div>
    </div>
  );
};
