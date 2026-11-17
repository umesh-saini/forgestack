import React from 'react';
import {
  FolderOpen,
  GitBranch,
  Package,
  Wrench,
  Check,
} from 'lucide-react';
import type { ProjectConfig } from '@forgestack/core/browser';

interface Props {
  config: ProjectConfig;
  onChange: (updater: (prev: ProjectConfig) => ProjectConfig) => void;
  onBrowseFolder: () => void;
}

export const ProjectIdentity: React.FC<Props> = ({
  config,
  onChange,
  onBrowseFolder,
}) => {
  const packageManagers: {
    id: ProjectConfig['packageManager'];
    name: string;
    tag?: string;
  }[] = [
    { id: 'pnpm', name: 'pnpm', tag: 'Fastest' },
    { id: 'npm', name: 'npm' },
    { id: 'bun', name: 'bun' },
    { id: 'yarn', name: 'yarn' },
  ];

  return (
    <div className="space-y-3.5">
      {/* Name and Destination Path Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        {/* Project Name */}
        <div className="md:col-span-5">
          <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 opacity-70">
            Project Name
          </label>
          <input
            type="text"
            value={config.name}
            onChange={(e) => {
              const val = e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
              onChange((prev) => ({
                ...prev,
                name: val,
                targetPath: prev.targetPath.replace(/[^/]+$/, val),
              }));
            }}
            placeholder="e.g. enterprise-app"
            className="w-full px-3 py-2 ui-input rounded-xl text-xs font-mono transition-all"
          />
        </div>

        {/* Destination Path */}
        <div className="md:col-span-7">
          <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 opacity-70">
            Destination Directory
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={config.targetPath}
              onChange={(e) =>
                onChange((prev) => ({ ...prev, targetPath: e.target.value }))
              }
              className="flex-1 px-3 py-2 ui-input rounded-xl text-xs font-mono truncate"
            />
            <button
              type="button"
              onClick={onBrowseFolder}
              className="px-3 py-2 ui-card-subtle hover:opacity-100 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-sm border"
            >
              <FolderOpen className="w-3.5 h-3.5 text-blue-500" />
              <span>Browse</span>
            </button>
          </div>
        </div>
      </div>

      {/* Package Manager & Automation Toggles */}
      <div className="p-3 rounded-xl ui-card-subtle flex flex-col md:flex-row md:items-center justify-between gap-3 border">
        {/* Package Manager Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium opacity-70 flex items-center gap-1">
            <Package className="w-3.5 h-3.5 text-blue-500" />
            Manager:
          </span>
          <div className="flex rounded-lg ui-panel p-0.5 border">
            {packageManagers.map((pm) => {
              const isSelected = config.packageManager === pm.id;
              return (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() =>
                    onChange((prev) => ({ ...prev, packageManager: pm.id }))
                  }
                  className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <span>{pm.name}</span>
                  {pm.tag && !isSelected && (
                    <span className="text-[9px] text-blue-400 hidden sm:inline">
                      ★
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-4 flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs">
            <input
              type="checkbox"
              checked={config.git}
              onChange={(e) =>
                onChange((prev) => ({ ...prev, git: e.target.checked }))
              }
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
            />
            <span className="flex items-center gap-1 font-medium">
              <GitBranch className="w-3.5 h-3.5 text-emerald-500" />
              Git Init
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none text-xs">
            <input
              type="checkbox"
              checked={config.install}
              onChange={(e) =>
                onChange((prev) => ({ ...prev, install: e.target.checked }))
              }
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
            />
            <span className="flex items-center gap-1 font-medium">
              <Wrench className="w-3.5 h-3.5 text-amber-500" />
              Auto Install
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};
