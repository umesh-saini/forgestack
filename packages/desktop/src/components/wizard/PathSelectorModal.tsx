import React, { useEffect, useState } from 'react';
import { FolderSearch } from 'lucide-react';
import { loadAppSettings } from '../settings/AppSettingsPage.js';
import { isTauri } from '../../services/updaterService.js';
import { Button, ChoiceRow, Dialog, Field, TextInput } from '../ui/primitives.js';

interface Props {
  isOpen: boolean;
  currentPath: string;
  projectName?: string;
  onClose: () => void;
  onSelectPath: (newPath: string) => void;
}

const join = (dir: string, name: string) => (name && !dir.endsWith(`/${name}`) ? `${dir.replace(/\/+$/, '')}/${name}` : dir);

export const PathSelectorModal: React.FC<Props> = ({ isOpen, currentPath, projectName = '', onClose, onSelectPath }) => {
  const [customPath, setCustomPath] = useState(currentPath);

  useEffect(() => {
    if (isOpen) setCustomPath(currentPath);
  }, [isOpen, currentPath]);

  const base = loadAppSettings().defaultTargetPath.replace(/\/+$/, '');
  const home = base.split('/').slice(0, 3).join('/') || '/home';
  const places = Array.from(
    new Map(
      [
        ['Default folder', base],
        ['Documents', `${home}/Documents`],
        ['Projects', `${home}/Projects`],
        ['Desktop', `${home}/Desktop`],
        ['Temporary', '/tmp'],
      ].map(([l, p]) => [p, l] as const),
    ),
  ).map(([p, l]) => ({ label: l, path: join(p, projectName) }));

  const apply = (path = customPath) => {
    if (!path.trim()) return;
    onSelectPath(path.trim());
    onClose();
  };

  const pickNative = async () => {
    try {
      if (isTauri()) {
        const { invoke } = await import('@tauri-apps/api/core');
        const picked = await invoke<string | null>('pick_directory', { title: 'Select destination folder', defaultPath: customPath || undefined });
        if (picked) return apply(join(picked, projectName));
      }
    } catch (err) {
      console.warn('pick_directory failed, trying the dialog plugin:', err);
    }
    try {
      const { open } = await import('@tauri-apps/plugin-dialog');
      const selected = await open({ directory: true, multiple: false, title: 'Select destination folder' });
      if (selected && typeof selected === 'string') return apply(join(selected, projectName));
    } catch (err) {
      console.warn('Dialog plugin failed:', err);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title="Destination"
      width={560}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={() => apply()} disabled={!customPath.trim()}>
            Use this folder
          </Button>
        </>
      }
    >
      <div className="p-4 flex flex-col gap-4">
        <Field label="Path" hint={projectName ? `The project folder “${projectName}” is added to the folder you pick.` : undefined}>
          {(id) => (
            <div className="flex gap-2">
              <TextInput
                id={id}
                value={customPath}
                onChange={(e) => setCustomPath(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && apply()}
                className="font-mono"
              />
              {isTauri() && (
                <Button onClick={pickNative}>
                  <FolderSearch className="w-4 h-4" />
                  Choose…
                </Button>
              )}
            </div>
          )}
        </Field>
        <div>
          <div className="t-label text-muted mb-1.5">Places</div>
          <div role="radiogroup" aria-label="Places" className="flex flex-col gap-px">
            {places.map((p) => (
              <ChoiceRow
                key={p.path}
                selected={customPath === p.path}
                onSelect={() => setCustomPath(p.path)}
                title={p.label}
                meta={p.path}
                className="!h-9"
              />
            ))}
          </div>
        </div>
      </div>
    </Dialog>
  );
};
