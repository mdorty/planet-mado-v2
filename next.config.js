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
  },
  output: 'standalone',
  assetPrefix: 'https://game.planetmado.com',
  images: {
    unoptimized: true,
    domains: ['game.planetmado.com']
  },
  compress: true
}

module.exports = nextConfig
