import type { FeatureSlice } from '../../engine/compositor.js';
import { DEPENDENCY_REGISTRY } from '../../registry/dependencies.js';
import type { ProjectConfig } from '../../types/config.js';
import { CodePatcher } from '../../utils/code-patcher.js';
import type { VirtualFileSystem } from '../../vfs/vfs.js';

export const sqliteSlice: FeatureSlice = {
  id: 'db-sqlite',
  name: 'SQLite Database Integration (better-sqlite3 + Drizzle ORM / Prisma)',
  apply: (vfs: VirtualFileSystem, config: ProjectConfig) => {
    const isNextjs =
      config.topology === 'nextjs-fullstack' ||
      (config.frontend.framework === 'nextjs' && config.backend.framework === 'none');

    const isEligible =
      config.backend.database === 'sqlite' &&
      (config.backend.framework !== 'none' || isNextjs);

    if (!isEligible) {
      return;
    }

    const basePath = isNextjs
      ? config.topology === 'monorepo' || config.topology === 'micro-frontend'
        ? 'apps/web'
        : config.topology === 'separate-folders'
        ? 'frontend'
        : ''
      : config.topology === 'monorepo' || config.topology === 'micro-frontend'
      ? 'apps/api'
      : config.topology === 'separate-folders'
      ? 'backend'
      : config.topology === 'electron-desktop'
      ? 'server'
      : '';
    const resolvePath = (p: string) => (basePath ? `${basePath}/${p}` : p);

    const isDrizzle = config.backend.orm === 'drizzle';

    if (isDrizzle) {
      // 1. Drizzle ORM Dependencies with better-sqlite3
      vfs.applyAction({
        type: 'MERGE_JSON',
        path: resolvePath('package.json'),
        content: {
          dependencies: {
            'drizzle-orm': DEPENDENCY_REGISTRY['drizzle-orm'],
            'better-sqlite3': DEPENDENCY_REGISTRY['better-sqlite3'],
          },
          devDependencies: {
            'drizzle-kit': DEPENDENCY_REGISTRY['drizzle-kit'],
            '@types/better-sqlite3': DEPENDENCY_REGISTRY['@types/better-sqlite3'],
          },
          scripts: {
            'db:generate': 'drizzle-kit generate',
            'db:migrate': 'drizzle-kit migrate',
            'db:studio': 'drizzle-kit studio',
          },
        },
      });

      if (isNextjs) {
        vfs.applyAction({
          type: 'CREATE',
          path: resolvePath('drizzle.config.ts'),
          content: `import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_URL?.replace(/^file:/, '') || './dev.db',
  },
  verbose: true,
  strict: true,
});
`,
        });

        vfs.applyAction({
          type: 'CREATE',
          path: resolvePath('src/db/schema.ts'),
          content: `import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
`,
        });

        vfs.applyAction({
          type: 'CREATE',
          path: resolvePath('src/db/index.ts'),
          content: `import DatabaseDriver from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';

const dbPath = (process.env.DATABASE_URL || 'file:./dev.db').replace(/^file:/, '');
const client = new DatabaseDriver(dbPath);
client.pragma('journal_mode = WAL');

export const db = drizzle(client, { schema });
`,
        });

        vfs.applyAction({
          type: 'CREATE',
          path: resolvePath('.env.local'),
          content: `DATABASE_URL=file:./dev.db\n`,
        });
      } else {
        // 2. drizzle.config.ts for SQLite
        vfs.applyAction({
          type: 'CREATE',
          path: resolvePath('drizzle.config.ts'),
          content: `import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/database/schema/index.ts',
  out: './src/database/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_URL?.replace(/^file:/, '') || './dev.db',
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
          content: `import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
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
          content: `import DatabaseDriver from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { env } from '../config/env.js';
import { logger } from '../shared/utils/logger.js';
import * as schema from './schema/index.js';

export class Database {
  private static client: InstanceType<typeof DatabaseDriver> | null = null;
  public static db: ReturnType<typeof drizzle<typeof schema>> | null = null;

  public static async connect(): Promise<void> {
    if (this.client) return;

    const dbPath = env.DATABASE_URL.replace(/^file:/, '');
    this.client = new DatabaseDriver(dbPath);
    this.client.pragma('journal_mode = WAL');
    this.client.pragma('foreign_keys = ON');

    this.db = drizzle(this.client, { schema });
    logger.info(\`✅ SQLite connected successfully via better-sqlite3 [WAL: \${dbPath}]\`);
  }

  public static async checkHealth(): Promise<boolean> {
    if (!this.client) return false;
    try {
      const row = this.client.prepare('SELECT 1 as result').get();
      return Boolean(row);
    } catch {
      return false;
    }
  }

  public static async disconnect(): Promise<void> {
    if (this.client) {
      logger.info('Closing SQLite database connection...');
      this.client.close();
      this.client = null;
      this.db = null;
      logger.info('SQLite connection closed.');
    }
  }
}
`,
        });
      }
    } else {
      // Prisma ORM for SQLite
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
  provider = "sqlite"
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
          content: `DATABASE_URL=file:./dev.db\n`,
        });
      } else {
        // prisma/schema.prisma
        vfs.applyAction({
          type: 'CREATE',
          path: resolvePath('prisma/schema.prisma'),
          content: `datasource db {
  provider = "sqlite"
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
      logger.info('✅ Prisma SQLite connected successfully');
    } catch (err) {
      logger.error({ err }, 'Failed to connect to Prisma SQLite');
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
