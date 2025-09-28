import { type NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import createMiddleware from 'next-intl/middleware'
import { defaultLocale, localePrefix, locales } from './i18n/routing'
import { PERMISSIONS } from './lib/permission'

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

function requiredMaskForPath(basePath: string): number {
  const seg = firstSegment(basePath)
  if (!seg) return 0
  const key = `HAS_ACCESS_TO_${seg.toUpperCase()}` as keyof typeof PERMISSIONS
  return PERMISSIONS[key] ?? 0
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

    // log-in required
    if (!token) {
      return NextResponse.redirect(
        buildLoginRedirect(origin, finalLocale, basePath, req.nextUrl.search),
      )
    }

    return res // logged in, no extra permission needed
  }

  // guard dashboard route
  const requiredMask = requiredMaskForPath(basePath)
  if (requiredMask === 0) return res // public route, no auth required

  const token = await getToken({ req, secret: process.env.AUTH_NEXT_SECRET })

  if (!token) {
    return NextResponse.redirect(
      buildLoginRedirect(origin, finalLocale, basePath, req.nextUrl.search),
    )
  }

  if (((token.permMask ?? 0) & requiredMask) === 0) {
    return NextResponse.redirect(new URL(`/${finalLocale}/not-found`, origin))
  }

  return res
}

export const config = {
  matcher: '/((?!api|_next|.*\\..*).*)',
}
