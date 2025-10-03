import type { PermissionMap } from './types/schema'
import { type NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import createMiddleware from 'next-intl/middleware'
import { defaultLocale, localePrefix, locales } from './i18n/routing'
import { hasPermission } from './lib/permission'

const AUTH_ONLY_SEGMENTS = new Set(['syllabus'])

const handleI18n = createMiddleware({ defaultLocale, locales, localePrefix })

function stripLocale(pathname: string) {
  const parts = pathname.split('/').filter(Boolean)
  const hasLocale =
    parts.length && (locales as unknown as string[]).includes(parts[0])
  const rest = hasLocale ? '/' + parts.slice(1).join('/') : pathname
  return { basePath: rest || '/', locale: hasLocale ? parts[0] : undefined }
}

function firstSegment(path: string) {
  const parts = path.split('/').filter(Boolean)
  return parts[0] ?? ''
}

function requiredPermissionKeyForPath(basePath: string): string | null {
  const seg = firstSegment(basePath)
  if (!seg) return null
  return `HAS_ACCESS_TO_${seg.toUpperCase()}`
}

function buildLoginRedirect(
  origin: string,
  locale: string,
  basePath: string,
  search: string,
) {
  const url = new URL(`/${locale}/connexion`, origin)
  url.searchParams.set('callbackUrl', `/${locale}${basePath}${search || ''}`)
  return url
}

export default async function middleware(req: NextRequest) {
  const res = handleI18n(req)

  const { pathname, origin } = req.nextUrl
  const { basePath, locale } = stripLocale(pathname)
  const finalLocale =
    locale ?? req.cookies.get('NEXT_LOCALE')?.value ?? defaultLocale

  const seg = firstSegment(basePath)

  if (AUTH_ONLY_SEGMENTS.has(seg)) {
    const token = await getToken({ req, secret: process.env.AUTH_NEXT_SECRET })
    if (!token) {
      return NextResponse.redirect(
        buildLoginRedirect(origin, finalLocale, basePath, req.nextUrl.search),
      )
    }
    return res
  }

  const requiredKey = requiredPermissionKeyForPath(basePath)
  if (!requiredKey) return res // public

  const token = await getToken({ req, secret: process.env.AUTH_NEXT_SECRET })
  if (!token) {
    return NextResponse.redirect(
      buildLoginRedirect(origin, finalLocale, basePath, req.nextUrl.search),
    )
  }

  const perms = token.perms as PermissionMap | undefined
  if (!hasPermission(perms, requiredKey)) {
    return NextResponse.redirect(new URL(`/${finalLocale}/not-found`, origin))
  }

  return res
}

export const config = {
  matcher: '/((?!api|_next|.*\\..*).*)',
}
