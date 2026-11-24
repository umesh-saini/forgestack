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
          <code key={i} className="rounded bg-sunken px-1 py-0.5 text-[0.85em] text-fg">
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
  return (
    <ol className="space-y-8">
      {releases.map((r) => (
        <li key={r.version} className="rounded-2xl border border-line bg-raised p-6">
          <div className="mb-4 flex flex-wrap items-baseline gap-3">
            <h3 className="text-xl font-semibold">{r.version === 'Unreleased' ? 'Unreleased' : `v${r.version}`}</h3>
            {r.date && <time className="text-sm text-muted">{r.date}</time>}
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {r.groups.map((g) => (
              <div key={g.heading}>
                <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-accent">{g.heading}</h4>
                <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted">
                  {g.items.map((item, i) => (
                    <li key={i}>
                      <Inline text={item} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
}
