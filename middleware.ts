import type { PermissionMap } from './types/schema'
import { type NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { hasPermission } from './lib/permission'

const { locales, defaultLocale } = routing
const handleI18n = createMiddleware(routing)

const AUTH_ONLY_SEGMENTS = new Set(['syllabus']) // login-only segments (no specific permission, just must be logged in)
const PUBLIC_SEGMENTS = new Set(['connexion', 'not-found']) // always public, never guard those

const PERMISSION_KEYS_BY_SEGMENT: Record<string, string> = {
  dashboard: 'HAS_ACCESS_TO_DASHBOARD',
}

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
  if (!seg || PUBLIC_SEGMENTS.has(seg)) return null
  return PERMISSION_KEYS_BY_SEGMENT[seg] ?? null // unknown segments are public
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
  if (PUBLIC_SEGMENTS.has(seg)) return res

  const requiredKey = requiredPermissionKeyForPath(basePath)

  // only fetch token if we actually need it
  const needsAuth = AUTH_ONLY_SEGMENTS.has(seg) || !!requiredKey
  const token = needsAuth
    ? await getToken({ req, secret: process.env.AUTH_NEXT_SECRET })
    : null

  if (AUTH_ONLY_SEGMENTS.has(seg)) {
    if (!token) {
      return NextResponse.redirect(
        buildLoginRedirect(origin, finalLocale, basePath, req.nextUrl.search),
      )
    }
    return res
  }

  if (!requiredKey) return res // public route

  if (!token) {
    return NextResponse.redirect(
      buildLoginRedirect(origin, finalLocale, basePath, req.nextUrl.search),
    )
  }

  const permissions = token.permissions as PermissionMap | undefined
  if (!hasPermission(permissions, requiredKey)) {
    return NextResponse.redirect(new URL(`/${finalLocale}/not-found`, origin))
  }

  return res
}

export const config = {
  matcher: '/((?!api|_next|.*\\..*).*)',
}
