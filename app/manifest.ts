import type { MetadataRoute } from "next";
import { getSiteData } from "@/lib/site-data";

// Name and icons used when someone adds the site to their phone's home screen.
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { club } = await getSiteData();
  return {
    name: club.name,
    short_name: "Lions Dummalasuriya",
    description: `${club.name}, ${club.district}, ${club.locality}`,
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#0d2240",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
