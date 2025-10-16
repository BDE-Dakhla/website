import { describe, it, expect } from 'vitest'
import { hasPermission, getAllPermissions } from '@/lib/permission'

describe('Permission Utilities', () => {
  describe('hasPermission', () => {
    it('should return true when permission is set to 1', () => {
      const perms = { MANAGE_SPONSORS: 1 }
      expect(hasPermission(perms, 'MANAGE_SPONSORS')).toBe(true)
    })

    it('should return false when permission is set to 0', () => {
      const perms = { MANAGE_SPONSORS: 0 }
      expect(hasPermission(perms, 'MANAGE_SPONSORS')).toBe(false)
    })

    it('should return false when permission does not exist', () => {
      const perms = { MANAGE_SPONSORS: 1 }
      expect(hasPermission(perms, 'MANAGE_USERS')).toBe(false)
    })

    it('should return false when permissions object is null', () => {
      expect(hasPermission(null, 'MANAGE_SPONSORS')).toBe(false)
    })

    it('should return false when permissions object is undefined', () => {
      expect(hasPermission(undefined, 'MANAGE_SPONSORS')).toBe(false)
    })

    it('should handle multiple permissions correctly', () => {
      const perms = {
        MANAGE_SPONSORS: 1,
        MANAGE_USERS: 0,
        MANAGE_NEWSLETTER: 1,
      }
      
      expect(hasPermission(perms, 'MANAGE_SPONSORS')).toBe(true)
      expect(hasPermission(perms, 'MANAGE_USERS')).toBe(false)
      expect(hasPermission(perms, 'MANAGE_NEWSLETTER')).toBe(true)
      expect(hasPermission(perms, 'VIEW_ANALYTICS')).toBe(false)
    })

    it('should handle empty permissions object', () => {
      const perms = {}
      expect(hasPermission(perms, 'MANAGE_SPONSORS')).toBe(false)
    })
  })

  describe('getAllPermissions', () => {
    it('should return all available permissions', () => {
      const permissions = getAllPermissions()
      
      expect(Array.isArray(permissions)).toBe(true)
      expect(permissions.length).toBeGreaterThan(0)
    })

    it('should return permissions with correct structure', () => {
      const permissions = getAllPermissions()
      
      permissions.forEach((perm) => {
        expect(perm).toHaveProperty('key')
        expect(perm).toHaveProperty('name')
        expect(perm).toHaveProperty('description')
        expect(perm).toHaveProperty('category')
        expect(typeof perm.key).toBe('string')
        expect(typeof perm.name).toBe('string')
        expect(typeof perm.description).toBe('string')
        expect(typeof perm.category).toBe('string')
      })
    })

    it('should include expected core permissions', () => {
      const permissions = getAllPermissions()
      const keys = permissions.map((p) => p.key)
      
      expect(keys).toContain('MANAGE_SPONSORS')
      expect(keys).toContain('MANAGE_USERS')
      expect(keys).toContain('MANAGE_NEWSLETTER')
      expect(keys).toContain('VIEW_ANALYTICS')
      expect(keys).toContain('SYSTEM_ADMIN')
    })
  })
})
