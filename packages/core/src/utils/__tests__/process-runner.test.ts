import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ProcessRunner } from '../process-runner.js';

describe('ProcessRunner Utility', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'forgestack-proc-'));
  });

  afterEach(async () => {
    if (fs.existsSync(tempDir)) {
      await fs.promises.rm(tempDir, { recursive: true, force: true });
    }
  });

  it('should run a command and capture stdout streaming', async () => {
    let captured = '';
    const result = await ProcessRunner.run('node', ['-e', 'console.log("hello-from-node")'], {
      onStdout: (chunk) => {
        captured += chunk;
      },
    });

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('hello-from-node');
    expect(captured).toContain('hello-from-node');
  });

  it('should reject with descriptive error on non-zero exit code', async () => {
    await expect(
      ProcessRunner.run('node', ['-e', 'process.exit(42)'])
    ).rejects.toThrowError(/exited with code 42/);
  });

  it('should initialize git and commit in temporary directory', async () => {
    await fs.promises.writeFile(path.join(tempDir, 'README.md'), '# Test Project');

    const logs: string[] = [];
    await ProcessRunner.initGit(tempDir, (msg) => logs.push(msg));

    expect(fs.existsSync(path.join(tempDir, '.git'))).toBe(true);

    const logResult = await ProcessRunner.run('git', ['log', '--oneline'], {
      cwd: tempDir,
    });
    expect(logResult.stdout).toContain('initial scaffold by ForgeStack');
  });
});
