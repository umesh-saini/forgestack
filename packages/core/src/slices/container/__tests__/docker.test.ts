import { describe, expect, it } from 'vitest';
import { VirtualFileSystem } from '../../../vfs/vfs.js';
import { dockerSlice } from '../docker.js';
import type { ProjectConfig } from '../../../types/config.js';

describe('Docker Containerization Slice', () => {
  const postgresConfig: ProjectConfig = {
    name: 'test-app',
    targetPath: './test-app',
    topology: 'monorepo',
    frontend: {
      framework: 'react-vite',
      styling: 'tailwind',
      state: 'query',
      uiExtras: { toast: true, icons: true, forms: true },
    },
    backend: {
      framework: 'fastify',
      database: 'postgres',
      orm: 'drizzle',
      container: true,
    },
    aiGovernance: { rules: true, skills: true, openSpec: true },
    packageManager: 'pnpm',
    git: true,
    install: false,
  };

  it('should generate multi-stage Dockerfile and docker-compose.yml for PostgreSQL', () => {
    const vfs = new VirtualFileSystem();
    dockerSlice.apply(vfs, postgresConfig);

    expect(vfs.hasFile('apps/api/Dockerfile')).toBe(true);
    expect(vfs.hasFile('docker-compose.yml')).toBe(true);

    const dockerfile = vfs.getFileContent('apps/api/Dockerfile')!;
    expect(dockerfile).toContain('FROM node:22-alpine AS base');
    expect(dockerfile).toContain('FROM dependencies AS builder');
    expect(dockerfile).toContain('FROM node:22-alpine AS runner');

    const compose = vfs.getFileContent('docker-compose.yml')!;
    expect(compose).toContain('image: postgres:16-alpine');
    expect(compose).toContain('pg_isready -U postgres');
  });

  it('should generate docker-compose.yml for MongoDB', () => {
    const vfs = new VirtualFileSystem();
    const mongoConfig = {
      ...postgresConfig,
      backend: { ...postgresConfig.backend, database: 'mongodb' as const, orm: 'mongoose' as const },
    };
    dockerSlice.apply(vfs, mongoConfig);

    const compose = vfs.getFileContent('docker-compose.yml')!;
    expect(compose).toContain('image: mongo:7');
    expect(compose).toContain('mongodb:27017');
    expect(compose).toContain('mongosh');
  });
});
