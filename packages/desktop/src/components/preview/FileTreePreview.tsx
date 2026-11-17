import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Code2,
  Container,
  Eye,
  FileCode,
  FileJson,
  FileText,
  Folder,
  FolderOpen,
  Layers,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import type { TreeNode } from '@forgestack/core/browser';

interface Props {
  tree: TreeNode[];
  filesCount: number;
  onSelectFile?: (filePath: string) => void;
}

function getFileIcon(fileName: string) {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.ts') || lower.endsWith('.tsx')) {
    return <Code2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
  }
  if (lower.endsWith('.json') || lower.endsWith('.yaml') || lower.endsWith('.yml')) {
    return <FileJson className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
  }
  if (lower.endsWith('.md')) {
    return <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
  }
  if (lower.endsWith('.css')) {
    return <FileCode className="w-3.5 h-3.5 text-purple-400 shrink-0" />;
  }
  if (lower.includes('docker') || lower.endsWith('.dockerfile')) {
    return <Container className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
  }
  if (lower.startsWith('.cursor') || lower.startsWith('.agent') || lower.endsWith('.mdc')) {
    return <SlidersHorizontal className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
  }
  return <FileCode className="w-3.5 h-3.5 text-zinc-400 shrink-0" />;
}

function filterTree(nodes: TreeNode[], term: string): TreeNode[] {
  if (!term) return nodes;
  const filtered: TreeNode[] = [];

  for (const node of nodes) {
    if (node.type === 'directory') {
      const matchingChildren = filterTree(node.children || [], term);
      if (matchingChildren.length > 0 || node.name.toLowerCase().includes(term.toLowerCase())) {
        filtered.push({
          ...node,
          children: matchingChildren,
        });
      }
    } else if (node.name.toLowerCase().includes(term.toLowerCase()) || node.path.toLowerCase().includes(term.toLowerCase())) {
      filtered.push(node);
    }
  }

  return filtered;
}

export const FileTreePreview: React.FC<Props> = ({
  tree,
  filesCount,
  onSelectFile,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandAll, setExpandAll] = useState(true);

  const filteredTree = useMemo(() => {
    return filterTree(tree, searchTerm.trim());
  }, [tree, searchTerm]);

  return (
    <div className="ui-panel rounded-2xl flex flex-col h-full shadow-sm overflow-hidden">
      {/* Explorer Header */}
      <div className="p-4 border-b flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg ui-card-subtle border">
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Staged Architecture Tree
            </h3>
            <p className="text-[11px] opacity-60">
              In-memory synthesis preview
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full ui-card-subtle border text-blue-500">
            {filesCount} files staged
          </span>
          <button
            type="button"
            onClick={() => setExpandAll(!expandAll)}
            className="text-[11px] px-2 py-0.5 rounded-lg ui-card-subtle hover:opacity-100 transition-colors opacity-70 cursor-pointer"
          >
            {expandAll ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="px-4 py-2.5 border-b">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
          <input
            type="text"
            placeholder="Filter files (e.g. server, tsconfig, auth)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-7 py-1.5 ui-input rounded-xl text-xs font-mono transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-0.5">
        {filteredTree.length === 0 ? (
          <div className="p-8 text-center opacity-50">
            <p className="text-xs">
              {searchTerm ? `No files matching "${searchTerm}"` : 'Compiling architecture...'}
            </p>
          </div>
        ) : (
          filteredTree.map((node) => (
            <TreeItem
              key={node.path}
              node={node}
              level={0}
              forceExpand={expandAll || Boolean(searchTerm)}
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
  onSelectFile?: (filePath: string) => void;
}

const TreeItem: React.FC<TreeItemProps> = ({
  node,
  level,
  forceExpand,
  onSelectFile,
}) => {
  const [isOpen, setIsOpen] = useState(forceExpand);
  const isDir = node.type === 'directory';

  React.useEffect(() => {
    setIsOpen(forceExpand);
  }, [forceExpand]);

  return (
    <div>
      <div
        style={{ paddingLeft: `${level * 14 + 6}px` }}
        className={`group relative flex items-center gap-1.5 py-1 pr-2 rounded-lg cursor-pointer transition-all ${
          isDir
            ? 'hover:bg-black/5 dark:hover:bg-white/5 font-semibold opacity-90'
            : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-75 hover:opacity-100'
        }`}
        onClick={() => {
          if (isDir) {
            setIsOpen(!isOpen);
          } else if (onSelectFile) {
            onSelectFile(node.path);
          }
        }}
      >
        {isDir ? (
          <>
            {isOpen ? (
              <ChevronDown className="w-3.5 h-3.5 opacity-60 shrink-0" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
            )}
            {isOpen ? (
              <FolderOpen className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            ) : (
              <Folder className="w-3.5 h-3.5 text-blue-500/80 shrink-0" />
            )}
          </>
        ) : (
          <>
            <span className="w-3.5 shrink-0" />
            {getFileIcon(node.name)}
          </>
        )}

        <span className="truncate text-[11px]">{node.name}</span>

        {!isDir && (
          <div className="ml-auto flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectFile) onSelectFile(node.path);
              }}
              title="Inspect staged file content"
              className="p-1 rounded ui-card-subtle hover:bg-blue-600 hover:text-white transition-colors"
            >
              <Eye className="w-3 h-3" />
            </button>
            {node.size !== undefined && (
              <span className="text-[10px] opacity-50 font-mono">
                {(node.size / 1024).toFixed(1)}k
              </span>
            )}
          </div>
        )}
      </div>

      {isDir && isOpen && node.children && (
        <div className="relative">
          <div
            className="absolute left-[13px] top-0 bottom-0 w-px border-l opacity-20"
            style={{ left: `${level * 14 + 12}px` }}
          />
          {node.children.map((child) => (
            <TreeItem
              key={child.path}
              node={child}
              level={level + 1}
              forceExpand={forceExpand}
              onSelectFile={onSelectFile}
            />
          ))}
        </div>
      )}
    </div>
  );
};
