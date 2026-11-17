## Purpose

Provides a deterministic, headless scaffolding engine with in-memory Virtual File System (VFS) staging, additive recipe composition, lockstep dependency resolution, and transactional rollback protection.

## ADDED Requirements

### Requirement: In-Memory Virtual File System (VFS) Staging
The scaffolding engine SHALL stage all directory paths, file contents, configuration merges, and AST transformations completely in memory prior to committing any write operations to the physical filesystem.

#### Scenario: Successful staging without disk mutation
- **WHEN** the generator engine begins synthesizing project files for a selected configuration
- **THEN** no folders or files are created or modified on the host operating system disk until all composition and validation rules succeed

#### Scenario: Staging collision detection
- **WHEN** multiple feature slices attempt to write conflicting content to the same file path without a registered merge strategy
- **THEN** the engine MUST halt staging and return a diagnostic error identifying the conflicting slices and file path

### Requirement: Additive Layered Recipe Composition
The engine SHALL construct complete project topologies by applying independent, additive feature slices onto a base kernel without relying on monolithic, pre-baked directory templates.

#### Scenario: Applying additive slices
- **WHEN** a user selects a monorepo kernel with Tailwind CSS and TanStack Query slices
- **THEN** the engine applies the base monorepo structure, then sequentially layers the Tailwind and TanStack Query file actions and configuration mutations onto the virtual file system

### Requirement: Deterministic Dependency Lockstep Resolution
The engine SHALL resolve all runtime and development dependencies against an internally pinned, lockstep version registry to prevent peer dependency mismatches and version drift.

#### Scenario: Pinned dependency generation
- **WHEN** `package.json` manifests are compiled for any combination of frontend, backend, or shared packages
- **THEN** all dependency version strings MUST match the exact semver ranges defined in the engine lockstep registry

### Requirement: Transactional Disk Commit and Rollback
The engine SHALL execute physical disk writes within an atomic two-phase commit routine and MUST automatically revert changes if a write, permission check, or lifecycle hook fails.

#### Scenario: Automatic rollback on install or write error
- **WHEN** a physical file write fails due to permissions or an initialization command exits with a non-zero code
- **THEN** the engine MUST delete all partially generated files and directories created during that run, leaving the destination path clean

#### Scenario: Successful atomic flush
- **WHEN** pre-flight target directory validation passes and all virtual staging actions succeed
- **THEN** the engine writes all staged files to disk, initializes a git repository, and executes the designated package manager installation
