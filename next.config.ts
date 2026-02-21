import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'couponwala-api.vercel.app',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '*.vercel.app',
        pathname: '/**',
      },
    ],
  },
  // Ensure proper handling for API calls in production
  async rewrites() {
    return [
      // Proxy API calls to the backend (avoids CORS issues)
      {
        source: '/api/auth/:path*',
        destination: 'https://couponwala-api.vercel.app/api/auth/:path*',
      },
      {
        source: '/api/offers/:path*',
        destination: 'https://couponwala-api.vercel.app/api/offers/:path*',
      },
      {
        source: '/api/users/:path*',
        destination: 'https://couponwala-api.vercel.app/api/users/:path*',
      },
      {
        source: '/api/cart/:path*',
        destination: 'https://couponwala-api.vercel.app/api/cart/:path*',
      },
      {
        source: '/api/notifications/:path*',
        destination: 'https://couponwala-api.vercel.app/api/notifications/:path*',
      },
      {
        source: '/api/categories/:path*',
        destination: 'https://couponwala-api.vercel.app/api/categories/:path*',
      },
      {
        source: '/api/wallet/:path*',
        destination: 'https://couponwala-api.vercel.app/api/wallet/:path*',
      },
      {
        source: '/api/payments/:path*',
        destination: 'https://couponwala-api.vercel.app/api/payments/:path*',
      },
      {
        source: '/api/referral/:path*',
        destination: 'https://couponwala-api.vercel.app/api/referral/:path*',
      },
      {
        source: '/api/favorites/:path*',
        destination: 'https://couponwala-api.vercel.app/api/favorites/:path*',
      },
      {
        source: '/api/location/:path*',
        destination: 'https://couponwala-api.vercel.app/api/location/:path*',
      },
      {
        source: '/api/brands/:path*',
        destination: 'https://couponwala-api.vercel.app/api/brands/:path*',
      },
      {
        source: '/api/admin/users/:path*',
        destination: 'https://couponwala-api.vercel.app/api/admin/users/:path*',
      },
    ];
  },
};

export default nextConfig;
