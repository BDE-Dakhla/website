# E2E Tests with Playwright

End-to-end tests for critical user flows using Playwright.

## Setup

```bash
# Install browsers
bunx playwright install

# Install system dependencies (Linux only)
bunx playwright install-deps
```

## Running Tests

```bash
# Run all E2E tests
bun run test:e2e

# Run in UI mode (interactive)
bun run test:e2e:ui

# Run specific test file
bunx playwright test tests/e2e/auth.spec.ts

# Run in headed mode (see browser)
bunx playwright test --headed

# Run in specific browser
bunx playwright test --project=chromium
bunx playwright test --project=firefox
bunx playwright test --project=webkit
```

## Test Structure

```
tests/e2e/
├── auth.spec.ts                # Authentication flows
├── newsletter.spec.ts          # Newsletter subscription (TODO)
├── dashboard.spec.ts           # Dashboard access (TODO)
├── analytics-tracking.spec.ts  # Analytics tracking (TODO)
├── fixtures/                   # Test data and helpers (TODO)
└── README.md                   # This file
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
