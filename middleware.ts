import { type NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import createMiddleware from 'next-intl/middleware'
import { defaultLocale, localePrefix, locales } from './i18n/routing'

const handleI18n = createMiddleware({
  defaultLocale,
  locales,
  localePrefix,
})

function stripLocale(pathname: string) {
  const segments = pathname.split('/')
  const maybeLocale = segments[1]
  const hasLocale = (locales as unknown as string[]).includes(maybeLocale)
  return {
    basePath: hasLocale ? '/' + segments.slice(2).join('/') : pathname,
    locale: hasLocale ? maybeLocale : undefined,
  }
}

export default async function middleware(req: NextRequest) {
  const res = handleI18n(req)

  const { pathname, origin } = req.nextUrl
  const { basePath, locale } = stripLocale(pathname)
  const finalLocale =
    locale ?? req.cookies.get('NEXT_LOCALE')?.value ?? defaultLocale

  // guard /syllabus route
  if (basePath === '/syllabus' || basePath.startsWith('/syllabus/')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token) {
      const loginUrl = new URL(`/${finalLocale}/connexion`, origin)
      loginUrl.searchParams.set('callbackUrl', `/${finalLocale}${basePath}`)
      return NextResponse.redirect(loginUrl)
    }

    return res
  }

  // redirect authenticated users away from /connexion to /syllabus
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (basePath === '/connexion' && token) {
    return NextResponse.redirect(new URL(`/${finalLocale}/syllabus`, origin))
  }

  return res
}

export const config = {
  matcher: '/((?!api|_next|.*\\..*).*)',
}
