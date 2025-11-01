import type { Page } from '@playwright/test'

export interface NavMenuItem {
  title: string
  url: string
  selector: string
  group?: string
}

export interface DashboardSection {
  title: string
  url: string
  sidebarSelector: string
  group: string
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

export const DASHBOARD_SECTIONS: DashboardSection[] = [
  {
    title: 'Dashboard Overview',
    url: '/fr/dashboard',
    sidebarSelector: '[data-testid="sidebar-dashboard"]',
    group: 'main',
  },
  {
    title: 'Analytics',
    url: '/fr/dashboard/analytics',
    sidebarSelector: '[data-testid="sidebar-analytics"]',
    group: 'overview',
  },
  {
    title: 'Users',
    url: '/fr/dashboard/users',
    sidebarSelector: '[data-testid="sidebar-users"]',
    group: 'user-management',
  },
  {
    title: 'Partners',
    url: '/fr/dashboard/partners',
    sidebarSelector: '[data-testid="sidebar-partners"]',
    group: 'partnerships',
  },
]

// Navigation helper functions
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

export function getURLWithParams(
  baseUrl: string,
  params: Record<string, string>,
) {
  const url = new URL(baseUrl)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  return url.toString()
}

// Test data for user management
export interface TestUserData {
  cdm: string
  name: string
  email: string
  role: string
  permissions?: string[]
}

export const TEST_USER_CREDENTIALS = {
  VALID_USER: {
    cdm: 'R142002537',
    password: 'password123',
  },
  INVALID_USER: {
    cdm: 'R000000000',
    password: 'wrongpassword',
  },
}

export const SAMPLE_USERS: TestUserData[] = [
  {
    cdm: 'R123456789',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'admin',
    permissions: ['HAS_ACCESS_TO_DASHBOARD', 'SYSTEM_ADMIN'],
  },
  {
    cdm: 'R987654321',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'user',
    permissions: ['HAS_ACCESS_TO_DASHBOARD'],
  },
  {
    cdm: 'R555666777',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: 'manager',
    permissions: ['HAS_ACCESS_TO_DASHBOARD', 'MANAGE_USERS'],
  },
]

// Permission-based visibility helpers
export function getMenuItemsByGroup(group: string): NavMenuItem[] {
  return NAVIGATION_ITEMS.filter((item) => item.group === group)
}

export function getItemsForPermission(permission: string): NavMenuItem[] {
  // Map permissions to visible menu items
  const permissionMap: Record<string, string[]> = {
    HAS_ACCESS_TO_DASHBOARD: [
      'main',
      'overview',
      'user-management',
      'events',
      'content',
      'partnerships',
      'newsletter',
    ],
    SYSTEM_ADMIN: ['administration'],
  }

  const allowedGroups = permissionMap[permission] || []
  return NAVIGATION_ITEMS.filter((item) =>
    allowedGroups.includes(item.group || ''),
  )
}

// URL validation helpers
export function validateURLPattern(
  actualUrl: string,
  expectedPattern: string | RegExp,
): boolean {
  if (typeof expectedPattern === 'string') {
    return actualUrl.includes(expectedPattern)
  }
  return expectedPattern.test(actualUrl)
}

export function getExpectedURL(
  locale: string,
  path: string,
  params?: Record<string, string>,
): string {
  let url = `http://localhost:3000/${locale}${path}`
  if (params) {
    const searchParams = new URLSearchParams(params)
    url += `?${searchParams.toString()}`
  }
  return url
}
