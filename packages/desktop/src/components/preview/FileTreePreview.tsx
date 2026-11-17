import React, { useState, useMemo } from 'react';
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
  Search,
  X,
  Layers,
  FilePlus,
  FolderPlus,
  RefreshCw,
  ChevronsDownUp,
  ChevronsUpDown,
  Sparkles,
  Check,
} from 'lucide-react';
import type { TreeNode } from '@forgestack/core/browser';
import { getFileIcon } from '../common/TechIcons.js';

interface Props {
  tree: TreeNode[];
  filesCount: number;
  selectedFilePath?: string | null;
  compact?: boolean;
  onSelectFile?: (filePath: string) => void;
  onRefresh?: () => void;
  onAddCustomFile?: (path: string, content: string) => void;
}

function filterTree(nodes: TreeNode[], term: string): TreeNode[] {
  if (!term) return nodes;

  const filtered: TreeNode[] = [];

  for (const node of nodes) {
    if (node.type === 'directory') {
      const matchingChildren = filterTree(node.children || [], term);
      if (
        matchingChildren.length > 0 ||
        node.name.toLowerCase().includes(term.toLowerCase()) ||
        node.path.toLowerCase().includes(term.toLowerCase())
      ) {
        filtered.push({
          ...node,
          children: matchingChildren.length > 0 ? matchingChildren : node.children,
        });
      }
    } else if (
      node.name.toLowerCase().includes(term.toLowerCase()) ||
      node.path.toLowerCase().includes(term.toLowerCase())
    ) {
      filtered.push(node);
    }
  }

  return filtered;
}

export const FileTreePreview: React.FC<Props> = ({
  tree,
  filesCount,
  selectedFilePath,
  compact = false,
  onSelectFile,
  onRefresh,
  onAddCustomFile,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandAll, setExpandAll] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newItemPath, setNewItemPath] = useState('');

  const filteredTree = useMemo(() => {
    return filterTree(tree, searchTerm.trim());
  }, [tree, searchTerm]);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    if (onRefresh) {
      onRefresh();
    }
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleConfirmAddFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemPath.trim()) return;
    if (onAddCustomFile) {
      onAddCustomFile(newItemPath.trim(), '// Custom user staged file\nexport {};\n');
    }
    setNewItemPath('');
    setIsCreatingFile(false);
  };

  const handleConfirmAddFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemPath.trim()) return;
    if (onAddCustomFile) {
      onAddCustomFile(`${newItemPath.trim()}/.gitkeep`, '');
    }
    setNewItemPath('');
    setIsCreatingFolder(false);
  };

  return (
    <div
      className={`flex flex-col h-full overflow-hidden ${
        compact
          ? 'bg-transparent border-none rounded-none shadow-none'
          : 'ui-panel rounded-2xl shadow-sm border'
      }`}
    >
      {/* VS Code-Grade Explorer Header */}
      <div className="p-3 border-b flex items-center justify-between gap-2 flex-wrap shrink-0">
        <div className="flex items-center gap-2 select-none">
          <div className="p-1.5 rounded-lg ui-card-subtle border shrink-0">
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-1.5 select-none">
              <span className="font-bold text-[var(--text-main)] staging-title">Virtual Staging</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                {filesCount} ready
              </span>
            </h3>
          </div>
        </div>

        {/* VS Code Tree Action Bar */}
        <div className="flex items-center gap-0.5 rounded-xl ui-card-subtle p-1 border">
          <button
            type="button"
            onClick={() => {
              setIsCreatingFile(true);
              setIsCreatingFolder(false);
            }}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="New Staged File"
          >
            <FilePlus className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              setIsCreatingFolder(true);
              setIsCreatingFile(false);
            }}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="New Staged Folder"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleRefreshClick}
            className={`p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
              isRefreshing ? 'animate-spin text-blue-500' : ''
            }`}
            title="Refresh Synthesis Tree"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setExpandAll(!expandAll)}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={expandAll ? 'Collapse All Folders' : 'Expand All Folders'}
          >
            {expandAll ? (
              <ChevronsDownUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronsUpDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Inline Create Input */}
      {(isCreatingFile || isCreatingFolder) && (
        <form
          onSubmit={isCreatingFile ? handleConfirmAddFile : handleConfirmAddFolder}
          className="p-2.5 bg-blue-500/10 border-b border-blue-500/20 flex items-center gap-2 animate-in fade-in duration-100"
        >
          {isCreatingFile ? (
            <FilePlus className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          ) : (
            <FolderPlus className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          )}
          <input
            type="text"
            placeholder={
              isCreatingFile
                ? 'e.g. src/utils/custom-helper.ts'
                : 'e.g. src/modules/billing'
            }
            value={newItemPath}
            onChange={(e) => setNewItemPath(e.target.value)}
            className="flex-1 px-2 py-1 ui-input rounded-lg text-xs font-mono"
            autoFocus
          />
          <button
            type="submit"
            className="p-1 rounded bg-blue-600 text-white hover:bg-blue-500 cursor-pointer"
          >
            <Check className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={() => {
              setIsCreatingFile(false);
              setIsCreatingFolder(false);
              setNewItemPath('');
            }}
            className="p-1 rounded hover:bg-slate-800 text-slate-400"
          >
            <X className="w-3 h-3" />
          </button>
        </form>
      )}

      {/* Filter / Search Bar */}
      <div className="px-3 py-2 border-b">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
          <input
            type="text"
            placeholder="Search staged files (e.g. server, tsconfig, auth)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 ui-input rounded-xl text-xs font-mono transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tree Content with Smooth Transitions */}
      <div className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-0.5">
        {filteredTree.length === 0 ? (
          <div className="p-8 text-center opacity-50 space-y-1">
            <p className="text-xs">
              {searchTerm ? `No files matching "${searchTerm}"` : 'Compiling architecture...'}
            </p>
            <p className="text-[10px] opacity-70">
              Files stage in memory dynamically as stack options are chosen.
            </p>
          </div>
        ) : (
          filteredTree.map((node) => (
            <TreeItem
              key={node.path}
              node={node}
              level={0}
              forceExpand={expandAll || Boolean(searchTerm)}
              selectedFilePath={selectedFilePath}
              onSelectFile={onSelectFile}
            />
          ))
        )}
      </div>
    </div>
  );
};

interface TreeItemProps {
  node: TreeNode;
  level: number;
  forceExpand: boolean;
  selectedFilePath?: string | null;
  onSelectFile?: (filePath: string) => void;
}

const TreeItem: React.FC<TreeItemProps> = ({
  node,
  level,
  forceExpand,
  selectedFilePath,
  onSelectFile,
}) => {
  const [isOpen, setIsOpen] = useState(forceExpand);

  React.useEffect(() => {
    setIsOpen(forceExpand);
  }, [forceExpand]);

  const isDirectory = node.type === 'directory';
  const isSelected = !isDirectory && selectedFilePath === node.path;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDirectory) {
      setIsOpen(!isOpen);
    } else if (onSelectFile) {
      onSelectFile(node.path);
    }
  };

  return (
    <div>
      <div
        onClick={handleClick}
        style={{ paddingLeft: `${level * 14 + 6}px` }}
        className={`flex items-center gap-1.5 py-1 px-2 rounded-lg cursor-pointer transition-colors text-xs select-none ${
          isDirectory
            ? 'font-semibold text-slate-900 dark:text-slate-200 tree-dir-text hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
            : isSelected
            ? 'font-bold bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/35 shadow-xs'
            : 'font-medium text-slate-800 dark:text-slate-300 tree-file-text hover:text-blue-600 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
        }`}
      >
        {isDirectory ? (
          <>
            <span className="w-3.5 h-3.5 flex items-center justify-center text-slate-600 dark:text-slate-400">
              {isOpen ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </span>
            {isOpen ? (
              <FolderOpen className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            ) : (
              <Folder className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            )}
            <span className="truncate tree-dir-text">{node.name}</span>
          </>
        ) : (
          <>
            <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
              {getFileIcon(node.name)}
            </span>
            <span className="truncate tree-file-text">{node.name}</span>
          </>
        )}
      </div>

      {isDirectory && isOpen && node.children && (
        <div className="space-y-0.5">
          {node.children.map((child) => (
            <TreeItem
              key={child.path}
              node={child}
              level={level + 1}
              forceExpand={forceExpand}
              selectedFilePath={selectedFilePath}
              onSelectFile={onSelectFile}
            />
          ))}
        </div>
      )}
    </div>
  );
};
