import React, { useState } from 'react';
import { Download, Terminal, Copy, Check, Shield, Box, Sparkles, ExternalLink } from 'lucide-react';

export const DownloadInstallHub: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const downloads = [
    {
      format: 'Debian / Ubuntu (.deb)',
      filename: 'ForgeStack_1.0.0_amd64.deb',
      size: '4.50 MiB',
      desc: 'System package for Ubuntu, Debian, Pop!_OS, and Linux Mint.',
      command: 'sudo dpkg -i ForgeStack_1.0.0_amd64.deb',
      url: 'https://github.com/forgestack/forgestack/releases/download/v1.0.0/ForgeStack_1.0.0_amd64.deb',
    },
    {
      format: 'RedHat / Fedora (.rpm)',
      filename: 'ForgeStack-1.0.0-1.x86_64.rpm',
      size: '4.51 MiB',
      desc: 'System package for Fedora, RHEL, CentOS, openSUSE.',
      command: 'sudo rpm -i ForgeStack-1.0.0-1.x86_64.rpm',
      url: 'https://github.com/forgestack/forgestack/releases/download/v1.0.0/ForgeStack-1.0.0-1.x86_64.rpm',
    },
    {
      format: 'Universal Linux (AppImage)',
      filename: 'ForgeStack_1.0.0_amd64.AppImage',
      size: '85.75 MiB',
      desc: 'Standalone self-contained binary with in-place auto-update support.',
      command: 'chmod +x ForgeStack_1.0.0_amd64.AppImage && ./ForgeStack_1.0.0_amd64.AppImage',
      url: 'https://github.com/forgestack/forgestack/releases/download/v1.0.0/ForgeStack_1.0.0_amd64.AppImage',
    },
  ];

  return (
    <section id="downloads" className="py-16 sm:py-24 px-4 sm:px-6 relative border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/20">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Section Heading */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20 text-xs font-mono font-bold uppercase tracking-wider">
            <Download className="w-3.5 h-3.5" />
            <span>Distribution Hub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--text-main)]">
            Get ForgeStack for Your Environment
          </h2>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-[var(--text-muted)]">
            Install via native OS packages, universal AppImage, or run immediately via npx.
          </p>
        </div>

        {/* 3 Download Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {downloads.map((dl, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl ui-panel border shadow-lg flex flex-col justify-between space-y-4 hover:border-orange-500/30 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text-main)]">{dl.format}</span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/5 border text-slate-400">
                    {dl.size}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{dl.desc}</p>
                <div className="p-2 rounded-lg ui-input border font-mono text-[10px] text-slate-300 break-all select-all">
                  {dl.filename}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <a
                  href={dl.url}
                  className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-orange-600/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Binary</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleCopy(dl.command, idx)}
                  className="w-full py-2 rounded-xl ui-card-subtle border text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="Copy terminal command"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Command Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Install Command</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CLI & MCP Quick Command Row */}
        <div className="p-6 rounded-2xl ui-input border grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-[var(--text-main)] flex items-center gap-2">
              <Terminal className="w-4 h-4 text-orange-500" />
              <span>Terminal CLI Scaffolder</span>
            </span>
            <div className="flex items-center justify-between p-2.5 rounded-xl ui-card-subtle border font-mono text-xs text-orange-400 select-all">
              <span>npx create-forgestack-app my-app</span>
              <button
                type="button"
                onClick={() => handleCopy('npx create-forgestack-app my-app', 101)}
                className="p-1 text-slate-400 hover:text-white"
              >
                {copiedIndex === 101 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-bold text-[var(--text-main)] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Zero-OAuth Model Context Protocol (MCP)</span>
            </span>
            <div className="flex items-center justify-between p-2.5 rounded-xl ui-card-subtle border font-mono text-xs text-cyan-400 select-all">
              <span>npx forgestack-mcp</span>
              <button
                type="button"
                onClick={() => handleCopy('npx forgestack-mcp', 102)}
                className="p-1 text-slate-400 hover:text-white"
              >
                {copiedIndex === 102 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
