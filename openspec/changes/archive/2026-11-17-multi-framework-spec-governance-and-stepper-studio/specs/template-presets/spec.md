# Template Presets Delta Specification

## Purpose
Extends the template preset registry with Electron Desktop, Next.js 15, and alternative governance presets.

## Requirements

### Requirement: Electron Desktop Preset
The engine SHALL provide a pre-configured preset for standalone Electron desktop development.

#### Scenario: User applies Electron preset
- **WHEN** preset `'electron'` is selected
- **THEN** topology is configured to `'electron-desktop'`, frontend to React 19 + Tailwind, and Electron IPC handlers are configured.

### Requirement: Next.js 15 Full-Stack Preset
The engine SHALL provide a pre-configured preset for Next.js 15 full-stack applications.

#### Scenario: User applies Next.js preset
- **WHEN** preset `'nextjs'` is selected
- **THEN** topology is configured to `'nextjs-fullstack'`, framework to `'nextjs'`, styling to `'tailwind'`, and database to PostgreSQL (Drizzle).
