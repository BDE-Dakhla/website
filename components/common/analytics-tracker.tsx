'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

const HEARTBEAT_EVERY = 15_000

interface NavigatorUAData extends Navigator {
  userAgentData?: {
    brands?: { brand: string; version?: string }[]
    platform?: string
    mobile?: boolean
    getHighEntropyValues?: (hints: string[]) => Promise<{
      fullVersionList?: { brand: string; version?: string }[]
    }>
  }
}

let uaChCache: {
  brands?: { brand: string; version?: string }[]
  platform?: string
  mobile?: boolean
} | null = null

async function getUaCh() {
  if (uaChCache) return uaChCache
  try {
    const ua = (navigator as NavigatorUAData).userAgentData
    if (ua) {
      const high = await ua.getHighEntropyValues?.(['fullVersionList'])
      uaChCache = {
        brands: high?.fullVersionList || ua.brands,
        platform: ua.platform,
        mobile: ua.mobile,
      }
      return uaChCache
    }
  } catch {}
  uaChCache = {}
  return uaChCache
}

export async function trackEvent(
  name: string,
  extras?: Record<string, unknown>,
) {
  try {
    const ua = await getUaCh()
    await fetch('/api/analytics/collect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'event',
        event: name,
        path:
          typeof location !== 'undefined'
            ? location.pathname + (location.search || '')
            : '/',
        title: typeof document !== 'undefined' ? document.title : undefined,
        ...extras,
        ua_ch: ua,
      }),
      keepalive: true,
      cache: 'no-store',
    })
  } catch {}
}

async function sendEvent<T>(payload: T) {
  try {
    const ua = await getUaCh()
    await fetch('/api/analytics/collect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, ua_ch: ua }),
      keepalive: true,
      cache: 'no-store',
    })
  } catch {
    // ignore
  }
}

export function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const heartbeatRef = useRef<number | null>(null)
  const lastPathRef = useRef<string>('')

  useEffect(() => {
    const path = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ''}`
    const locale =
      typeof document !== 'undefined'
        ? document.documentElement.lang
        : undefined

    if (path && path !== lastPathRef.current) {
      lastPathRef.current = path
      sendEvent({
        type: 'pageview',
        path,
        title: document?.title,
        referrer: document?.referrer,
        locale,
      })
    }

    if (heartbeatRef.current) {
      window.clearInterval(heartbeatRef.current)
    }

    heartbeatRef.current = window.setInterval(() => {
      sendEvent({ type: 'heartbeat', path, title: document?.title, locale })
    }, HEARTBEAT_EVERY)

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        sendEvent({ type: 'heartbeat', path, title: document?.title, locale })
      }
    }

    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      if (heartbeatRef.current) window.clearInterval(heartbeatRef.current)
    }
  }, [pathname, searchParams])

  return null
}
