import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createMcpServer } from '../mcp/server.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';

describe('ForgeStack Zero-OAuth MCP Server', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'forgestack-mcp-test-'));
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('registers all 5 required tools with schemas', async () => {
    const server = createMcpServer();
    const handler = (server as any)._requestHandlers.get(ListToolsRequestSchema.shape.method.value);
    expect(handler).toBeDefined();

    const response = await handler({ method: 'tools/list', params: {} });
    expect(response.tools).toHaveLength(5);

    const toolNames = response.tools.map((t: any) => t.name);
    expect(toolNames).toContain('forgestack_list_presets');
    expect(toolNames).toContain('forgestack_get_stack_options');
    expect(toolNames).toContain('forgestack_validate_config');
    expect(toolNames).toContain('forgestack_preview_vfs');
    expect(toolNames).toContain('forgestack_scaffold_project');
  });

  it('lists curated presets via forgestack_list_presets', async () => {
    const server = createMcpServer();
    const callHandler = (server as any)._requestHandlers.get(CallToolRequestSchema.shape.method.value);

    const result = await callHandler({
      method: 'tools/call',
      params: {
        name: 'forgestack_list_presets',
        arguments: {},
      },
    });

    expect(result.content).toHaveLength(1);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.curatedPresets.length).toBeGreaterThan(0);
    expect(parsed.curatedPresets[0]).toHaveProperty('topology');
  });

  it('validates configs and reports errors on bad inputs', async () => {
    const server = createMcpServer();
    const callHandler = (server as any)._requestHandlers.get(CallToolRequestSchema.shape.method.value);

    // Invalid config (missing name, invalid topology)
    const badResult = await callHandler({
      method: 'tools/call',
      params: {
        name: 'forgestack_validate_config',
        arguments: {
          config: { topology: 'invalid-topology' },
        },
      },
    });

    const parsedBad = JSON.parse(badResult.content[0].text);
    expect(parsedBad.valid).toBe(false);
    expect(parsedBad.errors.length).toBeGreaterThan(0);

    // Valid config
    const goodResult = await callHandler({
      method: 'tools/call',
      params: {
        name: 'forgestack_validate_config',
        arguments: {
          config: {
            name: 'my-good-app',
            targetPath: tempDir,
            topology: 'monorepo',
            frontend: { framework: 'react-vite', styling: 'tailwind', state: 'query' },
            backend: { framework: 'fastify', database: 'postgres', orm: 'drizzle' },
          },
        },
      },
    });

    const parsedGood = JSON.parse(goodResult.content[0].text);
    expect(parsedGood.valid).toBe(true);
  });

  it('previews VFS without touching physical disk', async () => {
    const server = createMcpServer();
    const callHandler = (server as any)._requestHandlers.get(CallToolRequestSchema.shape.method.value);

    const result = await callHandler({
      method: 'tools/call',
      params: {
        name: 'forgestack_preview_vfs',
        arguments: {
          config: {
            name: 'preview-app',
            targetPath: tempDir,
            topology: 'monorepo',
            frontend: { framework: 'react-vite', styling: 'tailwind', state: 'query' },
            backend: { framework: 'fastify', database: 'postgres', orm: 'drizzle' },
          },
        },
      },
    });

    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.fileCount).toBeGreaterThan(10);
    expect(parsed.tree.length).toBeGreaterThan(0);

    // Verify tempDir is still completely empty (VFS was memory only)
    const filesOnDisk = await fs.readdir(tempDir);
    expect(filesOnDisk).toHaveLength(0);
  });

  it('atomically scaffolds project to physical disk', async () => {
    const server = createMcpServer();
    const callHandler = (server as any)._requestHandlers.get(CallToolRequestSchema.shape.method.value);

    const projectPath = path.join(tempDir, 'scaffolded-mcp-app');

    const result = await callHandler({
      method: 'tools/call',
      params: {
        name: 'forgestack_scaffold_project',
        arguments: {
          targetPath: projectPath,
          gitInit: false,
          runInstall: false,
          config: {
            name: 'scaffolded-mcp-app',
            targetPath: projectPath,
            topology: 'standalone-fe',
            frontend: { framework: 'react-vite', styling: 'tailwind', state: 'query' },
            backend: { framework: 'none', database: 'none', orm: 'none' },
          },
        },
      },
    });

    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.filesWritten).toBeGreaterThan(0);

    // Verify files exist on disk
    const pkgJsonExists = await fs
      .stat(path.join(projectPath, 'package.json'))
      .then(() => true)
      .catch(() => false);
    expect(pkgJsonExists).toBe(true);
  });
});
