# AI Governance Delta Specification

## Purpose
Extends AI Agent governance beyond OpenSpec to support Open-GSD (`gsd-core`) and GitHub Spec-Kit (`github/spec-kit`).

## Requirements

### Requirement: Open-GSD (`gsd-core`) Scaffolding
The scaffolding engine SHALL support synthesizing Open-GSD governance documentation and workflows.

#### Scenario: User selects GSD governance engine
- **WHEN** `aiGovernance.engine` is `'gsd'` or `'all'`
- **THEN** the VFS contains `gsd/PROJECT.md`, `gsd/REQUIREMENTS.md`, `gsd/ROADMAP.md`, and `gsd/STATE.md`
- **AND** `.agents/workflows/gsd-plan.md`, `gsd-execute.md`, and `gsd-verify.md` are scaffolded.

### Requirement: GitHub Spec-Kit Scaffolding
The scaffolding engine SHALL support synthesizing GitHub Spec-Kit constitution, specs, tasks, and prompts.

#### Scenario: User selects GitHub Spec-Kit governance engine
- **WHEN** `aiGovernance.engine` is `'speckit'` or `'all'`
- **THEN** the VFS contains `.spec-kit/constitution.md`, `.spec-kit/specs/feature-template.md`, `.spec-kit/tasks/task-runner.md`, and `.spec-kit/prompts/implement.prompt.md`
- **AND** `.agents/workflows/speckit-spec.md`, `speckit-implement.md`, and `speckit-review.md` are scaffolded.
