import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { checkMaintenanceMode } from '@/lib/maintenance'
import { hasPermission } from '@/lib/permission'

interface MaintenanceGuardProps {
  locale: string
  children: React.ReactNode
}

export async function MaintenanceGuard({
  locale,
  children,
}: MaintenanceGuardProps) {
  const isMaintenanceMode = await checkMaintenanceMode()

  if (!isMaintenanceMode) {
    return <>{children}</>
  }

  const session = await auth()
  const isSystemAdmin =
    session?.user && hasPermission(session.user.permissions, 'SYSTEM_ADMIN')

  if (!isSystemAdmin) {
    redirect(`/${locale}/maintenance`)
  }

  return <>{children}</>
}
