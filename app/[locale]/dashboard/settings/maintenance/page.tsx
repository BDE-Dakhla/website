'use client'

import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function MaintenanceSettingsPage() {
  const t = useTranslations('dashboard.settings.maintenance')
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false)
  const [pendingState, setPendingState] = useState<boolean | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const fetchMaintenanceStatus = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/settings/maintenance')
      if (!response.ok) {
        throw new Error('Failed to fetch maintenance status')
      }
      const data = await response.json()
      setIsEnabled(data.enabled)
    } catch (error) {
      console.error('Error fetching maintenance status:', error)
      toast.error(t('error.fetchTitle'), {
        description: t('error.fetchDescription'),
      })
    } finally {
      setIsLoading(false)
    }
  }, [t])

  useEffect(() => {
    fetchMaintenanceStatus()
  }, [fetchMaintenanceStatus])

  function handleToggleClick(checked: boolean) {
    setPendingState(checked)
    setShowConfirmDialog(true)
  }

  async function confirmToggle() {
    if (pendingState === null) return

    try {
      setIsUpdating(true)
      const response = await fetch('/api/settings/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled: pendingState }),
      })

      if (!response.ok) {
        throw new Error('Failed to update maintenance mode')
      }

      const data = await response.json()
      setIsEnabled(data.enabled)

      toast.success(t('success.title'), {
        description: data.enabled
          ? t('success.enabledDescription')
          : t('success.disabledDescription'),
      })
    } catch (error) {
      console.error('Error updating maintenance mode:', error)
      toast.error(t('error.updateTitle'), {
        description: t('error.updateDescription'),
      })
    } finally {
      setIsUpdating(false)
      setShowConfirmDialog(false)
      setPendingState(null)
    }
  }

  function cancelToggle() {
    setShowConfirmDialog(false)
    setPendingState(null)
  }

  return (
    <>
      <div className='mx-auto max-w-4xl space-y-6'>
        <div>
          <h1 className='font-bold text-3xl tracking-tight'>
            {t('pageTitle')}
          </h1>
          <p className='mt-2 text-muted-foreground'>{t('pageDescription')}</p>
        </div>

        <div
          className={cn(
            'flex items-start gap-4 rounded-lg border p-4',
            isEnabled
              ? 'border-orange-200 bg-orange-50 dark:border-orange-900/50 dark:bg-orange-950/20'
              : 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/20',
          )}>
          {isEnabled ? (
            <AlertTriangle className='mt-0.5 size-5 shrink-0 text-orange-600 dark:text-orange-500' />
          ) : (
            <CheckCircle2 className='mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-500' />
          )}
          <div className='flex-1'>
            <h3 className='font-semibold text-sm'>
              {isEnabled ? t('alert.activeTitle') : t('alert.inactiveTitle')}
            </h3>
            <p className='mt-1 text-muted-foreground text-sm'>
              {isEnabled
                ? t('alert.activeDescription')
                : t('alert.inactiveDescription')}
            </p>
          </div>
        </div>

        <div className='rounded-lg border bg-card'>
          <div className='border-b p-6'>
            <h2 className='font-semibold text-lg'>{t('cardTitle')}</h2>
            <p className='mt-1 text-muted-foreground text-sm'>
              {t('cardDescription')}
            </p>
          </div>

          <div className='p-6'>
            <div className='flex items-center justify-between'>
              <div className='flex-1'>
                <Label
                  className='font-medium text-base'
                  htmlFor='maintenance-toggle'>
                  {t('toggleLabel')}
                </Label>
                <p className='mt-1 text-muted-foreground text-sm'>
                  {t('toggleDescription')}
                </p>
              </div>

              <div className='flex items-center gap-3'>
                {isLoading ? (
                  <Loader2 className='size-5 animate-spin text-muted-foreground' />
                ) : (
                  <Switch
                    checked={isEnabled}
                    disabled={isUpdating}
                    id='maintenance-toggle'
                    onCheckedChange={handleToggleClick}
                  />
                )}
              </div>
            </div>

            {!isLoading && (
              <div className='mt-6 rounded-md bg-muted/50 p-4'>
                <div className='flex items-start gap-3'>
                  <AlertTriangle className='mt-0.5 size-4 shrink-0 text-muted-foreground' />
                  <div className='space-y-1'>
                    <p className='font-medium text-sm'>{t('warningTitle')}</p>
                    <p className='text-muted-foreground text-xs'>
                      {t('warningDescription')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AlertDialog onOpenChange={setShowConfirmDialog} open={showConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className='mb-4 flex justify-center'>
              {pendingState ? (
                <div className='flex size-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950/50'>
                  <AlertTriangle className='size-6 text-orange-600 dark:text-orange-500' />
                </div>
              ) : (
                <div className='flex size-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50'>
                  <CheckCircle2 className='size-6 text-emerald-600 dark:text-emerald-500' />
                </div>
              )}
            </div>
            <AlertDialogTitle className='text-center'>
              {pendingState
                ? t('dialog.enableTitle')
                : t('dialog.disableTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription className='text-center'>
              {pendingState
                ? t('dialog.enableDescription')
                : t('dialog.disableDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='sm:justify-center'>
            <AlertDialogCancel disabled={isUpdating} onClick={cancelToggle}>
              {t('dialog.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction disabled={isUpdating} onClick={confirmToggle}>
              {isUpdating ? (
                <>
                  <Loader2 className='mr-2 size-4 animate-spin' />
                  {t('dialog.confirming')}
                </>
              ) : (
                t('dialog.confirm')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
