import type { FeatureSlice } from '../../engine/compositor.js';
import type { ProjectConfig } from '../../types/config.js';
import type { VirtualFileSystem } from '../../vfs/vfs.js';

export const aiRulesSlice: FeatureSlice = {
  id: 'gov-ai-rules',
  name: 'AI Agent Governance & Engineering Rules',
  apply: (vfs: VirtualFileSystem, config: ProjectConfig) => {
    if (!config.aiGovernance.rules) {
      return;
    }

    // 1. .cursor/rules/01-architecture-boundaries.mdc
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

    // 2. .cursor/rules/02-typescript-strict.mdc
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

    // 3. .cursor/rules/03-brutally-honest-reviewer.mdc
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

    // 4. .agents/skills/modern-ui-engineering/SKILL.md
    vfs.applyAction({
      type: 'CREATE',
      path: '.agents/skills/modern-ui-engineering/SKILL.md',
      content: `---
name: modern-ui-engineering
description: Expert guidelines and best practices for building world-class, accessible, and high-performance user interfaces using modern React 19, Tailwind CSS v4, Radix UI primitives, Lucide icons, and responsive design systems.
---

# Modern UI Engineering & Frontend Craftsmanship

## Principles
1. **Design System Tokens**: Use Tailwind CSS v4 CSS variables for colors, spacing, and typography. No arbitrary hex codes.
2. **Headless Primitives**: Compose complex widgets over Radix UI primitives with WCAG 2.1 AA keyboard accessibility.
3. **Zero-CLS**: Always define aspect ratios and skeleton loaders for async content.
4. **Style Utilities**: Use \`cn(...inputs: ClassValue[]): string\` via \`clsx\` and \`tailwind-merge\`.
`,
    });

    // 5. .agents/skills/clean-code-craftsmanship/SKILL.md
    vfs.applyAction({
      type: 'CREATE',
      path: '.agents/skills/clean-code-craftsmanship/SKILL.md',
      content: `---
name: clean-code-craftsmanship
description: Engineering guidelines for clean code architecture, strict TypeScript standards, defensive programming, resilient error handling, and robust test-driven development.
---

# Clean Code Craftsmanship & Software Architecture

## Principles
1. **Layered Isolation**: Routes -> Controllers -> Services -> Repositories -> Models.
2. **Zero-any Discipline**: Strict TypeScript with Zod runtime validation.
3. **Resilient Persistence**: Connection pooling, \`SELECT 1\` health check ping, exponential backoff, and graceful shutdown signal handlers (\`SIGINT\`/\`SIGTERM\`).
4. **AAA Testing**: Arrange-Act-Assert testing with Vitest.
`,
    });

    // 6. .agents/skills/db-migration/SKILL.md
    vfs.applyAction({
      type: 'CREATE',
      path: '.agents/skills/db-migration/SKILL.md',
      content: `---
name: db-migration
description: Instructions and guidelines for executing and rolling back database schema migrations safely.
---

# Database Migration Guide
- Always inspect generated SQL before applying migrations.
- Test both migration up and migration rollback in local development before committing.
- In production, migrations must run in a dedicated pre-deployment step.
`,
    });

    // 7. .agents/skills/api-contract-sync/SKILL.md
    vfs.applyAction({
      type: 'CREATE',
      path: '.agents/skills/api-contract-sync/SKILL.md',
      content: `---
name: api-contract-sync
description: Verifies that @repo/contracts schemas match backend routes and frontend query hooks.
---

# API Contract Synchronization Guide
- When updating API routes, modify the corresponding contract schema in \`packages/contracts\` first.
- Ensure backend controllers parse incoming requests using the contract schema.
- Ensure frontend data-fetching hooks type their return values using the inferred DTO type.
`,
    });

    // 8. .agents/workflows/
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

    // 10. openspec/config.yaml
    vfs.applyAction({
      type: 'CREATE',
      path: 'openspec/config.yaml',
      content: `schema: spec-driven

context: |
  Tech stack: TypeScript, React 19, Tailwind CSS v4, Node.js ESM.
  Conventions: Clean Modular Architecture, Zod validation contracts, strict TypeScript.
`,
    });
  },
};
