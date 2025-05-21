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
  // Explicitly disable output mode
  output: undefined,
  // Simplify experimental config
  experimental: {
    // Keep only what's essential
    optimizePackageImports: ['framer-motion'],
  },
  // Server-side rendering settings
  trailingSlash: true,
  // External packages for server components
  serverExternalPackages: [],
  poweredByHeader: false,
}

module.exports = nextConfig 