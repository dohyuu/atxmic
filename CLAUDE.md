# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Atxmic is a library for atomic transaction management across different database adapters. It provides a unified transaction API that works with various ORMs like Prisma, with plans to support TypeORM, Sequelize, and Drizzle.

## Commands

### Development
- `pnpm install` - Install dependencies for all packages
- `pnpm test` - Run tests for all packages using Vitest (workspace config in vitest.config.ts)
- `pnpm run core test` - Run tests for the core package
- `pnpm run prisma test` - Run tests for the Prisma adapter
- `pnpm run nestjs test` - Run tests for the NestJS adapter
- `pnpm test path/to/file.spec.ts` - Run a specific test file

### Building
- `pnpm run core build` - Build the core package
- `pnpm run prisma build` - Build the Prisma adapter
- `pnpm run nestjs build` - Build the NestJS adapter
- All packages use `tsup` to build both ESM (.mjs) and CJS (.js) formats with TypeScript declarations

### Linting and Formatting
- Biome is used for linting and formatting (configured in biome.json)
- Format: 2 spaces, double quotes, semicolons as needed, line width 80
- `unsafeParameterDecoratorsEnabled: true` set for NestJS decorator compatibility

## Architecture

### Monorepo Structure
The project uses pnpm workspaces with the following structure:
- `packages/core` - Core transaction management logic
- `adapters/prisma` - Prisma adapter implementation
- `adapters/nestjs` - NestJS integration with decorators
- `examples/` - Example implementations
- `internals/` - Shared internal configurations

### Core Concepts

1. **TransactionalClient** - The main interface that all adapters implement
   - `_transaction`: Method to execute a transaction
   - `_atomicTransaction`: Method that uses the transaction storage
   - Created via `createTransactionalClient` helper (packages/core/src/client.ts)

2. **TransactionStorage** - AsyncLocalStorage-based context storage for transactions
   - Allows nested transactions to access parent transaction context
   - Enables propagation strategies
   - Automatically reuses parent transaction in nested calls

3. **Adapters** - Transform database clients into TransactionalClients
   - Support both class adapters (extend a class like PrismaClient) and instance adapters (wrap existing instances)
   - Example: `prismaAdapter` in adapters/prisma/src/adapter.ts handles both cases
   - Class adapters: `prismaAdapter(PrismaClient)` extends the class
   - Instance adapters: `prismaAdapter(clientInstance)` wraps the instance

4. **NestJS Integration**
   - `@Transactional()` decorator for automatic transaction management
   - Uses dependency injection to access both client and storage
   - `TransactionModule.register()` for module configuration
   - Automatic injection of transaction context into decorated methods

### Key Design Patterns

1. **Proxy Pattern** - Used to intercept database calls and inject transaction context
   - Implemented in packages/core/src/proxy.ts
   - Checks TransactionStorage for active transaction on each property access
   - Returns transaction context if available, otherwise returns original client
   - Special handling for `_transaction` method to enable nested transactions

2. **AsyncLocalStorage** - For maintaining transaction context across async calls
   - Enables automatic transaction propagation without explicit parameter passing
   - Each transaction stores its context in AsyncLocalStorage
   - Nested calls automatically access parent transaction context

3. **Decorator Pattern** - NestJS decorators for declarative transaction management
   - `@Transactional()` decorator wraps methods to run within transactions
   - Preserves method metadata for NestJS routing and validation

4. **Factory Pattern** - Adapter factories for different database clients
   - `createTransactionalClient` creates clients with transaction support
   - Adapter functions detect class vs instance and apply appropriate transformation

## Testing

- All packages use Vitest for testing
- Test files are colocated with source files (*.spec.ts)
- Mock utilities available in test directories
- Run specific test files: `pnpm test path/to/file.spec.ts`

## Publishing

Each package has a `prepublishOnly` script that builds before publishing.
Packages are published to npm under:
- `atxmic` - Core package
- `@atxmic/prisma` - Prisma adapter
- `@atxmic/nestjs` - NestJS adapter