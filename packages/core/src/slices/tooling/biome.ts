import type { FeatureSlice } from '../../engine/compositor.js';
import { DEPENDENCY_REGISTRY } from '../../registry/dependencies.js';
import type { ProjectConfig } from '../../types/config.js';
import type { VirtualFileSystem } from '../../vfs/vfs.js';

export const biomeSlice: FeatureSlice = {
  id: 'tooling-biome',
  name: 'Biome.js Fast Linter & Formatter',
  apply: (vfs: VirtualFileSystem, config: ProjectConfig) => {
    if (config.linter !== 'biome') {
      return;
    }

    // 1. Generate root biome.json
    const biomeConfig = {
      $schema: 'https://biomejs.dev/schemas/1.9.4/schema.json',
      vcs: {
        enabled: true,
        clientKind: 'git',
        useIgnoreFile: true,
      },
      files: {
        ignoreUnknown: true,
        // Biome 1.x key (`includes` is 2.x syntax and is rejected by the pinned ^1.9.4)
        include: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.json'],
        // Explicit, because the VCS ignore file only applies once the project is a git repo
        ignore: ['**/dist/**', '**/out/**', '**/.next/**', '**/node_modules/**', '**/migrations/**', '**/src-tauri/**', '**/next-env.d.ts'],
      },
      formatter: {
        enabled: true,
        indentStyle: 'space',
        indentWidth: 2,
        lineWidth: 100,
      },
      linter: {
        enabled: true,
        rules: {
          recommended: true,
          correctness: {
            noUnusedVariables: 'warn',
          },
          // The generated code uses static service classes (Database, controllers) by design
          complexity: {
            noStaticOnlyClass: 'off',
            noThisInStatic: 'warn',
            noForEach: 'warn',
          },
          style: {
            noParameterAssign: 'warn',
            noNonNullAssertion: 'warn',
          },
          suspicious: {
            noExplicitAny: 'off',
          },
        },
      },
      javascript: {
        formatter: {
          quoteStyle: 'single',
          trailingCommas: 'es5',
          semicolons: 'always',
        },
      },
    };

    vfs.applyAction({
      type: 'CREATE',
      path: 'biome.json',
      content: JSON.stringify(biomeConfig, null, 2) + '\n',
    });

    // 2. Update package.json scripts and devDependencies
    // Every generated package, not a hard-coded list (desktop/worker/micro-frontend apps were missed).
    const candidatePaths = vfs.getAllFiles().map((f) => f.path).filter((p) => p === 'package.json' || p.endsWith('/package.json'));

    for (const pkgPath of candidatePaths) {
      if (vfs.hasFile(pkgPath)) {
        vfs.applyAction({
          type: 'MERGE_JSON',
          path: pkgPath,
          content: {
            scripts: {
              // lint only: `biome check` also fails on formatting, which `format` handles
              lint: 'biome lint .',
              'lint:fix': 'biome check --write .',
              format: 'biome format --write .',
            },
            devDependencies: {
              '@biomejs/biome': DEPENDENCY_REGISTRY['@biomejs/biome'],
            },
          },
        });
      }
    }
  },
};
