import { test, expect } from '@playwright/test'
import { TEST_USERS } from './fixtures/auth-fixtures'

async function navigateToDashboard(page: any) {
  await page.goto('/fr/dashboard')
  await page.waitForLoadState('networkidle')
}

async function navigateToUsers(page: any) {
  await navigateToDashboard(page)
  const usersButton = page.getByRole('button', { name: 'Utilisateurs' })
  if (await usersButton.isVisible()) {
    await usersButton.click()
    await page.waitForLoadState('networkidle')
  }
}

test.describe('User Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login first to access dashboard
    await page.goto('/fr/connexion')
    await page
      .getByLabel('Code Massar')
      .fill(TEST_USERS.VALID_USER.cdm)
    await page
      .getByRole('textbox', { name: 'Mot de passe' })
      .fill(TEST_USERS.VALID_USER.password)
    await page.getByRole('button', { name: 'Se connecter' }).first().click()

    // Wait for redirect to syllabus first
    await page.waitForURL(/syllabus|dashboard/, { timeout: 10000 })
  })

  test.describe('Users Page Navigation', () => {
    test('should navigate to users management page', async ({ page }) => {
      await navigateToUsers(page)
      await expect(page).toHaveURL(/users/)
    })

    test('should display page header and action buttons', async ({ page }) => {
      await navigateToUsers(page)

      // Check for page header
      await expect(
        page.getByRole('heading', { name: /utilisateurs|users/i }),
      ).toBeVisible()

      // Check for action buttons
      await expect(
        page.getByRole('button', { name: /add|ajouter|create/i }),
      ).toBeVisible()
    })

    test('should load users table', async ({ page }) => {
      await navigateToUsers(page)
      await page.waitForLoadState('networkidle')

      // Check for table elements
      await expect(page.locator('table')).toBeVisible()
    })
  })

  test.describe('Users Table Functionality', () => {
    test('should display users data in table', async ({ page }) => {
      await navigateToUsers(page)
      await page.waitForLoadState('networkidle')

      // Check for table rows
      await expect(page.locator('tbody tr')).toHaveCount(1)
    })

    test('should allow row selection', async ({ page }) => {
      await navigateToUsers(page)
      await page.waitForLoadState('networkidle')

      // Try to select a row
      const firstRow = page.locator('tbody tr').first()
      await firstRow.click()

      // Should show selection state
      await expect(firstRow).toHaveClass(/selected|active/)
    })

    test('should support select all functionality', async ({ page }) => {
      await navigateToUsers(page)
      await page.waitForLoadState('networkidle')

      // Look for select all checkbox
      const selectAllCheckbox = page.locator('thead input[type="checkbox"]')
      if (await selectAllCheckbox.isVisible()) {
        await selectAllCheckbox.click()
        // All rows should be selected
        await expect(page.locator('tbody tr')).toHaveClass(/selected/)
      }
    })
  })

  test.describe('User CRUD Operations', () => {
    test('should open add user dialog', async ({ page }) => {
      await navigateToUsers(page)

      // Click add user button
      const addButton = page.getByRole('button', { name: /add|ajouter/i })
      if (await addButton.isVisible()) {
        await addButton.click()

        // Should open dialog
        await expect(page.locator('[role="dialog"]')).toBeVisible()
      }
    })
  })
})