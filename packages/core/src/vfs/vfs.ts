import type { FileAction, TreeNode, VirtualFile } from './types.js';

export class VirtualFileSystem {
  private files: Map<string, VirtualFile> = new Map();

  /**
   * Normalizes relative file paths: strips leading slashes and resolves './'
   */
  public normalizePath(filePath: string): string {
    return filePath
      .replace(/\\/g, '/')
      .replace(/^\/+/, '')
      .replace(/^\.\//, '');
  }

  /**
   * Dispatches and applies a single atomic file action to the virtual file system.
   */
  public applyAction(action: FileAction): void {
    const targetPath = this.normalizePath(action.path);

    switch (action.type) {
      case 'CREATE': {
        if (this.files.has(targetPath)) {
          throw new Error(
            `VFS Collision: File already exists at '${targetPath}'. Use OVERWRITE or a custom merger.`
          );
        }
        this.files.set(targetPath, {
          path: targetPath,
          content: action.content,
          executable: action.executable ?? false,
        });
        break;
      }

      case 'OVERWRITE': {
        this.files.set(targetPath, {
          path: targetPath,
          content: action.content,
          executable: action.executable ?? false,
        });
        break;
      }

      case 'MERGE_JSON': {
        const incoming =
          typeof action.content === 'string'
            ? JSON.parse(action.content)
            : action.content;

        const existing = this.files.get(targetPath);
        if (!existing) {
          this.files.set(targetPath, {
            path: targetPath,
            content: JSON.stringify(incoming, null, 2) + '\n',
          });
          return;
        }

        let existingObj: Record<string, unknown> = {};
        try {
          existingObj = JSON.parse(existing.content);
        } catch (e) {
          throw new Error(
            `Failed to parse existing file as JSON at '${targetPath}': ${(e as Error).message}`
          );
        }

        let merged: Record<string, unknown>;
        if (action.merger) {
          merged = action.merger(existingObj, incoming);
        } else {
          merged = this.defaultJsonMerge(existingObj, incoming);
        }

        this.files.set(targetPath, {
          ...existing,
          content: JSON.stringify(merged, null, 2) + '\n',
        });
        break;
      }

      case 'PATCH_AST': {
        const existing = this.files.get(targetPath);
        if (!existing) {
          throw new Error(
            `Cannot patch non-existent file at '${targetPath}'. Create it first.`
          );
        }
        const patchedContent = action.patcher(existing.content);
        this.files.set(targetPath, {
          ...existing,
          content: patchedContent,
        });
        break;
      }

      case 'APPEND': {
        const existing = this.files.get(targetPath);
        if (!existing) {
          this.files.set(targetPath, {
            path: targetPath,
            content: action.content,
          });
        } else {
          this.files.set(targetPath, {
            ...existing,
            content: existing.content + action.content,
          });
        }
        break;
      }

      case 'DELETE': {
        this.files.delete(targetPath);
        break;
      }

      default: {
        const unhandled: never = action;
        throw new Error(`Unhandled file action: ${JSON.stringify(unhandled)}`);
      }
    }
  }

  /**
   * Applies an array of file actions in sequence.
   */
  public applyActions(actions: FileAction[]): void {
    for (const action of actions) {
      this.applyAction(action);
    }
  }

  public getFile(filePath: string): VirtualFile | undefined {
    return this.files.get(this.normalizePath(filePath));
  }

  public getFileContent(filePath: string): string | undefined {
    return this.getFile(filePath)?.content;
  }

  public hasFile(filePath: string): boolean {
    return this.files.has(this.normalizePath(filePath));
  }

  public deleteFile(filePath: string): boolean {
    return this.files.delete(this.normalizePath(filePath));
  }

  public getAllFiles(): VirtualFile[] {
    return Array.from(this.files.values()).sort((a, b) =>
      a.path.localeCompare(b.path)
    );
  }

  public count(): number {
    return this.files.size;
  }

  public clear(): void {
    this.files.clear();
  }

  public clone(): VirtualFileSystem {
    const cloneVfs = new VirtualFileSystem();
    for (const [key, value] of this.files.entries()) {
      cloneVfs.files.set(key, { ...value });
    }
    return cloneVfs;
  }

  /**
   * Generates a hierarchical tree representation suitable for UI rendering
   */
  public toTree(): TreeNode[] {
    const rootNodes: TreeNode[] = [];

    for (const file of this.getAllFiles()) {
      const parts = file.path.split('/');
      let currentLevel = rootNodes;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i]!;
        const isFile = i === parts.length - 1;
        const currentPath = parts.slice(0, i + 1).join('/');

        let existing = currentLevel.find((node) => node.name === part);

        if (!existing) {
          existing = {
            name: part,
            path: currentPath,
            type: isFile ? 'file' : 'directory',
            ...(isFile
              ? {
                  size:
                    typeof TextEncoder !== 'undefined'
                      ? new TextEncoder().encode(file.content).length
                      : typeof Buffer !== 'undefined'
                      ? Buffer.byteLength(file.content, 'utf-8')
                      : file.content.length,
                }
              : { children: [] }),
          };
          currentLevel.push(existing);
        }

        if (!isFile && existing.children) {
          currentLevel = existing.children;
        }
      }
    }

    const sortNodes = (nodes: TreeNode[]): TreeNode[] => {
      nodes.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'directory' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
      for (const node of nodes) {
        if (node.children) {
          sortNodes(node.children);
        }
      }
      return nodes;
    };

    return sortNodes(rootNodes);
  }

  private defaultJsonMerge(
    target: Record<string, unknown>,
    source: Record<string, unknown>
  ): Record<string, unknown> {
    const output = { ...target };
    for (const key of Object.keys(source)) {
      const sourceVal = source[key];
      const targetVal = output[key];

      if (
        sourceVal &&
        typeof sourceVal === 'object' &&
        !Array.isArray(sourceVal) &&
        targetVal &&
        typeof targetVal === 'object' &&
        !Array.isArray(targetVal)
      ) {
        output[key] = this.defaultJsonMerge(
          targetVal as Record<string, unknown>,
          sourceVal as Record<string, unknown>
        );
      } else if (Array.isArray(sourceVal) && Array.isArray(targetVal)) {
        // Merge arrays uniquely
        const set = new Set([...targetVal, ...sourceVal]);
        output[key] = Array.from(set);
      } else {
        output[key] = sourceVal;
      }
    }
    return output;
  }
}
