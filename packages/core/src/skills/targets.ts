export type AgentToolId =
  | 'agents'
  | 'shared'
  | 'antigravity'
  | 'amazon-q'
  | 'amazonq'
  | 'auggie'
  | 'bob'
  | 'claude'
  | 'cline'
  | 'command-code'
  | 'codeartsagent'
  | 'codex'
  | 'devin'
  | 'windsurf'
  | 'forgecode'
  | 'codebuddy'
  | 'continue'
  | 'costrict'
  | 'crush'
  | 'cursor'
  | 'factory'
  | 'gemini'
  | 'github-copilot'
  | 'copilot'
  | 'hermes'
  | 'iflow'
  | 'junie'
  | 'kilocode'
  | 'kimi'
  | 'kiro'
  | 'lingma'
  | 'minimax-code'
  | 'vibe'
  | 'oh-my-pi'
  | 'opencode'
  | 'pi'
  | 'codeassistant'
  | 'qoder'
  | 'qwen'
  | 'rovodev'
  | 'roocode'
  | 'trae'
  | 'zed'
  | 'zcode';

export interface AgentSkillTarget {
  id: AgentToolId;
  name: string;
  description: string;
  relativePath: string;
  detectionPaths?: string[];
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

const stripFrontmatter = (doc: string) => doc.replace(/^---[\s\S]*?---\n/, '');

export const AGENT_TARGETS: AgentSkillTarget[] = [
  // 1. Shared / Vendor-Neutral
  {
    id: 'agents',
    name: 'Shared .agents skills',
    description: 'Universal standard directory recognized by modern AI agents and CLI tools.',
    relativePath: '.agents/skills/forgestack/SKILL.md',
    detectionPaths: ['.agents/skills', '.agents'],
    generateContent: () => FORGESTACK_CANONICAL_SKILL,
  },
  // 2. Antigravity
  {
    id: 'antigravity',
    name: 'Antigravity',
    description: 'Google Antigravity autonomous agent skill specification.',
    relativePath: '.agents/skills/forgestack/SKILL.md',
    detectionPaths: ['.agent', '.agents/workflows', '.agents/skills'],
    generateContent: () => FORGESTACK_CANONICAL_SKILL,
  },
  // 3. Amazon Q Developer
  {
    id: 'amazon-q',
    name: 'Amazon Q Developer',
    description: 'AWS Amazon Q Developer coding agent rules.',
    relativePath: '.amazonq/rules/forgestack.md',
    detectionPaths: ['.amazonq'],
    generateContent: (skillDoc) => `# ForgeStack Scaffolding Guidelines for Amazon Q\n\n${stripFrontmatter(skillDoc)}`,
  },
  // 4. Auggie (Augment CLI)
  {
    id: 'auggie',
    name: 'Auggie (Augment CLI)',
    description: 'Augment Auggie CLI agent instructions.',
    relativePath: '.augment/rules/forgestack.md',
    detectionPaths: ['.augment'],
    generateContent: (skillDoc) => stripFrontmatter(skillDoc),
  },
  // 5. Bob Shell
  {
    id: 'bob',
    name: 'Bob Shell',
    description: 'Bob Shell assistant skill specification.',
    relativePath: '.bob/skills/forgestack/SKILL.md',
    detectionPaths: ['.bob'],
    generateContent: () => FORGESTACK_CANONICAL_SKILL,
  },
  // 6. Claude Code
  {
    id: 'claude',
    name: 'Claude Code',
    description: 'Claude Code CLI skills and guidelines.',
    relativePath: '.claude/skills/forgestack/SKILL.md',
    detectionPaths: ['.claude', 'CLAUDE.md'],
    generateContent: () => FORGESTACK_CANONICAL_SKILL,
  },
  // 7. Cline
  {
    id: 'cline',
    name: 'Cline',
    description: 'Autonomous coding agent instructions file for Cline.',
    relativePath: '.clinerules',
    detectionPaths: ['.cline', '.clinerules'],
    generateContent: (skillDoc) => stripFrontmatter(skillDoc),
  },
  // 8. Command Code
  {
    id: 'command-code',
    name: 'Command Code',
    description: 'Command Code assistant workflow skills.',
    relativePath: '.commandcode/skills/forgestack/SKILL.md',
    detectionPaths: ['.commandcode'],
    generateContent: () => FORGESTACK_CANONICAL_SKILL,
  },
  // 9. CodeArts
  {
    id: 'codeartsagent',
    name: 'CodeArts',
    description: 'Huawei CodeArts Snap & Doer assistant skills.',
    relativePath: '.codeartsdoer/skills/forgestack/SKILL.md',
    detectionPaths: ['.codeartsdoer'],
    generateContent: () => FORGESTACK_CANONICAL_SKILL,
  },
  // 10. Codex
  {
    id: 'codex',
    name: 'Codex',
    description: 'OpenAI Codex & ChatGPT coding agent directives.',
    relativePath: '.codex/skills/forgestack/SKILL.md',
    detectionPaths: ['.codex', '.agents/skills'],
    generateContent: () => FORGESTACK_CANONICAL_SKILL,
  },
  // 11. Devin Desktop (formerly Windsurf)
  {
    id: 'devin',
    name: 'Devin Desktop (formerly Windsurf)',
    description: 'Devin Desktop / Cascade workspace rules file.',
    relativePath: '.devin/rules/forgestack.md',
    detectionPaths: ['.devin', '.windsurf'],
    generateContent: (skillDoc) => stripFrontmatter(skillDoc),
  },
  // 12. ForgeCode
  {
    id: 'forgecode',
    name: 'ForgeCode',
    description: 'ForgeCode agent skills.',
    relativePath: '.forge/skills/forgestack/SKILL.md',
    detectionPaths: ['.forge'],
    generateContent: () => FORGESTACK_CANONICAL_SKILL,
  },
  // 13. CodeBuddy Code (CLI)
  {
    id: 'codebuddy',
    name: 'CodeBuddy Code (CLI)',
    description: 'CodeBuddy CLI agent skill specification.',
    relativePath: '.codebuddy/skills/forgestack/SKILL.md',
    detectionPaths: ['.codebuddy'],
    generateContent: () => FORGESTACK_CANONICAL_SKILL,
  },
  // 14. Continue
  {
    id: 'continue',
    name: 'Continue',
    description: 'Custom slash prompt / rule for Continue.dev IDE extension.',
    relativePath: '.continue/prompts/forgestack.prompt',
    detectionPaths: ['.continue'],
    generateContent: (skillDoc) => `temperature: 0.2\n---\n${stripFrontmatter(skillDoc)}`,
  },
  // 15. CoStrict
  {
    id: 'costrict',
    name: 'CoStrict',
    description: 'CoStrict agent spec and skills configuration.',
    relativePath: '.cospec/skills/forgestack/SKILL.md',
    detectionPaths: ['.cospec'],
    generateContent: () => FORGESTACK_CANONICAL_SKILL,
  },
  // 16. Crush
  {
    id: 'crush',
    name: 'Crush',
    description: 'Crush assistant skill specification.',
    relativePath: '.crush/skills/forgestack/SKILL.md',
    detectionPaths: ['.crush'],
    generateContent: () => FORGESTACK_CANONICAL_SKILL,
  },
  // 17. Cursor
  {
    id: 'cursor',
    name: 'Cursor',
    description: 'Cursor .cursor/rules/ rule with glob matching and agent directives.',
    relativePath: '.cursor/rules/forgestack.mdc',
    detectionPaths: ['.cursor', '.cursorrules'],
    generateContent: (skillDoc) => `---
description: ForgeStack project scaffolding, CLI flags, and architectural rules
globs: "**/*"
alwaysApply: false
---

${stripFrontmatter(skillDoc)}`,
  },
  // 18. Factory Droid
  {
    id: 'factory',
    name: 'Factory Droid',
    description: 'Factory Droid autonomous agent skills.',
    relativePath: '.factory/skills/forgestack/SKILL.md',
    detectionPaths: ['.factory'],
    generateContent: () => FORGESTACK_CANONICAL_SKILL,
  },
  // 19. Gemini CLI
  {
    id: 'gemini',
    name: 'Gemini CLI',
    description: 'Google Gemini CLI and Developer Agent skills.',
    relativePath: '.gemini/skills/forgestack/SKILL.md',
    detectionPaths: ['.gemini'],
    generateContent: () => FORGESTACK_CANONICAL_SKILL,
  },
  // 20. GitHub Copilot
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    description: 'Workspace-wide instructions for GitHub Copilot in VS Code.',
    relativePath: '.github/copilot-instructions.md',
    detectionPaths: ['.github/copilot-instructions.md', '.github', '.github/workflows'],
    generateContent: (skillDoc) => `# ForgeStack Scaffolding Guidelines for GitHub Copilot\n\n${stripFrontmatter(skillDoc)}`,
  },
  // 21. Hermes Agent
  {
    id: 'hermes',
    name: 'Hermes Agent',
    description: 'Hermes Agent external skills directory.',
    relativePath: '.hermes/skills/forgestack/SKILL.md',
    detectionPaths: ['.hermes', 'HERMES.md', '.hermes.md'],
    generateContent: () => FORGESTACK_CANONICAL_SKILL,
  },
  // 22. iFlow
  {
    id: 'iflow',
    name: 'iFlow',
    description: 'iFlow agent skills definition.',
    relativePath: '.iflow/skills/forgestack/SKILL.md',
    detectionPaths: ['.iflow'],
    generateContent: () => FORGESTACK_CANONICAL_SKILL,
  },
  // 23. Junie
  {
    id: 'junie',
    name: 'Junie',
    description: 'JetBrains Junie AI agent skills configuration.',
    relativePath: '.junie/skills/forgestack/SKILL.md',
    detectionPaths: ['.junie'],
    generateContent: () => FORGESTACK_CANONICAL_SKILL,
  },
  // 24. Kilo Code
  {
    id: 'kilocode',
    name: 'Kilo Code',
    description: 'Kilo Code agent workflows and skills.',
    relativePath: '.kilocode/skills/forgestack/SKILL.md',
    detectionPaths: ['.kilocode'],
    generateContent: () => FORGESTACK_CANONICAL_SKILL,
  },
  // 25. Kimi Code
  {
    id: 'kimi',
    name: 'Kimi Code',
    description: 'Moonshot Kimi Code skills specification.',
    relativePath: '.kimi-code/skills/forgestack/SKILL.md',
    detectionPaths: ['.kimi-code', '.kimi'],
    generateContent: () => FORGESTACK_CANONICAL_SKILL,
  },
  // 26. Kiro
  {
    id: 'kiro',
    name: 'Kiro',
    description: 'Kiro AI assistant prompts and skills.',
    relativePath: '.kiro/skills/forgestack/SKILL.md',
    detectionPaths: ['.kiro'],
    generateContent: () => FORGESTACK_CANONICAL_SKILL,
  },
  // 27. Lingma
  {
    id: 'lingma',
    name: 'Lingma',
    description: 'Alibaba Cloud Tongyi Lingma skills.',
    relativePath: '.lingma/skills/forgestack/SKILL.md',
    detectionPaths: ['.lingma'],
    generateContent: () => FORGESTACK_CANONICAL_SKILL,
  },
  // 28. MiniMax Code
  {
    id: 'minimax-code',
    name: 'MiniMax Code',
    description: 'MiniMax Code developer assistant skills.',
    relativePath: '.minimax/skills/forgestack/SKILL.md',
    detectionPaths: ['.minimax'],
    generateContent: () => FORGESTACK_CANONICAL_SKILL,
  },
  // 29. Mistral Vibe
  {
    id: 'vibe',
    name: 'Mistral Vibe',
    description: 'Mistral Vibe coding agent skills.',
    relativePath: '.vibe/skills/forgestack/SKILL.md',
    detectionPaths: ['.vibe'],
    generateContent: () => FORGESTACK_CANONICAL_SKILL,
  },
  // 30. Oh My Pi
  {
    id: 'oh-my-pi',
    name: 'Oh My Pi',
    description: 'Oh My Pi assistant skills.',
    relativePath: '.omp/skills/forgestack/SKILL.md',
    detectionPaths: ['.omp'],
    generateContent: () => FORGESTACK_CANONICAL_SKILL,
  },
  // 31. OpenCode
  {
    id: 'opencode',
    name: 'OpenCode',
    description: 'OpenCode AI assistant skill specification.',
    relativePath: '.opencode/skills/forgestack/SKILL.md',
    detectionPaths: ['.opencode'],
    generateContent: () => FORGESTACK_CANONICAL_SKILL,
  },
  // 32. Pi
  {
    id: 'pi',
    name: 'Pi',
    description: 'Inflection Pi coding assistant prompts.',
    relativePath: '.pi/skills/forgestack/SKILL.md',
    detectionPaths: ['.pi'],
    generateContent: () => FORGESTACK_CANONICAL_SKILL,
  },
  // 33. SourceCraft Code Assistant
  {
    id: 'codeassistant',
    name: 'SourceCraft Code Assistant',
    description: 'SourceCraft Code Assistant skills.',
    relativePath: '.codeassistant/skills/forgestack/SKILL.md',
    detectionPaths: ['.codeassistant'],
    generateContent: () => FORGESTACK_CANONICAL_SKILL,
  },
  // 34. Qoder
  {
    id: 'qoder',
    name: 'Qoder',
    description: 'Qoder assistant skills.',
    relativePath: '.qoder/skills/forgestack/SKILL.md',
    detectionPaths: ['.qoder'],
    generateContent: () => FORGESTACK_CANONICAL_SKILL,
  },
  // 35. Qwen Code
  {
    id: 'qwen',
    name: 'Qwen Code',
    description: 'Alibaba Qwen Code assistant skill specification.',
    relativePath: '.qwen/skills/forgestack/SKILL.md',
    detectionPaths: ['.qwen'],
    generateContent: () => FORGESTACK_CANONICAL_SKILL,
  },
  // 36. Rovo Dev CLI
  {
    id: 'rovodev',
    name: 'Rovo Dev CLI',
    description: 'Atlassian Rovo Dev CLI skill specification.',
    relativePath: '.rovodev/skills/forgestack/SKILL.md',
    detectionPaths: ['.rovodev/skills', '.rovodev'],
    generateContent: () => FORGESTACK_CANONICAL_SKILL,
  },
  // 37. Zoo Code
  {
    id: 'roocode',
    name: 'Zoo Code',
    description: 'Zoo Code / Roo Code autonomous assistant skills.',
    relativePath: '.roo/skills/forgestack/SKILL.md',
    detectionPaths: ['.roo'],
    generateContent: () => FORGESTACK_CANONICAL_SKILL,
  },
  // 38. Trae
  {
    id: 'trae',
    name: 'Trae',
    description: 'ByteDance Trae AI native editor workspace rules.',
    relativePath: '.trae/rules/forgestack.md',
    detectionPaths: ['.trae'],
    generateContent: (skillDoc) => stripFrontmatter(skillDoc),
  },
  // 39. Zed Agent
  {
    id: 'zed',
    name: 'Zed Agent',
    description: 'Zed editor Assistant rules & slash prompts.',
    relativePath: '.zed/rules/forgestack.md',
    detectionPaths: ['.zed', '.agents/skills'],
    generateContent: (skillDoc) => stripFrontmatter(skillDoc),
  },
  // 40. ZCode
  {
    id: 'zcode',
    name: 'ZCode',
    description: 'ZCode agent skills.',
    relativePath: '.zcode/skills/forgestack/SKILL.md',
    detectionPaths: ['.zcode'],
    generateContent: () => FORGESTACK_CANONICAL_SKILL,
  },
];

/**
 * Normalizes tool aliases (e.g. 'shared' -> 'agents', 'windsurf' -> 'devin').
 */
export function normalizeAgentToolId(id: string): AgentToolId {
  const map: Record<string, AgentToolId> = {
    shared: 'agents',
    windsurf: 'devin',
    amazonq: 'amazon-q',
    copilot: 'github-copilot',
  };
  return map[id] || (id as AgentToolId);
}
