# ForgeStack CLI — Local Testing & Verification Guide

This guide provides step-by-step instructions on how to test **every single CLI capability, user flow, terminal UI component, template preset, and generated output locally** before publishing to npm.

---

## 1. Local Testing Methods Overview

You have three distinct ways to test the CLI locally:

| Method | Best For | Command |
|:---|:---|:---|
| **Method 1: Direct Dev Runner** | Rapid iteration & code modifications | `pnpm cli:dev <args>` |
| **Method 2: Global Symlink** | Testing true binary execution (`forgestack` and `create-forgestack-app`) | `npm link` or `pnpm link -g` |
| **Method 3: Tarball Emulation** | 100% faithful replication of npm registry install (`npm pack`) | `npx ./package.tgz` |

---

## 2. Method 1: Direct Dev Runner (Fastest)

The root repository has a pre-configured script `cli:dev` that executes `packages/cli/bin/create-forgestack-app.js` using Node.js:

```bash
# Build the TypeScript packages first
pnpm build

# Run interactive wizard
pnpm cli:dev

# Run with arguments and flags
pnpm cli:dev test-app --yes --dry-run
pnpm cli:dev --help
pnpm cli:dev template list
```

---

## 3. Method 2: Global Symlink Testing

To test the CLI exactly as an end-user would run `create-forgestack-app` or `forgestack` anywhere in their terminal:

### Step 1: Link `@forgestk/core` and `@forgestk/cli`
```bash
# In the root repository:
pnpm build

# Link the CLI package globally
cd packages/cli
npm link
```

### Step 2: Test Globally from Any Directory
Open a new temporary folder outside the project repository:
```bash
mkdir -p /tmp/forgestack-sandbox && cd /tmp/forgestack-sandbox

# Run the command globally
create-forgestack-app my-test-project
# or
forgestack --help
```

### Step 3: Unlink When Done
```bash
cd packages/cli
npm unlink -g
```

---

## 4. Method 3: Tarball Emulation (`npm pack`)

This method guarantees that the `files` array in `package.json`, bin shebangs, and package manifests will work when downloaded from npm.

```bash
# 1. Build all packages
pnpm build

# 2. Generate npm tarball for CLI
cd packages/cli
npm pack
# Output: forgestack-cli-1.0.0.tgz (or create-forgestack-app-1.0.0.tgz)

# 3. Test running the tarball directly via npx from another directory
cd /tmp
npx /home/dev/Documents/Kungfu/Test-Task/project-setup/packages/cli/forgestack-cli-1.0.0.tgz test-tarball --yes --dry-run
```

---

## 5. Comprehensive Local Test Scenarios Checklist

Execute each of the following test scenarios to verify 100% functionality.

---

### Scenario 1: OpenSpec Terminal Splash & Interactive Flow
**Goal**: Verify ASCII welcome banner, overview cards, and guided setup.

```bash
pnpm cli:dev
```

**Verification Steps**:
1. Verify the OpenSpec ASCII splash banner and quickstart instructions render cleanly.
2. Enter project name (e.g. `test-interactive-app`).
3. In the setup flow prompt, select:
   `🌟 Use a Curated Default Template (Instant Setup)`
4. Select `Enterprise Monorepo`.
5. Select `Git repository: Yes`, `Install dependencies: No`.
6. Verify files are staged and written with the high-contrast summary card showing files written and next-step commands.

---

### Scenario 2: Searchable / Filterable Multi-Select TUI for Skills
**Goal**: Test real-time character typing filter, arrow navigation, space toggle, and pagination.

```bash
pnpm cli:dev test-search-tui
```

**Verification Steps**:
1. When asked `Choose your setup flow`, select `🛠️ Custom Stack Wizard (Configure every layer)`.
2. Step through topology selection (e.g. Monorepo).
3. When reaching the **AI Governance & Skills** step:
   - Notice the OpenSpec searchable prompt: `Search: [type to filter]`.
   - Type `docker`: verify list instantly filters to `Docker Containerization Expert`.
   - Press `Space`: verify checkbox toggles `[x]`.
   - Press `Backspace`: verify filter text clears and all skills return.
   - Type `drizzle`: verify list filters to `Drizzle ORM Expert`.
   - Press `Space`: verify checkbox toggles `[x]`.
   - Press `Enter`: verify selected skills are confirmed.

---

### Scenario 3: Next.js Getting Started Ergonomics (Positional & `.` Current Dir)
**Goal**: Verify directory resolution, dot notation, and overwrite guards.

#### Test 3A: Positional Name
```bash
pnpm cli:dev sample-app --yes --dry-run
```
*Expected*: Resolves to `./sample-app` with project name `sample-app`.

#### Test 3B: Dot Notation (`.`)
Create an empty test directory and run:
```bash
mkdir -p /tmp/forgestack-dot-test && cd /tmp/forgestack-dot-test
node /home/dev/Documents/Kungfu/Test-Task/project-setup/packages/cli/bin/create-forgestack-app.js . --yes --dry-run
```
*Expected*: Scaffolds directly into current directory without creating nested subfolders. Project name defaults to `forgestack-dot-test`.

#### Test 3C: Non-Empty Directory Collision Protection
Run without `--force` in a non-empty directory:
```bash
cd /home/dev/Documents/Kungfu/Test-Task/project-setup/packages/cli
pnpm cli:dev . --yes --dry-run
```
*Expected*: Rejects with error:
`Target directory "..." is not empty. Pass '--force' or '--overwrite' to proceed.`

Now add `--force`:
```bash
pnpm cli:dev . --yes --force --dry-run
```
*Expected*: Overwrite check passes and files stage successfully.

---

### Scenario 4: Instant 1-Click Scaffolding (`--yes`)
```bash
pnpm cli:dev instant-app -y --dry-run
```
*Expected*: Bypasses all wizard questions, generates the 100+ file Enterprise Monorepo stack in memory.

---

### Scenario 5: Curated Architecture Presets (`--template <id>`)
Test all 8 curated presets with dry-run:

```bash
# 1. Enterprise Monorepo
pnpm cli:dev test-1 -t enterprise-monorepo --dry-run

# 2. AI-Native Agent & RAG
pnpm cli:dev test-2 -t ai-agent-rag --dry-run

# 3. Native Tauri v2 Desktop
pnpm cli:dev test-3 -t tauri-desktop --dry-run

# 4. Next.js 15 Full-Stack
pnpm cli:dev test-4 -t nextjs-fullstack --dry-run

# 5. Micro-Frontend Federation
pnpm cli:dev test-5 -t micro-frontend --dry-run

# 6. Distributed BullMQ Worker
pnpm cli:dev test-6 -t distributed-worker --dry-run

# 7. Modern Frontend SPA
pnpm cli:dev test-7 -t standalone-fe --dry-run

# 8. Clean Modular Fastify Backend
pnpm cli:dev test-8 -t standalone-be --dry-run
```

#### Test Unknown Template Handling:
```bash
pnpm cli:dev test-fail --template unknown-preset --dry-run
```
*Expected*: Rejects with:
`Template "unknown-preset" not found. Run 'forgestack template list' to view available templates.`

---

### Scenario 6: Custom Reusable Templates & Persistence
**Goal**: Verify custom templates can be saved to `~/.forgestack/templates.json` and reused.

#### Test 6A: Save Template During CLI Run
```bash
pnpm cli:dev custom-app --topology standalone-be --be fastify --db postgres --orm drizzle --save-template my-fastify-api --dry-run
```
*Expected*: Logs success: `Saved configuration as custom template "my-fastify-api".`

#### Test 6B: List Templates
```bash
pnpm cli:dev template list
```
*Expected*: Shows curated default presets followed by `📂 Saved Custom Templates` including `my-fastify-api`.

#### Test 6C: Scaffold from Saved Custom Template
```bash
pnpm cli:dev new-service -t my-fastify-api --dry-run
```
*Expected*: Resolves `my-fastify-api` from local catalog and stages backend files.

#### Test 6D: Delete Custom Template
```bash
pnpm cli:dev template delete my-fastify-api
```
*Expected*: Logs `Custom template "my-fastify-api" was deleted successfully.`

#### Test 6E: Curated Preset Deletion Guard
```bash
pnpm cli:dev template delete enterprise-monorepo
```
*Expected*: Fails with error: `Cannot delete built-in curated preset "enterprise-monorepo".`

---

### Scenario 7: Incompatible Option Validation
Verify that the CLI catches illegal architectural combinations before doing any work:

```bash
# MongoDB + Drizzle (incompatible)
pnpm cli:dev app-fail --topology monorepo --db mongodb --orm drizzle --dry-run
# Expected: Error: MongoDB is not compatible with Drizzle ORM. Use '--orm mongoose'.

# tRPC outside Monorepo (incompatible)
pnpm cli:dev app-fail --topology standalone-be --rpc trpc --dry-run
# Expected: Error: tRPC requires a monorepo topology ('monorepo' or 'ai-agent-rag').

# PostgreSQL + Mongoose (incompatible)
pnpm cli:dev app-fail --topology monorepo --db postgres --orm mongoose --dry-run
# Expected: Error: PostgreSQL is not compatible with Mongoose.
```

---

### Scenario 8: End-to-End Generated Project Verification
Generate a real project on disk, install dependencies, and run tests:

```bash
# 1. Generate real project into a temp folder
cd /tmp
node /home/dev/Documents/Kungfu/Test-Task/project-setup/packages/cli/bin/create-forgestack-app.js test-e2e-run --template enterprise-monorepo --no-install

# 2. Enter project folder
cd test-e2e-run

# 3. Verify files exist
ls -la
test -f package.json && echo "✓ package.json exists"
test -f pnpm-workspace.yaml && echo "✓ pnpm-workspace.yaml exists"
test -d apps/web && echo "✓ apps/web exists"
test -d apps/api && echo "✓ apps/api exists"
test -d packages/mcp-server && echo "✓ packages/mcp-server exists"
test -d .agents/skills && echo "✓ .agents/skills exists"
test -d .cursor/rules && echo "✓ .cursor/rules exists"
test -d openspec && echo "✓ openspec exists"

# 4. Clean up test folder
cd ..
rm -rf test-e2e-run
```

---

### Scenario 9: Full Automated Test Suite
Run the automated test matrix to ensure zero regressions across all workspaces:

```bash
# Run CLI package tests (34 tests in ~900ms)
pnpm --filter @forgestk/cli test

# Run full monorepo test suite (123 tests across 38 files)
pnpm test
```
