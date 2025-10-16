import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('Utility Functions', () => {
  describe('cn (className merger)', () => {
    it('should merge class names', () => {
      const result = cn('class1', 'class2')
      expect(result).toContain('class1')
      expect(result).toContain('class2')
    })

    it('should handle conditional classes', () => {
      const result = cn('base', true && 'conditional', false && 'hidden')
      expect(result).toContain('base')
      expect(result).toContain('conditional')
      expect(result).not.toContain('hidden')
    })

    it('should handle tailwind merge conflicts', () => {
      const result = cn('p-4', 'p-6')
      // Should only keep the last padding class
      expect(result).toBe('p-6')
    })

    it('should handle arrays and objects', () => {
      const result = cn(['class1', 'class2'], { class3: true, class4: false })
      expect(result).toContain('class1')
      expect(result).toContain('class2')
      expect(result).toContain('class3')
      expect(result).not.toContain('class4')
    })

    it('should handle undefined and null', () => {
      const result = cn('class1', undefined, null, 'class2')
      expect(result).toContain('class1')
      expect(result).toContain('class2')
    })
  })
})
