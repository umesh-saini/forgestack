import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { ProjectConfig } from '@forgestk/core';
import {
  CURATED_TEMPLATES,
  findCuratedTemplate,
  type CuratedTemplate,
} from './curated.js';

export type TemplateConfig = {
  topology: ProjectConfig['topology'];
  frontend?: Partial<ProjectConfig['frontend']>;
  backend?: Partial<ProjectConfig['backend']>;
  queue?: ProjectConfig['queue'];
  auth?: ProjectConfig['auth'];
  rpc?: ProjectConfig['rpc'];
  testing?: ProjectConfig['testing'];
  ci?: ProjectConfig['ci'];
  utilities?: ProjectConfig['utilities'];
  aiGovernance?: Partial<ProjectConfig['aiGovernance']>;
  packageManager?: ProjectConfig['packageManager'];
};

export interface SavedCustomTemplate {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  config: TemplateConfig;
}

export class TemplateStore {
  public static getTemplatesFilePath(): string {
    const configDir =
      process.env.FORGESTACK_CONFIG_DIR ||
      path.join(os.homedir(), '.forgestack');
    return path.join(configDir, 'templates.json');
  }

  public static loadSavedTemplates(): SavedCustomTemplate[] {
    const filePath = this.getTemplatesFilePath();
    if (!fs.existsSync(filePath)) {
      return [];
    }
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw);
      if (Array.isArray(data)) {
        return data as SavedCustomTemplate[];
      }
      return [];
    } catch {
      return [];
    }
  }

  public static saveCustomTemplate(
    name: string,
    description: string,
    config: TemplateConfig
  ): SavedCustomTemplate {
    const filePath = this.getTemplatesFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const templates = this.loadSavedTemplates();
    const id = name.toLowerCase().replace(/[^a-z0-9-_]/g, '-');

    const newTemplate: SavedCustomTemplate = {
      id,
      name,
      description: description || `Custom template for ${config.topology}`,
      createdAt: new Date().toISOString(),
      config,
    };

    const existingIndex = templates.findIndex((t) => t.id === id);
    if (existingIndex >= 0) {
      templates[existingIndex] = newTemplate;
    } else {
      templates.push(newTemplate);
    }

    fs.writeFileSync(filePath, JSON.stringify(templates, null, 2), 'utf-8');
    return newTemplate;
  }

  public static deleteCustomTemplate(idOrName: string): boolean {
    const normalized = idOrName.toLowerCase().trim();
    const templates = this.loadSavedTemplates();
    const filtered = templates.filter(
      (t) =>
        t.id.toLowerCase() !== normalized &&
        t.name.toLowerCase() !== normalized
    );
    if (filtered.length === templates.length) {
      return false;
    }
    const filePath = this.getTemplatesFilePath();
    fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  }

  public static findCustomTemplate(
    idOrName: string
  ): SavedCustomTemplate | undefined {
    const normalized = idOrName.toLowerCase().trim();
    const templates = this.loadSavedTemplates();
    return templates.find(
      (t) =>
        t.id.toLowerCase() === normalized ||
        t.name.toLowerCase() === normalized
    );
  }

  public static resolveAnyTemplate(idOrName: string): {
    source: 'curated' | 'custom';
    template: CuratedTemplate | SavedCustomTemplate;
  } | undefined {
    const curated = findCuratedTemplate(idOrName);
    if (curated) {
      return { source: 'curated', template: curated };
    }
    const custom = this.findCustomTemplate(idOrName);
    if (custom) {
      return { source: 'custom', template: custom };
    }
    return undefined;
  }
}
