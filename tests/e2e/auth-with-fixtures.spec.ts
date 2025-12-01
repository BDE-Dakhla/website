import { expect, test } from '@playwright/test'
import { TEST_USERS } from './fixtures/auth-fixtures'

test.describe('Authentication with Fixtures', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fr/connexion')
  })

  test('should reject invalid credentials', async ({ page }) => {
    // Use invalid user from fixtures
    await page.getByLabel('Code Massar').fill(TEST_USERS.INVALID_USER.cdm)
    await page
      .getByRole('textbox', { name: 'Mot de passe' })
      .fill(TEST_USERS.INVALID_USER.password)
    await page.getByRole('button', { name: 'Se connecter' }).first().click()

    await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 10000 })
  })

  test('should validate CDM format - too short', async ({ page }) => {
    await page.getByLabel('Code Massar').fill(TEST_USERS.SHORT_CDM.cdm)
    await page.getByRole('button', { name: 'Se connecter' }).first().click()

    // Should show validation error for invalid CDM format
    await expect(page.getByText(/format.*valide/i)).toBeVisible()
  })

  test('should validate CDM format - wrong pattern', async ({ page }) => {
    await page.getByLabel('Code Massar').fill(TEST_USERS.MALFORMED_CDM.cdm)
    await page.getByRole('button', { name: 'Se connecter' }).first().click()

    // Should show validation error for invalid CDM format
    await expect(page.getByText(/format.*valide/i)).toBeVisible()
  })
})
