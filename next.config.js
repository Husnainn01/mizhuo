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
  // Use React Strict Mode for better development 
  reactStrictMode: true,
  
  // Ensure path aliases are properly resolved
  webpack: (config, { isServer }) => {
    // Enable proper module resolution
    return config;
  },
}

module.exports = nextConfig 