import React from 'react';
import {
  Bot,
  Container,
  Cpu,
  FileCode,
  Shield,
  Sparkles,
  Wrench,
  Check,
  Zap,
} from 'lucide-react';
import type { ProjectConfig } from '@forgestack/core/browser';
import { DockerIcon, CursorRulesIcon, OpenSpecIcon, ClaudeIcon } from '../common/TechIcons.js';

interface Props {
  config: ProjectConfig;
  onChange: (updater: (prev: ProjectConfig) => ProjectConfig) => void;
}

export const Step3ToolingGovernance: React.FC<Props> = ({ config, onChange }) => {
  const governanceEngines: {
    id: 'openspec' | 'gsd' | 'speckit' | 'all';
    title: string;
    tag: string;
    desc: string;
  }[] = [
    {
      id: 'openspec',
      title: 'OpenSpec Governance',
      tag: 'openspec/ & opsx-*',
      desc: 'Spec-driven change proposals, delta specs, and continuous architectural synchronization.',
    },
    {
      id: 'gsd',
      title: 'Open-GSD (gsd-core)',
      tag: 'gsd/ & milestones',
      desc: 'Get Stuff Done framework with prioritized requirements [P0/P1], roadmap, and live task queue.',
    },
    {
      id: 'speckit',
      title: 'GitHub Spec-Kit',
      tag: '.spec-kit/ constitution',
      desc: 'Formal constitution ground rules, Gherkin acceptance criteria, and agent prompts.',
    },
    {
      id: 'all',
      title: 'All Governance Engines',
      tag: 'Multi-Engine Suite',
      desc: 'Scaffolds OpenSpec, Open-GSD, and GitHub Spec-Kit simultaneously for total agent compatibility.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h3 className="font-bold text-base tracking-tight flex items-center gap-2">
          <span>Step 3: Tooling, Utilities & AI Governance</span>
        </h3>
        <p className="text-xs opacity-70">
          Configure production process management, utility helper packs, and AI specification frameworks.
        </p>
      </div>

      {/* Process Management: Docker vs PM2 vs None */}
      <div className="ui-panel rounded-2xl p-5 border space-y-4">
        <div className="flex items-center gap-2">
          <Container className="w-4 h-4 text-blue-500" />
          <h4 className="font-bold text-xs uppercase tracking-wider">
            Process Manager & Containerization
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              id: 'docker',
              title: 'Docker & Compose',
              desc: 'Multi-stage Dockerfiles and docker-compose.yml for local database services',
              icon: <DockerIcon className="w-5 h-5 text-blue-400" />,
            },
            {
              id: 'pm2',
              title: 'PM2 Cluster Manager',
              desc: 'Production ecosystem.config.cjs with cluster mode, auto-restart, and memory cap',
              icon: <Cpu className="w-5 h-5 text-purple-400" />,
            },
            {
              id: 'none',
              title: 'None (Direct Node)',
              desc: 'Standard tsx/node processes without container or process manager wraps',
              icon: <Wrench className="w-5 h-5 text-slate-400" />,
            },
          ].map((pm) => {
            const isSelected = (config.backend.processManager || 'docker') === pm.id;
            return (
              <div
                key={pm.id}
                onClick={() =>
                  onChange((prev) => ({
                    ...prev,
                    backend: {
                      ...prev.backend,
                      processManager: pm.id as any,
                      container: pm.id === 'docker',
                    },
                  }))
                }
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                  isSelected ? 'ui-active-ring' : 'ui-card-subtle opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {pm.icon}
                    <h5 className="font-bold text-xs">{pm.title}</h5>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-500" />}
                </div>
                <p className="text-xs opacity-70 leading-relaxed">{pm.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Production Utilities: Frontend & Backend Helper Packs */}
      <div className="ui-panel rounded-2xl p-5 border space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <h4 className="font-bold text-xs uppercase tracking-wider">
              Production Utility Helper Packs
            </h4>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Modular & Barrel Exported
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Frontend Helpers */}
          <div
            onClick={() =>
              onChange((prev) => ({
                ...prev,
                utilities: {
                  frontendHelpers: !prev.utilities?.frontendHelpers,
                  backendHelpers: Boolean(prev.utilities?.backendHelpers),
                },
              }))
            }
            className={`p-4 rounded-xl border text-left cursor-pointer transition-all space-y-2.5 ${
              config.utilities?.frontendHelpers
                ? 'ui-active-ring'
                : 'ui-card-subtle opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <h5 className="font-bold text-xs">Frontend API & Token Suite</h5>
              </div>
              <input
                type="checkbox"
                checked={Boolean(config.utilities?.frontendHelpers)}
                onChange={() => {}}
                className="rounded accent-blue-600"
              />
            </div>
            <p className="text-xs opacity-70 leading-relaxed">
              Synthesizes <code className="text-cyan-400">src/lib/axios-client.ts</code> (Bearer token injection, 401 refresh queue, retry), <code className="text-cyan-400">token-manager.ts</code>, and <code className="text-cyan-400">api-gateway.ts</code> with barrel <code className="text-cyan-400">src/lib/index.ts</code> export.
            </p>
          </div>

          {/* Backend Helpers */}
          <div
            onClick={() =>
              onChange((prev) => ({
                ...prev,
                utilities: {
                  frontendHelpers: Boolean(prev.utilities?.frontendHelpers),
                  backendHelpers: !prev.utilities?.backendHelpers,
                },
              }))
            }
            className={`p-4 rounded-xl border text-left cursor-pointer transition-all space-y-2.5 ${
              config.utilities?.backendHelpers
                ? 'ui-active-ring'
                : 'ui-card-subtle opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-400" />
                <h5 className="font-bold text-xs">Backend Auth & Crypto Suite</h5>
              </div>
              <input
                type="checkbox"
                checked={Boolean(config.utilities?.backendHelpers)}
                onChange={() => {}}
                className="rounded accent-blue-600"
              />
            </div>
            <p className="text-xs opacity-70 leading-relaxed">
              Synthesizes <code className="text-purple-400">src/utils/token-generator.ts</code> (rotating JWT access/refresh pairs), <code className="text-purple-400">password-hasher.ts</code> (scrypt crypto salt), and standardized <code className="text-purple-400">api-response.ts</code> envelopes.
            </p>
          </div>
        </div>
      </div>

      {/* Production Primitives: Auth, RPC, E2E & CI/CD */}
      <div className="ui-panel rounded-2xl p-5 border space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <h4 className="font-bold text-xs uppercase tracking-wider">
              Production Primitives & Architecture Protocols
            </h4>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Better-Auth • tRPC • Playwright • CI/CD
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Better-Auth */}
          <div
            onClick={() =>
              onChange((prev) => ({
                ...prev,
                auth: prev.auth === 'better-auth' ? 'none' : 'better-auth',
              }))
            }
            className={`p-4 rounded-xl border text-left cursor-pointer transition-all space-y-2 ${
              config.auth === 'better-auth'
                ? 'ui-active-ring'
                : 'ui-card-subtle opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <h5 className="font-bold text-xs">Better-Auth Authentication</h5>
              </div>
              <input
                type="checkbox"
                checked={config.auth === 'better-auth'}
                onChange={() => {}}
                className="rounded accent-blue-600"
              />
            </div>
            <p className="text-xs opacity-70 leading-relaxed">
              TypeScript-first session authentication with Drizzle ORM schema (<code className="text-emerald-400">auth.ts</code>), route handlers, and client hook.
            </p>
          </div>

          {/* tRPC */}
          <div
            onClick={() =>
              onChange((prev) => ({
                ...prev,
                rpc: prev.rpc === 'trpc' ? 'none' : 'trpc',
              }))
            }
            className={`p-4 rounded-xl border text-left cursor-pointer transition-all space-y-2 ${
              config.rpc === 'trpc'
                ? 'ui-active-ring'
                : 'ui-card-subtle opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <h5 className="font-bold text-xs">tRPC v11 Contracts</h5>
              </div>
              <input
                type="checkbox"
                checked={config.rpc === 'trpc'}
                onChange={() => {}}
                className="rounded accent-blue-600"
              />
            </div>
            <p className="text-xs opacity-70 leading-relaxed">
              End-to-end typesafe client-server procedure calls without code generation, paired with TanStack Query provider.
            </p>
          </div>

          {/* Playwright */}
          <div
            onClick={() =>
              onChange((prev) => ({
                ...prev,
                testing: {
                  ...prev.testing,
                  e2e: prev.testing?.e2e === 'playwright' ? 'none' : 'playwright',
                },
              }))
            }
            className={`p-4 rounded-xl border text-left cursor-pointer transition-all space-y-2 ${
              config.testing?.e2e === 'playwright'
                ? 'ui-active-ring'
                : 'ui-card-subtle opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-amber-400" />
                <h5 className="font-bold text-xs">Playwright Cross-Browser E2E</h5>
              </div>
              <input
                type="checkbox"
                checked={config.testing?.e2e === 'playwright'}
                onChange={() => {}}
                className="rounded accent-blue-600"
              />
            </div>
            <p className="text-xs opacity-70 leading-relaxed">
              Scaffolds <code className="text-amber-400">playwright.config.ts</code> and cross-browser smoke tests across Chromium, Firefox, and WebKit.
            </p>
          </div>

          {/* GitHub Actions */}
          <div
            onClick={() =>
              onChange((prev) => ({
                ...prev,
                ci: prev.ci === 'github-actions' ? 'none' : 'github-actions',
              }))
            }
            className={`p-4 rounded-xl border text-left cursor-pointer transition-all space-y-2 ${
              config.ci === 'github-actions'
                ? 'ui-active-ring'
                : 'ui-card-subtle opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <h5 className="font-bold text-xs">GitHub Actions CI/CD</h5>
              </div>
              <input
                type="checkbox"
                checked={config.ci === 'github-actions'}
                onChange={() => {}}
                className="rounded accent-blue-600"
              />
            </div>
            <p className="text-xs opacity-70 leading-relaxed">
              Synthesizes <code className="text-blue-400">.github/workflows/ci.yml</code> with Node.js 20 & 22 matrix, linting, typechecks, and test runs.
            </p>
          </div>
        </div>
      </div>

      {/* Linter & Formatter Foundation: ESLint vs Biome vs None */}
      <div className="ui-panel rounded-2xl p-5 border space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-cyan-500" />
            <h4 className="font-bold text-xs uppercase tracking-wider">
              Linter & Code Formatter
            </h4>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Static Analysis & Formatting
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              id: 'eslint',
              title: 'ESLint + Prettier',
              tag: 'Industry Standard',
              desc: 'Comprehensive AST rules, wide plugin ecosystem, and Prettier code formatting.',
            },
            {
              id: 'biome',
              title: 'Biome.js',
              tag: 'Rust • 35x Faster',
              desc: 'Ultra-fast Rust-based linter and formatter in a single zero-dependency tool with biome.json.',
            },
            {
              id: 'none',
              title: 'None',
              tag: 'Minimalist',
              desc: 'Skip automated linting and formatting tooling configs.',
            },
          ].map((l) => {
            const isSelected = (config.linter || 'eslint') === l.id;
            return (
              <div
                key={l.id}
                onClick={() =>
                  onChange((prev) => ({
                    ...prev,
                    linter: l.id as any,
                  }))
                }
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                  isSelected ? 'ui-active-ring' : 'ui-card-subtle opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-xs">{l.title}</h5>
                  <span className="text-[10px] font-mono opacity-60">{l.tag}</span>
                </div>
                <p className="text-xs opacity-70 leading-relaxed">{l.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cloud Deployment Targets: Docker vs Vercel vs Cloudflare vs Railway vs Fly */}
      <div className="ui-panel rounded-2xl p-5 border space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <Container className="w-4 h-4 text-emerald-500" />
            <h4 className="font-bold text-xs uppercase tracking-wider">
              Cloud Deployment Descriptors
            </h4>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Multi-Cloud Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              id: 'docker',
              title: 'Docker & Compose',
              tag: 'Dockerfile',
              desc: 'Multi-stage production Dockerfile and compose for local/remote container engines.',
            },
            {
              id: 'vercel',
              title: 'Vercel',
              tag: 'vercel.json',
              desc: 'Optimized deployment config for Next.js, Vite SPA rewrites, and edge routing.',
            },
            {
              id: 'cloudflare',
              title: 'Cloudflare Pages / Workers',
              tag: 'wrangler.jsonc',
              desc: 'Wrangler configuration for Cloudflare Pages static assets or edge worker APIs.',
            },
            {
              id: 'railway',
              title: 'Railway',
              tag: 'railway.json',
              desc: 'Nixpacks-based build with custom start commands and automatic restarts.',
            },
            {
              id: 'fly',
              title: 'Fly.io',
              tag: 'fly.toml',
              desc: 'Micro-VM orchestration configuration targeting any global Fly region.',
            },
            {
              id: 'none',
              title: 'None',
              tag: 'Unconfigured',
              desc: 'Do not generate cloud deployment descriptors.',
            },
          ].map((d) => {
            const isSelected = (config.deployment || 'docker') === d.id;
            return (
              <div
                key={d.id}
                onClick={() =>
                  onChange((prev) => ({
                    ...prev,
                    deployment: d.id as any,
                  }))
                }
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                  isSelected ? 'ui-active-ring' : 'ui-card-subtle opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-xs">{d.title}</h5>
                  <span className="text-[10px] font-mono opacity-60">{d.tag}</span>
                </div>
                <p className="text-xs opacity-70 leading-relaxed">{d.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Governance Engine Alternative Selector */}
      <div className="ui-panel rounded-2xl p-5 border space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-emerald-500" />
            <h4 className="font-bold text-xs uppercase tracking-wider">
              AI Governance Framework Alternative
            </h4>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            OpenSpec • Open-GSD • GitHub Spec-Kit
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {governanceEngines.map((gov) => {
            const isSelected = (config.aiGovernance.engine || 'openspec') === gov.id;
            return (
              <div
                key={gov.id}
                onClick={() =>
                  onChange((prev) => ({
                    ...prev,
                    aiGovernance: {
                      ...prev.aiGovernance,
                      openSpec: true,
                      engine: gov.id,
                    },
                  }))
                }
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                  isSelected ? 'ui-active-ring' : 'ui-card-subtle opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <OpenSpecIcon className="w-4 h-4 text-emerald-400" />
                    <h5 className="font-bold text-xs">{gov.title}</h5>
                  </div>
                  <span className="text-[10px] font-mono opacity-60">{gov.tag}</span>
                </div>
                <p className="text-xs opacity-70 leading-relaxed">{gov.desc}</p>
              </div>
            );
          })}
        </div>

        {/* AI Agent Rules, Claude, Skills, and MCP Checkboxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <label className="p-3 rounded-xl ui-card-subtle border flex items-center justify-between text-xs cursor-pointer select-none">
            <div className="flex items-center gap-2">
              <CursorRulesIcon className="w-4 h-4" />
              <span className="font-semibold">Cursor Rules</span>
            </div>
            <input
              type="checkbox"
              checked={config.aiGovernance.rules}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  aiGovernance: { ...prev.aiGovernance, rules: e.target.checked },
                }))
              }
              className="rounded accent-blue-600"
            />
          </label>

          <label className="p-3 rounded-xl ui-card-subtle border flex items-center justify-between text-xs cursor-pointer select-none">
            <div className="flex items-center gap-2">
              <ClaudeIcon className="w-4 h-4" />
              <span className="font-semibold">Claude Code</span>
            </div>
            <input
              type="checkbox"
              checked={config.aiGovernance.claude ?? true}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  aiGovernance: { ...prev.aiGovernance, claude: e.target.checked },
                }))
              }
              className="rounded accent-blue-600"
            />
          </label>

          <label className="p-3 rounded-xl ui-card-subtle border flex items-center justify-between text-xs cursor-pointer select-none">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="font-semibold">AAS Skills</span>
            </div>
            <input
              type="checkbox"
              checked={config.aiGovernance.skills}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  aiGovernance: { ...prev.aiGovernance, skills: e.target.checked },
                }))
              }
              className="rounded accent-blue-600"
            />
          </label>

          <label className="p-3 rounded-xl ui-card-subtle border flex items-center justify-between text-xs cursor-pointer select-none">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-400" />
              <span className="font-semibold">MCP Server</span>
            </div>
            <input
              type="checkbox"
              checked={config.aiGovernance.mcp ?? true}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  aiGovernance: { ...prev.aiGovernance, mcp: e.target.checked },
                }))
              }
              className="rounded accent-blue-600"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
