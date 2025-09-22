import { createNavigation } from 'next-intl/navigation'

interface Lang {
  locale: string
  label: string
  flag: string
  disabled?: boolean
}

export const LANGS: Lang[] = [
  { locale: 'fr', label: 'Français', flag: 'fr' },
  { locale: 'en', label: 'English', flag: 'gb', disabled: true },
  { locale: 'es', label: 'Español', flag: 'es', disabled: true },
  { locale: 'zh', label: '中文', flag: 'cn', disabled: true },
  { locale: 'it', label: 'Italiano', flag: 'it', disabled: true },
  { locale: 'de', label: 'Deutsch', flag: 'de', disabled: true },
  { locale: 'ru', label: 'Русский', flag: 'ru', disabled: true },
  { locale: 'ar', label: 'العربية', flag: 'sa', disabled: true },
  { locale: 'shi', label: 'ⵜⴰⵛⵍⵃⴰⵢⵜ (Tachelhit)', flag: 'ma', disabled: true },
  { locale: 'uk', label: 'Українська', flag: 'ua', disabled: true },
]

export const locales = LANGS.map((l): string => l.locale) as readonly string[]
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = LANGS.find((l): boolean => {
  return l.locale === process.env.NEXT_PUBLIC_DEFAULT_LANG
})?.locale as Locale
export const localePrefix = 'as-needed'

export const { Link, useRouter, usePathname, redirect, permanentRedirect } =
  createNavigation({
    locales,
    localePrefix,
    defaultLocale,
  })
