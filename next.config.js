/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      enabled: true
    }
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  }
}

// Add production-specific configurations
if (process.env.NODE_ENV === 'production') {
  nextConfig.output = 'standalone'
  nextConfig.distDir = '.next'
  nextConfig.images = {
    unoptimized: true,
    domains: ['game.planetmado.com'],
    minimumCacheTTL: 60
  }
  // Copy public and static files
  nextConfig.assetPrefix = ''
  nextConfig.basePath = ''
  nextConfig.compress = true
  nextConfig.poweredByHeader = false
  nextConfig.generateEtags = true
  nextConfig.swcMinify = true
  
  // Cache settings
  nextConfig.headers = async () => [
    {
      source: '/_next/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable'
        }
      ]
    },
    {
      source: '/images/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=86400, must-revalidate'
        }
      ]
    },
    {
      source: '/api/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store, max-age=0'
        }
      ]
    }
  ]
}

module.exports = nextConfig
