'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

const HEARTBEAT_EVERY = 15_000 // 15s

let uaChCache: {
  brands?: { brand: string; version?: string }[]
  platform?: string
  mobile?: boolean
} | null = null

async function getUaCh() {
  if (uaChCache) return uaChCache
  try {
    const ua = (navigator as any).userAgentData
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

export async function trackEvent(name: string, extras?: Record<string, any>) {
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

async function sendEvent(payload: any) {
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
    const path = `${pathname}${searchParams?.toString() ? '?' + searchParams.toString() : ''}`
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

  // Optionally expose a global helper for triggering events manually in dev
  // @ts-expect-error
  if (typeof window !== 'undefined' && !window.baTrack) {
    // @ts-expect-error
    window.baTrack = (name: string, extras?: Record<string, any>) =>
      trackEvent(name, extras)
  }
  return null
}
