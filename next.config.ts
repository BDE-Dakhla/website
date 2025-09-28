import type { NextConfig } from 'next'
import { createMDX } from 'fumadocs-mdx/next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  serverExternalPackages: ['pg', 'kysely'],
  transpilePackages: ['geist'],
}

const withMDX = createMDX()
const withNextIntl = createNextIntlPlugin()
export default withMDX(withNextIntl(nextConfig))
