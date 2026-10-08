import type { Metadata, Viewport } from "next";
import { Libre_Bodoni, Roboto } from "next/font/google";
import { Providers } from "@/components/motion/Providers";
import { searchIndexing, siteUrl } from "@/lib/content";
import { getSiteData } from "@/lib/site-data";
import "./globals.css";

// Self-hosted at build time by next/font. Roboto is the spec's typeface;
// Libre Bodoni italic is the accent face. Only the italic is used, so only it is loaded.
const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

const accent = Libre_Bodoni({
  subsets: ["latin"],
  style: "italic",
  variable: "--font-accent",
  display: "swap",
});

// Title, description and sharing image are edited in Sanity (Club settings → Search & sharing).
export async function generateMetadata(): Promise<Metadata> {
  const { seo, club } = await getSiteData();
  const images = seo.image ? [{ url: seo.image, width: 1200, height: 630, alt: club.name }] : undefined;
  return {
    metadataBase: new URL(siteUrl),
    alternates: { canonical: "/" },
    title: seo.title,
    description: seo.description,
    openGraph: {
      type: "website",
      url: "/",
      siteName: club.name,
      title: seo.title,
      description: seo.description,
      images,
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description, images: seo.image },
    // Out of search results until launch (SEO02); see `searchIndexing` in lib/content.ts.
    robots: { index: searchIndexing, follow: searchIndexing },
  };
}

export const viewport: Viewport = {
  themeColor: "#0d2240",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-LK" className={`${roboto.variable} ${accent.variable} antialiased`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
