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
  // Explicit settings for client components
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['framer-motion'],
    // Enhanced client manifest generation
    serverComponentsExternalPackages: [],
  },
  // Server-side rendering settings
  trailingSlash: true,
  // External packages for server components
  serverExternalPackages: [],
  poweredByHeader: false,
}

module.exports = nextConfig 