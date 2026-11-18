import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  FolderOpen,
  Settings,
} from 'lucide-react';

interface Props {
  targetPath: string;
  onBrowsePath: () => void;
}

export const StudioNavbar: React.FC<Props> = ({
  targetPath,
  onBrowsePath,
}) => {
  const location = useLocation();
  const isWizardRoute =
    location.pathname === '/new' ||
    location.pathname === '/studio' ||
    location.pathname === '/scaffold';

  return (
    <header className="sticky top-0 z-40 w-full ui-panel border-b backdrop-blur-md bg-[var(--bg-surface)]/95 transition-colors">
      <div className="w-full max-w-[1750px] mx-auto px-4 lg:px-6 h-13 flex items-center justify-between">
        {/* Brand Logo & Navigation Links with Standard Gap */}
        <div className="flex items-center gap-6">
          <NavLink
            to="/"
            className="flex items-center gap-2.5 font-bold tracking-tight text-sm text-[var(--text-main)] hover:opacity-90 shrink-0"
          >
            <img
              src="/app-icon.png"
              alt="ForgeStack"
              className="w-7 h-7 shrink-0 object-contain drop-shadow-[0_2px_6px_rgba(251,92,11,0.25)]"
            />
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-[var(--text-main)]">ForgeStack</span>
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-md bg-orange-500/10 text-orange-500 border border-orange-500/20 font-semibold">
                Studio
              </span>
            </div>
          </NavLink>

          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline select-none">/</span>

          {/* Clean, Standard Navigation Links */}
          <nav className="flex items-center gap-4 text-xs font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `transition-colors ${
                  isActive
                    ? 'text-orange-500 font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`
              }
            >
              Templates Hub
            </NavLink>

            <NavLink
              to="/new"
              className={({ isActive }) =>
                `transition-colors ${
                  isActive
                    ? 'text-orange-500 font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`
              }
            >
              Studio Wizard
            </NavLink>
          </nav>
        </div>

        {/* Right Header Controls with Standard Gap */}
        <div className="flex items-center gap-2.5">
          {/* Target Directory Indicator Pill (shown only on wizard route where active project exists) */}
          {isWizardRoute && (
            <button
              type="button"
              onClick={onBrowsePath}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl ui-card-subtle border text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--border-hover)] transition-all cursor-pointer max-w-[320px] truncate"
              title={`Destination Path: ${targetPath}`}
            >
              <FolderOpen className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span className="truncate">{targetPath}</span>
            </button>
          )}

          {/* Quick Settings Cog Icon */}
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `p-2 rounded-xl ui-card-subtle border transition-colors ${
                isActive
                  ? 'text-orange-500 border-orange-500/40 bg-orange-500/10'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)]'
              }`
            }
            title="App Settings & Themes"
          >
            <Settings className="w-4 h-4" />
          </NavLink>
        </div>
      </div>
    </header>
  );
};
