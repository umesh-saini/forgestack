import type { FeatureSlice } from '../../engine/compositor.js';
import { DEPENDENCY_REGISTRY } from '../../registry/dependencies.js';
import type { ProjectConfig } from '../../types/config.js';
import { CodePatcher } from '../../utils/code-patcher.js';
import type { VirtualFileSystem } from '../../vfs/vfs.js';

export const betterAuthSlice: FeatureSlice = {
  id: 'auth-better-auth',
  name: 'Better-Auth Authentication Primitive',
  apply: (vfs: VirtualFileSystem, config: ProjectConfig) => {
    if (config.auth !== 'better-auth') {
      return;
    }

    const isNextjsFullstack =
      config.topology === 'nextjs-fullstack' ||
      (config.frontend.framework === 'nextjs' && config.backend.framework === 'none');

    const isMonorepo =
      config.topology === 'monorepo' || config.topology === 'micro-frontend';
    const isSeparate = config.topology === 'separate-folders';

    // 1. Resolve Server / Backend Root Path
    const serverRoot = isNextjsFullstack
      ? isMonorepo
        ? 'apps/web'
        : isSeparate
        ? 'frontend'
        : ''
      : isMonorepo
      ? 'apps/api'
      : isSeparate
      ? 'backend'
      : config.topology === 'electron-desktop'
      ? 'server'
      : '';

    const resolveServerPath = (p: string) => (serverRoot ? `${serverRoot}/${p}` : p);

    // 2. Resolve Frontend Root Path
    const frontendRoot = isNextjsFullstack
      ? isMonorepo
        ? 'apps/web'
        : isSeparate
        ? 'frontend'
        : ''
      : isMonorepo
      ? 'apps/web'
      : isSeparate
      ? 'frontend'
      : '';

    const resolveFrontendPath = (p: string) =>
      frontendRoot ? `${frontendRoot}/${p}` : p;

    const hasFrontend = config.frontend.framework !== 'none';
    const hasBackend = config.backend.framework !== 'none' || isNextjsFullstack;

    // 3. Inject Dependencies into Server package.json
    if (hasBackend) {
      vfs.applyAction({
        type: 'MERGE_JSON',
        path: resolveServerPath('package.json'),
        content: {
          dependencies: {
            'better-auth': DEPENDENCY_REGISTRY['better-auth'],
          },
        },
      });
    }

    // 4. Inject Dependencies into Frontend package.json
    if (hasFrontend && !isNextjsFullstack) {
      vfs.applyAction({
        type: 'MERGE_JSON',
        path: resolveFrontendPath('package.json'),
        content: {
          dependencies: {
            'better-auth': DEPENDENCY_REGISTRY['better-auth'],
          },
        },
      });
    }

    const isDrizzle = config.backend.orm === 'drizzle';
    const isPrisma = config.backend.orm === 'prisma';
    const isSqlite = config.backend.database === 'sqlite';
    const isPostgres = config.backend.database === 'postgres';

    // 5. Database Schema Augmentation
    if (isDrizzle) {
      if (isPostgres) {
        if (isNextjsFullstack) {
          // Augment or create schema in src/db/schema.ts
          const nextSchemaPath = resolveServerPath('src/db/schema.ts');
          const authSchemaSnippet = `
// --- Better-Auth Tables ---
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
`;
          if (vfs.hasFile(nextSchemaPath)) {
            const current = vfs.getFileContent(nextSchemaPath) || '';
            let updated = current;
            if (!updated.includes('boolean')) {
              updated = updated.replace(
                "import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';",
                "import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';"
              );
            }
            vfs.applyAction({
              type: 'OVERWRITE',
              path: nextSchemaPath,
              content: `${updated}\n${authSchemaSnippet}`,
            });
          } else {
            vfs.applyAction({
              type: 'CREATE',
              path: nextSchemaPath,
              content: `import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';\n${authSchemaSnippet}`,
            });
          }
        } else {
          // Standard Postgres backend
          const authSchemaPath = resolveServerPath('src/database/schema/auth.ts');
          vfs.applyAction({
            type: 'CREATE',
            path: authSchemaPath,
            content: `import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
`,
          });

          // Re-export in src/database/schema/index.ts
          const schemaIndexPath = resolveServerPath('src/database/schema/index.ts');
          if (vfs.hasFile(schemaIndexPath)) {
            vfs.applyAction({
              type: 'APPEND',
              path: schemaIndexPath,
              content: "\nexport * from './auth.js';\n",
            });
          }
        }
      } else if (isSqlite) {
        if (isNextjsFullstack) {
          const nextSchemaPath = resolveServerPath('src/db/schema.ts');
          const sqliteAuthSnippet = `
// --- Better-Auth SQLite Tables ---
export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
  image: text('image'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
});

export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),
  refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});
`;
          if (vfs.hasFile(nextSchemaPath)) {
            vfs.applyAction({
              type: 'APPEND',
              path: nextSchemaPath,
              content: `\n${sqliteAuthSnippet}`,
            });
          }
        } else {
          // Standard SQLite backend
          const authSchemaPath = resolveServerPath('src/database/schema/auth.ts');
          vfs.applyAction({
            type: 'CREATE',
            path: authSchemaPath,
            content: `import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
  image: text('image'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
});

export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),
  refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
`,
          });

          // Re-export in src/database/schema/index.ts
          const schemaIndexPath = resolveServerPath('src/database/schema/index.ts');
          if (vfs.hasFile(schemaIndexPath)) {
            vfs.applyAction({
              type: 'APPEND',
              path: schemaIndexPath,
              content: "\nexport * from './auth.js';\n",
            });
          }
        }
      }
    } else if (isPrisma) {
      // Append Prisma Models
      const prismaSchemaPath = resolveServerPath('prisma/schema.prisma');
      const prismaAuthModels = `
model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
  accounts      Account[]
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Account {
  id                    String    @id @default(cuid())
  userId                String
  accountId             String
  providerId            String
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Verification {
  id         String   @id @default(cuid())
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
`;
      if (vfs.hasFile(prismaSchemaPath)) {
        vfs.applyAction({
          type: 'APPEND',
          path: prismaSchemaPath,
          content: `\n${prismaAuthModels}`,
        });
      }
    }

    // 6. Scaffold Server Auth Configuration (src/auth/auth.ts)
    if (hasBackend) {
      const authConfigPath = resolveServerPath('src/auth/auth.ts');
      let authConfigContent = '';

      if (isDrizzle) {
        if (isNextjsFullstack) {
          authConfigContent = `import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../db/client.js';
import * as schema from '../db/schema.js';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: '${isSqlite ? 'sqlite' : 'pg'}',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});

export type Auth = typeof auth;
`;
        } else {
          authConfigContent = `import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../database/client.js';
import * as schema from '../database/schema/index.js';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: '${isSqlite ? 'sqlite' : 'pg'}',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});

export type Auth = typeof auth;
`;
        }
      } else if (isPrisma) {
        authConfigContent = `import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '../database/client.js';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: '${isSqlite ? 'sqlite' : 'postgresql'}',
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});

export type Auth = typeof auth;
`;
      } else {
        authConfigContent = `import { betterAuth } from 'better-auth';

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});

export type Auth = typeof auth;
`;
      }

      vfs.applyAction({
        type: 'CREATE',
        path: authConfigPath,
        content: authConfigContent,
      });

      // 7. Route Handlers
      if (isNextjsFullstack) {
        // App router handler
        vfs.applyAction({
          type: 'CREATE',
          path: resolveServerPath('src/app/api/auth/[...all]/route.ts'),
          content: `import { auth } from '@/auth/auth';
import { toNextJsHandler } from 'better-auth/next-js';

export const { GET, POST } = toNextJsHandler(auth.handler);
`,
        });
      } else if (config.backend.framework === 'hono') {
        vfs.applyAction({
          type: 'CREATE',
          path: resolveServerPath('src/routes/auth.routes.ts'),
          content: `import { Hono } from 'hono';
import { auth } from '../auth/auth.js';

export const authRouter = new Hono();

authRouter.on(['POST', 'GET'], '/*', (c) => {
  return auth.handler(c.req.raw);
});
`,
        });
      } else if (config.backend.framework === 'fastify') {
        vfs.applyAction({
          type: 'CREATE',
          path: resolveServerPath('src/modules/auth/auth.routes.ts'),
          content: `import type { FastifyPluginAsync } from 'fastify';
import { auth } from '../../auth/auth.js';

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.all('/*', async (req, reply) => {
    const url = new URL(req.url, \`http://\${req.headers.host || 'localhost'}\`);
    const response = await auth.handler(
      new Request(url.toString(), {
        method: req.method,
        headers: req.headers as Record<string, string>,
        body: req.body && req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
      })
    );
    reply.status(response.status);
    response.headers.forEach((value, key) => reply.header(key, value));
    return reply.send(await response.text());
  });
};
`,
        });
      } else if (config.backend.framework === 'express') {
        vfs.applyAction({
          type: 'CREATE',
          path: resolveServerPath('src/modules/auth/auth.routes.ts'),
          content: `import { Router } from 'express';
import { auth } from '../../auth/auth.js';

export const authRoutes = Router();

authRoutes.all('/*', async (req, res) => {
  const url = new URL(req.originalUrl || req.url, \`http://\${req.headers.host || 'localhost'}\`);
  const response = await auth.handler(
    new Request(url.toString(), {
      method: req.method,
      headers: req.headers as Record<string, string>,
      body: req.body && req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    })
  );
  res.status(response.status);
  response.headers.forEach((value, key) => res.setHeader(key, value));
  res.send(await response.text());
});
`,
        });
      }
    }

    // 8. Scaffold React Client Helper (src/auth/client.ts)
    if (hasFrontend) {
      vfs.applyAction({
        type: 'CREATE',
        path: resolveFrontendPath('src/auth/client.ts'),
        content: `import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
});

export const { signIn, signUp, signOut, useSession } = authClient;
`,
      });
    }

    // 9. Environment Variables
    const envVars = `
# Better-Auth Configuration
BETTER_AUTH_SECRET=development_secret_key_at_least_32_characters_long
BETTER_AUTH_URL=http://localhost:3000
`;

    if (isNextjsFullstack) {
      const envPath = resolveServerPath('.env.local');
      if (vfs.hasFile(envPath)) {
        vfs.applyAction({
          type: 'APPEND',
          path: envPath,
          content: envVars,
        });
      } else {
        vfs.applyAction({
          type: 'CREATE',
          path: envPath,
          content: envVars.trimStart(),
        });
      }
    } else {
      const envPath = resolveServerPath('.env.example');
      if (vfs.hasFile(envPath)) {
        vfs.applyAction({
          type: 'APPEND',
          path: envPath,
          content: envVars,
        });
      }
    }
  },
};
