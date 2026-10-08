import type { MetadataRoute } from "next";
import { searchIndexing, siteUrl } from "@/lib/content";

// Crawling stays allowed before launch so search engines can read each page's "noindex".
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: searchIndexing ? `${siteUrl}/sitemap.xml` : undefined,
  };
}
