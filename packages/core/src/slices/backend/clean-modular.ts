import type { FeatureSlice } from '../../engine/compositor.js';
import { DEPENDENCY_REGISTRY } from '../../registry/dependencies.js';
import type { ProjectConfig } from '../../types/config.js';
import type { VirtualFileSystem } from '../../vfs/vfs.js';

export const cleanModularBackendSlice: FeatureSlice = {
  id: 'be-clean-modular',
  name: 'Node.js ESM Clean Modular Backend',
  apply: (vfs: VirtualFileSystem, config: ProjectConfig) => {
    if (!config.backend || config.backend.framework === 'none') {
      return;
    }

    const basePath =
      config.topology === 'monorepo' || config.topology === 'micro-frontend' || config.topology === 'ai-agent-rag'
        ? 'apps/api'
        : config.topology === 'separate-folders'
        ? 'backend'
        : config.topology === 'electron-desktop' || config.topology === 'nextjs-fullstack'
        ? 'server'
        : '';
    const resolvePath = (p: string) => (basePath ? `${basePath}/${p}` : p);

    const isFastify = config.backend.framework === 'fastify';
    const isHono = config.backend.framework === 'hono';

    // 1. package.json
    const packageJsonContent = {
      name:
        config.topology === 'monorepo' || config.topology === 'micro-frontend' || config.topology === 'ai-agent-rag'
          ? '@repo/api'
          : config.topology === 'separate-folders'
          ? `${config.name}-backend`
          : config.name,
      version: '0.0.1',
      private: true,
      type: 'module',
      scripts: {
        dev: 'tsx watch src/server.ts',
        build: 'tsc',
        start: 'node dist/server.js',
        lint: 'eslint .',
        test: 'vitest run',
      },
      dependencies: {
        dotenv: DEPENDENCY_REGISTRY.dotenv,
        zod: DEPENDENCY_REGISTRY.zod,
        pino: DEPENDENCY_REGISTRY.pino,
        ...(isHono
          ? {
              hono: DEPENDENCY_REGISTRY.hono,
              '@hono/node-server': DEPENDENCY_REGISTRY['@hono/node-server'],
            }
          : isFastify
          ? {
              fastify: DEPENDENCY_REGISTRY.fastify,
              '@fastify/cors': DEPENDENCY_REGISTRY['@fastify/cors'],
              '@fastify/helmet': DEPENDENCY_REGISTRY['@fastify/helmet'],
              '@fastify/rate-limit': DEPENDENCY_REGISTRY['@fastify/rate-limit'],
            }
          : {
              express: DEPENDENCY_REGISTRY.express,
              cors: DEPENDENCY_REGISTRY.cors,
              helmet: DEPENDENCY_REGISTRY.helmet,
              'express-rate-limit': DEPENDENCY_REGISTRY['express-rate-limit'],
            }),
        ...(config.topology === 'monorepo' || config.topology === 'micro-frontend' || config.topology === 'ai-agent-rag'
          ? { '@repo/contracts': 'workspace:*' }
          : {}),
      },
      devDependencies: {
        typescript: DEPENDENCY_REGISTRY.typescript,
        tsx: DEPENDENCY_REGISTRY.tsx,
        vitest: DEPENDENCY_REGISTRY.vitest,
        'pino-pretty': DEPENDENCY_REGISTRY['pino-pretty'],
        '@types/node': DEPENDENCY_REGISTRY['@types/node'],
        ...(config.backend.processManager === 'pm2' ? { pm2: DEPENDENCY_REGISTRY.pm2 } : {}),
        ...(!isFastify && !isHono
          ? {
              '@types/express': DEPENDENCY_REGISTRY['@types/express'],
              '@types/cors': DEPENDENCY_REGISTRY['@types/cors'],
            }
          : {}),
        ...(config.topology === 'monorepo' || config.topology === 'micro-frontend' || config.topology === 'ai-agent-rag'
          ? { '@repo/typescript-config': 'workspace:*' }
          : {}),
      },
    };

    vfs.applyAction({
      type: 'CREATE',
      path: resolvePath('package.json'),
      content: JSON.stringify(packageJsonContent, null, 2) + '\n',
    });

    // 2. tsconfig.json
    vfs.applyAction({
      type: 'CREATE',
      path: resolvePath('tsconfig.json'),
      content: JSON.stringify(
        {
          ...(config.topology === 'monorepo' || config.topology === 'micro-frontend' || config.topology === 'ai-agent-rag'
            ? {
                extends: '@repo/typescript-config/node.json',
                compilerOptions: {
                  outDir: './dist',
                  rootDir: './src',
                },
              }
            : {
                compilerOptions: {
                  target: 'ES2022',
                  module: 'NodeNext',
                  moduleResolution: 'NodeNext',
                  esModuleInterop: true,
                  strict: true,
                  noImplicitAny: true,
                  skipLibCheck: true,
                  outDir: './dist',
                  rootDir: './src',
                },
              }),
          include: ['src/**/*'],
        },
        null,
        2
      ) + '\n',
    });

    // 3. src/config/env.ts
    vfs.applyAction({
      type: 'CREATE',
      path: resolvePath('src/config/env.ts'),
      content: `import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/app_dev'),
  DATABASE_POOL_MIN: z.coerce.number().default(2),
  DATABASE_POOL_MAX: z.coerce.number().default(10),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Invalid environment variables:', JSON.stringify(result.error.format(), null, 2));
    process.exit(1);
  }
  return result.data;
};

export const env = parseEnv();
export type Environment = z.infer<typeof envSchema>;
`,
    });

    // 4. src/shared/utils/logger.ts
    vfs.applyAction({
      type: 'CREATE',
      path: resolvePath('src/shared/utils/logger.ts'),
      content: `import pino from 'pino';
import { env } from '../../config/env.js';

export const logger = pino({
  level: env.LOG_LEVEL,
  transport:
    env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
});
`,
    });

    // 5. src/shared/errors/app-error.ts
    vfs.applyAction({
      type: 'CREATE',
      path: resolvePath('src/shared/errors/app-error.ts'),
      content: `export abstract class AppError extends Error {
  abstract readonly statusCode: number;

  constructor(message: string, public readonly details?: unknown) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestError extends AppError {
  readonly statusCode = 400;
}

export class UnauthorizedError extends AppError {
  readonly statusCode = 401;
}

export class ForbiddenError extends AppError {
  readonly statusCode = 403;
}

export class NotFoundError extends AppError {
  readonly statusCode = 404;
}

export class ConflictError extends AppError {
  readonly statusCode = 409;
}
`,
    });

    // 6. src/shared/middleware/error-handler.ts
    vfs.applyAction({
      type: 'CREATE',
      path: resolvePath('src/shared/middleware/error-handler.ts'),
      content: isHono
        ? `import type { Context } from 'hono';
import { AppError } from '../errors/app-error.js';
import { logger } from '../utils/logger.js';
import { ZodError } from 'zod';

export function errorHandler(err: Error, c: Context) {
  if (err instanceof AppError) {
    return c.json(
      {
        statusCode: err.statusCode,
        error: err.name,
        message: err.message,
        details: err.details,
      },
      err.statusCode as any
    );
  }

  if (err instanceof ZodError) {
    return c.json(
      {
        statusCode: 400,
        error: 'ValidationError',
        message: 'Invalid request schema payload',
        details: err.format(),
      },
      400
    );
  }

  logger.error({ err }, 'Unhandled internal server error');
  return c.json(
    {
      statusCode: 500,
      error: 'InternalServerError',
      message: 'An unexpected internal server error occurred',
    },
    500
  );
}
`
        : isFastify
        ? `import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../errors/app-error.js';
import { logger } from '../utils/logger.js';
import { ZodError } from 'zod';

export function errorHandler(
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      error: error.name,
      message: error.message,
      details: error.details,
    });
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      statusCode: 400,
      error: 'ValidationError',
      message: 'Invalid request schema payload',
      details: error.format(),
    });
  }

  logger.error({ err: error }, 'Unhandled internal server error');
  return reply.status(500).send({
    statusCode: 500,
    error: 'InternalServerError',
    message: 'An unexpected internal server error occurred',
  });
}
`
        : `import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error.js';
import { logger } from '../utils/logger.js';
import { ZodError } from 'zod';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      error: err.name,
      message: err.message,
      details: err.details,
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      statusCode: 400,
      error: 'ValidationError',
      message: 'Invalid request schema payload',
      details: err.format(),
    });
  }

  logger.error({ err }, 'Unhandled internal server error');
  return res.status(500).json({
    statusCode: 500,
    error: 'InternalServerError',
    message: 'An unexpected internal server error occurred',
  });
}
`,
    });

    // 7. src/modules/health/health.controller.ts
    vfs.applyAction({
      type: 'CREATE',
      path: resolvePath('src/modules/health/health.controller.ts'),
      content: `export class HealthController {
  public static async getHealth() {
    return {
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
`,
    });

    // 8. src/modules/health/health.routes.ts
    vfs.applyAction({
      type: 'CREATE',
      path: resolvePath('src/modules/health/health.routes.ts'),
      content: isHono
        ? `import { Hono } from 'hono';
import { HealthController } from './health.controller.js';

export const healthRoutes = new Hono();

healthRoutes.get('/health', async (c) => {
  const health = await HealthController.getHealth();
  return c.json(health, 200);
});
`
        : isFastify
        ? `import type { FastifyInstance } from 'fastify';
import { HealthController } from './health.controller.js';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async (_req, reply) => {
    const health = await HealthController.getHealth();
    return reply.status(200).send(health);
  });
}
`
        : `import { Router } from 'express';
import { HealthController } from './health.controller.js';

export const healthRoutes = Router();

healthRoutes.get('/health', async (_req, res) => {
  const health = await HealthController.getHealth();
  res.status(200).json(health);
});
`,
    });

    // 9. src/app.ts
    vfs.applyAction({
      type: 'CREATE',
      path: resolvePath('src/app.ts'),
      content: isHono
        ? `import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { env } from './config/env.js';
import { errorHandler } from './shared/middleware/error-handler.js';
import { healthRoutes } from './modules/health/health.routes.js';

export const app = new Hono();

app.use('*', secureHeaders());
app.use('*', cors({ origin: env.CORS_ORIGIN, credentials: true }));

app.onError(errorHandler);

// Routes
app.route('/api', healthRoutes);
/* FORGESTACK_ROUTE_SLOT */
`
        : isFastify
        ? `import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { env } from './config/env.js';
import { errorHandler } from './shared/middleware/error-handler.js';
import { healthRoutes } from './modules/health/health.routes.js';

export async function buildApp() {
  const app = Fastify({
    logger: false, // Managed via pino instance
  });

  await app.register(cors, {
    origin: env.CORS_ORIGIN,
    credentials: true,
  });

  await app.register(helmet);

  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  app.setErrorHandler(errorHandler);

  // Routes
  await app.register(healthRoutes, { prefix: '/api' });
  /* FORGESTACK_ROUTE_SLOT */

  return app;
}
`
        : `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { errorHandler } from './shared/middleware/error-handler.js';
import { healthRoutes } from './modules/health/health.routes.js';

export const app = express();

app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
});
app.use(limiter);

// Routes
app.use('/api', healthRoutes);
/* FORGESTACK_ROUTE_SLOT */

// Global Error Handler
app.use(errorHandler);
`,
    });

    // 10. src/server.ts
    vfs.applyAction({
      type: 'CREATE',
      path: resolvePath('src/server.ts'),
      content: isHono
        ? `import { serve } from '@hono/node-server';
import { app } from './app.js';
import { env } from './config/env.js';
import { logger } from './shared/utils/logger.js';

/* FORGESTACK_DB_IMPORT_SLOT */

async function bootstrap() {
  /* FORGESTACK_DB_CONNECT_SLOT */

  const server = serve(
    {
      fetch: app.fetch,
      port: env.PORT,
      hostname: '0.0.0.0',
    },
    (info) => {
      logger.info(\`🚀 Hono server running on http://localhost:\${info.port}/api/health in [\${env.NODE_ENV}] mode\`);
    }
  );

  const handleShutdown = async (signal: string) => {
    logger.warn(\`Received \${signal}. Shutting down gracefully...\`);
    server.close(async () => {
      /* FORGESTACK_DB_DISCONNECT_SLOT */
      logger.info('Graceful shutdown completed.');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Shutdown timed out. Forcing exit.');
      process.exit(1);
    }, 10000).unref();
  };

  process.on('SIGINT', () => handleShutdown('SIGINT'));
  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
}

bootstrap().catch((err) => {
  logger.fatal({ err }, 'Fatal startup crash');
  process.exit(1);
});
`
        : isFastify
        ? `import { buildApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './shared/utils/logger.js';

/* FORGESTACK_DB_IMPORT_SLOT */

async function bootstrap() {
  /* FORGESTACK_DB_CONNECT_SLOT */
  const app = await buildApp();

  await app.listen({ port: env.PORT, host: '0.0.0.0' });
  logger.info(\`🚀 Fastify server running on http://localhost:\${env.PORT}/api/health in [\${env.NODE_ENV}] mode\`);

  const handleShutdown = async (signal: string) => {
    logger.warn(\`Received \${signal}. Shutting down gracefully...\`);
    await app.close();
    /* FORGESTACK_DB_DISCONNECT_SLOT */
    logger.info('Graceful shutdown completed.');
    process.exit(0);
  };

  process.on('SIGINT', () => handleShutdown('SIGINT'));
  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
}

bootstrap().catch((err) => {
  logger.fatal({ err }, 'Fatal startup crash');
  process.exit(1);
});
`
        : `import { app } from './app.js';
import { env } from './config/env.js';
import { logger } from './shared/utils/logger.js';
import type { Server } from 'http';

/* FORGESTACK_DB_IMPORT_SLOT */

let server: Server;

async function bootstrap() {
  /* FORGESTACK_DB_CONNECT_SLOT */

  server = app.listen(env.PORT, () => {
    logger.info(\`🚀 Express server running on http://localhost:\${env.PORT}/api/health in [\${env.NODE_ENV}] mode\`);
  });

  const handleShutdown = async (signal: string) => {
    logger.warn(\`Received \${signal}. Shutting down gracefully...\`);
    server.close(async () => {
      /* FORGESTACK_DB_DISCONNECT_SLOT */
      logger.info('Graceful shutdown completed.');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Shutdown timed out. Forcing exit.');
      process.exit(1);
    }, 10000).unref();
  };

  process.on('SIGINT', () => handleShutdown('SIGINT'));
  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
}

bootstrap().catch((err) => {
  logger.fatal({ err }, 'Fatal startup crash');
  process.exit(1);
});
`,
    });

    // 10. src/__tests__/health.test.ts
    vfs.applyAction({
      type: 'CREATE',
      path: resolvePath('src/__tests__/health.test.ts'),
      content: `import { describe, it, expect } from 'vitest';

describe('Health Check Test Suite', () => {
  it('should verify test runner configuration', () => {
    expect(true).toBe(true);
  });
});
`,
    });

    // 11. .env.example
    const beEnvLines = [
      '# Node.js ESM Backend Server Configuration',
      `PORT=${config.topology === 'monorepo' ? '3001' : '3000'}`,
      'NODE_ENV=development',
      'LOG_LEVEL=info',
      'CORS_ORIGIN=http://localhost:5173',
    ];
    if (config.backend.database === 'postgres') {
      beEnvLines.push(
        `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/${config.name.replace(/[^a-zA-Z0-9_]/g, '_')}`
      );
    } else if (config.backend.database === 'mongodb') {
      beEnvLines.push(
        `MONGODB_URI=mongodb://localhost:27017/${config.name.replace(/[^a-zA-Z0-9_]/g, '_')}`
      );
    } else if (config.backend.database === 'sqlite') {
      beEnvLines.push('DATABASE_URL=file:./dev.db');
    }
    if (config.utilities?.backendHelpers) {
      beEnvLines.push('JWT_SECRET=supersecret-dev-jwt-key-replace-in-production-min-32-chars-long');
      beEnvLines.push('JWT_EXPIRES_IN=15m');
      beEnvLines.push('JWT_REFRESH_EXPIRES_IN=7d');
    }
    vfs.applyAction({
      type: 'CREATE',
      path: resolvePath('.env.example'),
      content: beEnvLines.join('\n') + '\n',
    });
  },
};
