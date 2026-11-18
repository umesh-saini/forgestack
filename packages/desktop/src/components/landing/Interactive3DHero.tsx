import React, { useState, useRef, useMemo } from 'react';
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
  Download,
  Play,
  RotateCcw,
  Sparkles as SparklesIcon,
  Maximize2,
  Minimize2,
  Box,
  Cpu,
  Shield,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { useThemeAccent } from '../../lib/motion.js';

/* ------------------------------------------------------------------ */
/* Types & Slices Metadata                                             */
/* ------------------------------------------------------------------ */

type ShaderMode = 'hologram' | 'neon' | 'titanium';

interface ArchitectureLayer {
  id: string;
  name: string;
  tag: string;
  tech: string;
  color: string;
  assembledY: number;
  explodedY: number;
}

const ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  {
    id: 'vfs',
    name: 'Virtual File System',
    tag: 'FOUNDATION',
    tech: '100% In-Memory RAM • Zero Disk Locks',
    color: '#06b6d4', // cyan-500
    assembledY: -0.9,
    explodedY: -1.9,
  },
  {
    id: 'backend',
    name: 'Clean Modular API',
    tag: 'BACKEND',
    tech: 'Fastify / Express • Drizzle ORM • BullMQ',
    color: '#f97316', // orange-500
    assembledY: -0.3,
    explodedY: -0.65,
  },
  {
    id: 'frontend',
    name: 'React 19 / Next.js 15',
    tag: 'FRONTEND',
    tech: 'Tailwind v4 • TanStack Query • Monaco Studio',
    color: '#3b82f6', // blue-500
    assembledY: 0.3,
    explodedY: 0.65,
  },
  {
    id: 'governance',
    name: 'Autonomous AI Node',
    tag: 'GOVERNANCE',
    tech: 'Zero-OAuth MCP • OpenSpec • 17 AI Tool Specs',
    color: '#10b981', // emerald-500
    assembledY: 0.9,
    explodedY: 1.9,
  },
];

/* ------------------------------------------------------------------ */
/* 3D Core Layer Components                                           */
/* ------------------------------------------------------------------ */

interface LayerMeshProps {
  layer: ArchitectureLayer;
  index: number;
  isExploded: boolean;
  shaderMode: ShaderMode;
  isSelected: boolean;
  onSelect: () => void;
  accent: string;
}

const LayerMesh: React.FC<LayerMeshProps> = ({
  layer,
  index,
  isExploded,
  shaderMode,
  isSelected,
  onSelect,
  accent,
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  const targetY = isExploded ? layer.explodedY : layer.assembledY;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    // Smooth spring-like lerp to target exploded or assembled Y
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      targetY,
      delta * 4.5
    );

    // Subtle gentle idle spin per layer with alternate directions
    meshRef.current.rotation.y += delta * (index % 2 === 0 ? 0.08 : -0.06);

    // Selected or active layer pulse
    if (matRef.current) {
      const targetEmissive = isSelected ? 0.75 : shaderMode === 'hologram' ? 0.45 : 0.2;
      matRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        matRef.current.emissiveIntensity,
        targetEmissive,
        delta * 5
      );
    }
  });

  const materialProps = useMemo(() => {
    switch (shaderMode) {
      case 'hologram':
        return {
          wireframe: true,
          color: isSelected ? '#ffffff' : layer.color,
          emissive: layer.color,
          emissiveIntensity: 0.5,
          roughness: 0.1,
          metalness: 0.8,
          transparent: true,
          opacity: 0.85,
        };
      case 'neon':
        return {
          wireframe: false,
          color: isSelected ? '#ffffff' : layer.color,
          emissive: isSelected ? accent : layer.color,
          emissiveIntensity: 0.4,
          roughness: 0.2,
          metalness: 0.5,
          transparent: true,
          opacity: 0.95,
        };
      case 'titanium':
      default:
        return {
          wireframe: false,
          color: isSelected ? '#f8fafc' : '#1e293b',
          emissive: isSelected ? layer.color : '#0f172a',
          emissiveIntensity: 0.25,
          roughness: 0.25,
          metalness: 0.9,
          transparent: false,
          opacity: 1.0,
        };
    }
  }, [shaderMode, layer.color, isSelected, accent]);

  return (
    <group
      ref={meshRef}
      position={[0, targetY, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Geometry varies by layer to communicate its architectural role */}
      {index === 0 && (
        // VFS Substrate Base
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.9, 2.1, 0.28, 32]} />
          <meshStandardMaterial ref={matRef} {...materialProps} />
          <Edges threshold={15} color={isSelected ? '#ffffff' : layer.color} />
        </mesh>
      )}

      {index === 1 && (
        // Backend Engine Hex Slab
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.5, 1.6, 0.38, 6]} />
          <meshStandardMaterial ref={matRef} {...materialProps} />
          <Edges threshold={15} color={isSelected ? '#ffffff' : layer.color} />
        </mesh>
      )}

      {index === 2 && (
        // Frontend Workspace Slab
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.35, 2.2]} />
          <meshStandardMaterial ref={matRef} {...materialProps} />
          <Edges threshold={15} color={isSelected ? '#ffffff' : layer.color} />
        </mesh>
      )}

      {index === 3 && (
        // AI Governance & MCP Node (Icosahedron + Rotating Orbit Ring)
        <group>
          <mesh castShadow receiveShadow>
            <icosahedronGeometry args={[0.75, 0]} />
            <meshStandardMaterial ref={matRef} {...materialProps} />
            <Edges threshold={15} color={isSelected ? '#ffffff' : layer.color} />
          </mesh>
          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[1.2, 0.04, 16, 64]} />
            <meshStandardMaterial
              color={layer.color}
              emissive={layer.color}
              emissiveIntensity={0.6}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};

/* ------------------------------------------------------------------ */
/* Interactive 3D Architecture Core Scene                             */
/* ------------------------------------------------------------------ */

interface CoreSceneProps {
  isExploded: boolean;
  shaderMode: ShaderMode;
  selectedLayerIndex: number;
  onSelectLayer: (idx: number) => void;
  accent: string;
}

const CoreScene: React.FC<CoreSceneProps> = ({
  isExploded,
  shaderMode,
  selectedLayerIndex,
  onSelectLayer,
  accent,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ pointer }, delta) => {
    if (!groupRef.current) return;
    // Gentle mouse tilt response with inertia
    const targetRotX = pointer.y * 0.2;
    const targetRotY = pointer.x * 0.35;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotX,
      delta * 2
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotY,
      delta * 2
    );
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[6, 8, 5]} intensity={1.4} castShadow />
      <pointLight position={[-5, -4, 2]} intensity={0.8} color={accent} />
      <pointLight position={[4, 5, -3]} intensity={0.6} color="#06b6d4" />

      {/* Floating Constellation Particles */}
      <Sparkles
        count={55}
        scale={8}
        size={2.2}
        speed={0.4}
        opacity={0.65}
        color={accent}
      />

      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.5}>
        <group ref={groupRef}>
          {/* Laser Guide Columns when Exploded */}
          {isExploded && (
            <group>
              {[-1.1, 1.1].map((x) =>
                [-1.1, 1.1].map((z) => (
                  <mesh key={`${x}-${z}`} position={[x, 0, z]}>
                    <cylinderGeometry args={[0.015, 0.015, 4.2, 8]} />
                    <meshBasicMaterial
                      color={accent}
                      transparent
                      opacity={0.35}
                    />
                  </mesh>
                ))
              )}
            </group>
          )}

          {/* Slices of the Architecture */}
          {ARCHITECTURE_LAYERS.map((layer, idx) => (
            <LayerMesh
              key={layer.id}
              layer={layer}
              index={idx}
              isExploded={isExploded}
              shaderMode={shaderMode}
              isSelected={selectedLayerIndex === idx}
              onSelect={() => onSelectLayer(idx)}
              accent={accent}
            />
          ))}
        </group>
      </Float>

      {/* Orbit Controls (constrained to prevent disorienting flip) */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        maxPolarAngle={Math.PI / 1.7}
        minPolarAngle={Math.PI / 3.2}
      />
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Interactive 3D Hero Main Component                                 */
/* ------------------------------------------------------------------ */

export const Interactive3DHero: React.FC = () => {
  const navigate = useNavigate();
  const accent = useThemeAccent();
  const reduce = useReducedMotion();

  const [isExploded, setIsExploded] = useState(true);
  const [shaderMode, setShaderMode] = useState<ShaderMode>('neon');
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(1);
  const [copied, setCopied] = useState(false);

  const npxCommand = 'npx create-forgestack-app my-app';

  const handleCopy = () => {
    navigator.clipboard.writeText(npxCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const activeLayer = ARCHITECTURE_LAYERS[selectedLayerIndex];

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden border-b border-[var(--border-color)] bg-[var(--bg-main)]">
      {/* Background Architectural Drafting Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />

      {/* Ambient Gradient Glow */}
      <div
        className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`,
        }}
      />

      {/* Main Grid: Left 3D Interactive Stage, Right Editorial Typography */}
      <div className="w-full max-w-[1750px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ============================================================ */}
          {/* LEFT COLUMN: 3D Interactive Architecture Viewport (7 Cols)  */}
          {/* ============================================================ */}
          <div className="lg:col-span-7 xl:col-span-7 relative h-[500px] sm:h-[600px] lg:h-[680px] w-full rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)]/80 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col">
            
            {/* Top HUD Telemetry Bar */}
            <div className="h-11 px-4 sm:px-6 border-b border-[var(--border-color)] flex items-center justify-between text-[11px] font-mono select-none bg-[var(--bg-card)]/60">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold tracking-wider text-[var(--text-main)]">
                  3D ARCHITECTURE CORE
                </span>
                <span className="text-[var(--text-muted)] hidden sm:inline">•</span>
                <span className="text-[var(--text-muted)] hidden sm:inline">
                  ORBIT INTERACTIVE
                </span>
              </div>

              <div className="flex items-center gap-4 text-[var(--text-muted)]">
                <span className="hidden md:inline font-semibold">
                  MODE:{' '}
                  <span className="text-orange-400 uppercase font-mono">
                    {isExploded ? 'EXPLODED_LAYERS' : 'COMPACT_MONOLITH'}
                  </span>
                </span>
                <div className="px-2 py-0.5 rounded bg-[var(--bg-input)] border border-[var(--border-color)] text-[10px] text-emerald-400">
                  60 FPS • R3F v9
                </div>
              </div>
            </div>

            {/* 3D Canvas Viewport */}
            <div className="flex-1 relative cursor-grab active:cursor-grabbing">
              {reduce ? (
                /* Reduced Motion Fallback */
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <Box className="w-16 h-16 text-orange-500" />
                  <div className="font-mono text-sm font-bold">
                    Static 3D Architecture Primitives (Reduced Motion Active)
                  </div>
                  <div className="grid grid-cols-2 gap-3 max-w-md w-full">
                    {ARCHITECTURE_LAYERS.map((l) => (
                      <div
                        key={l.id}
                        className="p-3 rounded-xl border ui-card text-left text-xs"
                      >
                        <div className="font-bold" style={{ color: l.color }}>
                          {l.name}
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)]">
                          {l.tech}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <Canvas
                  dpr={[1, 1.5]}
                  gl={{ antialias: true, alpha: true }}
                  camera={{ position: [0, 1.2, 5.8], fov: 45 }}
                >
                  <CoreScene
                    isExploded={isExploded}
                    shaderMode={shaderMode}
                    selectedLayerIndex={selectedLayerIndex}
                    onSelectLayer={setSelectedLayerIndex}
                    accent={accent}
                  />
                </Canvas>
              )}

              {/* In-Canvas Tactile HUD Overlays */}
              <div className="absolute top-4 left-4 pointer-events-none">
                <div className="px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300 space-y-0.5">
                  <div className="opacity-60 uppercase tracking-widest text-[9px]">
                    Active Inspector
                  </div>
                  <div className="font-bold text-xs" style={{ color: activeLayer.color }}>
                    {activeLayer.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                    {activeLayer.tech}
                  </div>
                </div>
              </div>

              {/* Bottom Interactive Stage Controls Bar */}
              <div className="absolute bottom-4 inset-x-4 flex items-center justify-between gap-2 flex-wrap">
                {/* Explode / Assemble Switcher */}
                <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 shadow-lg">
                  <button
                    type="button"
                    onClick={() => setIsExploded(!isExploded)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-orange-600 hover:bg-orange-500 text-white transition-all cursor-pointer shadow-sm"
                  >
                    {isExploded ? (
                      <>
                        <Minimize2 className="w-3.5 h-3.5" />
                        <span>Assemble Core</span>
                      </>
                    ) : (
                      <>
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Explode Layers</span>
                      </>
                    )}
                  </button>

                  {/* Shader Mode Switcher */}
                  <div className="flex items-center gap-1 px-1">
                    {(['neon', 'hologram', 'titanium'] as ShaderMode[]).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setShaderMode(mode)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                          shaderMode === mode
                            ? 'bg-white/20 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Layer Selector Chips */}
                <div className="hidden sm:flex items-center gap-1.5 p-1 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10">
                  {ARCHITECTURE_LAYERS.map((layer, idx) => (
                    <button
                      key={layer.id}
                      type="button"
                      onClick={() => setSelectedLayerIndex(idx)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-mono transition-all cursor-pointer ${
                        selectedLayerIndex === idx
                          ? 'bg-white/20 font-bold text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      style={{
                        borderColor: selectedLayerIndex === idx ? layer.color : 'transparent',
                      }}
                    >
                      {layer.tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Telemetry Footer */}
            <div className="h-10 px-4 sm:px-6 border-t border-[var(--border-color)] flex items-center justify-between text-[11px] font-mono bg-[var(--bg-card)]/60 text-[var(--text-muted)] select-none">
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-orange-400" />
                <span>Drag to Rotate 360° • Click Slices to Inspect</span>
              </div>
              <div className="hidden sm:flex items-center gap-3">
                <span>VFS RAM: 2.4 MB</span>
                <span>•</span>
                <span>AST COMPOSITION: ACTIVE</span>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN: Editorial Architectural Messaging (5 Cols)     */}
          {/* ============================================================ */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-6 sm:space-y-8">
            
            {/* Precision Micro-Label */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full ui-card-subtle border text-xs font-mono">
              <span className="w-2 h-2 rounded-full" style={{ background: accent }} />
              <span className="font-bold uppercase tracking-wider text-[var(--text-main)]">
                ForgeStack Architecture Suite
              </span>
              <span className="text-[var(--text-muted)]">•</span>
              <span className="text-[var(--text-muted)] font-bold">v1.0.0</span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[var(--text-main)] leading-[1.08]">
                Enterprise
                <br />
                Architecture.
                <br />
                <span
                  className="bg-clip-text text-transparent bg-gradient-to-r"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${accent}, #fb923c, #f59e0b)`,
                  }}
                >
                  Synthesized in 3D.
                </span>
              </h1>
              <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed max-w-lg">
                Not a static template cloner. ForgeStack compiles type-safe fullstack monorepos,
                Next.js 15 apps, and clean APIs directly in memory with atomic AST recipes and Day-One AI Governance.
              </p>
            </div>

            {/* Interactive Terminal Quickstart Bar */}
            <div className="p-2 sm:p-2.5 rounded-2xl ui-input border shadow-xl flex items-center justify-between gap-3 font-mono text-xs sm:text-sm">
              <div className="flex items-center gap-2.5 pl-2 overflow-hidden">
                <Terminal className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="text-[var(--text-muted)] select-none">$</span>
                <span className="font-semibold text-[var(--text-main)] truncate select-all">
                  {npxCommand}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="px-3.5 py-1.5 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 text-orange-400 text-xs font-sans font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer border border-orange-500/30"
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
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap pt-1">
              <button
                type="button"
                onClick={() => navigate('/new')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-orange-600/25 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Launch Studio Wizard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/hub')}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl ui-card-subtle border text-xs sm:text-sm font-bold text-[var(--text-main)] hover:border-[var(--border-hover)] transition-all cursor-pointer hover:bg-[var(--bg-surface)]"
              >
                <Layers className="w-4 h-4 text-orange-500" />
                <span>Templates Hub</span>
              </button>

              <a
                href="#downloads"
                className="flex items-center gap-2 px-4 py-3.5 rounded-2xl ui-card-subtle border text-xs sm:text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--border-hover)] transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Desktop .deb</span>
              </a>
            </div>

            {/* 3 Architectural Tenets */}
            <div className="grid grid-cols-3 gap-2.5 pt-2 text-[11px] font-mono text-[var(--text-muted)]">
              <div className="p-2.5 rounded-xl ui-card border space-y-1">
                <div className="font-bold text-orange-400">01 • IN-RAM</div>
                <div className="text-[10px] opacity-75">100% In-Memory VFS Compilation</div>
              </div>
              <div className="p-2.5 rounded-xl ui-card border space-y-1">
                <div className="font-bold text-emerald-400">02 • AI GOV</div>
                <div className="text-[10px] opacity-75">17 AI Tools + OpenSpec & MCP</div>
              </div>
              <div className="p-2.5 rounded-xl ui-card border space-y-1">
                <div className="font-bold text-cyan-400">03 • ZERO SLOP</div>
                <div className="text-[10px] opacity-75">AST Slices, Not Cloned Folders</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
