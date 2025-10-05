import { createNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'

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

const envDefault = process.env.NEXT_PUBLIC_DEFAULT_LANG
const fallbackDefault = LANGS[0].locale
export const defaultLocale: string = LANGS.some((l) => l.locale === envDefault)
  ? (envDefault as string)
  : fallbackDefault

export const localePrefix = 'as-needed' as const

export const routing = defineRouting({
  locales: LANGS.map((l): string => l.locale),
  defaultLocale,
  localePrefix,
})

export const locales = routing.locales as readonly string[]
export type Locale = (typeof locales)[number]

export const {
  Link,
  useRouter,
  getPathname,
  usePathname,
  redirect,
  permanentRedirect,
} = createNavigation(routing)
