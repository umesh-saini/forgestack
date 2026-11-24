# Project Website Specification

## Purpose
A public, static website that explains ForgeStack to people evaluating it, separate from the desktop studio.

## ADDED Requirements

### Requirement: Separate from the desktop app
The website SHALL live in its own package and the desktop app SHALL NOT bundle any marketing page.

#### Scenario: Desktop root route
- **WHEN** a user opens the desktop app
- **THEN** the root route shows the Templates Hub
- **AND** no `/landing` route exists.

### Requirement: Content stays in sync with the engine
The supported-stack section SHALL be derived from `@forgestack/core`'s `projectConfigSchema`.

#### Scenario: A new option is added to the engine
- **WHEN** a new enum value is added to the config schema
- **THEN** the website lists it after the next build, with no website edit.

### Requirement: Changelog from CHANGELOG.md
The website SHALL render release notes from the repository's `CHANGELOG.md`.

#### Scenario: A release is documented
- **WHEN** a new `## [x.y.z]` section is added to `CHANGELOG.md`
- **THEN** the website shows it as the newest entry after the next build.

### Requirement: Getting started and AI setup
The website SHALL show a copyable CLI command, CLI examples, and MCP setup instructions for Claude Code, Codex and Antigravity at minimum.

#### Scenario: A visitor wants to try ForgeStack
- **WHEN** the visitor clicks the copy button in the hero
- **THEN** the working `npx -p @forgestack/cli create-forgestack-app` command is copied.

### Requirement: Accessible and responsive
The website SHALL be usable from 360 px wide, in light and dark color schemes, by keyboard.

#### Scenario: Small screen
- **WHEN** the page is viewed at 360 px wide
- **THEN** there is no horizontal page scroll; code blocks scroll within themselves.

## REMOVED Requirements

### Requirement: Kinetic Hero & Velocity Marquee
Removed with the in-app landing page (see proposal: Supersedes).

### Requirement: Interactive 4-in-1 Stack Simulator
Removed with the in-app landing page.

### Requirement: Desktop App Visual Showcase & Download Hub
Removed with the in-app landing page; downloads link to GitHub Releases.
