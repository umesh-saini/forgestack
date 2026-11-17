import fs from 'node:fs';
import path from 'node:path';
import type { VirtualFileSystem } from '../vfs/vfs.js';

export interface FlushOptions {
  force?: boolean;
  dryRun?: boolean;
  onProgress?: (action: 'CREATE_DIR' | 'WRITE_FILE', relativePath: string) => void;
}

export interface FlushResult {
  targetPath: string;
  filesWritten: number;
  directoriesCreated: number;
  writtenPaths: string[];
}

export class TransactionalFlusher {
  /**
   * Performs pre-flight checks on destination:
   * 1. Checks if path is writeable.
   * 2. Checks if directory exists and is empty (unless force is true).
   */
  public static async preflight(
    targetPath: string,
    options: FlushOptions = {}
  ): Promise<void> {
    const resolvedPath = path.resolve(targetPath);

    if (fs.existsSync(resolvedPath)) {
      const stats = await fs.promises.stat(resolvedPath);
      if (!stats.isDirectory()) {
        throw new Error(
          `Target path '${resolvedPath}' exists and is a file, not a directory.`
        );
      }

      const contents = await fs.promises.readdir(resolvedPath);
      if (contents.length > 0 && !options.force) {
        throw new Error(
          `Target directory '${resolvedPath}' is not empty. Choose an empty directory or use --force.`
        );
      }

      // Check write access
      try {
        await fs.promises.access(resolvedPath, fs.constants.W_OK);
      } catch {
        throw new Error(
          `Target directory '${resolvedPath}' is not writeable. Check user permissions.`
        );
      }
    } else {
      // Check parent directory write access
      const parentDir = path.dirname(resolvedPath);
      try {
        await fs.promises.access(parentDir, fs.constants.W_OK);
      } catch {
        throw new Error(
          `Parent directory '${parentDir}' is not writeable. Cannot create target project directory.`
        );
      }
    }
  }

  /**
   * Flushes VirtualFileSystem files to disk inside a transactional rollback boundary.
   */
  public static async flush(
    vfs: VirtualFileSystem,
    targetPath: string,
    options: FlushOptions = {}
  ): Promise<FlushResult> {
    const resolvedPath = path.resolve(targetPath);
    await this.preflight(resolvedPath, options);

    if (options.dryRun) {
      return {
        targetPath: resolvedPath,
        filesWritten: vfs.count(),
        directoriesCreated: 0,
        writtenPaths: vfs.getAllFiles().map((f) => f.path),
      };
    }

    const createdFiles: string[] = [];
    const createdDirs: string[] = [];
    const targetDirExistedBefore = fs.existsSync(resolvedPath);

    try {
      if (!targetDirExistedBefore) {
        await fs.promises.mkdir(resolvedPath, { recursive: true });
        createdDirs.push(resolvedPath);
      }

      const files = vfs.getAllFiles();

      for (const vFile of files) {
        const fullFilePath = path.join(resolvedPath, vFile.path);
        const fileDir = path.dirname(fullFilePath);

        if (!fs.existsSync(fileDir)) {
          await fs.promises.mkdir(fileDir, { recursive: true });
          if (!createdDirs.includes(fileDir)) {
            createdDirs.push(fileDir);
          }
          options.onProgress?.('CREATE_DIR', path.relative(resolvedPath, fileDir));
        }

        await fs.promises.writeFile(fullFilePath, vFile.content, {
          encoding: vFile.encoding || 'utf-8',
          mode: vFile.executable ? 0o755 : 0o644,
        });

        createdFiles.push(fullFilePath);
        options.onProgress?.('WRITE_FILE', vFile.path);
      }

      return {
        targetPath: resolvedPath,
        filesWritten: createdFiles.length,
        directoriesCreated: createdDirs.length,
        writtenPaths: files.map((f) => f.path),
      };
    } catch (error) {
      // Trigger rollback routine
      await this.rollback(createdFiles, createdDirs, targetDirExistedBefore, resolvedPath);
      throw new Error(
        `Transactional Flush Failed: ${(error as Error).message}. All partially written files have been rolled back.`
      );
    }
  }

  /**
   * Rolls back disk mutations by deleting all written files and created directories.
   */
  private static async rollback(
    createdFiles: string[],
    createdDirs: string[],
    targetDirExistedBefore: boolean,
    resolvedTargetRoot: string
  ): Promise<void> {
    // 1. Delete all created files
    for (const filePath of createdFiles) {
      try {
        if (fs.existsSync(filePath)) {
          await fs.promises.unlink(filePath);
        }
      } catch {
        // Continue cleaning other files even if one fails
      }
    }

    // 2. Delete created directories in reverse order (deepest first)
    const sortedDirs = [...createdDirs].sort((a, b) => b.length - a.length);
    for (const dirPath of sortedDirs) {
      try {
        if (fs.existsSync(dirPath)) {
          const files = await fs.promises.readdir(dirPath);
          if (files.length === 0) {
            await fs.promises.rmdir(dirPath);
          }
        }
      } catch {
        // Ignore
      }
    }

    // 3. Remove root directory if it didn't exist before and is now empty
    if (!targetDirExistedBefore && fs.existsSync(resolvedTargetRoot)) {
      try {
        const remaining = await fs.promises.readdir(resolvedTargetRoot);
        if (remaining.length === 0) {
          await fs.promises.rmdir(resolvedTargetRoot);
        }
      } catch {
        // Ignore
      }
    }
  }
}
