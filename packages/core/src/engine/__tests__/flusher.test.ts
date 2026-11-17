import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { VirtualFileSystem } from '../../vfs/vfs.js';
import { TransactionalFlusher } from '../flusher.js';

describe('TransactionalFlusher', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'forgestack-test-'));
  });

  afterEach(async () => {
    if (fs.existsSync(tempDir)) {
      await fs.promises.rm(tempDir, { recursive: true, force: true });
    }
  });

  it('should successfully flush virtual files to disk', async () => {
    const vfs = new VirtualFileSystem();
    vfs.applyAction({
      type: 'CREATE',
      path: 'package.json',
      content: '{"name": "test"}',
    });
    vfs.applyAction({
      type: 'CREATE',
      path: 'src/index.ts',
      content: 'console.log("hello");',
    });

    const target = path.join(tempDir, 'my-project');
    const result = await TransactionalFlusher.flush(vfs, target);

    expect(result.filesWritten).toBe(2);
    expect(fs.existsSync(path.join(target, 'package.json'))).toBe(true);
    expect(fs.existsSync(path.join(target, 'src/index.ts'))).toBe(true);
    expect(
      await fs.promises.readFile(path.join(target, 'src/index.ts'), 'utf-8')
    ).toBe('console.log("hello");');
  });

  it('should reject non-empty directory without force flag', async () => {
    const target = path.join(tempDir, 'existing-dir');
    await fs.promises.mkdir(target);
    await fs.promises.writeFile(path.join(target, 'legacy.txt'), 'old data');

    const vfs = new VirtualFileSystem();
    vfs.applyAction({
      type: 'CREATE',
      path: 'test.txt',
      content: 'new',
    });

    await expect(
      TransactionalFlusher.flush(vfs, target, { force: false })
    ).rejects.toThrowError(/is not empty/);

    // Should succeed with force: true
    await expect(
      TransactionalFlusher.flush(vfs, target, { force: true })
    ).resolves.toBeDefined();
  });

  it('should trigger rollback and clean up all files if a write fails', async () => {
    const target = path.join(tempDir, 'rollback-test');
    const vfs = new VirtualFileSystem();

    vfs.applyAction({
      type: 'CREATE',
      path: 'valid1.txt',
      content: 'ok',
    });
    vfs.applyAction({
      type: 'CREATE',
      path: 'valid2.txt',
      content: 'ok',
    });
    // Create an invalid path that will fail when writing on Linux/Unix (e.g. file inside a file path)
    vfs.applyAction({
      type: 'CREATE',
      path: 'valid1.txt/impossible-nested.txt',
      content: 'fail',
    });

    await expect(
      TransactionalFlusher.flush(vfs, target)
    ).rejects.toThrowError(/Transactional Flush Failed/);

    // Verify rollback deleted valid1.txt and target directory if created
    expect(fs.existsSync(path.join(target, 'valid1.txt'))).toBe(false);
    expect(fs.existsSync(path.join(target, 'valid2.txt'))).toBe(false);
  });

  it('should support dry-run mode without touching physical disk', async () => {
    const target = path.join(tempDir, 'dry-run-test');
    const vfs = new VirtualFileSystem();
    vfs.applyAction({
      type: 'CREATE',
      path: 'sample.txt',
      content: 'content',
    });

    const result = await TransactionalFlusher.flush(vfs, target, { dryRun: true });
    expect(result.filesWritten).toBe(1);
    expect(fs.existsSync(target)).toBe(false);
  });
});
