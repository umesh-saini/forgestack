import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { VirtualFileSystem } from '../vfs.js';

describe('VirtualFileSystem (VFS)', () => {
  it('should stage files in memory with zero physical disk mutations', () => {
    const vfs = new VirtualFileSystem();
    const phantomPath = 'apps/web/src/phantom-test-file.tsx';

    vfs.applyAction({
      type: 'CREATE',
      path: phantomPath,
      content: 'export const Phantom = () => <div>Ghost</div>;',
    });

    expect(vfs.hasFile(phantomPath)).toBe(true);
    expect(vfs.getFileContent(phantomPath)).toContain('<div>Ghost</div>');

    // Verify physical filesystem is completely untouched
    const resolvedDiskPath = path.resolve(process.cwd(), phantomPath);
    expect(fs.existsSync(resolvedDiskPath)).toBe(false);
  });

  it('should throw collision error on duplicate CREATE', () => {
    const vfs = new VirtualFileSystem();
    vfs.applyAction({
      type: 'CREATE',
      path: 'package.json',
      content: '{"name": "root"}',
    });

    expect(() => {
      vfs.applyAction({
        type: 'CREATE',
        path: 'package.json',
        content: '{"name": "collision"}',
      });
    }).toThrowError(/VFS Collision/);
  });

  it('should overwrite file cleanly with OVERWRITE', () => {
    const vfs = new VirtualFileSystem();
    vfs.applyAction({
      type: 'CREATE',
      path: 'README.md',
      content: '# Initial',
    });
    vfs.applyAction({
      type: 'OVERWRITE',
      path: 'README.md',
      content: '# Updated Content',
    });

    expect(vfs.getFileContent('README.md')).toBe('# Updated Content');
  });

  it('should merge JSON objects and arrays deterministically', () => {
    const vfs = new VirtualFileSystem();
    vfs.applyAction({
      type: 'CREATE',
      path: 'package.json',
      content: JSON.stringify({
        name: 'test-app',
        scripts: { build: 'tsc' },
        dependencies: { react: '^19.0.0' },
      }),
    });

    vfs.applyAction({
      type: 'MERGE_JSON',
      path: 'package.json',
      content: {
        scripts: { test: 'vitest' },
        dependencies: { '@tanstack/react-query': '^5.66.0' },
      },
    });

    const parsed = JSON.parse(vfs.getFileContent('package.json')!);
    expect(parsed.name).toBe('test-app');
    expect(parsed.scripts).toEqual({ build: 'tsc', test: 'vitest' });
    expect(parsed.dependencies).toEqual({
      react: '^19.0.0',
      '@tanstack/react-query': '^5.66.0',
    });
  });

  it('should patch files via PATCH_AST slot/function', () => {
    const vfs = new VirtualFileSystem();
    vfs.applyAction({
      type: 'CREATE',
      path: 'src/main.tsx',
      content: '/* FORGESTACK_PROVIDER_SLOT */\n<App />',
    });

    vfs.applyAction({
      type: 'PATCH_AST',
      path: 'src/main.tsx',
      patcher: (content) =>
        content.replace(
          '/* FORGESTACK_PROVIDER_SLOT */',
          '<QueryClientProvider client={client}>'
        ) + '\n</QueryClientProvider>',
    });

    const patched = vfs.getFileContent('src/main.tsx')!;
    expect(patched).toContain('<QueryClientProvider client={client}>');
    expect(patched).toContain('</QueryClientProvider>');
  });

  it('should append content with APPEND', () => {
    const vfs = new VirtualFileSystem();
    vfs.applyAction({
      type: 'CREATE',
      path: '.gitignore',
      content: 'node_modules\n',
    });
    vfs.applyAction({
      type: 'APPEND',
      path: '.gitignore',
      content: '.env\ndist\n',
    });

    expect(vfs.getFileContent('.gitignore')).toBe('node_modules\n.env\ndist\n');
  });

  it('should delete files with DELETE', () => {
    const vfs = new VirtualFileSystem();
    vfs.applyAction({
      type: 'CREATE',
      path: 'temp.txt',
      content: 'delete me',
    });
    expect(vfs.hasFile('temp.txt')).toBe(true);
    vfs.applyAction({ type: 'DELETE', path: 'temp.txt' });
    expect(vfs.hasFile('temp.txt')).toBe(false);
  });

  it('should render correct hierarchical tree with toTree()', () => {
    const vfs = new VirtualFileSystem();
    vfs.applyAction({
      type: 'CREATE',
      path: 'apps/web/src/App.tsx',
      content: 'export default () => null;',
    });
    vfs.applyAction({
      type: 'CREATE',
      path: 'apps/web/package.json',
      content: '{}',
    });
    vfs.applyAction({
      type: 'CREATE',
      path: 'packages/ui/button.tsx',
      content: 'export const Button = () => null;',
    });
    vfs.applyAction({
      type: 'CREATE',
      path: 'README.md',
      content: '# Hello',
    });

    const tree = vfs.toTree();
    expect(tree).toHaveLength(3); // apps, packages, README.md

    const appsNode = tree.find((n) => n.name === 'apps');
    expect(appsNode).toBeDefined();
    expect(appsNode?.type).toBe('directory');

    const readmeNode = tree.find((n) => n.name === 'README.md');
    expect(readmeNode?.type).toBe('file');
  });

  it('should clone VFS independently', () => {
    const vfs1 = new VirtualFileSystem();
    vfs1.applyAction({
      type: 'CREATE',
      path: 'file1.txt',
      content: 'original',
    });

    const vfs2 = vfs1.clone();
    vfs2.applyAction({
      type: 'OVERWRITE',
      path: 'file1.txt',
      content: 'modified',
    });

    expect(vfs1.getFileContent('file1.txt')).toBe('original');
    expect(vfs2.getFileContent('file1.txt')).toBe('modified');
  });
});
