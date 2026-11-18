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
});
