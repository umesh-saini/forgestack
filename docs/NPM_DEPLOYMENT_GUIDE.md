# ForgeStack CLI — NPM Deployment & Publishing Guide

This guide details the complete architecture, setup, and step-by-step procedure for deploying and publishing `@forgestk/cli` (`create-forgestack-app`) and `@forgestk/core` to the npm registry.

---

## 1. Package Architecture & NPM Registry Resolution

Before publishing, it is crucial to understand how npm resolves commands like `npx create-forgestack-app` versus scoped monorepo packages.

### How Package Managers Resolve Initializers
When a user runs an initializer command:
- `npm create forgestack-app my-app`
- `pnpm create forgestack-app my-app`
- `yarn create forgestack-app my-app`
- `bun create forgestack-app my-app`

The package manager automatically prepends `create-` to the argument and queries the npm registry for:
```text
https://registry.npmjs.org/create-forgestack-app
```

When a user runs:
- `npx create-forgestack-app my-app`

npm looks directly for the package named `create-forgestack-app`.

### Package Naming Strategy
In this monorepo, we have two core packages:
1. **`@forgestk/core`**: The headless Virtual File System (VFS), template compositors, and Zod schemas.
2. **`@forgestk/cli`** (or `create-forgestack-app`): The interactive OpenSpec TUI, terminal wizard, and CLI binary.

> [!IMPORTANT]
> If you publish the CLI as `@forgestk/cli`, users can run it via `npx @forgestk/cli my-app`.
> If you want users to be able to run `npx create-forgestack-app my-app` or `pnpm create forgestack-app my-app`, the package name in `packages/cli/package.json` must either be `"name": "create-forgestack-app"`, or you must publish a lightweight proxy package `create-forgestack-app` that delegates to `@forgestk/cli`.

---

## 2. Monorepo Publishing Prerequisites

### A. NPM Account & 2-Factor Authentication
1. Create an account at [npmjs.com](https://www.npmjs.com) if you do not have one.
2. If publishing under the `@forgestack` scope, create the organization on npm:
   - Navigate to **Organizations** -> **Create Organization** -> Name: `forgestack`.
3. Enable 2-Factor Authentication (2FA) for write and publish access:
   - Settings -> 2FA -> Enable 2FA for Authorization and Publishing.

### B. Authenticate via CLI
Log in to npm in your terminal:
```bash
npm login
```
Verify your authenticated identity:
```bash
npm whoami
```

---

## 3. Pre-Publish Monorepo Verification

Never publish unbuilt or broken packages. Run these commands from the root of the repository:

```bash
# 1. Ensure all packages compile strictly with zero TypeScript errors
pnpm build

# 2. Run the entire monorepo test suite (123+ unit and integration tests)
pnpm test

# 3. Verify OpenSpec specifications are valid
npx openspec validate
```

---

## 4. Manual Publishing Workflow

In a pnpm monorepo, packages must be published in dependency order: `@forgestk/core` first, followed by `@forgestk/cli`.

### Step 1: Publish `@forgestk/core`
`@forgestk/cli` depends on `@forgestk/core`. Therefore, `@forgestk/core` must be available on the registry first.

```bash
cd packages/core

# Ensure package is clean and built
pnpm run build

# Publish as public package (required for scoped @forgestk/* packages)
pnpm publish --access public
```

> [!NOTE]
> `pnpm publish` automatically converts `workspace:*` dependencies into concrete SemVer versions (e.g. `^1.0.0`) in the published tarball manifest.

### Step 2: Publish `@forgestk/cli`
Once core is available on npm:

```bash
cd packages/cli

# Ensure package is clean and built
pnpm run build

# Publish as public package
pnpm publish --access public
```

---

## 5. Publishing as Unscoped `create-forgestack-app`

If you registered the unscoped name `create-forgestack-app` on npm:

1. Update `packages/cli/package.json`:
   ```json
   {
     "name": "create-forgestack-app",
     "version": "1.0.0",
     "bin": {
       "create-forgestack-app": "./bin/create-forgestack-app.js",
       "forgestack": "./bin/create-forgestack-app.js"
     }
   }
   ```
2. Publish with standard access:
   ```bash
   cd packages/cli
   pnpm publish --access public
   ```

Now users globally can run:
```bash
npx create-forgestack-app my-app
# and
pnpm create forgestack-app my-app
```

---

## 6. Automated Release via GitHub Actions (CI/CD)

To automate publishing whenever a git release tag (e.g. `v1.0.1`) is pushed, create `.github/workflows/publish.yml`:

```yaml
name: Publish to NPM

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10.33.4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          registry-url: 'https://registry.npmjs.org'

      - name: Install Dependencies
        run: pnpm install --frozen-lockfile

      - name: Run Quality Gate (Typecheck & Vitest)
        run: |
          pnpm run build
          pnpm run test

      - name: Publish @forgestk/core
        run: |
          cd packages/core
          pnpm publish --access public --no-git-checks
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

      - name: Publish @forgestk/cli
        run: |
          cd packages/cli
          pnpm publish --access public --no-git-checks
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Setting up the NPM Secret:
1. Go to [npmjs.com](https://www.npmjs.com) -> **Access Tokens** -> **Generate New Token** (Granular Access Token or Automation Token).
2. Go to your GitHub repository -> **Settings** -> **Secrets and variables** -> **Actions**.
3. Create a repository secret named `NPM_TOKEN` and paste your token value.

---

## 7. Version Bumping Checklist

When releasing an update:
1. Bump version across packages:
   ```bash
   # Patch update (1.0.0 -> 1.0.1)
   pnpm --filter @forgestk/core exec npm version patch
   pnpm --filter @forgestk/cli exec npm version patch
   ```
2. Build and verify test suite:
   ```bash
   pnpm build && pnpm test
   ```
3. Commit and tag release:
   ```bash
   git commit -am "chore(release): v1.0.1"
   git tag v1.0.1
   git push origin master --tags
   ```

---

## 8. Common Deployment Errors & Fixes

### Error: `403 Forbidden - You do not have permission to publish`
- **Cause**: The package name is scoped (`@forgestk/cli`) but `--access public` was omitted, or you are not a member of the `@forgestack` npm organization.
- **Fix**: Run `pnpm publish --access public`. If creating an unscoped package (`create-forgestack-app`), check whether the name is already claimed on npm.

### Error: `Unsupported URL Type "workspace:*"`
- **Cause**: Using plain `npm publish` instead of `pnpm publish` inside a pnpm monorepo.
- **Fix**: Always use `pnpm publish` which automatically rewrites `workspace:*` specifiers to real semver ranges.

### Error: `code ENEEDAUTH - Need auth to publish`
- **Cause**: You are not logged in or your session expired.
- **Fix**: Run `npm login` and enter your credentials and 2FA code.

### Error: `permission denied: bin/create-forgestack-app.js`
- **Cause**: Executable permission bit missing on git index.
- **Fix**: Run `chmod +x packages/cli/bin/create-forgestack-app.js` and commit the file mode change.
