import { useEffect, useState } from 'react';

/** The resolved class applied to <html>. */
export type ThemeId = 'theme-dark' | 'theme-light';
/** What the user picked in Settings. */
export type ThemePreference = 'dark' | 'light' | 'system';

const STORAGE_KEY = 'forgestack-theme';

/**
 * Reads the stored preference. Older builds stored a theme class
 * ('theme-dark' | 'theme-midnight' | 'theme-matrix' | 'theme-light'); every
 * dark variant maps to the new dark theme so existing installs keep working.
 */
export function loadThemePreference(): ThemePreference {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'light' || raw === 'theme-light') return 'light';
    if (raw === 'system') return 'system';
  } catch {
    // storage unavailable
  }
  return 'dark';
}

const systemPrefersLight = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: light)').matches;

export function resolveTheme(pref: ThemePreference): ThemeId {
  if (pref === 'system') return systemPrefersLight() ? 'theme-light' : 'theme-dark';
  return pref === 'light' ? 'theme-light' : 'theme-dark';
}

/** Owns the theme preference, persists it and keeps <html> in sync (including OS changes for 'system'). */
export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(loadThemePreference);
  const [theme, setTheme] = useState<ThemeId>(() => resolveTheme(loadThemePreference()));

  useEffect(() => {
    const apply = () => {
      const next = resolveTheme(preference);
      setTheme(next);
      document.documentElement.className = next;
    };
    apply();
    try {
      localStorage.setItem(STORAGE_KEY, preference);
    } catch {
      // ignore
    }
    if (preference !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [preference]);

  const toggle = () => setPreference(theme === 'theme-dark' ? 'light' : 'dark');

  return { theme, preference, setPreference, toggle };
}
