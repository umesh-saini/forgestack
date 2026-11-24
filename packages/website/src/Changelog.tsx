import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import changelogSource from '../../../CHANGELOG.md?raw';

interface Release {
  version: string;
  date?: string;
  groups: { heading: string; items: string[] }[];
}

/** Parses the subset of Keep a Changelog we use: `## [x] - date`, `### Group`, `- item`. */
export function parseChangelog(md: string): Release[] {
  const releases: Release[] = [];
  for (const block of md.split(/^## /m).slice(1)) {
    const [head, ...lines] = block.split('\n');
    const m = head.match(/^\[([^\]]+)\](?:\s*-\s*(\S+))?/);
    if (!m) continue;
    const release: Release = { version: m[1], date: m[2], groups: [] };
    for (const line of lines) {
      if (line.startsWith('### ')) release.groups.push({ heading: line.slice(4).trim(), items: [] });
      else if (line.startsWith('- ') && release.groups.length) release.groups[release.groups.length - 1].items.push(line.slice(2).trim());
    }
    releases.push(release);
  }
  return releases;
}

/** Renders `inline code` only; everything else is plain text (no HTML injection). */
function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/).map((part, i) =>
        part.startsWith('`') && part.endsWith('`') ? (
          <code key={i} className="rounded-1 bg-sunken px-1 py-0.5 text-[0.88em] text-fg">
            {part.slice(1, -1)}
          </code>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export function Changelog() {
  const releases = parseChangelog(changelogSource);
  const [open, setOpen] = useState<string | null>(releases[0]?.version ?? null);
  return (
    <ol className="border-t border-line">
      {releases.map((r) => {
        const isOpen = open === r.version;
        const count = r.groups.reduce((n, g) => n + g.items.length, 0);
        return (
          <li key={r.version} className="border-b border-line">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : r.version)}
              className="flex h-14 w-full items-center gap-4 text-left"
            >
              <span className="w-28 font-mono text-[15px]">{r.version === 'Unreleased' ? 'Unreleased' : `v${r.version}`}</span>
              {r.date && <time className="font-mono text-[13px] text-faint">{r.date}</time>}
              <span className="ml-auto text-[13px] text-muted">{count} changes</span>
              <ChevronDown size={16} className={`text-faint transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-6 pb-6 md:grid-cols-2">
                    {r.groups.map((g) => (
                      <div key={g.heading}>
                        <h4 className="mb-2 text-[14px] font-medium">{g.heading}</h4>
                        <ul className="space-y-1.5 text-[14px] text-muted">
                          {g.items.map((item, i) => (
                            <li key={i} className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:h-1 before:w-1 before:bg-line-2">
                              <Inline text={item} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ol>
  );
}
