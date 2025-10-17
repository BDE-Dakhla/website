import type { MaintenanceModeSettings } from '@/types/schema'
import { getDb } from './db/instance'

export async function checkMaintenanceMode(): Promise<boolean> {
  try {
    const db = getDb()
    const setting = await db
      .selectFrom('system_settings')
      .select(['value'])
      .where('key', '=', 'maintenance_mode')
      .executeTakeFirst()

    if (!setting) return false

    const maintenanceSettings = setting.value as MaintenanceModeSettings
    return maintenanceSettings.enabled
  } catch (error) {
    console.error('Error checking maintenance mode:', error)
    return false
  }
}
