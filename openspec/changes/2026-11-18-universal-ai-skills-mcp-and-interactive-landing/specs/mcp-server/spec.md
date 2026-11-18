# MCP Server Specification

## Purpose
Provides autonomous AI assistants with a direct, local JSON-RPC protocol interface to introspect, validate, preview, and scaffold ForgeStack architectures without authentication friction.

## ADDED Requirements

### Requirement: Zero-OAuth Stdio Transport
The MCP server SHALL communicate over standard input/output (`stdio`) adhering strictly to the JSON-RPC 2.0 protocol with zero OAuth or API key requirements.

#### Scenario: AI assistant launches MCP server
- **WHEN** an AI client launches `forgestack-mcp` via stdio
- **THEN** the server initializes successfully without requiring external network authentication or tokens
- **AND** it responds to JSON-RPC tool discovery queries.

### Requirement: Introspection & Validation Tools
The MCP server SHALL expose `forgestack_list_presets`, `forgestack_get_stack_options`, and `forgestack_validate_config`.

#### Scenario: AI client validates a stack configuration
- **WHEN** the client calls `forgestack_validate_config` with a proposed `ProjectConfig`
- **THEN** the server validates the configuration against Zod schemas and returns validation status and warnings.

### Requirement: In-Memory VFS Preview and Scaffolding Tools
The MCP server SHALL expose `forgestack_preview_vfs` and `forgestack_scaffold_project`.

#### Scenario: AI client requests in-memory preview
- **WHEN** the client invokes `forgestack_preview_vfs`
- **THEN** the server returns the compiled in-memory file tree and file counts without writing to physical disk.

#### Scenario: AI client scaffolds project to disk
- **WHEN** the client invokes `forgestack_scaffold_project` with a target path
- **THEN** the server compiles the VFS and atomically flushes the files to the physical target directory.
