# ForgeStack ⚡

> Enterprise Project Scaffolding Platform: Headless Engine, Interactive CLI & Tauri v2 Desktop Studio.

ForgeStack is a modular scaffolding platform designed to eliminate template rot. Instead of maintaining dozens of static, unmaintainable starter repositories, ForgeStack uses an in-memory **Virtual File System (VFS)** and **Additive Feature Slices** to dynamically synthesize production-grade Monorepo and Polyrepo architectures with Day-One AI Governance.

---

## 📦 Monorepo Architecture

```text
├── packages/
│   ├── core/       # Headless VFS, Compositor, Lockstep Registry & Feature Slices
│   ├── cli/        # Interactive Clack TUI & Headless CLI (create-forgestack-app)
│   └── desktop/    # Cross-platform Tauri v2 + React 19 + Tailwind v4 Desktop App
├── openspec/       # OpenSpec behavioral specs & archived change proposals
├── tests/          # End-to-end permutation matrix test suites
└── .agents/        # Clean Code & Modern UI engineering agent skills
```

---

## 🛠️ System Prerequisites

### Core Runtime
- **Node.js**: `v20.0.0` or higher (`v22.22.x` recommended)
- **pnpm**: `v10.0.0` or higher (`pnpm@10.33.4` verified)

### Desktop App (Tauri v2 Native Builds)
To run or compile the native desktop application (`packages/desktop`), install the Rust toolchain and platform dependencies:

#### 1. Rust Compiler & Cargo
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

#### 2. Operating System Libraries

- **Linux (Ubuntu / Debian)**:
  ```bash
  sudo apt update
  sudo apt install -y \
    libwebkit2gtk-4.1-dev \
    build-essential \
    curl \
    wget \
    file \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev
  ```
- **macOS**:
  Install Xcode Command Line Tools:
  ```bash
  xcode-select --install
  ```
- **Windows**:
  - Install Microsoft C++ Build Tools (via Visual Studio Installer).
  - Webview2 runtime is pre-installed on Windows 10/11.

---

## 🚀 Running the Desktop App

The Desktop application supports two development workflows:

### Option A: Native Desktop App (Tauri v2 Window)
Spawns the native desktop window with native OS dialogs and filesystem validation hooks:

```bash
# From workspace root
pnpm desktop:dev

# Or directly targeting the package
pnpm --filter @forgestack/desktop tauri dev
```

### Option B: Fast Browser Preview Mode (Web UI)
Develop and test the UI, live VFS file-tree preview, and architecture selector directly in your browser with instant Hot Module Replacement (HMR) without compiling Rust:

```bash
# Serves the desktop UI on http://localhost:1420
 check 

# Or directly targeting the package
pnpm --filter @forgestack/desktop dev
```
> **Note**: In web preview mode, native Tauri dialog calls gracefully fall back to web prompts while full in-memory VFS generation and inspection run in real time via `@forgestack/core/browser`.

---

## 🏗️ Building the Desktop App

To bundle and package standalone, optimized native desktop installers:

```bash
# Build production native installer
pnpm desktop:build

# Or directly targeting the package
pnpm --filter @forgestack/desktop tauri build
```

### Build Artifact Locations
Production bundles are generated inside `packages/desktop/src-tauri/target/release/bundle/`:
- **Linux**: `.deb` (Debian package) and `.AppImage` standalone executable.
- **macOS**: `.dmg` disk image and `.app` bundle.
- **Windows**: `.msi` (Windows Installer) and `.exe` installer.

---

## 💻 Running & Testing the CLI

### 1. Interactive Terminal Wizard
Run the CLI interactive prompts powered by `@clack/prompts`:

```bash
# Run local CLI entrypoint
pnpm cli:dev

# Or pass a project name directly
node packages/cli/bin/create-forgestack-app.js my-new-project
```

### 2. Headless Scriptable Generation (CI / Automations)
Generate full stacks without interactive prompts using explicit flags:

```bash
# Monorepo with React 19 + TanStack Query + Fastify + PostgreSQL + Drizzle + Docker
node packages/cli/bin/create-forgestack-app.js enterprise-monorepo \
  --topology monorepo \
  --fe react-vite \
  --styling tailwind \
  --state query \
  --be fastify \
  --db postgres \
  --orm drizzle \
  --container \
  --git

# Standalone Clean Modular Backend with Express + MongoDB + Mongoose
node packages/cli/bin/create-forgestack-app.js service-api \
  --topology standalone-be \
  --be express \
  --db mongodb \
  --orm mongoose \
  --container \
  --git

# Dry run (stages files in memory and prints file statistics without writing to disk)
node packages/cli/bin/create-forgestack-app.js preview-app --dry-run
```

### 3. Local Global Linking (Test `create-forgestack-app` Anywhere)
To test running `create-forgestack-app` globally across your machine before publishing:

```bash
cd packages/cli
pnpm link --global

# Now executable globally in any terminal:
create-forgestack-app my-test-project
```

---

## 🧪 Testing & Validation

ForgeStack enforces strict engineering verification across all packages:

```bash
# Run the complete Vitest test suite (unit + E2E permutation matrix)
pnpm test

# Run tests in watch mode during development
pnpm test:watch

# Compile TypeScript across all packages
pnpm build

# Validate OpenSpec behavioral specifications
openspec validate --specs

# Check Tauri Rust backend compilation
cargo check --manifest-path packages/desktop/src-tauri/Cargo.toml
```

---

## 🚢 Publishing to npm

The CLI and Core packages are structured for standard npm distribution:

### 1. Verify Tarball Contents (Dry Run)
Verify that only `dist` and `bin` are packed (ignoring test files and source configs):
```bash
cd packages/cli
npm pack --dry-run
```

### 2. Publish Packages
```bash
# 1. Publish Core headless engine
cd packages/core
pnpm publish --access public

# 2. Publish CLI executable
cd ../cli
pnpm publish --access public
```

---

## 🤖 Day-One AI Governance

Every project scaffolded by ForgeStack includes enterprise AI rules and workflows out of the box:
- **Cursor Rules** (`.cursor/rules/`): Enforces architecture boundaries (no direct DB access in controllers), strict zero-`any` TypeScript, and engineering review criteria.
- **OpenSpec Governance** (`openspec/`): Pre-configured change proposal schemas and specs for feature development.
- **Agent Skills** (`.agents/skills/`): Modular capabilities for UI engineering and clean code craftsmanship.
