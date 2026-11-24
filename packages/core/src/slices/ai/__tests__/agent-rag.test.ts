import { describe, expect, it } from 'vitest';
import { generateProjectVfs } from '../../../engine/create-pipeline.js';
import type { ProjectConfig } from '../../../types/config.js';

describe('AI-Native Agent & RAG Archetype Slice', () => {
  it('should scaffold full-stack AI agent with pgvector, SSE streaming, and React hook', async () => {
    const config: ProjectConfig = {
      name: 'ai-copilot-app',
      targetPath: '/test/ai-copilot-app',
      topology: 'ai-agent-rag',
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
      aiGovernance: { rules: true, skills: true, openSpec: true },
      packageManager: 'pnpm',
      git: true,
      install: false,
    };

    const vfs = await generateProjectVfs(config);

    // 1. Dependencies
    const apiPkg = JSON.parse(vfs.getFileContent('apps/api/package.json')!);
    expect(apiPkg.dependencies.ai).toBeDefined();
    expect(apiPkg.dependencies['@ai-sdk/openai']).toBeDefined();
    expect(apiPkg.dependencies.pgvector).toBeDefined();

    const webPkg = JSON.parse(vfs.getFileContent('apps/web/package.json')!);
    expect(webPkg.dependencies.ai).toBeDefined();

    // 2. Vector Store with pgvector
    expect(vfs.hasFile('apps/api/src/ai/vector-store.ts')).toBe(true);
    const vectorStore = vfs.getFileContent('apps/api/src/ai/vector-store.ts')!;
    expect(vectorStore).toContain('findSimilarDocuments');
    // Table lives in the drizzle schema folder so migrations pick it up
    const embeddings = vfs.getFileContent('apps/api/src/database/schema/embeddings.ts')!;
    expect(embeddings).toContain("pgTable('document_embeddings'");
    expect(embeddings).toContain("vector('embedding')");
    expect(vfs.getFileContent('apps/api/src/database/schema/index.ts')).toContain("'./embeddings.js'");

    // 3. Agent Tool Calling Service
    expect(vfs.hasFile('apps/api/src/ai/agent-service.ts')).toBe(true);
    const agentService = vfs.getFileContent('apps/api/src/ai/agent-service.ts')!;
    expect(agentService).toContain("import { streamText, tool } from 'ai';");
    expect(agentService).toContain('searchKnowledgeBase: tool({');

    // 4. SSE Streaming Routes
    expect(vfs.hasFile('apps/api/src/modules/chat/chat.routes.ts')).toBe(true);
    const chatRoutes = vfs.getFileContent('apps/api/src/modules/chat/chat.routes.ts')!;
    expect(chatRoutes).toContain("'Content-Type': 'text/event-stream'");
    expect(chatRoutes).toContain('for await (const chunk of result.textStream)');

    // 5. React useAgentChat hook
    expect(vfs.hasFile('apps/web/src/hooks/use-agent-chat.ts')).toBe(true);
    const hookContent = vfs.getFileContent('apps/web/src/hooks/use-agent-chat.ts')!;
    expect(hookContent).toContain('export function useAgentChat(');
    expect(hookContent).toContain('const reader = response.body.getReader();');
    expect(hookContent).toContain('abortControllerRef.current.abort();');

    // 6. Chat Component
    expect(vfs.hasFile('apps/web/src/components/chat-interface.tsx')).toBe(true);
  });

  it('should not scaffold AI RAG files for standard monorepo topology', async () => {
    const config: ProjectConfig = {
      name: 'standard-monorepo',
      targetPath: '/test/standard-monorepo',
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
      aiGovernance: { rules: true, skills: true, openSpec: true },
      packageManager: 'pnpm',
      git: true,
      install: false,
    };

    const vfs = await generateProjectVfs(config);

    expect(vfs.hasFile('apps/api/src/ai/vector-store.ts')).toBe(false);
    expect(vfs.hasFile('apps/web/src/hooks/use-agent-chat.ts')).toBe(false);
  });
});
