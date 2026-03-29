import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Enable image optimization for Unsplash images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    // Optimize images for production
    formats: ["image/avif", "image/webp"],
  },
  // Enable compression (enabled by default in production)
  compress: true,
  // Production-specific optimizations
  productionBrowserSourceMaps: false,
  // Powered by header for security (removed in Next.js 15+)
  // poweredByHeader: false,
  // Enable static page preloading
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
  // HTTP headers configuration for caching
  async headers() {
    return [
      {
        // Apply caching headers to static assets
        source: "/:path*.(js|css|woff|woff2|ttf|eot|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Apply caching headers to images
        source: "/:path*.(jpg|jpeg|png|gif|webp|avif|svg|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Security headers
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
