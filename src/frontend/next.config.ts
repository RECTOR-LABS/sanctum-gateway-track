import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Disable ESLint during build (TypeScript handles type checking)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ensure TypeScript errors still fail the build
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
