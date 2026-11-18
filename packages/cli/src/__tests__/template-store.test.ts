import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { TemplateStore } from '../templates/store.js';
import { CURATED_TEMPLATES } from '../templates/curated.js';

describe('TemplateStore', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forgestack-store-test-'));
    process.env.FORGESTACK_CONFIG_DIR = tempDir;
  });

  afterEach(() => {
    delete process.env.FORGESTACK_CONFIG_DIR;
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('should return empty list when no saved templates file exists', () => {
    const list = TemplateStore.loadSavedTemplates();
    expect(list).toEqual([]);
  });

  it('should save and load custom template correctly', () => {
    const saved = TemplateStore.saveCustomTemplate('Team Microservice', 'Our standard microservice', {
      topology: 'standalone-be',
      frontend: {
        framework: 'none',
        styling: 'none',
        state: 'none',
        uiExtras: { toast: false, icons: false, forms: false },
        dateLib: 'none',
      },
      backend: {
        framework: 'fastify',
        database: 'postgres',
        orm: 'drizzle',
        container: true,
        processManager: 'docker',
      },
      packageManager: 'pnpm',
    });

    expect(saved.id).toBe('team-microservice');
    expect(saved.name).toBe('Team Microservice');
    expect(saved.description).toBe('Our standard microservice');
    expect(saved.createdAt).toBeDefined();

    const loaded = TemplateStore.loadSavedTemplates();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].id).toBe('team-microservice');
    expect(loaded[0].config.topology).toBe('standalone-be');
  });

  it('should overwrite existing template with matching id', () => {
    TemplateStore.saveCustomTemplate('My-Preset', 'Version 1', {
      topology: 'standalone-fe',
      frontend: {
        framework: 'react-vite',
        styling: 'tailwind',
        state: 'query',
        uiExtras: { toast: true, icons: true, forms: true },
        dateLib: 'none',
      },
      backend: {
        framework: 'none',
        database: 'none',
        orm: 'none',
        container: false,
      },
      packageManager: 'pnpm',
    });

    TemplateStore.saveCustomTemplate('My Preset', 'Version 2 updated', {
      topology: 'standalone-fe',
      frontend: {
        framework: 'react-vite',
        styling: 'tailwind',
        state: 'zustand',
        uiExtras: { toast: true, icons: true, forms: true },
        dateLib: 'none',
      },
      backend: {
        framework: 'none',
        database: 'none',
        orm: 'none',
        container: false,
      },
      packageManager: 'pnpm',
    });

    const loaded = TemplateStore.loadSavedTemplates();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].description).toBe('Version 2 updated');
    expect(loaded[0].config.frontend?.state).toBe('zustand');
  });

  it('should find custom template by id or name case-insensitively', () => {
    TemplateStore.saveCustomTemplate('Fastify API', 'API stack', {
      topology: 'standalone-be',
      frontend: {
        framework: 'none',
        styling: 'none',
        state: 'none',
        uiExtras: { toast: false, icons: false, forms: false },
        dateLib: 'none',
      },
      backend: {
        framework: 'fastify',
        database: 'postgres',
        orm: 'drizzle',
        container: true,
      },
      packageManager: 'pnpm',
    });

    const foundById = TemplateStore.findCustomTemplate('fastify-api');
    expect(foundById).toBeDefined();
    expect(foundById?.name).toBe('Fastify API');

    const foundByName = TemplateStore.findCustomTemplate('FASTIFY API');
    expect(foundByName).toBeDefined();
    expect(foundByName?.id).toBe('fastify-api');

    const notFound = TemplateStore.findCustomTemplate('non-existent');
    expect(notFound).toBeUndefined();
  });

  it('should delete custom template and persist the update', () => {
    TemplateStore.saveCustomTemplate('Temp-1', 'Temp 1', {
      topology: 'monorepo',
      frontend: { framework: 'react-vite', styling: 'tailwind', state: 'query', uiExtras: { toast: true, icons: true, forms: true }, dateLib: 'none' },
      backend: { framework: 'fastify', database: 'postgres', orm: 'drizzle', container: true },
      packageManager: 'pnpm',
    });
    TemplateStore.saveCustomTemplate('Temp-2', 'Temp 2', {
      topology: 'monorepo',
      frontend: { framework: 'react-vite', styling: 'tailwind', state: 'query', uiExtras: { toast: true, icons: true, forms: true }, dateLib: 'none' },
      backend: { framework: 'fastify', database: 'postgres', orm: 'drizzle', container: true },
      packageManager: 'pnpm',
    });

    expect(TemplateStore.loadSavedTemplates()).toHaveLength(2);

    const deleted = TemplateStore.deleteCustomTemplate('temp-1');
    expect(deleted).toBe(true);

    const remaining = TemplateStore.loadSavedTemplates();
    expect(remaining).toHaveLength(1);
    expect(remaining[0].id).toBe('temp-2');

    const nonExistentDeleted = TemplateStore.deleteCustomTemplate('does-not-exist');
    expect(nonExistentDeleted).toBe(false);
  });

  it('should resolve both curated presets and custom templates with resolveAnyTemplate', () => {
    // 1. Resolve curated preset
    const resolvedCurated = TemplateStore.resolveAnyTemplate('enterprise-monorepo');
    expect(resolvedCurated).toBeDefined();
    expect(resolvedCurated?.source).toBe('curated');
    expect(resolvedCurated?.template.id).toBe('enterprise-monorepo');

    // 2. Resolve custom template
    TemplateStore.saveCustomTemplate('Custom-Worker', 'Worker template', {
      topology: 'distributed-worker',
      frontend: { framework: 'none', styling: 'none', state: 'none', uiExtras: { toast: false, icons: false, forms: false }, dateLib: 'none' },
      backend: { framework: 'none', database: 'none', orm: 'none', container: true, processManager: 'bullmq' },
      queue: 'bullmq',
      packageManager: 'pnpm',
    });

    const resolvedCustom = TemplateStore.resolveAnyTemplate('custom-worker');
    expect(resolvedCustom).toBeDefined();
    expect(resolvedCustom?.source).toBe('custom');
    expect(resolvedCustom?.template.name).toBe('Custom-Worker');

    // 3. Unknown template
    const resolvedUnknown = TemplateStore.resolveAnyTemplate('unknown-template-xyz');
    expect(resolvedUnknown).toBeUndefined();
  });

  it('should include 8 curated templates in CURATED_TEMPLATES list', () => {
    expect(CURATED_TEMPLATES).toHaveLength(8);
    const ids = CURATED_TEMPLATES.map((t) => t.id);
    expect(ids).toContain('enterprise-monorepo');
    expect(ids).toContain('ai-agent-rag');
    expect(ids).toContain('tauri-desktop');
    expect(ids).toContain('nextjs-fullstack');
    expect(ids).toContain('micro-frontend');
    expect(ids).toContain('distributed-worker');
    expect(ids).toContain('standalone-fe');
    expect(ids).toContain('standalone-be');
  });
});
