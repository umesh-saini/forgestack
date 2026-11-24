import type { FeatureSlice } from '../../engine/compositor.js';
import { DEPENDENCY_REGISTRY } from '../../registry/dependencies.js';
import type { ProjectConfig } from '../../types/config.js';
import { CodePatcher } from '../../utils/code-patcher.js';
import type { VirtualFileSystem } from '../../vfs/vfs.js';
import { layoutFor } from '../../utils/layout.js';

export const postgresSlice: FeatureSlice = {
  id: 'db-postgres',
  name: 'PostgreSQL Database Integration (Drizzle ORM / Prisma)',
  apply: (vfs: VirtualFileSystem, config: ProjectConfig) => {
    const isNextjs =
      config.topology === 'nextjs-fullstack' ||
      (config.frontend.framework === 'nextjs' && config.backend.framework === 'none');

    const isEligible =
      config.backend.database === 'postgres' &&
      (config.backend.framework !== 'none' || isNextjs);

    if (!isEligible) {
      return;
    }

    const resolvePath = layoutFor(config).be;

    const isDrizzle = config.backend.orm === 'drizzle';

    if (isDrizzle) {
      // 1. Drizzle ORM Dependencies
      vfs.applyAction({
        type: 'MERGE_JSON',
        path: resolvePath('package.json'),
        content: {
          dependencies: {
            'drizzle-orm': DEPENDENCY_REGISTRY['drizzle-orm'],
            pg: DEPENDENCY_REGISTRY.pg,
          },
          devDependencies: {
            'drizzle-kit': DEPENDENCY_REGISTRY['drizzle-kit'],
            '@types/pg': DEPENDENCY_REGISTRY['@types/pg'],
          },
          scripts: {
            'db:generate': 'drizzle-kit generate',
            'db:migrate': 'drizzle-kit migrate',
            'db:studio': 'drizzle-kit studio',
          },
        },
      });

      if (isNextjs) {
        // Next.js specific Drizzle configuration & client
        vfs.applyAction({
          type: 'CREATE',
          path: resolvePath('drizzle.config.ts'),
          content: `import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/${config.name.replace(/[^a-zA-Z0-9_]/g, '_')}',
  },
  verbose: true,
  strict: true,
});
`,
        });

        vfs.applyAction({
          type: 'CREATE',
          path: resolvePath('src/db/schema.ts'),
          content: `import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
`,
        });

        vfs.applyAction({
          type: 'CREATE',
          path: resolvePath('src/db/index.ts'),
          content: `import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.js';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/${config.name.replace(/[^a-zA-Z0-9_]/g, '_')}',
});

export const db = drizzle(pool, { schema });
`,
        });

        vfs.applyAction({
          type: 'CREATE',
          path: resolvePath('.env.local'),
          content: `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/${config.name.replace(/[^a-zA-Z0-9_]/g, '_')}\n`,
        });
      } else {
        // Standard backend Drizzle configuration
        vfs.applyAction({
          type: 'CREATE',
          path: resolvePath('drizzle.config.ts'),
          content: `import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  // Table files, not the index.ts barrel: drizzle-kit's loader can't map './x.js' imports to .ts
  schema: './src/database/schema/!(index).ts',
  out: './src/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/app_dev',
  },
  verbose: true,
  strict: true,
});
`,
        });

        // 3. src/database/schema/users.ts
        vfs.applyAction({
          type: 'CREATE',
          path: resolvePath('src/database/schema/users.ts'),
          content: `import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
`,
        });

        // 4. src/database/schema/index.ts
        vfs.applyAction({
          type: 'CREATE',
          path: resolvePath('src/database/schema/index.ts'),
          content: `export * from './users.js';\n`,
        });

        // 5. src/database/connection.ts
        vfs.applyAction({
          type: 'CREATE',
          path: resolvePath('src/database/connection.ts'),
          content: `import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { env } from '../config/env.js';
import { logger } from '../shared/utils/logger.js';
import * as schema from './schema/index.js';

const { Pool } = pg;

export class Database {
  private static pool: pg.Pool | null = null;
  public static db: ReturnType<typeof drizzle<typeof schema>> | null = null;

  public static async connect(): Promise<void> {
    if (this.pool) return;

    this.pool = new Pool({
      connectionString: env.DATABASE_URL,
      min: env.DATABASE_POOL_MIN,
      max: env.DATABASE_POOL_MAX,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    this.pool.on('error', (err) => {
      logger.error({ err }, 'Unexpected database client pool error');
    });

    const client = await this.pool.connect();
    try {
      await client.query('SELECT 1');
      this.db = drizzle(this.pool, { schema });
      logger.info('✅ PostgreSQL connected successfully via connection pool');
    } finally {
      client.release();
    }
  }

  public static async checkHealth(): Promise<boolean> {
    if (!this.pool) return false;
    try {
      await this.pool.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }

  public static async disconnect(): Promise<void> {
    if (this.pool) {
      logger.info('Closing database connection pool...');
      await this.pool.end();
      this.pool = null;
      this.db = null;
      logger.info('Database pool drained successfully.');
    }
  }
}
`,
        });
      }
    } else {
      // Prisma ORM
      vfs.applyAction({
        type: 'MERGE_JSON',
        path: resolvePath('package.json'),
        content: {
          dependencies: {
            '@prisma/client': DEPENDENCY_REGISTRY['@prisma/client'],
          },
          devDependencies: {
            prisma: DEPENDENCY_REGISTRY.prisma,
          },
          scripts: {
            // The client must exist before tsc/next build; don't rely on @prisma/client's own
            // postinstall (pnpm 10 blocks dependency build scripts by default).
            postinstall: 'prisma generate',
            'db:generate': 'prisma generate',
            'db:migrate': 'prisma migrate dev',
            'db:studio': 'prisma studio',
          },
        },
      });

      if (isNextjs) {
        vfs.applyAction({
          type: 'CREATE',
          path: resolvePath('prisma/schema.prisma'),
          content: `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`,
        });

        vfs.applyAction({
          type: 'CREATE',
          path: resolvePath('src/db/index.ts'),
          content: `import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
`,
        });

        vfs.applyAction({
          type: 'CREATE',
          path: resolvePath('.env.local'),
          content: `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/${config.name.replace(/[^a-zA-Z0-9_]/g, '_')}\n`,
        });
      } else {
        // prisma/schema.prisma
        vfs.applyAction({
          type: 'CREATE',
          path: resolvePath('prisma/schema.prisma'),
          content: `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`,
        });

        // src/database/connection.ts for Prisma
        vfs.applyAction({
          type: 'CREATE',
          path: resolvePath('src/database/connection.ts'),
          content: `import { PrismaClient } from '@prisma/client';
import { logger } from '../shared/utils/logger.js';

export class Database {
  public static prisma: PrismaClient = new PrismaClient();

  public static async connect(): Promise<void> {
    try {
      await this.prisma.$connect();
      await this.prisma.$queryRaw\`SELECT 1\`;
      logger.info('✅ Prisma PostgreSQL connected successfully');
    } catch (err) {
      logger.error({ err }, 'Failed to connect to Prisma PostgreSQL');
      throw err;
    }
  }

  public static async checkHealth(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw\`SELECT 1\`;
      return true;
    } catch {
      return false;
    }
  }

  public static async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
    logger.info('Prisma disconnected.');
  }
}
`,
        });
      }
    }

    // Patch src/server.ts to connect and disconnect Database if present
    if (vfs.hasFile(resolvePath('src/server.ts'))) {
      vfs.applyAction({
        type: 'PATCH_AST',
        path: resolvePath('src/server.ts'),
        patcher: (content) => {
          let patched = CodePatcher.injectSlot(
            content,
            '/* FORGESTACK_DB_IMPORT_SLOT */',
            "import { Database } from './database/connection.js';",
            { preserveSlot: false }
          );
          patched = CodePatcher.injectSlot(
            patched,
            '/* FORGESTACK_DB_CONNECT_SLOT */',
            '  await Database.connect();',
            { preserveSlot: false }
          );
          patched = CodePatcher.injectSlot(
            patched,
            '/* FORGESTACK_DB_DISCONNECT_SLOT */',
            '    await Database.disconnect();',
            { preserveSlot: false }
          );
          return patched;
        },
      });
    }
  },
};
