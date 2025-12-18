import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for better streaming
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  // Image domains if needed
  images: {
    domains: ["greenheck.com"],
  },
};

export default nextConfig;
