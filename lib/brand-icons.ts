const simple = (slug: string, color?: string) =>
  color
    ? `https://cdn.simpleicons.org/${slug}/${color.replace('#', '')}`
    : `https://cdn.simpleicons.org/${slug}`

const iconify = (name: string, color?: string) =>
  `https://api.iconify.design/${name}.svg${color ? `?color=${encodeURIComponent(color)}` : ''}`

// browser brand mapping (prefer UA-CH brand names; fallback to generic slugs)
export function browserIconUrl(brand: string): string {
  const b = (brand || '').toLowerCase()
  const normalized = b.replace(/\s+browser$/, '')

  const map: Record<string, string> = {
    'google chrome': 'googlechrome',
    chromium: 'chromium',
    'microsoft edge': 'microsoftedge',
    edge: 'microsoftedge',
    brave: 'brave',
    vivaldi: 'vivaldi',
    opera: 'opera',
    yandex: 'yandex',
    firefox: 'firefox',
    safari: 'safari',
    arc: 'arc',
    thorium: 'chromium',
    'chrome (ios)': 'googlechrome',
  }
  const slug =
    map[normalized] ||
    map[normalized.replace(/ \(.*\)$/, '')] ||
    map[b] ||
    map[b.replace(/ \(.*\)$/, '')]
  return slug ? simple(slug) : simple('googlechrome')
}

export function osIconUrl(os: string): string {
  const o = (os || '').toLowerCase()
  const map: Record<string, string> = {
    'windows 10/11': 'windows',
    windows: 'windows',
    macos: 'apple',
    ios: 'apple',
    android: 'android',
    linux: 'linux',
    chromeos: 'googlechrome',
  }
  const key = map[o] || map[o.split(' ')[0]]
  return key ? simple(key) : iconify('lucide:laptop')
}

export function deviceIconUrl(device: string): string {
  switch (device) {
    case 'Desktop':
      return iconify('lucide:monitor')
    case 'Mobile':
      return iconify('lucide:smartphone')
    case 'Tablet':
      return iconify('lucide:tablet')
    default:
      return iconify('lucide:laptop')
  }
}
