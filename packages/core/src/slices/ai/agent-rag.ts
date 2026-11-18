import type { FeatureSlice } from '../../engine/compositor.js';
import { DEPENDENCY_REGISTRY } from '../../registry/dependencies.js';
import type { ProjectConfig } from '../../types/config.js';
import type { VirtualFileSystem } from '../../vfs/vfs.js';

export const agentRagSlice: FeatureSlice = {
  id: 'ai-agent-rag',
  name: 'AI-Native Agent & RAG Stack (Vercel AI SDK + pgvector)',
  apply: (vfs: VirtualFileSystem, config: ProjectConfig) => {
    if (config.topology !== 'ai-agent-rag') {
      return;
    }

    const apiPath = 'apps/api';
    const webPath = 'apps/web';

    // 1. Backend dependencies
    vfs.applyAction({
      type: 'MERGE_JSON',
      path: `${apiPath}/package.json`,
      content: {
        dependencies: {
          ai: DEPENDENCY_REGISTRY.ai,
          '@ai-sdk/openai': DEPENDENCY_REGISTRY['@ai-sdk/openai'],
          pgvector: DEPENDENCY_REGISTRY.pgvector,
        },
      },
    });

    // 2. Frontend dependencies
    vfs.applyAction({
      type: 'MERGE_JSON',
      path: `${webPath}/package.json`,
      content: {
        dependencies: {
          ai: DEPENDENCY_REGISTRY.ai,
        },
      },
    });

    // 3. apps/api/src/ai/vector-store.ts with pgvector Drizzle integration
    vfs.applyAction({
      type: 'CREATE',
      path: `${apiPath}/src/ai/vector-store.ts`,
      content: `import { customType, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { db } from '../database/client.js';

// Custom pgvector type for Drizzle ORM
export const vector = customType<{ data: number[]; driverData: string }>({
  dataType() {
    return 'vector(1536)';
  },
  toDriver(value: number[]): string {
    return JSON.stringify(value);
  },
  fromDriver(value: string): number[] {
    return JSON.parse(value);
  },
});

export const documentEmbeddings = pgTable('document_embeddings', {
  id: uuid('id').defaultRandom().primaryKey(),
  documentId: text('document_id').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  embedding: vector('embedding').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export async function findSimilarDocuments(queryEmbedding: number[], limit = 5) {
  const similarity = sql<number>\`1 - (\${documentEmbeddings.embedding} <=> \${JSON.stringify(queryEmbedding)}::vector)\`;
  return db
    .select({
      id: documentEmbeddings.id,
      title: documentEmbeddings.title,
      content: documentEmbeddings.content,
      similarity,
    })
    .from(documentEmbeddings)
    .orderBy(sql\`\${documentEmbeddings.embedding} <=> \${JSON.stringify(queryEmbedding)}::vector\`)
    .limit(limit);
}
`,
    });

    // 4. apps/api/src/ai/agent-service.ts with tool calling
    vfs.applyAction({
      type: 'CREATE',
      path: `${apiPath}/src/ai/agent-service.ts`,
      content: `import { streamText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { findSimilarDocuments } from './vector-store.js';

export async function runAgentStream(messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>) {
  return streamText({
    model: openai('gpt-4o'),
    system: 'You are an intelligent knowledge assistant capable of searching documents and retrieving context.',
    messages,
    tools: {
      searchKnowledgeBase: tool({
        description: 'Search document embeddings in pgvector database for relevant semantic knowledge',
        parameters: z.object({
          query: z.string().describe('The user query to search in the knowledge base'),
        }),
        execute: async ({ query }) => {
          // In production, embed query using embedding model then call findSimilarDocuments
          return [
            {
              id: 'doc-1',
              title: 'ForgeStack Architecture',
              snippet: \`Context retrieved for query "\${query}": ForgeStack builds scalable production software.\`,
            },
          ];
        },
      }),
    },
  });
}
`,
    });

    // 5. apps/api/src/modules/chat/chat.routes.ts streaming SSE endpoint
    const isHono = config.backend.framework === 'hono';
    const isFastify = config.backend.framework === 'fastify';

    if (isHono) {
      vfs.applyAction({
        type: 'CREATE',
        path: `${apiPath}/src/routes/chat.routes.ts`,
        content: `import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';
import { runAgentStream } from '../ai/agent-service.js';

export const chatRouter = new Hono();

chatRouter.post('/api/chat', async (c) => {
  const { messages } = await c.req.json();
  return streamSSE(c, async (stream) => {
    try {
      const result = await runAgentStream(messages);
      for await (const chunk of result.textStream) {
        await stream.writeSSE({ data: JSON.stringify({ text: chunk }) });
      }
      await stream.writeSSE({ data: '[DONE]' });
    } catch (err: any) {
      await stream.writeSSE({ data: JSON.stringify({ error: err.message }) });
    }
  });
});
`,
      });
    } else {
      vfs.applyAction({
        type: 'CREATE',
        path: `${apiPath}/src/modules/chat/chat.routes.ts`,
        content: isFastify
          ? `import type { FastifyPluginAsync } from 'fastify';
import { runAgentStream } from '../../ai/agent-service.js';

export const chatRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/api/chat', async (req, reply) => {
    const { messages } = req.body as { messages: any[] };

    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    try {
      const result = await runAgentStream(messages);
      for await (const chunk of result.textStream) {
        reply.raw.write(\`data: \${JSON.stringify({ text: chunk })}\\n\\n\`);
      }
      reply.raw.write('data: [DONE]\\n\\n');
    } catch (err: any) {
      reply.raw.write(\`data: \${JSON.stringify({ error: err.message })}\\n\\n\`);
    } finally {
      reply.raw.end();
    }
  });
};
`
          : `import { Router } from 'express';
import { runAgentStream } from '../../ai/agent-service.js';

export const chatRoutes = Router();

chatRoutes.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const result = await runAgentStream(messages);
    for await (const chunk of result.textStream) {
      res.write(\`data: \${JSON.stringify({ text: chunk })}\\n\\n\`);
    }
    res.write('data: [DONE]\\n\\n');
  } catch (err: any) {
    res.write(\`data: \${JSON.stringify({ error: err.message })}\\n\\n\`);
  } finally {
    res.end();
  }
});
`,
      });
    }

    // 6. apps/web/src/hooks/use-agent-chat.ts
    vfs.applyAction({
      type: 'CREATE',
      path: `${webPath}/src/hooks/use-agent-chat.ts`,
      content: `import { useState, useCallback, useRef } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export function useAgentChat(endpoint = '/api/chat') {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
      };

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setIsLoading(true);

      const assistantMessageId = crypto.randomUUID();
      setMessages((prev) => [
        ...prev,
        { id: assistantMessageId, role: 'assistant', content: '' },
      ]);

      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: newMessages }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.body) throw new Error('ReadableStream not supported');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6).trim();
              if (dataStr === '[DONE]') break;
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.text) {
                  accumulated += parsed.text;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessageId
                        ? { ...msg, content: accumulated }
                        : msg
                    )
                  );
                }
              } catch {
                // Ignore chunk parsing errors
              }
            }
          }
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Agent chat stream error:', err);
        }
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [messages, endpoint]
  );

  return {
    messages,
    isLoading,
    sendMessage,
    abort,
  };
}
`,
    });

    // 7. apps/web/src/components/chat-interface.tsx
    vfs.applyAction({
      type: 'CREATE',
      path: `${webPath}/src/components/chat-interface.tsx`,
      content: `import React, { useState } from 'react';
import { useAgentChat } from '../hooks/use-agent-chat.js';

export function ChatInterface() {
  const { messages, isLoading, sendMessage, abort } = useAgentChat();
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto border border-zinc-800 rounded-xl bg-zinc-950 p-4">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={\`p-3 rounded-lg text-sm \${
              m.role === 'user' ? 'bg-blue-600 text-white ml-auto max-w-[80%]' : 'bg-zinc-800 text-zinc-100 max-w-[80%]'
            }\`}
          >
            {m.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI agent..."
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {isLoading ? (
          <button
            type="button"
            onClick={abort}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium"
          >
            Send
          </button>
        )}
      </form>
    </div>
  );
}
`,
    });
  },
};
