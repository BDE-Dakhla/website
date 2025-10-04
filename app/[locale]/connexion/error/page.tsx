'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/routing'
import { toast } from 'sonner'

const ERROR_MESSAGES: Record<string, { title: string; description: string; action?: string }> = {
  Configuration: {
    title: 'Erreur de configuration',
    description: 'Un problème de configuration OAuth a été détecté. Cela peut être temporaire.',
    action: 'Veuillez réessayer dans quelques instants ou contacter le support technique.'
  },
  AccessDenied: {
    title: 'Accès refusé',
    description: 'Votre compte n\'est pas autorisé à accéder à cette application.',
    action: 'Assurez-vous d\'utiliser votre adresse email @edu.uiz.ac.ma'
  },
  Verification: {
    title: 'Erreur de vérification',
    description: 'Le lien de vérification a expiré ou n\'est pas valide.',
    action: 'Demandez un nouveau lien de vérification.'
  },
  Default: {
    title: 'Erreur d\'authentification',
    description: 'Une erreur inattendue s\'est produite lors de la connexion.',
    action: 'Veuillez réessayer ou utiliser une autre méthode de connexion.'
  }
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [countdown, setCountdown] = useState(10)
  
  const error = searchParams.get('error') || 'Default'
  const errorInfo = ERROR_MESSAGES[error] || ERROR_MESSAGES.Default

  useEffect(() => {
    toast.error(
      <div className="space-y-2">
        <div className="font-medium">{errorInfo.title}</div>
        <div className="text-sm opacity-90">{errorInfo.description}</div>
      </div>,
      { duration: 8000 }
    )

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/connexion')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [error, errorInfo, router])

  const handleRetry = () => {
    router.push('/connexion')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl border border-red-100 p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {errorInfo.title}
          </h1>
          
          <p className="text-gray-600 mb-4">
            {errorInfo.description}
          </p>
          
          {errorInfo.action && (
            <p className="text-sm text-gray-500 mb-6 bg-gray-50 p-3 rounded-md">
              💡 {errorInfo.action}
            </p>
          )}

          <div className="space-y-3">
            <Button 
              onClick={handleRetry}
              className="w-full"
              size="lg"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer la connexion
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => router.push('/')}
              className="w-full"
              size="lg"
            >
              <Home className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
          </div>

          <div className="mt-6 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-700">
              Redirection automatique dans {countdown} seconde{countdown !== 1 ? 's' : ''}...
            </p>
            <div className="w-full bg-blue-200 rounded-full h-1 mt-2">
              <div 
                className="bg-blue-500 h-1 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${((10 - countdown) / 10) * 100}%` }}
              />
            </div>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-left">
              <summary className="text-xs text-gray-500 cursor-pointer">
                Informations de débogage
              </summary>
              <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
                {JSON.stringify({ 
                  error,
                  searchParams: Object.fromEntries(searchParams.entries())
                }, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  )
}