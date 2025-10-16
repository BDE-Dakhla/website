import { expect, test } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/connexion')
    
    await expect(page.locator('h2')).toContainText('BIENVENUE')
    await expect(page.getByLabel('Code Massar')).toBeVisible()
    await expect(page.getByLabel('Mot de passe')).toBeVisible()
    await expect(page.getByRole('button', { name: /se connecter/i })).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/connexion')
    
    await page.getByLabel('Code Massar').fill('R000000000')
    await page.getByLabel('Mot de passe').fill('wrongpassword')
    await page.getByRole('button', { name: /se connecter/i }).click()
    
    // Wait for error message
    await expect(page.locator('[role="alert"], .text-red-600, .text-red-700')).toBeVisible()
  })

  test('should validate Code Massar format', async ({ page }) => {
    await page.goto('/connexion')
    
    await page.getByLabel('Code Massar').fill('invalid')
    await page.getByLabel('Mot de passe').fill('password123')
    await page.getByRole('button', { name: /se connecter/i }).click()
    
    // Should show validation error
    await expect(page.locator('text=/code massar/i')).toBeVisible()
  })

  test('should require both fields', async ({ page }) => {
    await page.goto('/connexion')
    
    await page.getByRole('button', { name: /se connecter/i }).click()
    
    // Browser validation should prevent submission
    const cdmInput = page.getByLabel('Code Massar')
    await expect(cdmInput).toHaveAttribute('required', '')
  })

  test('should have Google sign-in option', async ({ page }) => {
    await page.goto('/connexion')
    
    await expect(page.getByRole('button', { name: /se connecter avec google/i })).toBeVisible()
  })

  test('should have remember me checkbox', async ({ page }) => {
    await page.goto('/connexion')
    
    await expect(page.getByText(/se souvenir de moi/i)).toBeVisible()
  })

  test('should have signup link', async ({ page }) => {
    await page.goto('/connexion')
    
    const signupLink = page.getByRole('link', { name: /inscrivez-vous ici/i })
    await expect(signupLink).toBeVisible()
    await expect(signupLink).toHaveAttribute('href', '/inscription')
  })
})
