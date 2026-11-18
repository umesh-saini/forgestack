import { describe, expect, it } from 'vitest';
import { VirtualFileSystem } from '../../../vfs/vfs.js';
import { nextjsSlice } from '../nextjs.js';
import type { ProjectConfig } from '../../../types/config.js';

describe('Next.js 15 Full-Stack Slice', () => {
  const nextConfig: ProjectConfig = {
    name: 'my-next-app',
    targetPath: './my-next-app',
    topology: 'nextjs-fullstack',
    frontend: {
      framework: 'nextjs',
      styling: 'tailwind',
      state: 'none',
      dateLib: 'date-fns',
      toast: 'sonner',
      uiExtras: { toast: true, icons: true, forms: false },
    },
    backend: {
      framework: 'none',
      database: 'none',
      orm: 'none',
      container: false,
    },
    aiGovernance: { rules: true, skills: true, openSpec: true },
    packageManager: 'pnpm',
    git: true,
    install: false,
  };

  it('should scaffold complete Next.js 15 App Router structure with API route and Tailwind CSS v4', () => {
    const vfs = new VirtualFileSystem();
    nextjsSlice.apply(vfs, nextConfig);

    expect(vfs.hasFile('package.json')).toBe(true);
    expect(vfs.hasFile('next.config.ts')).toBe(true);
    expect(vfs.hasFile('app/layout.tsx')).toBe(true);
    expect(vfs.hasFile('app/page.tsx')).toBe(true);
    expect(vfs.hasFile('app/globals.css')).toBe(true);
    expect(vfs.hasFile('app/api/health/route.ts')).toBe(true);
    expect(vfs.hasFile('tsconfig.json')).toBe(true);

    const pkg = JSON.parse(vfs.getFileContent('package.json')!);
    expect(pkg.dependencies.next).toBeDefined();
    expect(pkg.dependencies['date-fns']).toBeDefined();
    expect(pkg.dependencies.sonner).toBeDefined();

    const healthRoute = vfs.getFileContent('app/api/health/route.ts')!;
    expect(healthRoute).toContain('export async function GET()');
    expect(healthRoute).toContain('Next.js 15');
  });

  it('should scaffold Next.js 15 fullstack with PostgreSQL and Drizzle ORM when backend database is configured', async () => {
    const { generateProjectVfs } = await import('../../../engine/create-pipeline.js');
    const fullstackConfig: ProjectConfig = {
      ...nextConfig,
      backend: {
        framework: 'none',
        database: 'postgres',
        orm: 'drizzle',
        container: true,
      },
    };

    const vfs = await generateProjectVfs(fullstackConfig);

    expect(vfs.hasFile('package.json')).toBe(true);
    expect(vfs.hasFile('drizzle.config.ts')).toBe(true);
    expect(vfs.hasFile('src/db/schema.ts')).toBe(true);
    expect(vfs.hasFile('src/db/index.ts')).toBe(true);
    expect(vfs.hasFile('.env.local')).toBe(true);

    const pkg = JSON.parse(vfs.getFileContent('package.json')!);
    expect(pkg.dependencies.next).toBeDefined();
    expect(pkg.dependencies['drizzle-orm']).toBeDefined();
    expect(pkg.dependencies.pg).toBeDefined();
    expect(pkg.devDependencies['drizzle-kit']).toBeDefined();

    const drizzleConfig = vfs.getFileContent('drizzle.config.ts')!;
    expect(drizzleConfig).toContain("dialect: 'postgresql'");
    expect(drizzleConfig).toContain("schema: './src/db/schema.ts'");

    const envLocal = vfs.getFileContent('.env.local')!;
    expect(envLocal).toContain('DATABASE_URL=postgresql://');
  });

  it('should scaffold Next.js 15 fullstack with SQLite when sqlite is selected', async () => {
    const { generateProjectVfs } = await import('../../../engine/create-pipeline.js');
    const sqliteNextConfig: ProjectConfig = {
      ...nextConfig,
      backend: {
        framework: 'none',
        database: 'sqlite',
        orm: 'drizzle',
        container: false,
      },
    };

    const vfs = await generateProjectVfs(sqliteNextConfig);

    expect(vfs.hasFile('src/db/schema.ts')).toBe(true);
    expect(vfs.hasFile('src/db/index.ts')).toBe(true);
    expect(vfs.hasFile('drizzle.config.ts')).toBe(true);
    expect(vfs.hasFile('.env.local')).toBe(true);

    const pkg = JSON.parse(vfs.getFileContent('package.json')!);
    expect(pkg.dependencies['better-sqlite3']).toBeDefined();
    expect(pkg.dependencies['drizzle-orm']).toBeDefined();
  });
});
