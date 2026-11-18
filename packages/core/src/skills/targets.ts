export type AgentToolId =
  | 'shared'
  | 'antigravity'
  | 'claude'
  | 'cursor'
  | 'windsurf'
  | 'copilot'
  | 'cline'
  | 'continue';

export interface AgentSkillTarget {
  id: AgentToolId;
  name: string;
  description: string;
  relativePath: string;
  generateContent: (skillDoc: string) => string;
}

export const FORGESTACK_CANONICAL_SKILL = `---
name: forgestack
description: Comprehensive architecture, CLI flags, in-memory VFS manipulation, and scaffolding guide for ForgeStack TypeScript monorepos, Next.js 15, micro-frontends, and clean modular APIs with Day-One AI Governance. Use whenever scaffolding, configuring, or inspecting projects using ForgeStack.
---

# ForgeStack: Enterprise Project Scaffolding & Architecture Engine

ForgeStack is a production-grade project scaffolding platform and AST composition engine. It synthesizes complete, type-safe fullstack architectures with Day-One AI Governance in seconds, either via the CLI (\`create-forgestack-app\`), native Desktop Studio GUI, or autonomous MCP tool execution.

---

## 1. Core Architecture Concepts

- **Virtual File System (VFS)**: Projects are compiled in-memory first (\`@forgestack/core/browser\`). Files, directories, permissions, and executable bits are staged in RAM before touching physical storage.
- **AST Recipe Compositor**: Rather than using static folder templates that conflict when composed, ForgeStack slices modify files programmatically (merging \`package.json\` dependencies, injecting TypeScript path mappings, updating \`tsconfig.json\`, and composing Tailwind configs).
- **Day-One AI Governance**: Projects are scaffolded with autonomous AI guidelines pre-configured:
  - **OpenSpec**: Spec-driven change management (\`openspec/specs/\`, \`openspec/changes/\`).
  - **Open-GSD**: Milestone-driven delivery (\`gsd/PROJECT.md\`, \`gsd/ROADMAP.md\`, \`gsd/STATE.md\`).
  - **GitHub Spec-Kit**: Constitution and prompt-driven specs (\`.spec-kit/constitution.md\`).
  - **IDE Rules**: Cursor rules (\`.cursorrules\`), Anthropic Claude rules (\`CLAUDE.md\`), and AAS Agent Skills (\`.agents/skills/\`).

---

## 2. CLI Command & Flag Reference

### Quickstart
\`\`\`bash
# Interactive guided wizard
npx create-forgestack-app my-app

# Headless one-liner (Enterprise Monorepo)
npx create-forgestack-app my-app \\
  --topology monorepo \\
  --fe react-vite \\
  --styling tailwind \\
  --state query \\
  --be fastify \\
  --db postgres \\
  --orm drizzle \\
  --auth better-auth \\
  --install \\
  --git
\`\`\`

### Full Option Matrix

| Flag | Allowed Values | Description |
| :--- | :--- | :--- |
| \`--topology\` | \`monorepo\`, \`separate-folders\`, \`nextjs-fullstack\`, \`standalone-fe\`, \`backend-api\`, \`electron-desktop\` | Architecture topology |
| \`--fe\` | \`react-vite\`, \`nextjs\`, \`none\` | Frontend framework |
| \`--styling\` | \`tailwind\`, \`vanilla\` | CSS & design tokens (Tailwind CSS v4) |
| \`--state\` | \`query\`, \`zustand\`, \`jotai\`, \`none\` | State management (TanStack Query v5 default) |
| \`--be\` | \`fastify\`, \`express\`, \`clean-modular\`, \`none\` | Backend framework |
| \`--db\` | \`postgres\`, \`mongodb\`, \`sqlite\`, \`none\` | Database engine |
| \`--orm\` | \`drizzle\`, \`prisma\`, \`mongoose\`, \`none\` | Type-safe ORM / ODM layer |
| \`--auth\` | \`better-auth\`, \`none\` | Modern type-safe authentication layer |
| \`--date-lib\` | \`dayjs\`, \`date-fns\`, \`moment\`, \`none\` | Date manipulation utility library |
| \`--process-manager\`| \`docker\`, \`pm2\`, \`none\` | Process & container orchestration |
| \`--ai-governance\` | \`openspec\`, \`gsd\`, \`speckit\`, \`all\`, \`none\` | Spec-driven AI governance framework |
| \`--package-manager\`| \`pnpm\`, \`npm\`, \`yarn\`, \`bun\` | Target package manager (defaults to pnpm) |
| \`--install\` / \`--no-install\` | Boolean | Automatically run dependency installation |
| \`--git\` / \`--no-git\` | Boolean | Initialize local git repository & initial commit |

---

## 3. Presets & Archetypes

1. **Enterprise Fullstack Monorepo (\`monorepo\`)**:
   - Turborepo orchestration with \`apps/web\` (React 19), \`apps/api\` (Fastify / Express), and \`packages/ui\` / \`packages/config\`.
2. **Next.js 15 Full-Stack (\`nextjs-fullstack\`)**:
   - App Router, React 19 Server Actions, route handlers (\`app/api/health/route.ts\`), PostgreSQL + Drizzle ORM, Better-Auth.
3. **Electron Desktop Application (\`electron-desktop\`)**:
   - \`electron-vite\` with secure IPC preload (\`contextBridge.exposeInMainWorld('electronAPI', ...)\`), main process lifecycle, and React 19 renderer.
4. **Clean Modular Polyrepo (\`separate-folders\`)**:
   - Isolated \`frontend/\` and \`backend/\` folders for teams preferring independent deployment lifecycles.
5. **Backend API Microservice (\`backend-api\`)**:
   - Pure Fastify / Express modular API with BullMQ Redis background worker queue and Docker containerization.

---

## 4. Autonomous AI Usage via Model Context Protocol (MCP)

AI agents can directly interface with ForgeStack using the local zero-OAuth MCP server:
\`\`\`bash
npx forgestack-mcp
# or: node packages/cli/bin/mcp-server.js
\`\`\`

### Available MCP Tools:
- \`forgestack_list_presets\`: Returns curated blueprints with complete configurations.
- \`forgestack_get_stack_options\`: Introspects valid enum values for all frameworks, databases, and options.
- \`forgestack_validate_config\`: Verifies a proposed \`ProjectConfig\` against Zod schemas.
- \`forgestack_preview_vfs\`: Compiles the project in memory and returns the file tree without writing to disk.
- \`forgestack_scaffold_project\`: Atomically flushes the project to physical storage on disk.

---

## 5. Desktop Studio GUI

- Launch local dev studio: \`pnpm desktop:dev\` (or open installed \`ForgeStack\` native app).
- Provides a real-time Monaco-powered code editor, templates dashboard, custom preset saving, and software updates management.
`;

export const AGENT_TARGETS: AgentSkillTarget[] = [
  {
    id: 'shared',
    name: 'Shared .agents Skills',
    description: 'Universal standard directory recognized by modern AI agents and CLI tools.',
    relativePath: '.agents/skills/forgestack/SKILL.md',
    generateContent: () => FORGESTACK_CANONICAL_SKILL,
  },
  {
    id: 'antigravity',
    name: 'Antigravity / Gemini CLI',
    description: 'Google Antigravity and Gemini CLI agents skill specification.',
    relativePath: '.agents/skills/forgestack/SKILL.md',
    generateContent: () => FORGESTACK_CANONICAL_SKILL,
  },
  {
    id: 'claude',
    name: 'Claude Code / Anthropic',
    description: 'Claude Code CLI skills and CLAUDE.md project guidelines.',
    relativePath: '.claude/skills/forgestack/SKILL.md',
    generateContent: () => FORGESTACK_CANONICAL_SKILL,
  },
  {
    id: 'cursor',
    name: 'Cursor IDE Rules',
    description: 'Cursor .cursor/rules/ rule with glob matching and agent directives.',
    relativePath: '.cursor/rules/forgestack.mdc',
    generateContent: (skillDoc) => `---
description: ForgeStack project scaffolding, CLI flags, and architectural rules
globs: "**/*"
alwaysApply: false
---

${skillDoc.replace(/^---[\s\S]*?---\n/, '')}`,
  },
  {
    id: 'windsurf',
    name: 'Windsurf / Devin Desktop',
    description: 'Windsurf / Cascade workspace rules file.',
    relativePath: '.windsurf/rules/forgestack.md',
    generateContent: (skillDoc) => skillDoc.replace(/^---[\s\S]*?---\n/, ''),
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    description: 'Workspace-wide instructions for GitHub Copilot in VS Code.',
    relativePath: '.github/copilot-instructions.md',
    generateContent: (skillDoc) => `# ForgeStack Scaffolding Guidelines for GitHub Copilot\n\n${skillDoc.replace(/^---[\s\S]*?---\n/, '')}`,
  },
  {
    id: 'cline',
    name: 'Cline & Roo Code',
    description: 'Custom instructions file for Cline / Roo Code extension.',
    relativePath: '.clinerules',
    generateContent: (skillDoc) => skillDoc.replace(/^---[\s\S]*?---\n/, ''),
  },
  {
    id: 'continue',
    name: 'Continue.dev',
    description: 'Custom slash prompt / rule for Continue.dev IDE extension.',
    relativePath: '.continue/prompts/forgestack.prompt',
    generateContent: (skillDoc) => `temperature: 0.2\n---\n${skillDoc.replace(/^---[\s\S]*?---\n/, '')}`,
  },
];
