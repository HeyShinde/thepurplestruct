import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    dangerouslyAllowSVG: true,
  },
  turbopack: {
    resolveAlias: {
      '@vercel/turbopack-next/internal/font/google/font': 'next/font/google',
    },
  },
  // Remove X-Powered-By header for security
  poweredByHeader: false,
  productionBrowserSourceMaps: true,
  async redirects() {
    return [
      {
        source: '/blog/cpu-vs-gpu-vs-tpu-vs-npu-ai-hardware-architecture-guide-2025',
        destination: 'https://www.eigenstate.dev/essay/cpu-vs-gpu-vs-tpu-vs-npu-ai-hardware-architecture-guide-2026',
        permanent: true, // 301 redirect — transfers SEO authority
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
