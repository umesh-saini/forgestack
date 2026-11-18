import type { FeatureSlice } from '../../engine/compositor.js';
import type { ProjectConfig } from '../../types/config.js';
import type { VirtualFileSystem } from '../../vfs/vfs.js';

export const ciWorkflowsSlice: FeatureSlice = {
  id: 'devops-ci-workflows',
  name: 'GitHub Actions CI/CD Pipeline',
  apply: (vfs: VirtualFileSystem, config: ProjectConfig) => {
    const isEligible =
      config.ci === 'github-actions' ||
      (config as any).ci === 'github-actions';

    if (!isEligible) {
      return;
    }

    const pm = config.packageManager || 'pnpm';
    const isMonorepo =
      config.topology === 'monorepo' || config.topology === 'micro-frontend';

    let installStep = '';
    let runCommand = '';

    if (pm === 'pnpm') {
      installStep = `      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Setup Node.js \${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile || pnpm install`;

      runCommand = isMonorepo
        ? 'pnpm turbo run lint typecheck test build'
        : 'pnpm test && pnpm build';
    } else if (pm === 'yarn') {
      installStep = `      - name: Setup Node.js \${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile || yarn install`;

      runCommand = isMonorepo
        ? 'yarn turbo run lint typecheck test build'
        : 'yarn test && yarn build';
    } else if (pm === 'bun') {
      installStep = `      - name: Setup Bun
        uses: oven-sh/setup-bun@v2

      - name: Install dependencies
        run: bun install --frozen-lockfile || bun install`;

      runCommand = 'bun test && bun run build';
    } else {
      installStep = `      - name: Setup Node.js \${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci || npm install`;

      runCommand = isMonorepo
        ? 'npx turbo run lint typecheck test build'
        : 'npm test && npm run build';
    }

    const hasPlaywright =
      config.testing?.e2e === 'playwright' ||
      (config as any).e2e === 'playwright';

    const playwrightStep = hasPlaywright
      ? `
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Run E2E Tests
        run: ${pm === 'npm' ? 'npm run test:e2e' : `${pm} test:e2e`}
`
      : '';

    const workflowContent = `name: CI Matrix
on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  validate:
    name: Node \${{ matrix.node-version }} Test & Build
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        node-version: [20, 22]

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

${installStep}

      - name: Run Validation Pipeline
        run: ${runCommand}
${playwrightStep}
`;

    vfs.applyAction({
      type: 'CREATE',
      path: '.github/workflows/ci.yml',
      content: workflowContent,
    });
  },
};
