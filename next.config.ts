import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Skip TypeScript errors during build for now
    ignoreBuildErrors: true,
  },
  eslint: {
    // Skip ESLint errors during build for now
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
