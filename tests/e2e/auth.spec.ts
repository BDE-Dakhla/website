import { expect, test } from '@playwright/test'
import { TEST_USERS } from './fixtures/auth-fixtures'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fr/connexion')
  })

  test('should display login page', async ({ page }) => {
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle')

    // Use more specific selectors with roles and data attributes
    await expect(
      page.getByRole('heading', { name: /BIENVENUE/i }),
    ).toBeVisible()
    await expect(page.getByLabel('Code Massar')).toBeVisible()
    // Use input role and name attribute for password to avoid ambiguity
    await expect(
      page.getByRole('textbox', { name: 'Mot de passe' }),
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Se connecter' }).first(),
    ).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    // Fill the form fields with specific selectors
    await page.getByLabel('Code Massar').fill('R000000000')
    await page
      .getByRole('textbox', { name: 'Mot de passe' })
      .fill('wrongpassword')

    // Click the login button (first one to avoid ambiguity)
    await page.getByRole('button', { name: 'Se connecter' }).first().click()

    // Wait for error message to appear
    await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 10000 })
  })

  test('should validate Code Massar format', async ({ page }) => {
    await page.getByLabel('Code Massar').fill('invalid-format')
    await page.getByRole('button', { name: 'Se connecter' }).first().click()

    // Should show validation error for invalid CDM format
    await expect(page.getByText(/format.*valide/i)).toBeVisible()
  })

  test('should show form validation', async ({ page }) => {
    // Try to submit empty form
    await page.getByRole('button', { name: 'Se connecter' }).first().click()

    // Should show validation errors
    await expect(page.getByText(/obligatoire|requis/i)).toBeVisible()
  })

  test('should have Google sign-in option', async ({ page }) => {
    await expect(page.getByRole('button', { name: /google/i })).toBeVisible()
  })

  test('should have remember me checkbox', async ({ page }) => {
    await expect(page.getByText(/se souvenir/i)).toBeVisible()
  })

  test('should have signup link', async ({ page }) => {
    await expect(
      page.getByRole('link', { name: /inscrivez-vous/i }),
    ).toBeVisible()
  })

  test('should handle password visibility toggle', async ({ page }) => {
    const passwordField = page.getByRole('textbox', { name: 'Mot de passe' })
    const toggleButton = page.getByRole('button', { name: /afficher|masquer/i })

    // Initially password should be hidden
    await expect(passwordField).toHaveAttribute('type', 'password')

    // Click toggle to show password
    await toggleButton.first().click()
    await expect(passwordField).toHaveAttribute('type', 'text')

    // Click toggle again to hide password
    await toggleButton.first().click()
    await expect(passwordField).toHaveAttribute('type', 'password')
  })

  test('should redirect to syllabus after successful login', async ({
    page,
  }) => {
    // Login with valid credentials
    await page.getByLabel('Code Massar').fill(TEST_USERS.VALID_USER.cdm)
    await page
      .getByRole('textbox', { name: 'Mot de passe' })
      .fill(TEST_USERS.VALID_USER.password)

    // Submit form and wait for redirect
    await page.getByRole('button', { name: 'Se connecter' }).first().click()

    // Wait for the redirect to syllabus
    await page.waitForURL(/syllabus|dashboard/, { timeout: 10000 })
  })
})
