import React, { useState } from 'react';
import {
  Plus,
  Rocket,
  Edit3,
  Copy,
  Trash2,
  FolderOpen,
  Sparkles,
  Layers,
  Search,
  Check,
  Moon,
  Sun,
  Terminal,
  Server,
  Monitor,
  Laptop,
} from 'lucide-react';
import type { SavedTemplate } from '../../types/template.js';
import type { ThemeId } from '../wizard/Header.js';
import type { ProjectConfig } from '@forgestack/core/browser';

interface Props {
  templates: SavedTemplate[];
  theme?: ThemeId;
  onThemeChange?: (theme: ThemeId) => void;
  onNewStack: () => void;
  onEditTemplate: (template: SavedTemplate) => void;
  onFastScaffold: (template: SavedTemplate) => void;
  onDuplicateTemplate: (templateId: string) => void;
  onDeleteTemplate: (templateId: string) => void;
  onRenameTemplate: (templateId: string, newName: string) => void;
}

export const HomeTemplatesDashboard: React.FC<Props> = ({
  templates,
  theme,
  onThemeChange,
  onNewStack,
  onEditTemplate,
  onFastScaffold,
  onDuplicateTemplate,
  onDeleteTemplate,
  onRenameTemplate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [renameInput, setRenameInput] = useState('');

  const filteredTemplates = templates.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.config.topology.toLowerCase().includes(q)
    );
  });

  const startRename = (t: SavedTemplate) => {
    setEditingId(t.id);
    setRenameInput(t.name);
  };

  const saveRename = (t: SavedTemplate) => {
    if (renameInput.trim()) {
      onRenameTemplate(t.id, renameInput.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col font-sans selection:bg-blue-500/30 selection:text-white transition-colors">
      {/* Main Content Area with Integrated Search & CTA */}
      <main className="flex-1 max-w-[1750px] w-full mx-auto p-4 lg:p-8 space-y-8">
        {/* Banner Section with Integrated Search & Launch CTA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 font-bold uppercase tracking-wider">
                Production Foundations
              </span>
              <span className="text-xs opacity-50 font-mono">v1.2.0</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-[var(--text-main)]">
              Architecture Templates Hub
            </h2>
            <p className="text-xs text-[var(--text-muted)] max-w-xl leading-relaxed">
              Select a verified production architecture to fast-scaffold a project, or create and save your own reusable custom template presets.
            </p>
          </div>

          {/* Search & Launch CTA */}
          <div className="flex items-center gap-3">
            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
              <input
                type="text"
                placeholder="Search templates (e.g. monorepo, nextjs)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 ui-input rounded-xl text-xs font-mono"
              />
            </div>
            <button
              onClick={onNewStack}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-blue-600/20 active:scale-95 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Launch Studio Wizard</span>
            </button>
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* CARD 0: Hero + Create New Stack */}
          <div
            onClick={onNewStack}
            className="group relative rounded-2xl p-6 border-2 border-dashed border-blue-500/30 hover:border-blue-500/80 bg-blue-500/5 hover:bg-blue-500/10 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center space-y-4 min-h-[260px] shadow-sm hover:shadow-xl hover:shadow-blue-500/10 active:scale-[0.99]"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-500 border border-blue-500/40 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Plus className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base tracking-tight text-blue-400 group-hover:text-blue-300">
                Create New Stack
              </h3>
              <p className="text-xs opacity-70 max-w-[220px]">
                Start with empty slots and configure a tailored architecture step-by-step
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-blue-600 text-white shadow-sm">
              Launch 4-Step Studio →
            </span>
          </div>

          {/* Saved & Built-in Templates */}
          {filteredTemplates.map((template) => {
            const isEditing = editingId === template.id;
            const config = template.config;

            return (
              <div
                key={template.id}
                className="ui-panel rounded-2xl p-6 border flex flex-col justify-between space-y-4 transition-all duration-150 hover:shadow-lg relative group"
              >
                {/* Header: Title, Badge & Actions */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    {isEditing ? (
                      <div className="flex items-center gap-1.5 flex-1">
                        <input
                          type="text"
                          value={renameInput}
                          onChange={(e) => setRenameInput(e.target.value)}
                          className="px-2 py-1 ui-input rounded-lg text-xs font-semibold w-full"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveRename(template);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                        />
                        <button
                          onClick={() => saveRename(template)}
                          className="p-1 hover:bg-emerald-500/20 text-emerald-400 rounded-lg"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm tracking-tight">{template.name}</h3>
                        {template.isBuiltIn && (
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            Curated
                          </span>
                        )}
                      </div>
                    )}

                    {/* Quick Management Buttons */}
                    <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startRename(template)}
                        className="p-1 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-slate-400 hover:text-white"
                        title="Rename Template"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDuplicateTemplate(template.id)}
                        className="p-1 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-slate-400 hover:text-white"
                        title="Duplicate Template"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      {!template.isBuiltIn && (
                        <button
                          onClick={() => onDeleteTemplate(template.id)}
                          className="p-1 hover:bg-rose-500/20 rounded-lg transition-colors cursor-pointer text-slate-400 hover:text-rose-400"
                          title="Delete Template"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs opacity-70 leading-relaxed min-h-[36px]">
                    {template.description}
                  </p>
                </div>

                {/* Stack Tags */}
                <div className="flex flex-wrap gap-1.5 py-1">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium ui-card-subtle border text-blue-400">
                    {config.topology}
                  </span>
                  {config.frontend.framework !== 'none' && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium ui-card-subtle border text-cyan-400">
                      {config.frontend.framework} + {config.frontend.styling}
                    </span>
                  )}
                  {config.backend.framework !== 'none' && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium ui-card-subtle border text-purple-400">
                      {config.backend.framework} + {config.backend.database}
                    </span>
                  )}
                  {config.backend.processManager && config.backend.processManager !== 'none' && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium ui-card-subtle border text-amber-400">
                      {config.backend.processManager}
                    </span>
                  )}
                  {config.aiGovernance.openSpec && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium ui-card-subtle border text-emerald-400">
                      {config.aiGovernance.engine || 'openspec'}
                    </span>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="pt-3 border-t flex items-center justify-between gap-2">
                  <button
                    onClick={() => onEditTemplate(template)}
                    className="px-3 py-1.5 rounded-xl ui-card-subtle hover:opacity-100 text-xs font-medium border transition-colors cursor-pointer"
                  >
                    Customize
                  </button>

                  <button
                    onClick={() => onFastScaffold(template)}
                    className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-blue-600/20 active:scale-95"
                  >
                    <Rocket className="w-3.5 h-3.5" />
                    <span>Fast Scaffold</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
