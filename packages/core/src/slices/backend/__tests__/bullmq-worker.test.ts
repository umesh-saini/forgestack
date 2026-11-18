import { describe, expect, it } from 'vitest';
import { generateProjectVfs } from '../../../engine/create-pipeline.js';
import type { ProjectConfig } from '../../../types/config.js';

describe('BullMQ Worker & Redis Queue Slice', () => {
  it('should scaffold BullMQ worker, queue, and docker-compose redis service when processManager is bullmq', async () => {
    const config: ProjectConfig = {
      name: 'bullmq-worker-test',
      targetPath: '/test/bullmq-worker-test',
      topology: 'standalone-be',
      frontend: {
        framework: 'none',
        styling: 'none',
        state: 'none',
        uiExtras: { toast: false, icons: false, forms: false },
      },
      backend: {
        framework: 'fastify',
        database: 'postgres',
        orm: 'drizzle',
        container: true,
        processManager: 'bullmq',
      },
      aiGovernance: { rules: true, skills: true, openSpec: true },
      packageManager: 'pnpm',
      git: true,
      install: false,
    };

    const vfs = await generateProjectVfs(config);

    // Dependencies and Scripts
    const pkg = JSON.parse(vfs.getFileContent('package.json')!);
    expect(pkg.dependencies.bullmq).toBeDefined();
    expect(pkg.dependencies.ioredis).toBeDefined();
    expect(pkg.scripts.worker).toBe('tsx watch src/worker.ts');
    expect(pkg.scripts['worker:build']).toBe('tsup src/worker.ts --format esm --clean');

    // Queue modules
    expect(vfs.hasFile('src/queue/connection.ts')).toBe(true);
    expect(vfs.hasFile('src/queue/task-queue.ts')).toBe(true);

    const taskQueueContent = vfs.getFileContent('src/queue/task-queue.ts')!;
    expect(taskQueueContent).toContain("new Queue<TaskJobData>('default-queue'");

    // Worker file
    expect(vfs.hasFile('src/worker.ts')).toBe(true);
    const workerContent = vfs.getFileContent('src/worker.ts')!;
    expect(workerContent).toContain("new Worker<TaskJobData>");
    expect(workerContent).toContain("concurrency: 5");
    expect(workerContent).toContain("process.on('SIGTERM'");
    expect(workerContent).toContain("process.on('SIGINT'");

    // docker-compose.yml with Redis
    expect(vfs.hasFile('docker-compose.yml')).toBe(true);
    const composeContent = vfs.getFileContent('docker-compose.yml')!;
    expect(composeContent).toContain('redis:');
    expect(composeContent).toContain('image: redis:7-alpine');
    expect(composeContent).toContain('redis_data:');

    // .env.example
    const envContent = vfs.getFileContent('.env.example')!;
    expect(envContent).toContain('REDIS_URL=redis://localhost:6379');
  });

  it('should scaffold BullMQ worker in monorepo when queue is bullmq', async () => {
    const config: ProjectConfig = {
      name: 'monorepo-worker-test',
      targetPath: '/test/monorepo-worker-test',
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
      queue: 'bullmq',
      aiGovernance: { rules: true, skills: true, openSpec: true },
      packageManager: 'pnpm',
      git: true,
      install: false,
    };

    const vfs = await generateProjectVfs(config);

    const apiPkg = JSON.parse(vfs.getFileContent('apps/api/package.json')!);
    expect(apiPkg.dependencies.bullmq).toBeDefined();
    expect(apiPkg.dependencies.ioredis).toBeDefined();

    expect(vfs.hasFile('apps/api/src/worker.ts')).toBe(true);
    expect(vfs.hasFile('apps/api/src/queue/task-queue.ts')).toBe(true);
  });

  it('should not scaffold worker files when neither bullmq nor distributed-worker topology is selected', async () => {
    const config: ProjectConfig = {
      name: 'noworker-test',
      targetPath: '/test/noworker-test',
      topology: 'standalone-be',
      frontend: {
        framework: 'none',
        styling: 'none',
        state: 'none',
        uiExtras: { toast: false, icons: false, forms: false },
      },
      backend: {
        framework: 'fastify',
        database: 'postgres',
        orm: 'drizzle',
        container: true,
        processManager: 'docker',
      },
      aiGovernance: { rules: true, skills: true, openSpec: true },
      packageManager: 'pnpm',
      git: true,
      install: false,
    };

    const vfs = await generateProjectVfs(config);

    expect(vfs.hasFile('src/worker.ts')).toBe(false);
    expect(vfs.hasFile('src/queue/task-queue.ts')).toBe(false);
  });
});
