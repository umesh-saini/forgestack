# Scaffolding Engine Delta Specification

## ADDED Requirements

### Requirement: Biome Alternative Linter and Formatter Slice
The scaffolding engine SHALL support Biome as an alternative linter and code formatter to ESLint and Prettier.

#### Scenario: Scaffolding a project with Biome
- **Given** a user configuration specifies `linter: "biome"`
- **When** the scaffolding compositor executes
- **Then** a `biome.json` configuration file is generated at the project root, `@biomejs/biome` is added to devDependencies, and `package.json` scripts define `"lint": "biome check ."` and `"format": "biome format --write ."`

### Requirement: Turnkey Cloud Deployment Descriptors
The scaffolding engine SHALL generate platform-specific deployment configuration manifests based on the specified cloud provider.

#### Scenario: Generating Vercel deployment manifest
- **Given** a project configuration specifies `deployment: "vercel"`
- **When** the scaffolding engine generates files
- **Then** a `vercel.json` deployment manifest is created with framework settings and route headers

#### Scenario: Generating Cloudflare deployment manifest
- **Given** a project configuration specifies `deployment: "cloudflare"`
- **When** the scaffolding engine generates files
- **Then** a `wrangler.jsonc` deployment configuration is created for Cloudflare Workers / Pages

#### Scenario: Generating Fly.io or Railway deployment manifests
- **Given** a project configuration specifies `deployment: "fly"` or `deployment: "railway"`
- **When** the scaffolding engine generates files
- **Then** a corresponding `fly.toml` or `railway.json` file is synthesized with port bindings and start commands
