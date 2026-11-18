import React from 'react';
import { NavLink } from 'react-router-dom';
import { Github, Sparkles, Terminal } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="py-12 px-4 sm:px-6 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 text-xs">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <img
            src="/app-icon.svg"
            alt="ForgeStack"
            className="w-8 h-8 rounded-lg shrink-0 object-contain"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[var(--text-main)]">ForgeStack</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-orange-500/10 text-orange-500 font-semibold border border-orange-500/20">
                v1.0.0
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
              Enterprise Project Scaffolding & AST Composition Engine
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 font-medium text-[var(--text-muted)]">
          <NavLink to="/" className="hover:text-[var(--text-main)] transition-colors">
            Templates Hub
          </NavLink>
          <NavLink to="/new" className="hover:text-[var(--text-main)] transition-colors">
            Studio Wizard
          </NavLink>
          <NavLink to="/settings" className="hover:text-[var(--text-main)] transition-colors">
            Settings
          </NavLink>
          <a
            href="https://github.com/forgestack/forgestack"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[var(--text-main)] transition-colors flex items-center gap-1.5"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
        </div>

        {/* Copyright */}
        <div className="text-[11px] text-[var(--text-muted)] font-mono">
          MIT Licensed • Day-One AI Governance
        </div>
      </div>
    </footer>
  );
};
