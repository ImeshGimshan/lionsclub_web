import type { NextConfig } from "next";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "zhxlfgcp";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

// Standard hardening headers. A full Content-Security-Policy is left out on purpose: the page relies on
// inline styles and scripts from Next.js and the animation libraries, and a strict policy would need
// nonces on every request, which would stop the page being served from the cache.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The site is never meant to be shown inside another site's frame (clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    // Club photos live in Sanity. next/image resizes and caches them, so visitors
    // load images from this site rather than from cdn.sanity.io directly.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: `/images/${projectId}/${dataset}/**`,
      },
    ],
  },
};

export default nextConfig;
