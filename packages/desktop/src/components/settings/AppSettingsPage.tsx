import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Check, FolderOpen, RotateCcw, Search } from 'lucide-react';
import { AGENT_TARGETS, FORGESTACK_CANONICAL_SKILL, type AgentToolId } from '@forgestack/core/browser';
import type { ThemePreference } from '../../theme.js';
import { isTauri, type AppEnvironment, type UpdateDetails } from '../../services/updaterService.js';
import { Button, ChoiceRow, Segmented, SettingRow, Switch, TextInput, cx } from '../ui/primitives.js';

export interface AppSettings {
  defaultTargetPath: string;
  defaultPackageManager: 'pnpm' | 'npm' | 'yarn' | 'bun';
  defaultGitInit: boolean;
  defaultAutoInstall: boolean;
  defaultAiEngine: 'openspec' | 'gsd' | 'speckit' | 'all';
  defaultCursorRules: boolean;
  defaultAasSkills: boolean;
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  defaultTargetPath: '/home/dev/Documents',
  defaultPackageManager: 'pnpm',
  defaultGitInit: true,
  defaultAutoInstall: true,
  defaultAiEngine: 'openspec',
  defaultCursorRules: true,
  defaultAasSkills: true,
};

const SETTINGS_KEY = 'forgestack-settings';

export function loadAppSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...DEFAULT_APP_SETTINGS, ...JSON.parse(raw) };
  } catch {
    // fall back to defaults
  }
  return DEFAULT_APP_SETTINGS;
}

export function saveAppSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

interface Props {
  themePreference: ThemePreference;
  onThemePreferenceChange: (p: ThemePreference) => void;
  onBrowseFolder: (onSelect: (path: string) => void) => void;
  onCheckForUpdates?: () => void;
  onSimulateUpdate?: () => void;
  isCheckingUpdate?: boolean;
  appEnv?: AppEnvironment | null;
  updateDetails?: UpdateDetails | null;
}

const SECTIONS = [
  { id: 'general', label: 'Project defaults' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'skills', label: 'AI agent skills' },
  { id: 'updates', label: 'Updates' },
] as const;
type SectionId = (typeof SECTIONS)[number]['id'];

const POPULAR: AgentToolId[] = ['agents', 'antigravity', 'claude', 'cursor', 'codex', 'github-copilot', 'devin'];

/* A miniature of the actual workspace in each theme — not a swatch chip. */
const ThemeMiniature: React.FC<{ variant: 'dark' | 'light' }> = ({ variant }) => {
  const c =
    variant === 'dark'
      ? { main: '#121311', surface: '#181A16', line: '#2A2C26', fg: '#ECEDE6', muted: '#3A3D34' }
      : { main: '#F1F1EC', surface: '#FAFAF6', line: '#DCDCD2', fg: '#1A1B14', muted: '#C4C4B7' };
  return (
    <div className="h-[92px] w-full flex border overflow-hidden rounded-2" style={{ background: c.main, borderColor: c.line }}>
      <div className="w-[26%] h-full p-1.5 flex flex-col gap-1" style={{ background: c.surface, borderRight: `1px solid ${c.line}` }}>
        {[60, 80, 50].map((w, i) => (
          <span key={i} className="h-1.5 rounded-[1px]" style={{ width: `${w}%`, background: i === 0 ? c.fg : c.muted }} />
        ))}
      </div>
      <div className="flex-1 p-1.5 flex flex-col gap-[3px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="h-[9px] rounded-[1px] flex items-center px-1" style={{ background: i === 1 ? '#DFE34A' : 'transparent' }}>
            <span className="h-[3px] rounded-[1px]" style={{ width: `${70 - i * 8}%`, background: i === 1 ? '#14150F' : c.muted }} />
          </span>
        ))}
      </div>
      <div className="w-[34%] h-full p-1.5 flex flex-col gap-1" style={{ borderLeft: `1px solid ${c.line}` }}>
        {[80, 55, 70, 40].map((w, i) => (
          <span key={i} className="h-1 rounded-[1px]" style={{ width: `${w}%`, background: c.muted }} />
        ))}
      </div>
    </div>
  );
};

export const AppSettingsPage: React.FC<Props> = ({
  themePreference,
  onThemePreferenceChange,
  onBrowseFolder,
  onCheckForUpdates,
  onSimulateUpdate,
  isCheckingUpdate = false,
  appEnv,
  updateDetails,
}) => {
  const [settings, setSettings] = useState<AppSettings>(loadAppSettings);
  const [section, setSection] = useState<SectionId>('general');
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const refs = useRef<Record<string, HTMLElement | null>>({});
  const lockUntil = useRef(0);

  const update = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      saveAppSettings(next);
      return next;
    });
    setSavedAt(Date.now());
  };

  useEffect(() => {
    if (!savedAt) return;
    const t = setTimeout(() => setSavedAt(null), 1800);
    return () => clearTimeout(t);
  }, [savedAt]);

  // Highlight the section in view.
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (vis && Date.now() > lockUntil.current) setSection(vis.target.id as SectionId);
      },
      { root, rootMargin: '0px 0px -60% 0px' },
    );
    Object.values(refs.current).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const jump = (id: SectionId) => {
    setSection(id);
    lockUntil.current = Date.now() + 700;
    refs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const reset = () => {
    if (!confirm('Reset all settings to their defaults?')) return;
    setSettings(DEFAULT_APP_SETTINGS);
    saveAppSettings(DEFAULT_APP_SETTINGS);
    onThemePreferenceChange('dark');
    setSavedAt(Date.now());
  };

  /* AI agent skills provisioner */
  const [targets, setTargets] = useState<AgentToolId[]>(POPULAR);
  const [agentQuery, setAgentQuery] = useState('');
  const [provisioning, setProvisioning] = useState(false);
  const [provisionResult, setProvisionResult] = useState<{ ok: boolean; text: string } | null>(null);

  const filteredTargets = useMemo(() => {
    const q = agentQuery.toLowerCase().trim();
    if (!q) return AGENT_TARGETS;
    return AGENT_TARGETS.filter((t) => `${t.name} ${t.id} ${t.relativePath}`.toLowerCase().includes(q));
  }, [agentQuery]);

  const provision = async () => {
    setProvisioning(true);
    setProvisionResult(null);
    try {
      const files = AGENT_TARGETS.filter((t) => targets.includes(t.id)).map((t) => ({
        path: t.relativePath,
        content: t.generateContent(FORGESTACK_CANONICAL_SKILL),
        executable: false,
      }));
      if (isTauri()) {
        const { invoke } = await import('@tauri-apps/api/core');
        await invoke('scaffold_project_files', {
          payload: { target_path: settings.defaultTargetPath, files, git_init: false, run_install: false, package_manager: settings.defaultPackageManager },
        });
        setProvisionResult({ ok: true, text: `Wrote ${files.length} skill files to ${settings.defaultTargetPath}.` });
      } else {
        setProvisionResult({ ok: true, text: `Writing files needs the desktop app. From a terminal: npx -p @forgestack/cli create-forgestack-app init-skills` });
      }
    } catch (err) {
      setProvisionResult({ ok: false, text: err instanceof Error ? err.message : String(err) });
    } finally {
      setProvisioning(false);
    }
  };

  const sectionRef = (id: SectionId) => (el: HTMLElement | null) => {
    refs.current[id] = el;
  };

  return (
    <div className="h-full flex">
      {/* Category list */}
      <nav aria-label="Settings sections" className="w-[176px] shrink-0 border-r border-line py-4 px-2 flex flex-col">
        <h1 className="t-page px-2 mb-3">Settings</h1>
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => jump(s.id)}
            className={cx(
              'relative h-8 px-2 text-left rounded-2 text-[13.5px]',
              section === s.id ? 'text-fg font-medium' : 'text-muted hover:text-fg',
            )}
          >
            {section === s.id && <motion.span layoutId="settings-active" className="absolute inset-0 rounded-2 bg-raised border border-line" />}
            <span className="relative">{s.label}</span>
          </button>
        ))}
        <div className="mt-auto px-2 h-6 flex items-center">
          {savedAt && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1 text-[12.5px] text-ok">
              <Check className="w-3.5 h-3.5" /> Saved
            </motion.span>
          )}
        </div>
      </nav>

      <div ref={scrollRef} className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-[760px] px-8 pt-6 pb-24">
          {/* General */}
          <section id="general" ref={sectionRef('general')} className="scroll-mt-6 mb-12">
            <h2 className="t-section mb-1">Project defaults</h2>
            <p className="text-[13px] text-muted mb-3">Used when you start a new project or open a template.</p>
            <SettingRow label="Destination folder" description={<span className="t-mono">{settings.defaultTargetPath}</span>}>
              <Button onClick={() => onBrowseFolder((p) => update('defaultTargetPath', p))}>
                <FolderOpen className="w-4 h-4" />
                Change
              </Button>
            </SettingRow>
            <SettingRow label="Package manager">
              <Segmented
                label="Default package manager"
                value={settings.defaultPackageManager}
                onChange={(v) => update('defaultPackageManager', v)}
                options={(['pnpm', 'npm', 'yarn', 'bun'] as const).map((id) => ({ id, label: id }))}
              />
            </SettingRow>
            <SettingRow label="Initialize git repository" description="git init and a first commit after writing files.">
              <Switch checked={settings.defaultGitInit} onChange={(v) => update('defaultGitInit', v)} label="Initialize git repository" />
            </SettingRow>
            <SettingRow label="Install dependencies" description="Runs the package manager’s install after writing files.">
              <Switch checked={settings.defaultAutoInstall} onChange={(v) => update('defaultAutoInstall', v)} label="Install dependencies" />
            </SettingRow>
            <SettingRow label="Spec workflow">
              <Segmented
                label="Default spec workflow"
                value={settings.defaultAiEngine}
                onChange={(v) => update('defaultAiEngine', v)}
                options={[
                  { id: 'openspec', label: 'OpenSpec' },
                  { id: 'gsd', label: 'GSD' },
                  { id: 'speckit', label: 'Spec-Kit' },
                  { id: 'all', label: 'All' },
                ]}
              />
            </SettingRow>
            <SettingRow label="Cursor rules">
              <Switch checked={settings.defaultCursorRules} onChange={(v) => update('defaultCursorRules', v)} label="Cursor rules" />
            </SettingRow>
            <SettingRow label="Agent skills">
              <Switch checked={settings.defaultAasSkills} onChange={(v) => update('defaultAasSkills', v)} label="Agent skills" />
            </SettingRow>
          </section>

          {/* Appearance */}
          <section id="appearance" ref={sectionRef('appearance')} className="scroll-mt-6 mb-12">
            <h2 className="t-section mb-3">Appearance</h2>
            <div role="radiogroup" aria-label="Theme" className="grid grid-cols-3 gap-3">
              {(
                [
                  { id: 'dark', label: 'Dark' },
                  { id: 'light', label: 'Light' },
                  { id: 'system', label: 'Match system' },
                ] as const
              ).map((t) => {
                const on = themePreference === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => onThemePreferenceChange(t.id)}
                    className={cx('p-2 rounded-3 border text-left transition-colors', on ? 'border-accent bg-accent-wash' : 'border-line hover:border-line-2')}
                  >
                    {t.id === 'system' ? (
                      <div className="relative h-[92px]">
                        <div className="absolute inset-0" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}>
                          <ThemeMiniature variant="dark" />
                        </div>
                        <div className="absolute inset-0" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}>
                          <ThemeMiniature variant="light" />
                        </div>
                      </div>
                    ) : (
                      <ThemeMiniature variant={t.id} />
                    )}
                    <div className="mt-2 flex items-center justify-between px-0.5">
                      <span className="text-[13.5px]">{t.label}</span>
                      {on && <Check className="w-4 h-4" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Skills */}
          <section id="skills" ref={sectionRef('skills')} className="scroll-mt-6 mb-12">
            <div className="flex items-end justify-between gap-4 mb-3">
              <div>
                <h2 className="t-section mb-1">AI agent skills</h2>
                <p className="text-[13px] text-muted">
                  Writes the ForgeStack skill into each tool’s skills folder under <span className="t-mono">{settings.defaultTargetPath}</span>.
                </p>
              </div>
              <Button variant="secondary" onClick={provision} disabled={provisioning || targets.length === 0}>
                {provisioning ? 'Writing…' : `Write skills for ${targets.length}`}
              </Button>
            </div>
            {provisionResult && (
              <p className={cx('mb-3 text-[13px]', provisionResult.ok ? 'text-ok' : 'text-danger')}>{provisionResult.text}</p>
            )}
            <div className="flex items-center gap-2 mb-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-faint pointer-events-none" />
                <TextInput value={agentQuery} onChange={(e) => setAgentQuery(e.target.value)} placeholder={`Search ${AGENT_TARGETS.length} tools`} className="pl-8" aria-label="Search AI tools" />
              </div>
              <Button size="sm" variant="ghost" onClick={() => setTargets(POPULAR)}>
                Popular
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setTargets(AGENT_TARGETS.map((t) => t.id))}>
                All {AGENT_TARGETS.length}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setTargets([])}>
                None
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-x-4 max-h-[360px] overflow-y-auto border-y border-line py-1">
              {filteredTargets.length === 0 ? (
                <p className="col-span-2 py-4 text-[13px] text-muted">No tool matches “{agentQuery}”.</p>
              ) : (
                filteredTargets.map((t) => (
                  <ChoiceRow
                    key={t.id}
                    multi
                    selected={targets.includes(t.id)}
                    onSelect={() => setTargets((prev) => (prev.includes(t.id) ? prev.filter((x) => x !== t.id) : [...prev, t.id]))}
                    title={t.name}
                    meta={t.relativePath.split('/').slice(0, -1).join('/')}
                    className="!h-9"
                  />
                ))
              )}
            </div>
          </section>

          {/* Updates */}
          <section id="updates" ref={sectionRef('updates')} className="scroll-mt-6 mb-12">
            <div className="flex items-end justify-between gap-4 mb-3">
              <h2 className="t-section">Updates</h2>
              <div className="flex gap-2">
                {onSimulateUpdate && (
                  <Button variant="ghost" onClick={onSimulateUpdate}>
                    Preview update dialog
                  </Button>
                )}
                {onCheckForUpdates && (
                  <Button onClick={onCheckForUpdates} disabled={isCheckingUpdate}>
                    <RotateCcw className={cx('w-3.5 h-3.5', isCheckingUpdate && 'animate-spin')} />
                    {isCheckingUpdate ? 'Checking…' : 'Check for updates'}
                  </Button>
                )}
              </div>
            </div>
            <dl className="border-t border-line">
              {(
                [
                  ['Installed version', appEnv?.current_version ?? __APP_VERSION__],
                  ['Platform', appEnv?.platform ?? 'browser'],
                  ['Package', appEnv?.is_appimage ? 'AppImage' : appEnv?.is_deb_or_system ? 'System package (.deb)' : isTauri() ? 'Portable' : 'Web preview'],
                  ['Update method', appEnv?.supports_in_place_update ? 'Installs in place' : 'Download the new package'],
                  ['Latest available', updateDetails?.available ? updateDetails.newVersion : 'You are up to date'],
                ] as [string, string][]
              ).map(([k, v]) => (
                <div key={k} className="h-10 flex items-center justify-between border-b border-line">
                  <dt className="text-[13px] text-muted">{k}</dt>
                  <dd className="t-mono text-fg">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <Button variant="danger" onClick={reset}>
            Reset all settings
          </Button>
        </div>
      </div>
    </div>
  );
};
