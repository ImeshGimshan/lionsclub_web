import type { NextConfig } from "next";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "zhxlfgcp";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

const nextConfig: NextConfig = {
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
