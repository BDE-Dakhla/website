'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useCallback } from 'react'
import { toast } from 'sonner'

interface AuthErrorMessages {
  [key: string]: {
    title: string
    message: string
    type: 'error' | 'warning' | 'info'
  }
}

const AUTH_ERROR_MESSAGES: AuthErrorMessages = {
  Configuration: {
    title: 'Erreur de configuration',
    message: 'Un problème de configuration a été détecté. Veuillez réessayer dans quelques instants.',
    type: 'error'
  },
  AccessDenied: {
    title: 'Accès refusé',
    message: 'Votre compte n\'est pas autorisé à accéder à cette application. Utilisez votre email @edu.uiz.ac.ma',
    type: 'error'
  },
  Verification: {
    title: 'Erreur de vérification',
    message: 'Le lien de vérification a expiré ou n\'est pas valide.',
    type: 'error'
  },
  Default: {
    title: 'Erreur d\'authentification',
    message: 'Une erreur inattendue s\'est produite. Veuillez réessayer.',
    type: 'error'
  },
  CredentialsSignin: {
    title: 'Identifiants incorrects',
    message: 'Code Massar ou mot de passe invalide. Vérifiez vos informations.',
    type: 'error'
  },
  OAuthSignin: {
    title: 'Erreur OAuth',
    message: 'Impossible de se connecter avec Google. Vérifiez votre connexion internet.',
    type: 'error'
  },
  OAuthCallback: {
    title: 'Erreur de connexion Google',
    message: 'La connexion avec Google a échoué. Cela peut être dû à un problème de réseau.',
    type: 'error'
  },
  OAuthCreateAccount: {
    title: 'Erreur de création de compte',
    message: 'Impossible de créer votre compte. Contactez le support technique.',
    type: 'error'
  },
  EmailCreateAccount: {
    title: 'Erreur de création de compte',
    message: 'Impossible de créer votre compte avec cette adresse email.',
    type: 'error'
  },
  Callback: {
    title: 'Erreur de connexion',
    message: 'Une erreur s\'est produite lors de la connexion. Vérifiez votre connexion internet et réessayez.',
    type: 'error'
  },
  OAuthAccountNotLinked: {
    title: 'Compte non associé',
    message: 'Ce compte Google n\'est pas associé à votre compte étudiant.',
    type: 'error'
  },
  EmailSignin: {
    title: 'Erreur d\'envoi d\'email',
    message: 'Impossible d\'envoyer l\'email de connexion.',
    type: 'error'
  },
  SessionRequired: {
    title: 'Connexion requise',
    message: 'Vous devez être connecté pour accéder à cette page.',
    type: 'warning'
  },
  NetworkError: {
    title: 'Erreur de réseau',
    message: 'Problème de connexion internet. Vérifiez votre réseau et réessayez.',
    type: 'error'
  },
  TimeoutError: {
    title: 'Délai d\'attente dépassé',
    message: 'La connexion a pris trop de temps. Réessayez dans quelques instants.',
    type: 'error'
  }
}

interface UseAuthErrorsOptions {
  showToast?: boolean
  clearErrorAfterShow?: boolean
}

export function useAuthErrors(options: UseAuthErrorsOptions = {}) {
  const { showToast = true, clearErrorAfterShow = true } = options
  const searchParams = useSearchParams()
  
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')
  
  const getErrorMessage = useCallback((errorCode: string) => {
    if (errorCode.toLowerCase().includes('timeout') || 
        errorCode.toLowerCase().includes('etimedout') ||
        errorDescription?.toLowerCase().includes('timeout')) {
      return AUTH_ERROR_MESSAGES.TimeoutError
    }
    
    if (errorCode.toLowerCase().includes('network') ||
        errorDescription?.toLowerCase().includes('fetch failed')) {
      return AUTH_ERROR_MESSAGES.NetworkError
    }
    
    return AUTH_ERROR_MESSAGES[errorCode] || AUTH_ERROR_MESSAGES.Default
  }, [errorDescription])

  const showErrorToast = useCallback((errorCode: string) => {
    if (!errorCode) return

    const errorInfo = getErrorMessage(errorCode)
    
    const toastContent = (
      <div className="space-y-1">
        <div className="font-medium">{errorInfo.title}</div>
        <div className="text-sm opacity-90">{errorInfo.message}</div>
        {errorDescription && (
          <div className="text-xs opacity-70 mt-2">
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
            onClick: () => window.location.reload()
          }
        })
        break
      case 'warning':
        toast.warning(toastContent, { duration: 5000 })
        break
      case 'info':
        toast.info(toastContent, { duration: 4000 })
        break
    }
  }, [errorDescription, getErrorMessage])

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
    clearError
  }
}