'use client'

import { Eye, EyeOff, FolderOpen, GraduationCap, KeyRound, Loader2, Lock, MessageCircle, Newspaper, RefreshCw } from 'lucide-react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { treeifyError } from 'zod'
import { toast } from 'sonner'
import { Button as StaticButton } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/stateful-button'
import { Link } from '@/i18n/routing'
import { signInSchema } from '@/lib/auth'
import { useAuthErrors } from '@/hooks/use-auth-errors'

type FieldErrors = Partial<{ cdm: string; password: string; form: string }>

export default function SignInPage() {
  const [user, setUser] = useState({ cdm: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [retryCount, setRetryCount] = useState(0)
  const searchParams = useSearchParams()
  
  const { hasError, error: authError, getErrorMessage } = useAuthErrors()
  const serverError = searchParams.get('error')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const parsed = signInSchema.safeParse(user)

    if (!parsed.success) {
      const { properties } = treeifyError(parsed.error)
      return setErrors({
        cdm: properties?.cdm?.errors[0],
        password: properties?.password?.errors[0]
      })
    }

    setLoading(true)

    try {
      await signIn('credentials', {
        cdm: parsed.data.cdm,
        password: parsed.data.password,
        redirectTo: '/syllabus'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async (isRetry = false) => {
    setGoogleLoading(true)
    setErrors({})
    
    try {
      if (isRetry) {
        toast.info('Nouvelle tentative de connexion avec Google...', { duration: 2000 })
      }
      
      await signIn('google', { 
        redirectTo: '/syllabus',
        timestamp: Date.now().toString()
      })
      
    } catch (error) {
      console.error('Google sign-in error:', error)
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
        toast.error(
          <div className="space-y-2">
            <div className="font-medium">Connexion Google échouée</div>
            <div className="text-sm">Problème de réseau détecté. Vérifiez votre connexion internet.</div>
            <button 
              className="mt-2 text-xs underline hover:no-underline"
              onClick={() => {
                setRetryCount(prev => prev + 1)
                handleGoogleSignIn(true)
              }}
            >
              Réessayer maintenant
            </button>
          </div>,
          { duration: 6000 }
        )
      } else {
        toast.error('Erreur lors de la connexion avec Google. Veuillez réessayer.')
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className='relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4'>
      <div className='z-10 w-full max-w-6xl'>
        <div className='overflow-hidden rounded-[40px] bg-secondary/50 shadow-2xl'>
          <div className='grid min-h-[700px] lg:grid-cols-2'>
            <div className="relative m-4 rounded-3xl bg-[linear-gradient(-90deg,rgba(0,0,0,0),rgba(0,0,0,1)),url('/auth.jpg')] bg-center bg-cover bg-no-repeat p-12 text-white">
              <div>
                <div className='mb-12 font-semibold text-lg uppercase'>Syllabus</div>
                <h1 className='mb-4 font-bold text-6xl'>Mes cours en un seul lieu</h1>
                <p className='mb-12 text-xl opacity-80'>
                  Retrouvez tout vos cours, documents annexes et organisez les comme bon vous semble !
                </p>

                <div className='space-y-6'>
                  {[
                    {
                      icon: <FolderOpen />,
                      title: 'Organisation beaucoup plus fluide',
                      desc: 'Notez vos cours, vos absences... et retrouvez toutes les ressources utiles pour réussir votre année.'
                    },
                    {
                      icon: <MessageCircle />,
                      title: 'Échange direct avec vos professeurs',
                      desc: 'Posez/obtenez des questions/réponses où tout le monde peut y bénéficier.'
                    },
                    {
                      icon: <GraduationCap />,
                      title: 'Outils gratuits à votre disposition',
                      desc: 'Accédez à votre calendrier personnel, votre emploi du temps, ainsi que tout vos cours en quelques clics.'
                    },
                    {
                      icon: <Newspaper />,
                      title: 'Vie estudiantine plus facile que jamais',
                      desc: "Soyez au courant des activités universitaires et parascolaires à l'intérieur du Campus à la minute près."
                    }
                  ].map(({ icon, title, desc }, i) => (
                    <div
                      className='feature-item flex animate-fadeInUp items-center'
                      key={title}
                      style={{ animationDelay: `${0.2 * (i + 1)}s` }}>
                      <div className='mr-4 flex min-h-8 min-w-8 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur-sm'>
                        {icon}
                      </div>
                      <div>
                        <div className='font-semibold'>{title}</div>
                        <div className='text-sm opacity-70'>{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className='flex flex-col justify-center p-12'>
              <div className='mx-auto w-full max-w-md'>
                <div className='mb-8 text-center'>
                  <h2 className='font-light text-3xl uppercase'>BIENVENUE</h2>
                  <p className='mt-2 text-sm text-stone-600'>Connectez-vous pour accéder à votre espace étudiant</p>
                </div>

                {(serverError || hasError) && (
                  <div className='mb-4 rounded-md border border-red-200 bg-red-50 p-4 text-red-700'>
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {authError ? getErrorMessage(authError).title : 'Erreur d\'authentification'}
                        </div>
                        <div className="mt-1 text-sm">
                          {authError ? getErrorMessage(authError).message :
                           serverError === 'CredentialsSignin'
                             ? 'Code Massar ou mot de passe invalide.'
                             : 'Une erreur est survenue. Veuillez réessayer.'}
                        </div>
                        {retryCount > 0 && (
                          <div className="mt-2 text-xs opacity-75">
                            Tentatives: {retryCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <form className='space-y-6' noValidate onSubmit={handleSubmit}>
                  <div>
                    <Label className='mb-2 block font-medium text-sm uppercase' htmlFor='cdm'>
                      Code Massar
                    </Label>
                    <div className='relative'>
                      <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                        <KeyRound className='h-5 w-5 text-gray-400' />
                      </div>
                      <Input
                        aria-describedby={errors.cdm ? 'cdm-error' : undefined}
                        aria-invalid={!!errors.cdm}
                        autoCapitalize='characters'
                        autoComplete='username'
                        className='block w-full rounded-lg border border-border bg-input py-5 pr-3 pl-12 text-sm'
                        disabled={loading}
                        id='cdm'
                        inputMode='text'
                        name='cdm'
                        onChange={(e) => setUser({ ...user, cdm: e.target.value })}
                        pattern='[Rr]\d{9}'
                        placeholder='R142002537'
                        title='R followed by 9 digits, e.g., R142002537'
                        type='text'
                        value={user.cdm}
                      />
                    </div>
                    {errors.cdm && (
                      <p className='mt-1 text-red-600 text-sm' id='cdm-error'>
                        {errors.cdm}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className='mb-2 block font-medium text-sm uppercase' htmlFor='password'>
                      Mot de passe
                    </Label>
                    <div className='relative'>
                      <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                        <Lock className='h-5 w-5 text-gray-400' />
                      </div>
                      <Input
                        aria-describedby={errors.password ? 'password-error' : undefined}
                        aria-invalid={!!errors.password}
                        autoComplete='current-password'
                        className='block w-full rounded-lg border border-border bg-input py-5 pr-12 pl-12 text-sm'
                        disabled={loading}
                        id='password'
                        name='password'
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        placeholder='**********'
                        type={showPassword ? 'text' : 'password'}
                        value={user.password}
                      />
                      <button
                        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                        className='absolute inset-y-0 right-0 flex items-center pr-3'
                        onClick={() => setShowPassword((s) => !s)}
                        type='button'>
                        {showPassword ? (
                          <EyeOff className='h-5 w-5 text-gray-400' />
                        ) : (
                          <Eye className='h-5 w-5 text-gray-400' />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className='mt-1 text-red-600 text-sm' id='password-error'>
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div className='flex items-center justify-between'>
                    {/** biome-ignore lint/a11y/noLabelWithoutControl: biome does not conside custom components */}
                    <label className='flex items-center text-muted-foreground text-sm'>
                      <Checkbox.Animated />
                      <span className='ml-2'>Se souvenir de moi</span>
                    </label>
                    <a className='text-primary text-sm hover:text-primary/80' href='/'>
                      Mot de passe oublié?
                    </a>
                  </div>

                  <Button
                    className='login-btn relative flex w-full items-center justify-center rounded-lg px-4 py-3 font-medium text-sm text-white transition-all duration-300'
                    disabled={loading}
                    type='submit'>
                    {loading ? (
                      <>
                        <Loader2 className='h-5 w-5 animate-spin' />
                        <span className='ml-2'>Connexion...</span>
                      </>
                    ) : (
                      'Se connecter'
                    )}
                  </Button>

                  <div className='relative text-center text-sm text-stone-500'>
                    <div className='absolute inset-0 flex items-center'>
                      <div className='w-full border-border border-t'></div>
                    </div>
                    <span className='relative px-2'>Ou</span>
                  </div>

                  <StaticButton
                    className='w-full py-5 relative'
                    disabled={loading || googleLoading}
                    onClick={(): void => {
                      handleGoogleSignIn(false)
                    }}
                    type='button'
                    variant='glow'>
                    {googleLoading ? (
                      <>
                        <Loader2 className='h-5 w-5 animate-spin mr-2' />
                        <span>Connexion en cours...</span>
                      </>
                    ) : (
                      <>
                        <span className='mr-2'>Se connecter avec Google</span>
                        <Image
                          alt='Google icon'
                          className='select-none'
                          draggable={false}
                          height={20}
                          src='/icons/google.svg'
                          width={20}
                        />
                      </>
                    )}
                    {retryCount > 0 && (
                      <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {retryCount}
                      </div>
                    )}
                  </StaticButton>
                </form>

                <div className='mt-8 text-center text-muted-foreground text-sm'>
                  Vous n&apos;avez pas encore de compte ?
                  <Link className='ml-1 text-primary hover:text-primary/80' href='/inscription'>
                    Inscrivez-vous ici.
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
