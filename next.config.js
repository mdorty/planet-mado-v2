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
  nextConfig.compress = true
  nextConfig.poweredByHeader = false
  nextConfig.generateEtags = true
  
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
      source: '/favicon.ico',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable'
        }
      ]
    }
  ]
}

module.exports = nextConfig
