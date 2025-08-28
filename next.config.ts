import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for iOS builds
  output: process.env.BUILD_TARGET === "ios" ? "export" : undefined,
  trailingSlash: process.env.BUILD_TARGET === "ios" ? true : false,

  // Disable image optimization for static export
  images:
    process.env.BUILD_TARGET === "ios"
      ? {
          unoptimized: true,
        }
      : undefined,

  webpack: (config, { isServer }) => {
    // Handle JSON imports
    config.module.rules.push({
      test: /\.json$/,
      type: "json",
    });

    // Handle Capacitor-specific polyfills for iOS
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
      };
    }

    return config;
  },

  // Environment variable handling
  env: {
    BUILD_TARGET: process.env.BUILD_TARGET || "web",
  },
};

export default nextConfig;
