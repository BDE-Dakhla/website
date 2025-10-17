'use client'

import { AlertTriangle, Home, RefreshCw } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

const ERROR_MESSAGES: Record<
  string,
  { title: string; description: string; action?: string }
> = {
  Configuration: {
    title: 'Erreur de configuration',
    description:
      'Un problème de configuration OAuth a été détecté. Cela peut être temporaire.',
    action:
      'Veuillez réessayer dans quelques instants ou contacter le support technique.',
  },
  AccessDenied: {
    title: 'Accès refusé',
    description:
      "Votre compte n'est pas autorisé à accéder à cette application.",
    action: "Assurez-vous d'utiliser votre adresse email @edu.uiz.ac.ma",
  },
  Verification: {
    title: 'Erreur de vérification',
    description: "Le lien de vérification a expiré ou n'est pas valide.",
    action: 'Demandez un nouveau lien de vérification.',
  },
  Default: {
    title: "Erreur d'authentification",
    description: "Une erreur inattendue s'est produite lors de la connexion.",
    action: 'Veuillez réessayer ou utiliser une autre méthode de connexion.',
  },
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [countdown, setCountdown] = useState(10)

  const error = searchParams.get('error') || 'Default'
  const errorInfo = ERROR_MESSAGES[error] || ERROR_MESSAGES.Default

  useEffect(() => {
    toast.error(
      <div className='space-y-2'>
        <div className='font-medium'>{errorInfo.title}</div>
        <div className='text-sm opacity-90'>{errorInfo.description}</div>
      </div>,
      { duration: 8000 },
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
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4'>
      <div className='w-full max-w-md rounded-lg border border-red-100 bg-white p-8 shadow-xl'>
        <div className='text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100'>
            <AlertTriangle className='h-8 w-8 text-red-600' />
          </div>

          <h1 className='mb-2 font-bold text-2xl text-gray-900'>
            {errorInfo.title}
          </h1>

          <p className='mb-4 text-gray-600'>{errorInfo.description}</p>

          {errorInfo.action && (
            <p className='mb-6 rounded-md bg-gray-50 p-3 text-gray-500 text-sm'>
              💡 {errorInfo.action}
            </p>
          )}

          <div className='space-y-3'>
            <Button className='w-full' onClick={handleRetry} size='lg'>
              <RefreshCw className='mr-2 h-4 w-4' />
              Réessayer la connexion
            </Button>

            <Button
              className='w-full'
              onClick={() => router.push('/')}
              size='lg'
              variant='outline'>
              <Home className='mr-2 h-4 w-4' />
              Retour à l'accueil
            </Button>
          </div>

          <div className='mt-6 rounded-md bg-blue-50 p-3'>
            <p className='text-blue-700 text-sm'>
              Redirection automatique dans {countdown} seconde
              {countdown !== 1 ? 's' : ''}...
            </p>
            <div className='mt-2 h-1 w-full rounded-full bg-blue-200'>
              <div
                className='h-1 rounded-full bg-blue-500 transition-all duration-1000 ease-linear'
                style={{ width: `${((10 - countdown) / 10) * 100}%` }}
              />
            </div>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details className='mt-4 text-left'>
              <summary className='cursor-pointer text-gray-500 text-xs'>
                Informations de débogage
              </summary>
              <pre className='mt-2 overflow-auto rounded bg-gray-100 p-2 text-xs'>
                {JSON.stringify(
                  {
                    error,
                    searchParams: Object.fromEntries(searchParams.entries()),
                  },
                  null,
                  2,
                )}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  )
}
