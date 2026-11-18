import fs from 'node:fs';
import path from 'node:path';

export interface ResolvedDirectory {
  projectName: string;
  targetPath: string;
  isCurrentDir: boolean;
  isEmpty: boolean;
}

export function resolveProjectDirectory(dirArg?: string): ResolvedDirectory {
  const trimmed = dirArg?.trim();
  const isCurrentDir = trimmed === '.' || trimmed === './';

  let targetPath: string;
  let projectName: string;

  if (isCurrentDir) {
    targetPath = process.cwd();
    projectName = path.basename(targetPath).toLowerCase().replace(/[^a-z0-9-_]/g, '-') || 'my-app';
  } else if (trimmed) {
    targetPath = path.resolve(process.cwd(), trimmed);
    projectName = path.basename(targetPath).toLowerCase().replace(/[^a-z0-9-_]/g, '-') || 'my-app';
  } else {
    targetPath = path.resolve(process.cwd(), 'my-app');
    projectName = 'my-app';
  }

  const exists = fs.existsSync(targetPath);
  let isEmpty = true;
  if (exists) {
    try {
      const files = fs.readdirSync(targetPath);
      isEmpty = files.length === 0;
    } catch {
      isEmpty = false;
    }
  }

  return {
    projectName,
    targetPath,
    isCurrentDir,
    isEmpty,
  };
}

export function validateProjectNameOrDot(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return 'Project name cannot be empty.';
  }
  if (trimmed === '.' || trimmed === './') {
    return undefined;
  }
  if (!/^[a-z0-9-_]+$/.test(trimmed)) {
    return 'Project name must contain only lowercase alphanumeric characters, dashes, or underscores, or "." for current directory.';
  }
  return undefined;
}
