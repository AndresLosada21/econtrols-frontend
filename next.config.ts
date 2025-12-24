import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Configure image domains for Strapi
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '*.strapi.io',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
