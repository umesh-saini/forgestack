import type { FeatureSlice } from '../../engine/compositor.js';
import { DEPENDENCY_REGISTRY } from '../../registry/dependencies.js';
import type { ProjectConfig } from '../../types/config.js';
import type { VirtualFileSystem } from '../../vfs/vfs.js';
import { layoutFor } from '../../utils/layout.js';

export const bullmqWorkerSlice: FeatureSlice = {
  id: 'backend-bullmq-worker',
  name: 'BullMQ Distributed Background Worker & Redis Queue',
  apply: (vfs: VirtualFileSystem, config: ProjectConfig) => {
    const isEligible =
      config.topology === 'distributed-worker' ||
      config.backend.processManager === 'bullmq' ||
      config.queue === 'bullmq';

    if (!isEligible) {
      return;
    }

    const resolvePath = layoutFor(config).be;

    // 1. Dependencies and worker scripts in backend package.json
    vfs.applyAction({
      type: 'MERGE_JSON',
      path: resolvePath('package.json'),
      content: {
        dependencies: {
          bullmq: DEPENDENCY_REGISTRY.bullmq,
          ioredis: DEPENDENCY_REGISTRY.ioredis,
        },
        scripts: {
          worker: 'tsx watch src/worker.ts',
          'worker:build': 'tsup src/worker.ts --format esm --clean',
        },
        devDependencies: {
          tsup: DEPENDENCY_REGISTRY.tsup,
        },
      },
    });

    // 2. src/queue/connection.ts
    vfs.applyAction({
      type: 'CREATE',
      path: resolvePath('src/queue/connection.ts'),
      content: `import { Redis } from 'ioredis';

export const redisConnection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

redisConnection.on('connect', () => {
  console.log('Successfully connected to Redis instance');
});

redisConnection.on('error', (err) => {
  console.error('Redis connection error:', err);
});
`,
    });

    // 3. src/queue/task-queue.ts
    vfs.applyAction({
      type: 'CREATE',
      path: resolvePath('src/queue/task-queue.ts'),
      content: `import { Queue } from 'bullmq';
import { redisConnection } from './connection.js';

export interface TaskJobData {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  timestamp?: string;
}

export const defaultQueue = new Queue<TaskJobData>('default-queue', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: 100,
  },
});

export async function dispatchTask(type: string, payload: Record<string, unknown>) {
  return defaultQueue.add(type, {
    id: crypto.randomUUID(),
    type,
    payload,
    timestamp: new Date().toISOString(),
  });
}
`,
    });

    // 4. src/worker.ts with worker processor, error listeners, and shutdown hooks
    vfs.applyAction({
      type: 'CREATE',
      path: resolvePath('src/worker.ts'),
      content: `import { Worker, type Job } from 'bullmq';
import { redisConnection } from './queue/connection.js';
import type { TaskJobData } from './queue/task-queue.js';

console.log('Starting BullMQ distributed background worker...');

export const worker = new Worker<TaskJobData>(
  'default-queue',
  async (job: Job<TaskJobData>) => {
    console.log(\`Processing job \${job.id} of type \${job.data.type}\`);
    const { id, type, payload } = job.data;

    // Simulate task processing
    await new Promise((resolve) => setTimeout(resolve, 100));

    return {
      status: 'completed',
      jobId: job.id,
      taskId: id,
      type,
      completedAt: new Date().toISOString(),
    };
  },
  {
    connection: redisConnection,
    concurrency: 5,
  }
);

worker.on('completed', (job) => {
  console.log(\`Job \${job.id} completed successfully\`);
});

worker.on('failed', (job, err) => {
  console.error(\`Job \${job?.id} failed with error:\`, err);
});

worker.on('error', (err) => {
  console.error('BullMQ worker internal error:', err);
});

// Graceful shutdown hooks
const shutdown = async (signal: string) => {
  console.log(\`Received \${signal}. Gracefully stopping BullMQ worker...\`);
  await worker.close();
  await redisConnection.quit();
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
`,
    });

    // 5. Environment variable injection
    const envSnippet = `\n# Redis Cache & Task Queue\nREDIS_URL=redis://localhost:6379\n`;
    const envPath = resolvePath('.env.example');
    if (vfs.hasFile(envPath)) {
      vfs.applyAction({
        type: 'APPEND',
        path: envPath,
        content: envSnippet,
      });
    }

    // 6. Stage docker-compose.yml with Redis service
    const dockerComposePath = 'docker-compose.yml';
    const redisServiceSnippet = `
  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 5s
      timeout: 3s
      retries: 5
    volumes:
      - redis_data:/data
`;

    if (vfs.hasFile(dockerComposePath)) {
      const current = vfs.getFileContent(dockerComposePath) || '';
      if (!current.includes('redis:')) {
        let updated = current;
        if (updated.includes('volumes:')) {
          updated = updated.replace(
            'volumes:',
            `${redisServiceSnippet}\nvolumes:\n  redis_data:\n`
          );
        } else {
          updated = `${updated}\n${redisServiceSnippet}\nvolumes:\n  redis_data:\n`;
        }
        vfs.applyAction({
          type: 'OVERWRITE',
          path: dockerComposePath,
          content: updated,
        });
      }
    } else {
      vfs.applyAction({
        type: 'CREATE',
        path: dockerComposePath,
        content: `version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - '4000:4000'
    environment:
      - NODE_ENV=development
      - PORT=4000
      - REDIS_URL=redis://redis:6379
    depends_on:
      redis:
        condition: service_healthy

${redisServiceSnippet}
volumes:
  redis_data:
`,
      });
    }
  },
};
