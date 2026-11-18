import React, { useState } from 'react';
import {
  Layers,
  Server,
  Monitor,
  Database,
  ArrowRight,
  Sparkles,
  Bot,
  Zap,
  Cpu,
  Shield,
  Workflow,
  Radio,
  Share2,
} from 'lucide-react';
import type { ProjectConfig } from '@forgestack/core/browser';

interface Props {
  config: ProjectConfig;
}

interface TopologyNode {
  id: string;
  name: string;
  role: string;
  tech: string;
  tag: string;
  icon: React.ReactNode;
  port?: string;
  details: string;
}

interface CommunicationChannel {
  from: string;
  to: string;
  label: string;
  protocol: string;
}

export const TopologyVisualizer: React.FC<Props> = ({ config }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Derive topology nodes based on configuration
  const getTopologyData = (): { nodes: TopologyNode[]; channels: CommunicationChannel[] } => {
    switch (config.topology) {
      case 'monorepo':
        return {
          nodes: [
            {
              id: 'web',
              name: 'apps/web',
              role: 'Frontend UI Client',
              tech: `${config.frontend.framework} + ${config.frontend.styling}`,
              tag: 'Vite 6 / React 19',
              icon: <Monitor className="w-4 h-4 text-cyan-400" />,
              port: ':3000',
              details: 'SPA frontend with TanStack Query, Tailwind CSS v4, Lucide icons, and Sonner toast.',
            },
            {
              id: 'api',
              name: 'apps/api',
              role: 'Backend API Service',
              tech: `${config.backend.framework} + ${config.backend.database}`,
              tag: 'Clean Modular ESM',
              icon: <Server className="w-4 h-4 text-emerald-400" />,
              port: ':4000',
              details: `High-performance HTTP server using ${config.backend.framework} with connection pool and controller/service layers.`,
            },
            {
              id: 'contracts',
              name: '@repo/contracts',
              role: 'Type Contracts & RPC',
              tech: config.rpc === 'trpc' ? 'tRPC v11 + Zod' : 'TypeScript + Zod',
              tag: 'Shared Schema',
              icon: <Zap className="w-4 h-4 text-amber-400" />,
              details: 'Zero-overhead shared type contracts, DTO validations, and end-to-end type safety.',
            },
            {
              id: 'ui',
              name: '@repo/ui',
              role: 'Design System Primitives',
              tech: 'React 19 + Tailwind CSS',
              tag: 'Shared UI',
              icon: <Layers className="w-4 h-4 text-blue-400" />,
              details: 'Shared reusable component library and design tokens consumable across all applications.',
            },
            ...(config.aiGovernance.mcp
              ? [
                  {
                    id: 'mcp',
                    name: '@repo/mcp-server',
                    role: 'Model Context Protocol',
                    tech: '@modelcontextprotocol/sdk',
                    tag: 'AI Context',
                    icon: <Bot className="w-4 h-4 text-purple-400" />,
                    details: 'Exposes database schema introspection, delta verification, and health diagnostics to AI agents.',
                  },
                ]
              : []),
          ],
          channels: [
            {
              from: 'web',
              to: 'api',
              label: config.rpc === 'trpc' ? 'tRPC v11 Procedures' : 'REST / JSON API',
              protocol: config.rpc === 'trpc' ? 'trpc' : 'http/1.1',
            },
            {
              from: 'contracts',
              to: 'web',
              label: 'Typed Schemas & Hooks',
              protocol: 'import',
            },
            {
              from: 'contracts',
              to: 'api',
              label: 'Route Request / Response Types',
              protocol: 'import',
            },
            {
              from: 'ui',
              to: 'web',
              label: 'Design Primitives',
              protocol: 'import',
            },
          ],
        };

      case 'ai-agent-rag':
        return {
          nodes: [
            {
              id: 'web',
              name: 'apps/web',
              role: 'Streaming Chat Interface',
              tech: 'React 19 + useAgentChat',
              tag: 'Vite 6 / SSE Client',
              icon: <Monitor className="w-4 h-4 text-cyan-400" />,
              port: ':3000',
              details: 'Interactive AI chat client with SSE stream rendering, tool call visualizers, and state persistence.',
            },
            {
              id: 'api',
              name: 'apps/api',
              role: 'OpenAI Agent & Fastify',
              tech: 'Fastify + Tool Calling',
              tag: 'Agent Engine',
              icon: <Bot className="w-4 h-4 text-purple-400" />,
              port: ':4000',
              details: 'Agent controller orchestrating dynamic tool execution, conversational memory, and SSE response streams.',
            },
            {
              id: 'vector',
              name: 'PostgreSQL + pgvector',
              role: 'Vector Database & Embeddings',
              tech: 'Drizzle ORM + pgvector',
              tag: '1536-dim Cosine Search',
              icon: <Database className="w-4 h-4 text-emerald-400" />,
              port: ':5432',
              details: 'HNSW vector indexes for fast cosine similarity nearest-neighbor document semantic search.',
            },
            {
              id: 'mcp',
              name: '@repo/mcp-server',
              role: 'AI Context Provider',
              tech: 'Model Context Protocol',
              tag: 'Cursor & Agent Tools',
              icon: <Zap className="w-4 h-4 text-amber-400" />,
              details: 'Direct tool hooks for schema introspection and delta spec verification.',
            },
          ],
          channels: [
            {
              from: 'web',
              to: 'api',
              label: 'SSE EventStream & Prompt Stream',
              protocol: 'text/event-stream',
            },
            {
              from: 'api',
              to: 'vector',
              label: 'Cosine Similarity Query',
              protocol: 'pgvector / sql',
            },
            {
              from: 'mcp',
              to: 'api',
              label: 'Introspection & Verifications',
              protocol: 'mcp/stdio',
            },
          ],
        };

      case 'micro-frontend':
        return {
          nodes: [
            {
              id: 'shell',
              name: 'apps/shell',
              role: 'Host Application Shell',
              tech: '@module-federation/vite',
              tag: 'Host Shell :5000',
              icon: <Cpu className="w-4 h-4 text-teal-400" />,
              port: ':5000',
              details: 'Root container application that dynamically downloads and mounts federated remote widgets at runtime.',
            },
            {
              id: 'remote',
              name: 'apps/remote-dashboard',
              role: 'Federated Remote Widget',
              tech: '@module-federation/vite',
              tag: 'Remote :5001',
              icon: <Monitor className="w-4 h-4 text-indigo-400" />,
              port: ':5001',
              details: 'Independently deployable micro-application exposing ./DashboardWidget via Module Federation.',
            },
            {
              id: 'eventbus',
              name: '@repo/event-bus',
              role: 'Cross-Remote Communication',
              tech: 'CustomEvent / Typed Pub-Sub',
              tag: 'Shared Bus',
              icon: <Radio className="w-4 h-4 text-amber-400" />,
              details: 'Decoupled inter-application event messaging without direct coupling between remotes.',
            },
          ],
          channels: [
            {
              from: 'remote',
              to: 'shell',
              label: 'Dynamic Module Federation Remote Entry',
              protocol: 'esm/runtime',
            },
            {
              from: 'shell',
              to: 'eventbus',
              label: 'Global State Events',
              protocol: 'pub/sub',
            },
            {
              from: 'remote',
              to: 'eventbus',
              label: 'Widget Actions & Signals',
              protocol: 'pub/sub',
            },
          ],
        };

      case 'tauri-desktop':
        return {
          nodes: [
            {
              id: 'ui',
              name: 'src/ (Renderer)',
              role: 'Desktop Frontend UI',
              tech: 'React 19 + Tailwind v4 + Vite',
              tag: 'Webview Window',
              icon: <Monitor className="w-4 h-4 text-cyan-400" />,
              details: 'Lightweight client webview UI rendering UI controls and reactive state.',
            },
            {
              id: 'rust',
              name: 'src-tauri/ (Core)',
              role: 'Native Rust Engine',
              tech: 'Tauri v2 + Rust 2021',
              tag: 'Native Binary',
              icon: <Cpu className="w-4 h-4 text-amber-400" />,
              details: 'High-performance native executable managing window life cycle, OS APIs, and sandboxed IPC handlers.',
            },
            {
              id: 'ipc',
              name: 'Tauri IPC Bridge',
              role: 'Secure Communication Channel',
              tech: 'invoke() Handlers & Events',
              tag: 'Hardened IPC',
              icon: <Share2 className="w-4 h-4 text-blue-400" />,
              details: 'Type-safe serialization layer passing messages between Javascript Webview and Rust.',
            },
          ],
          channels: [
            {
              from: 'ui',
              to: 'ipc',
              label: 'invoke("greet") & FS commands',
              protocol: 'ipc://postMessage',
            },
            {
              from: 'ipc',
              to: 'rust',
              label: 'Dispatched Rust Handlers',
              protocol: 'rust-ffi',
            },
          ],
        };

      case 'distributed-worker':
        return {
          nodes: [
            {
              id: 'api',
              name: 'apps/api (Producer)',
              role: 'Task Ingestion API',
              tech: 'Fastify + BullMQ Producer',
              tag: 'HTTP Producer',
              icon: <Server className="w-4 h-4 text-emerald-400" />,
              port: ':4000',
              details: 'Receives client HTTP requests, validates payloads with Zod, and pushes task jobs into Redis queue.',
            },
            {
              id: 'redis',
              name: 'Redis Queue Broker',
              role: 'Distributed In-Memory Store',
              tech: 'Redis 7 (Alpine)',
              tag: 'Docker Compose',
              icon: <Database className="w-4 h-4 text-rose-400" />,
              port: ':6379',
              details: 'Persistent FIFO job queue with atomic job state transitions and retry backoff.',
            },
            {
              id: 'worker',
              name: 'src/worker.ts (Consumer)',
              role: 'Distributed Task Worker',
              tech: 'BullMQ Worker Process',
              tag: 'Background Worker',
              icon: <Workflow className="w-4 h-4 text-amber-400" />,
              details: 'Long-running consumer worker pulling tasks from Redis with concurrency throttling and failure recovery.',
            },
          ],
          channels: [
            {
              from: 'api',
              to: 'redis',
              label: 'taskQueue.add(name, data)',
              protocol: 'redis://',
            },
            {
              from: 'redis',
              to: 'worker',
              label: 'Job Dispatch & Heartbeat',
              protocol: 'redis-pubsub',
            },
          ],
        };

      default:
        return {
          nodes: [
            {
              id: 'app',
              name: config.name,
              role: 'Single Package Application',
              tech: `${config.frontend.framework} / ${config.backend.framework}`,
              tag: config.topology,
              icon: <Layers className="w-4 h-4 text-blue-400" />,
              details: 'Focused single-package project architecture with clean domain separation.',
            },
          ],
          channels: [],
        };
    }
  };

  const { nodes, channels } = getTopologyData();
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  return (
    <div className="ui-panel rounded-2xl p-5 border space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <Workflow className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--text-main)]">
              Architecture Topology Visualizer
            </h4>
            <p className="text-[11px] text-[var(--text-muted)]">
              Interactive package dependency and communication diagram
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 font-semibold">
            {config.topology}
          </span>
          {config.auth === 'better-auth' && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Better-Auth
            </span>
          )}
          {config.rpc === 'trpc' && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              tRPC v11
            </span>
          )}
        </div>
      </div>

      {/* Nodes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {nodes.map((node) => {
          const isSelected = selectedNode?.id === node.id;
          return (
            <div
              key={node.id}
              onClick={() => setSelectedNodeId(node.id)}
              className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all space-y-2 ${
                isSelected ? 'ui-active-ring scale-[1.02]' : 'ui-card-subtle opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg ui-panel border">{node.icon}</div>
                  <div>
                    <h5 className="font-bold text-xs">{node.name}</h5>
                    <p className="text-[10px] text-orange-400 font-mono">{node.tag}</p>
                  </div>
                </div>
                {node.port && (
                  <span className="text-[10px] font-mono opacity-60 px-1.5 py-0.5 rounded ui-card border">
                    {node.port}
                  </span>
                )}
              </div>
              <p className="text-[11px] opacity-70 leading-relaxed line-clamp-2">
                {node.role} • {node.tech}
              </p>
            </div>
          );
        })}
      </div>

      {/* Active Communication Channels */}
      {channels.length > 0 && (
        <div className="rounded-xl ui-card-subtle p-3 border space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-cyan-400" />
            <span>Active Communication & Protocol Channels</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
            {channels.map((ch, idx) => (
              <div
                key={idx}
                className="p-2 rounded-lg ui-card border flex items-center justify-between text-[11px]"
              >
                <div className="flex items-center gap-1.5 font-semibold text-orange-400">
                  <span>{ch.from}</span>
                  <ArrowRight className="w-3 h-3 text-white/40" />
                  <span>{ch.to}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="opacity-75">{ch.label}</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-orange-500/15 text-orange-400 border border-orange-500/30">
                    {ch.protocol}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Node Details */}
      {selectedNode && (
        <div className="p-3.5 rounded-xl ui-input border flex items-start gap-3">
          <div className="p-2 rounded-lg ui-panel border shrink-0">{selectedNode.icon}</div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-[var(--text-main)]">{selectedNode.name}</span>
              <span className="text-[10px] font-mono text-emerald-400">{selectedNode.role}</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {selectedNode.details}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
