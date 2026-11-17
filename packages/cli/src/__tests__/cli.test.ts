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
});
