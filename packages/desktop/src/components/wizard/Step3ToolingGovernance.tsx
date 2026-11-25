import React from 'react';
import type { ProjectConfig } from '@forgestk/core/browser';
import { ClaudeIcon, CursorRulesIcon, DockerIcon, OpenSpecIcon } from '../common/TechIcons.js';
import { ConfigGroup, PickerRow } from '../studio/PickerRow.js';
import { Switch, cx } from '../ui/primitives.js';

interface Props {
  config: ProjectConfig;
  onChange: (updater: (prev: ProjectConfig) => ProjectConfig) => void;
}

const ToggleRow: React.FC<{
  label: string;
  detail?: React.ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabledReason?: string;
  icon?: React.ReactNode;
}> = ({ label, detail, checked, onChange, disabledReason, icon }) => (
  <div className={cx('min-h-10 py-2 flex items-center gap-3 border-b border-line last:border-b-0', disabledReason && 'opacity-60')}>
    <span className="w-[136px] shrink-0 flex items-center gap-2 text-[13px] text-muted">
      {icon}
      {label}
    </span>
    <span className="flex-1 min-w-0 text-[12.5px] text-faint t-mono truncate" title={disabledReason}>
      {disabledReason ?? detail}
    </span>
    <Switch checked={checked && !disabledReason} onChange={onChange} label={label} disabled={Boolean(disabledReason)} />
  </div>
);

export const Step3ToolingGovernance: React.FC<Props> = ({ config, onChange }) => {
  const t = config.topology;
  const noServer = config.backend.framework === 'none';
  const noClient = config.frontend.framework === 'none';
  const trpcTopology = t === 'monorepo' || t === 'ai-agent-rag';
  const ai = config.aiGovernance;

  const set = (patch: Partial<ProjectConfig>) => onChange((p) => ({ ...p, ...patch }));
  const setAi = (patch: Partial<ProjectConfig['aiGovernance']>) =>
    onChange((p) => ({ ...p, aiGovernance: { ...p.aiGovernance, ...patch } }));
  const setUtil = (patch: Partial<NonNullable<ProjectConfig['utilities']>>) =>
    onChange((p) => ({
      ...p,
      utilities: { frontendHelpers: Boolean(p.utilities?.frontendHelpers), backendHelpers: Boolean(p.utilities?.backendHelpers), ...patch },
    }));

  return (
    <div>
      <ConfigGroup title="Runtime">
        {t === 'distributed-worker' ? (
          <div className="h-10 flex items-center gap-3 border-b border-line">
            <span className="w-[136px] shrink-0 text-[13px] text-muted">Process manager</span>
            <span className="flex-1 text-[13.5px]">BullMQ worker</span>
            <span className="t-mono text-faint">set by architecture</span>
          </div>
        ) : (
          <PickerRow
            label="Process manager"
            value={(config.backend.processManager ?? 'docker') as 'docker' | 'pm2' | 'none'}
            onChange={(v) => onChange((p) => ({ ...p, backend: { ...p.backend, processManager: v, container: v === 'docker' } }))}
            options={[
              { id: 'docker', label: 'Docker + Compose', icon: <DockerIcon className="w-4 h-4" />, meta: 'Dockerfile, compose.yml' },
              {
                id: 'pm2',
                label: 'PM2 cluster',
                meta: 'ecosystem.config.cjs',
                disabledReason: noServer ? 'needs a Node server' : undefined,
              },
              { id: 'none', label: 'Plain node / tsx' },
            ]}
          />
        )}
        <PickerRow
          label="Deployment"
          value={config.deployment ?? 'docker'}
          onChange={(v) => set({ deployment: v })}
          options={[
            { id: 'docker', label: 'Docker image', meta: 'multi-stage' },
            { id: 'vercel', label: 'Vercel', meta: 'vercel.json' },
            { id: 'cloudflare', label: 'Cloudflare', meta: 'wrangler.toml' },
            { id: 'railway', label: 'Railway', meta: 'railway.json' },
            { id: 'fly', label: 'Fly.io', meta: 'fly.toml' },
            { id: 'none', label: 'No deployment files' },
          ]}
        />
      </ConfigGroup>

      <ConfigGroup title="Application">
        <ToggleRow
          label="Auth"
          detail="Better-Auth sessions, schema and client hook"
          checked={config.auth === 'better-auth'}
          onChange={(v) => set({ auth: v ? 'better-auth' : 'none' })}
          disabledReason={noServer ? 'needs a server' : undefined}
        />
        <ToggleRow
          label="tRPC"
          detail="typed procedures in @repo/contracts"
          checked={config.rpc === 'trpc'}
          onChange={(v) => set({ rpc: v ? 'trpc' : 'none' })}
          disabledReason={
            !trpcTopology ? 'monorepo or AI agent only' : noServer || noClient ? 'needs frontend and server' : undefined
          }
        />
        <ToggleRow
          label="Client helpers"
          detail="src/lib/axios-client.ts, token-manager.ts"
          checked={Boolean(config.utilities?.frontendHelpers)}
          onChange={(v) => setUtil({ frontendHelpers: v })}
          disabledReason={noClient ? 'needs a frontend' : undefined}
        />
        <ToggleRow
          label="Server helpers"
          detail="token-generator.ts, password-hasher.ts"
          checked={Boolean(config.utilities?.backendHelpers)}
          onChange={(v) => setUtil({ backendHelpers: v })}
          disabledReason={noServer ? 'needs a server' : undefined}
        />
      </ConfigGroup>

      <ConfigGroup title="Quality">
        <PickerRow
          label="Linting"
          value={config.linter ?? 'eslint'}
          onChange={(v) => set({ linter: v })}
          options={[
            { id: 'eslint', label: 'ESLint + Prettier', meta: 'eslint.config.js' },
            { id: 'biome', label: 'Biome', meta: 'biome.json' },
            { id: 'none', label: 'None' },
          ]}
        />
        <ToggleRow
          label="End-to-end tests"
          detail="Playwright on Chromium, Firefox, WebKit"
          checked={config.testing?.e2e === 'playwright'}
          onChange={(v) => set({ testing: { ...config.testing, e2e: v ? 'playwright' : 'none' } })}
          disabledReason={noClient ? 'needs a frontend' : undefined}
        />
        <ToggleRow
          label="CI"
          detail=".github/workflows/ci.yml"
          checked={config.ci === 'github-actions'}
          onChange={(v) => set({ ci: v ? 'github-actions' : 'none' })}
        />
      </ConfigGroup>

      <ConfigGroup title="AI agents">
        <PickerRow
          label="Spec workflow"
          value={ai.engine ?? 'openspec'}
          onChange={(v) => setAi({ engine: v, openSpec: v === 'openspec' || v === 'all' })}
          options={[
            { id: 'openspec', label: 'OpenSpec', icon: <OpenSpecIcon className="w-4 h-4" />, meta: 'openspec/' },
            { id: 'gsd', label: 'Open-GSD', meta: 'gsd/' },
            { id: 'speckit', label: 'GitHub Spec-Kit', meta: '.spec-kit/' },
            { id: 'all', label: 'All three' },
          ]}
        />
        <ToggleRow
          label="Cursor rules"
          icon={<CursorRulesIcon className="w-3.5 h-3.5" />}
          detail=".cursor/rules/*.mdc"
          checked={ai.rules}
          onChange={(v) => setAi({ rules: v })}
        />
        <ToggleRow
          label="CLAUDE.md"
          icon={<ClaudeIcon className="w-3.5 h-3.5" />}
          detail="project memory for Claude Code"
          checked={ai.claude ?? true}
          onChange={(v) => setAi({ claude: v })}
        />
        <ToggleRow label="Agent skills" detail=".agents/skills/" checked={ai.skills} onChange={(v) => setAi({ skills: v })} />
        <ToggleRow label="MCP server" detail="project MCP config" checked={ai.mcp ?? true} onChange={(v) => setAi({ mcp: v })} />
      </ConfigGroup>

      <ConfigGroup title="After writing">
        <ToggleRow label="Git" detail="git init + first commit" checked={config.git} onChange={(v) => set({ git: v })} />
        <ToggleRow
          label="Install"
          detail={`${config.packageManager} install`}
          checked={config.install}
          onChange={(v) => set({ install: v })}
        />
      </ConfigGroup>
    </div>
  );
};
