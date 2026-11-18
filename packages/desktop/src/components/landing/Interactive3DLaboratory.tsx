import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Edges, OrbitControls, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Terminal,
  Copy,
  Check,
  Cpu,
  Database,
  Shield,
  Box,
  ArrowRight,
  Code2,
  FileCode,
  FolderTree,
} from 'lucide-react';
import { useThemeAccent } from '../../lib/motion.js';

/* ------------------------------------------------------------------ */
/* Preset Archetype Definitions                                       */
/* ------------------------------------------------------------------ */

export type ArchetypeId =
  | 'monorepo'
  | 'nextjs'
  | 'desktop'
  | 'clean-modular'
  | 'ai-agent';

interface ArchetypeMeta {
  id: ArchetypeId;
  title: string;
  badge: string;
  tagline: string;
  files: number;
  cliFlags: string;
  accent: string;
  highlights: string[];
}

const ARCHETYPES: Record<ArchetypeId, ArchetypeMeta> = {
  monorepo: {
    id: 'monorepo',
    title: 'Enterprise Turborepo Monorepo',
    badge: 'MULTI-PACKAGE LATTICE',
    tagline: 'Orchestrated apps/web (React 19), apps/api (Fastify), and packages/ui',
    files: 44,
    cliFlags: 'npx create-forgestack-app my-app --topology monorepo --fe react-vite --be fastify --orm drizzle',
    accent: '#fb923c',
    highlights: [
      'Turborepo pipeline caching across workspace packages',
      'Shared TypeScript config & Tailwind v4 token inheritance',
      'Unified pnpm workspace dependency graph',
    ],
  },
  nextjs: {
    id: 'nextjs',
    title: 'Next.js 15 Full-Stack Monolith',
    badge: 'APP ROUTER ARCHITECTURE',
    tagline: 'App Router, React 19 Server Actions, PostgreSQL + Drizzle ORM, and Better-Auth',
    files: 36,
    cliFlags: 'npx create-forgestack-app my-app --topology nextjs-fullstack --db postgres --orm drizzle --auth better-auth',
    accent: '#38bdf8',
    highlights: [
      'React Server Components & Server Actions with zero hydration mismatch',
      'Type-safe database migrations with Drizzle Kit',
      'Zero-OAuth MCP Server for AI agents embedded',
    ],
  },
  desktop: {
    id: 'desktop',
    title: 'Tauri v2 Desktop Studio',
    badge: 'NATIVE RUST SHELL',
    tagline: 'Cross-platform native desktop webview with direct OS hardware permissions',
    files: 38,
    cliFlags: 'npx create-forgestack-app my-app --topology tauri-desktop --install --git',
    accent: '#a855f7',
    highlights: [
      'Sub-50MB memory footprint with hardware-accelerated rendering',
      'Direct atomic disk writes and background process orchestration',
      'Integrated Monaco code editor workspace',
    ],
  },
  'clean-modular': {
    id: 'clean-modular',
    title: 'Clean Modular Polyrepo',
    badge: 'DECOUPLED MICROSERVICES',
    tagline: 'Isolated frontend and backend folders for teams with independent deployments',
    files: 32,
    cliFlags: 'npx create-forgestack-app my-app --topology separate-folders --fe react-vite --be clean-modular',
    accent: '#22c55e',
    highlights: [
      'Zero inter-package compile dependencies',
      'BullMQ Redis background worker queue pre-wired',
      'Docker Compose orchestration for multi-container development',
    ],
  },
  'ai-agent': {
    id: 'ai-agent',
    title: 'Autonomous AI Agent RAG Stack',
    badge: 'MCP PROTOCOL EMBEDDED',
    tagline: 'Day-One OpenSpec change management and zero-OAuth MCP tool execution',
    files: 48,
    cliFlags: 'npx create-forgestack-app my-app --topology ai-agent-rag --mcp --rules --skills',
    accent: '#eab308',
    highlights: [
      'Provisioned skills across 17 AI assistant ecosystems',
      'Local Model Context Protocol server (forgestack-mcp)',
      'Milestone-driven Open-GSD roadmaps and spec-kit constitution',
    ],
  },
};

/* ------------------------------------------------------------------ */
/* 3D Morphing Geometric Models                                       */
/* ------------------------------------------------------------------ */

interface LabModelProps {
  archetype: ArchetypeId;
  accent: string;
}

const Lab3DModel: React.FC<LabModelProps> = ({ archetype, accent }) => {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const node1Ref = useRef<THREE.Mesh>(null);
  const node2Ref = useRef<THREE.Mesh>(null);
  const node3Ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
      groupRef.current.rotation.x = Math.sin(performance.now() * 0.001) * 0.12;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.4;
    }
    if (node1Ref.current && node2Ref.current && node3Ref.current) {
      const t = performance.now() * 0.0015;
      node1Ref.current.position.set(Math.cos(t) * 1.8, Math.sin(t) * 0.6, Math.sin(t) * 1.8);
      node2Ref.current.position.set(
        Math.cos(t + (Math.PI * 2) / 3) * 1.8,
        Math.sin(t + 1) * 0.6,
        Math.sin(t + (Math.PI * 2) / 3) * 1.8
      );
      node3Ref.current.position.set(
        Math.cos(t + (Math.PI * 4) / 3) * 1.8,
        Math.sin(t + 2) * 0.6,
        Math.sin(t + (Math.PI * 4) / 3) * 1.8
      );
    }
  });

  const activeColor = ARCHETYPES[archetype].accent;

  return (
    <group ref={groupRef}>
      {/* MODEL 1: MONOREPO (Central Core + 3 Orbiting Satellites) */}
      {archetype === 'monorepo' && (
        <group>
          {/* Central Turborepo Hub */}
          <mesh castShadow>
            <octahedronGeometry args={[1.1, 0]} />
            <meshStandardMaterial
              color="#1e293b"
              emissive={activeColor}
              emissiveIntensity={0.5}
              roughness={0.2}
              metalness={0.8}
            />
            <Edges threshold={15} color={activeColor} />
          </mesh>

          {/* Orbital Ring */}
          <mesh ref={ringRef} rotation={[Math.PI / 2.5, 0, 0]}>
            <torusGeometry args={[1.8, 0.025, 16, 64]} />
            <meshBasicMaterial color={activeColor} transparent opacity={0.5} />
          </mesh>

          {/* 3 Orbiting Satellite Packages: Apps/Web, Apps/Api, Packages/UI */}
          <mesh ref={node1Ref}>
            <boxGeometry args={[0.45, 0.45, 0.45]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.6} />
            <Edges threshold={15} color="#ffffff" />
          </mesh>
          <mesh ref={node2Ref}>
            <cylinderGeometry args={[0.3, 0.3, 0.5, 6]} />
            <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.6} />
            <Edges threshold={15} color="#ffffff" />
          </mesh>
          <mesh ref={node3Ref}>
            <sphereGeometry args={[0.32, 16, 16]} />
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.6} />
            <Edges threshold={15} color="#ffffff" />
          </mesh>
        </group>
      )}

      {/* MODEL 2: NEXT.JS 15 (Monolithic Prismatic Cube with Dual Inner Cores) */}
      {archetype === 'nextjs' && (
        <group>
          {/* Outer Translucent Glass Cube */}
          <mesh castShadow>
            <boxGeometry args={[1.9, 1.9, 1.9]} />
            <meshStandardMaterial
              color="#0f172a"
              emissive="#38bdf8"
              emissiveIntensity={0.25}
              roughness={0.1}
              metalness={0.85}
              transparent
              opacity={0.7}
              wireframe={false}
            />
            <Edges threshold={15} color="#38bdf8" />
          </mesh>

          {/* Inner Glowing Server Actions Engine */}
          <mesh>
            <octahedronGeometry args={[0.85, 0]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>
      )}

      {/* MODEL 3: TAURI DESKTOP (Floating Window Chassis with Native Bezel) */}
      {archetype === 'desktop' && (
        <group>
          {/* Window Screen Panel */}
          <mesh castShadow>
            <boxGeometry args={[2.4, 1.6, 0.15]} />
            <meshStandardMaterial
              color="#1e1b4b"
              emissive="#a855f7"
              emissiveIntensity={0.35}
              roughness={0.2}
              metalness={0.9}
            />
            <Edges threshold={15} color="#c084fc" />
          </mesh>

          {/* Native Rust Gears behind */}
          <mesh position={[0, 0, -0.4]} rotation={[0, 0, Math.PI / 4]}>
            <torusGeometry args={[0.9, 0.18, 16, 32]} />
            <meshStandardMaterial
              color="#475569"
              emissive="#a855f7"
              emissiveIntensity={0.4}
              metalness={0.95}
              roughness={0.1}
            />
          </mesh>
        </group>
      )}

      {/* MODEL 4: CLEAN MODULAR (Dual Complementary Monoliths: FE & BE) */}
      {archetype === 'clean-modular' && (
        <group>
          <mesh position={[-0.8, 0, 0]} castShadow>
            <cylinderGeometry args={[0.7, 0.7, 1.7, 6]} />
            <meshStandardMaterial
              color="#14532d"
              emissive="#22c55e"
              emissiveIntensity={0.45}
              metalness={0.85}
              roughness={0.2}
            />
            <Edges threshold={15} color="#4ade80" />
          </mesh>
          <mesh position={[0.8, 0, 0]} castShadow>
            <boxGeometry args={[1.2, 1.5, 1.2]} />
            <meshStandardMaterial
              color="#064e3b"
              emissive="#10b981"
              emissiveIntensity={0.45}
              metalness={0.85}
              roughness={0.2}
            />
            <Edges threshold={15} color="#34d399" />
          </mesh>
        </group>
      )}

      {/* MODEL 5: AI AGENT RAG (Dodecahedron Neural Hub + Double Energy Torus) */}
      {archetype === 'ai-agent' && (
        <group>
          <mesh castShadow>
            <dodecahedronGeometry args={[1.1, 0]} />
            <meshStandardMaterial
              color="#713f12"
              emissive="#eab308"
              emissiveIntensity={0.6}
              metalness={0.7}
              roughness={0.2}
            />
            <Edges threshold={15} color="#fde047" />
          </mesh>

          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[1.6, 0.04, 16, 64]} />
            <meshBasicMaterial color="#eab308" transparent opacity={0.65} />
          </mesh>
          <mesh rotation={[-Math.PI / 3, 0, 0]}>
            <torusGeometry args={[1.4, 0.04, 16, 64]} />
            <meshBasicMaterial color="#f97316" transparent opacity={0.65} />
          </mesh>
        </group>
      )}
    </group>
  );
};

/* ------------------------------------------------------------------ */
/* Interactive 3D Architecture Laboratory Component                  */
/* ------------------------------------------------------------------ */

export const Interactive3DLaboratory: React.FC = () => {
  const navigate = useNavigate();
  const accent = useThemeAccent();
  const reduce = useReducedMotion();

  const [activeArchetype, setActiveArchetype] = useState<ArchetypeId>('monorepo');
  const [copied, setCopied] = useState(false);

  const currentMeta = ARCHETYPES[activeArchetype];

  const handleCopyCli = () => {
    navigator.clipboard.writeText(currentMeta.cliFlags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInspectInStudio = () => {
    navigate('/new');
  };

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 relative border-t border-[var(--border-color)] bg-[var(--bg-surface)]/30">
      <div className="max-w-[1750px] mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full ui-card-subtle border text-xs font-mono">
            <span className="w-2 h-2 rounded-full" style={{ background: currentMeta.accent }} />
            <span className="font-bold uppercase tracking-wider text-[var(--text-main)]">
              02 · Architecture Laboratory
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--text-main)]">
            Interactive 3D Preset Morphing
          </h2>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-[var(--text-muted)]">
            Click across production archetypes to witness the architecture assemble, calculate dependencies,
            and compile in-memory VFS trees in real-time.
          </p>
        </div>

        {/* Archetype Selector Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap max-w-4xl mx-auto">
          {(Object.keys(ARCHETYPES) as ArchetypeId[]).map((archId) => {
            const meta = ARCHETYPES[archId];
            const isActive = activeArchetype === archId;
            return (
              <button
                key={archId}
                type="button"
                onClick={() => setActiveArchetype(archId)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-mono transition-all cursor-pointer ${
                  isActive
                    ? 'bg-orange-600 text-white font-bold shadow-lg shadow-orange-600/25 ring-1 ring-white/20 scale-105'
                    : 'ui-card-subtle border text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--border-hover)]'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: meta.accent }}
                />
                <span>{meta.title.split(' ')[0]} {meta.title.split(' ')[1]}</span>
              </button>
            );
          })}
        </div>

        {/* 3D Model Stage + Architectural Blueprint Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* 3D Canvas Stage (7 Cols) */}
          <div className="lg:col-span-7 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-main)] shadow-2xl relative min-h-[440px] sm:min-h-[520px] flex flex-col overflow-hidden">
            {/* Top Stage Bar */}
            <div className="h-10 px-4 sm:px-6 border-b border-[var(--border-color)] flex items-center justify-between text-[11px] font-mono select-none bg-[var(--bg-card)]/50">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full animate-ping"
                  style={{ background: currentMeta.accent }}
                />
                <span className="font-bold text-[var(--text-main)]">
                  {currentMeta.badge}
                </span>
              </div>
              <div className="text-[var(--text-muted)]">
                STAGED FILES: <span className="text-orange-400 font-bold">{currentMeta.files}</span>
              </div>
            </div>

            {/* 3D Viewport */}
            <div className="flex-1 relative cursor-grab active:cursor-grabbing">
              {reduce ? (
                <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-xs font-mono">
                  Static 3D Rendering (Reduced Motion Active)
                </div>
              ) : (
                <Canvas
                  dpr={[1, 1.5]}
                  gl={{ antialias: true, alpha: true }}
                  camera={{ position: [0, 0.8, 4.8], fov: 45 }}
                >
                  <ambientLight intensity={0.7} />
                  <directionalLight position={[5, 6, 4]} intensity={1.2} />
                  <pointLight position={[-4, -3, 2]} intensity={0.6} color={currentMeta.accent} />
                  <Sparkles count={35} scale={6} size={2} speed={0.3} color={currentMeta.accent} />

                  <Float speed={1.3} rotationIntensity={0.4} floatIntensity={0.6}>
                    <Lab3DModel archetype={activeArchetype} accent={currentMeta.accent} />
                  </Float>

                  <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    maxPolarAngle={Math.PI / 1.7}
                    minPolarAngle={Math.PI / 3}
                  />
                </Canvas>
              )}

              {/* Floating Geometry Tag */}
              <div className="absolute bottom-4 left-4 pointer-events-none">
                <div className="px-3 py-1.5 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300">
                  <span>ORBIT: DRAG ANYWHERE • ZOOM LOCKED</span>
                </div>
              </div>
            </div>
          </div>

          {/* Architectural Blueprint Inspector (5 Cols) */}
          <div className="lg:col-span-5 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${currentMeta.accent}20`,
                    color: currentMeta.accent,
                    borderColor: `${currentMeta.accent}40`,
                    borderWidth: 1,
                  }}
                >
                  {currentMeta.badge}
                </span>
                <span className="text-xs font-mono text-[var(--text-muted)]">
                  AST Topology Preset
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
                {currentMeta.title}
              </h3>

              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                {currentMeta.tagline}
              </p>

              {/* Technical Highlights */}
              <div className="space-y-2.5 pt-2">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Engine Highlights
                </div>
                {currentMeta.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-[var(--text-main)]">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Generated CLI Command Box */}
            <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                  Terminal Command Equivalence
                </div>
                <div className="p-3 rounded-xl ui-input border font-mono text-xs flex items-center justify-between gap-2 overflow-hidden">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Terminal className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span className="truncate text-slate-300">{currentMeta.cliFlags}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCli}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                    title="Copy command"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Primary Action */}
              <button
                type="button"
                onClick={handleInspectInStudio}
                className="w-full py-3.5 px-5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-600/25 transition-all cursor-pointer hover:scale-[1.01]"
              >
                <span>Customize in Studio Wizard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
