import React, { useState } from 'react';
import { Check, Copy, FileCode, X } from 'lucide-react';

interface FileViewerModalProps {
  filePath: string | null;
  content: string | null;
  onClose: () => void;
}

export const FileViewerModal: React.FC<FileViewerModalProps> = ({
  filePath,
  content,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!filePath || content === null) {
    return null;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = content.split('\n');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-4xl max-h-[85vh] ui-panel rounded-2xl shadow-2xl flex flex-col overflow-hidden border">
        {/* Header */}
        <div className="px-5 py-3.5 border-b ui-card-subtle flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
              <FileCode className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h3 className="text-xs font-mono font-medium truncate">
                {filePath}
              </h3>
              <p className="text-[10px] opacity-60 font-mono">
                {lines.length} lines • {(new TextEncoder().encode(content).length / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg ui-card hover:opacity-100 text-xs font-medium transition-colors cursor-pointer border"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Source</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg opacity-60 hover:opacity-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto p-4 ui-input font-mono text-xs leading-relaxed select-text">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx} className="hover:bg-black/5 dark:hover:bg-white/5">
                  <td className="w-10 pr-4 text-right opacity-30 select-none text-[11px] align-top">
                    {idx + 1}
                  </td>
                  <td className="whitespace-pre font-mono text-[11px] pl-2 border-l border-black/5 dark:border-white/5">
                    {line || ' '}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
