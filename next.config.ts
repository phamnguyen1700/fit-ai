import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.ignoreWarnings = [
      { module: /node_modules\/antd/ },
    ];
    return config;
  },
  // Suppress deprecation warnings
  reactStrictMode: false,
};

export default nextConfig;
