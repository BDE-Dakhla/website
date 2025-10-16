'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import confetti, { type Options } from 'canvas-confetti'
import { Facebook, Github, Instagram, Linkedin } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Link } from '@/i18n/routing'
import {
  SubscriptionDialog,
  type SubscriptionStatus,
} from '../newsletter/subscription-dialog'
import { LanguageSwitcher } from '../shared/lang-switcher'
import { ThemeSwitcher } from '../shared/theme-switcher'
import { Paragraph, Title } from '../shared/typography'
import { Button } from '../ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Logo } from './logo'

export const socials = (locale: string) =>
  [
    {
      name: 'Instagram',
      href: `https://www.instagram.com/bde.encgdakhla/?hl=${locale}`,
      icon: Instagram,
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/company/bde-encg-dakhla',
      icon: Linkedin,
    },
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/Bde.EncgDakhla/',
      icon: Facebook,
    },
    {
      name: 'Whatsapp',
      href: 'https://chat.whatsapp.com/DoqXbd8zX7p7rUxOsEGGf9',
      icon: (
        <svg
          aria-label='icon'
          height='20px'
          role='img'
          viewBox='0 0 192 192'
          width='20px'
          xmlns='http://www.w3.org/2000/svg'>
          <path
            clipRule='evenodd'
            d='M96 16c-44.183 0-80 35.817-80 80 0 13.12 3.163 25.517 8.771 36.455l-8.608 36.155a6.002 6.002 0 0 0 7.227 7.227l36.155-8.608C70.483 172.837 82.88 176 96 176c44.183 0 80-35.817 80-80s-35.817-80-80-80ZM28 96c0-37.555 30.445-68 68-68s68 30.445 68 68-30.445 68-68 68c-11.884 0-23.04-3.043-32.747-8.389a6.003 6.003 0 0 0-4.284-.581l-28.874 6.875 6.875-28.874a6.001 6.001 0 0 0-.581-4.284C31.043 119.039 28 107.884 28 96Zm46.023 21.977c11.975 11.974 27.942 20.007 45.753 21.919 11.776 1.263 20.224-8.439 20.224-18.517v-6.996a18.956 18.956 0 0 0-13.509-18.157l-.557-.167-.57-.112-8.022-1.58a18.958 18.958 0 0 0-15.25 2.568 42.144 42.144 0 0 1-7.027-7.027 18.958 18.958 0 0 0 2.569-15.252l-1.582-8.021-.112-.57-.167-.557A18.955 18.955 0 0 0 77.618 52H70.62c-10.077 0-19.78 8.446-18.517 20.223 1.912 17.81 9.944 33.779 21.92 45.754Zm33.652-10.179a6.955 6.955 0 0 1 6.916-1.743l8.453 1.665a6.957 6.957 0 0 1 4.956 6.663v6.996c0 3.841-3.124 6.995-6.943 6.585a63.903 63.903 0 0 1-26.887-9.232 64.594 64.594 0 0 1-11.661-9.241 64.592 64.592 0 0 1-9.241-11.661 63.917 63.917 0 0 1-9.232-26.888C63.626 67.123 66.78 64 70.62 64h6.997a6.955 6.955 0 0 1 6.66 4.957l1.667 8.451a6.956 6.956 0 0 1-1.743 6.917l-1.12 1.12a5.935 5.935 0 0 0-1.545 2.669c-.372 1.403-.204 2.921.603 4.223a54.119 54.119 0 0 0 7.745 9.777 54.102 54.102 0 0 0 9.778 7.746c1.302.806 2.819.975 4.223.603a5.94 5.94 0 0 0 2.669-1.545l1.12-1.12Z'
            fill='currentColor'
            fillRule='evenodd'
          />
        </svg>
      ),
    },
    {
      name: 'Github',
      href: 'https://github.com/BDE-Dakhla/website',
      icon: Github,
    },
  ] as ReadonlyArray<
    Readonly<{
      name: string
      href: string
      // biome-ignore lint/suspicious/noExplicitAny: idk what to do
      icon: React.ReactElement | any
    }>
  >

const categories = (t: ReturnType<typeof useTranslations>) => [
  {
    title: t('footer.aboutUs'),
    links: [
      { name: t('footer.team'), href: '/team' },
      { name: t('footer.partners'), href: '/partners' },
      { name: t('footer.privacy'), href: '/privacy' },
      { name: t('footer.tos.short'), href: '/tos' },
    ],
  },
  {
    title: t('footer.fastLinks'),
    links: [
      { name: t('footer.news'), href: '/news' },
      { name: t('footer.clubs'), href: '/clubs' },
      { name: t('common.syllabus'), href: '/syllabus' },
    ],
  },
]

const fireConfettiTopCenter = () => {
  const base = {
    zIndex: 9999,
    spread: 70,
    startVelocity: 35,
    decay: 0.9,
    angle: 270,
    origin: { x: 0.5, y: 0.05 },
  } satisfies Options

  void confetti({ ...base, particleCount: 90 })
  setTimeout(() => {
    void confetti({ ...base, particleCount: 60, spread: 80 })
  }, 150)
}

export function Footer() {
  const locale = useLocale()
  const t = useTranslations()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<SubscriptionStatus>('success')

  const schema = useMemo(
    () =>
      z.strictObject({
        email: z.email({ error: t('footer.newsletter.invalidEmail') }),
      }),
    [t],
  )

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
    mode: 'onChange',
  })

  const subscribeToNewsletteer = async (
    values: z.infer<typeof schema>,
  ): Promise<void> => {
    try {
      const res = await fetch(`/api/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email }),
      })

      const data = await res.json()

      if (res.ok) {
        form.reset()

        if (data.message === 'already_subscribed') {
          setSubscriptionStatus('already_subscribed')
        } else {
          setSubscriptionStatus('success')
          fireConfettiTopCenter()
        }

        setDialogOpen(true)
      } else {
        setSubscriptionStatus('error')
        setDialogOpen(true)
      }
    } catch {
      setSubscriptionStatus('error')
      setDialogOpen(true)
    }
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  return (
    <footer className='container mx-auto mt-8 px-8'>
      <div className='flex flex-col items-start justify-between gap-10 border-primary/20 border-b py-10 text-[15px] text-slate-500 md:flex-row dark:border-primary/15 dark:text-slate-300'>
        <div>
          <Logo />
          <Paragraph className='mt-6'>{t('footer.bdeTitle')}</Paragraph>
          <Paragraph className='max-w-102.5'>
            {t('footer.bdeDescription')}
          </Paragraph>
          <div className='mt-4 flex items-center gap-2'>
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
        <div className='flex w-full flex-wrap justify-between gap-6 md:w-1/2'>
          {categories(t).map((cat) => (
            <div key={cat.title}>
              <Title as='h5' className='mb-2 md:mb-5'>
                {cat.title}
              </Title>
              <ul className='space-y-1'>
                {cat.links.map((link) => (
                  <Link
                    className='block transition hover:text-[#69B755]'
                    href={link.href}
                    key={link.name}>
                    {link.name}
                  </Link>
                ))}
              </ul>
            </div>
          ))}
          <div className='max-w-80'>
            <Title as='h5'>{t('footer.newsletter.title')} !</Title>
            <div className='space-y-2'>
              <Paragraph>{t('footer.newsletter.description')}</Paragraph>
              <Form {...form}>
                <form
                  className='relative flex items-end gap-2 pt-4 text-sm'
                  onSubmit={form.handleSubmit(subscribeToNewsletteer)}>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('common.emailAddress')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('common.email')} {...field} />
                        </FormControl>
                        <FormMessage className='-bottom-7 absolute max-w-md select-none' />
                      </FormItem>
                    )}
                  />
                  <Button disabled={form.formState.isSubmitting} type='submit'>
                    {form.formState.isSubmitting ? (
                      <>
                        <svg
                          aria-label='icon loading'
                          className='mr-2 h-4 w-4 animate-spin'
                          fill='none'
                          role='img'
                          viewBox='0 0 24 24'
                          xmlns='http://www.w3.org/2000/svg'>
                          <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='4'
                          />
                          <path
                            className='opacity-75'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                            fill='currentColor'
                          />
                        </svg>
                        {t('common.subscribe')}
                      </>
                    ) : (
                      t('common.subscribe')
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-col-reverse items-center justify-between py-4 text-[15px] text-gray-500/90 max-md:gap-2.5 md:flex-row md:items-start lg:items-center dark:text-slate-300'>
        <p className='text-center md:text-left'>
          {t('footer.copyright.short')} {new Date().getFullYear()} &copy;{' '}
          {t('footer.copyright.long')}.
        </p>
        <div className='mb-2 flex flex-wrap justify-center gap-2 gap-y-4 divide-x divide-primary/15 text-sm md:justify-end'>
          {socials(locale).map(
            ({ icon: Icon, name, href }): React.ReactNode => {
              const iconRender = Icon.type !== 'svg' ? <Icon /> : Icon
              return (
                <Link
                  className='flex items-center gap-x-2 px-6 transition-all hover:text-[#69B755]'
                  href={href}
                  key={name}
                  rel='noreferrer'
                  target='_blank'>
                  {iconRender}
                  {name}
                </Link>
              )
            },
          )}
        </div>
      </div>

      <SubscriptionDialog
        onClose={handleDialogClose}
        open={dialogOpen}
        status={subscriptionStatus}
      />
    </footer>
  )
}
