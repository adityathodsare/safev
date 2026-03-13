import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["images.pexels.com", "images.unsplash.com"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
