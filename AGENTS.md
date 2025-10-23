# Agent Guidelines for BDE Dakhla

## Build/Lint/Test Commands

### Building

- `bun run build` - Build production bundle with Turbopack
- `bun run dev` - Start development server with Turbopack

### Linting & Formatting

- Uses Biome for linting and formatting (configured in `biome.json`)
- `bunx biome check .` - Check linting and formatting
- `bunx biome check --write .` - Auto-fix linting issues
- `bunx biome format .` - Format code

### Testing

- `bun run test` - Run all unit/integration tests
- `bun run test:watch` - Run tests in watch mode
- `bun run test:ui` - Run tests with UI
- `bun run test:coverage` - Run tests with coverage report
- `bun run test:e2e` - Run all E2E tests
- `bun run test:e2e:ui` - Run E2E tests with UI
- `bun run test:e2e:headed` - Run E2E tests in headed mode
- `bun run test:all` - Run all tests (unit + integration + e2e)

**Running a single test:** `vitest run path/to/test.ts`

## Code Style Guidelines

### TypeScript

- Strict mode enabled (`"strict": true` in tsconfig.json)
- No `any` types (Biome warns on `noExplicitAny`)
- Use proper type annotations for all variables and functions
- Prefer interfaces over types for object shapes
- Use `type` for unions, intersections, and utility types

### Imports

- Organize imports: types first, then external libraries, then internal modules
- Use absolute imports with `@/` alias for internal modules
- Group imports by category with blank lines between groups

### Naming Conventions

- **Components:** PascalCase (e.g., `UserProfile`, `DataTable`)
- **Functions:** camelCase (e.g., `formatDate`, `validateEmail`)
- **Variables:** camelCase (e.g., `userData`, `isLoading`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`)
- **Files:** kebab-case for components (e.g., `user-profile.tsx`), camelCase for utilities (e.g., `dateUtils.ts`)

### Formatting

- 2-space indentation
- Single quotes for strings
- Semicolons as needed (configured in Biome)
- Trailing commas in multiline structures
- Line width: 80 characters
- Bracket same line for consistency

### React Patterns

- Use functional components with hooks
- Define props interfaces extending React component props
- Use `cn()` utility from `lib/utils.tsx` for conditional className concatenation
- Avoid string template literals for className - use `cn()` instead
- Prefer composition over inheritance

### Error Handling

- Use try/catch blocks in async functions
- Return appropriate HTTP status codes in API routes
- Use Zod for input validation with `safeParse()`
- Log errors with `console.error()` before returning error responses
- Provide meaningful error messages to users

### Database & API

- Use Kysely for type-safe database queries
- Validate all inputs with Zod schemas
- Handle authentication checks at the start of protected routes
- Return consistent response formats: `{ success: boolean, data/error: ... }`

### Testing

- Write unit tests for pure functions and utilities
- Write integration tests for API routes with full request/response cycle
- Use fixtures for reusable test data
- Mock external dependencies in `__mocks__` directory
- Clear mocks in `beforeEach` hooks using `vi.clearAllMocks()`
- Test both success and error cases
- Verify side effects (DB calls, email sends, etc.)
- Maintain 60% coverage threshold across lines, functions, branches, and statements
