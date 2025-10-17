import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'
import { auth } from '@/auth'
import { checkMaintenanceMode } from './maintenance'
import { hasPermission } from './permission'

interface WithMaintenanceCheckProps {
  children: ReactNode
  locale: string
  skipCheck?: boolean
}

export async function withMaintenanceCheck({
  children,
  locale,
  skipCheck = false,
}: WithMaintenanceCheckProps) {
  if (skipCheck) {
    return children
  }

  const isMaintenanceMode = await checkMaintenanceMode()

  if (!isMaintenanceMode) {
    return children
  }

  const session = await auth()
  const isSystemAdmin =
    session?.user &&
    hasPermission(session.user.permissions, 'SYSTEM_ADMIN')

  if (!isSystemAdmin) {
    redirect(`/${locale}/maintenance`)
  }

  return children
}
