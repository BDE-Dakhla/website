'use client'

import {
  Eye,
  EyeOff,
  FolderOpen,
  GraduationCap,
  KeyRound,
  Loader2,
  Lock,
  MessageCircle,
  Newspaper,
} from 'lucide-react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { treeifyError } from 'zod'
import { Button as StaticButton } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/stateful-button'
import { Link } from '@/i18n/routing'
import { signInSchema } from '@/lib/auth'

type FieldErrors = Partial<{ cdm: string; password: string; form: string }>

export default function SignInPage() {
  const [user, setUser] = useState({ cdm: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const searchParams = useSearchParams()
  const serverError = searchParams.get('error') // e.g. CredentialsSignin

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const parsed = signInSchema.safeParse(user)

    if (!parsed.success) {
      const { properties } = treeifyError(parsed.error)
      return setErrors({
        cdm: properties?.cdm?.errors[0],
        password: properties?.password?.errors[0],
      })
    }

    setLoading(true)

    try {
      await signIn('credentials', {
        cdm: parsed.data.cdm,
        password: parsed.data.password,
        redirectTo: '/syllabus',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4'>
      <div className='z-10 w-full max-w-6xl'>
        <div className='overflow-hidden rounded-[40px] bg-secondary/50 shadow-2xl'>
          <div className='grid min-h-[700px] lg:grid-cols-2'>
            {/* Left Side */}
            <div className="relative m-4 rounded-3xl bg-[linear-gradient(-90deg,rgba(0,0,0,0),rgba(0,0,0,1)),url('/auth.jpg')] bg-center bg-cover bg-no-repeat p-12 text-white">
              <div>
                <div className='mb-12 font-semibold text-lg uppercase'>
                  Syllabus
                </div>
                <h1 className='mb-4 font-bold text-6xl'>
                  Mes cours en un seul lieu
                </h1>
                <p className='mb-12 text-xl opacity-80'>
                  Retrouvez tout vos cours, documents annexes et organisez les
                  comme bon vous semble !
                </p>

                <div className='space-y-6'>
                  {[
                    {
                      icon: <FolderOpen />,
                      title: 'Organisation beaucoup plus fluide',
                      desc: 'Notez vos cours, vos absences... et retrouvez toutes les ressources utiles pour réussir votre année.',
                    },
                    {
                      icon: <MessageCircle />,
                      title: 'Échange direct avec vos professeurs',
                      desc: 'Posez/obtenez des questions/réponses où tout le monde peut y bénéficier.',
                    },
                    {
                      icon: <GraduationCap />,
                      title: 'Outils gratuits à votre disposition',
                      desc: 'Accédez à votre calendrier personnel, votre emploi du temps, ainsi que tout vos cours en quelques clics.',
                    },
                    {
                      icon: <Newspaper />,
                      title: 'Vie estudiantine plus facile que jamais',
                      desc: "Soyez au courant des activités universitaires et parascolaires à l'intérieur du Campus à la minute près.",
                    },
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

            {/* Right Side */}
            <div className='flex flex-col justify-center p-12'>
              <div className='mx-auto w-full max-w-md'>
                <div className='mb-8 text-center'>
                  <h2 className='font-light text-3xl uppercase'>BIENVENUE</h2>
                  <p className='mt-2 text-sm text-stone-600'>
                    Connectez-vous pour accéder à votre espace étudiant
                  </p>
                </div>

                {serverError && (
                  <div className='mb-4 rounded-md bg-red-50 p-3 text-red-700 text-sm'>
                    {serverError === 'CredentialsSignin'
                      ? 'Code Massar ou mot de passe invalide.'
                      : 'Une erreur est survenue. Veuillez réessayer.'}
                  </div>
                )}

                <form className='space-y-6' noValidate onSubmit={handleSubmit}>
                  <div>
                    <Label
                      className='mb-2 block font-medium text-sm uppercase'
                      htmlFor='cdm'>
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
                        onChange={(e) =>
                          setUser({ ...user, cdm: e.target.value })
                        }
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
                    <Label
                      className='mb-2 block font-medium text-sm uppercase'
                      htmlFor='password'>
                      Mot de passe
                    </Label>
                    <div className='relative'>
                      <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                        <Lock className='h-5 w-5 text-gray-400' />
                      </div>
                      <Input
                        aria-describedby={
                          errors.password ? 'password-error' : undefined
                        }
                        aria-invalid={!!errors.password}
                        autoComplete='current-password'
                        className='block w-full rounded-lg border border-border bg-input py-5 pr-12 pl-12 text-sm'
                        disabled={loading}
                        id='password'
                        name='password'
                        onChange={(e) =>
                          setUser({ ...user, password: e.target.value })
                        }
                        placeholder='**********'
                        type={showPassword ? 'text' : 'password'}
                        value={user.password}
                      />
                      <button
                        aria-label={
                          showPassword
                            ? 'Masquer le mot de passe'
                            : 'Afficher le mot de passe'
                        }
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
                      <p
                        className='mt-1 text-red-600 text-sm'
                        id='password-error'>
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div className='flex items-center justify-between'>
                    {/** biome-ignore lint/a11y/noLabelWithoutControl: biome does not conside custom components */}
                    <label className='flex items-center text-muted-foreground text-sm'>
                      <Checkbox />
                      <span className='ml-2'>Se souvenir de moi</span>
                    </label>
                    <a
                      className='text-primary text-sm hover:text-primary/80'
                      href='/'>
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
                    className='w-full py-5'
                    disabled={loading}
                    onClick={async (): Promise<void> => {
                      setLoading(true)
                      try {
                        await signIn('google', { redirectTo: '/syllabus' })
                      } finally {
                        setLoading(false)
                      }
                    }}
                    type='button'
                    variant='glow'>
                    <span className='mr-2'>Se connecter avec Google</span>
                    <Image
                      alt='Google icon'
                      className='select-none'
                      draggable={false}
                      height={20}
                      src='/icons/google.svg'
                      width={20}
                    />
                  </StaticButton>
                </form>

                <div className='mt-8 text-center text-muted-foreground text-sm'>
                  Vous n&apos;avez pas encore de compte ?
                  <Link
                    className='ml-1 text-primary hover:text-primary/80'
                    href='/inscription'>
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
