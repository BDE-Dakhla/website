import { test as base, expect, type Page } from '@playwright/test'

export interface TestUser {
  cdm: string
  password: string
  name: string
  email: string
}

export const TEST_USERS = {
  VALID_USER: {
    cdm: 'R142002537',
    password: 'password123',
    name: 'Test User',
    email: 'test@example.com',
  } as TestUser,

  INVALID_USER: {
    cdm: 'R000000000',
    password: 'wrongpassword',
    name: 'Invalid User',
    email: 'invalid@example.com',
  } as TestUser,

  SHORT_CDM: {
    cdm: 'R123',
    password: 'password123',
    name: 'Short CDM User',
    email: 'short@example.com',
  } as TestUser,

  MALFORMED_CDM: {
    cdm: 'ABC123',
    password: 'password123',
    name: 'Malformed CDM User',
    email: 'malformed@example.com',
  } as TestUser,
}

export interface AppFixtures {
  testUser: TestUser
  page: Page
}

export const test = base.extend<AppFixtures>({
  testUser: async ({}, use) => {
    // Provide a valid test user
    await use(TEST_USERS.VALID_USER)
  },

  page: async ({ page }, use) => {
    // Setup page with common configurations
    await page.addInitScript(() => {
      // Disable animations for consistent testing
      const style = document.createElement('style')
      style.innerHTML = `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-delay: 0.01ms !important;
          transition-duration: 0.01ms !important;
          transition-delay: 0.01ms !important;
        }
      `
      document.head.appendChild(style)
    })

    await use(page)
  },
})

// Helper functions for common test operations
export async function fillLoginForm(page: Page, user: TestUser) {
  await page.getByLabel('Code Massar').fill(user.cdm)
  await page.getByLabel('Mot de passe').fill(user.password)
}

export async function submitLoginForm(page: Page) {
  await page.getByRole('button', { name: /se connecter/i }).click()
}

export async function expectLoginError(page: Page) {
  await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 10000 })
}

export async function expectSuccessfulLogin(
  page: Page,
  redirectPath: string = '/fr/syllabus',
) {
  await page.waitForURL(`**${redirectPath}**`, { timeout: 10000 })
}
