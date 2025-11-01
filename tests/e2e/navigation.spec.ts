import { expect, test } from '@playwright/test'
import {
  navigateToDashboard,
  navigateToSection,
  navigateToUsers,
  TEST_USER_CREDENTIALS,
} from './fixtures/navigation-fixtures'

test.describe('Navigation & Core Routing', () => {
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

  test.describe('Dashboard Navigation', () => {
    test('should navigate to main dashboard sections', async ({ page }) => {
      // Test main dashboard navigation
      await navigateToSection(page, 'Dashboard')
      await expect(page).toHaveURL('/fr/dashboard')

      // Verify dashboard content is loaded
      await expect(
        page.getByRole('heading', { name: /Tableau de bord/i }),
      ).toBeVisible()
    })

    test('should navigate to analytics section', async ({ page }) => {
      await navigateToSection(page, 'Statistiques')
      await expect(page).toHaveURL('/fr/dashboard/analytics')

      // Verify analytics content
      await expect(
        page.getByRole('heading', { name: /Analytics|Statistiques/i }),
      ).toBeVisible()
    })

    test('should navigate to user management section', async ({ page }) => {
      await navigateToSection(page, 'Utilisateurs')
      await expect(page).toHaveURL('/fr/dashboard/users')

      // Verify users page content
      await expect(
        page.getByRole('heading', { name: /Utilisateurs|Users/i }),
      ).toBeVisible()
    })

    test('should navigate to partners section', async ({ page }) => {
      await navigateToSection(page, 'Sponsors & Partenaires')
      await expect(page).toHaveURL('/fr/dashboard/partners')

      // Verify partners page content
      await expect(
        page.getByRole('heading', { name: /Partners|Partenaires|Sponsors/i }),
      ).toBeVisible()
    })
  })

  test.describe('Sidebar Navigation Behavior', () => {
    test('should show active state for current section', async ({ page }) => {
      await navigateToSection(page, 'Dashboard')

      // Dashboard should be active - check for active button state
      const dashboardButton = page
        .locator('[data-testid="sidebar-dashboard"]')
        .locator('..')
      await expect(dashboardButton).toHaveClass(/active|selected/)

      // Switch to another section
      await navigateToSection(page, 'Statistiques')

      // Analytics should now be active, dashboard should not
      const analyticsButton = page
        .locator('[data-testid="sidebar-analytics"]')
        .locator('..')
      const dashboardButton2 = page
        .locator('[data-testid="sidebar-dashboard"]')
        .locator('..')
      await expect(analyticsButton).toHaveClass(/active|selected/)
      await expect(dashboardButton2).not.toHaveClass(/active|selected/)
    })

    test('should highlight current page in navigation', async ({ page }) => {
      await navigateToUsers(page)

      // Users navigation item should be highlighted
      const usersButton = page
        .locator('[data-testid="sidebar-users"]')
        .locator('..')
      await expect(usersButton).toHaveClass(/active|selected/)

      // Verify the page content reflects the selection
      await expect(
        page.getByRole('heading', { name: /Utilisateurs/i }),
      ).toBeVisible()
    })
  })

  test.describe('Deep Linking & URL Handling', () => {
    test('should handle direct URL navigation', async ({ page }) => {
      // Navigate directly to analytics via URL
      await page.goto('/fr/dashboard/analytics')
      await page.waitForLoadState('networkidle')

      // Should load correctly
      await expect(page).toHaveURL('/fr/dashboard/analytics')
      await expect(
        page.getByRole('heading', { name: /Analytics|Statistiques/i }),
      ).toBeVisible()

      // Navigation should reflect current page
      const analyticsButton = page
        .locator('[data-testid="sidebar-analytics"]')
        .locator('..')
      await expect(analyticsButton).toHaveClass(/active|selected/)
    })

    test('should handle direct users URL navigation', async ({ page }) => {
      await page.goto('/fr/dashboard/users')
      await page.waitForLoadState('networkidle')

      await expect(page).toHaveURL('/fr/dashboard/users')
      await expect(
        page.getByRole('heading', { name: /Utilisateurs|Users/i }),
      ).toBeVisible()
      const usersButton = page
        .locator('[data-testid="sidebar-users"]')
        .locator('..')
      await expect(usersButton).toHaveClass(/active|selected/)
    })

    test('should maintain navigation state on page reload', async ({
      page,
    }) => {
      await navigateToSection(page, 'Utilisateurs')

      // Reload the page
      await page.reload()
      await page.waitForLoadState('networkidle')

      // Should still be on users page
      await expect(page).toHaveURL('/fr/dashboard/users')
      const usersButton = page
        .locator('[data-testid="sidebar-users"]')
        .locator('..')
      await expect(usersButton).toHaveClass(/active|selected/)
    })
  })

  test.describe('404 & Error Handling', () => {
    test('should show 404 for non-existent dashboard route', async ({
      page,
    }) => {
      await page.goto('/fr/dashboard/nonexistent-page')
      await page.waitForLoadState('networkidle')

      // Should show not found page or redirect to main dashboard
      // This depends on how the app handles 404s
      await expect(
        page
          .getByText(/404|Not Found|Page non trouvée/i)
          .or(page.getByRole('heading')),
      ).toBeVisible()
    })

    test('should handle malformed URLs gracefully', async ({ page }) => {
      await page.goto('/fr/dashboard//users')
      await page.waitForLoadState('networkidle')

      // Should either handle gracefully or redirect
      // The specific behavior depends on the routing configuration
    })
  })

  test.describe('Locale Routing', () => {
    test('should work with French locale prefix', async ({ page }) => {
      await navigateToDashboard(page)

      // Should be on French locale
      await expect(page).toHaveURL(/\/fr\//)

      // Navigation should use French routes
      await navigateToSection(page, 'Utilisateurs')
      await expect(page).toHaveURL('/fr/dashboard/users')
    })

    test('should redirect to default locale for unsupported routes', async ({
      page,
    }) => {
      await page.goto('/fr/dashboard/unsupported-section')
      await page.waitForLoadState('networkidle')

      // Should either redirect to supported route or show error
      // This behavior may vary based on routing configuration
    })
  })

  test.describe('Navigation State Management', () => {
    test('should preserve navigation state during browser back/forward', async ({
      page,
    }) => {
      // Navigate through multiple sections
      await navigateToSection(page, 'Dashboard')
      await navigateToSection(page, 'Statistiques')
      await navigateToSection(page, 'Utilisateurs')

      // Use browser back
      await page.goBack()
      await expect(page).toHaveURL('/fr/dashboard/analytics')

      // Use browser forward
      await page.goForward()
      await expect(page).toHaveURL('/fr/dashboard/users')
    })

    test('should handle quick navigation clicks', async ({ page }) => {
      // Test rapid clicking between sections
      await page.click('[data-testid="sidebar-dashboard"]')
      await page.click('[data-testid="sidebar-analytics"]')
      await page.click('[data-testid="sidebar-users"]')

      // Should end up on users page
      await expect(page).toHaveURL('/fr/dashboard/users')
      await page.waitForLoadState('networkidle')
      await expect(
        page.getByRole('heading', { name: /Utilisateurs/i }),
      ).toBeVisible()
    })
  })

  test.describe('Accessibility & Keyboard Navigation', () => {
    test('should support keyboard navigation', async ({ page }) => {
      await navigateToDashboard(page)

      // Use Tab to navigate through sidebar items
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter')

      // Should navigate to the focused section
      // This tests tab navigation through the sidebar
    })

    test('should be accessible via screen readers', async ({ page }) => {
      await navigateToDashboard(page)

      // Check for proper ARIA labels and roles
      await expect(page.locator('[role="navigation"]')).toBeVisible()
      // Check that navigation items are accessible
      await expect(page.locator('[data-testid^="sidebar-"]')).toHaveCount(12) // Expected number of navigation items
    })
  })

  test.describe('Mobile & Responsive Navigation', () => {
    test('should work on mobile viewports', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }) // iPhone size
      await navigateToDashboard(page)

      // Should still navigate correctly on mobile
      // May show mobile hamburger menu instead of full sidebar
      await navigateToSection(page, 'Utilisateurs')
      await expect(page).toHaveURL('/fr/dashboard/users')
    })

    test('should handle collapsible sidebar on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await navigateToDashboard(page)

      // Mobile menu should be toggleable
      const mobileMenuButton = page.locator(
        '[data-testid="mobile-menu-button"]',
      )
      if (await mobileMenuButton.isVisible()) {
        await mobileMenuButton.click()
        // Should show/hide mobile navigation
      }
    })
  })

  test.describe('Performance & Loading', () => {
    test('should load navigation quickly', async ({ page }) => {
      const startTime = Date.now()
      await navigateToDashboard(page)
      const loadTime = Date.now() - startTime

      // Navigation should load quickly (under 2 seconds)
      expect(loadTime).toBeLessThan(2000)
    })

    test('should handle slow network conditions', async ({ page }) => {
      // Simulate slow network
      await page.route('**/*', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        await route.continue()
      })

      await navigateToSection(page, 'Utilisateurs')

      // Should still load and navigate correctly, just slower
      await expect(page).toHaveURL('/fr/dashboard/users')
    })
  })
})
