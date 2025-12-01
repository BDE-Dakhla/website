import type { Page } from '@playwright/test'

export interface NavMenuItem {
  title: string
  url: string
  selector: string
  group?: string
}

// Navigation test data and helpers
export const NAVIGATION_ITEMS: NavMenuItem[] = [
  // Main dashboard navigation
  {
    title: 'Dashboard',
    url: '/fr/dashboard',
    selector: '[data-testid="sidebar-dashboard"]',
    group: 'main',
  },
  {
    title: 'Statistiques',
    url: '/fr/dashboard/analytics',
    selector: '[data-testid="sidebar-analytics"]',
    group: 'overview',
  },

  // User management
  {
    title: 'Utilisateurs',
    url: '/fr/dashboard/users',
    selector: '[data-testid="sidebar-users"]',
    group: 'user-management',
  },

  // Events & Activities
  {
    title: 'Événements',
    url: '/fr/dashboard/events',
    selector: '[data-testid="sidebar-events"]',
    group: 'events',
  },
  {
    title: 'Tickets',
    url: '/fr/dashboard/tickets',
    selector: '[data-testid="sidebar-tickets"]',
    group: 'events',
  },
  {
    title: 'Annonces',
    url: '/fr/dashboard/announcements',
    selector: '[data-testid="sidebar-announcements"]',
    group: 'events',
  },

  // Content & Resources
  {
    title: 'Documents',
    url: '/fr/dashboard/files',
    selector: '[data-testid="sidebar-files"]',
    group: 'content',
  },
  {
    title: 'Contacts',
    url: '/fr/dashboard/contacts',
    selector: '[data-testid="sidebar-contacts"]',
    group: 'content',
  },

  // Partnerships
  {
    title: 'Sponsors & Partenaires',
    url: '/fr/dashboard/partners',
    selector: '[data-testid="sidebar-partners"]',
    group: 'partnerships',
  },

  // Newsletter
  {
    title: 'Boîte de Réception',
    url: '/fr/dashboard/newsletter/inbox',
    selector: '[data-testid="sidebar-newsletter-inbox"]',
    group: 'newsletter',
  },
  {
    title: 'Abonnés',
    url: '/fr/dashboard/newsletter/subscribers',
    selector: '[data-testid="sidebar-newsletter-subscribers"]',
    group: 'newsletter',
  },
  {
    title: 'Campagnes',
    url: '/fr/dashboard/newsletter/campaigns',
    selector: '[data-testid="sidebar-newsletter-campaigns"]',
    group: 'newsletter',
  },
]

/** Navigation helper functions */

export async function navigateToSection(page: Page, sectionTitle: string) {
  const section = NAVIGATION_ITEMS.find((item) => item.title === sectionTitle)
  if (!section || !section.selector) {
    throw new Error(
      `Navigation section "${sectionTitle}" not found or has no selector`,
    )
  }

  await page.click(section.selector)
  await page.waitForURL(section.url)
  return section
}

export async function navigateToDashboard(page: Page) {
  await page.goto('/fr/dashboard')
  await page.waitForLoadState('networkidle')
  return page.url()
}

export async function navigateToUsers(page: Page) {
  await navigateToSection(page, 'Utilisateurs')
  await page.waitForLoadState('networkidle')
  return page.url()
}
