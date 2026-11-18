import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Edges, OrbitControls, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Terminal,
  Copy,
  Check,
  Download,
  Play,
  RotateCcw,
  Sparkles as SparklesIcon,
  Code2,
  Database,
  Cpu,
  ShieldCheck,
  FolderTree,
  FileCode,
  ArrowRight,
  Box,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useThemeAccent } from '../../lib/motion.js';

/* ------------------------------------------------------------------ */
/* Preset Configurations & Real Code Templates                        */
/* ------------------------------------------------------------------ */

type PresetId = 'monorepo' | 'nextjs' | 'desktop' | 'ai-mcp';

interface PresetData {
  id: PresetId;
  name: string;
  badge: string;
  command: string;
  filesCount: number;
  vfsTime: string;
  description: string;
  tree: { path: string; tag: string; icon: string }[];
  codePreview: { filename: string; code: string };
  moduleColors: {
    frontend: string;
    backend: string;
    database: string;
    governance: string;
  };
}

const PRESETS: Record<PresetId, PresetData> = {
  monorepo: {
    id: 'monorepo',
    name: 'Enterprise Monorepo',
    badge: 'TURBOREPO + REACT 19 + FASTIFY',
    command: 'npx create-forgestack-app my-app --topology monorepo --fe react-vite --be fastify --db postgres --orm drizzle',
    filesCount: 44,
    vfsTime: '12ms RAM',
    description: 'High-velocity monorepo with Turborepo caching, React 19 micro-frontend, Fastify 5 modular API, and PostgreSQL Drizzle ORM.',
    tree: [
      { path: 'apps/web/src/App.tsx', tag: 'React 19 + Tailwind v4', icon: '⚛️' },
      { path: 'apps/api/src/server.ts', tag: 'Fastify 5 REST Engine', icon: '⚡' },
      { path: 'packages/db/src/schema.ts', tag: 'PostgreSQL + Drizzle', icon: '🐬' },
      { path: 'packages/ui/src/button.tsx', tag: 'Shared Component Token', icon: '🎨' },
      { path: '.agents/skills/forgestack/SKILL.md', tag: 'Universal AI Skill', icon: '🤖' },
      { path: 'turbo.json', tag: 'Pipeline Remote Cache', icon: '🚀' },
    ],
    codePreview: {
      filename: 'apps/api/src/server.ts',
      code: `import Fastify from 'fastify';
import { db } from '@my-app/db';
import { users } from '@my-app/db/schema';

const app = Fastify({ logger: true });

app.get('/api/users', async (req, reply) => {
  const result = await db.select().from(users).limit(50);
  return reply.send({ users: result, latency: '0.4ms' });
});

await app.listen({ port: 3001, host: '0.0.0.0' });`,
    },
    moduleColors: {
      frontend: '#61dafb', // React cyan
      backend: '#f97316',  // Fastify orange
      database: '#3b82f6', // Postgres blue
      governance: '#10b981', // AI emerald
    },
  },

  nextjs: {
    id: 'nextjs',
    name: 'Next.js 15 Full-Stack',
    badge: 'APP ROUTER + SERVER ACTIONS',
    command: 'npx create-forgestack-app my-app --topology nextjs-fullstack --db postgres --orm drizzle --auth better-auth',
    filesCount: 36,
    vfsTime: '11ms RAM',
    description: 'App Router architecture with React 19 Server Actions, Drizzle type-safe queries, and Better-Auth session management.',
    tree: [
      { path: 'app/page.tsx', tag: 'React 19 Server Component', icon: '▲' },
      { path: 'app/api/health/route.ts', tag: 'Edge Route Handler', icon: '⚡' },
      { path: 'lib/db/schema.ts', tag: 'Drizzle Postgres Tables', icon: '🐬' },
      { path: 'lib/auth.ts', tag: 'Better-Auth Type-Safe Auth', icon: '🛡️' },
      { path: '.agents/skills/forgestack/SKILL.md', tag: 'Universal AI Skill', icon: '🤖' },
      { path: 'drizzle.config.ts', tag: 'Database Migrations', icon: '📦' },
    ],
    codePreview: {
      filename: 'app/actions/users.ts',
      code: `'use server';

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { auth } from '@/lib/auth';

export async function createTenantUser(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');
  
  const [created] = await db.insert(users).values({
    email: String(formData.get('email')),
    role: 'engineer',
  }).returning();
  
  return { success: true, user: created };
}`,
    },
    moduleColors: {
      frontend: '#ffffff', // Next.js white
      backend: '#06b6d4',  // Edge cyan
      database: '#f59e0b', // Drizzle amber
      governance: '#10b981', // AI emerald
    },
  },

  desktop: {
    id: 'desktop',
    name: 'Tauri v2 Desktop App',
    badge: 'NATIVE RUST + MONACO STUDIO',
    command: 'npx create-forgestack-app my-app --topology tauri-desktop --install --git',
    filesCount: 38,
    vfsTime: '14ms RAM',
    description: 'Desktop GUI with native Rust IPC kernel, Monaco real-time editor workspace, and Debian/AppImage packaging.',
    tree: [
      { path: 'src-tauri/src/main.rs', tag: 'Native Rust Kernel & IPC', icon: '🦀' },
      { path: 'src-tauri/tauri.conf.json', tag: 'Tauri v2 App Config', icon: '⚙️' },
      { path: 'src/App.tsx', tag: 'React 19 Studio Webview', icon: '⚛️' },
      { path: 'src/editor/Monaco.tsx', tag: 'In-Memory VFS Monaco', icon: '💻' },
      { path: '.agents/skills/forgestack/SKILL.md', tag: 'Universal AI Skill', icon: '🤖' },
      { path: 'package.json', tag: 'Desktop Scripts & Vite', icon: '📦' },
    ],
    codePreview: {
      filename: 'src-tauri/src/main.rs',
      code: `// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn scaffold_project_files(payload: ScaffoldPayload) -> Result<usize, String> {
    let count = write_atomic_vfs(&payload.target_path, &payload.files)?;
    init_git_repo(&payload.target_path)?;
    Ok(count)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![scaffold_project_files])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}`,
    },
    moduleColors: {
      frontend: '#a855f7', // Tauri purple
      backend: '#ea580c',  // Rust orange
      database: '#64748b', // Native disk slate
      governance: '#10b981', // AI emerald
    },
  },

  'ai-mcp': {
    id: 'ai-mcp',
    name: 'Autonomous AI RAG',
    badge: 'ZERO-OAUTH MCP + OPENSPEC',
    command: 'npx create-forgestack-app my-app --topology ai-agent-rag --mcp --skills --rules',
    filesCount: 48,
    vfsTime: '15ms RAM',
    description:
      'Autonomous AI development setup with local Model Context Protocol server, OpenSpec specifications, and 40 AI agent skills.',
    tree: [
      { path: 'packages/mcp/src/server.ts', tag: 'Zero-OAuth MCP Server', icon: '🤖' },
      { path: '.agents/skills/forgestack/SKILL.md', tag: 'Canonical AI Skill', icon: '📜' },
      { path: '.cursor/rules/forgestack.mdc', tag: 'Cursor Agent Rules', icon: '⚡' },
      { path: 'openspec/specs/architecture.md', tag: 'Spec-Driven Delivery', icon: '📐' },
      { path: 'packages/core/src/vfs.ts', tag: 'In-Memory AST Engine', icon: '🧠' },
      { path: 'docker-compose.yml', tag: 'Local LLM / Redis Cache', icon: '🐳' },
    ],
    codePreview: {
      filename: 'packages/mcp/src/server.ts',
      code: `import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { generateProjectVfs, TransactionalFlusher } from '@forgestack/core';

// Zero-OAuth Local stdio MCP Server for AI Agents
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'forgestack_scaffold_project') {
    const config = validateConfig(request.params.arguments);
    const vfs = await generateProjectVfs(config);
    const result = await TransactionalFlusher.flush(vfs, config.targetPath);
    return { content: [{ type: 'text', text: \`Written \${result.filesWritten} files atomically.\` }] };
  }
});`,
    },
    moduleColors: {
      frontend: '#10b981', // AI emerald
      backend: '#eab308',  // MCP amber
      database: '#06b6d4', // Vector/DB cyan
      governance: '#ec4899', // OpenSpec rose
    },
  },
};

/* ------------------------------------------------------------------ */
/* 3D Real Tech Architecture Motherboard Scene                        */
/* ------------------------------------------------------------------ */

interface Motherboard3DProps {
  preset: PresetData;
  activeModule: 'all' | 'frontend' | 'backend' | 'database' | 'ai';
  onSelectModule: (mod: 'frontend' | 'backend' | 'database' | 'ai') => void;
}

const RealTechMotherboard: React.FC<Motherboard3DProps> = ({
  preset,
  activeModule,
  onSelectModule,
}) => {
  const boardRef = useRef<THREE.Group>(null);
  const reactRingsRef = useRef<THREE.Group>(null);
  const aiCoreRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    // Gentle rotation of the whole architecture motherboard
    if (boardRef.current) {
      boardRef.current.rotation.y += delta * 0.18;
    }
    // Spin React atom orbital rings
    if (reactRingsRef.current) {
      reactRingsRef.current.rotation.z += delta * 0.8;
      reactRingsRef.current.rotation.x += delta * 0.3;
    }
    // Pulse and spin AI neural core
    if (aiCoreRef.current) {
      aiCoreRef.current.rotation.y += delta * 0.5;
      aiCoreRef.current.rotation.x = Math.sin(performance.now() * 0.002) * 0.3;
    }
  });

  const { frontend, backend, database, governance } = preset.moduleColors;

  return (
    <group ref={boardRef} rotation={[0.45, 0, 0]}>
      {/* 1. ARCHITECTURAL MOTHERBOARD BASE PLATE (VFS Silicon Substrate) */}
      <mesh position={[0, -0.6, 0]} receiveShadow>
        <boxGeometry args={[4.8, 0.22, 4.8]} />
        <meshStandardMaterial
          color="#090d16"
          roughness={0.25}
          metalness={0.85}
        />
        <Edges threshold={15} color="#1e293b" />
      </mesh>

      {/* Circuit bus traces engraved on the board */}
      <mesh position={[0, -0.47, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.4, 4.4]} />
        <meshBasicMaterial color="#0f172a" wireframe transparent opacity={0.4} />
      </mesh>

      {/* 2. MODULE A: FRONTEND TECH SLAB (Top-Left: React 19 / Next.js Atom) */}
      <group
        position={[-1.35, -0.2, -1.35]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectModule('frontend');
        }}
      >
        <mesh castShadow>
          <boxGeometry args={[1.5, 0.4, 1.5]} />
          <meshStandardMaterial
            color="#0b1329"
            emissive={frontend}
            emissiveIntensity={activeModule === 'frontend' || activeModule === 'all' ? 0.4 : 0.15}
            roughness={0.2}
            metalness={0.8}
          />
          <Edges threshold={15} color={frontend} />
        </mesh>

        {/* 3D React Atom Orbital Rings */}
        <group ref={reactRingsRef} position={[0, 0.5, 0]}>
          <mesh>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color={frontend} emissive={frontend} emissiveIntensity={0.8} />
          </mesh>
          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[0.55, 0.02, 16, 48]} />
            <meshBasicMaterial color={frontend} />
          </mesh>
          <mesh rotation={[-Math.PI / 3, 0, 0]}>
            <torusGeometry args={[0.55, 0.02, 16, 48]} />
            <meshBasicMaterial color={frontend} />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.55, 0.02, 16, 48]} />
            <meshBasicMaterial color={frontend} />
          </mesh>
        </group>
      </group>

      {/* 3. MODULE B: BACKEND API SERVER TOWER (Top-Right: Fastify / Express Hex) */}
      <group
        position={[1.35, -0.15, -1.35]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectModule('backend');
        }}
      >
        <mesh castShadow>
          <cylinderGeometry args={[0.85, 0.95, 0.5, 6]} />
          <meshStandardMaterial
            color="#1c120c"
            emissive={backend}
            emissiveIntensity={activeModule === 'backend' || activeModule === 'all' ? 0.4 : 0.15}
            roughness={0.2}
            metalness={0.85}
          />
          <Edges threshold={15} color={backend} />
        </mesh>

        {/* Floating Server CPU Heat-sink fins */}
        {[0.12, 0.24, 0.36].map((yOffset, i) => (
          <mesh key={i} position={[0, yOffset + 0.3, 0]}>
            <cylinderGeometry args={[0.65 - i * 0.08, 0.65 - i * 0.08, 0.04, 6]} />
            <meshStandardMaterial
              color="#334155"
              emissive={backend}
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}
      </group>

      {/* 4. MODULE C: DATABASE STORAGE CLUSTER (Bottom-Left: PostgreSQL / Drizzle Disks) */}
      <group
        position={[-1.35, -0.1, 1.35]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectModule('database');
        }}
      >
        {/* 3 Layered Database Cylinder Platters */}
        {[0, 0.22, 0.44].map((y, i) => (
          <mesh key={i} position={[0, y, 0]} castShadow>
            <cylinderGeometry args={[0.75, 0.75, 0.16, 32]} />
            <meshStandardMaterial
              color="#0d1b2a"
              emissive={database}
              emissiveIntensity={activeModule === 'database' || activeModule === 'all' ? 0.4 : 0.15}
              roughness={0.15}
              metalness={0.9}
            />
            <Edges threshold={15} color={database} />
          </mesh>
        ))}
      </group>

      {/* 5. MODULE D: AI GOVERNANCE & MCP QUANTUM NODE (Bottom-Right: 40 AI Tool Core) */}
      <group
        position={[1.35, -0.1, 1.35]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectModule('ai');
        }}
      >
        <mesh castShadow>
          <boxGeometry args={[1.5, 0.4, 1.5]} />
          <meshStandardMaterial
            color="#062017"
            emissive={governance}
            emissiveIntensity={activeModule === 'ai' || activeModule === 'all' ? 0.4 : 0.15}
            roughness={0.2}
            metalness={0.8}
          />
          <Edges threshold={15} color={governance} />
        </mesh>

        {/* Floating AI Neural Octahedron with concentric ring */}
        <group ref={aiCoreRef} position={[0, 0.55, 0]}>
          <mesh>
            <octahedronGeometry args={[0.38, 0]} />
            <meshStandardMaterial
              color={governance}
              emissive={governance}
              emissiveIntensity={0.8}
            />
            <Edges threshold={15} color="#ffffff" />
          </mesh>
          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <torusGeometry args={[0.62, 0.02, 16, 48]} />
            <meshBasicMaterial color={governance} />
          </mesh>
        </group>
      </group>

      {/* 6. CENTRAL IN-MEMORY AST COMPOSITION CORE (Connecting all 4 Modules) */}
      <group position={[0, 0.1, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.1, 0.55, 1.1]} />
          <meshStandardMaterial
            color="#1e1e24"
            emissive="#ea580c"
            emissiveIntensity={0.5}
            roughness={0.15}
            metalness={0.9}
          />
          <Edges threshold={15} color="#fb923c" />
        </mesh>

        {/* Glowing Luminous Energy Beams linking Core to the 4 corners */}
        {[
          [-0.7, -0.7],
          [0.7, -0.7],
          [-0.7, 0.7],
          [0.7, 0.7],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x / 2, 0.15, z / 2]} rotation={[0, Math.atan2(z, x), 0]}>
            <boxGeometry args={[0.9, 0.025, 0.06]} />
            <meshBasicMaterial color="#f97316" transparent opacity={0.7} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

/* ------------------------------------------------------------------ */
/* Real Tech 3D Hero Main Component                                   */
/* ------------------------------------------------------------------ */

export const RealTech3DHero: React.FC = () => {
  const navigate = useNavigate();
  const accent = useThemeAccent();

  const [activePreset, setActivePreset] = useState<PresetId>('monorepo');
  const [activeModule, setActiveModule] = useState<'all' | 'frontend' | 'backend' | 'database' | 'ai'>('all');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'tree' | 'code'>('tree');

  const currentPreset = PRESETS[activePreset];

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(currentPreset.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative min-h-[96vh] flex flex-col justify-center border-b border-[var(--border-color)] bg-[var(--bg-main)] overflow-hidden">
      {/* Background CAD Circuit Drafting Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      {/* Ambient Lighting Glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[500px] rounded-full blur-[150px] pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`,
        }}
      />

      <div className="w-full max-w-[1750px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10 space-y-8">
        
        {/* TOP ROW: Platform Brand Heading & Preset Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2 border-b border-[var(--border-color)]">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full ui-card-subtle border text-xs font-mono">
              <span className="w-2 h-2 rounded-full animate-ping" style={{ background: accent }} />
              <span className="font-bold uppercase tracking-wider text-[var(--text-main)]">
                ForgeStack Architecture Suite
              </span>
              <span className="text-[var(--text-muted)]">•</span>
              <span className="text-orange-400 font-bold font-mono">Real-Time VFS Engine</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[var(--text-main)] leading-[1.08]">
              The Fullstack Engine.
              <br />
              <span
                className="bg-clip-text text-transparent bg-gradient-to-r"
                style={{
                  backgroundImage: `linear-gradient(to right, ${accent}, #fb923c, #f59e0b)`,
                }}
              >
                Synthesized in Real 3D Tech.
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl leading-relaxed">
              No generic blank shapes. ForgeStack composes real TypeScript stacks—React 19, Next.js 15,
              Fastify 5, Drizzle ORM, and 40 AI assistant skills—directly in memory with zero template merge conflicts.
            </p>
          </div>

          {/* Interactive Preset Switcher Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {(Object.keys(PRESETS) as PresetId[]).map((pId) => {
              const p = PRESETS[pId];
              const isActive = activePreset === pId;
              return (
                <button
                  key={pId}
                  type="button"
                  onClick={() => {
                    setActivePreset(pId);
                    setActiveModule('all');
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-mono transition-all cursor-pointer ${
                    isActive
                      ? 'bg-orange-600 text-white font-bold shadow-lg shadow-orange-600/30 scale-105 ring-1 ring-white/20'
                      : 'ui-card-subtle border text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--border-hover)]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: p.moduleColors.frontend }} />
                  <span>{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN STAGE: 2-COLUMN REAL PRODUCT WORKBENCH */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* ============================================================ */}
          {/* LEFT: 3D REAL TECH ARCHITECTURE MOTHERBOARD (6 Cols)        */}
          {/* ============================================================ */}
          <div className="lg:col-span-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)]/90 backdrop-blur-xl shadow-2xl relative min-h-[460px] sm:min-h-[560px] flex flex-col overflow-hidden">
            {/* Top 3D Telemetry Bar */}
            <div className="h-11 px-4 sm:px-6 border-b border-[var(--border-color)] flex items-center justify-between text-[11px] font-mono select-none bg-[var(--bg-card)]/70">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-bold text-[var(--text-main)] uppercase tracking-wider">
                  3D TECH MOTHERBOARD
                </span>
                <span className="text-[var(--text-muted)] hidden sm:inline">•</span>
                <span className="text-orange-400 font-bold hidden sm:inline">
                  {currentPreset.badge}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                ORBIT: 360° DRAG
              </div>
            </div>

            {/* 3D Canvas Viewport */}
            <div className="flex-1 relative cursor-grab active:cursor-grabbing">
              <Canvas
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: true }}
                camera={{ position: [0, 2.2, 5.2], fov: 45 }}
              >
                <ambientLight intensity={0.7} />
                <directionalLight position={[6, 8, 5]} intensity={1.4} castShadow />
                <pointLight position={[-4, -2, 2]} intensity={0.8} color={currentPreset.moduleColors.frontend} />
                <pointLight position={[4, -2, -2]} intensity={0.8} color={currentPreset.moduleColors.backend} />

                <Sparkles count={40} scale={7} size={2.2} speed={0.3} color={accent} />

                <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
                  <RealTechMotherboard
                    preset={currentPreset}
                    activeModule={activeModule}
                    onSelectModule={setActiveModule}
                  />
                </Float>

                <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                  maxPolarAngle={Math.PI / 1.7}
                  minPolarAngle={Math.PI / 3.5}
                />
              </Canvas>

              {/* In-Canvas Module Quick Tags */}
              <div className="absolute bottom-4 inset-x-4 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono">
                  <span className="px-2 py-0.5 text-slate-400 uppercase">Interactive Filter:</span>
                  {[
                    { id: 'all', label: 'All Modules' },
                    { id: 'frontend', label: 'Frontend' },
                    { id: 'backend', label: 'API Engine' },
                    { id: 'database', label: 'Database' },
                    { id: 'ai', label: 'AI Skills' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setActiveModule(m.id as any)}
                      className={`px-2 py-1 rounded-xl transition-colors cursor-pointer ${
                        activeModule === m.id
                          ? 'bg-white/20 text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-emerald-400">
                  <span>VFS SPEED: {currentPreset.vfsTime}</span>
                </div>
              </div>
            </div>

            {/* Bottom Legend */}
            <div className="h-10 px-4 sm:px-6 border-t border-[var(--border-color)] flex items-center justify-between text-[11px] font-mono bg-[var(--bg-card)]/70 text-[var(--text-muted)] select-none">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: currentPreset.moduleColors.frontend }} />
                  <span>Client App</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: currentPreset.moduleColors.backend }} />
                  <span>Server API</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: currentPreset.moduleColors.database }} />
                  <span>Data Layer</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: currentPreset.moduleColors.governance }} />
                  <span>AI Node</span>
                </span>
              </div>
              <span className="hidden md:inline">Click Modules in 3D to Inspect</span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT: REAL PROJECT WORKBENCH & LIVE CODE VIEWER (6 Cols)   */}
          {/* ============================================================ */}
          <div className="lg:col-span-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-2xl">
            
            <div className="space-y-4">
              {/* Header with File Count and Tab Switcher */}
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500">
                    <FolderTree className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[var(--text-main)]">
                      {currentPreset.name} Architecture
                    </h3>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      {currentPreset.filesCount} real files staged in Virtual File System
                    </p>
                  </div>
                </div>

                {/* View Mode Toggle: Tree vs Code */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setActiveTab('tree')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      activeTab === 'tree'
                        ? 'bg-orange-600 text-white font-bold shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    <FolderTree className="w-3.5 h-3.5" />
                    <span>Project Tree</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('code')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      activeTab === 'code'
                        ? 'bg-orange-600 text-white font-bold shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Live Code</span>
                  </button>
                </div>
              </div>

              {/* Content Area: Staged Tree or Real Code */}
              <div className="min-h-[260px] max-h-[300px] overflow-y-auto rounded-2xl ui-input p-3 sm:p-4 font-mono text-xs border border-[var(--border-color)]">
                {activeTab === 'tree' ? (
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-orange-400 pb-1 flex items-center justify-between border-b border-white/5">
                      <span>📁 my-app/</span>
                      <span className="text-[10px] text-emerald-400 font-normal">
                        Ready to synthesize
                      </span>
                    </div>
                    {currentPreset.tree.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 hover:border-orange-500/30 transition-all text-[11px]"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span>{item.icon}</span>
                          <span className="font-semibold text-slate-200 truncate">{item.path}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 hidden sm:inline px-2 py-0.5 rounded bg-black/30">
                          {item.tag}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between pb-1 border-b border-white/5 text-[11px] text-slate-400">
                      <span className="font-bold text-cyan-400">
                        📄 {currentPreset.codePreview.filename}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        TypeScript Certified
                      </span>
                    </div>
                    <pre className="text-[11px] text-slate-300 overflow-x-auto leading-relaxed py-1">
                      {currentPreset.codePreview.code}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Generated CLI Command Bar */}
            <div className="space-y-3 pt-2">
              <div className="p-2 sm:p-2.5 rounded-2xl ui-input border shadow-xl flex items-center justify-between gap-3 font-mono text-xs">
                <div className="flex items-center gap-2 pl-2 overflow-hidden">
                  <Terminal className="w-4 h-4 text-orange-500 shrink-0" />
                  <span className="text-[var(--text-muted)] select-none">$</span>
                  <span className="font-semibold text-[var(--text-main)] truncate select-all">
                    {currentPreset.command}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCommand}
                  className="px-3 py-1.5 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 text-orange-400 text-xs font-sans font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer border border-orange-500/30"
                  title="Copy terminal command"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => navigate('/new')}
                  className="py-3 px-5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-600/25 transition-all cursor-pointer hover:scale-[1.01]"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Launch Studio Wizard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/hub')}
                  className="py-3 px-5 rounded-2xl ui-card-subtle border text-xs sm:text-sm font-bold text-[var(--text-main)] hover:border-[var(--border-hover)] transition-all cursor-pointer hover:bg-[var(--bg-surface)] flex items-center justify-center gap-2"
                >
                  <Layers className="w-4 h-4 text-orange-500" />
                  <span>Explore Templates Hub</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
