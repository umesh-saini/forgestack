# Next-Generation Project Scaffolding Platform (ForgeStack)
## Complete Technical Specification & Architectural Blueprint
**Distribution:** CLI (`npm` / `npx`) & Native Desktop Application (Tauri v2)  
**Target Projects:** Polyrepo & Enterprise Monorepo (React, TypeScript, Node.js ESM, Databases, AI Agent Rules)

---

## 1. Executive Summary & System Vision

### 1.1 The Problem Space
Modern web application setup is fraught with friction, outdated boilerplates, and manual glue code. Developers spend hours configuring:
1. **Monorepo plumbing:** Workspace linking, Turborepo pipelines, TypeScript path aliases, and shared package hoisting.
2. **Frontend boilerplate:** Combining React 19, TypeScript, Tailwind CSS, TanStack Query, Redux Toolkit, icons, toast notifications, and client routing.
3. **Backend infrastructure:** Node.js ESM configuration, modular folder structure, environment validation, database connection pooling (PostgreSQL/MongoDB), graceful shutdown hooks, and error handling.
4. **AI-Ready Agent Governance:** Modern development relies heavily on AI agents (Antigravity, Cursor, Copilot, Claude Code), yet 99% of project generators omit structured AI agent rules, architectural guardrails, and spec-driven workflows.

Existing scaffolding tools (e.g., `create-react-app`, `create-next-app`, standard templates) suffer from **rigid presets** or **combinatorial template rot** (hundreds of static repositories that go unmaintained).

### 1.2 The ForgeStack Solution
**ForgeStack** is a modular, recipe-driven project generation engine delivered through two interfaces:
- **CLI (`npx create-forgestack-app` / `@forgestk/cli`)**: An interactive terminal UI (TUI) powered by `@clack/prompts` with scriptable CI flags.
- **Desktop Application (`@forgestk/desktop`)**: A cross-platform GUI built with **Tauri v2** + React + Tailwind, offering native directory pickers, live dependency conflict resolution, visual file-tree previews, and one-click initialization.

Both interfaces invoke a shared, headless, deterministic generation core: **`@forgestk/core`**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        User Presentation Layer                         │
├───────────────────────────────────┬────────────────────────────────────┤
│   CLI Interface (`@clack/prompts`)│   Desktop App (Tauri v2 + React)   │
│   - Interactive terminal prompts  │   - Native OS Folder Picker        │
│   - Headless CLI flags for CI     │   - Live File-Tree Preview         │
│   - Streaming terminal spinners   │   - Visual Architecture Selector   │
└─────────────────┬─────────────────┴──────────────────┬─────────────────┘
                  │                                    │
                  ▼                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│              Headless Generator Engine (`@forgestk/core`)            │
├────────────────────────────────────────────────────────────────────────┤
│ • Preset & Recipe Composition Engine (Additive File Slices)            │
│ • Dependency Matrix Resolver & Semantic Version Pinning                │
│ • Virtual File System (In-Memory Transactional Staging)                │
│ • Dynamic AST / Template Interpolator (ts-morph & EJS/Handlebars)      │
│ • Execution & Rollback Manager (Atomic Disk Write & Cleanup)           │
│ • Shell Runner (Package Manager Detection, git init, install hooks)    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Engineering Evaluation & Fatal Anti-Patterns

### 2.1 The Combinatorial Explosion Trap
* **The Flawed Approach:** Creating separate git branches or static folders for every permutation (e.g., `react-redux-mongo`, `react-query-postgres`, `next-tailwind-drizzle`). With 4 frontends × 4 state libraries × 4 backends × 4 databases, you would need to maintain **256 distinct templates**. Within 60 days, dependency version bumps and breaking API changes will rot the majority of them.
* **The ForgeStack Architecture:** A **Composable Layered Recipe Model**. 
  - Every project is composed of a **Base Kernel** (Monorepo or Standalone) + **Additive Feature Slices** (e.g., `slice-tailwind`, `slice-tanstack-query`, `slice-db-postgres-drizzle`, `slice-agent-rules`).
  - Slices inject file fragments, merge `package.json` dependencies deterministically, and patch entry points using Abstract Syntax Tree (AST) mutations or well-defined injection slots.

### 2.2 Desktop Runtime: Tauri v2 vs. Electron
* **The Flawed Approach:** Bundling the desktop app with Electron. Electron bundles an entire Chromium browser and Node.js runtime, producing an installer of >150 MB and consuming >300 MB of RAM at idle for what is fundamentally a wizard interface.
* **The ForgeStack Verdict:** **Tauri v2 (Rust + Native Webview)**.
  - **Installer footprint:** <15 MB.
  - **Memory consumption:** <35 MB RAM.
  - **Security & Performance:** Native Rust file-system I/O prevents Node.js path-traversal vulnerabilities and executes disk generation 10x faster than JavaScript-bound file streams.

### 2.3 Monorepo Package Management: pnpm + Turborepo vs. npm Workspaces
* **The Flawed Approach:** Using `npm` workspaces. `npm` uses a flat `node_modules` hoisting algorithm that causes **phantom dependencies** (packages accessing undeclared transitive dependencies), breaks TypeScript path mapping across monorepo packages, and duplicates binary installs.
* **The ForgeStack Verdict:** **pnpm workspaces + Turborepo**.
  - Strict content-addressable symlink storage prevents phantom dependencies.
  - Turborepo provides instant pipeline orchestration (`turbo build`, `turbo dev`, `turbo lint`) with remote caching capabilities.

### 2.4 Transactional Scaffolding & Zero Dirty State
* **The Flawed Approach:** Directly creating folders and writing files to the target disk in real-time. If the process fails midway (e.g., network drop during `pnpm install`, disk full, permission denied), the user is left with a half-configured, corrupt directory that breaks subsequent commands.
* **The ForgeStack Solution:** **Two-Phase Commit Scaffolding**.
  - **Phase 1 (Virtual Staging):** All directory trees, configuration files, package merges, and code templates are compiled into an in-memory Virtual File System (VFS).
  - **Phase 2 (Atomic Flush & Rollback):** The VFS is flushed to disk within a transactional lock. If any I/O error or package installation fails, ForgeStack triggers an automatic rollback routine, restoring the directory to its pristine prior state.

---

## 3. Supported Stacks & Architecture Matrix

ForgeStack supports three primary project topologies:

```mermaid
graph TD
    A[ForgeStack Scaffolder] --> B[Monorepo Architecture]
    A --> C[Frontend Standalone]
    A --> D[Backend Standalone]

    B --> B1[pnpm Workspaces + Turborepo]
    B1 --> B2[apps/web: React 19 + Vite]
    B1 --> B3[apps/api: Node.js ESM]
    B1 --> B4[packages/ui: Tailwind Shared Components]
    B1 --> B5[packages/types: Shared DTOs & Contracts]
    B1 --> B6[packages/config: ESLint + TSConfig]

    C --> C1[React 19 + TypeScript + Vite]
    D --> D1[Node.js ESM + TypeScript + Clean Modular]
```

### 3.1 Frontend Stack Matrix
| Component | Options Supported | Default / Recommendation |
| :--- | :--- | :--- |
| **Framework** | React 19 (Vite), Next.js 15 (App Router) | React 19 + Vite |
| **Language** | TypeScript (Strict Mode, `NodeNext`/`Bundler` resolution) | TypeScript Strict |
| **Styling** | Tailwind CSS v4, PostCSS, Shadcn/Radix Primitives, CSS Modules | Tailwind CSS v4 |
| **State Management** | TanStack Query v5, Redux Toolkit, Zustand, Context API | TanStack Query + Zustand |
| **UI Components** | Lucide React, Radix UI Primitives, Class Variance Authority (`cva`) | Lucide + Radix |
| **Toast & Feedback** | Sonner (recommended), React Hot Toast | Sonner |
| **Forms & Validation**| React Hook Form + Zod (`@hookform/resolvers/zod`) | RHF + Zod |
| **Routing** | React Router v7, TanStack Router | React Router v7 |

### 3.2 Backend Stack Matrix
| Component | Options Supported | Default / Recommendation |
| :--- | :--- | :--- |
| **Runtime & Module**| Node.js >= 20 LTS, ESM (`"type": "module"`) | Node.js 22 LTS (ESM) |
| **Framework** | Express.js, Fastify, Hono, NestJS | Fastify (Performance) / Express (Ecosystem) |
| **Architecture** | Feature-based Clean Modular Structure | Clean Modular |
| **Database Engines**| PostgreSQL, MongoDB, MySQL, SQLite | PostgreSQL / MongoDB |
| **ORM / ODM** | Prisma, Drizzle ORM, Mongoose, TypeORM | Drizzle (Postgres) / Mongoose (Mongo) |
| **Env Validation** | Zod, Envalid | Zod |
| **Logging & Telemetry**| Pino (high-perf JSON), Winston | Pino + pino-pretty |
| **Security Suite** | Helmet, CORS, Express-Rate-Limit, Argon2/Bcrypt | Helmet + CORS + Rate Limit |

### 3.3 AI Agents & Developer Governance Matrix
| Component | Scaffolding Features |
| :--- | :--- |
| **Agent Standards** | OpenSpec (`openspec/`), Antigravity Agent Config (`.agents/`), Cursor Rules (`.cursor/rules`), Copilot (`.github/copilot-instructions.md`) |
| **Review Personas** | Brutally Honest Engineering Reviewer, Strict Security Auditor, Performance Specialist |
| **Automated Workflows**| Spec-Driven Proposals, Schema Sync, Task Application, Migration Verification |
| **Code Quality** | Biome / ESLint + Prettier, Husky + lint-staged, Commitlint (Conventional Commits) |

---

## 4. Deep-Dive: Monorepo Folder Structure

When the user selects **Monorepo**, ForgeStack generates a battle-tested pnpm workspace managed by Turborepo:

```
my-enterprise-project/
├── .agents/                               # Antigravity & AI Agent definitions
│   ├── skills/
│   │   ├── db-migration-helper/
│   │   │   └── SKILL.md
│   │   └── api-contract-sync/
│   │       └── SKILL.md
│   └── workflows/
│       ├── opsx-propose.md
│       ├── opsx-apply.md
│       └── opsx-sync.md
├── .cursor/
│   └── rules/
│       ├── 01-architecture-boundaries.mdc
│       ├── 02-typescript-strict.mdc
│       └── 03-brutally-honest-reviewer.mdc
├── .github/
│   ├── copilot-instructions.md
│   └── workflows/
│       ├── ci.yml                         # Lint, Typecheck, Test across packages
│       └── release.yml
├── apps/
│   ├── web/                               # Frontend Client
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── assets/
│   │   │   ├── components/
│   │   │   │   ├── ui/                    # Button, Dialog, Toast wrappers
│   │   │   │   └── feedback/
│   │   │   ├── features/                  # Domain/feature slices
│   │   │   │   └── auth/
│   │   │   │       ├── api/               # TanStack query hooks
│   │   │   │       ├── components/
│   │   │   │       ├── hooks/
│   │   │   │       └── types/
│   │   │   ├── hooks/                     # Global custom hooks
│   │   │   ├── lib/                       # Utilities (api client, cn helper)
│   │   │   │   ├── api-client.ts          # Axios / Fetch client with interceptors
│   │   │   │   └── utils.ts               # clsx + twMerge
│   │   │   ├── providers/                 # QueryClient, Theme, Toast providers
│   │   │   │   ├── query-provider.tsx
│   │   │   │   └── toast-provider.tsx
│   │   │   ├── routes/                    # React Router definitions
│   │   │   ├── store/                     # Redux Toolkit or Zustand stores
│   │   │   ├── App.tsx
│   │   │   ├── index.css                  # Tailwind directives
│   │   │   └── main.tsx
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   └── api/                               # Backend Server
│       ├── src/
│       │   ├── config/                    # Zod validated env variables
│       │   │   └── env.ts
│       │   ├── database/                  # Connection pooling & health checks
│       │   │   ├── connection.ts          # Singleton connection manager
│       │   │   ├── schema/                # Drizzle or Prisma schemas
│       │   │   └── migrations/
│       │   ├── modules/                   # Clean Modular Domain Slices
│       │   │   ├── auth/
│       │   │   │   ├── auth.controller.ts
│       │   │   │   ├── auth.service.ts
│       │   │   │   ├── auth.repository.ts
│       │   │   │   ├── auth.routes.ts
│       │   │   │   └── auth.schema.ts     # Request/Response validation
│       │   │   └── health/
│       │   │       ├── health.controller.ts
│       │   │       └── health.routes.ts
│       │   ├── shared/
│       │   │   ├── errors/                # AppError, BadRequestError, NotFoundError
│       │   │   │   └── app-error.ts
│       │   │   ├── middleware/            # Global error handler, rate limiter, auth
│       │   │   │   ├── error-handler.ts
│       │   │   │   ├── rate-limiter.ts
│       │   │   │   └── request-logger.ts
│       │   │   └── utils/
│       │   │       └── logger.ts          # Pino logger instance
│       │   ├── app.ts                     # Express / Fastify server configuration
│       │   └── server.ts                  # Port listener & graceful shutdown handlers
│       ├── package.json
│       ├── tsconfig.json
│       └── vitest.config.ts
├── packages/
│   ├── contracts/                         # Shared API contracts & DTO schemas
│   │   ├── src/
│   │   │   ├── auth.contract.ts           # Zod schemas shared by FE & BE
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── ui/                                # Shared UI components (Tailwind-ready)
│   │   ├── src/
│   │   │   ├── button.tsx
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── eslint-config/                     # Shared ESLint configuration
│   │   ├── base.js
│   │   ├── react.js
│   │   ├── node.js
│   │   └── package.json
│   └── typescript-config/                 # Shared tsconfig bases
│       ├── base.json
│       ├── react.json
│       ├── node.json
│       └── package.json
├── openspec/                              # OpenSpec specification-driven framework
│   ├── config.yaml
│   └── specs/
├── .gitignore
├── .npmrc                                 # strict-peer-dependencies=false, shamefully-hoist=false
├── package.json                           # Root scripts
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
└── turbo.json                             # Pipeline execution graph
```

---

## 5. Technical Implementation of Generated Code Slices

### 5.1 Backend Modular Structure & Database Connections

#### A. Environment Schema Validation (`apps/api/src/config/env.ts`)
Zero tolerance for missing environment variables at startup. If an environment variable is malformed or absent, the process crashes immediately with a clean, typed diagnostic error:

```typescript
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid connection string'),
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
```

#### B. PostgreSQL + Drizzle ORM Production Connection (`apps/api/src/database/connection.ts`)
Features connection pooling, query health checking, and graceful teardown:

```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
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

    // Test connectivity
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
```

#### C. MongoDB + Mongoose Production Connection (`apps/api/src/database/connection.ts`)
Features automated retry backoff, connection event listeners, and SIGINT/SIGTERM handlers:

```typescript
import mongoose from 'mongoose';
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
        logger.error({ err, remainingRetries: retries }, `Failed to connect to MongoDB. Retrying in ${delay}ms...`);
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
```

#### D. Server Lifecycle & Graceful Shutdown (`apps/api/src/server.ts`)
Handles OS signals (`SIGINT`, `SIGTERM`) safely without dropping ongoing in-flight HTTP requests:

```typescript
import { app } from './app.js';
import { env } from './config/env.js';
import { Database } from './database/connection.js';
import { logger } from './shared/utils/logger.js';
import type { Server } from 'http';

let server: Server;

async function bootstrap() {
  await Database.connect();

  server = app.listen(env.PORT, () => {
    logger.info(`🚀 Server running on port ${env.PORT} in [${env.NODE_ENV}] mode`);
  });

  const handleShutdown = async (signal: string) => {
    logger.warn(`Received ${signal}. Starting graceful shutdown...`);
    
    server.close(async () => {
      logger.info('HTTP server closed. Releasing active resources...');
      try {
        await Database.disconnect();
        logger.info('Graceful shutdown completed. Exiting process.');
        process.exit(0);
      } catch (err) {
        logger.error({ err }, 'Error during database disconnection. Forcing exit.');
        process.exit(1);
      }
    });

    // Force shutdown timeout after 10s if hanging
    setTimeout(() => {
      logger.error('Graceful shutdown timed out. Forcing immediate termination.');
      process.exit(1);
    }, 10000).unref();
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
}

bootstrap().catch((err) => {
  logger.fatal({ err }, 'Fatal error during application startup');
  process.exit(1);
});
```

---

### 5.2 Frontend Production Slices

#### A. Central Providers (`apps/web/src/providers/app-providers.tsx`)
Composes TanStack Query, Toast Notifications (Sonner), and Theme state cleanly:

```tsx
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-right" richColors closeButton />
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};
```

#### B. TanStack Query + Typed Shared Contract Hook (`apps/web/src/features/auth/api/use-user.ts`)
Uses shared DTO contracts from `@repo/contracts`:

```typescript
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';
import type { UserResponseDto } from '@repo/contracts';

export const userQueryKey = ['auth', 'current-user'] as const;

export const useCurrentUser = () => {
  return useQuery<UserResponseDto>({
    queryKey: userQueryKey,
    queryFn: async () => {
      const response = await apiClient.get<UserResponseDto>('/auth/me');
      return response.data;
    },
  });
};
```

#### C. Tailwind v4 + Lucide Icon Utility (`apps/web/src/lib/utils.ts`)
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

---

## 6. AI Agent Engineering, Rules & Governance Architecture

Unlike standard templates that generate blank repositories, ForgeStack configures **first-class AI agent governance** directly into the project root:

```
.
├── .agents/
│   ├── skills/
│   │   ├── modern-ui-engineering/
│   │   │   └── SKILL.md
│   │   ├── clean-code-craftsmanship/
│   │   │   └── SKILL.md
│   │   ├── db-migration/
│   │   │   └── SKILL.md
│   │   └── api-validation/
│   │       └── SKILL.md
│   └── workflows/
│       ├── opsx-propose.md
│       ├── opsx-apply.md
│       └── opsx-sync.md
├── .cursor/
│   └── rules/
│       ├── architecture.mdc
│       └── brutal-reviewer.mdc
└── .github/
    └── copilot-instructions.md
```

### 6.1 The Brutally Honest Reviewer Rule (`.cursor/rules/brutal-reviewer.mdc`)
Forces any AI coding agent operating inside the repository to act as a rigorous principal architect:
```markdown
---
description: Brutally honest engineering reviewer rule. Mandates independent technical evaluation, zero fake praise, and uncompromising rigor.
globs: "**/*"
alwaysApply: true
---

# Brutally Honest Engineering Reviewer

Act as a brutally honest, rigorous principal software engineer and systems architect in all interactions.

## Directives:
1. **Independent Evaluation**: Never blindly accept requests or implementation plans. Evaluate every architectural decision from first principles and codebase reality.
2. **Zero Fake Praise**: No sycophantic compliments ("Great idea!", "Awesome question!"). Optimize strictly for correctness, resilience, and performance.
3. **Enforce Boundaries**:
   - Controllers MUST NOT contain raw database queries.
   - Domain logic MUST reside strictly in services.
   - Frontend UI components MUST NOT execute direct fetch calls without custom hooks/providers.
   - Every environment variable access MUST pass through `src/config/env.ts`.
4. **Strict TypeScript**: Never permit `any`. Every API request and response payload must be backed by a verified Zod schema in `@repo/contracts`.
```

### 6.2 Modern UI Engineering Skill (`.agents/skills/modern-ui-engineering/SKILL.md`)
Embeds comprehensive frontend design system, accessibility (WCAG 2.1 AA), Radix headless primitives, Tailwind CSS v4 variables, responsive layout architecture, and zero-CLS performance standards.

### 6.3 Clean Code Craftsmanship Skill (`.agents/skills/clean-code-craftsmanship/SKILL.md`)
Enforces enterprise TypeScript discipline: zero-`any`, Zod contract-first validation, Clean Modular Architecture (routes, controllers, services, repositories), resilient database pooling, graceful shutdown signal trapping (`SIGINT`/`SIGTERM`), and AAA unit/integration testing with Vitest.

### 6.4 OpenSpec Integration (`openspec/config.yaml`)
Preconfigures spec-driven development workflows where features are proposed, reviewed, tested, and archived with clear traceability.

---

## 7. Generator Engine Architecture (`@forgestk/core`)

The generator engine implements a **Virtual Staging Engine** with a deterministic **Layered Recipe Pipeline**:

```mermaid
sequenceDiagram
    participant UI as CLI / Desktop Client
    participant Core as Generator Engine
    participant VFS as Virtual File System (Memory)
    participant Disk as Physical File System

    UI->>Core: invokeGenerate(projectConfig)
    Core->>VFS: Initialize staging buffer
    Core->>VFS: Apply Base Kernel (Monorepo/Polyrepo)
    Core->>VFS: Apply Framework Slices (React, Express/Fastify)
    Core->>VFS: Apply Feature Slices (Tailwind, DB, State, Auth)
    Core->>VFS: Merge & Resolve package.json dependencies
    Core->>VFS: Interpolate AST & Configuration files
    Core->>Disk: Pre-flight check (Check path availability & permissions)
    Core->>Disk: Atomic Flush (Write VFS to Disk)
    alt Flush or Install Error
        Core->>Disk: Rollback Routine (Delete created files)
        Core-->>UI: Return Error Diagnostic
    else Success
        Core->>Disk: Execute `git init` & Initial Commit
        Core->>Disk: Execute Package Manager (`pnpm install`)
        Core-->>UI: Emit Success & Next Steps
    end
```

### 7.1 Virtual File System & Recipe Composition
Instead of naive string concatenation, slices define atomic operations:
```typescript
export interface FileAction {
  type: 'CREATE' | 'OVERWRITE' | 'MERGE_JSON' | 'PATCH_AST' | 'APPEND';
  path: string;
  content?: string;
  merger?: (existing: any) => any;
  patcher?: (sourceFile: any) => void;
}

export interface FeatureSlice {
  id: string;
  name: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  scripts: Record<string, string>;
  actions: FileAction[];
}
```

### 7.2 Deterministic Dependency Matrix
Every dependency version is pinned in a central lockstep dictionary. Slices never declare independent, drifting version strings:
```typescript
export const DEPENDENCY_REGISTRY = {
  react: '^19.0.0',
  'react-dom': '^19.0.0',
  '@tanstack/react-query': '^5.66.0',
  '@reduxjs/toolkit': '^2.5.1',
  'react-redux': '^9.2.0',
  zustand: '^5.0.3',
  tailwindcss: '^4.0.0',
  sonner: '^2.0.0',
  'lucide-react': '^0.475.0',
  zod: '^3.24.2',
  'drizzle-orm': '^0.39.1',
  'drizzle-kit': '^0.30.4',
  pg: '^8.13.1',
  mongoose: '^8.10.0',
  fastify: '^5.2.1',
  pino: '^9.6.0',
  typescript: '^5.7.3',
  turbo: '^2.4.0',
} as const;
```

---

## 8. Client Interfaces Specification

### 8.1 CLI Interface (`@forgestk/cli`)
Distributed via `npx create-forgestack-app`.
- **Interactive Mode:** Built with `@clack/prompts` featuring colorful steps, validation guards, and keyboard shortcuts.
- **CI / Non-Interactive Mode:** Fully scriptable via CLI arguments:
  ```bash
  npx create-forgestack-app my-saas-app \
    --topology monorepo \
    --fe react-vite \
    --styling tailwind \
    --state tanstack-query \
    --be fastify \
    --db postgres \
    --orm drizzle \
    --pm pnpm \
    --ai-agents all \
    --git \
    --install
  ```

### 8.2 Desktop Application (`@forgestk/desktop`)
Built with **Tauri v2** + **Vite/React** + **Tailwind CSS**.

#### Application Screen Flow:
1. **Project Identity & Path Selector:**
   - Input: Project Name (auto-slugified).
   - Target Directory: Native OS File Dialog (via Tauri's native dialog plugin).
   - Validation: Checks if folder exists, is writeable, and is empty.
2. **Architecture Topology:**
   - Visual toggle cards:
     - Fullstack Monorepo (Turborepo + pnpm)
     - Standalone Frontend
     - Standalone Backend
3. **Frontend Configuration Matrix:**
   - Dropdown / Radio selection: React 19 (Vite) vs Next.js 15.
   - State Checkboxes: TanStack Query, Redux Toolkit, Zustand.
   - UI Extras: Tailwind CSS v4, Sonner Toaster, Lucide Icons, React Hook Form + Zod.
4. **Backend Configuration Matrix:**
   - Framework: Fastify / Express.
   - Database Engine: PostgreSQL / MongoDB / MySQL / None.
   - ORM / Driver: Drizzle ORM / Prisma / Mongoose.
   - Extras: Health check endpoints, Docker Compose generation (`docker-compose.yml`), Rate Limiting.
5. **AI Rules & Governance Checklist:**
   - Antigravity Agents (`.agents/`)
   - Cursor Rules (`.cursor/rules/`)
   - GitHub Copilot Instructions
   - OpenSpec Spec-driven workflow
6. **Live Interactive Inspector:**
   - Real-time virtual file tree showing exact folder hierarchy.
   - Dynamic `package.json` inspector previewing all resolved dependencies.
7. **Execution & Real-time Console:**
   - "Scaffold Project" execution button.
   - Terminal stream displaying staging, atomic writing, `git init`, and `pnpm install` progress.
   - Quick launch buttons: "Open in VS Code", "Open in Antigravity", "Open Directory", "Copy CD Command".

---

## 9. Docker & Containerization Support
For backend and monorepo configurations, ForgeStack automatically generates a production-grade multi-stage `Dockerfile` and a local `docker-compose.yml` pre-wired with the selected database:

### Generated `docker-compose.yml` (PostgreSQL Scenario)
```yaml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    ports:
      - '4000:4000'
    environment:
      - NODE_ENV=development
      - PORT=4000
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/app_dev?schema=public
    depends_on:
      postgres:
        condition: service_healthy

  postgres:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: app_dev
    ports:
      - '5432:5432'
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
```

---

## 10. Automated Quality Assurance & Maintenance

### 10.1 Daily CI Compatibility Matrix
To eliminate template decay, ForgeStack runs a GitHub Actions cron job across all permutation combinations:
- Tests Matrix: (3 Topologies) × (2 FE Frameworks) × (2 State libs) × (2 BE Frameworks) × (2 Databases).
- For each permutation:
  1. Executes CLI in headless mode.
  2. Runs `pnpm install`.
  3. Executes `turbo run build typecheck test`.
  4. Fails CI if any peer dependency warnings or TypeScript compilation errors are encountered.

### 10.2 Roadmap & Milestones
- **Phase 1 (Weeks 1–2):** Core VFS engine (`@forgestk/core`), Layered Slices, and Dependency Matrix.
- **Phase 2 (Weeks 3–4):** CLI implementation (`@forgestk/cli`) with `@clack/prompts` and flags.
- **Phase 3 (Weeks 5–6):** Tauri v2 Desktop App with native directory selector and live file-tree preview.
- **Phase 4 (Weeks 7–8):** OpenSpec workflows, Agent rules integration, Docker compose generation, and Daily Matrix CI.
