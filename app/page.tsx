import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Marquee } from "@/components/Marquee";
import { Choreographer } from "@/components/motion/Choreographer";
import { SanityLiveRefresh } from "@/components/SanityLiveRefresh";
import { About } from "@/components/sections/About";
import { Causes } from "@/components/sections/Causes";
import { Contact } from "@/components/sections/Contact";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Impact } from "@/components/sections/Impact";
import { Join } from "@/components/sections/Join";
import { Officers } from "@/components/sections/Officers";
import { Projects } from "@/components/sections/Projects";
import { Support } from "@/components/sections/Support";
import { siteUrl } from "@/lib/content";
import { getSiteData } from "@/lib/site-data";

// Publishing in Sanity refreshes open tabs immediately via <SanityLiveRefresh /> (and via
// /api/revalidate if a webhook is configured). When nobody has the site open, the cached page
// is rebuilt at most once a minute on the next visit, costing at most one Sanity request a minute.
export const revalidate = 60;

export default async function Home() {
  const { club, albums, officers, home, seo } = await getSiteData();
  // Structured data for search engines, limited to facts shown on the page (requirements SEO03).
  const [locality] = club.locality.split(",");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: club.name,
    url: siteUrl,
    logo: `${siteUrl}/icons/icon-512.png`,
    image: seo.image,
    description: seo.description,
    email: club.email,
    telephone: club.phoneHref.replace(/^tel:/, ""),
    address: { "@type": "PostalAddress", addressLocality: locality.trim(), addressCountry: club.country },
    sameAs: [club.facebook],
    parentOrganization: {
      "@type": "Organization",
      name: "Lions Clubs International",
      url: "https://www.lionsclubs.org",
    },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Header clubName={club.name} tagline={[club.district.replace(/^Lions\s+/i, ""), club.country].join(" · ")} />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Impact />
        {home.marquee.length ? <Marquee words={home.marquee} /> : null}
        <About />
        <Causes heading={home.causes} />
        <Projects />
        <Gallery albums={albums} heading={home.gallery} />
        <Officers officers={officers} serviceYear={club.serviceYear} heading={home.officers} />
        <Join />
        <Support />
        <Contact />
      </main>
      <Footer />
      <Choreographer />
      <SanityLiveRefresh />
    </>
  );
}
