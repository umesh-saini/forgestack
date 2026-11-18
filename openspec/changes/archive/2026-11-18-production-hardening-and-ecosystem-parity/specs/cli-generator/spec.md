# CLI Generator Delta Specification

## ADDED Requirements

### Requirement: Biome Linter Selection Flag
The CLI generator SHALL accept a `--linter <eslint | biome | none>` flag to configure code quality tools without interactive prompts.

#### Scenario: Headless configuration with Biome flag
- **Given** a user runs `create-forgestack-app my-app --linter biome`
- **When** the CLI parses arguments
- **Then** the generated project is configured with Biome instead of ESLint and Prettier

### Requirement: Cloud Deployment Descriptor Flag
The CLI generator SHALL accept a `--deploy <docker | vercel | cloudflare | railway | fly | none>` flag to emit deployment manifests for target hosting platforms.

#### Scenario: Specifying cloud deployment target via CLI
- **Given** a user runs `create-forgestack-app my-app --deploy vercel`
- **When** the project is scaffolded
- **Then** the `vercel.json` deployment manifest is staged and flushed into the project root
