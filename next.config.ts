import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  serverExternalPackages: ['pg', 'kysely'],
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
