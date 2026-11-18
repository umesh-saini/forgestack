import React, { useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from 'framer-motion';
import {
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

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export const HeroKinetic: React.FC<Props> = ({ onOpenDownloadModal }) => {
  void onOpenDownloadModal;
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const npxCommand = 'npx create-forgestack-app my-app';

  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 700], [0, reduce ? 0 : -160]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, reduce ? 1 : 0.15]);
  const glowScale = useTransform(scrollY, [0, 700], [1, reduce ? 1 : 1.4]);

  const handleCopy = () => {
    navigator.clipboard.writeText(npxCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      style={{ y: heroY, opacity: heroOpacity }}
      className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 px-4 sm:px-6 overflow-hidden"
    >
      {/* ambient lighting that breathes with scroll */}
      <motion.div
        style={{ scale: glowScale }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-orange-600/15 blur-[120px] rounded-full pointer-events-none -z-10"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto text-center space-y-8"
      >
        {/* Version & Ecosystem Pill */}
        <motion.div
          variants={item}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full ui-card-subtle border border-orange-500/30 text-xs font-mono shadow-sm shadow-orange-500/10"
        >
          <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-ping" />
          <span className="font-bold text-orange-500">v1.0.0 Certified Production Release</span>
          <span className="text-slate-400 dark:text-slate-600">•</span>
          <span className="text-[var(--text-muted)] hidden sm:inline">
            Tauri v2 Native Desktop + CLI + Zero-OAuth MCP
          </span>
        </motion.div>

        {/* Main Headline */}
        <div className="space-y-4">
          <motion.h1
            variants={item}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text-main)] leading-[1.12]"
          >
            The Production Scaffolding Platform.
            <br />
            <span className="relative inline-block bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 bg-clip-text text-transparent">
              Synthesized in Memory. Governed from Day One.
            </span>
          </motion.h1>
          <motion.p
            variants={item}
            className="max-w-2xl mx-auto text-sm sm:text-base text-[var(--text-muted)] leading-relaxed"
          >
            Generate enterprise TypeScript monorepos, Next.js 15 fullstack apps, and clean modular APIs
            with zero template merge conflicts, atomic in-memory AST composition, and native desktop power.
          </motion.p>
        </div>

        {/* Terminal Command Bar */}
        <motion.div variants={item} className="max-w-xl mx-auto">
          <motion.button
            type="button"
            onClick={handleCopy}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="w-full p-2 sm:p-2.5 rounded-2xl ui-input border shadow-xl flex items-center justify-between gap-3 font-mono text-xs sm:text-sm"
          >
            <div className="flex items-center gap-2.5 pl-2 overflow-hidden">
              <Terminal className="w-4 h-4 text-orange-500 shrink-0" />
              <span className="text-[var(--text-muted)] select-none">$</span>
              <span className="font-semibold text-[var(--text-main)] truncate select-all">
                {npxCommand}
              </span>
            </div>
            <span
              className="px-3.5 py-1.5 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 text-orange-400 text-xs font-sans font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer border border-orange-500/30"
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
            </span>
          </motion.button>
        </motion.div>

        {/* Primary Call-to-Actions */}
        <motion.div
          variants={item}
          className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap pt-2"
        >
          <motion.button
            type="button"
            whileHover={{ scale: reduce ? 1 : 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/new')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-600/30 ring-1 ring-white/20 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Launch Studio Wizard</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: reduce ? 1 : 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/hub')}
            className="flex items-center gap-2 px-5 py-3 rounded-xl ui-card-subtle border text-xs sm:text-sm font-bold text-[var(--text-main)] hover:border-[var(--border-hover)] transition-colors cursor-pointer"
          >
            <Layers className="w-4 h-4 text-orange-500" />
            <span>Explore Templates Hub</span>
          </motion.button>

          <motion.a
            href="#downloads"
            whileHover={{ scale: reduce ? 1 : 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl ui-card-subtle border text-xs sm:text-sm font-bold text-[var(--text-main)] hover:border-[var(--border-hover)] transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-orange-500" />
            <span>Download Desktop App (.deb / AppImage)</span>
          </motion.a>

          <motion.a
            href="https://github.com/forgestack/forgestack"
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: reduce ? 1 : 1.05 }}
            className="hidden sm:flex items-center gap-2 px-4 py-3 rounded-xl ui-card-subtle border text-xs sm:text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--border-hover)] transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </motion.a>
        </motion.div>

        {/* 3 Quick Value Highlights */}
        <motion.div
          variants={item}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto pt-6 text-xs text-[var(--text-muted)]"
        >
          {[
            { icon: Box, color: 'text-orange-500', label: '100% In-Memory Virtual File System' },
            { icon: Shield, color: 'text-emerald-400', label: 'Day-One AI Governance Specs' },
            { icon: Layers, color: 'text-cyan-400', label: 'Multi-Package AST Recipe Engine' },
          ].map((h) => (
            <motion.div
              key={h.label}
              whileHover={{ y: reduce ? 0 : -3 }}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl ui-card-subtle border"
            >
              <h.icon className={`w-4 h-4 ${h.color} shrink-0`} />
              <span>{h.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
