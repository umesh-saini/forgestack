import { Command } from 'commander';
import path from 'node:path';
import * as p from '@clack/prompts';
import color from 'picocolors';
import {
  generateProjectVfs,
  TransactionalFlusher,
  ProcessRunner,
  projectConfigSchema,
  type ProjectConfig,
} from '@forgestack/core';
import { runInteractiveWizard } from './prompts/wizard.js';
import { CliReporter } from './ui/reporter.js';

export function createCli(): Command {
  const program = new Command();

  program
    .name('create-forgestack-app')
    .description('Scaffold production-grade monorepos and polyrepos with AI Agent rules')
    .argument('[name]', 'Project name')
    .option(
      '--topology <type>',
      'Architecture topology (monorepo, nextjs-fullstack, tauri-desktop, electron-desktop, ai-agent-rag, micro-frontend, distributed-worker, standalone-fe, standalone-be)'
    )
    .option('--fe <framework>', 'Frontend framework (react-vite, nextjs, none)')
    .option('--styling <type>', 'Frontend styling (tailwind, none)')
    .option('--state <type>', 'Frontend state (query, redux, zustand, none)')
    .option('--be <framework>', 'Backend framework (fastify, express, hono, none)')
    .option('--db <database>', 'Database engine (postgres, mongodb, sqlite, none)')
    .option('--orm <orm>', 'ORM / ODM (drizzle, prisma, mongoose, none)')
    .option('--auth <provider>', 'Authentication provider (better-auth, none)')
    .option('--rpc <protocol>', 'RPC contract layer (trpc, none)')
    .option('--queue <type>', 'Background queue (bullmq, none)')
    .option('--testing <framework>', 'E2E testing framework (playwright, none)')
    .option('--e2e <framework>', 'Alias for --testing (playwright, none)')
    .option('--ci <provider>', 'CI/CD pipeline (github-actions, none)')
    .option('--mcp', 'Include Model Context Protocol server', true)
    .option('--no-mcp', 'Skip Model Context Protocol server')
    .option('--container', 'Generate Docker Compose and Dockerfile', true)
    .option('--no-container', 'Skip Docker containerization')
    .option('--pm <manager>', 'Package manager (pnpm, npm, yarn, bun)', 'pnpm')
    .option('--git', 'Initialize git repository', true)
    .option('--no-git', 'Skip git initialization')
    .option('--install', 'Install dependencies automatically')
    .option('--no-install', 'Skip dependency installation')
    .option('--dry-run', 'Preview scaffolding without writing to disk')
    .action(async (nameArg?: string, options: Record<string, unknown> = {}) => {
      try {
        const isInteractive = !options.topology && !options.be && !options.fe;

        let config: ProjectConfig;

        if (isInteractive) {
          config = await runInteractiveWizard(nameArg);
        } else {
          const projectName = nameArg || (options.name as string) || 'my-app';
          const topology = (options.topology as any) || 'monorepo';
          const isFrontendOnly =
            topology === 'standalone-fe' ||
            topology === 'electron-desktop' ||
            topology === 'tauri-desktop' ||
            topology === 'micro-frontend';
          const isBackendOnly =
            topology === 'standalone-be' ||
            topology === 'distributed-worker';

          const db = isFrontendOnly ? 'none' : ((options.db as any) || (topology === 'distributed-worker' ? 'none' : 'postgres'));
          const defaultOrm =
            db === 'postgres'
              ? 'drizzle'
              : db === 'mongodb'
              ? 'mongoose'
              : db === 'sqlite'
              ? 'drizzle'
              : 'none';
          const orm = isFrontendOnly ? 'none' : ((options.orm as any) || defaultOrm);

          // Validate compatibility
          if (db === 'mongodb' && orm === 'drizzle') {
            throw new Error("Invalid option combination: MongoDB is not compatible with Drizzle ORM. Use '--orm mongoose'.");
          }
          if (db === 'postgres' && orm === 'mongoose') {
            throw new Error("Invalid option combination: PostgreSQL is not compatible with Mongoose. Use '--orm drizzle' or '--orm prisma'.");
          }
          if (db === 'sqlite' && orm === 'mongoose') {
            throw new Error("Invalid option combination: SQLite is not compatible with Mongoose. Use '--orm drizzle'.");
          }
          if (db === 'sqlite' && orm === 'prisma') {
            throw new Error("Invalid option combination: SQLite with Prisma is not supported. Use '--orm drizzle'.");
          }
          if (options.rpc === 'trpc' && topology !== 'monorepo' && topology !== 'ai-agent-rag') {
            throw new Error("Invalid option combination: tRPC requires a monorepo topology ('monorepo' or 'ai-agent-rag').");
          }

          config = projectConfigSchema.parse({
            name: projectName,
            targetPath: path.resolve(process.cwd(), projectName),
            topology,
            frontend: {
              framework:
                topology === 'nextjs-fullstack'
                  ? 'nextjs'
                  : isBackendOnly
                  ? 'none'
                  : (options.fe || 'react-vite'),
              styling: isBackendOnly ? 'none' : (options.styling || 'tailwind'),
              state: isBackendOnly ? 'none' : (options.state || 'query'),
              uiExtras: isBackendOnly
                ? { toast: false, icons: false, forms: false }
                : { toast: true, icons: true, forms: true },
            },
            backend: {
              framework: isFrontendOnly ? 'none' : (options.be || 'fastify'),
              database: db,
              orm,
              container: isFrontendOnly || db === 'sqlite' || db === 'none' ? false : options.container !== false,
              processManager: topology === 'distributed-worker' ? 'bullmq' : 'docker',
            },
            queue: topology === 'distributed-worker' ? 'bullmq' : ((options.queue as any) || 'none'),
            auth: (options.auth as any) || 'none',
            rpc: (options.rpc as any) || 'none',
            testing: {
              e2e: ((options.testing || options.e2e || 'none') as any),
            },
            ci: (options.ci as any) || 'none',
            aiGovernance: {
              rules: true,
              skills: true,
              openSpec: true,
              mcp: options.mcp !== false,
            },
            packageManager: options.pm || 'pnpm',
            git: options.git !== false,
            install: Boolean(options.install),
          });
        }

        // Execute Scaffolding
        const s = p.spinner();

        s.start('Staging files in Virtual File System (VFS)...');
        const vfs = await generateProjectVfs(config);
        s.stop(`Staged ${color.cyan(vfs.count())} files in memory.`);

        if (options.dryRun) {
          p.log.info(color.yellow('DRY RUN: Staged file list:'));
          for (const file of vfs.getAllFiles()) {
            console.log(`  ${color.dim('•')} ${file.path}`);
          }
          p.outro('Dry run completed. Zero physical disk mutations.');
          return;
        }

        s.start(`Flushing files atomically to ${color.bold(config.targetPath)}...`);
        const flushResult = await TransactionalFlusher.flush(vfs, config.targetPath);
        s.stop(`Written ${color.green(flushResult.filesWritten)} files to disk.`);

        if (config.git) {
          s.start('Initializing git repository...');
          try {
            await ProcessRunner.initGit(config.targetPath);
            s.stop('Git repository initialized with initial commit.');
          } catch (e) {
            s.stop(color.yellow('Git initialization failed or skipped: ' + (e as Error).message));
          }
        }

        if (config.install) {
          s.start(`Installing dependencies with ${color.cyan(config.packageManager)} (this may take a minute)...`);
          try {
            await ProcessRunner.installDependencies(config.targetPath, config.packageManager);
            s.stop(`Dependencies installed successfully with ${config.packageManager}.`);
          } catch (e) {
            s.stop(color.red('Dependency installation failed: ' + (e as Error).message));
          }
        }

        CliReporter.printSummary(config, config.targetPath);
      } catch (err) {
        p.log.error(color.red((err as Error).message));
        if (process.env.VITEST) {
          throw err;
        }
        process.exit(1);
      }
    });

  return program;
}
