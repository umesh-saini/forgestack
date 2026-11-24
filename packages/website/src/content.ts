export const REPO = 'https://github.com/umesh-saini/forgestack';
export const CREATE_CMD = 'npx -p @forgestack/cli create-forgestack-app my-app';
const MCP_ARGS = ['-y', '-p', '@forgestack/cli', 'forgestack-mcp'];

export const STATS = [
  { value: '636k+', label: 'option combinations checked on every push' },
  { value: '~100', label: 'projects installed, built, started & probed nightly' },
  { value: '40', label: 'AI coding tools supported' },
  { value: '1', label: 'command from zero to a running project' },
];

export const FEATURES = [
  {
    title: 'Verified, not just generated',
    body: 'Every combination of options is checked for broken imports, missing dependencies and invalid scripts. A pairwise sample is installed, built, linted, migrated and started against real Postgres, MongoDB and Redis.',
  },
  {
    title: 'Compose, don’t clone',
    body: 'Projects are assembled in memory from small feature slices, so any combination works and nothing goes stale like a template repo. Nothing touches disk until the whole tree is valid.',
  },
  {
    title: 'Auth, RPC and data wired end to end',
    body: 'Better-Auth sign-up and sign-in, tRPC routers, Drizzle or Prisma migrations and BullMQ workers are mounted and working, not left as TODOs.',
  },
  {
    title: 'Built for AI agents',
    body: 'A local MCP server lets Claude Code, Codex, Antigravity and others scaffold for you in one tool call, and every project ships rules and skills for 40 AI tools.',
  },
  {
    title: 'CLI, wizard or desktop app',
    body: 'Run one command with flags, answer an interactive wizard, or pick options visually in the Tauri desktop studio with a live file-tree preview.',
  },
  {
    title: 'Any package manager',
    body: 'pnpm, npm, yarn and bun monorepos get the right workspace setup, lockfile-friendly versions and build-script allow-lists.',
  },
];

/** Human labels for schema values; unknown values fall back to the raw id, so new options still appear. */
export const LABELS: Record<string, string> = {
  monorepo: 'Turborepo monorepo',
  'separate-folders': 'Separate frontend/backend',
  'micro-frontend': 'Micro-frontends (Module Federation)',
  'standalone-fe': 'Standalone frontend',
  'standalone-be': 'Standalone API',
  'electron-desktop': 'Electron desktop',
  'nextjs-fullstack': 'Next.js full-stack',
  'tauri-desktop': 'Tauri v2 desktop',
  'ai-agent-rag': 'AI agent + RAG (pgvector)',
  'distributed-worker': 'BullMQ worker service',
  'react-vite': 'React 19 + Vite',
  nextjs: 'Next.js 15',
  tailwind: 'Tailwind CSS v4',
  query: 'TanStack Query',
  redux: 'Redux Toolkit',
  zustand: 'Zustand',
  fastify: 'Fastify',
  express: 'Express',
  hono: 'Hono',
  postgres: 'PostgreSQL',
  mongodb: 'MongoDB',
  sqlite: 'SQLite',
  drizzle: 'Drizzle',
  prisma: 'Prisma',
  mongoose: 'Mongoose',
  'better-auth': 'Better-Auth',
  trpc: 'tRPC v11',
  bullmq: 'BullMQ',
  playwright: 'Playwright',
  cypress: 'Cypress',
  'github-actions': 'GitHub Actions',
  eslint: 'ESLint 9',
  biome: 'Biome',
  docker: 'Docker',
  vercel: 'Vercel',
  cloudflare: 'Cloudflare',
  railway: 'Railway',
  fly: 'Fly.io',
  pnpm: 'pnpm',
  npm: 'npm',
  yarn: 'yarn',
  bun: 'bun',
};

export const CLI_EXAMPLES = [
  { title: 'Interactive wizard', cmd: 'npx -p @forgestack/cli create-forgestack-app my-app' },
  { title: 'Recommended defaults, no prompts', cmd: 'npx -p @forgestack/cli create-forgestack-app my-app --yes' },
  { title: 'Scaffold into the current folder', cmd: 'npx -p @forgestack/cli create-forgestack-app . --yes' },
  { title: 'Start from a curated template', cmd: 'npx -p @forgestack/cli create-forgestack-app my-app --template nextjs-fullstack' },
  {
    title: 'Pick every layer yourself',
    cmd: 'npx -p @forgestack/cli create-forgestack-app my-api \\\n  --topology standalone-be --be hono --db postgres --orm drizzle \\\n  --auth better-auth --linter biome --pm npm --yes',
  },
  { title: 'List curated templates', cmd: 'npx -p @forgestack/cli forgestack template list' },
  { title: 'Install globally (shorter commands)', cmd: 'npm i -g @forgestack/cli\ncreate-forgestack-app my-app' },
];

const json = (o: unknown) => JSON.stringify(o, null, 2);
const mcpJson = json({ mcpServers: { forgestack: { command: 'npx', args: MCP_ARGS } } });

export const AI_TOOLS = [
  {
    name: 'Claude Code',
    where: 'Terminal (user scope = every project)',
    code: `claude mcp add --scope user forgestack -- npx ${MCP_ARGS.join(' ')}`,
  },
  {
    name: 'Codex',
    where: 'Terminal (writes ~/.codex/config.toml, global)',
    code: `codex mcp add forgestack -- npx ${MCP_ARGS.join(' ')}`,
  },
  { name: 'Antigravity', where: 'Agent panel → MCP Servers → Manage → View raw config (mcp_config.json)', code: mcpJson },
  { name: 'Cursor', where: '~/.cursor/mcp.json (global)', code: mcpJson },
  { name: 'Gemini CLI', where: '~/.gemini/settings.json (global)', code: mcpJson },
  { name: 'Windsurf', where: '~/.codeium/windsurf/mcp_config.json', code: mcpJson },
  {
    name: 'VS Code (Copilot)',
    where: 'Terminal (adds to your user profile)',
    code: `code --add-mcp '${JSON.stringify({ name: 'forgestack', command: 'npx', args: MCP_ARGS })}'`,
  },
];

export const AI_PROMPT =
  'Use the forgestack MCP tools to scaffold a pnpm monorepo called "shop" with React, Fastify, PostgreSQL + Drizzle, Better-Auth and tRPC in ~/code/shop, then install dependencies.';

export const SKILLS_CMD = 'npx -p @forgestack/cli forgestack init-skills ~ --tools claude,codex';

/** Estimates. Output sizes are measured from generated projects; session totals assume an agent that
 *  re-sends its context each step and goes through a few build-fix loops. */
export const TOKEN_ROWS = [
  { project: 'Standalone frontend or API (~25 files)', scratch: '150k – 600k', time: '15 – 45 min', forge: '2k – 5k' },
  { project: 'Next.js full-stack with auth + DB (~25 files)', scratch: '300k – 1M', time: '30 – 90 min', forge: '2k – 5k' },
  { project: 'Monorepo: React + API + DB + auth + tRPC + CI (80–90 files)', scratch: '800k – 3M+', time: '1 – 4 h', forge: '3k – 6k' },
];
