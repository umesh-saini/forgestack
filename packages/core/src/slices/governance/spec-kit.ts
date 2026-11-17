import type { FeatureSlice } from '../../engine/compositor.js';
import type { ProjectConfig } from '../../types/config.js';
import type { VirtualFileSystem } from '../../vfs/vfs.js';

export const specKitGovernanceSlice: FeatureSlice = {
  id: 'gov-speckit',
  name: 'GitHub Spec-Kit Spec-Driven Development Governance',
  apply: (vfs: VirtualFileSystem, config: ProjectConfig) => {
    const isSpecKit =
      config.aiGovernance.openSpec &&
      (config.aiGovernance.engine === 'speckit' || config.aiGovernance.engine === 'all');

    if (!isSpecKit) {
      return;
    }

    // 1. .spec-kit/constitution.md
    vfs.applyAction({
      type: 'CREATE',
      path: '.spec-kit/constitution.md',
      content: `# Spec-Kit Constitution: ${config.name}

## Non-Negotiable Tenets
1. **Spec First**: No pull request or implementation commit shall be authored without an approved specification.
2. **Defensive Boundaries**: Business logic resides strictly in domain services. Route controllers must never execute raw database queries.
3. **Strict Typing**: No \`any\` or double casts (\`as unknown as T\`). All inputs parsed via Zod contracts.
4. **Resilience**: Database connection pooling with health check pings and exponential retry loops.
`,
    });

    // 2. .spec-kit/specs/feature-template.md
    vfs.applyAction({
      type: 'CREATE',
      path: '.spec-kit/specs/feature-template.md',
      content: `# Feature Specification Template

## 1. User Story
As a user of **${config.name}**, I want to [action] so that [benefit].

## 2. Acceptance Criteria (Gherkin Syntax)
\`\`\`gherkin
Scenario: Successful operation
  Given the system is initialized and healthy
  When a valid request is dispatched
  Then the system responds with status 200 and expected payload
\`\`\`

## 3. Interface & Contract Delta
- Routes: \`/api/[feature]\`
- Request Schema: \`ZodObject<{ ... }>\`
- Response DTO: \`ZodObject<{ ... }>\`
`,
    });

    // 3. .spec-kit/tasks/task-runner.md
    vfs.applyAction({
      type: 'CREATE',
      path: '.spec-kit/tasks/task-runner.md',
      content: `# Spec-Kit Task Breakdown: Baseline Setup

- [ ] Task 1: Verify environment configuration and secrets
- [ ] Task 2: Validate database migration and connection ping
- [ ] Task 3: Execute integration test suite with coverage
`,
    });

    // 4. .spec-kit/prompts/implement.prompt.md
    vfs.applyAction({
      type: 'CREATE',
      path: '.spec-kit/prompts/implement.prompt.md',
      content: `# Agent Implementation Prompt

You are implementing a feature for ${config.name}.
Before authoring any code:
1. Read \`.spec-kit/constitution.md\` for engineering constraints.
2. Read the targeted spec in \`.spec-kit/specs/\`.
3. Check off tasks in \`.spec-kit/tasks/\` as each step is verified.
`,
    });

    // 5. Workflows
    vfs.applyAction({
      type: 'CREATE',
      path: '.agents/workflows/speckit-spec.md',
      content: `---
description: Author a new specification using GitHub Spec-Kit
---
1. Copy \`.spec-kit/specs/feature-template.md\` to \`.spec-kit/specs/<feature>.md\`.
2. Detail user stories, Gherkin acceptance criteria, and schema contracts.
3. Generate implementation checklist in \`.spec-kit/tasks/<feature>.md\`.
`,
    });

    vfs.applyAction({
      type: 'CREATE',
      path: '.agents/workflows/speckit-implement.md',
      content: `---
description: Implement code from a Spec-Kit specification
---
1. Read the feature spec in \`.spec-kit/specs/<feature>.md\`.
2. Follow \`.spec-kit/prompts/implement.prompt.md\`.
3. Execute unit tests to satisfy each Gherkin scenario.
`,
    });

    vfs.applyAction({
      type: 'CREATE',
      path: '.agents/workflows/speckit-review.md',
      content: `---
description: Review code against Spec-Kit constitution
---
1. Verify PR against \`.spec-kit/constitution.md\`.
2. Confirm all acceptance tests in the spec pass without regressions.
`,
    });
  },
};
