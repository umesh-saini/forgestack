# Desktop App Delta Specification

## ADDED Requirements

### Requirement: Tauri Content Security Policy Hardening
The Desktop application SHALL enforce a strict Content Security Policy (CSP) prohibiting unauthorized remote script execution.

#### Scenario: Enforcing local execution policy
- **Given** the Tauri desktop application window is loaded
- **When** the webview initializes
- **Then** the Content Security Policy header restricts script sources to `'self'` and styles to `'self' 'unsafe-inline'`

### Requirement: Complete Architecture Topology Parity
The Desktop application SHALL expose all 10 engine topologies in the visual selector, including Next.js Full-Stack and Electron Desktop.

#### Scenario: Selecting Next.js 15 Full-Stack in Desktop Studio
- **Given** the user opens Step 1 in the desktop stepper wizard
- **When** the user views the architecture topology selector
- **Then** a visual card for `nextjs-fullstack` is selectable and displays Next.js 15 App Router badges

#### Scenario: Selecting Electron Desktop Studio
- **Given** the user opens Step 1 in the desktop stepper wizard
- **When** the user views the architecture topology selector
- **Then** a visual card for `electron-desktop` is selectable and displays Electron + React 19 badges
