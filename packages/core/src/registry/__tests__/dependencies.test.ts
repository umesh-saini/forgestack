import { describe, expect, it } from 'vitest';
import {
  DEPENDENCY_REGISTRY,
  getPinnedVersion,
  resolveDependencies,
  type PackageName,
} from '../dependencies.js';

describe('Dependency Registry', () => {
  it('should have strictly pinned semver ranges without wildcards or latest', () => {
    for (const [pkg, version] of Object.entries(DEPENDENCY_REGISTRY)) {
      expect(version).toBeDefined();
      expect(typeof version).toBe('string');
      expect(version.trim().length).toBeGreaterThan(0);

      // Must not use floating wildcards or 'latest'
      expect(version).not.toBe('*');
      expect(version).not.toBe('latest');
      expect(version).not.toContain('beta');

      // Must be valid semver format (starts with ^, ~, or digit)
      expect(version).toMatch(/^(\^|~)?\d+\.\d+\.\d+/);
    }
  });

  it('should contain all required core dependencies defined in Task 1.2', () => {
    const required: PackageName[] = [
      'react',
      '@tanstack/react-query',
      '@reduxjs/toolkit',
      'zustand',
      'tailwindcss',
      'sonner',
      'lucide-react',
      'zod',
      'drizzle-orm',
      'drizzle-kit',
      'pg',
      'mongoose',
      'fastify',
      'express',
      'pino',
      'typescript',
      'turbo',
      'vitest',
      'tsup',
    ];

    for (const dep of required) {
      expect(DEPENDENCY_REGISTRY[dep]).toBeDefined();
      expect(getPinnedVersion(dep)).toBe(DEPENDENCY_REGISTRY[dep]);
    }
  });

  it('should resolve multiple dependencies into a valid package.json dictionary', () => {
    const resolved = resolveDependencies(['react', 'tailwindcss', 'zod']);
    expect(resolved).toEqual({
      react: '^19.0.0',
      tailwindcss: '^4.0.0',
      zod: '^3.24.2',
    });
  });

  it('should throw descriptive error when attempting to resolve uncataloged package', () => {
    expect(() => {
      // @ts-expect-error testing invalid package
      getPinnedVersion('unknown-package-xyz');
    }).toThrowError(/is not registered in the lockstep DEPENDENCY_REGISTRY/);
  });
});
