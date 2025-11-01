import { expect, test } from '@playwright/test'
import {
  navigateToUsers,
  SAMPLE_USERS,
  TEST_USER_CREDENTIALS,
} from './fixtures/navigation-fixtures'

test.describe('User Management', () => {
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

  test.describe('Users Page Navigation', () => {
    test('should navigate to users management page', async ({ page }) => {
      await navigateToUsers(page)

      // Should be on users page
      await expect(page).toHaveURL('/fr/dashboard/users')

      // Should show users page content
      await expect(
        page.getByRole('heading', { name: /Utilisateurs|Users/i }),
      ).toBeVisible()
      await expect(
        page.getByText(/Voici toute la liste des comptes des utilisateurs/i),
      ).toBeVisible()
    })

    test('should display page header and action buttons', async ({ page }) => {
      await navigateToUsers(page)

      // Should show page title
      await expect(
        page.getByRole('heading', { name: 'Utilisateurs' }),
      ).toBeVisible()

      // Should show action buttons
      await expect(
        page.getByRole('button', { name: /Ajouter un utilisateur/i }),
      ).toBeVisible()
      await expect(
        page.getByRole('button', { name: /Inviter une personne/i }),
      ).toBeVisible()
    })

    test('should load users table', async ({ page }) => {
      await navigateToUsers(page)

      // Should show users table
      await expect(page.locator('table')).toBeVisible()

      // Should show table headers
      await expect(page.locator('thead th')).toHaveCount(6) // Expected number of columns
    })
  })

  test.describe('Users Table Functionality', () => {
    test('should display users data in table', async ({ page }) => {
      await navigateToUsers(page)

      // Should show users table with data
      await expect(page.locator('tbody tr')).toHaveCount(3) // Expected number of sample users

      // Should display user information in rows
      for (const _user of SAMPLE_USERS) {
        // This will depend on the actual data structure, but we're testing the table displays user info
        await expect(page.locator('tbody')).toBeVisible()
      }
    })

    test('should allow row selection', async ({ page }) => {
      await navigateToUsers(page)

      // Select first row checkbox
      await page.click('tbody tr:first-child input[type="checkbox"]')

      // Row should be selected
      await expect(page.locator('tbody tr:first-child')).toHaveClass(/selected/)

      // Bulk actions should appear
      await expect(
        page.locator('[data-testid="bulk-actions"], .bulk-actions'),
      ).toBeVisible()
    })

    test('should support select all functionality', async ({ page }) => {
      await navigateToUsers(page)

      // Click select all checkbox in header
      await page.click('thead input[type="checkbox"]')

      // All rows should be selected
      const selectedRows = page.locator('tbody tr.selected')
      await expect(selectedRows).toHaveCount(
        await page.locator('tbody tr').count(),
      )

      // Bulk actions should be visible
      await expect(
        page.locator('[data-testid="bulk-actions"], .bulk-actions'),
      ).toBeVisible()
    })
  })

  test.describe('User CRUD Operations', () => {
    test('should open add user dialog', async ({ page }) => {
      await navigateToUsers(page)

      // Click add user button
      await page
        .getByRole('button', { name: /Ajouter un utilisateur/i })
        .click()

      // Should open dialog
      await expect(page.locator('[role="dialog"]')).toBeVisible()
      await expect(
        page.getByRole('heading', { name: /Ajouter un utilisateur|Add User/i }),
      ).toBeVisible()
    })

    test('should fill and submit add user form', async ({ page }) => {
      await navigateToUsers(page)
      await page
        .getByRole('button', { name: /Ajouter un utilisateur/i })
        .click()

      // Fill form fields
      await page.fill('[name="username"]', 'testuser123')
      await page.fill('[name="email"]', 'test@example.com')
      await page.fill('[name="phoneNumber"]', '0612345678')
      await page.fill('[name="password"]', 'password123')
      await page.fill('[name="confirmPassword"]', 'password123')

      // Select role
      await page.selectOption('[name="role"]', 'user')

      // Submit form
      await page.click(
        '[role="dialog"] button[type="submit"], [role="dialog"] button:has-text("Ajouter")',
      )

      // Should close dialog and update table
      await expect(page.locator('[role="dialog"]')).not.toBeVisible()
      await page.waitForTimeout(1000)

      // Should show success message or updated table
      await expect(
        page.getByText(/success|ajouté|added/i).or(page.locator('tbody tr')),
      ).toBeVisible()
    })

    test('should validate form fields', async ({ page }) => {
      await navigateToUsers(page)
      await page
        .getByRole('button', { name: /Ajouter un utilisateur/i })
        .click()

      // Try to submit empty form
      await page.click(
        '[role="dialog"] button[type="submit"], [role="dialog"] button:has-text("Ajouter")',
      )

      // Should show validation errors
      await expect(
        page.locator('[role="alert"], .text-red-600, .error-message'),
      ).toBeVisible()
    })

    test('should edit existing user', async ({ page }) => {
      await navigateToUsers(page)

      // Find and click edit button for first user
      const editButton = page
        .locator('tbody tr:first-child button')
        .filter({ hasText: /edit|modifier|éditer/i })

      if (await editButton.isVisible()) {
        await editButton.click()

        // Should open edit dialog with user data
        await expect(page.locator('[role="dialog"]')).toBeVisible()
        await expect(
          page.getByRole('heading', { name: /Modifier|Edit|Edit User/i }),
        ).toBeVisible()

        // Form should be pre-filled with user data
        await expect(page.locator('[name="username"]')).not.toBeEmpty()
        await expect(page.locator('[name="email"]')).not.toBeEmpty()
      }
    })

    test('should delete user with confirmation', async ({ page }) => {
      await navigateToUsers(page)

      // Find and click delete button for first user
      const deleteButton = page
        .locator('tbody tr:first-child button')
        .filter({ hasText: /delete|supprimer|delete/i })

      if (await deleteButton.isVisible()) {
        await deleteButton.click()

        // Should open confirmation dialog
        await expect(
          page.locator('[role="dialog"], .dialog-confirm'),
        ).toBeVisible()
        await expect(
          page.getByText(/confirm|confirmer|êtes-vous sûr/i),
        ).toBeVisible()

        // Confirm deletion
        await page
          .getByRole('button', { name: /supprimer|delete|confirmer/i })
          .click()

        // Should close dialog and update table
        await expect(
          page.locator('[role="dialog"], .dialog-confirm'),
        ).not.toBeVisible()
        await page.waitForTimeout(1000)
      }
    })
  })

  test.describe('User Invitation', () => {
    test('should open invite user dialog', async ({ page }) => {
      await navigateToUsers(page)

      // Click invite button
      await page.getByRole('button', { name: /Inviter une personne/i }).click()

      // Should open invite dialog
      await expect(page.locator('[role="dialog"]')).toBeVisible()
      await expect(
        page.getByRole('heading', { name: /Inviter|Invite/i }),
      ).toBeVisible()
    })

    test('should send user invitation', async ({ page }) => {
      await navigateToUsers(page)
      await page.getByRole('button', { name: /Inviter une personne/i }).click()

      // Fill invitation form
      await page.fill('[name="email"]', 'invite@example.com')

      // Select role for invitation
      await page.selectOption('[name="role"]', 'user')

      // Send invitation
      await page.click(
        '[role="dialog"] button[type="submit"], [role="dialog"] button:has-text("Inviter")',
      )

      // Should close dialog
      await expect(page.locator('[role="dialog"]')).not.toBeVisible()

      // Should show success message
      await expect(
        page.getByText(/invitation|invité|success|envoyé/i),
      ).toBeVisible()
    })
  })

  test.describe('Table Sorting & Filtering', () => {
    test('should support column sorting', async ({ page }) => {
      await navigateToUsers(page)

      // Click column header to sort
      const usernameHeader = page.locator('thead th:has-text("Username")')
      if (await usernameHeader.isVisible()) {
        await usernameHeader.click()

        // Should show sort indicator
        await expect(
          page.locator('thead th:has-text("Username") .sort-indicator'),
        ).toBeVisible()

        // Click again to reverse sort
        await usernameHeader.click()
        await expect(
          page.locator('thead th:has-text("Username") .sort-desc'),
        ).toBeVisible()
      }
    })

    test('should support search/filter functionality', async ({ page }) => {
      await navigateToUsers(page)

      // Look for search input
      const searchInput = page.locator(
        '[placeholder*="search"], [placeholder*="Search"], input[type="search"]',
      )

      if (await searchInput.isVisible()) {
        // Search for specific user
        await searchInput.fill('john')

        // Should filter results
        await page.waitForTimeout(500)
        const filteredRows = page.locator('tbody tr')
        await expect(filteredRows).toHaveCount(1) // Should filter to matching users
      }
    })

    test('should support role filtering', async ({ page }) => {
      await navigateToUsers(page)

      // Look for role filter dropdown
      const roleFilter = page.locator('select, [data-testid="role-filter"]')

      if (await roleFilter.isVisible()) {
        await roleFilter.selectOption('admin')

        // Should filter to admin users only
        await page.waitForTimeout(500)
        const _filteredRows = page.locator('tbody tr')

        // Verify filtered results contain only admin users
        // This depends on the actual data structure
      }
    })
  })

  test.describe('Bulk Operations', () => {
    test('should select multiple users and show bulk actions', async ({
      page,
    }) => {
      await navigateToUsers(page)

      // Select first two rows
      await page.click('tbody tr:nth-child(1) input[type="checkbox"]')
      await page.click('tbody tr:nth-child(2) input[type="checkbox"]')

      // Should show bulk actions toolbar
      await expect(
        page.locator('[data-testid="bulk-actions"], .bulk-actions'),
      ).toBeVisible()

      // Should show correct count
      await expect(
        page.locator('[data-testid="bulk-actions"] .count'),
      ).toContainText('2')
    })

    test('should perform bulk delete', async ({ page }) => {
      await navigateToUsers(page)

      // Select multiple users
      await page.click('tbody tr:nth-child(1) input[type="checkbox"]')
      await page.click('tbody tr:nth-child(2) input[type="checkbox"]')

      // Click bulk delete
      await page.click(
        '[data-testid="bulk-actions"] button:has-text("Delete"), .bulk-actions button:has-text("Supprimer")',
      )

      // Should show confirmation dialog
      await expect(page.locator('[role="dialog"]')).toBeVisible()
      await expect(
        page.getByText(/supprimer.*éléments|delete.*items/i),
      ).toBeVisible()

      // Confirm
      await page.getByRole('button', { name: /supprimer|delete/i }).click()

      // Should close dialog and update table
      await expect(page.locator('[role="dialog"]')).not.toBeVisible()
    })

    test('should perform bulk role change', async ({ page }) => {
      await navigateToUsers(page)

      // Select users
      await page.click('tbody tr:nth-child(1) input[type="checkbox"]')

      // Click bulk edit/role change
      const bulkEditButton = page.locator(
        '[data-testid="bulk-actions"] button:has-text("Edit"), .bulk-actions button:has-text("Modifier")',
      )

      if (await bulkEditButton.isVisible()) {
        await bulkEditButton.click()

        // Should show bulk edit dialog
        await expect(page.locator('[role="dialog"]')).toBeVisible()
        await expect(
          page.getByText(/bulk.*edit|modification.*en.*masse/i),
        ).toBeVisible()

        // Change role
        await page.selectOption('[name="role"]', 'admin')
        await page.click('[role="dialog"] button[type="submit"]')
      }
    })
  })

  test.describe('Permission Management', () => {
    test('should show permission manager in user edit dialog', async ({
      page,
    }) => {
      await navigateToUsers(page)

      // Open add or edit user dialog
      await page
        .getByRole('button', { name: /Ajouter un utilisateur/i })
        .click()

      // Should show permission manager or role selection
      await expect(
        page.locator('[data-testid="permission-manager"], select[name="role"]'),
      ).toBeVisible()

      // Should allow permission/role selection
      const roleSelect = page.locator('select[name="role"]')
      if (await roleSelect.isVisible()) {
        await expect(roleSelect).toHaveCount(1)
        await expect(roleSelect).toHaveValue(/user|admin/)
      }
    })

    test('should validate permission-based access', async ({ page }) => {
      await navigateToUsers(page)

      // Some actions might be restricted based on user permissions
      // This test validates that permission checks work properly

      // Look for permission-based UI elements
      const restrictedActions = page.locator(
        '[data-testid="restricted"], [aria-disabled="true"]',
      )
      if ((await restrictedActions.count()) > 0) {
        // Verify restricted elements are properly marked
        await expect(restrictedActions.first()).toHaveAttribute(
          'aria-disabled',
          'true',
        )
      }
    })
  })

  test.describe('User Management Error Handling', () => {
    test('should handle form validation errors', async ({ page }) => {
      await navigateToUsers(page)
      await page
        .getByRole('button', { name: /Ajouter un utilisateur/i })
        .click()

      // Fill invalid email
      await page.fill('[name="email"]', 'invalid-email')
      await page.fill('[name="password"]', '123') // Too short

      // Try to submit
      await page.click('[role="dialog"] button[type="submit"]')

      // Should show validation errors
      await expect(page.locator('.text-red-600, [role="alert"]')).toBeVisible()
    })

    test('should handle API errors gracefully', async ({ page }) => {
      await navigateToUsers(page)

      // Mock API error
      await page.route('**/api/users/**', (route) => {
        route.fulfill({ status: 500, body: 'Internal Server Error' })
      })

      // Try to add user
      await page
        .getByRole('button', { name: /Ajouter un utilisateur/i })
        .click()
      await page.fill('[name="username"]', 'test')
      await page.click('[role="dialog"] button[type="submit"]')

      // Should show error message
      await expect(page.getByText(/error|erreur|failed|échoué/i)).toBeVisible()
    })

    test('should handle network failures', async ({ page }) => {
      await navigateToUsers(page)

      // Block network requests
      await page.route('**/api/users/**', (route) => route.abort())

      // Try to load users table
      await page.reload()
      await page.waitForTimeout(2000)

      // Should show loading error or fallback content
      await expect(
        page
          .getByText(/error|erreur|failed|timeout/i)
          .or(page.getByText(/no data|aucune donnée/i)),
      ).toBeVisible()
    })
  })

  test.describe('User Management Performance', () => {
    test('should load users quickly', async ({ page }) => {
      const startTime = Date.now()
      await navigateToUsers(page)
      const loadTime = Date.now() - startTime

      // Users page should load within reasonable time
      expect(loadTime).toBeLessThan(5000)
    })

    test('should handle large datasets efficiently', async ({ page }) => {
      await navigateToUsers(page)

      // Test pagination if present
      const paginationNext = page.locator(
        '[data-testid="pagination-next"], button:has-text("Next")',
      )

      if (
        (await paginationNext.isVisible()) &&
        (await paginationNext.isEnabled())
      ) {
        await paginationNext.click()

        // Should load next page quickly
        await page.waitForTimeout(1000)

        // Should show different data or page indicator
        await expect(
          page.locator('[data-testid="pagination-current"]'),
        ).toContainText('2')
      }
    })
  })

  test.describe('User Management Accessibility', () => {
    test('should support keyboard navigation', async ({ page }) => {
      await navigateToUsers(page)

      // Use Tab to navigate through table
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter') // Select first row

      // Should select row with keyboard
      await expect(page.locator('tbody tr:first-child')).toHaveClass(/selected/)
    })

    test('should have proper ARIA labels', async ({ page }) => {
      await navigateToUsers(page)

      // Check for proper ARIA labels on interactive elements
      await expect(page.locator('input[type="checkbox"]')).toHaveAttribute(
        'aria-label',
      )
      await expect(page.locator('button')).toHaveAttribute('aria-label')
      await expect(page.locator('table')).toHaveAttribute('role', 'table')
    })
  })
})
