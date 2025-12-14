import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.ignoreWarnings = [
      { module: /node_modules\/antd/ },
    ];
    return config;
  },

  reactStrictMode: false,

  eslint: {
    ignoreDuringBuilds: true,
  },

  // Thêm proxy để fix lỗi gọi HTTP từ Vercel (HTTPS → HTTP)
  async rewrites() {
    return [
      {
        source: "/api/:path*", 
        destination: "http://52.64.148.181:8080/:path*", // BE thật
      },
    ];
  },
};

export default nextConfig;
