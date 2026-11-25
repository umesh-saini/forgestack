import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import type { TreeNode } from '@forgestk/core/browser';
import { getFileIcon } from '../common/TechIcons.js';
import { cx } from '../ui/primitives.js';

function filterTree(nodes: TreeNode[], term: string): TreeNode[] {
  if (!term) return nodes;
  const t = term.toLowerCase();
  const out: TreeNode[] = [];
  for (const n of nodes) {
    if (n.type === 'directory') {
      const kids = filterTree(n.children ?? [], term);
      if (kids.length) out.push({ ...n, children: kids });
    } else if (n.path.toLowerCase().includes(t)) {
      out.push(n);
    }
  }
  return out;
}

function collectFiles(nodes: TreeNode[], acc: string[] = []): string[] {
  for (const n of nodes) {
    if (n.type === 'directory') collectFiles(n.children ?? [], acc);
    else acc.push(n.path);
  }
  return acc;
}

/** Paths that appeared since the previous tree, kept for a moment so the change is visible. */
function useFreshPaths(tree: TreeNode[]) {
  const prev = useRef<Set<string> | null>(null);
  const [fresh, setFresh] = useState<Set<string>>(new Set());
  useEffect(() => {
    const now = new Set(collectFiles(tree));
    if (prev.current && prev.current.size > 0) {
      const added = new Set([...now].filter((p) => !prev.current!.has(p)));
      if (added.size && added.size < now.size) {
        setFresh(added);
        const t = setTimeout(() => setFresh(new Set()), 1600);
        prev.current = now;
        return () => clearTimeout(t);
      }
    }
    prev.current = now;
  }, [tree]);
  return fresh;
}

interface Props {
  tree: TreeNode[];
  query: string;
  selectedPath: string | null;
  onSelect: (path: string) => void;
}

export const FileTree: React.FC<Props> = ({ tree, query, selectedPath, onSelect }) => {
  const filtered = useMemo(() => filterTree(tree, query.trim()), [tree, query]);
  const fresh = useFreshPaths(tree);
  const [open, setOpen] = useState<Set<string>>(new Set());

  // Keep the selected file's folders open.
  useEffect(() => {
    if (!selectedPath) return;
    const parts = selectedPath.split('/');
    setOpen((o) => {
      const next = new Set(o);
      for (let i = 1; i < parts.length; i++) next.add(parts.slice(0, i).join('/'));
      return next;
    });
  }, [selectedPath]);

  // Open folders that contain fresh files.
  useEffect(() => {
    if (!fresh.size) return;
    setOpen((o) => {
      const next = new Set(o);
      for (const p of fresh) {
        const parts = p.split('/');
        for (let i = 1; i < parts.length; i++) next.add(parts.slice(0, i).join('/'));
      }
      return next;
    });
  }, [fresh]);

  const toggle = (path: string) =>
    setOpen((o) => {
      const next = new Set(o);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });

  if (filtered.length === 0) {
    return <p className="px-3 py-4 text-[13px] text-muted">{query ? `No file path contains “${query}”.` : 'Compiling file tree…'}</p>;
  }

  const render = (nodes: TreeNode[], depth: number): React.ReactNode =>
    nodes.map((n) => {
      const isDir = n.type === 'directory';
      const expanded = isDir && (open.has(n.path) || Boolean(query));
      const selected = !isDir && n.path === selectedPath;
      const isFresh = !isDir && fresh.has(n.path);
      return (
        <li key={n.path} role="treeitem" aria-expanded={isDir ? expanded : undefined} aria-selected={selected}>
          <button
            type="button"
            data-selected={selected}
            onClick={() => (isDir ? toggle(n.path) : onSelect(n.path))}
            style={{ paddingLeft: 8 + depth * 14 }}
            className={cx(
              'wipe w-full h-7 pr-2 flex items-center gap-1.5 text-left t-mono rounded-1',
              !selected && 'hover:bg-raised',
              isFresh && !selected && 'bg-accent-wash',
            )}
          >
            {isDir ? (
              <ChevronRight className={cx('w-3.5 h-3.5 shrink-0 text-faint transition-transform duration-150', expanded && 'rotate-90')} />
            ) : (
              <span className="w-3.5 h-3.5 shrink-0 flex items-center justify-center [&_svg]:w-3.5 [&_svg]:h-3.5">{getFileIcon(n.name)}</span>
            )}
            <span className={cx('truncate', isDir ? 'text-fg' : selected ? '' : 'text-muted')}>{n.name}</span>
            {isFresh && <span className="ml-auto wipe-sub text-[11px] text-accent-ink">new</span>}
          </button>
          {isDir && expanded && n.children && (
            <ul role="group" className="relative">
              <li aria-hidden className="absolute top-0 bottom-0 w-px bg-line pointer-events-none" style={{ left: 15 + depth * 14 }} />
              {render(n.children, depth + 1)}
            </ul>
          )}
        </li>
      );
    });

  return (
    <ul role="tree" aria-label="Generated files" className="py-1 px-1">
      {render(filtered, 0)}
    </ul>
  );
};
