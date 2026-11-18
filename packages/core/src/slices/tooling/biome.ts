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
        includes: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.json'],
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
    const candidatePaths = ['package.json'];
    if (config.topology === 'separate-folders') {
      candidatePaths.push('frontend/package.json', 'backend/package.json');
    } else if (
      config.topology === 'monorepo' ||
      config.topology === 'ai-agent-rag' ||
      config.topology === 'micro-frontend'
    ) {
      candidatePaths.push('apps/web/package.json', 'apps/api/package.json');
    }

    for (const pkgPath of candidatePaths) {
      if (vfs.hasFile(pkgPath)) {
        vfs.applyAction({
          type: 'MERGE_JSON',
          path: pkgPath,
          content: {
            scripts: {
              lint: 'biome check .',
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
