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
  // Add this async rewrites function
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/:path*",
      },
      {
        source: "/captured/:path*",
        destination: "http://localhost:8000/captured/:path*",
      },
      {
        source: "/detected/:path*",
        destination: "http://localhost:8000/detected/:path*",
      },
    ];
  },
};

export default nextConfig;
