import React, { useState } from 'react';
import {
  Sparkles,
  Download,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  RotateCw,
  X,
  Terminal,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import {
  UpdateDetails,
  DownloadProgress,
  downloadAndInstallUpdate,
  relaunchApp,
  openExternalUrl,
} from '../../services/updaterService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  updateDetails: UpdateDetails | null;
  isChecking?: boolean;
}

export const UpdateModal: React.FC<Props> = ({
  isOpen,
  onClose,
  updateDetails,
  isChecking = false,
}) => {
  const [status, setStatus] = useState<'idle' | 'downloading' | 'downloaded' | 'error'>('idle');
  const [progress, setProgress] = useState<DownloadProgress>({ percent: 0, downloadedMB: 0, totalMB: 0 });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedCmd, setCopiedCmd] = useState(false);

  if (!isOpen) return null;

  const handleStartInPlaceUpdate = async () => {
    setStatus('downloading');
    setErrorMsg(null);
    try {
      await downloadAndInstallUpdate((p) => {
        setProgress(p);
      });
      setStatus('downloaded');
    } catch (err: any) {
      console.error('[Updater] Download and install failed:', err);
      setStatus('error');
      setErrorMsg(err?.message || 'Failed to download update bundle. Please check your network connection.');
    }
  };

  const handleRelaunch = async () => {
    try {
      await relaunchApp();
    } catch (err: any) {
      console.error('[Updater] Relaunch failed:', err);
      setErrorMsg('Could not restart application automatically. Please close and re-open ForgeStack.');
    }
  };

  const debFilename = `ForgeStack_${updateDetails?.newVersion || '1.1.0'}_amd64.deb`;
  const terminalInstallCmd = `sudo dpkg -i ~/Downloads/${debFilename}`;

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(terminalInstallCmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl ui-panel rounded-2xl shadow-2xl border flex flex-col overflow-hidden max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b ui-card-subtle flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight text-[var(--text-main)] flex items-center gap-2">
                <span>ForgeStack Software Update</span>
                {updateDetails?.available && (
                  <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 uppercase font-bold">
                    v{updateDetails.newVersion}
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-[var(--text-muted)]">
                Desktop Scaffolding Studio Version Manager
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[var(--text-main)] hover:bg-slate-500/15 transition-colors cursor-pointer"
            title="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* 1. Checking State */}
          {isChecking && (
            <div className="py-10 flex flex-col items-center justify-center gap-3 text-center">
              <RotateCw className="w-8 h-8 text-orange-500 animate-spin" />
              <h4 className="text-sm font-semibold text-[var(--text-main)]">
                Querying ForgeStack Release Manifest...
              </h4>
              <p className="text-xs text-[var(--text-muted)] max-w-xs">
                Checking cryptographic signatures and remote release channels.
              </p>
            </div>
          )}

          {/* 2. Up to Date State */}
          {!isChecking && updateDetails && !updateDetails.available && (
            <div className="py-8 flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[var(--text-main)]">
                  ForgeStack Studio is Up to Date
                </h4>
                <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">
                  Current build: v{updateDetails.currentVersion} • Platform: {updateDetails.platform}
                </p>
              </div>
              <p className="text-xs text-[var(--text-muted)] max-w-sm mt-2">
                You are currently running the latest certified production release with full slice support.
              </p>
            </div>
          )}

          {/* 3. Update Available State */}
          {!isChecking && updateDetails && updateDetails.available && (
            <div className="space-y-4">
              {/* Version Comparison Card */}
              <div className="p-4 rounded-xl ui-card-subtle border flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">
                    Current Version
                  </span>
                  <div className="font-mono text-xs font-bold text-slate-400">
                    v{updateDetails.currentVersion}
                  </div>
                </div>

                <div className="h-6 w-px bg-slate-700/50" />

                <div className="space-y-0.5 text-right">
                  <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">
                    Available Update
                  </span>
                  <div className="font-mono text-sm font-extrabold text-orange-500 flex items-center justify-end gap-1.5">
                    <span>v{updateDetails.newVersion}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-orange-500/15 text-orange-400 border border-orange-500/30 uppercase font-sans">
                      Latest
                    </span>
                  </div>
                </div>
              </div>

              {/* Release Notes Preview */}
              {updateDetails.releaseNotes && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                    What's New in v{updateDetails.newVersion}
                  </label>
                  <div className="p-3.5 rounded-xl ui-input border font-mono text-xs max-h-40 overflow-y-auto leading-relaxed text-[var(--text-main)] whitespace-pre-line select-text">
                    {updateDetails.releaseNotes}
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* SCENARIO A: In-Place Auto-Update Supported (AppImage / Windows / Mac) */}
              {/* ========================================================= */}
              {updateDetails.supportsInPlace && (
                <div className="space-y-3 pt-2">
                  {status === 'idle' && (
                    <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-[var(--text-main)] flex items-start gap-2.5">
                      <Cpu className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold text-orange-500 block">
                          Self-Mutating In-Place Update Supported
                        </strong>
                        <span className="text-[11px] text-[var(--text-muted)]">
                          ForgeStack will download the signed delta package and hot-swap the binary automatically.
                        </span>
                      </div>
                    </div>
                  )}

                  {status === 'downloading' && (
                    <div className="space-y-2 p-4 rounded-xl ui-card-subtle border">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-orange-500 font-bold flex items-center gap-1.5">
                          <RotateCw className="w-3.5 h-3.5 animate-spin" />
                          Downloading v{updateDetails.newVersion}...
                        </span>
                        <span className="font-bold">{progress.percent}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-600 to-amber-500 transition-all duration-200"
                          style={{ width: `${progress.percent}%` }}
                        />
                      </div>
                      {progress.totalMB > 0 && (
                        <div className="text-[10px] font-mono text-[var(--text-muted)] text-right">
                          {progress.downloadedMB} MB / {progress.totalMB} MB
                        </div>
                      )}
                    </div>
                  )}

                  {status === 'downloaded' && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      <div>
                        <strong className="font-bold text-sm block">Update Ready to Apply!</strong>
                        <p className="text-[11px] text-emerald-400/80 mt-0.5">
                          The new binary has been verified and staged. Click below to restart ForgeStack Studio.
                        </p>
                      </div>
                    </div>
                  )}

                  {status === 'error' && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold block">Update Failed</strong>
                        <span className="text-[11px] opacity-90">{errorMsg}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================= */}
              {/* SCENARIO B: System Package Detected (.deb / .rpm) */}
              {/* ========================================================= */}
              {!updateDetails.supportsInPlace && updateDetails.isDebOrSystem && (
                <div className="space-y-3 pt-2">
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-2">
                    <div className="flex items-center gap-2 text-amber-500 font-bold">
                      <Terminal className="w-4 h-4" />
                      <span>System Package Installation Detected (.deb)</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                      ForgeStack is installed as a Debian root package in <code className="text-amber-400 font-mono">/usr/bin/forgestack-desktop</code>.
                      For security and permission boundaries, standard user processes cannot self-overwrite system binaries. Please install the updated package directly:
                    </p>

                    {/* Copyable Terminal Snippet */}
                    <div className="p-2.5 rounded-lg ui-input border font-mono text-xs flex items-center justify-between gap-2">
                      <code className="text-amber-400 truncate select-all">{terminalInstallCmd}</code>
                      <button
                        type="button"
                        onClick={handleCopyCommand}
                        className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                        title="Copy command"
                      >
                        {copiedCmd ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer / Actions */}
        <div className="px-5 py-3.5 border-t ui-card-subtle flex items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl ui-card-subtle border text-xs font-semibold hover:ui-panel transition-colors cursor-pointer"
          >
            {updateDetails?.available ? 'Remind Me Later' : 'Close'}
          </button>

          <div className="flex items-center gap-2">
            {updateDetails?.available && updateDetails.supportsInPlace && (
              <>
                {status === 'idle' && (
                  <button
                    type="button"
                    onClick={handleStartInPlaceUpdate}
                    className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-orange-600/30"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download & Install</span>
                  </button>
                )}

                {status === 'downloaded' && (
                  <button
                    type="button"
                    onClick={handleRelaunch}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-emerald-600/30"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Restart ForgeStack</span>
                  </button>
                )}
              </>
            )}

            {updateDetails?.available && !updateDetails.supportsInPlace && (
              <>
                {updateDetails.debDownloadUrl && (
                  <button
                    type="button"
                    onClick={() => openExternalUrl(updateDetails.debDownloadUrl!)}
                    className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-orange-600/30"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .deb Package</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => openExternalUrl(updateDetails.downloadUrl || 'https://github.com/forgestack/forgestack/releases')}
                  className="px-3.5 py-2 rounded-xl ui-card-subtle border text-xs font-semibold hover:ui-panel flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>GitHub Release</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
