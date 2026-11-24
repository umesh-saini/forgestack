import type { FeatureSlice } from '../../engine/compositor.js';
import { DEPENDENCY_REGISTRY } from '../../registry/dependencies.js';
import type { ProjectConfig } from '../../types/config.js';
import type { VirtualFileSystem } from '../../vfs/vfs.js';

const ESLINT_CONFIG = `import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['**/dist/**', '**/.next/**', '**/out/**', '**/src-tauri/**', '**/*.cjs', '**/next-env.d.ts'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  {
    // Starter code: surface these as warnings so a fresh project lints clean.
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
);
`;

const isPkg = (p: string) => p === 'package.json' || p.endsWith('/package.json');

/**
 * Makes every package's `lint` script actually runnable: for ESLint, each package that lints gets
 * eslint + typescript-eslint and a flat config (ESLint 9 refuses to run without one).
 * With linter 'none', lint scripts that would call a missing tool are removed.
 */
export const eslintSlice: FeatureSlice = {
  id: 'tooling-eslint',
  name: 'ESLint 9 Flat Config',
  apply: (vfs: VirtualFileSystem, config: ProjectConfig) => {
    const linter = config.linter ?? 'eslint';
    if (linter === 'biome') return; // biome slice owns lint scripts

    for (const file of vfs.getAllFiles().filter((f) => isPkg(f.path))) {
      const pkg = JSON.parse(file.content);
      const lint: string | undefined = pkg.scripts?.lint;
      if (!lint || !/\b(eslint|next lint)\b/.test(lint)) continue;
      const dir = file.path === 'package.json' ? '' : file.path.slice(0, -'/package.json'.length);

      if (linter === 'none') {
        delete pkg.scripts.lint;
        vfs.applyAction({ type: 'OVERWRITE', path: file.path, content: JSON.stringify(pkg, null, 2) + '\n' });
        continue;
      }
      vfs.applyAction({
        type: 'MERGE_JSON',
        path: file.path,
        content: {
          // `next lint` is deprecated and prompts interactively without a config
          scripts: { lint: 'eslint .' },
          devDependencies: {
            eslint: DEPENDENCY_REGISTRY.eslint,
            '@eslint/js': DEPENDENCY_REGISTRY['@eslint/js'],
            'typescript-eslint': DEPENDENCY_REGISTRY['typescript-eslint'],
            globals: DEPENDENCY_REGISTRY.globals,
          },
        },
      });
      const cfgPath = dir ? `${dir}/eslint.config.mjs` : 'eslint.config.mjs';
      if (!vfs.hasFile(cfgPath)) vfs.applyAction({ type: 'CREATE', path: cfgPath, content: ESLINT_CONFIG });
    }
  },
};
