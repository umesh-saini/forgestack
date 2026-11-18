import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import {
  generateProjectVfs,
  TransactionalFlusher,
  ProcessRunner,
  projectConfigSchema,
  type ProjectConfig,
} from '@forgestack/core';
import { CURATED_TEMPLATES } from '../templates/curated.js';
import { TemplateStore } from '../templates/store.js';

export function createMcpServer(): Server {
  const server = new Server(
    {
      name: 'forgestack-mcp',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: 'forgestack_list_presets',
          description:
            'Lists all curated architectural blueprints and saved templates with their full configuration specifications.',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'forgestack_get_stack_options',
          description:
            'Returns all valid technology choices across architectures, frontend frameworks, backend frameworks, databases, ORMs, auth providers, and AI governance engines.',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'forgestack_validate_config',
          description:
            'Validates a proposed ForgeStack ProjectConfig object against type schemas and architectural rules before scaffolding.',
          inputSchema: {
            type: 'object',
            properties: {
              config: {
                type: 'object',
                description: 'The complete or partial ProjectConfig object to validate.',
              },
            },
            required: ['config'],
          },
        },
        {
          name: 'forgestack_preview_vfs',
          description:
            'Compiles a proposed project completely in-memory and returns the virtual file tree and file counts without touching physical disk.',
          inputSchema: {
            type: 'object',
            properties: {
              config: {
                type: 'object',
                description: 'The ProjectConfig specification to compile.',
              },
              includeContent: {
                type: 'boolean',
                description: 'Whether to include file text contents in the response (default: false).',
              },
            },
            required: ['config'],
          },
        },
        {
          name: 'forgestack_scaffold_project',
          description:
            'Atomically scaffolds and flushes a complete type-safe project onto physical storage with pre-flight checks and optional git/install hooks.',
          inputSchema: {
            type: 'object',
            properties: {
              config: {
                type: 'object',
                description: 'The ProjectConfig specification to synthesize.',
              },
              targetPath: {
                type: 'string',
                description: 'The absolute or relative destination directory on disk.',
              },
              force: {
                type: 'boolean',
                description: 'Whether to overwrite files if the target directory is not empty.',
              },
              gitInit: {
                type: 'boolean',
                description: 'Whether to initialize a git repository and create initial commit.',
              },
              runInstall: {
                type: 'boolean',
                description: 'Whether to execute dependency installation automatically.',
              },
            },
            required: ['config', 'targetPath'],
          },
        },
      ],
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    switch (name) {
      case 'forgestack_list_presets': {
        const saved = TemplateStore.loadSavedTemplates();
        const response = {
          curatedPresets: CURATED_TEMPLATES.map((p) => ({
            id: p.id,
            name: p.name,
            tagline: p.tagline,
            description: p.description,
            topology: p.config.topology,
            config: p.config,
          })),
          savedCustomTemplates: saved.map((s) => ({
            id: s.id,
            name: s.name,
            description: s.description,
            topology: s.config.topology,
            config: s.config,
          })),
        };
        return {
          content: [{ type: 'text', text: JSON.stringify(response, null, 2) }],
        };
      }

      case 'forgestack_get_stack_options': {
        const options = {
          topologies: [
            { id: 'monorepo', label: 'Enterprise Turborepo Monorepo' },
            { id: 'nextjs-fullstack', label: 'Next.js 15 Full-Stack' },
            { id: 'electron-desktop', label: 'Electron Desktop App (electron-vite)' },
            { id: 'separate-folders', label: 'Polyrepo (frontend/ & backend/)' },
            { id: 'standalone-fe', label: 'Frontend SPA' },
            { id: 'backend-api', label: 'Backend API Service' },
          ],
          frontendFrameworks: ['react-vite', 'nextjs', 'none'],
          backendFrameworks: ['fastify', 'express', 'clean-modular', 'none'],
          styling: ['tailwind', 'vanilla'],
          stateManagement: ['query', 'zustand', 'jotai', 'none'],
          databases: ['postgres', 'mongodb', 'sqlite', 'none'],
          orms: ['drizzle', 'prisma', 'mongoose', 'none'],
          authProviders: ['better-auth', 'none'],
          dateLibraries: ['dayjs', 'date-fns', 'moment', 'none'],
          processManagers: ['docker', 'pm2', 'none'],
          aiGovernanceEngines: ['openspec', 'gsd', 'speckit', 'all', 'none'],
          packageManagers: ['pnpm', 'npm', 'yarn', 'bun'],
        };
        return {
          content: [{ type: 'text', text: JSON.stringify(options, null, 2) }],
        };
      }

      case 'forgestack_validate_config': {
        const cfg = (args?.config || {}) as any;
        const parseResult = projectConfigSchema.safeParse(cfg);

        if (!parseResult.success) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    valid: false,
                    errors: parseResult.error.errors.map((e) => ({
                      path: e.path.join('.'),
                      message: e.message,
                    })),
                  },
                  null,
                  2
                ),
              },
            ],
          };
        }

        const validConfig = parseResult.data;
        const warnings: string[] = [];
        const recommendations: string[] = [];

        if (validConfig.topology === 'nextjs-fullstack' && validConfig.backend?.framework !== 'none') {
          warnings.push(
            'Next.js 15 contains integrated Server Actions & Route Handlers; a separate backend framework is optional.'
          );
        }

        if (validConfig.backend?.database === 'mongodb' && validConfig.backend?.orm !== 'mongoose') {
          warnings.push('MongoDB is typically paired with Mongoose or Prisma MongoDB adapter.');
        }

        if (validConfig.frontend?.framework === 'react-vite' && validConfig.frontend?.state === 'query') {
          recommendations.push('TanStack React Query v5 configured with Sonner notifications.');
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  valid: true,
                  warnings,
                  recommendations,
                  normalizedConfig: validConfig,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case 'forgestack_preview_vfs': {
        const cfg = (args?.config || {}) as any;
        const parseResult = projectConfigSchema.safeParse(cfg);
        if (!parseResult.success) {
          throw new Error(
            'Invalid ProjectConfig: ' + parseResult.error.errors.map((e) => e.message).join('; ')
          );
        }

        const vfs = await generateProjectVfs(parseResult.data);
        const includeContent = Boolean(args?.includeContent);

        const filesSummary = vfs.getAllFiles().map((f) => ({
          path: f.path,
          size: f.content.length,
          executable: f.executable || false,
          content: includeContent ? f.content : undefined,
        }));

        const response = {
          fileCount: vfs.count(),
          tree: vfs.toTree(),
          files: filesSummary,
        };

        return {
          content: [{ type: 'text', text: JSON.stringify(response, null, 2) }],
        };
      }

      case 'forgestack_scaffold_project': {
        const cfg = (args?.config || {}) as any;
        const targetPath = (args?.targetPath || '') as string;
        const force = Boolean(args?.force);
        const gitInit = args?.gitInit !== false;
        const runInstall = Boolean(args?.runInstall);

        if (!targetPath) {
          throw new Error('targetPath is required to scaffold a project.');
        }

        const parseResult = projectConfigSchema.safeParse({
          ...cfg,
          targetPath,
        });

        if (!parseResult.success) {
          throw new Error(
            'Invalid ProjectConfig: ' + parseResult.error.errors.map((e) => e.message).join('; ')
          );
        }

        const config = parseResult.data;
        const vfs = await generateProjectVfs(config);
        const flushResult = await TransactionalFlusher.flush(vfs, targetPath, { force });

        if (gitInit) {
          try {
            await ProcessRunner.run('git', ['init'], { cwd: targetPath });
            await ProcessRunner.run('git', ['add', '-A'], { cwd: targetPath });
            await ProcessRunner.run('git', ['commit', '-m', 'feat: initial scaffold by ForgeStack MCP'], {
              cwd: targetPath,
            });
          } catch {
            // Non-fatal if git is missing
          }
        }

        if (runInstall) {
          try {
            await ProcessRunner.run(config.packageManager || 'pnpm', ['install'], { cwd: targetPath });
          } catch {
            // Non-fatal if offline
          }
        }

        const response = {
          success: true,
          filesWritten: flushResult.filesWritten,
          targetPath,
          message: `Successfully scaffolded ${flushResult.filesWritten} files atomically to ${targetPath}.`,
        };

        return {
          content: [{ type: 'text', text: JSON.stringify(response, null, 2) }],
        };
      }

      default:
        throw new Error(`Unknown ForgeStack MCP tool: ${name}`);
    }
  });

  return server;
}

export async function runMcpServer(): Promise<void> {
  const server = createMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[ForgeStack MCP] Server connected over stdio (PID: ' + process.pid + ')');
}
