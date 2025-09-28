'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import confetti, { type Options } from 'canvas-confetti'
import {
  CheckCircle,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  XCircle,
} from 'lucide-react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Link } from '@/i18n/routing'
import { LanguageSwitcher } from '../design/lang-switcher'
import { ThemeSwitcher } from '../design/theme-switcher'
import { Paragraph, Title } from '../design/typography'
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

const socials = (locale: string) => [
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
  },
  {
    name: 'Github',
    href: 'https://github.com/BDE-Dakhla/website',
    icon: Github,
  },
]

const categories = (t: ReturnType<typeof useTranslations>) => [
  {
    title: 'À propos de nous',
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
    form.reset()
    const res = await fetch(`/api/newsletter/subscribe`, {
      method: 'POST',
      body: JSON.stringify({ email: values.email }),
    })

    const position = res.ok ? 'top-center' : 'bottom-right'

    toast(res.ok ? 'Thank you !!!' : 'Something went wrong, please try again', {
      position,
      icon: res.ok ? <CheckCircle /> : <XCircle />,
    })

    if (res.ok) {
      fireConfettiTopCenter()
    }
  }

  return (
    <footer className='container mx-auto mt-10 px-8'>
      <div className='flex flex-col items-start justify-between gap-10 border-gray-200 border-b py-10 text-[15px] text-slate-500 md:flex-row dark:border-slate-600 dark:text-slate-300'>
        <div>
          <Logo />
          <Paragraph className='mt-6'>
            Feature-Rich UI Library - Tailwind CSS Components.
          </Paragraph>
          <Paragraph className='max-w-102.5'>
            Explore a growing library of over 300+ beautifully crafted,
            customizable components built with Tailwind CSS — perfect for any
            project any size.
          </Paragraph>
          <div className='mt-3 flex items-center gap-1.5'>
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
        <div className='flex w-full flex-wrap justify-between gap-6 md:w-1/2'>
          {/* max-md:gap-10 */}
          {categories(t).map((cat) => (
            <div key={cat.title}>
              <Title as='h5' className='mb-2 md:mb-5'>
                {cat.title}
              </Title>
              <ul className='space-y-1'>
                {cat.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      className='block transition hover:text-indigo-500'
                      href={link.href}>
                      {link.name}
                    </Link>
                  </li>
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
                        <FormLabel>Addresse mail</FormLabel>
                        <FormControl>
                          <Input placeholder={t('common.email')} {...field} />
                        </FormControl>
                        <FormMessage className='-bottom-7 absolute max-w-md select-none' />
                      </FormItem>
                    )}
                  />
                  <Button type='submit'>{t('common.subscribe')}</Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-col-reverse items-center justify-between py-4 text-[15px] text-gray-500/90 max-md:gap-2.5 md:flex-row dark:text-slate-300'>
        <p>
          {t('footer.copyright.short')} {new Date().getFullYear()} &copy;{' '}
          {t('footer.copyright.long')}.
        </p>
        <div className='flex divide-x divide-gray-300 text-sm'>
          {socials(locale).map(
            (social): React.ReactNode => (
              <Link
                className='flex items-center gap-x-2 px-6 transition-all hover:text-indigo-500'
                href={social.href}
                key={social.name}
                rel='noreferrer'
                target='_blank'>
                {social.icon ? (
                  <social.icon />
                ) : (
                  <Image
                    alt={social.name}
                    className='text-foreground'
                    height={20}
                    src={`/icons/${social.name.toLowerCase()}.svg`}
                    width={20}
                  />
                )}
                {social.name}
              </Link>
            ),
          )}
        </div>
      </div>
    </footer>
  )
}
