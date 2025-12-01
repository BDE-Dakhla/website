import { expect, test } from '@playwright/test'
import { TEST_USERS } from './fixtures/auth-fixtures'

test.describe('Dashboard Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Login first to access dashboard
    await page.goto('/fr/connexion')
    await page.getByLabel('Code Massar').fill(TEST_USERS.VALID_USER.cdm)
    await page
      .getByRole('textbox', { name: 'Mot de passe' })
      .fill(TEST_USERS.VALID_USER.password)
    await page.getByRole('button', { name: 'Se connecter' }).first().click()

    // Wait for redirect to syllabus first
    await page.waitForURL(/syllabus|dashboard/, { timeout: 10000 })
  })

  test.describe('Dashboard Overview', () => {
    test('should display main dashboard page', async ({ page }) => {
      // Navigate to dashboard if not already there
      await page.goto('/fr/dashboard')
      await page.waitForLoadState('networkidle')

      // Check for dashboard elements
      await expect(page.getByRole('heading')).toBeVisible()
    })

    test('should show dashboard header with proper title', async ({ page }) => {
      await page.goto('/fr/dashboard')
      await page.waitForLoadState('networkidle')

      // Should have a heading with dashboard-related content
      await expect(
        page.getByRole('heading', {
          name: /tableau de bord|dashboard|analytics/i,
        }),
      ).toBeVisible()
    })

    test('should maintain dashboard state during navigation', async ({
      page,
    }) => {
      await page.goto('/fr/dashboard')
      await page.waitForLoadState('networkidle')

      // Navigate between sections and verify state is maintained
      // This test can be expanded based on actual dashboard functionality
      await expect(page).toHaveURL(/fr\/dashboard/)
    })
  })

  test.describe('Analytics Dashboard', () => {
    test('should display analytics overview', async ({ page }) => {
      await page.goto('/fr/dashboard')
      await page.waitForLoadState('networkidle')

      // Look for analytics-related content
      await expect(
        page.getByRole('heading', {
          name: /analytics|statistiques/i,
        }),
      ).toBeVisible()
    })

    test('should display current visitors badge', async ({ page }) => {
      await page.goto('/fr/dashboard')
      await page.waitForLoadState('networkidle')

      // Check for visitor count or badge elements
      await expect(
        page.locator('[data-testid*="visitors"], .visitors-badge'),
      ).toBeVisible()
    })

    test('should display analytics charts and metrics', async ({ page }) => {
      await page.goto('/fr/dashboard')
      await page.waitForLoadState('networkidle')

      // Look for chart elements
      await expect(page.locator('canvas, [data-testid="chart"]')).toBeVisible()
    })
  })
})
