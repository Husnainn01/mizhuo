/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Use React Strict Mode for better development 
  reactStrictMode: true,
  // Enable static exports
  output: 'export',
  // Disable server components for static export
  experimental: {
    appDir: true
  },
  // Required for static export with route groups
  trailingSlash: true,
}

module.exports = nextConfig 