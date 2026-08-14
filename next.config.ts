import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Backend base URL. Defaults to the Go server's PORT (8080). Override with
    // BACKEND_URL in the environment (e.g. https://api.example.com) when deploying.
    const backendUrl = process.env.BACKEND_URL || 'https://api.shravaniagro.store';
    return [
      {
        source: '/api-proxy/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), payment=()' },
        ],
      },
      {
        source: '/(admin|login)/(.*)',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
    ]
  },
};

export default nextConfig;
