export type UAInfo = { browser: string; os: string; device: 'Desktop' | 'Mobile' | 'Tablet' }

export function parseSecChUaBrands(header: string | null | undefined): { brand: string; version?: string }[] {
  if (!header) return []
  const out: { brand: string; version?: string }[] = []
  const re = /\"([^\"]+)\"\s*;\s*v=\"([^\"]+)\"/g
  let m: RegExpExecArray | null
  while ((m = re.exec(header))) {
    out.push({ brand: m[1], version: m[2] })
  }
  return out
}

function pickBrand(brands: { brand: string }[]): string | null {
  if (!brands.length) return null
  const names = brands.map((b) => b.brand)
  const prefer = [
    'Microsoft Edge',
    'Opera',
    'Vivaldi',
    'Brave',
    'Thorium',
    'Arc',
    'Google Chrome',
    'Chromium',
  ]
  for (const p of prefer) {
    const found = names.find((n) => n.toLowerCase() === p.toLowerCase())
    if (found) return found
  }
  const firstReal = names.find((n) => !/not\s+a;?\s*brand/i.test(n))
  return firstReal || names[0]
}

export function parseUserAgent(uaRaw: string | null | undefined, opts?: {
  ua_brands?: { brand: string; version?: string }[] | null
  ua_platform?: string | null
  ua_mobile?: boolean | null
}): UAInfo {
  const ua = (uaRaw || '').toString()
  const lower = ua.toLowerCase()

  // Device (prefer UA-CH)
  let device: UAInfo['device'] = 'Desktop'
  if (opts?.ua_mobile === true) device = 'Mobile'
  else if (/ipad|tablet/.test(lower)) device = 'Tablet'
  else if (/mobi|iphone|ipod|android.+mobile/.test(lower)) device = 'Mobile'

  // OS (prefer UA-CH platform)
  let os = 'Unknown'
  const plat = opts?.ua_platform || ''
  if (plat) {
    const p = plat.toLowerCase()
    if (p.includes('windows')) os = 'Windows'
    else if (p.includes('mac')) os = 'macOS'
    else if (p.includes('android')) os = 'Android'
    else if (p.includes('chrome os')) os = 'ChromeOS'
    else if (p.includes('ios')) os = 'iOS'
    else if (p.includes('linux')) os = 'Linux'
  }
  if (os === 'Unknown') {
    if (/windows nt (10|11|1\d)/i.test(ua)) os = 'Windows 10/11'
    else if (/windows nt 6\.[01]/i.test(ua)) os = 'Windows 7'
    else if (/windows/i.test(ua)) os = 'Windows'
    else if (/mac os x|macintosh/i.test(ua)) os = 'macOS'
    else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS'
    else if (/android/i.test(ua)) os = 'Android'
    else if (/cros/i.test(ua)) os = 'ChromeOS'
    else if (/linux/i.test(ua)) os = 'Linux'
  }

  // Browser (prefer UA-CH brand if present)
  let browser = 'Other'
  const chosenBrand = pickBrand(opts?.ua_brands || [])
  if (chosenBrand) {
    browser = chosenBrand
  } else {
    if (/yabrowser/i.test(ua)) browser = 'Yandex'
    else if (/edg\//i.test(ua) || /edge/i.test(ua)) browser = 'Edge (Chromium)'
    else if (/opr\//i.test(ua) || /opera/i.test(ua)) browser = 'Opera'
    else if (/crios/i.test(ua)) browser = 'Chrome (iOS)'
    else if (/chrome/i.test(ua) && !/edge|edg\//i.test(ua) && !/opr\//i.test(ua)) browser = 'Chrome'
    else if (/fxios/i.test(ua)) browser = 'Firefox (iOS)'
    else if (/firefox/i.test(ua)) browser = 'Firefox'
    else if (/safari/i.test(ua) && !/chrome|crios|opr\//i.test(ua)) browser = 'Safari'
    else if (/os 12_\d+ like mac os x/i.test(ua)) browser = 'iOS (webview)'
  }

  return { browser, os, device }
}

export function detectFromVisitor(input: { user_agent: string | null; ua_brands?: any; ua_platform?: string | null; ua_mobile?: boolean | null }): UAInfo {
  const brands = Array.isArray(input.ua_brands) ? (input.ua_brands as { brand: string; version?: string }[]) : []
  return parseUserAgent(input.user_agent, { ua_brands: brands, ua_platform: input.ua_platform, ua_mobile: input.ua_mobile })
}
