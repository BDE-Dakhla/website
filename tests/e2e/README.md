# E2E Tests with Playwright

End-to-end tests for critical user flows using Playwright with locale-aware routing support.

## Setup

### Prerequisites

1. **Install browsers**:
   ```bash
   bunx playwright install
   ```

2. **Install system dependencies (Linux only)**:
   ```bash
   bunx playwright install-deps
   ```

3. **Database Setup** (for tests requiring DB):
   ```bash
   # Start PostgreSQL locally
   brew services start postgresql@15  # macOS
   sudo systemctl start postgresql   # Ubuntu
   
   # Create test database
   psql -U postgres -c "CREATE DATABASE test;"
   psql -U postgres -c "CREATE USER test WITH PASSWORD 'test';"
   psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE test TO test;"
   ```

4. **Environment Variables**:
   Create `.env.test.local`:
   ```env
   DATABASE_URL="postgresql://postgres:test@localhost:5432/test"
   AUTH_NEXT_SECRET="test-secret"
   NEXT_PUBLIC_DEFAULT_LANG="fr"
   BASE_URL="http://localhost:3000"
   ```

5. **Run migrations**:
   ```bash
   bun run migrate
   ```

## Running Tests

```bash
# Run all E2E tests
bun run test:e2e

# Run in UI mode (interactive)
bun run test:e2e:ui

# Run in headed mode (see browser)
bun run test:e2e:headed

# Run specific test file
bun run test:e2e tests/e2e/auth.spec.ts

# Run specific test
bun run test:e2e --grep "should display login page"

# Run in specific browser
bun run test:e2e --project=chromium
```

## Test Structure

```
tests/e2e/
├── auth.spec.ts                    # Authentication flows (fixed selectors)
├── auth-with-fixtures.spec.ts     # Auth tests using fixtures
├── locale.spec.ts                  # Locale handling tests
├── fixtures/
│   ├── auth-fixtures.ts           # Test users and helper functions
│   └── ...                       # Other test fixtures
├── global-setup.ts                # Global test setup
├── global-teardown.ts            # Global test cleanup
└── README.md                     # This file
```

## Locale Handling

This app uses Next.js 13+ with `localePrefix: 'as-needed'`. Tests automatically handle:

- Default locale routing (`/` → `/fr/`)
- Explicit locale paths (`/fr/connexion`)
- Locale persistence in navigation

**Always use explicit locale paths in tests:**
```typescript
// ❌ Wrong - may cause redirects
await page.goto('/connexion')

// ✅ Correct - stable, locale-aware
await page.goto('/fr/connexion')
```

## Writing Tests

### Basic Test Pattern

```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/path')
    
    await page.getByLabel('Field').fill('value')
    await page.getByRole('button', { name: 'Submit' }).click()
    
    await expect(page.locator('.success')).toBeVisible()
  })
})
```

### Authentication Helper (TODO)

```typescript
import { test as base } from '@playwright/test'

const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // Login logic here
    await page.goto('/connexion')
    await page.getByLabel('Code Massar').fill('R142002537')
    await page.getByLabel('Mot de passe').fill('password')
    await page.getByRole('button', { name: /se connecter/i }).click()
    
    await use(page)
  }
})

test('protected page', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/dashboard')
  // Test protected content
})
```

## Current Coverage

- ✅ Authentication page display
- ✅ Invalid credentials error handling
- ✅ Code Massar format validation
- ✅ Required field validation
- ✅ Google sign-in button presence
- ✅ Remember me checkbox
- ✅ Signup link

## TODO: Additional Tests

### Newsletter Flow
- [ ] Subscribe with valid email
- [ ] Handle duplicate subscription
- [ ] Email confirmation
- [ ] Unsubscribe flow

### Dashboard Access
- [ ] Login and navigate to dashboard
- [ ] Role-based access control
- [ ] Newsletter management (admin)
- [ ] User management (admin)
- [ ] Analytics page access

### Analytics Tracking
- [ ] Verify pageview tracking
- [ ] Verify visitor cookie set
- [ ] Verify session cookie set
- [ ] Verify custom event tracking
- [ ] Verify heartbeat events

## CI/CD Integration

Add to your CI pipeline:

```yaml
- name: Run E2E tests
  run: |
    bunx playwright install --with-deps
    bun run test:e2e
```

## Debugging

```bash
# Open Playwright Inspector
bunx playwright test --debug

# Generate test code
bunx playwright codegen http://localhost:3000

# View test report
bunx playwright show-report
```

## Best Practices

1. **Use data-testid attributes** for stable selectors
2. **Wait for navigation** before assertions
3. **Use page.getByRole()** for accessibility
4. **Mock external services** in tests
5. **Keep tests independent** - no test should depend on another
6. **Clean up test data** after each test
