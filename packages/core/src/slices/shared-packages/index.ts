import type { FeatureSlice } from '../../engine/compositor.js';
import { DEPENDENCY_REGISTRY } from '../../registry/dependencies.js';
import type { ProjectConfig } from '../../types/config.js';
import type { VirtualFileSystem } from '../../vfs/vfs.js';

export const sharedPackagesSlice: FeatureSlice = {
  id: 'shared-packages',
  name: 'Shared Monorepo Packages (@repo/contracts, @repo/ui, config)',
  apply: (vfs: VirtualFileSystem, config: ProjectConfig) => {
    if (
      config.topology !== 'monorepo' &&
      config.topology !== 'micro-frontend' &&
      config.topology !== 'ai-agent-rag'
    ) {
      return;
    }

    // 1. @repo/typescript-config
    vfs.applyAction({
      type: 'CREATE',
      path: 'packages/typescript-config/package.json',
      content: JSON.stringify(
        {
          name: '@repo/typescript-config',
          version: '0.0.1',
          private: true,
          files: ['base.json', 'react.json', 'node.json'],
        },
        null,
        2
      ) + '\n',
    });

    vfs.applyAction({
      type: 'CREATE',
      path: 'packages/typescript-config/base.json',
      content: JSON.stringify(
        {
          $schema: 'https://json.schemastore.org/tsconfig',
          compilerOptions: {
            target: 'ES2022',
            module: 'NodeNext',
            moduleResolution: 'NodeNext',
            esModuleInterop: true,
            strict: true,
            noImplicitAny: true,
            strictNullChecks: true,
            skipLibCheck: true,
            forceConsistentCasingInFileNames: true,
          },
        },
        null,
        2
      ) + '\n',
    });

    vfs.applyAction({
      type: 'CREATE',
      path: 'packages/typescript-config/react.json',
      content: JSON.stringify(
        {
          $schema: 'https://json.schemastore.org/tsconfig',
          extends: './base.json',
          compilerOptions: {
            lib: ['DOM', 'DOM.Iterable', 'ES2022'],
            module: 'ESNext',
            moduleResolution: 'Bundler',
            jsx: 'react-jsx',
            isolatedModules: true,
            noEmit: true,
          },
        },
        null,
        2
      ) + '\n',
    });

    vfs.applyAction({
      type: 'CREATE',
      path: 'packages/typescript-config/node.json',
      content: JSON.stringify(
        {
          $schema: 'https://json.schemastore.org/tsconfig',
          extends: './base.json',
          compilerOptions: {
            lib: ['ES2022'],
            module: 'NodeNext',
            moduleResolution: 'NodeNext',
            outDir: './dist',
            rootDir: './src',
          },
        },
        null,
        2
      ) + '\n',
    });

    // 2. @repo/contracts
    vfs.applyAction({
      type: 'CREATE',
      path: 'packages/contracts/package.json',
      content: JSON.stringify(
        {
          name: '@repo/contracts',
          version: '0.0.1',
          private: true,
          type: 'module',
          main: './dist/index.js',
          types: './dist/index.d.ts',
          exports: {
            '.': {
              types: './src/index.ts',
              import: './dist/index.js',
            },
          },
          scripts: {
            build: 'tsc',
            typecheck: 'tsc --noEmit',
          },
          dependencies: {
            zod: DEPENDENCY_REGISTRY.zod,
          },
          devDependencies: {
            '@repo/typescript-config': 'workspace:*',
            typescript: DEPENDENCY_REGISTRY.typescript,
          },
        },
        null,
        2
      ) + '\n',
    });

    vfs.applyAction({
      type: 'CREATE',
      path: 'packages/contracts/tsconfig.json',
      content: JSON.stringify(
        {
          extends: '@repo/typescript-config/node.json',
          compilerOptions: {
            outDir: './dist',
            rootDir: './src',
            declaration: true,
          },
          include: ['src/**/*'],
        },
        null,
        2
      ) + '\n',
    });

    vfs.applyAction({
      type: 'CREATE',
      path: 'packages/contracts/src/auth.contract.ts',
      content: `import { z } from 'zod';

export const loginRequestSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export type LoginRequestDto = z.infer<typeof loginRequestSchema>;

export const userResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.string(),
});

export type UserResponseDto = z.infer<typeof userResponseSchema>;

export const apiErrorResponseSchema = z.object({
  statusCode: z.number(),
  error: z.string(),
  message: z.string(),
  details: z.unknown().optional(),
});

export type ApiErrorResponseDto = z.infer<typeof apiErrorResponseSchema>;
`,
    });

    vfs.applyAction({
      type: 'CREATE',
      path: 'packages/contracts/src/index.ts',
      content: `export * from './auth.contract.js';\n`,
    });

    // 3. @repo/ui
    vfs.applyAction({
      type: 'CREATE',
      path: 'packages/ui/package.json',
      content: JSON.stringify(
        {
          name: '@repo/ui',
          version: '0.0.1',
          private: true,
          type: 'module',
          exports: {
            '.': './src/index.ts',
          },
          dependencies: {
            react: DEPENDENCY_REGISTRY.react,
            'react-dom': DEPENDENCY_REGISTRY['react-dom'],
            clsx: DEPENDENCY_REGISTRY.clsx,
            'tailwind-merge': DEPENDENCY_REGISTRY['tailwind-merge'],
            'lucide-react': DEPENDENCY_REGISTRY['lucide-react'],
          },
          devDependencies: {
            '@repo/typescript-config': 'workspace:*',
            typescript: DEPENDENCY_REGISTRY.typescript,
            '@types/react': DEPENDENCY_REGISTRY['@types/react'],
            '@types/react-dom': DEPENDENCY_REGISTRY['@types/react-dom'],
          },
        },
        null,
        2
      ) + '\n',
    });

    vfs.applyAction({
      type: 'CREATE',
      path: 'packages/ui/tsconfig.json',
      content: JSON.stringify(
        {
          extends: '@repo/typescript-config/react.json',
          include: ['src/**/*'],
        },
        null,
        2
      ) + '\n',
    });

    vfs.applyAction({
      type: 'CREATE',
      path: 'packages/ui/src/button.tsx',
      content: `import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600',
    secondary: 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 focus-visible:ring-zinc-600',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
    ghost: 'hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  };

  return (
    <button
      className={twMerge(clsx(baseClasses, variants[variant], sizes[size], className))}
      {...props}
    >
      {children}
    </button>
  );
};
`,
    });

    vfs.applyAction({
      type: 'CREATE',
      path: 'packages/ui/src/index.ts',
      content: `export * from './button.js';\n`,
    });
  },
};
