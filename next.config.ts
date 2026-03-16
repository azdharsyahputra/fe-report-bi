import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/kyc/images/**',
      },
      {
        protocol: 'https',
        hostname: '**', // Allow production host if needed
        pathname: '/kyc/images/**',
      }
    ],
  },
};

export default nextConfig;
