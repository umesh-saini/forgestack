import type { FeatureSlice } from '../../engine/compositor.js';
import { DEPENDENCY_REGISTRY } from '../../registry/dependencies.js';
import type { ProjectConfig } from '../../types/config.js';
import type { VirtualFileSystem } from '../../vfs/vfs.js';

export const tailwindSlice: FeatureSlice = {
  id: 'fe-tailwind',
  name: 'Tailwind CSS v4 Styling',
  apply: (vfs: VirtualFileSystem, config: ProjectConfig) => {
    if (
      config.frontend.framework !== 'react-vite' ||
      config.frontend.styling !== 'tailwind' ||
      config.topology === 'electron-desktop' ||
      config.topology === 'nextjs-fullstack'
    ) {
      return;
    }

    const basePath =
      config.topology === 'monorepo' || config.topology === 'micro-frontend'
        ? 'apps/web'
        : config.topology === 'separate-folders'
        ? 'frontend'
        : '';
    const resolvePath = (p: string) => (basePath ? `${basePath}/${p}` : p);

    // 1. Merge Tailwind v4 dependencies
    vfs.applyAction({
      type: 'MERGE_JSON',
      path: resolvePath('package.json'),
      content: {
        dependencies: {
          clsx: DEPENDENCY_REGISTRY.clsx,
          'tailwind-merge': DEPENDENCY_REGISTRY['tailwind-merge'],
        },
        devDependencies: {
          tailwindcss: DEPENDENCY_REGISTRY.tailwindcss,
          '@tailwindcss/vite': DEPENDENCY_REGISTRY['@tailwindcss/vite'],
        },
      },
    });

    // 2. Patch vite.config.ts with @tailwindcss/vite
    vfs.applyAction({
      type: 'PATCH_AST',
      path: resolvePath('vite.config.ts'),
      patcher: (content) => {
        let patched = content;
        if (!patched.includes('@tailwindcss/vite')) {
          patched = `import tailwindcss from '@tailwindcss/vite';\n${patched}`;
          patched = patched.replace(
            'plugins: [react()],',
            'plugins: [react(), tailwindcss()],'
          );
        }
        return patched;
      },
    });

    // 3. Update src/index.css with Tailwind CSS v4 import & theme variables
    vfs.applyAction({
      type: 'OVERWRITE',
      path: resolvePath('src/index.css'),
      content: `@import "tailwindcss";

@layer base {
  :root {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;
    --radius: 0.5rem;
  }
}

body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  font-feature-settings: "rlig" 1, "calt" 1;
}
`,
    });

    // 4. Create src/lib/utils.ts with cn() utility
    vfs.applyAction({
      type: 'CREATE',
      path: resolvePath('src/lib/utils.ts'),
      content: `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges class names safely without Tailwind specificity collisions.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
`,
    });
  },
};
