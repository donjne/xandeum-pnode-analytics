/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable TypeScript errors during builds (optional)
  typescript: {
    // ignoreBuildErrors: true, // Uncomment if needed
  },

  // Image optimization
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },

  // Environment variables available to browser
  env: {
    NEXT_PUBLIC_SEED_PNODE_IP: process.env.NEXT_PUBLIC_SEED_PNODE_IP || '109.199.96.218',
    NEXT_PUBLIC_RPC_PORT: process.env.NEXT_PUBLIC_RPC_PORT || '6000',
    NEXT_PUBLIC_POLL_INTERVAL: process.env.NEXT_PUBLIC_POLL_INTERVAL || '30000',
    NEXT_PUBLIC_API_TIMEOUT: process.env.NEXT_PUBLIC_API_TIMEOUT || '10000',
  },

  // Experimental features
  experimental: {
    // Enable if needed
  },
};

module.exports = nextConfig;