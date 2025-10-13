import type { NextConfig } from 'next'
import { createMDX } from 'fumadocs-mdx/next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  serverExternalPackages: ['pg', 'kysely'],
  transpilePackages: ['geist'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.simpleicons.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.iconify.design',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '9000',
        pathname: '/assets/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },
}

const withMDX = createMDX()
const withNextIntl = createNextIntlPlugin()
export default withMDX(withNextIntl(nextConfig))
