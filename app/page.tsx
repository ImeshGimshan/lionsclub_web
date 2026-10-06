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
import { getSiteData } from "@/lib/site-data";

// Publishing in Sanity refreshes open tabs immediately via <SanityLiveRefresh /> (and via
// /api/revalidate if a webhook is configured). When nobody has the site open, the cached page
// is rebuilt at most once a minute on the next visit, costing at most one Sanity request a minute.
export const revalidate = 60;

export default async function Home() {
  const { club, albums, officers, home } = await getSiteData();
  return (
    <>
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
