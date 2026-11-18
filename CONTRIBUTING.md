# Contributing to ForgeStack

Thank you for your interest in contributing to ForgeStack! We welcome contributions to our headless scaffolding engine, interactive CLI, desktop studio, and AI governance slices.

---

## 🛠️ Development Setup

ForgeStack is structured as a pnpm monorepo.

### Prerequisites
- **Node.js**: `v20.0.0` or higher (`v22` recommended)
- **pnpm**: `v10.0.0` or higher (`pnpm@10.33.4` verified)
- **Rust Toolchain**: Required only if modifying `packages/desktop` native code (`rustup`, `cargo`)

### Installation & Build
```bash
# Clone the repository
git clone https://github.com/forgestack/forgestack.git
cd forgestack

# Install workspace dependencies
pnpm install

# Build all packages (@forgestack/core, @forgestack/cli, @forgestack/desktop)
pnpm build
```

---

## 🧪 Testing Guidelines

We enforce a 100% test pass rate across the monorepo with zero tolerance for regressions.

```bash
# Run all unit and integration tests across workspaces
pnpm test

# Run tests in watch mode during development
pnpm test:watch

# Test CLI interactively
pnpm cli:dev

# Run type checking
pnpm typecheck
```

Before opening a pull request, verify that:
1. `pnpm build` succeeds with zero TypeScript errors (`tsc -b`).
2. `pnpm test` passes 100% of test suites.
3. Code changes adhere to strict TypeScript (no unvalidated `any`).

---

## 📐 Architecture & Contribution Areas

1. **`packages/core`**:
   - Virtual File System (VFS) operations in `src/vfs/`.
   - Feature slices in `src/slices/` (frameworks, databases, auth, rpc, containerization).
   - Lockstep package dependencies in `src/registry/dependencies.ts`.

2. **`packages/cli`**:
   - Interactive terminal UI and searchable multi-select in `src/ui/`.
   - Command definitions and flag options in `src/cli.ts`.
   - Curated default templates in `src/templates/curated.ts`.

3. **`packages/desktop`**:
   - React 19 UI in `packages/desktop/src/`.
   - Tauri v2 Rust bindings in `packages/desktop/src-tauri/`.

---

## 📝 Commit & Pull Request Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat(...)`: A new feature or capability
- `fix(...)`: A bug fix
- `docs(...)`: Documentation updates
- `refactor(...)`: Code refactoring without behavior changes
- `test(...)`: Adding or updating test suites
- `chore(...)`: Maintenance, dependency bumps, or build changes

---

## 📜 Code of Conduct

Please treat all community members with respect, kindness, and professional courtesy.
