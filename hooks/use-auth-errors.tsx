'use client'

import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect } from 'react'
import { toast } from 'sonner'

// Mapping of error keys to their types (since types are not translatable)
const ERROR_TYPES: Record<string, 'error' | 'warning' | 'info'> = {
  Configuration: 'error',
  AccessDenied: 'error',
  Verification: 'error',
  Default: 'error',
  CredentialsSignin: 'error',
  OAuthSignin: 'error',
  OAuthCallback: 'error',
  OAuthCreateAccount: 'error',
  EmailCreateAccount: 'error',
  Callback: 'error',
  OAuthAccountNotLinked: 'error',
  EmailSignin: 'error',
  SessionRequired: 'warning',
  NetworkError: 'error',
  TimeoutError: 'error',
}

interface UseAuthErrorsOptions {
  showToast?: boolean
  clearErrorAfterShow?: boolean
}

export function useAuthErrors(options: UseAuthErrorsOptions = {}) {
  const { showToast = true, clearErrorAfterShow = true } = options
  const searchParams = useSearchParams()
  const t = useTranslations('auth.errors')

  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  const getErrorMessage = useCallback(
    (errorCode: string) => {
      let key = errorCode

      if (
        errorCode.toLowerCase().includes('timeout') ||
        errorCode.toLowerCase().includes('etimedout') ||
        errorDescription?.toLowerCase().includes('timeout')
      ) {
        key = 'TimeoutError'
      } else if (
        errorCode.toLowerCase().includes('network') ||
        errorDescription?.toLowerCase().includes('fetch failed')
      ) {
        key = 'NetworkError'
      }

      // If the key doesn't exist in translations, fall back to Default
      const title = t(`${key}.title`, { defaultValue: t('Default.title') })
      const message = t(`${key}.message`, {
        defaultValue: t('Default.message'),
      })
      const type = ERROR_TYPES[key] || ERROR_TYPES.Default

      return { title, message, type }
    },
    [errorDescription, t],
  )

  const showErrorToast = useCallback(
    (errorCode: string) => {
      if (!errorCode) return

      const errorInfo = getErrorMessage(errorCode)

      const toastContent = (
        <div className='space-y-1'>
          <div className='font-medium'>{errorInfo.title}</div>
          <div className='text-sm opacity-90'>{errorInfo.message}</div>
          {errorDescription && (
            <div className='mt-2 text-xs opacity-70'>
              Détails: {errorDescription}
            </div>
          )}
        </div>
      )

      switch (errorInfo.type) {
        case 'error':
          toast.error(toastContent, {
            duration: 6000,
            action: {
              label: 'Réessayer',
              onClick: () => window.location.reload(),
            },
          })
          break
        case 'warning':
          toast.warning(toastContent, { duration: 5000 })
          break
        case 'info':
          toast.info(toastContent, { duration: 4000 })
          break
      }
    },
    [errorDescription, getErrorMessage],
  )

  const clearError = useCallback(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.delete('error')
      url.searchParams.delete('error_description')
      window.history.replaceState(null, '', url.toString())
    }
  }, [])

  useEffect(() => {
    if (error && showToast) {
      const timer = setTimeout(() => {
        showErrorToast(error)

        if (clearErrorAfterShow) {
          setTimeout(clearError, 1000)
        }
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [error, showToast, showErrorToast, clearErrorAfterShow, clearError])

  return {
    error,
    errorDescription,
    hasError: Boolean(error),
    getErrorMessage: (code: string) => getErrorMessage(code),
    showErrorToast,
    clearError,
  }
}
