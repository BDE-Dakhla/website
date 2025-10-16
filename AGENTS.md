# Project Guidelines

## Architecture

## Testing

- Run `bun run test` before completing any feature
- New features need unit tests
- API changes need integration tests

### Best Practices

### Test Organization

- Unit tests for pure functions and utilities
- Integration tests for API routes with full request/response cycle
- Fixtures for reusable test data
- Mocks isolated in `__mocks__` directory

### Mock Management

- Clear all mocks in `beforeEach` hooks
- Use `vi.clearAllMocks()` in setup
- Avoid mock hoisting issues by defining mocks before imports

### Assertions

- Test both success and error cases
- Verify side effects (DB calls, email sends)
- Check status codes and response bodies
- Validate data transformations (e.g., lowercase emails)

## Code Style  

- Use TypeScript strict mode
- Prefer composition over inheritance

## Common Commands

### Testing

```bash
bun run test             # Run all tests
bun run test:watch       # Watch mode
bun run test:ui          # Visual UI
bun run test:coverage    # Coverage report
bun run test:e2e         # Run all E2E tests
bun run test:e2e:ui      # Run in UI mode (interactive)
bun run test:e2e:headed  # Run in headed mode (see browser)
bun run test:all         # Run all tests (unit + integration + e2e)
```

### Development

```bash
bun run lint:fix
```

### Production

```bash
bun run build
```

## Mistakes to avoid

- Don’t use any! type annotations
- Don't use string conditional literal template when declaring className attribute on JSX, use `cn()` helper function instead from `lib/utils.ts`
