import type { FeatureSlice } from '../../engine/compositor.js';
import { DEPENDENCY_REGISTRY } from '../../registry/dependencies.js';
import type { ProjectConfig } from '../../types/config.js';
import type { VirtualFileSystem } from '../../vfs/vfs.js';

export const nextjsSlice: FeatureSlice = {
  id: 'fe-nextjs',
  name: 'Next.js 15 App Router with Tailwind CSS v4',
  apply: (vfs: VirtualFileSystem, config: ProjectConfig) => {
    const isNext = config.frontend.framework === 'nextjs' || config.topology === 'nextjs-fullstack';
    if (!isNext) {
      return;
    }

    const basePath =
      config.topology === 'monorepo' || config.topology === 'micro-frontend'
        ? 'apps/web'
        : config.topology === 'separate-folders'
        ? 'frontend'
        : '';
    const resolvePath = (p: string) => (basePath ? `${basePath}/${p}` : p);

    // 1. package.json
    const packageJson = {
      name:
        config.topology === 'monorepo' || config.topology === 'micro-frontend'
          ? '@repo/web'
          : config.name,
      version: '0.1.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint',
      },
      dependencies: {
        next: DEPENDENCY_REGISTRY.next,
        react: DEPENDENCY_REGISTRY.react,
        'react-dom': DEPENDENCY_REGISTRY['react-dom'],
        clsx: DEPENDENCY_REGISTRY.clsx,
        'tailwind-merge': DEPENDENCY_REGISTRY['tailwind-merge'],
        'lucide-react': DEPENDENCY_REGISTRY['lucide-react'],
        zod: DEPENDENCY_REGISTRY.zod,
        ...(config.frontend.dateLib === 'dayjs'
          ? { dayjs: DEPENDENCY_REGISTRY.dayjs }
          : config.frontend.dateLib === 'date-fns'
          ? { 'date-fns': DEPENDENCY_REGISTRY['date-fns'] }
          : config.frontend.dateLib === 'moment'
          ? { moment: DEPENDENCY_REGISTRY.moment }
          : {}),
        ...(config.frontend.toast === 'sonner' ? { sonner: DEPENDENCY_REGISTRY.sonner } : {}),
      },
      devDependencies: {
        '@types/node': DEPENDENCY_REGISTRY['@types/node'],
        '@types/react': DEPENDENCY_REGISTRY['@types/react'],
        '@types/react-dom': DEPENDENCY_REGISTRY['@types/react-dom'],
        tailwindcss: DEPENDENCY_REGISTRY.tailwindcss,
        typescript: DEPENDENCY_REGISTRY.typescript,
      },
    };

    vfs.applyAction({
      type: 'CREATE',
      path: resolvePath('package.json'),
      content: JSON.stringify(packageJson, null, 2) + '\n',
    });

    // 2. next.config.ts
    vfs.applyAction({
      type: 'CREATE',
      path: resolvePath('next.config.ts'),
      content: `import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
`,
    });

    // 3. app/globals.css
    vfs.applyAction({
      type: 'CREATE',
      path: resolvePath('app/globals.css'),
      content: `@import "tailwindcss";

:root {
  --background: #09090b;
  --foreground: #f4f4f5;
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
`,
    });

    // 4. app/layout.tsx
    vfs.applyAction({
      type: 'CREATE',
      path: resolvePath('app/layout.tsx'),
      content: `import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '${config.name}',
  description: 'Synthesized with ForgeStack Studio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
`,
    });

    // 5. app/page.tsx
    vfs.applyAction({
      type: 'CREATE',
      path: resolvePath('app/page.tsx'),
      content: `import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-3xl mx-auto space-y-6">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Next.js 15 App Router + Tailwind CSS v4</span>
      </div>

      <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
        ${config.name}
      </h1>

      <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-xl">
        High-performance full-stack web application initialized with Server Components, strict TypeScript contracts, and Day-One AI Governance.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-left mt-4">
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm">
            <Zap className="w-4 h-4" />
            <span>Server Actions & Routes</span>
          </div>
          <p className="text-xs text-zinc-400">
            Type-safe API routes and Server Actions at <code className="text-zinc-200">/app/api/health</code>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>AI Governance Ready</span>
          </div>
          <p className="text-xs text-zinc-400">
            Built-in architectural constraints, agent playbooks, and spec workflows.
          </p>
        </div>
      </div>
    </main>
  );
}
`,
    });

    // 6. app/api/health/route.ts
    vfs.applyAction({
      type: 'CREATE',
      path: resolvePath('app/api/health/route.ts'),
      content: `export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: '${config.name}',
    framework: 'Next.js 15',
  });
}
`,
    });

    // 7. tsconfig.json
    vfs.applyAction({
      type: 'CREATE',
      path: resolvePath('tsconfig.json'),
      content: JSON.stringify(
        {
          compilerOptions: {
            target: 'ES2022',
            lib: ['dom', 'dom.iterable', 'esnext'],
            allowJs: true,
            skipLibCheck: true,
            strict: true,
            noEmit: true,
            esModuleInterop: true,
            module: 'esnext',
            moduleResolution: 'bundler',
            resolveJsonModule: true,
            isolatedModules: true,
            jsx: 'preserve',
            incremental: true,
            plugins: [{ name: 'next' }],
            paths: {
              '@/*': ['./*'],
            },
          },
          include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
          exclude: ['node_modules'],
        },
        null,
        2
      ) + '\n',
    });

    // 8. .env.example
    const nextEnvLines = [
      '# Next.js Full-Stack Application Environment Variables',
      'PORT=3000',
      'NODE_ENV=development',
      'NEXT_PUBLIC_APP_URL=http://localhost:3000',
    ];
    if (config.backend?.database === 'postgres') {
      nextEnvLines.push(
        `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/${config.name.replace(/[^a-zA-Z0-9_]/g, '_')}`
      );
    } else if (config.backend?.database === 'mongodb') {
      nextEnvLines.push(
        `MONGODB_URI=mongodb://localhost:27017/${config.name.replace(/[^a-zA-Z0-9_]/g, '_')}`
      );
    } else if (config.backend?.database === 'sqlite') {
      nextEnvLines.push('DATABASE_URL=file:./dev.db');
    }
    if (config.utilities?.backendHelpers) {
      nextEnvLines.push(
        'JWT_SECRET=supersecret-dev-jwt-key-replace-in-production-min-32-chars-long'
      );
    }
    vfs.applyAction({
      type: 'CREATE',
      path: resolvePath('.env.example'),
      content: nextEnvLines.join('\n') + '\n',
    });
  },
};
