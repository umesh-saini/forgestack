import React from 'react';
import { Check, X, Sparkles, Scale } from 'lucide-react';

interface Row {
  capability: string;
  forgestack: string | boolean;
  createT3: string | boolean;
  createNext: string | boolean;
  nxCli: string | boolean;
  manualRepo: string | boolean;
}

const MATRIX_DATA: Row[] = [
  {
    capability: 'In-Memory AST Recipe Composition',
    forgestack: true,
    createT3: false,
    createNext: false,
    nxCli: false,
    manualRepo: false,
  },
  {
    capability: 'Turborepo Fullstack Monorepos',
    forgestack: true,
    createT3: false,
    createNext: false,
    nxCli: true,
    manualRepo: 'Manual setup',
  },
  {
    capability: 'Native Desktop Application (Tauri v2)',
    forgestack: true,
    createT3: false,
    createNext: false,
    nxCli: false,
    manualRepo: false,
  },
  {
    capability: 'Day-One AI Governance (OpenSpec/GSD)',
    forgestack: true,
    createT3: false,
    createNext: false,
    nxCli: false,
    manualRepo: false,
  },
  {
    capability: 'Direct Zero-OAuth MCP Server for AI',
    forgestack: true,
    createT3: false,
    createNext: false,
    nxCli: false,
    manualRepo: false,
  },
  {
    capability: 'Live In-Browser Monaco Code Preview',
    forgestack: true,
    createT3: false,
    createNext: false,
    nxCli: false,
    manualRepo: false,
  },
  {
    capability: 'Multi-Database & ORM Selection',
    forgestack: 'Drizzle / Prisma / Mongoose',
    createT3: 'Prisma / Drizzle',
    createNext: 'Manual',
    nxCli: 'Plugins',
    manualRepo: 'Hardcoded',
  },
  {
    capability: 'Terminal CLI + Desktop GUI + MCP',
    forgestack: true,
    createT3: 'CLI only',
    createNext: 'CLI only',
    nxCli: 'CLI only',
    manualRepo: 'Git clone only',
  },
];

export const CompetitorMatrix: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 relative border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/20">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Section Heading */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20 text-xs font-mono font-bold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5" />
            <span>Capability Comparison</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--text-main)]">
            How ForgeStack Compares
          </h2>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-[var(--text-muted)]">
            An architectural breakdown of ForgeStack versus standard scaffolding alternatives.
          </p>
        </div>

        {/* Matrix Table */}
        <div className="ui-panel rounded-2xl border shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b bg-[var(--bg-surface)]/80 text-[11px] font-mono text-[var(--text-muted)]">
                <th className="p-4 font-bold text-[var(--text-main)]">Capability</th>
                <th className="p-4 font-bold text-orange-500 bg-orange-500/10">ForgeStack</th>
                <th className="p-4 font-bold">create-t3-app</th>
                <th className="p-4 font-bold">create-next-app</th>
                <th className="p-4 font-bold">Nx / Turbo</th>
                <th className="p-4 font-bold">Git Clones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {MATRIX_DATA.map((row, idx) => (
                <tr key={idx} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium text-[var(--text-main)]">{row.capability}</td>

                  {/* ForgeStack Column */}
                  <td className="p-4 font-bold text-orange-400 bg-orange-500/5 font-mono">
                    {typeof row.forgestack === 'boolean' ? (
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Built-in</span>
                      </div>
                    ) : (
                      row.forgestack
                    )}
                  </td>

                  {/* create-t3-app */}
                  <td className="p-4 text-[var(--text-muted)] font-mono">
                    {typeof row.createT3 === 'boolean' ? (
                      row.createT3 ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <X className="w-4 h-4 text-slate-500" />
                      )
                    ) : (
                      row.createT3
                    )}
                  </td>

                  {/* create-next-app */}
                  <td className="p-4 text-[var(--text-muted)] font-mono">
                    {typeof row.createNext === 'boolean' ? (
                      row.createNext ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <X className="w-4 h-4 text-slate-500" />
                      )
                    ) : (
                      row.createNext
                    )}
                  </td>

                  {/* Nx */}
                  <td className="p-4 text-[var(--text-muted)] font-mono">
                    {typeof row.nxCli === 'boolean' ? (
                      row.nxCli ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <X className="w-4 h-4 text-slate-500" />
                      )
                    ) : (
                      row.nxCli
                    )}
                  </td>

                  {/* Git Clones */}
                  <td className="p-4 text-[var(--text-muted)] font-mono">
                    {typeof row.manualRepo === 'boolean' ? (
                      row.manualRepo ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <X className="w-4 h-4 text-slate-500" />
                      )
                    ) : (
                      row.manualRepo
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
