import type { PermissionMap } from '@/types/schema'

export function hasPermission(
  perms: PermissionMap | null | undefined,
  key: string,
): boolean {
  return perms?.[key] === 1
}

const APP_PERMISSIONS = {
  HAS_ACCESS_TO_DASHBOARD: {
    key: 'HAS_ACCESS_TO_DASHBOARD',
    name: 'Dashboard Access',
    description: 'Access to the main dashboard interface',
    category: 'Core',
  },

  CAN_READ_DOCS: {
    key: 'CAN_READ_DOCS',
    name: 'Read Documentation',
    description: 'View documentation and guides',
    category: 'Content',
  },

  MANAGE_SPONSORS: {
    key: 'MANAGE_SPONSORS',
    name: 'Manage Sponsors',
    description: 'Create, edit, and delete sponsors and partners',
    category: 'Partnerships',
  },

  MANAGE_USERS: {
    key: 'MANAGE_USERS',
    name: 'Manage Users',
    description: 'Create, edit, and delete user accounts',
    category: 'User Management',
  },

  VIEW_ANALYTICS: {
    key: 'VIEW_ANALYTICS',
    name: 'View Analytics',
    description: 'Access analytics dashboard and reports',
    category: 'Analytics',
  },

  MANAGE_NEWSLETTER: {
    key: 'MANAGE_NEWSLETTER',
    name: 'Manage Newsletter',
    description: 'Manage newsletter subscribers and campaigns',
    category: 'Communications',
  },

  MANAGE_EVENTS: {
    key: 'MANAGE_EVENTS',
    name: 'Manage Events',
    description: 'Create, edit, and manage events',
    category: 'Events',
  },

  MANAGE_FILES: {
    key: 'MANAGE_FILES',
    name: 'Manage Files',
    description: 'Upload, edit, and manage files and documents',
    category: 'Content',
  },

  MANAGE_ANNOUNCEMENTS: {
    key: 'MANAGE_ANNOUNCEMENTS',
    name: 'Manage Announcements',
    description: 'Create, edit, and publish announcements',
    category: 'Communications',
  },

  MANAGE_CONTACTS: {
    key: 'MANAGE_CONTACTS',
    name: 'Manage Contacts',
    description: 'Manage contact information and directories',
    category: 'User Management',
  },

  MANAGE_CLUBS: {
    key: 'MANAGE_CLUBS',
    name: 'Manage Clubs',
    description: 'Create, edit, and manage student clubs',
    category: 'Content',
  },

  SYSTEM_ADMIN: {
    key: 'SYSTEM_ADMIN',
    name: 'System Administrator',
    description: 'Full system administration privileges',
    category: 'Administration',
  },

  MANAGE_TICKETS: {
    key: 'MANAGE_TICKETS',
    name: 'Manage Tickets',
    description: 'Create, assign, and manage support tickets',
    category: 'Events',
  },
} as const

export const PERMISSION_CATEGORIES = {
  Core: [APP_PERMISSIONS.HAS_ACCESS_TO_DASHBOARD],
  'User Management': [
    APP_PERMISSIONS.MANAGE_USERS,
    APP_PERMISSIONS.MANAGE_CONTACTS,
  ],
  Content: [
    APP_PERMISSIONS.CAN_READ_DOCS,
    APP_PERMISSIONS.MANAGE_FILES,
    APP_PERMISSIONS.MANAGE_CLUBS,
  ],
  Partnerships: [APP_PERMISSIONS.MANAGE_SPONSORS],
  Communications: [
    APP_PERMISSIONS.MANAGE_NEWSLETTER,
    APP_PERMISSIONS.MANAGE_ANNOUNCEMENTS,
  ],
  Events: [APP_PERMISSIONS.MANAGE_EVENTS, APP_PERMISSIONS.MANAGE_TICKETS],
  Analytics: [APP_PERMISSIONS.VIEW_ANALYTICS],
  Administration: [APP_PERMISSIONS.SYSTEM_ADMIN],
} as const

export function getAllPermissions() {
  return Object.values(APP_PERMISSIONS)
}
