import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowUpCircle, FolderTree, LayoutList, Moon, Search, Settings2, Sun } from 'lucide-react';
import type { ThemeId } from '../../theme.js';
import { IconButton, Kbd, cx } from '../ui/primitives.js';

interface Props {
  theme: ThemeId;
  onToggleTheme: () => void;
  onOpenPalette: () => void;
  update?: { version: string } | null;
  onOpenUpdate: () => void;
  children: React.ReactNode;
}

const NAV = [
  { to: '/hub', label: 'Hub', icon: LayoutList, match: ['/', '/hub', '/templates'] },
  { to: '/new', label: 'New project', icon: FolderTree, match: ['/new', '/studio', '/scaffold'] },
  { to: '/settings', label: 'Settings', icon: Settings2, match: ['/settings'] },
];

const isMac = typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform);

export const AppShell: React.FC<Props> = ({
  theme,
  onToggleTheme,
  onOpenPalette,
  update,
  onOpenUpdate,
  children,
}) => {
  const { pathname } = useLocation();

  return (
    <div className="h-full flex flex-col bg-main text-fg">
      {/* Title bar */}
      <header className="h-10 shrink-0 flex items-center border-b border-line bg-surface select-none" data-tauri-drag-region>
        <div className="w-[176px] shrink-0 h-full flex items-center gap-2 px-3 border-r border-line" data-tauri-drag-region>
          <img src="/app-icon.svg" alt="" className="w-[18px] h-[18px]" />
          <span className="text-[13.5px] font-semibold tracking-[-0.01em]">ForgeStack</span>
          <span className="text-[12.5px] text-faint">Studio</span>
        </div>

        <div className="flex-1 min-w-0 h-full flex items-center px-3 gap-2" data-tauri-drag-region>
        </div>

        <div className="flex items-center gap-1 pr-2">
          <button
            type="button"
            onClick={onOpenPalette}
            className="h-7 pl-2 pr-1 mr-1 flex items-center gap-2 rounded-2 border border-line bg-main text-faint hover:text-muted hover:border-line-2 transition-colors w-[220px]"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="flex-1 text-left text-[12.5px] whitespace-nowrap">Search commands</span>
            <Kbd>{isMac ? '⌘K' : 'Ctrl K'}</Kbd>
          </button>

          {update && (
            <button
              type="button"
              onClick={onOpenUpdate}
              className="h-7 px-2 flex items-center gap-1.5 rounded-2 bg-accent text-on-accent text-[12.5px] font-medium hover:bg-accent-hover"
            >
              <ArrowUpCircle className="w-3.5 h-3.5" />
              Update to {update.version}
            </button>
          )}

          <IconButton label={theme === 'theme-dark' ? 'Switch to light theme' : 'Switch to dark theme'} onClick={onToggleTheme}>
            <motion.span
              key={theme}
              initial={{ rotate: -60, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="flex"
            >
              {theme === 'theme-dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </motion.span>
          </IconButton>
        </div>
      </header>

      <div className="flex-1 min-h-0 flex">
        {/* Navigation */}
        <nav aria-label="Main" className="w-[176px] shrink-0 border-r border-line bg-surface flex flex-col py-2">
          <ul className="flex flex-col gap-px px-2">
            {NAV.map((item) => {
              const active = item.match.includes(pathname);
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={cx(
                      'relative h-8 px-2 flex items-center gap-2.5 rounded-2 text-[13.5px] transition-colors duration-[90ms]',
                      active ? 'text-fg font-medium' : 'text-muted hover:text-fg',
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-2 bg-raised border border-line"
                        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                      />
                    )}
                    <Icon className="relative w-4 h-4" strokeWidth={active ? 2.2 : 1.8} />
                    <span className="relative">{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
          <div className="mt-auto px-4 pb-1 t-mono text-faint">v{__APP_VERSION__}</div>
        </nav>

        <main className="flex-1 min-w-0 min-h-0 relative">{children}</main>
      </div>
    </div>
  );
};
