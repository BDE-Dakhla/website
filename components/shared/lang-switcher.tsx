'use client'

import { useSearchParams } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useMemo } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LANGS, usePathname, useRouter } from '@/i18n/routing'
import { cn } from '@/lib/utils'

function Flag({ code, className }: { code: string; className?: string }) {
  const classes = ['fi', `fi-${code}`, className].filter(Boolean).join(' ')
  return <span aria-hidden className={classes} />
}

interface Props {
  className?: string
}

export function LanguageSwitcher({ className }: Props) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const current = useMemo(
    () => LANGS.find((l) => l.locale === locale) ?? LANGS[0],
    [locale],
  )

  const search = searchParams?.toString()
  const baseHref = search ? `${pathname}?${search}` : pathname

  const selectLang = (next: string): void => {
    if (next !== locale) {
      router.replace(baseHref, { locale: next })
    }
  }

  const Content = (lang: typeof current) => {
    return (
      <>
        <Flag className='mr-1 rounded-xs' code={lang.flag} />
        {lang.label}
      </>
    )
  }

  return (
    <Select onValueChange={selectLang} value={locale}>
      <SelectTrigger
        aria-label='Language'
        className={cn?.('w-38 select-none', className)}>
        <SelectValue placeholder='Language'>
          <Content {...current} />
        </SelectValue>
      </SelectTrigger>

      <SelectContent className='w-56'>
        {LANGS.map((l) => (
          <SelectItem
            className='flex items-center gap-2'
            disabled={l.disabled}
            key={l.locale}
            value={l.locale}>
            <Content {...l} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
