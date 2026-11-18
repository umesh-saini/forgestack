import { describe, expect, it } from 'vitest';
import path from 'node:path';
import {
  resolveProjectDirectory,
  validateProjectNameOrDot,
} from '../utils/directory.js';

describe('CLI Directory & Path Resolver', () => {
  it('should resolve named project directory to absolute path', () => {
    const resolved = resolveProjectDirectory('cool-project');
    expect(resolved.projectName).toBe('cool-project');
    expect(resolved.targetPath).toBe(path.resolve(process.cwd(), 'cool-project'));
    expect(resolved.isCurrentDir).toBe(false);
  });

  it('should resolve dot "." to process.cwd() and use current folder basename as project name', () => {
    const resolved = resolveProjectDirectory('.');
    expect(resolved.targetPath).toBe(process.cwd());
    expect(resolved.isCurrentDir).toBe(true);
    expect(resolved.projectName).toBe(
      path.basename(process.cwd()).toLowerCase().replace(/[^a-z0-9-_]/g, '-')
    );
  });

  it('should resolve dot slash "./" identically to dot "."', () => {
    const resolved = resolveProjectDirectory('./');
    expect(resolved.targetPath).toBe(process.cwd());
    expect(resolved.isCurrentDir).toBe(true);
  });

  it('should default to "my-app" when no directory argument is passed', () => {
    const resolved = resolveProjectDirectory();
    expect(resolved.projectName).toBe('my-app');
    expect(resolved.targetPath).toBe(path.resolve(process.cwd(), 'my-app'));
    expect(resolved.isCurrentDir).toBe(false);
  });

  it('should correctly detect non-empty directory for current working directory', () => {
    const resolved = resolveProjectDirectory('.');
    expect(resolved.isEmpty).toBe(false); // Current repo has files
  });

  describe('validateProjectNameOrDot', () => {
    it('should accept "." as valid project target', () => {
      expect(validateProjectNameOrDot('.')).toBeUndefined();
      expect(validateProjectNameOrDot('./')).toBeUndefined();
    });

    it('should accept valid alphanumeric and kebab-case project names', () => {
      expect(validateProjectNameOrDot('my-app')).toBeUndefined();
      expect(validateProjectNameOrDot('enterprise_core_123')).toBeUndefined();
    });

    it('should reject empty or whitespace input', () => {
      expect(validateProjectNameOrDot('')).toBe('Project name cannot be empty.');
      expect(validateProjectNameOrDot('   ')).toBe('Project name cannot be empty.');
    });

    it('should reject invalid special characters in project name', () => {
      expect(validateProjectNameOrDot('my app with spaces')).toContain('alphanumeric');
      expect(validateProjectNameOrDot('my-app@company')).toContain('alphanumeric');
    });
  });
});
