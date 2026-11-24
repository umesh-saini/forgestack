import React, { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import {
  downloadAndInstallUpdate,
  openExternalUrl,
  relaunchApp,
  type DownloadProgress,
  type UpdateDetails,
} from '../../services/updaterService';
import { Button, Dialog, WorkingLine } from '../ui/primitives.js';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  updateDetails: UpdateDetails | null;
  isChecking?: boolean;
}

/** Renders the small markdown subset used in release notes: headings and bullet lines. */
const Notes: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex flex-col gap-1">
    {text.split('\n').map((line, i) => {
      const l = line.trim();
      if (!l) return null;
      if (l.startsWith('#')) return <h3 key={i} className="t-label text-fg mt-2 first:mt-0">{l.replace(/^#+\s*/, '')}</h3>;
      if (/^[-•*]\s/.test(l))
        return (
          <p key={i} className="text-[13px] text-muted pl-4 relative before:absolute before:left-1 before:top-[9px] before:w-1 before:h-1 before:bg-line-2">
            {l.replace(/^[-•*]\s/, '')}
          </p>
        );
      return <p key={i} className="text-[13px] text-muted">{l}</p>;
    })}
  </div>
);

export const UpdateModal: React.FC<Props> = ({ isOpen, onClose, updateDetails: u, isChecking = false }) => {
  const [status, setStatus] = useState<'idle' | 'downloading' | 'downloaded' | 'error'>('idle');
  const [progress, setProgress] = useState<DownloadProgress>({ percent: 0, downloadedMB: 0, totalMB: 0 });
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStatus('idle');
      setError(null);
    }
  }, [isOpen]);

  const debFile = `ForgeStack_${u?.newVersion ?? ''}_amd64.deb`;
  const installCmd = `sudo dpkg -i ~/Downloads/${debFile}`;

  const install = async () => {
    setStatus('downloading');
    setError(null);
    try {
      await downloadAndInstallUpdate(setProgress);
      setStatus('downloaded');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'The update could not be downloaded. Check your connection and try again.');
    }
  };

  const footer = (() => {
    if (isChecking || !u?.available) return <Button onClick={onClose}>Close</Button>;
    if (u.supportsInPlace) {
      return (
        <>
          <Button variant="ghost" onClick={onClose}>
            Later
          </Button>
          {status === 'downloaded' ? (
            <Button variant="primary" onClick={() => relaunchApp().catch(() => setError('Restart ForgeStack to finish updating.'))}>
              Restart now
            </Button>
          ) : (
            <Button variant="primary" onClick={install} disabled={status === 'downloading'}>
              {status === 'downloading' ? 'Downloading…' : status === 'error' ? 'Try again' : `Install ${u.newVersion}`}
            </Button>
          )}
        </>
      );
    }
    return (
      <>
        <Button variant="ghost" onClick={() => openExternalUrl(u.downloadUrl ?? 'https://github.com/umesh-saini/forgestack/releases')}>
          Read release notes
        </Button>
        {u.debDownloadUrl && (
          <Button variant="primary" onClick={() => openExternalUrl(u.debDownloadUrl!)}>
            Download {debFile}
          </Button>
        )}
      </>
    );
  })();

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title={isChecking ? 'Checking for updates' : u?.available ? `ForgeStack ${u.newVersion}` : 'Updates'}
      width={560}
      footer={footer}
    >
      <div className="p-4 max-h-[520px]">
        {isChecking ? (
          <div className="py-6">
            <WorkingLine active />
            <p className="mt-3 text-[13px] text-muted">Reading the latest release from GitHub.</p>
          </div>
        ) : !u?.available ? (
          <p className="py-4 text-[13.5px]">
            You have the latest version{u?.currentVersion ? `, ${u.currentVersion}` : ''}.
          </p>
        ) : (
          <>
            <dl className="mb-4 border-b border-line">
              {(
                [
                  ['Installed', u.currentVersion],
                  ['Available', u.newVersion],
                  ...(u.releaseDate ? [['Released', new Date(u.releaseDate).toLocaleDateString()]] : []),
                ] as [string, string][]
              ).map(([k, v]) => (
                <div key={k} className="h-9 flex items-center justify-between border-t border-line">
                  <dt className="text-[13px] text-muted">{k}</dt>
                  <dd className="t-mono">{v}</dd>
                </div>
              ))}
            </dl>

            {u.releaseNotes && <Notes text={u.releaseNotes} />}

            {status === 'downloading' && (
              <div className="mt-4">
                <div className="h-1 bg-raised overflow-hidden">
                  <div className="h-full bg-accent transition-[width] duration-200" style={{ width: `${progress.percent}%` }} />
                </div>
                <p className="mt-2 t-mono text-muted tabular">
                  {progress.downloadedMB.toFixed(1)} of {progress.totalMB.toFixed(1)} MB
                </p>
              </div>
            )}
            {status === 'downloaded' && <p className="mt-4 text-[13px] text-ok">Installed. Restart ForgeStack to use {u.newVersion}.</p>}
            {error && <p className="mt-4 text-[13px] text-danger">{error}</p>}

            {!u.supportsInPlace && u.isDebOrSystem && (
              <div className="mt-5">
                <p className="text-[13px] text-muted mb-2">This install is managed by your system. After downloading, run:</p>
                <div className="flex items-stretch rounded-2 border border-line bg-sunken">
                  <code className="flex-1 px-3 py-2 t-mono truncate select-all">{installCmd}</code>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(installCmd).then(() => {
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1500);
                      });
                    }}
                    className="px-3 border-l border-line text-muted hover:text-fg flex items-center gap-1.5 text-[12.5px]"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Dialog>
  );
};
