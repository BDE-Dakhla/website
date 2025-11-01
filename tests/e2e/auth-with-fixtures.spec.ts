import { expect, test } from '@playwright/test'

test.describe('Authentication with Fixtures', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fr/connexion')
  })

  test('should reject invalid credentials', async ({ page }) => {
    // Override with invalid user
    const invalidUser = { cdm: 'R000000000', password: 'wrongpass' }

    await page.getByLabel('Code Massar').fill(invalidUser.cdm)
    await page
      .getByRole('textbox', { name: 'Mot de passe' })
      .fill(invalidUser.password)
    await page.getByRole('button', { name: 'Se connecter' }).first().click()

    await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 10000 })
  })

  test('should validate CDM format - too short', async ({ page }) => {
    await page.getByLabel('Code Massar').fill('R123')
    await page
      .getByRole('textbox', { name: 'Mot de passe' })
      .fill('password123')
    await page.getByRole('button', { name: 'Se connecter' }).first().click()

    await expect(page.getByText(/Invalid Code Massar/i)).toBeVisible()
  })

  test('should validate CDM format - wrong pattern', async ({ page }) => {
    await page.getByLabel('Code Massar').fill('ABC123')
    await page
      .getByRole('textbox', { name: 'Mot de passe' })
      .fill('password123')
    await page.getByRole('button', { name: 'Se connecter' }).first().click()

    await expect(page.getByText(/Invalid Code Massar/i)).toBeVisible()
  })
})
