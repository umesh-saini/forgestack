import React, { useState, useEffect } from 'react';
import { Check, Folder, FolderOpen, Laptop, Monitor, Sparkles, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  currentPath: string;
  projectName?: string;
  onClose: () => void;
  onSelectPath: (newPath: string) => void;
}

export const PathSelectorModal: React.FC<Props> = ({
  isOpen,
  currentPath,
  projectName = '',
  onClose,
  onSelectPath,
}) => {
  const [customPath, setCustomPath] = useState(currentPath);

  useEffect(() => {
    if (isOpen) {
      setCustomPath(currentPath);
    }
  }, [isOpen, currentPath]);

  if (!isOpen) return null;

  const suffix = projectName ? `/${projectName}` : '';
  const quickBookmarks = [
    { label: 'Documents', path: `/home/dev/Documents${suffix}`, icon: <Folder className="w-4 h-4 text-blue-500" /> },
    { label: 'Desktop', path: `/home/dev/Desktop${suffix}`, icon: <Monitor className="w-4 h-4 text-cyan-500" /> },
    { label: 'Home Projects', path: `/home/dev/Projects${suffix}`, icon: <Laptop className="w-4 h-4 text-purple-500" /> },
    { label: 'Temp Live Test', path: `/tmp${suffix}`, icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
  ];

  const handlePickNative = async () => {
    // 1. Try native Rust command `pick_directory` (Tauri invoke handler with zenity fallback)
    try {
      const isTauri =
        typeof window !== 'undefined' &&
        ('__TAURI_INTERNALS__' in window || '__TAURI__' in window);

      if (isTauri) {
        const { invoke } = await import('@tauri-apps/api/core');
        const picked = await invoke<string | null>('pick_directory', {
          title: 'Select Destination Folder',
          defaultPath: customPath || undefined,
        });

        if (picked && typeof picked === 'string') {
          const finalPath =
            projectName && !picked.endsWith(projectName)
              ? `${picked.replace(/\/+$/, '')}/${projectName}`
              : picked;
          setCustomPath(finalPath);
          onSelectPath(finalPath);
          onClose();
          return;
        }
      }
    } catch (err) {
      console.warn('Native pick_directory invoke failed, falling back to plugin-dialog:', err);
    }

    // 2. Try Tauri plugin-dialog
    try {
      const { open } = await import('@tauri-apps/plugin-dialog');
      const selected = await open({
        directory: true,
        multiple: false,
        title: 'Select Destination Folder',
      });
      if (selected && typeof selected === 'string') {
        const finalPath =
          projectName && !selected.endsWith(projectName)
            ? `${selected.replace(/\/+$/, '')}/${projectName}`
            : selected;
        setCustomPath(finalPath);
        onSelectPath(finalPath);
        onClose();
        return;
      }
    } catch (err) {
      console.warn('Tauri plugin-dialog failed:', err);
    }

    // 3. Browser fallback for web runtime testing
    if ('showDirectoryPicker' in window) {
      try {
        const dirHandle = await (window as any).showDirectoryPicker();
        if (dirHandle && dirHandle.name) {
          const path = `/home/dev/${dirHandle.name}${suffix}`;
          setCustomPath(path);
        }
      } catch {
        // User cancelled picker
      }
    }
  };

  const handleApply = () => {
    if (customPath.trim()) {
      onSelectPath(customPath.trim());
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleApply();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onKeyDown={handleKeyDown}
    >
      <div className="w-full max-w-lg ui-panel rounded-2xl shadow-2xl p-6 space-y-5 border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">
                Choose Destination Path
              </h3>
              <p className="text-xs opacity-60">
                Specify where project files will be created
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Bookmarks */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 opacity-70">
            Quick Directory Locations
          </label>
          <div className="grid grid-cols-2 gap-2">
            {quickBookmarks.map((b) => (
              <button
                key={b.label}
                type="button"
                onClick={() => setCustomPath(b.path)}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2.5 cursor-pointer ${
                  customPath === b.path
                    ? 'border-blue-500 bg-blue-500/15 font-semibold text-blue-500'
                    : 'ui-card hover:border-blue-400'
                }`}
              >
                {b.icon}
                <span className="truncate">{b.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Manual Path Input */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5 opacity-70">
            Absolute Target Path
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customPath}
              onChange={(e) => setCustomPath(e.target.value)}
              autoFocus
              className="flex-1 px-3.5 py-2.5 ui-input rounded-xl text-xs font-mono"
            />
            <button
              type="button"
              onClick={handlePickNative}
              className="px-3.5 py-2 ui-card-subtle hover:opacity-100 rounded-xl text-xs font-medium shrink-0 cursor-pointer flex items-center gap-1.5 border"
            >
              <FolderOpen className="w-3.5 h-3.5 text-blue-500" />
              <span>OS Picker</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs opacity-60 hover:opacity-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-medium text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-md shadow-blue-600/20"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Confirm Target Path</span>
          </button>
        </div>
      </div>
    </div>
  );
};
