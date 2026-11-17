import type { FeatureSlice } from '../../engine/compositor.js';
import type { ProjectConfig } from '../../types/config.js';
import type { VirtualFileSystem } from '../../vfs/vfs.js';
import { AAS_SKILLS } from './aas-skills-data.js';

export const aiRulesSlice: FeatureSlice = {
  id: 'gov-ai-rules',
  name: 'AI Agent Governance & Engineering Rules',
  apply: (vfs: VirtualFileSystem, config: ProjectConfig) => {
    // 1. Cursor Rules (.cursor/rules/*.mdc)
    if (config.aiGovernance.rules) {
      vfs.applyAction({
        type: 'CREATE',
        path: '.cursor/rules/01-architecture-boundaries.mdc',
        content: `---
description: Architecture boundaries rule. Enforces strict layer separation across frontend and backend modules.
globs: "**/*"
alwaysApply: true
---

# Architecture Boundaries & Layer Isolation

1. **Backend Separation**:
   - Controllers MUST NOT contain raw database queries or ORM calls directly. All data access must pass through repository classes.
   - Business logic MUST reside strictly in domain services.
   - All input parameters, request bodies, and responses MUST be validated via Zod schemas in \`src/modules/[feature]/[feature].schema.ts\` or \`@repo/contracts\`.
   - Never access \`process.env\` directly outside of \`src/config/env.ts\`.

2. **Frontend Separation**:
   - Presentational UI components MUST NOT execute direct fetch or Axios calls. All server state must be managed via dedicated custom hooks or providers.
   - Reusable UI primitives must reside in \`packages/ui\` or \`src/components/ui\`.
`,
      });

      vfs.applyAction({
        type: 'CREATE',
        path: '.cursor/rules/02-typescript-strict.mdc',
        content: `---
description: TypeScript strictness rule. Enforces zero-any, explicit typing, and schema inference.
globs: "**/*.{ts,tsx}"
alwaysApply: true
---

# TypeScript Strict Engineering Standards

1. **Zero-any Policy**:
   - The \`any\` keyword is strictly prohibited. Use \`unknown\` with type guards, or define explicit TypeScript types.
   - Disallow non-null assertions (\`!\`) and double casting (\`as unknown as T\`) unless backed by defensive runtime guards.

2. **Schema-First Typing**:
   - Always define validation schemas first using Zod.
   - Infer types using \`z.infer<typeof schema>\` to ensure zero drift between runtime validation and compile-time types.
`,
      });

      vfs.applyAction({
        type: 'CREATE',
        path: '.cursor/rules/03-brutally-honest-reviewer.mdc',
        content: `---
description: Brutally honest engineering reviewer rule. Mandates independent technical evaluation, zero fake praise, and uncompromising rigor.
globs: "**/*"
alwaysApply: true
---

# Brutally Honest Engineering Reviewer

Act as a brutally honest, rigorous principal software engineer and systems architect in all interactions across every conversation and project.

## Core Directives:
1. **Independent Evaluation**: Never automatically agree with proposals or code. Evaluate every change from first principles and codebase reality.
2. **Zero Fake Praise**: No superficial compliments ("Great idea!", "Nice job!"). Optimize strictly for correctness, resilience, and engineering rigor.
3. **Direct Technical Critique**: If a pattern is fragile, overengineered, insecure, or inefficient, state the concrete mechanical reason why and recommend the objectively superior alternative.
4. **Demand Evidence**: If data or benchmarks are missing, define exactly what must be measured before concluding an architectural debate.
`,
      });
    }

    // 2. Claude Code Instructions (CLAUDE.md)
    if (config.aiGovernance.claude ?? true) {
      vfs.applyAction({
        type: 'CREATE',
        path: 'CLAUDE.md',
        content: `# Claude Code Project Guidelines

## Project Identity
- **Name**: ${config.name}
- **Topology**: ${config.topology}
- **Frontend**: ${config.frontend.framework} (${config.frontend.styling})
- **Backend**: ${config.backend.framework} (${config.backend.database} + ${config.backend.orm})
- **Package Manager**: ${config.packageManager}

## Core Commands
- Install: \`${config.packageManager} install\`
- Development: \`${config.packageManager} run dev\`
- Production Build: \`${config.packageManager} run build\`
- Unit & E2E Tests: \`${config.packageManager} run test\`
- Type Checking: \`${config.packageManager} run typecheck\`

## Architecture & Code Quality Guardrails
1. **Layer Separation & Boundaries**:
   - Never write raw queries or ORM calls directly in HTTP route handlers or controllers. Always route through repositories.
   - Keep business logic in domain services.
   - Validate all incoming payloads and outgoing responses using Zod schemas.

2. **TypeScript Strict Standards**:
   - Zero \`any\` policy. Use explicit interfaces or \`unknown\` with custom type guards.
   - Derive types directly from Zod validation schemas (\`z.infer<typeof Schema>\`).

3. **Autonomous Verification**:
   - Always run test suites and compiler verification before marking tasks complete.
   - Keep code modular, adhering strictly to Clean Code, SOLID, and DRY principles.
`,
      });
    }

    // 3. Curated Agentic Awesome Skills (.agents/skills/**/SKILL.md)
    if (config.aiGovernance.skills) {
      for (const [skillPath, skillContent] of Object.entries(AAS_SKILLS)) {
        vfs.applyAction({
          type: 'CREATE',
          path: skillPath,
          content: skillContent,
        });
      }
    }

    // 8. OpenSpec Workflows & Configuration
    const isOpenSpec =
      config.aiGovernance.openSpec &&
      (!config.aiGovernance.engine ||
        config.aiGovernance.engine === 'openspec' ||
        config.aiGovernance.engine === 'all');

    if (isOpenSpec) {
      vfs.applyAction({
        type: 'CREATE',
        path: '.agents/workflows/opsx-propose.md',
        content: `---
description: Propose a new spec-driven change
---
Run \`openspec new change <name>\` and draft proposal.md, specs, design.md, and tasks.md.
`,
      });

      vfs.applyAction({
        type: 'CREATE',
        path: '.agents/workflows/opsx-apply.md',
        content: `---
description: Implement tasks from an OpenSpec change
---
Read tasks.md and execute implementation task-by-task, marking checkboxes complete.
`,
      });

      vfs.applyAction({
        type: 'CREATE',
        path: '.agents/workflows/opsx-sync.md',
        content: `---
description: Sync delta specs into main specs
---
Merge completed change delta specifications into main specs under openspec/specs/.
`,
      });

      vfs.applyAction({
        type: 'CREATE',
        path: 'openspec/config.yaml',
        content: `schema: spec-driven

context: |
  Tech stack: TypeScript, React 19, Tailwind CSS v4, Node.js ESM.
  Conventions: Clean Modular Architecture, Zod validation contracts, strict TypeScript.
`,
      });
    }

    // 9. .github/copilot-instructions.md
    vfs.applyAction({
      type: 'CREATE',
      path: '.github/copilot-instructions.md',
      content: `# GitHub Copilot Workspace Instructions

- Follow Clean Modular Architecture. Never put raw database queries in controllers.
- Use TypeScript strict types and infer types from Zod schemas in \`@repo/contracts\`.
- Format all code with Prettier and follow ESLint flat config.
- Never write tests that depend on un-mocked external networks.
`,
    });
  },
};
