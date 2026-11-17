import type { FeatureSlice } from '../../engine/compositor.js';
import type { ProjectConfig } from '../../types/config.js';
import type { VirtualFileSystem } from '../../vfs/vfs.js';

export const gsdGovernanceSlice: FeatureSlice = {
  id: 'gov-gsd',
  name: 'Open-GSD (Get Stuff Done) Spec-Driven AI Governance',
  apply: (vfs: VirtualFileSystem, config: ProjectConfig) => {
    const isGsd =
      config.aiGovernance.openSpec &&
      (config.aiGovernance.engine === 'gsd' || config.aiGovernance.engine === 'all');

    if (!isGsd) {
      return;
    }

    // 1. gsd/PROJECT.md
    vfs.applyAction({
      type: 'CREATE',
      path: 'gsd/PROJECT.md',
      content: `# Project Context: ${config.name}

## 1. High-Level Vision
Production software synthesized via ForgeStack Studio with Day-One Spec Governance.

## 2. Architecture Topology
- **Topology**: ${config.topology}
- **Frontend**: ${config.frontend.framework} (${config.frontend.styling})
- **Backend**: ${config.backend.framework} (${config.backend.database} + ${config.backend.orm})
- **Package Manager**: ${config.packageManager}

## 3. Engineering Tenets
1. **Zero-any Discipline**: Strict TypeScript across all modules.
2. **Layer Isolation**: Decoupled routes, services, repositories, and data models.
3. **Spec Alignment**: Code implementation must trace directly to approved requirement tickets.
`,
    });

    // 2. gsd/REQUIREMENTS.md
    vfs.applyAction({
      type: 'CREATE',
      path: 'gsd/REQUIREMENTS.md',
      content: `# System Requirements: ${config.name}

## Active Requirements Register

### [REQ-001] Baseline Application Initialization [P0]
- **Description**: The system must boot with clean health check responses and zero unhandled exceptions.
- **Acceptance Criteria**:
  - GET \`/api/health\` returns HTTP 200 with status \`ok\`.
  - Frontend renders dashboard with zero hydration errors.

### [REQ-002] Type-Safe Contract Enforcement [P0]
- **Description**: All API payloads must validate against shared runtime schemas.
- **Acceptance Criteria**:
  - Malformed request bodies are rejected with HTTP 400 and structured validation errors.
`,
    });

    // 3. gsd/ROADMAP.md
    vfs.applyAction({
      type: 'CREATE',
      path: 'gsd/ROADMAP.md',
      content: `# Product Roadmap: ${config.name}

## Phase 1: Foundation (Current)
- [x] Initial project scaffolding & package resolution
- [x] Day-one AI governance and agent playbook installation
- [ ] Automated end-to-end test verification

## Phase 2: Core Domain Features
- [ ] User authentication and session lifecycle
- [ ] Domain entity persistence and database migrations
- [ ] Production observability (structured logging and metrics)
`,
    });

    // 4. gsd/STATE.md
    vfs.applyAction({
      type: 'CREATE',
      path: 'gsd/STATE.md',
      content: `# Active Agent State & Task Queue

**Current Milestone**: Phase 1 Foundation
**Active Blocker**: None

## In-Flight Tasks
| Task ID | Description | Owner | Status |
| :--- | :--- | :--- | :--- |
| TSK-01 | Baseline system initialization | AI Agent | READY |
| TSK-02 | Setup test runner and CI matrix | AI Agent | PENDING |
`,
    });

    // 5. Workflows
    vfs.applyAction({
      type: 'CREATE',
      path: '.agents/workflows/gsd-plan.md',
      content: `---
description: Plan a new feature milestone using Open-GSD
---
1. Read \`gsd/PROJECT.md\` and \`gsd/REQUIREMENTS.md\`.
2. Draft new requirement tickets with priority tags (\`[P0]\`, \`[P1]\`, \`[P2]\`).
3. Update \`gsd/ROADMAP.md\` with target milestone sequence.
`,
    });

    vfs.applyAction({
      type: 'CREATE',
      path: '.agents/workflows/gsd-execute.md',
      content: `---
description: Execute an active task from Open-GSD queue
---
1. Inspect \`gsd/STATE.md\` for the next unblocked task.
2. Implement code following architecture tenets in \`gsd/PROJECT.md\`.
3. Verify test coverage and mark task complete in \`gsd/STATE.md\`.
`,
    });

    vfs.applyAction({
      type: 'CREATE',
      path: '.agents/workflows/gsd-verify.md',
      content: `---
description: Verify requirement compliance against Open-GSD acceptance criteria
---
1. Run test suite: \`${config.packageManager} test\`.
2. Cross-reference acceptance criteria in \`gsd/REQUIREMENTS.md\`.
3. Log verification outcome in \`gsd/STATE.md\`.
`,
    });
  },
};
