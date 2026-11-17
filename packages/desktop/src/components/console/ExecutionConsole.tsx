import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Code2,
  Copy,
  ExternalLink,
  Folder,
  Layers,
  Sparkles,
  Terminal,
} from 'lucide-react';

interface Props {
  isGenerating: boolean;
  isComplete: boolean;
  logs: string[];
  targetPath: string;
  onOpenVsCode: () => void;
  onOpenAntigravity: () => void;
  onOpenFolder: () => void;
}

export const ExecutionConsole: React.FC<Props> = ({
  isGenerating,
  isComplete,
  logs,
  targetPath,
  onOpenVsCode,
  onOpenAntigravity,
  onOpenFolder,
}) => {
  const [copied, setCopied] = useState(false);

  const copyCommand = () => {
    navigator.clipboard.writeText(`cd "${targetPath}" && pnpm dev`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ui-panel rounded-2xl p-5 shadow-sm space-y-4">
      {/* Top Console Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
              isComplete
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-500'
                : isGenerating
                ? 'bg-blue-500/15 border-blue-500/30 text-blue-500'
                : 'ui-card-subtle opacity-70'
            }`}
          >
            {isComplete ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : isGenerating ? (
              <Sparkles className="w-5 h-5 animate-spin text-blue-500" />
            ) : (
              <Terminal className="w-4 h-4 opacity-70" />
            )}
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <span>Scaffolding Engine Console</span>
              {isGenerating && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                </span>
              )}
            </h3>
            <p className="text-[11px] opacity-60">
              {isComplete
                ? 'Synthesis complete • Physical project ready on disk'
                : isGenerating
                ? 'Writing files atomically to target destination...'
                : 'Idle • Ready to synthesize architecture'}
            </p>
          </div>
        </div>

        {/* Action Buttons upon Completion */}
        {isComplete && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={onOpenVsCode}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Open in VS Code</span>
            </button>
            <button
              type="button"
              onClick={onOpenFolder}
              className="px-3 py-1.5 rounded-xl ui-card-subtle hover:opacity-100 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border"
            >
              <Folder className="w-3.5 h-3.5 text-blue-500" />
              <span>Open Folder</span>
            </button>
          </div>
        )}
      </div>

      {/* Terminal Output */}
      <div className="rounded-xl ui-input p-3 font-mono text-[11px] overflow-hidden">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5 opacity-60 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/70 inline-block" />
            <span className="ml-1 opacity-70">bash — execution stream</span>
          </div>
          {isComplete && (
            <button
              type="button"
              onClick={copyCommand}
              className="flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied run command</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy dev command</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="space-y-1 max-h-48 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="opacity-40 italic py-2">
              Waiting to execute... Press &ldquo;Scaffold Project&rdquo; or ⌘↵ to write project directly to disk.
            </div>
          ) : (
            logs.map((log, index) => {
              const isError = log.includes('ERROR');
              const isSuccess = log.includes('SUCCESS');
              const isFlush = log.includes('FLUSH') || log.includes('TAURI');
              return (
                <div
                  key={index}
                  className={`leading-relaxed flex items-start gap-2 ${
                    isError
                      ? 'text-rose-400 font-semibold'
                      : isSuccess
                      ? 'text-emerald-400 font-semibold'
                      : isFlush
                      ? 'text-blue-400'
                      : 'opacity-80'
                  }`}
                >
                  <span className="opacity-40 select-none">›</span>
                  <span className="break-all">{log}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
