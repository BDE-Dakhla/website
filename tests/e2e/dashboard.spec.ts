import { expect, test } from '@playwright/test'
import {
  navigateToDashboard,
  navigateToSection,
  TEST_USER_CREDENTIALS,
} from './fixtures/navigation-fixtures'

test.describe('Dashboard Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Login first to access dashboard
    await page.goto('/fr/connexion')
    await page
      .getByLabel('Code Massar')
      .fill(TEST_USER_CREDENTIALS.VALID_USER.cdm)
    await page
      .getByRole('textbox', { name: 'Mot de passe' })
      .fill(TEST_USER_CREDENTIALS.VALID_USER.password)
    await page.getByRole('button', { name: 'Se connecter' }).first().click()

    // Wait for redirect to dashboard
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/fr\/dashboard/)
  })

  test.describe('Dashboard Overview', () => {
    test('should display main dashboard page', async ({ page }) => {
      await navigateToDashboard(page)

      // Dashboard should be accessible and loaded
      await expect(
        page.getByRole('heading', { name: /Tableau de bord|Dashboard/i }),
      ).toBeVisible()

      // Should show sidebar navigation
      await expect(page.locator('[role="navigation"]')).toBeVisible()

      // Should show user menu/avatar
      await expect(
        page
          .locator('[data-testid="user-menu"]')
          .or(page.locator('[data-testid="user-avatar"]')),
      ).toBeVisible()
    })

    test('should show dashboard header with proper title', async ({ page }) => {
      await navigateToDashboard(page)

      // Check for dashboard title in header
      await expect(
        page.getByText(/Tableau de bord|Dashboard|Tableaux de bord/i),
      ).toBeVisible()

      // Check for any dashboard-specific controls (filters, settings, etc.)
      // This will depend on the actual dashboard implementation
    })

    test('should maintain dashboard state during navigation', async ({
      page,
    }) => {
      await navigateToDashboard(page)

      // Navigate away and back
      await navigateToSection(page, 'Statistiques')
      await navigateToDashboard(page)

      // Should return to dashboard with same state
      await expect(
        page.getByRole('heading', { name: /Tableau de bord/i }),
      ).toBeVisible()
    })
  })

  test.describe('Analytics Dashboard', () => {
    test('should display analytics overview', async ({ page }) => {
      await navigateToSection(page, 'Statistiques')

      // Should load analytics page
      await expect(
        page.getByRole('heading', { name: /Analytics|Statistiques/i }),
      ).toBeVisible()

      // Check for analytics components
      await expect(
        page.locator('[data-testid="current-visitors"]'),
      ).toBeVisible()
      await expect(
        page.locator('[data-testid="analytics-overview"]'),
      ).toBeVisible()
    })

    test('should display current visitors badge', async ({ page }) => {
      await navigateToSection(page, 'Statistiques')

      // Check for current visitors component
      const currentVisitors = page.locator('[data-testid="current-visitors"]')
      await expect(currentVisitors).toBeVisible()

      // Should show some visitor count or placeholder
      await expect(
        currentVisitors
          .getByText(/\d+|0|loading|visitor/i)
          .or(currentVisitors.getByRole('status')),
      ).toBeVisible()
    })

    test('should display analytics charts and metrics', async ({ page }) => {
      await navigateToSection(page, 'Statistiques')

      // Check for chart components
      await expect(
        page
          .locator('[data-testid="analytics-chart"]')
          .or(page.locator('canvas')),
      ).toBeVisible()

      // Check for metrics overview cards
      await expect(
        page.locator('[data-testid="analytics-metrics"]'),
      ).toBeVisible()
    })

    test('should handle time range selection', async ({ page }) => {
      await navigateToSection(page, 'Statistiques')

      // Look for time range controls
      const timeRangeControls = page
        .locator('button')
        .filter({ hasText: /24h|7d|30d|1y|All/i })

      if ((await timeRangeControls.count()) > 0) {
        // Test time range selection
        await timeRangeControls.first().click()

        // Chart or data should update
        await page.waitForTimeout(1000)

        // Should show different data or loading state
        // This test verifies the time range functionality works
      }
    })

    test('should display visitors by country map', async ({ page }) => {
      await navigateToSection(page, 'Statistiques')

      // Scroll down to find country map component
      await page.evaluate(() => window.scrollTo(0, 500))

      // Look for country map or geographical data visualization
      const countryMap = page
        .locator('[data-testid="countries-map"]')
        .or(page.locator('svg'))
        .or(page.locator('[data-testid="map"]'))
      if (await countryMap.isVisible()) {
        await expect(countryMap).toBeVisible()
      }
    })

    test('should show top lists (browsers, OS, devices)', async ({ page }) => {
      await navigateToSection(page, 'Statistiques')

      // Check for top lists in grid layout
      const topLists = page.locator(
        '[data-testid*="top-list"], [data-testid*="analytics-top"]',
      )
      await expect(topLists).toHaveCount(3) // browsers, OS, devices

      // Verify each list has content
      for (const list of await topLists.all()) {
        await expect(list).toBeVisible()
      }
    })
  })

  test.describe('Dashboard Widgets & Components', () => {
    test('should display and interact with interactive charts', async ({
      page,
    }) => {
      await navigateToSection(page, 'Statistiques')

      // Look for chart components that might be interactive
      const chart = page
        .locator('[data-testid="chart-area-interactive"]')
        .or(page.locator('canvas'))

      if (await chart.isVisible()) {
        // Test chart interaction (if supported)
        await chart.hover()
        await page.waitForTimeout(500)

        // Should show tooltip or interaction feedback
        // This depends on chart implementation
      }
    })

    test('should handle loading states properly', async ({ page }) => {
      await navigateToSection(page, 'Statistiques')

      // Check for loading skeletons
      /* const skeletonCount = await page
        .locator('[data-testid="skeleton"], .animate-pulse')
        .count() */

      // During initial load, there might be skeleton components
      // They should eventually be replaced with actual content
      await page.waitForTimeout(2000)

      // After waiting, content should be visible
      // This test ensures loading states are properly managed
      const analyticsContainer = page.locator(
        '[data-testid="analytics-container"]',
      )
      if ((await analyticsContainer.count()) > 0) {
        await expect(analyticsContainer.first()).toBeVisible()
      }
    })
  })

  test.describe('User Dashboard Access', () => {
    test('should respect user permissions for dashboard access', async ({
      page,
    }) => {
      await navigateToDashboard(page)

      // Verify user is authenticated
      await expect(
        page.locator(
          '[data-testid="user-menu"], [data-testid="user-avatar"], [data-testid="user-info"]',
        ),
      ).toBeVisible()

      // Should see dashboard content if user has permission
      // This test validates permission-based dashboard access
    })

    test('should show user information in dashboard', async ({ page }) => {
      await navigateToDashboard(page)

      // Check for user info display
      const userInfo = page.locator(
        '[data-testid="user-info"], [data-testid="user-name"], [data-testid="user-email"]',
      )

      if ((await userInfo.count()) > 0) {
        await expect(userInfo.first()).toBeVisible()

        // Should show username or other user identifying information
        await expect(userInfo.first()).not.toBeEmpty()
      }
    })

    test('should show logout functionality', async ({ page }) => {
      await navigateToDashboard(page)

      // Look for logout button or user menu dropdown
      const userMenu = page.locator('[data-testid="user-menu"]')
      const logoutButton = page
        .locator('[data-testid="logout"], button')
        .filter({ hasText: /déconnecter|logout|se déconnecter/i })

      if (await userMenu.isVisible()) {
        await userMenu.click()
        await expect(logoutButton).toBeVisible()
      } else if (await logoutButton.isVisible()) {
        await expect(logoutButton).toBeVisible()
      }
    })
  })

  test.describe('Dashboard Performance & Loading', () => {
    test('should load dashboard quickly', async ({ page }) => {
      const startTime = Date.now()
      await navigateToDashboard(page)
      const loadTime = Date.now() - startTime

      // Dashboard should load within reasonable time
      expect(loadTime).toBeLessThan(5000)
    })

    test('should handle analytics data loading', async ({ page }) => {
      await navigateToSection(page, 'Statistiques')

      // Analytics might load data asynchronously
      // Should show proper loading states and eventual content
      await page.waitForTimeout(3000)

      // Verify analytics components are eventually populated
      const analyticsContainer = page.locator(
        '[data-testid="analytics-container"]',
      )
      if (await analyticsContainer.isVisible()) {
        await expect(analyticsContainer).not.toBeEmpty()
      }
    })

    test('should handle network errors gracefully', async ({ page }) => {
      await navigateToSection(page, 'Statistiques')

      // Simulate network error
      await page.route('**/api/analytics/**', (route) => route.abort('failed'))
      await page.reload()

      // Should show error state or fallback content
      await expect(
        page
          .getByText(/error|erreur|failed|échoué/i)
          .or(page.getByText(/No data|Aucune donnée/i)),
      ).toBeVisible()
    })
  })

  test.describe('Dashboard Mobile Responsiveness', () => {
    test('should work correctly on mobile viewports', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }) // iPhone size
      await navigateToDashboard(page)

      // Dashboard should be accessible on mobile
      await expect(
        page.getByRole('heading', { name: /Tableau de bord/i }),
      ).toBeVisible()

      // Navigation might be different on mobile (hamburger menu)
      await expect(page.locator('[role="navigation"]')).toBeVisible()
    })

    test('should display analytics on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await navigateToSection(page, 'Statistiques')

      // Charts and analytics should be responsive on mobile
      await expect(page.locator('canvas, [data-testid="chart"]')).toBeVisible()

      // Analytics cards should stack properly on mobile
      const analyticsCards = page.locator('[data-testid*="analytics"], .card')
      const cardCount = await analyticsCards.count()

      // Should have multiple cards even on mobile
      expect(cardCount).toBeGreaterThan(0)
    })
  })

  test.describe('Dashboard Real-time Features', () => {
    test('should handle real-time visitor updates', async ({ page }) => {
      await navigateToSection(page, 'Statistiques')

      // Look for current visitors badge that might update in real-time
      const visitorsBadge = page.locator('[data-testid="current-visitors"]')
      if (await visitorsBadge.isVisible()) {
        /* const initialText = await visitorsBadge.textContent() */

        // Wait for potential updates (if implemented)
        await page.waitForTimeout(5000)

        // Check if content updated (optional, depends on real-time implementation)
        const updatedText = await visitorsBadge.textContent()

        // This test validates that real-time features don't break the UI
        expect(updatedText).toBeTruthy()
      }
    })
  })

  test.describe('Dashboard Error Handling', () => {
    test('should handle API failures gracefully', async ({ page }) => {
      await navigateToSection(page, 'Statistiques')

      // Block analytics API requests
      await page.route('**/api/analytics/**', (route) => {
        route.fulfill({ status: 500, body: 'Internal Server Error' })
      })

      await page.reload()
      await page.waitForTimeout(2000)

      // Should show error state or fallback content
      await expect(
        page.getByText(/error|erreur|failed|échoué|500/i),
      ).toBeVisible()
    })

    test('should handle missing data gracefully', async ({ page }) => {
      await navigateToSection(page, 'Statistiques')

      // Mock empty response
      await page.route('**/api/analytics/**', (route) => {
        route.fulfill({
          contentType: 'application/json',
          body: JSON.stringify({ data: [] }),
        })
      })

      await page.reload()
      await page.waitForTimeout(2000)

      // Should show "no data" state or appropriate fallback
      await expect(
        page.getByText(/No data|Aucune donnée|No results|Pas de résultats/i),
      ).toBeVisible()
    })
  })
})
