import type { FeatureSlice } from '../../engine/compositor.js';
import { DEPENDENCY_REGISTRY } from '../../registry/dependencies.js';
import type { ProjectConfig } from '../../types/config.js';
import { CodePatcher } from '../../utils/code-patcher.js';
import type { VirtualFileSystem } from '../../vfs/vfs.js';
import { layoutFor } from '../../utils/layout.js';

export const mongodbSlice: FeatureSlice = {
  id: 'db-mongodb',
  name: 'MongoDB Database Integration (Mongoose)',
  apply: (vfs: VirtualFileSystem, config: ProjectConfig) => {
    const isNextjs =
      config.topology === 'nextjs-fullstack' ||
      (config.frontend.framework === 'nextjs' && config.backend.framework === 'none');

    const isEligible =
      config.backend.database === 'mongodb' &&
      (config.backend.framework !== 'none' || isNextjs);

    if (!isEligible) {
      return;
    }

    const layout = layoutFor(config);
    const resolvePath = layout.be;

    // 1. Merge Mongoose dependency
    vfs.applyAction({
      type: 'MERGE_JSON',
      path: resolvePath('package.json'),
      content: {
        dependencies: {
          mongoose: DEPENDENCY_REGISTRY.mongoose,
        },
      },
    });

    // 2. src/database/models/user.model.ts
    vfs.applyAction({
      type: 'CREATE',
      path: resolvePath('src/database/models/user.model.ts'),
      content: `import mongoose, { Schema, type Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>('User', userSchema);
`,
    });

    // 3a. Next.js serves its own API: a cached connection helper, no backend env/logger modules.
    if (layout.nextIsServer) {
      vfs.applyAction({
        type: 'CREATE',
        path: resolvePath('src/db/index.ts'),
        content: `import mongoose from 'mongoose';

// Reuse one connection across route handler invocations and dev hot reloads.
const cache = globalThis as unknown as { mongoose?: Promise<typeof mongoose> };

export function connectDb(): Promise<typeof mongoose> {
  cache.mongoose ??= mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/${config.name.replace(/[^a-zA-Z0-9_]/g, '_')}');
  return cache.mongoose;
}
`,
      });
      return;
    }

    // 3. src/database/connection.ts
    vfs.applyAction({
      type: 'CREATE',
      path: resolvePath('src/database/connection.ts'),
      content: `import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { logger } from '../shared/utils/logger.js';

export class MongoDatabase {
  private static isConnected = false;

  public static async connect(retries = 5, delay = 5000): Promise<void> {
    mongoose.connection.on('connected', () => {
      logger.info('✅ MongoDB connection established');
      this.isConnected = true;
    });

    mongoose.connection.on('error', (err) => {
      logger.error({ err }, 'MongoDB connection error event');
      this.isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB disconnected');
      this.isConnected = false;
    });

    while (retries > 0) {
      try {
        await mongoose.connect(env.DATABASE_URL, {
          maxPoolSize: env.DATABASE_POOL_MAX,
          minPoolSize: env.DATABASE_POOL_MIN,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        });
        return;
      } catch (err) {
        retries -= 1;
        logger.error({ err, remainingRetries: retries }, \`Failed to connect to MongoDB. Retrying in \${delay}ms...\`);
        if (retries === 0) {
          throw new Error('Could not connect to MongoDB after multiple attempts.');
        }
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  }

  public static async disconnect(): Promise<void> {
    if (this.isConnected) {
      logger.info('Disconnecting MongoDB connection...');
      await mongoose.disconnect();
      this.isConnected = false;
      logger.info('MongoDB disconnected.');
    }
  }

  public static isHealthy(): boolean {
    return mongoose.connection.readyState === 1;
  }
}
`,
    });

    // 4. Patch src/server.ts to connect and disconnect MongoDatabase if present
    if (vfs.hasFile(resolvePath('src/server.ts'))) {
      vfs.applyAction({
        type: 'PATCH_AST',
        path: resolvePath('src/server.ts'),
        patcher: (content) => {
          let patched = CodePatcher.injectSlot(
            content,
            '/* FORGESTACK_DB_IMPORT_SLOT */',
            "import { MongoDatabase } from './database/connection.js';",
            { preserveSlot: false }
          );
          patched = CodePatcher.injectSlot(
            patched,
            '/* FORGESTACK_DB_CONNECT_SLOT */',
            '  await MongoDatabase.connect();',
            { preserveSlot: false }
          );
          patched = CodePatcher.injectSlot(
            patched,
            '/* FORGESTACK_DB_DISCONNECT_SLOT */',
            '    await MongoDatabase.disconnect();',
            { preserveSlot: false }
          );
          return patched;
        },
      });
    }
  },
};
