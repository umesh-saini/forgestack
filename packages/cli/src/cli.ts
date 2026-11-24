import { Command } from 'commander';
import path from 'node:path';
import * as p from '@clack/prompts';
import color from 'picocolors';
import {
  generateProjectVfs,
  TransactionalFlusher,
  ProcessRunner,
  projectConfigSchema,
  normalizeConfig,
  type ProjectConfig,
  provisionAgentSkills,
  detectPresentTools,
  AGENT_TARGETS,
  type AgentToolId,
} from '@forgestack/core';
import { runInteractiveWizard } from './prompts/wizard.js';
import { CliReporter } from './ui/reporter.js';
import { resolveProjectDirectory } from './utils/directory.js';
import { CURATED_TEMPLATES, findCuratedTemplate } from './templates/curated.js';
import { TemplateStore } from './templates/store.js';
import { searchableMultiselect } from './ui/searchable-multiselect.js';

// clack's spinner redraws every frame; when output isn't a terminal (CI, pipes) that floods logs.
const spinner = () =>
  process.stdout.isTTY
    ? p.spinner()
    : { start: (msg = '') => p.log.step(msg), stop: (msg = '') => p.log.success(msg), message: (_msg?: string) => {} };

export function createCli(): Command {
  const program = new Command();

  program
    .name('create-forgestack-app')
    .description('Scaffold production-grade monorepos and polyrepos with AI Agent rules')
    .argument('[dir]', 'Project name or target directory (e.g. my-app or . for current directory)')
    .option('-y, --yes', 'Skip prompts and scaffold immediately with curated defaults')
    .option('-t, --template <name>', 'Scaffold using a curated default or saved custom template')
    .option('--save-template <name>', 'Save this stack configuration as a reusable local custom template')
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
    .option('--linter <type>', 'Linter & formatter (eslint, biome, none)', 'eslint')
    .option('--deploy <target>', 'Deployment target descriptor (docker, vercel, cloudflare, railway, fly, none)', 'docker')
    .option('--mcp', 'Include Model Context Protocol server', true)
    .option('--no-mcp', 'Skip Model Context Protocol server')
    .option('--rules', 'Include Cursor AI rules', true)
    .option('--no-rules', 'Skip Cursor AI rules')
    .option('--skills', 'Include AI Agent skills', true)
    .option('--no-skills', 'Skip AI Agent skills')
    .option('--init-ai-skills', 'Provision ForgeStack AI assistant skills across all detected AI tools')
    .option('--openspec', 'Include OpenSpec workflows', true)
    .option('--no-openspec', 'Skip OpenSpec workflows')
    .option('--claude', 'Include Claude Desktop MCP config', true)
    .option('--no-claude', 'Skip Claude Desktop MCP config')
    .option('--container', 'Generate Docker Compose and Dockerfile', true)
    .option('--no-container', 'Skip Docker containerization')
    .option('--force', 'Overwrite files in non-empty target directory')
    .option('--overwrite', 'Alias for --force')
    .option('--pm <manager>', 'Package manager (pnpm, npm, yarn, bun)', 'pnpm')
    .option('--git', 'Initialize git repository', true)
    .option('--no-git', 'Skip git initialization')
    .option('--install', 'Install dependencies automatically')
    .option('--no-install', 'Skip dependency installation')
    .option('--dry-run', 'Preview scaffolding without writing to disk')
    .action(async (dirArg?: string, options: Record<string, unknown> = {}) => {
      try {
        const isInteractive =
          !options.yes &&
          !options.template &&
          !options.topology &&
          !options.be &&
          !options.fe;
        const resolvedDir = resolveProjectDirectory(dirArg);

        if (!resolvedDir.isEmpty && !options.force && !options.overwrite) {
          if (isInteractive) {
            const confirmOverwrite = await p.confirm({
              message: `Target directory "${resolvedDir.targetPath}" is not empty. Continue and potentially overwrite existing files?`,
              initialValue: false,
            });
            if (!confirmOverwrite || p.isCancel(confirmOverwrite)) {
              p.cancel('Scaffolding cancelled to protect existing files.');
              process.exit(0);
            }
          } else {
            throw new Error(`Target directory "${resolvedDir.targetPath}" is not empty. Pass '--force' or '--overwrite' to proceed.`);
          }
        }

        let config: ProjectConfig;

        if (isInteractive) {
          config = await runInteractiveWizard(dirArg);
        } else if (options.template) {
          const templateName = String(options.template).trim();
          const resolved = TemplateStore.resolveAnyTemplate(templateName);
          if (!resolved) {
            throw new Error(
              `Template "${templateName}" not found. Run 'forgestack template list' to view available templates.`
            );
          }

          const projectName = resolvedDir.projectName;
          const targetPath = resolvedDir.targetPath;
          const tCfg = resolved.template.config;

          const shouldInstall =
            options.install === true ||
            (options.install !== false && Boolean(options.yes));

          config = projectConfigSchema.parse({
            ...tCfg,
            name: projectName,
            targetPath,
            packageManager: (options.pm as any) || tCfg.packageManager || 'pnpm',
            git: options.git !== false,
            install: shouldInstall,
            ...(options.topology ? { topology: options.topology } : {}),
            ...(options.fe ? { frontend: { ...tCfg.frontend, framework: options.fe } } : {}),
            ...(options.styling ? { frontend: { ...tCfg.frontend, styling: options.styling } } : {}),
            ...(options.state ? { frontend: { ...tCfg.frontend, state: options.state } } : {}),
            ...(options.be ? { backend: { ...tCfg.backend, framework: options.be } } : {}),
            ...(options.db ? { backend: { ...tCfg.backend, database: options.db } } : {}),
            ...(options.orm ? { backend: { ...tCfg.backend, orm: options.orm } } : {}),
            ...(options.auth !== undefined ? { auth: options.auth } : {}),
            ...(options.rpc !== undefined ? { rpc: options.rpc } : {}),
            ...(options.queue !== undefined ? { queue: options.queue } : {}),
            ...(options.ci !== undefined ? { ci: options.ci } : {}),
            ...(options.linter ? { linter: options.linter } : {}),
            ...(options.deploy ? { deployment: options.deploy } : {}),
            ...(options.container !== undefined ? { backend: { ...tCfg.backend, container: options.container !== false } } : {}),
            ...(options.rules !== undefined || options.skills !== undefined || options.openspec !== undefined || options.mcp !== undefined || options.claude !== undefined
              ? {
                  aiGovernance: {
                    ...tCfg.aiGovernance,
                    ...(options.rules !== undefined ? { rules: options.rules !== false } : {}),
                    ...(options.skills !== undefined ? { skills: options.skills !== false } : {}),
                    ...(options.openspec !== undefined ? { openSpec: options.openspec !== false } : {}),
                    ...(options.mcp !== undefined ? { mcp: options.mcp !== false } : {}),
                    ...(options.claude !== undefined ? { claude: options.claude !== false } : {}),
                  },
                }
              : {}),
          });
        } else {
          const projectName = resolvedDir.projectName;
          const targetPath = resolvedDir.targetPath;
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

          // In --yes mode, default to high-value primitives if monorepo
          const defaultAuth = options.yes && (topology === 'monorepo' || topology === 'ai-agent-rag') ? 'better-auth' : 'none';
          const defaultRpc = options.yes && (topology === 'monorepo' || topology === 'ai-agent-rag') ? 'trpc' : 'none';
          const defaultTesting = options.yes ? 'playwright' : 'none';
          const defaultCi = options.yes ? 'github-actions' : 'none';

          config = projectConfigSchema.parse({
            name: projectName,
            targetPath,
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
              // Next.js full-stack serves its API via route handlers; no separate server.
              framework: isFrontendOnly ? 'none' : (options.be || (topology === 'nextjs-fullstack' ? 'none' : 'fastify')),
              database: db,
              orm,
              container: isFrontendOnly || db === 'sqlite' || db === 'none' ? false : options.container !== false,
              processManager: topology === 'distributed-worker' ? 'bullmq' : 'docker',
            },
            queue: topology === 'distributed-worker' ? 'bullmq' : ((options.queue as any) || 'none'),
            auth: (options.auth as any) || defaultAuth,
            rpc: (options.rpc as any) || defaultRpc,
            testing: {
              e2e: ((options.testing || options.e2e || defaultTesting) as any),
            },
            ci: (options.ci as any) || defaultCi,
            linter: (options.linter as any) || 'eslint',
            deployment: (options.deploy as any) || (options.container === false ? 'none' : 'docker'),
            aiGovernance: {
              rules: options.rules !== false,
              skills: options.skills !== false,
              openSpec: options.openspec !== false,
              mcp: options.mcp !== false,
              claude: options.claude !== false,
            },
            packageManager: options.pm || 'pnpm',
            git: options.git !== false,
            install: options.install === true || (options.install !== false && Boolean(options.yes)),
          });
        }

        // Handle template saving if requested via flag
        if (options.saveTemplate) {
          const saveName = String(options.saveTemplate).trim();
          if (saveName) {
            TemplateStore.saveCustomTemplate(
              saveName,
              `Custom template based on ${config.topology} (${config.frontend.framework} + ${config.backend.framework})`,
              {
                topology: config.topology,
                frontend: config.frontend,
                backend: config.backend,
                auth: config.auth,
                rpc: config.rpc,
                queue: config.queue,
                testing: config.testing,
                ci: config.ci,
                utilities: config.utilities,
                aiGovernance: config.aiGovernance,
                packageManager: config.packageManager,
              }
            );
            p.log.success(
              color.green(`Saved configuration as custom template "${saveName}".`)
            );
          }
        }

        // Reconcile with topology up front so the summary reflects what's actually generated.
        config = normalizeConfig(config);
        let installFailed = false;

        // Execute Scaffolding
        const s = spinner();

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
            installFailed = true;
            process.exitCode = 1;
            s.stop(color.red('Dependency installation failed: ' + (e as Error).message));
          }
        }

        if (options.initAiSkills) {
          try {
            await provisionAgentSkills(config.targetPath);
            console.log(color.cyan('  ✓ AI agent skills provisioned across all detected assistant tools.'));
          } catch (skillErr) {
            console.warn(color.yellow('  ! Warning provisioning AI skills: ' + (skillErr as Error).message));
          }
        }

        CliReporter.printSummary(config, config.targetPath, undefined, installFailed);
      } catch (err) {
        p.log.error(color.red((err as Error).message));
        if (process.env.VITEST) {
          throw err;
        }
        process.exit(1);
      }
    });

  const templateCmd = program
    .command('template')
    .description('Manage curated and custom templates');

  templateCmd
    .command('list')
    .description('List all curated presets and saved custom templates')
    .action(() => {
      p.intro(color.bold(color.cyan('ForgeStack Templates Catalog')));

      console.log(color.bold('\n🌟 Curated Presets:'));
      for (const preset of CURATED_TEMPLATES) {
        console.log(
          `  ${color.cyan('•')} ${color.bold(preset.id.padEnd(24))} ${color.dim('│')} ${color.white(preset.name)}: ${color.dim(preset.tagline)}`
        );
      }

      const saved = TemplateStore.loadSavedTemplates();
      console.log(color.bold('\n📂 Saved Custom Templates:'));
      if (saved.length === 0) {
        console.log(
          color.dim(
            '  (No custom templates saved yet. Save with --save-template <name> or during interactive wizard)'
          )
        );
      } else {
        for (const t of saved) {
          console.log(
            `  ${color.green('•')} ${color.bold(t.id.padEnd(24))} ${color.dim('│')} ${color.white(t.name)}: ${color.dim(t.description)} ${color.dim(`(${new Date(t.createdAt).toLocaleDateString()})`)}`
          );
        }
      }
      console.log('');
      p.outro(`Use any template with: ${color.cyan('npx create-forgestack-app <dir> --template <id>')}`);
    });

  templateCmd
    .command('delete <name>')
    .description('Delete a saved custom template')
    .action((name: string) => {
      const curated = findCuratedTemplate(name);
      if (curated) {
        const err = `Cannot delete built-in curated preset "${name}". Only user-saved custom templates can be deleted.`;
        p.log.error(color.red(err));
        if (process.env.VITEST) {
          throw new Error(err);
        }
        process.exit(1);
      }
      const success = TemplateStore.deleteCustomTemplate(name);
      if (success) {
        p.log.success(color.green(`Custom template "${name}" was deleted successfully.`));
      } else {
        const err = `Custom template "${name}" not found.`;
        p.log.error(color.yellow(err));
        if (process.env.VITEST) {
          throw new Error(err);
        }
        process.exit(1);
      }
    });

  program
    .command('init-skills')
    .description('Provision ForgeStack AI assistant skills to the workspace across all tools')
    .argument('[dir]', 'Target directory (defaults to current directory)', '.')
    .option('-a, --all', 'Provision skills across all 40 available AI assistants non-interactively')
    .option(
      '-t, --tools <tools>',
      'Comma-separated list of tool IDs to configure (e.g. claude,cursor,antigravity)'
    )
    .action(
      async (
        dirArg: string,
        cmdOptions: { all?: boolean; tools?: string }
      ) => {
        const targetDir = path.resolve(process.cwd(), dirArg);
        p.intro(color.bold(color.cyan('ForgeStack AI Agent Skills Provisioner')));

        // 1. Detect present tools in workspace
        const detected = await detectPresentTools(targetDir);
        if (detected.length > 0) {
          const detectedNames = detected
            .map((id) => AGENT_TARGETS.find((t) => t.id === id)?.name || id)
            .join(', ');
          console.log(`  ${color.dim('Detected tool directories:')} ${color.yellow(detectedNames)}`);
        }

        let selectedToolIds: string[] = [];

        if (cmdOptions.all) {
          selectedToolIds = AGENT_TARGETS.map((t) => t.id);
        } else if (cmdOptions.tools) {
          selectedToolIds = cmdOptions.tools
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        } else if (process.stdin.isTTY && process.stdout.isTTY) {
          // Interactive searchable multiselect matching OpenSpec
          const initialSelected = detected.length > 0 ? detected : ['agents'];
          const items = AGENT_TARGETS.map((target) => ({
            id: target.id,
            label: target.name,
            hint: target.relativePath,
            selected: initialSelected.includes(target.id),
          }));

          selectedToolIds = await searchableMultiselect({
            message: 'Select tools to set up',
            items,
            pageSize: 10,
            initialSelected,
          });

          if (selectedToolIds.length === 0) {
            p.outro(color.yellow('No AI assistant tools selected. Exiting without changes.'));
            return;
          }
        } else {
          // Headless default
          selectedToolIds = detected.length > 0 ? detected : ['agents'];
        }

        const s = spinner();
        s.start(`Writing skills across ${selectedToolIds.length} AI assistants...`);
        try {
          const results = await provisionAgentSkills(
            targetDir,
            selectedToolIds as AgentToolId[]
          );
          s.stop(`Provisioned skills for ${results.filter((r) => r.success).length} AI assistants.`);

          for (const res of results) {
            if (res.success) {
              console.log(
                `  ${color.green('✓')} ${color.bold(res.targetName.padEnd(28))} ${color.dim('→')} ${color.dim(path.relative(targetDir, res.filePath))}`
              );
            } else {
              console.log(
                `  ${color.red('✗')} ${color.bold(res.targetName)}: ${color.red(res.message || 'Failed')}`
              );
            }
          }
          p.outro(
            color.green(
              'AI assistants can now understand ForgeStack commands, VFS, and architecture!'
            )
          );
        } catch (err: any) {
          s.stop(color.red('Provisioning failed: ' + err.message));
          if (process.env.VITEST) throw err;
          process.exit(1);
        }
      }
    );

  return program;
}
