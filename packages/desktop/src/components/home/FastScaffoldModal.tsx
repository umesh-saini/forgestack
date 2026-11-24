import React, { useEffect, useState } from 'react';
import { FolderOpen } from 'lucide-react';
import type { ProjectConfig } from '@forgestack/core/browser';
import type { SavedTemplate } from '../../types/template.js';
import { loadAppSettings } from '../settings/AppSettingsPage.js';
import { isTauri } from '../../services/updaterService.js';
import { archetypeOf } from '../../data/catalog.js';
import { Button, Dialog, Field, SettingRow, Switch, TextInput } from '../ui/primitives.js';

interface Props {
  template: SavedTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onScaffold: (config: ProjectConfig) => void;
  onBrowseFolder: (currentPath: string, onSelected: (p: string) => void) => void;
}

const baseDir = () => (loadAppSettings().defaultTargetPath || '/home/dev/Documents').replace(/\/+$/, '');

/** Confirms name and destination before writing — a template click is never permission to write. */
export const FastScaffoldModal: React.FC<Props> = ({ template, isOpen, onClose, onScaffold, onBrowseFolder }) => {
  const [projectName, setProjectName] = useState('');
  const [targetPath, setTargetPath] = useState('');
  const [gitInit, setGitInit] = useState(true);
  const [autoInstall, setAutoInstall] = useState(true);

  useEffect(() => {
    if (template && isOpen) {
      const s = loadAppSettings();
      setProjectName(template.config.name);
      setTargetPath(`${baseDir()}/${template.config.name}`);
      setGitInit(s.defaultGitInit ?? template.config.git);
      setAutoInstall(s.defaultAutoInstall ?? template.config.install);
    }
  }, [template, isOpen]);

  const handleNameChange = (val: string) => {
    const slug = val.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    setProjectName(slug);
    setTargetPath(`${baseDir()}/${slug}`);
  };

  const valid = projectName.trim() && targetPath.trim();

  const confirm = () => {
    if (!template || !valid) return;
    onScaffold({ ...template.config, name: projectName.trim(), targetPath: targetPath.trim(), git: gitInit, install: autoInstall });
    onClose();
  };

  return (
    <Dialog
      open={isOpen && Boolean(template)}
      onClose={onClose}
      title={template ? `Scaffold ${template.name}` : ''}
      width={520}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirm} disabled={!valid}>
            {isTauri() ? 'Scaffold project' : 'Download project ZIP'}
          </Button>
        </>
      }
    >
      {template && (
        <form
          className="p-4 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            confirm();
          }}
        >
          <p className="text-[13px] text-muted">
            {archetypeOf(template.config.topology).title} with the template’s stack. Nothing is written until you confirm.
          </p>
          <Field label="Project name">
            {(id) => <TextInput id={id} value={projectName} onChange={(e) => handleNameChange(e.target.value)} className="font-mono" />}
          </Field>
          <Field label="Destination">
            {(id) => (
              <div className="flex gap-2">
                <TextInput id={id} value={targetPath} onChange={(e) => setTargetPath(e.target.value)} className="font-mono" />
                <Button onClick={() => onBrowseFolder(targetPath, (p) => setTargetPath(p.endsWith(projectName) ? p : `${p}/${projectName}`))}>
                  <FolderOpen className="w-4 h-4" />
                  Browse
                </Button>
              </div>
            )}
          </Field>
          {isTauri() && (
            <div className="border-t border-line">
              <SettingRow label="Initialize git repository">
                <Switch checked={gitInit} onChange={setGitInit} label="Initialize git repository" />
              </SettingRow>
              <SettingRow label="Install dependencies" description={`Runs ${template.config.packageManager} install after writing files.`}>
                <Switch checked={autoInstall} onChange={setAutoInstall} label="Install dependencies" />
              </SettingRow>
            </div>
          )}
          <button type="submit" hidden />
        </form>
      )}
    </Dialog>
  );
};
