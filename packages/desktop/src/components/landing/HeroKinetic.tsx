import React, { useState } from 'react';
import {
  Sparkles,
  Terminal,
  Copy,
  Check,
  Download,
  ArrowRight,
  Play,
  Github,
  Layers,
  Shield,
  Box,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  onOpenDownloadModal?: () => void;
}

export const HeroKinetic: React.FC<Props> = ({ onOpenDownloadModal }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const npxCommand = 'npx create-forgestack-app my-app';

  const handleCopy = () => {
    navigator.clipboard.writeText(npxCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 px-4 sm:px-6 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-orange-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto text-center space-y-8">
        {/* Version & Ecosystem Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full ui-card-subtle border border-orange-500/30 text-xs font-mono shadow-sm shadow-orange-500/10 animate-in fade-in slide-in-from-top-3">
          <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-ping" />
          <span className="font-bold text-orange-500">v1.0.0 Certified Production Release</span>
          <span className="text-slate-400 dark:text-slate-600">•</span>
          <span className="text-[var(--text-muted)] hidden sm:inline">
            Tauri v2 Native Desktop + CLI + Zero-OAuth MCP
          </span>
        </div>

        {/* Main Headline */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text-main)] leading-[1.12]">
            The Production Scaffolding Platform.
            <br />
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 bg-clip-text text-transparent">
              Synthesized in Memory. Governed from Day One.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
            Generate enterprise TypeScript monorepos, Next.js 15 fullstack apps, and clean modular APIs
            with zero template merge conflicts, atomic in-memory AST composition, and native desktop power.
          </p>
        </div>

        {/* Terminal Command Bar */}
        <div className="max-w-xl mx-auto">
          <div className="p-2 sm:p-2.5 rounded-2xl ui-input border shadow-xl flex items-center justify-between gap-3 font-mono text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 pl-2 overflow-hidden">
              <Terminal className="w-4 h-4 text-orange-500 shrink-0" />
              <span className="text-[var(--text-muted)] select-none">$</span>
              <span className="font-semibold text-[var(--text-main)] truncate select-all">
                {npxCommand}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 text-orange-400 text-xs font-sans font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer border border-orange-500/30"
              title="Copy terminal command"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Primary Call-to-Actions */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap pt-2">
          <button
            type="button"
            onClick={() => navigate('/new')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-600/30 ring-1 ring-white/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Launch Studio Wizard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="#downloads"
            className="flex items-center gap-2 px-5 py-3 rounded-xl ui-card-subtle border text-xs sm:text-sm font-bold text-[var(--text-main)] hover:border-[var(--border-hover)] transition-all cursor-pointer hover:bg-[var(--bg-surface)]"
          >
            <Download className="w-4 h-4 text-orange-500" />
            <span>Download Desktop App (.deb / AppImage)</span>
          </a>

          <a
            href="https://github.com/forgestack/forgestack"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-2 px-4 py-3 rounded-xl ui-card-subtle border text-xs sm:text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--border-hover)] transition-all"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
        </div>

        {/* 3 Quick Value Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto pt-6 text-xs text-[var(--text-muted)]">
          <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl ui-card-subtle border">
            <Box className="w-4 h-4 text-orange-500 shrink-0" />
            <span>100% In-Memory Virtual File System</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl ui-card-subtle border">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Day-One AI Governance Specs</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl ui-card-subtle border">
            <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Multi-Package AST Recipe Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
};
