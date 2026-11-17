---
name: clean-code-craftsmanship
description: Engineering guidelines for clean code architecture, strict TypeScript standards, defensive programming, resilient error handling, and robust test-driven development.
---

# Clean Code Craftsmanship & Software Architecture

This skill defines the engineering standards, code design patterns, and quality gates for developing reliable, scalable, and maintainable software systems.

## 1. Strict TypeScript & Type Safety

1. **Zero-`any` Policy**:
   - `any` is strictly prohibited. Use `unknown` with runtime type narrowing (Zod, `typeof`, `instanceof`, or custom type guards) when dealing with dynamic data.
   - Disallow unsafe type assertions (`as unknown as T` or `!`). Use defensive parsing.
   - Enable strict compiler flags: `strict: true`, `noImplicitAny: true`, `strictNullChecks: true`, `exactOptionalPropertyTypes: true`.

2. **Single Source of Truth for Data Contracts**:
   - Every API request body, query parameter, route parameter, and response payload MUST be defined as a Zod schema.
   - Infer static TypeScript types directly from schemas using `z.infer<typeof schema>` to prevent type/schema drift.
   - Store shared contracts in a dedicated package (e.g., `@repo/contracts`) consumable by both frontend and backend.

## 2. Clean Modular Architecture & Boundary Enforcement

1. **Layered Separation of Concerns**:
   - **Routes**: Handle HTTP path registration, method dispatch, and wire up middleware. No business logic.
   - **Controllers**: Parse and validate requests (`schema.parse()`), call service methods, and format HTTP responses. Controllers MUST NEVER execute raw SQL or call ORM methods directly.
   - **Services**: Encapsulate pure domain and business logic, handle business validation, orchestrate multiple repositories, and enforce business transactions.
   - **Repositories**: Abstract database I/O, execute queries via ORMs/ODMs (Drizzle, Prisma, Mongoose), and return typed domain entities.
   - **Models/Schemas**: Define the database tables, document structures, relations, and migrations.

2. **Environment & Configuration Hygiene**:
   - Never access `process.env` directly throughout application code.
   - Validate and parse all environment variables at application boot in a single centralized module (`src/config/env.ts`) using Zod. Fail fast with clear diagnostic messages if configuration is missing.

3. **Resilient Error Handling**:
   - Define a strongly-typed domain error hierarchy inheriting from an abstract `AppError`:
     - `BadRequestError` (400)
     - `UnauthorizedError` (401)
     - `ForbiddenError` (403)
     - `NotFoundError` (404)
     - `ConflictError` (409)
     - `InternalServerError` (500)
   - Never swallow errors silently or return empty catch blocks (`catch (e) {}`).
   - Catch unhandled errors at a global centralized error middleware. Log full stack traces and contextual metadata with structured loggers (Pino), and return sanitized error responses to clients.

## 3. Database Resilience & Lifecycle Management

1. **Connection Pooling & Health Checks**:
   - Always configure connection pool minimum and maximum thresholds according to load profile.
   - Provide a dedicated, lightweight `/api/health` check that actively verifies database ping capability (e.g. `SELECT 1` or `mongoose.connection.readyState === 1`).
   - Implement exponential retry backoff loops for database reconnects upon initialization failure.

2. **Graceful Shutdown**:
   - Trap OS termination signals (`SIGINT`, `SIGTERM`).
   - Stop accepting new incoming HTTP requests, drain in-flight connections, close database pools/connections cleanly, and exit with code 0.
   - Attach a safety fallback timeout (e.g., 10 seconds) to force termination if resources fail to release.

## 4. Test-Driven Verification

1. **Arrange-Act-Assert (AAA)**:
   - Structure every test with explicit setup, action execution, and assertion blocks.
2. **Isolation & Fast Feedback**:
   - Unit tests must run in milliseconds without external database or network dependencies. Mock external I/O boundaries.
   - Integration tests must verify real database queries and HTTP endpoints against test database containers.
