// All available permissions in the application
export const APP_PERMISSIONS = {
  // Core Dashboard Access
  HAS_ACCESS_TO_DASHBOARD: {
    key: 'HAS_ACCESS_TO_DASHBOARD',
    name: 'Dashboard Access',
    description: 'Access to the main dashboard interface',
    category: 'Core',
  },

  // Content Management
  CAN_READ_DOCS: {
    key: 'CAN_READ_DOCS',
    name: 'Read Documentation',
    description: 'View documentation and guides',
    category: 'Content',
  },

  // Sponsor Management
  MANAGE_SPONSORS: {
    key: 'MANAGE_SPONSORS',
    name: 'Manage Sponsors',
    description: 'Create, edit, and delete sponsors and partners',
    category: 'Partnerships',
  },

  // User Management
  MANAGE_USERS: {
    key: 'MANAGE_USERS',
    name: 'Manage Users',
    description: 'Create, edit, and delete user accounts',
    category: 'User Management',
  },

  // Analytics & Reports
  VIEW_ANALYTICS: {
    key: 'VIEW_ANALYTICS',
    name: 'View Analytics',
    description: 'Access analytics dashboard and reports',
    category: 'Analytics',
  },

  // Newsletter & Communications
  MANAGE_NEWSLETTER: {
    key: 'MANAGE_NEWSLETTER',
    name: 'Manage Newsletter',
    description: 'Manage newsletter subscribers and campaigns',
    category: 'Communications',
  },

  // Events Management
  MANAGE_EVENTS: {
    key: 'MANAGE_EVENTS',
    name: 'Manage Events',
    description: 'Create, edit, and manage events',
    category: 'Events',
  },

  // File & Document Management
  MANAGE_FILES: {
    key: 'MANAGE_FILES',
    name: 'Manage Files',
    description: 'Upload, edit, and manage files and documents',
    category: 'Content',
  },

  // Announcements
  MANAGE_ANNOUNCEMENTS: {
    key: 'MANAGE_ANNOUNCEMENTS',
    name: 'Manage Announcements',
    description: 'Create, edit, and publish announcements',
    category: 'Communications',
  },

  // Contacts Management
  MANAGE_CONTACTS: {
    key: 'MANAGE_CONTACTS',
    name: 'Manage Contacts',
    description: 'Manage contact information and directories',
    category: 'User Management',
  },

  // System Administration
  SYSTEM_ADMIN: {
    key: 'SYSTEM_ADMIN',
    name: 'System Administrator',
    description: 'Full system administration privileges',
    category: 'Administration',
  },

  // Ticket Management
  MANAGE_TICKETS: {
    key: 'MANAGE_TICKETS',
    name: 'Manage Tickets',
    description: 'Create, assign, and manage support tickets',
    category: 'Events',
  },
} as const

// Grouped permissions by category
export const PERMISSION_CATEGORIES = {
  Core: [APP_PERMISSIONS.HAS_ACCESS_TO_DASHBOARD],
  'User Management': [
    APP_PERMISSIONS.MANAGE_USERS,
    APP_PERMISSIONS.MANAGE_CONTACTS,
  ],
  Content: [APP_PERMISSIONS.CAN_READ_DOCS, APP_PERMISSIONS.MANAGE_FILES],
  Partnerships: [APP_PERMISSIONS.MANAGE_SPONSORS],
  Communications: [
    APP_PERMISSIONS.MANAGE_NEWSLETTER,
    APP_PERMISSIONS.MANAGE_ANNOUNCEMENTS,
  ],
  Events: [APP_PERMISSIONS.MANAGE_EVENTS, APP_PERMISSIONS.MANAGE_TICKETS],
  Analytics: [APP_PERMISSIONS.VIEW_ANALYTICS],
  Administration: [APP_PERMISSIONS.SYSTEM_ADMIN],
} as const

// All permission keys as array for easy iteration
export const ALL_PERMISSION_KEYS = Object.keys(APP_PERMISSIONS) as Array<
  keyof typeof APP_PERMISSIONS
>

// Helper function to get permission info
export function getPermissionInfo(key: string) {
  return APP_PERMISSIONS[key as keyof typeof APP_PERMISSIONS]
}

// Helper function to get all permissions as array
export function getAllPermissions() {
  return Object.values(APP_PERMISSIONS)
}

// Helper function to check if a permission key is valid
export function isValidPermissionKey(
  key: string,
): key is keyof typeof APP_PERMISSIONS {
  return key in APP_PERMISSIONS
}
