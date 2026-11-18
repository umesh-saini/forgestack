import { describe, expect, it } from 'vitest';
import { generateProjectVfs } from '../../../engine/create-pipeline.js';
import type { ProjectConfig } from '../../../types/config.js';

describe('Model Context Protocol (MCP) & Workflows Slice', () => {
  it('should scaffold @repo/mcp-server, IDE configs, and multi-agent workflows in monorepo', async () => {
    const config: ProjectConfig = {
      name: 'mcp-monorepo-test',
      targetPath: '/test/mcp-monorepo-test',
      topology: 'monorepo',
      frontend: {
        framework: 'react-vite',
        styling: 'tailwind',
        state: 'query',
        uiExtras: { toast: true, icons: true, forms: true },
      },
      backend: {
        framework: 'fastify',
        database: 'postgres',
        orm: 'drizzle',
        container: true,
      },
      aiGovernance: { rules: true, skills: true, openSpec: true, mcp: true },
      packageManager: 'pnpm',
      git: true,
      install: false,
    };

    const vfs = await generateProjectVfs(config);

    // 1. packages/mcp-server
    expect(vfs.hasFile('packages/mcp-server/package.json')).toBe(true);
    const mcpPkg = JSON.parse(vfs.getFileContent('packages/mcp-server/package.json')!);
    expect(mcpPkg.name).toBe('@repo/mcp-server');
    expect(mcpPkg.dependencies['@modelcontextprotocol/sdk']).toBeDefined();

    expect(vfs.hasFile('packages/mcp-server/src/index.ts')).toBe(true);
    const mcpSource = vfs.getFileContent('packages/mcp-server/src/index.ts')!;
    expect(mcpSource).toContain('inspect_database_schema');
    expect(mcpSource).toContain('run_spec_verification');
    expect(mcpSource).toContain('check_route_health');

    // 2. IDE / Agent configs
    expect(vfs.hasFile('.cursor/mcp.json')).toBe(true);
    const cursorMcp = JSON.parse(vfs.getFileContent('.cursor/mcp.json')!);
    expect(cursorMcp.mcpServers['repo-tools']).toBeDefined();

    expect(vfs.hasFile('.agents/mcp.json')).toBe(true);

    // 3. Multi-agent workflows
    expect(vfs.hasFile('.agents/workflows/agent-audit.md')).toBe(true);
    const auditWorkflow = vfs.getFileContent('.agents/workflows/agent-audit.md')!;
    expect(auditWorkflow).toContain('Multi-Perspective Agent Audit Workflow');
    expect(auditWorkflow).toContain('bugs-are-annoying');

    expect(vfs.hasFile('.agents/workflows/spec-verify.md')).toBe(true);
    const specWorkflow = vfs.getFileContent('.agents/workflows/spec-verify.md')!;
    expect(specWorkflow).toContain('OpenSpec Conformance Verification Workflow');
    expect(specWorkflow).toContain('npx openspec validate');
  });

  it('should not scaffold MCP server when aiGovernance.mcp is false', async () => {
    const config: ProjectConfig = {
      name: 'no-mcp-monorepo',
      targetPath: '/test/no-mcp-monorepo',
      topology: 'monorepo',
      frontend: {
        framework: 'react-vite',
        styling: 'tailwind',
        state: 'query',
        uiExtras: { toast: true, icons: true, forms: true },
      },
      backend: {
        framework: 'fastify',
        database: 'postgres',
        orm: 'drizzle',
        container: true,
      },
      aiGovernance: { rules: true, skills: true, openSpec: true, mcp: false },
      packageManager: 'pnpm',
      git: true,
      install: false,
    };

    const vfs = await generateProjectVfs(config);

    expect(vfs.hasFile('packages/mcp-server/package.json')).toBe(false);
    expect(vfs.hasFile('.cursor/mcp.json')).toBe(false);
  });
});
