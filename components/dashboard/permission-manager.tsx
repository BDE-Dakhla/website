'use client'

import type { PermissionMap } from '@/types/schema'
import {
  ChevronDown,
  ChevronUp,
  Shield,
  ShieldCheck,
  ShieldX,
  Users,
} from 'lucide-react'
import { useCallback, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { getAllPermissions, PERMISSION_CATEGORIES } from '@/lib/permission'
import { cn } from '@/lib/utils'

interface PermissionManagerProps {
  currentPermissions: PermissionMap | null | undefined
  onPermissionsChange: (permissions: PermissionMap) => void
  disabled?: boolean
  className?: string
}

export const PermissionManager = ({
  currentPermissions = {},
  onPermissionsChange,
  disabled = false,
  className,
}: PermissionManagerProps) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['Core']), // Expand Core category by default
  )

  const permissions = currentPermissions || {}
  const allPermissions = getAllPermissions()

  // Calculate stats
  const totalPermissions = allPermissions.length
  const grantedPermissions = Object.values(permissions).filter(
    (val) => val === 1,
  ).length

  const toggleCategory = useCallback((category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }, [])

  const handlePermissionChange = useCallback(
    (permissionKey: string, granted: boolean) => {
      const newPermissions = { ...permissions }
      newPermissions[permissionKey] = granted ? 1 : 0
      onPermissionsChange(newPermissions)
    },
    [permissions, onPermissionsChange],
  )

  const handleGrantAll = useCallback(() => {
    const newPermissions: PermissionMap = {}
    allPermissions.forEach((permission) => {
      newPermissions[permission.key] = 1
    })
    onPermissionsChange(newPermissions)
  }, [allPermissions, onPermissionsChange])

  const handleRevokeAll = useCallback(() => {
    const newPermissions: PermissionMap = {}
    allPermissions.forEach((permission) => {
      newPermissions[permission.key] = 0
    })
    onPermissionsChange(newPermissions)
  }, [allPermissions, onPermissionsChange])

  const handleCategoryToggle = useCallback(
    (category: string, grant: boolean) => {
      const newPermissions = { ...permissions }
      const categoryPermissions =
        PERMISSION_CATEGORIES[category as keyof typeof PERMISSION_CATEGORIES] ||
        []

      categoryPermissions.forEach((permission) => {
        newPermissions[permission.key] = grant ? 1 : 0
      })

      onPermissionsChange(newPermissions)
    },
    [permissions, onPermissionsChange],
  )

  const getCategoryStats = (category: string) => {
    const categoryPermissions =
      PERMISSION_CATEGORIES[category as keyof typeof PERMISSION_CATEGORIES] ||
      []
    const granted = categoryPermissions.filter(
      (p) => permissions[p.key] === 1,
    ).length
    const total = categoryPermissions.length
    return { granted, total }
  }

  const getStatusIcon = () => {
    if (grantedPermissions === 0) {
      return <ShieldX className='h-4 w-4 text-red-500' />
    }
    if (grantedPermissions === totalPermissions) {
      return <ShieldCheck className='h-4 w-4 text-green-500' />
    }
    return <Shield className='h-4 w-4 text-yellow-500' />
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className='pb-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <Users className='h-5 w-5' />
            <CardTitle className='text-lg'>Permissions</CardTitle>
          </div>
          <div className='flex items-center space-x-2'>
            {getStatusIcon()}
            <Badge variant='outline'>
              {grantedPermissions}/{totalPermissions}
            </Badge>
          </div>
        </div>

        <div className='flex space-x-2 pt-2'>
          <Button
            className='border-green-200 text-green-600 hover:bg-green-50'
            disabled={disabled}
            onClick={handleGrantAll}
            size='sm'
            variant='outline'>
            <ShieldCheck className='mr-1 h-3 w-3' />
            Grant All
          </Button>
          <Button
            className='border-red-200 text-red-600 hover:bg-red-50'
            disabled={disabled}
            onClick={handleRevokeAll}
            size='sm'
            variant='outline'>
            <ShieldX className='mr-1 h-3 w-3' />
            Revoke All
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className='h-[400px] pr-3'>
          <div className='space-y-3'>
            {Object.entries(PERMISSION_CATEGORIES).map(
              ([categoryName, categoryPermissions]) => {
                const stats = getCategoryStats(categoryName)
                const isExpanded = expandedCategories.has(categoryName)
                const isAllGranted =
                  stats.granted === stats.total && stats.total > 0
                const isNoneGranted = stats.granted === 0

                return (
                  <div className='rounded-lg border' key={categoryName}>
                    <Collapsible
                      onOpenChange={() => toggleCategory(categoryName)}
                      open={isExpanded}>
                      <CollapsibleTrigger asChild>
                        <div className='flex cursor-pointer items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800'>
                          <div className='flex items-center space-x-2'>
                            <div className='flex items-center space-x-1'>
                              {isExpanded ? (
                                <ChevronUp className='h-4 w-4' />
                              ) : (
                                <ChevronDown className='h-4 w-4' />
                              )}
                              <span className='font-medium'>
                                {categoryName}
                              </span>
                            </div>
                            <Badge className='text-xs' variant='secondary'>
                              {stats.granted}/{stats.total}
                            </Badge>
                          </div>

                          <div className='flex space-x-1'>
                            <Button
                              className='h-6 px-2 text-green-600 hover:bg-green-50'
                              disabled={disabled || isAllGranted}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCategoryToggle(categoryName, true)
                              }}
                              size='sm'
                              variant='ghost'>
                              <ShieldCheck className='h-3 w-3' />
                            </Button>
                            <Button
                              className='h-6 px-2 text-red-600 hover:bg-red-50'
                              disabled={disabled || isNoneGranted}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCategoryToggle(categoryName, false)
                              }}
                              size='sm'
                              variant='ghost'>
                              <ShieldX className='h-3 w-3' />
                            </Button>
                          </div>
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <Separator />
                        <div className='space-y-3 p-3'>
                          {categoryPermissions.map((permission) => {
                            const isGranted = permissions[permission.key] === 1

                            return (
                              <div
                                className='flex items-start space-x-3 rounded border-l-2 border-l-transparent p-2 hover:border-l-blue-200 hover:bg-blue-50/30'
                                key={permission.key}>
                                <Checkbox.Native
                                  checked={isGranted}
                                  className='mt-0.5'
                                  disabled={disabled}
                                  id={permission.key}
                                  onCheckedChange={(checked) =>
                                    handlePermissionChange(
                                      permission.key,
                                      !!checked,
                                    )
                                  }
                                />
                                <div className='flex-1 space-y-1'>
                                  <label
                                    className='cursor-pointer font-medium text-sm leading-none'
                                    htmlFor={permission.key}>
                                    {permission.name}
                                  </label>
                                  <p className='text-muted-foreground text-xs'>
                                    {permission.description}
                                  </p>
                                  <code className='rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800'>
                                    {permission.key}
                                  </code>
                                </div>
                                {isGranted && (
                                  <ShieldCheck className='mt-0.5 h-4 w-4 text-green-500' />
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                )
              },
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
