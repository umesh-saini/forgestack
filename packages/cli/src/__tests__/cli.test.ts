import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { createCli } from '../cli.js';

describe('ForgeStack CLI', () => {
  it('should initialize commander CLI program with all expected options', () => {
    const cli = createCli();
    expect(cli.name()).toBe('create-forgestack-app');

    const optionNames = cli.options.map((o) => o.attributeName());
    expect(optionNames).toContain('topology');
    expect(optionNames).toContain('fe');
    expect(optionNames).toContain('be');
    expect(optionNames).toContain('db');
    expect(optionNames).toContain('orm');
    expect(optionNames).toContain('auth');
    expect(optionNames).toContain('rpc');
    expect(optionNames).toContain('queue');
    expect(optionNames).toContain('testing');
    expect(optionNames).toContain('ci');
    expect(optionNames).toContain('linter');
    expect(optionNames).toContain('deploy');
    expect(optionNames).toContain('mcp');
    expect(optionNames).toContain('dryRun');
  });

  it('should exit with error on incompatible database and ORM combination', async () => {
    const cli = createCli();
    cli.exitOverride();

    await expect(
      cli.parseAsync([
        'node',
        'create-forgestack-app',
        'test-fail-app',
        '--topology',
        'monorepo',
        '--db',
        'mongodb',
        '--orm',
        'drizzle',
        '--dry-run',
      ])
    ).rejects.toThrow();
  });

  it('should exit with error when tRPC is configured outside a monorepo', async () => {
    const cli = createCli();
    cli.exitOverride();

    await expect(
      cli.parseAsync([
        'node',
        'create-forgestack-app',
        'test-fail-trpc',
        '--topology',
        'standalone-be',
        '--rpc',
        'trpc',
        '--dry-run',
      ])
    ).rejects.toThrow(/tRPC requires a monorepo topology/);
  });

  it('should successfully dry-run scaffold AI Agent RAG archetype with flags', async () => {
    const cli = createCli();
    cli.exitOverride();

    await expect(
      cli.parseAsync([
        'node',
        'create-forgestack-app',
        'test-ai-app',
        '--topology',
        'ai-agent-rag',
        '--auth',
        'better-auth',
        '--rpc',
        'trpc',
        '--testing',
        'playwright',
        '--ci',
        'github-actions',
        '--dry-run',
      ])
    ).resolves.toBeDefined();
  });

  it('should successfully dry-run scaffold Tauri v2 desktop archetype with flags', async () => {
    const cli = createCli();
    cli.exitOverride();

    await expect(
      cli.parseAsync([
        'node',
        'create-forgestack-app',
        'test-tauri-app',
        '--topology',
        'tauri-desktop',
        '--dry-run',
      ])
    ).resolves.toBeDefined();
  });

  it('should successfully dry-run scaffold with --yes flag', async () => {
    const cli = createCli();
    cli.exitOverride();

    await expect(
      cli.parseAsync([
        'node',
        'create-forgestack-app',
        'test-yes-app',
        '--yes',
        '--dry-run',
      ])
    ).resolves.toBeDefined();
  });

  it('should successfully dry-run scaffold into current directory with "." and --force', async () => {
    const cli = createCli();
    cli.exitOverride();

    await expect(
      cli.parseAsync([
        'node',
        'create-forgestack-app',
        '.',
        '--yes',
        '--force',
        '--dry-run',
      ])
    ).resolves.toBeDefined();
  });

  it('should throw error when non-empty directory is targeted without --force in non-interactive mode', async () => {
    const cli = createCli();
    cli.exitOverride();

    await expect(
      cli.parseAsync([
        'node',
        'create-forgestack-app',
        '.',
        '--yes',
        '--dry-run',
      ])
    ).rejects.toThrow(/is not empty/);
  });

  it('should accept --linter biome and --deploy vercel options in dry-run mode', async () => {
    const cli = createCli();
    cli.exitOverride();

    await expect(
      cli.parseAsync([
        'node',
        'create-forgestack-app',
        'test-biome-vercel',
        '--topology',
        'standalone-fe',
        '--linter',
        'biome',
        '--deploy',
        'vercel',
        '--force',
        '--dry-run',
      ])
    ).resolves.toBeDefined();
  });

  it('should support init-skills with --tools flag', async () => {
    const cli = createCli();
    cli.exitOverride();
    // Write into a temp dir — without a [dir] arg this would provision into the repo itself.
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'forgestack-init-skills-'));

    try {
      await expect(
        cli.parseAsync([
          'node',
          'create-forgestack-app',
          'init-skills',
          dir,
          '--tools',
          'cursor,claude',
        ])
      ).resolves.toBeDefined();
      expect(fs.existsSync(path.join(dir, '.cursor'))).toBe(true);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
