# Desktop App Delta Specification

## Purpose
Specifies the 4-step progressive disclosure stepper wizard, context-aware stack configurator, custom preset persistence, and VS Code-grade virtual staging tree controls.

## Requirements

### Requirement: 4-Step Stepper Studio Wizard
The desktop application SHALL guide users through 4 discrete, structured configuration stages without presenting cluttered initial defaults.

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
