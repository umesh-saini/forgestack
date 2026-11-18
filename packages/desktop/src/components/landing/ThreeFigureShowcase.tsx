import React, { Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Edges, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import {
  motion,
  useScroll,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion';
import { useThemeAccent } from '../../lib/motion.js';

// Preload real 3D models
try {
  useGLTF.preload('/models/typescript.glb');
  useGLTF.preload('/models/mongodb.glb');
} catch {
  // Preload fallback in non-browser envs
}

/* ------------------------------------------------------------------ */
/* palette helpers — derive 9 cohesive colors from the theme accent    */
/* ------------------------------------------------------------------ */

function hexToRgb(hex: string): [number, number, number] {
  const m = hex.replace('#', '').match(/.{1,2}/g);
  if (!m) return [251, 92, 11];
  return [
    parseInt(m[0], 16),
    parseInt(m[1], 16),
    parseInt(m[2], 16),
  ];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / d) % 6;
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, s, l];
}

function hsl(h: number, s: number, l: number): string {
  return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

function buildPalette(accent: string): string[] {
  const [r, g, b] = hexToRgb(accent);
  const [h] = rgbToHsl(r, g, b);
  // Walk the hue wheel around the accent for a cohesive-but-varied set.
  const offsets = [0, 40, -40, 80, -80, 120, -120, 200, -200];
  return offsets.map((o, i) => {
    const hue = (h + o + 360) % 360;
    const sat = 0.72 - (i % 3) * 0.06;
    const light = 0.58 - (i % 2) * 0.06;
    return hsl(hue, sat, light);
  });
}

function rgba(hex: string, a: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/* ------------------------------------------------------------------ */
/* Real Tech 3D Models Sub-components                                 */
/* ------------------------------------------------------------------ */

function TypeScript3DFigure({ color }: { color: string }) {
  const { scene } = useGLTF('/models/typescript.glb');
  const clone = React.useMemo(() => scene.clone(), [scene]);
  return (
    <primitive
      object={clone}
      scale={0.65}
      position={[0, 0, 0]}
      rotation={[0, 0.25, 0]}
    />
  );
}

function MongoDb3DFigure({ color }: { color: string }) {
  const { scene } = useGLTF('/models/mongodb.glb');
  const clone = React.useMemo(() => scene.clone(), [scene]);
  return (
    <primitive
      object={clone}
      scale={11.5}
      position={[0, -0.65, 0]}
      rotation={[0, 0.25, 0]}
    />
  );
}

function React193DFigure({ color }: { color: string }) {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
      </mesh>
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.92, 0.04, 16, 64]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
      </mesh>
      <mesh rotation={[-Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.92, 0.04, 16, 64]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.92, 0.04, 16, 64]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* The nine figures                                                   */
/* ------------------------------------------------------------------ */

interface FigureDef {
  name: string;
  tag: string;
  custom?: 'typescript' | 'mongodb' | 'react';
  geometry?: React.ReactNode;
}

const SPACING = 3.4;

const FIGURES: FigureDef[] = [
  { name: 'TypeScript 5.7', tag: 'type-safe core', custom: 'typescript' },
  { name: 'React 19 Core', tag: 'modern frontend', custom: 'react' },
  { name: 'MongoDB & Drizzle', tag: 'database layer', custom: 'mongodb' },
  { name: 'Turborepo Engine', tag: 'monorepo orchestration', geometry: <boxGeometry args={[1.25, 1.25, 1.25]} /> },
  { name: 'Fastify 5 REST', tag: 'modular api server', geometry: <cylinderGeometry args={[0.75, 0.75, 1.4, 6]} /> },
  { name: 'Next.js 15 Full-Stack', tag: 'server actions', geometry: <dodecahedronGeometry args={[1.0, 0]} /> },
  { name: 'Tauri v2 Desktop', tag: 'native rust engine', geometry: <sphereGeometry args={[0.92, 48, 48]} /> },
  { name: 'BullMQ Queue', tag: 'distributed worker', geometry: <coneGeometry args={[0.85, 1.7, 48]} /> },
  { name: '40 AI Ecosystems & MCP', tag: 'day-one governance', geometry: <octahedronGeometry args={[1.1, 0]} /> },
];

interface FigureProps {
  index: number;
  color: string;
  activeIndexRef: React.MutableRefObject<number>;
}

const Figure: React.FC<FigureProps> = ({ index, color, activeIndexRef }) => {
  const meshRef = React.useRef<THREE.Group>(null);
  const def = FIGURES[index];

  // depth parallax — figures further from camera sit slightly back
  const z = (index % 3) * -0.6 - 0.2;

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (mesh) {
      mesh.rotation.y += delta * 0.2;
      mesh.rotation.x += delta * 0.05;

      const active = activeIndexRef.current === index;
      mesh.scale.setScalar(
        THREE.MathUtils.lerp(mesh.scale.x, active ? 1.15 : 1.0, delta * 3),
      );
    }
  });

  return (
    <group position={[index * SPACING, 0, z]}>
      <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.9}>
        <group ref={meshRef}>
          {def.custom === 'typescript' ? (
            <Suspense
              fallback={
                <mesh>
                  <boxGeometry args={[1.2, 1.2, 0.3]} />
                  <meshStandardMaterial color={color} />
                </mesh>
              }
            >
              <TypeScript3DFigure color={color} />
            </Suspense>
          ) : def.custom === 'mongodb' ? (
            <Suspense
              fallback={
                <mesh>
                  <cylinderGeometry args={[0.5, 0.5, 1.3, 32]} />
                  <meshStandardMaterial color={color} />
                </mesh>
              }
            >
              <MongoDb3DFigure color={color} />
            </Suspense>
          ) : def.custom === 'react' ? (
            <React193DFigure color={color} />
          ) : (
            <mesh castShadow>
              {def.geometry}
              <meshStandardMaterial
                color={color}
                metalness={0.35}
                roughness={0.22}
                emissive={color}
                emissiveIntensity={0.3}
              />
              <Edges threshold={15} color="white" />
            </mesh>
          )}
        </group>
      </Float>
    </group>
  );
};

interface SceneProps {
  progressRef: React.MutableRefObject<number>;
  activeIndexRef: React.MutableRefObject<number>;
  palette: string[];
}

const Scene: React.FC<SceneProps> = ({ progressRef, activeIndexRef, palette }) => {
  const groupRef = React.useRef<THREE.Group>(null);
  const total = FIGURES.length;

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;
    const p = progressRef.current;
    const targetX = -p * (total - 1) * SPACING;
    g.position.x = THREE.MathUtils.lerp(g.position.x, targetX, delta * 6);
    g.rotation.y = Math.sin(performance.now() * 0.0002) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 6, 4]} intensity={1.2} />
      <pointLight position={[-6, -2, 3]} intensity={0.6} color={palette[0]} />
      {FIGURES.map((_, i) => (
        <Figure
          key={i}
          index={i}
          color={palette[i % palette.length]}
          activeIndexRef={activeIndexRef}
        />
      ))}
    </group>
  );
};

/* ------------------------------------------------------------------ */
/* Static fallback for reduced-motion / no-WebGL                       */
/* ------------------------------------------------------------------ */

const StaticGrid: React.FC<{ palette: string[] }> = ({ palette }) => (
  <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
    {FIGURES.map((f, i) => (
      <div
        key={f.name}
        className="ui-card rounded-2xl p-5 flex flex-col items-center gap-3 text-center"
        style={{ boxShadow: `0 0 30px ${rgba(palette[i], 0.18)}` }}
      >
        <div
          className="w-14 h-14 rounded-xl"
          style={{ background: palette[i], boxShadow: `0 0 24px ${rgba(palette[i], 0.5)}` }}
        />
        <div>
          <div className="text-xs font-bold">{f.name}</div>
          <div className="text-[10px] font-mono text-[var(--text-muted)]">{f.tag}</div>
        </div>
      </div>
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/* Main component                                                     */
/* ------------------------------------------------------------------ */

export const ThreeFigureShowcase: React.FC = () => {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const accent = useThemeAccent();
  const palette = React.useMemo(() => buildPalette(accent), [accent]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });

  const progressRef = React.useRef(0);
  const activeIndexRef = React.useRef(0);
  const [activeIndex, setActiveIndex] = React.useState(0);

  useMotionValueEvent(smooth, 'change', (v) => {
    progressRef.current = v;
    const idx = Math.round(v * (FIGURES.length - 1));
    activeIndexRef.current = idx;
    setActiveIndex(idx);
  });

  const total = FIGURES.length;
  const active = FIGURES[activeIndex] ?? FIGURES[0];

  return (
    <section ref={sectionRef} className="relative h-[280vh] border-b border-[var(--border-color)]">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

        {reduce ? (
          <div className="relative z-10 max-w-6xl mx-auto px-4 text-center space-y-8">
            <SectionLabel />
            <StaticGrid palette={palette} />
          </div>
        ) : (
          <>
            <div className="absolute inset-0 pointer-events-none">
              <Canvas
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: true }}
                camera={{ position: [0, 0, 6.2], fov: 45 }}
                frameloop="always"
              >
                <Suspense fallback={null}>
                  <Scene
                    progressRef={progressRef}
                    activeIndexRef={activeIndexRef}
                    palette={palette}
                  />
                </Suspense>
              </Canvas>
            </div>

            {/* overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 pointer-events-none">
              <div className="flex items-start justify-between">
                <SectionLabel />
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="text-right"
                >
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)]">
                    {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                  </div>
                  <div className="text-lg sm:text-2xl font-black tracking-tight">
                    {active.name}
                  </div>
                  <div className="text-[11px] font-mono text-[var(--text-muted)]">
                    {active.tag}
                  </div>
                </motion.div>
              </div>

              {/* center headline */}
              <div className="text-center -mt-6">
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                  Real Tech Primitives.
                  <br />
                  <span style={{ color: accent }}>One Scroll.</span>
                </h2>
                <p className="mt-3 text-xs sm:text-sm text-[var(--text-muted)] max-w-xl mx-auto">
                  Interactive 3D figures for TypeScript, React, MongoDB, Turborepo, and 40 AI assistant ecosystems.
                  Scroll to inspect the full architecture stack in real-time.
                </p>
              </div>

              {/* progress dots */}
              <div className="flex items-center justify-center gap-2">
                {FIGURES.map((f, i) => (
                  <div
                    key={f.name}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: i === activeIndex ? 28 : 8,
                      background:
                        i === activeIndex
                          ? accent
                          : 'var(--border-color)',
                    }}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

function SectionLabel() {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full ui-card-subtle border text-[11px] font-mono text-[var(--text-muted)]">
      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
      <span>TECH ARCHITECTURE STACK</span>
    </div>
  );
}
