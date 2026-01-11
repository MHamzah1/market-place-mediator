import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployment
  output: "standalone",
  
  // Disable x-powered-by header for security
  poweredByHeader: false,
  
  // Enable React strict mode
  reactStrictMode: true,
  
  // Disable ESLint during build (optional - remove if you want strict linting)
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript errors during build (optional - remove if you want strict type checking)
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
