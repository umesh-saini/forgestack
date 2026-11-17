import React, { useState } from 'react';
import { FolderOpen, Rocket, X, Check, Loader2, Sparkles } from 'lucide-react';
import type { SavedTemplate } from '../../types/template.js';
import type { ProjectConfig } from '@forgestack/core/browser';

interface Props {
  template: SavedTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onScaffold: (config: ProjectConfig) => void;
  onBrowseFolder: (currentPath: string, onSelected: (p: string) => void) => void;
}

export const FastScaffoldModal: React.FC<Props> = ({
  template,
  isOpen,
  onClose,
  onScaffold,
  onBrowseFolder,
}) => {
  if (!isOpen || !template) return null;

  const [projectName, setProjectName] = useState(template.config.name);
  const [targetPath, setTargetPath] = useState(template.config.targetPath);
  const [gitInit, setGitInit] = useState(template.config.git);
  const [autoInstall, setAutoInstall] = useState(template.config.install);

  const handleNameChange = (val: string) => {
    const slug = val.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    setProjectName(slug);
    setTargetPath((prev) => prev.replace(/[^/]+$/, slug));
  };

  const handleConfirm = () => {
    if (!projectName.trim() || !targetPath.trim()) return;

    const mergedConfig: ProjectConfig = {
      ...template.config,
      name: projectName.trim(),
      targetPath: targetPath.trim(),
      git: gitInit,
      install: autoInstall,
    };

    onScaffold(mergedConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg ui-panel rounded-2xl shadow-2xl p-6 space-y-5 border">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm tracking-tight">Fast Scaffold</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {template.name}
                </span>
              </div>
              <p className="text-xs opacity-70">
                Synthesize this pre-configured architecture immediately
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 pt-1">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 opacity-70">
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. enterprise-app"
              className="w-full px-3 py-2 ui-input rounded-xl text-xs font-mono transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 opacity-70">
              Destination Directory
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={targetPath}
                onChange={(e) => setTargetPath(e.target.value)}
                className="flex-1 px-3 py-2 ui-input rounded-xl text-xs font-mono truncate"
              />
              <button
                type="button"
                onClick={() => onBrowseFolder(targetPath, setTargetPath)}
                className="px-3 py-2 ui-card-subtle hover:opacity-100 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-sm border"
              >
                <FolderOpen className="w-3.5 h-3.5 text-blue-500" />
                <span>Browse</span>
              </button>
            </div>
          </div>

          {/* Quick automation flags */}
          <div className="p-3 rounded-xl ui-card-subtle border flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={gitInit}
                onChange={(e) => setGitInit(e.target.checked)}
                className="rounded accent-blue-600"
              />
              <span className="font-mono text-xs">Git Init & Initial Commit</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoInstall}
                onChange={(e) => setAutoInstall(e.target.checked)}
                className="rounded accent-blue-600"
              />
              <span className="font-mono text-xs">Auto Install ({template.config.packageManager})</span>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-2 shadow-lg shadow-blue-600/25"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Scaffold Project</span>
          </button>
        </div>
      </div>
    </div>
  );
};
