/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  // Disable static export
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['framer-motion'],
  },
  // Server-side rendering settings
  trailingSlash: true,
  // External packages for server components
  serverExternalPackages: [],
}

module.exports = nextConfig 