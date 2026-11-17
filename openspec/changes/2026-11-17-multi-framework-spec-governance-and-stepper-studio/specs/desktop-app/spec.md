# Desktop App Delta Specification

## Purpose
Specifies the 4-step progressive disclosure stepper wizard, context-aware stack configurator, custom preset persistence, and VS Code-grade virtual staging tree controls.

## Requirements

### Requirement: Home Landing Dashboard (Templates Hub)
The desktop application SHALL mount on a visual Templates Dashboard displaying saved custom templates, built-in presets, and a primary action to create new stacks or fast-scaffold existing ones.

#### Scenario: User visits the home landing page
- **WHEN** the application opens
- **THEN** it displays a hero `+ Create New Stack` card at position 0, followed by cards for all saved custom templates and presets
- **AND** each template card displays stack badges, archetype indicators, an `⚡ Scaffold` button, and management controls (Edit, Rename, Duplicate, Delete).

#### Scenario: User fast-scaffolds a project from a template card
- **WHEN** the user clicks `⚡ Scaffold` on any template card
- **THEN** a minimal modal opens prompting ONLY for `Project Name` and `Destination Directory`
- **AND** confirming synthesis immediately generates the complete project without opening the full stepper configurator.

### Requirement: 4-Step Stepper Studio Wizard
The desktop application SHALL provide a `/new` studio guiding users through 4 discrete, structured configuration stages starting from empty, unconfigured slots.

#### Scenario: User navigates through stepper stages
- **WHEN** the application initializes
- **THEN** Step 1 displays clean, empty starting slots for project identity and archetype
- **AND** advancing to Step 2 dynamically exposes only the ecosystem options relevant to the chosen archetype.

### Requirement: Reusable Custom Template Presets
The desktop application SHALL allow saving customized stack configurations to `localStorage` and reloading them on demand.

#### Scenario: User saves and loads a custom preset
- **WHEN** the user configures a stack in Step 4 and clicks "Save Preset"
- **THEN** the configuration is stored in `localStorage` under a user-defined name
- **AND** selecting that preset in future sessions repopulates all stepper choices automatically.

### Requirement: VS Code-Style Virtual Staging Toolbar
The right-side virtual staging panel SHALL provide action icons matching the VS Code tree toolbar.

#### Scenario: User interacts with staging tree toolbar
- **WHEN** the user clicks `+ New File` or `+ New Folder`
- **THEN** an inline prompt allows adding custom files or folders to the staged VFS tree
- **AND** clicking `Refresh` forces re-synthesis of the virtual file system
- **AND** clicking `Collapse/Expand All` toggles all directory node states.
