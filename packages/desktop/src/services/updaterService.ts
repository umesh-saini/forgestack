export const isTauri = (): boolean =>
  typeof window !== 'undefined' && ('__TAURI_INTERNALS__' in window || '__TAURI__' in window);

export interface AppEnvironment {
  current_version: string;
  platform: 'linux' | 'windows' | 'macos' | 'browser' | 'unknown';
  is_appimage: boolean;
  is_deb_or_system: boolean;
  supports_in_place_update: boolean;
  install_location: string;
}

export interface UpdateDetails {
  available: boolean;
  currentVersion: string;
  newVersion: string;
  releaseNotes?: string;
  releaseDate?: string;
  supportsInPlace: boolean;
  isDebOrSystem: boolean;
  platform: string;
  downloadUrl?: string;
  debDownloadUrl?: string;
  tarballUrl?: string;
}

export interface DownloadProgress {
  percent: number;
  downloadedMB: number;
  totalMB: number;
}

// In-memory reference to Tauri's Update handle for in-place installs
let cachedTauriUpdate: any = null;

/**
 * Compares two semver strings (e.g. "1.1.0" > "1.0.0")
 */
function isNewerVersion(remote: string, current: string): boolean {
  const cleanRemote = remote.replace(/^v/, '').trim();
  const cleanCurrent = current.replace(/^v/, '').trim();

  const rParts = cleanRemote.split('.').map((p) => parseInt(p, 10) || 0);
  const cParts = cleanCurrent.split('.').map((p) => parseInt(p, 10) || 0);

  for (let i = 0; i < Math.max(rParts.length, cParts.length); i++) {
    const r = rParts[i] ?? 0;
    const c = cParts[i] ?? 0;
    if (r > c) return true;
    if (r < c) return false;
  }
  return false;
}

/**
 * Queries the native Rust backend to inspect packaging, OS, and execution path.
 */
export async function getAppEnvironment(): Promise<AppEnvironment> {
  if (isTauri()) {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      const env = await invoke<AppEnvironment>('get_app_environment');
      return env;
    } catch (err) {
      console.warn('[Updater] Could not query get_app_environment from Tauri:', err);
    }
  }

  // Web Browser / Dev Fallback
  return {
    current_version: '1.0.0',
    platform: 'browser',
    is_appimage: false,
    is_deb_or_system: false,
    supports_in_place_update: false,
    install_location: typeof window !== 'undefined' ? window.location.href : 'web',
  };
}

/**
 * Checks for updates across both Tauri's cryptographic updater and GitHub Releases fallback.
 */
export async function checkForUpdates(forceCheck = false): Promise<UpdateDetails | null> {
  const env = await getAppEnvironment();
  const currentVer = env.current_version;

  // 1. Try official Tauri v2 Cryptographic Updater if running inside Tauri
  if (isTauri()) {
    try {
      const { check } = await import('@tauri-apps/plugin-updater');
      const update = await check();

      if (update && isNewerVersion(update.version, currentVer)) {
        cachedTauriUpdate = update;
        return {
          available: true,
          currentVersion: currentVer,
          newVersion: update.version,
          releaseNotes: update.body || 'Production stability improvements and architectural updates.',
          releaseDate: update.date,
          supportsInPlace: env.supports_in_place_update,
          isDebOrSystem: env.is_deb_or_system,
          platform: env.platform,
          downloadUrl: `https://github.com/forgestack/forgestack/releases/tag/v${update.version}`,
          debDownloadUrl: `https://github.com/forgestack/forgestack/releases/download/v${update.version}/ForgeStack_${update.version}_amd64.deb`,
        };
      }
    } catch (err) {
      console.warn('[Updater] Tauri plugin-updater check failed (likely network or missing latest.json), trying fallback:', err);
    }
  }

  // 2. Fallback to GitHub Releases API (Crucial for Debian/Ubuntu .deb and manual installs)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch('https://api.github.com/repos/forgestack/forgestack/releases/latest', {
      signal: controller.signal,
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const release = await res.json();
      const latestTag = (release.tag_name || '').replace(/^v/, '');

      if (latestTag && isNewerVersion(latestTag, currentVer)) {
        // Find .deb asset if available
        const debAsset = (release.assets || []).find((a: any) =>
          a.name?.endsWith('.deb') || a.name?.includes('amd64')
        );

        return {
          available: true,
          currentVersion: currentVer,
          newVersion: latestTag,
          releaseNotes: release.body || 'Architectural enhancements and template additions.',
          releaseDate: release.published_at,
          supportsInPlace: env.supports_in_place_update,
          isDebOrSystem: env.is_deb_or_system,
          platform: env.platform,
          downloadUrl: release.html_url || `https://github.com/forgestack/forgestack/releases/tag/v${latestTag}`,
          debDownloadUrl:
            debAsset?.browser_download_url ||
            `https://github.com/forgestack/forgestack/releases/download/v${latestTag}/ForgeStack_${latestTag}_amd64.deb`,
        };
      }
    }
  } catch (err) {
    // Network offline or GitHub rate limit
    if (forceCheck) {
      console.info('[Updater] GitHub fallback unreachable or offline:', err);
    }
  }

  // No newer version found
  return {
    available: false,
    currentVersion: currentVer,
    newVersion: currentVer,
    supportsInPlace: env.supports_in_place_update,
    isDebOrSystem: env.is_deb_or_system,
    platform: env.platform,
  };
}

/**
 * Downloads and installs the update in-place (AppImage, Windows NSIS, macOS .app).
 */
export async function downloadAndInstallUpdate(
  onProgress: (prog: DownloadProgress) => void
): Promise<void> {
  if (!cachedTauriUpdate) {
    throw new Error('No in-place Tauri update handle available.');
  }

  let totalBytes = 0;
  let downloadedBytes = 0;

  await cachedTauriUpdate.downloadAndInstall((event: any) => {
    switch (event.event) {
      case 'Started':
        totalBytes = event.data?.contentLength || 0;
        break;
      case 'Progress': {
        downloadedBytes += event.data?.chunkLength || 0;
        const percent = totalBytes > 0 ? Math.min(100, Math.round((downloadedBytes / totalBytes) * 100)) : 50;
        onProgress({
          percent,
          downloadedMB: parseFloat((downloadedBytes / (1024 * 1024)).toFixed(1)),
          totalMB: parseFloat((totalBytes / (1024 * 1024)).toFixed(1)),
        });
        break;
      }
      case 'Finished':
        onProgress({
          percent: 100,
          downloadedMB: parseFloat((downloadedBytes / (1024 * 1024)).toFixed(1)),
          totalMB: parseFloat((totalBytes / (1024 * 1024)).toFixed(1)),
        });
        break;
    }
  });
}

/**
 * Relaunches ForgeStack Desktop application after update installation.
 */
export async function relaunchApp(): Promise<void> {
  if (isTauri()) {
    try {
      const { relaunch } = await import('@tauri-apps/plugin-process');
      await relaunch();
      return;
    } catch (err) {
      console.warn('[Updater] plugin-process relaunch failed, trying native exit/restart:', err);
    }
  }

  if (typeof window !== 'undefined') {
    window.location.reload();
  }
}

/**
 * Opens download URL in the external system browser.
 */
export async function openExternalUrl(url: string): Promise<void> {
  if (isTauri()) {
    try {
      const { open } = await import('@tauri-apps/plugin-shell');
      await open(url);
      return;
    } catch (err) {
      console.warn('[Updater] plugin-shell open failed:', err);
    }
  }

  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
