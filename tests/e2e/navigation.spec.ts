import { expect, type Page, test } from '@playwright/test'
import { TEST_USERS } from './fixtures/auth-fixtures'

async function navigateToDashboard(page: Page) {
  await page.goto('/fr/dashboard')
  await page.waitForLoadState('networkidle')
}

async function navigateToSection(page: Page, sectionName: string) {
  const sectionButton = page.getByRole('button', { name: sectionName })
  if (await sectionButton.isVisible()) {
    await sectionButton.click()
    await page.waitForLoadState('networkidle')
  }
}

test.describe('Navigation & Core Routing', () => {
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

  test.describe('Dashboard Navigation', () => {
    test('should navigate to main dashboard sections', async ({ page }) => {
      await navigateToDashboard(page)

      // Navigate to different sections
      await navigateToSection(page, 'Analytics')
      await navigateToSection(page, 'Utilisateurs')
      await navigateToSection(page, 'Partners')

      // Should be able to navigate between sections
      await expect(page).toHaveURL(/\/fr\/dashboard\//)
    })

    test('should navigate to analytics section', async ({ page }) => {
      await navigateToSection(page, 'Analytics')
      await expect(page).toHaveURL(/analytics/i)
    })

    test('should navigate to user management section', async ({ page }) => {
      await navigateToSection(page, 'Utilisateurs')
      await expect(page).toHaveURL(/users/i)
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
  })
})
