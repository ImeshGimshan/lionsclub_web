import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/content";

// The whole site is one page plus the privacy notice. Section anchors are not separate pages (SEO02).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
