import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createCli } from '../cli.js';
import { TemplateStore } from '../templates/store.js';

describe('ForgeStack CLI Template Presets & Management', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forgestack-cli-template-test-'));
    process.env.FORGESTACK_CONFIG_DIR = tempDir;
  });

  afterEach(() => {
    delete process.env.FORGESTACK_CONFIG_DIR;
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('should scaffold successfully using curated preset --template enterprise-monorepo', async () => {
    const cli = createCli();
    cli.exitOverride();

    await expect(
      cli.parseAsync([
        'node',
        'create-forgestack-app',
        'test-enterprise-app',
        '--template',
        'enterprise-monorepo',
        '--dry-run',
      ])
    ).resolves.toBeDefined();
  });

  it('should scaffold successfully using curated preset -t ai-agent-rag', async () => {
    const cli = createCli();
    cli.exitOverride();

    await expect(
      cli.parseAsync([
        'node',
        'create-forgestack-app',
        'test-ai-app',
        '-t',
        'ai-agent-rag',
        '--dry-run',
      ])
    ).resolves.toBeDefined();
  });

  it('should scaffold successfully using curated preset -t tauri-desktop', async () => {
    const cli = createCli();
    cli.exitOverride();

    await expect(
      cli.parseAsync([
        'node',
        'create-forgestack-app',
        'test-tauri-app',
        '-t',
        'tauri-desktop',
        '--dry-run',
      ])
    ).resolves.toBeDefined();
  });

  it('should scaffold successfully using curated preset -t nextjs-fullstack', async () => {
    const cli = createCli();
    cli.exitOverride();

    await expect(
      cli.parseAsync([
        'node',
        'create-forgestack-app',
        'test-next-app',
        '-t',
        'nextjs-fullstack',
        '--dry-run',
      ])
    ).resolves.toBeDefined();
  });

  it('should fail with actionable message when passing unknown --template', async () => {
    const cli = createCli();
    cli.exitOverride();

    await expect(
      cli.parseAsync([
        'node',
        'create-forgestack-app',
        'test-unknown',
        '--template',
        'invalid-preset-xyz',
        '--dry-run',
      ])
    ).rejects.toThrow(/Template "invalid-preset-xyz" not found/);
  });

  it('should save custom template via --save-template and instantiate it via --template', async () => {
    const cliSave = createCli();
    cliSave.exitOverride();

    // 1. Scaffold and save custom template
    await cliSave.parseAsync([
      'node',
      'create-forgestack-app',
      'my-custom-app',
      '--topology',
      'standalone-be',
      '--be',
      'fastify',
      '--db',
      'postgres',
      '--orm',
      'drizzle',
      '--save-template',
      'team-backend-preset',
      '--dry-run',
    ]);

    const saved = TemplateStore.findCustomTemplate('team-backend-preset');
    expect(saved).toBeDefined();
    expect(saved?.id).toBe('team-backend-preset');
    expect(saved?.config.topology).toBe('standalone-be');

    // 2. Instantiate new project referencing the saved template
    const cliInstantiate = createCli();
    cliInstantiate.exitOverride();

    await expect(
      cliInstantiate.parseAsync([
        'node',
        'create-forgestack-app',
        'new-api-service',
        '--template',
        'team-backend-preset',
        '--dry-run',
      ])
    ).resolves.toBeDefined();
  });

  it('should execute template list subcommand without errors', async () => {
    const cli = createCli();
    cli.exitOverride();

    // Add a custom template to verify it appears in list
    TemplateStore.saveCustomTemplate('Demo-Custom', 'Demo description', {
      topology: 'standalone-fe',
      frontend: { framework: 'react-vite', styling: 'tailwind', state: 'query', uiExtras: { toast: true, icons: true, forms: true }, dateLib: 'none' },
      backend: { framework: 'none', database: 'none', orm: 'none', container: false },
      packageManager: 'pnpm',
    });

    await expect(
      cli.parseAsync(['node', 'create-forgestack-app', 'template', 'list'])
    ).resolves.toBeDefined();
  });

  it('should prevent deleting built-in curated presets', async () => {
    const cli = createCli();
    cli.exitOverride();

    await expect(
      cli.parseAsync(['node', 'create-forgestack-app', 'template', 'delete', 'enterprise-monorepo'])
    ).rejects.toThrow(/Cannot delete built-in curated preset/);
  });

  it('should fail when deleting non-existent custom template', async () => {
    const cli = createCli();
    cli.exitOverride();

    await expect(
      cli.parseAsync(['node', 'create-forgestack-app', 'template', 'delete', 'ghost-template'])
    ).rejects.toThrow(/Custom template "ghost-template" not found/);
  });

  it('should successfully delete an existing custom template', async () => {
    TemplateStore.saveCustomTemplate('To-Delete', 'Will be deleted', {
      topology: 'monorepo',
      frontend: { framework: 'react-vite', styling: 'tailwind', state: 'query', uiExtras: { toast: true, icons: true, forms: true }, dateLib: 'none' },
      backend: { framework: 'fastify', database: 'postgres', orm: 'drizzle', container: true },
      packageManager: 'pnpm',
    });

    expect(TemplateStore.findCustomTemplate('to-delete')).toBeDefined();

    const cli = createCli();
    cli.exitOverride();

    await expect(
      cli.parseAsync(['node', 'create-forgestack-app', 'template', 'delete', 'to-delete'])
    ).resolves.toBeDefined();

    expect(TemplateStore.findCustomTemplate('to-delete')).toBeUndefined();
  });
});
