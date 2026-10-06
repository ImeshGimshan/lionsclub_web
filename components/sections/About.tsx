import Image from "next/image";
import { Quote } from "lucide-react";
import { lionsLinks } from "@/lib/content";
import { photoProps } from "@/lib/photo";
import { getSiteData } from "@/lib/site-data";
import { AccentText } from "@/components/ui/SectionHeading";
import { ExternalLink } from "@/components/ui/ExternalLink";

const bandLayout = [
  { figure: "sm:aspect-[16/10]", parallax: "0.12", inset: "-inset-y-[8%]", sizes: "(min-width: 640px) 58vw, 100vw" },
  { figure: "sm:aspect-auto", parallax: "0.18", inset: "-inset-y-[10%]", sizes: "(min-width: 640px) 40vw, 100vw" },
];

export async function About() {
  const { club, aboutPhotos, home } = await getSiteData();
  const { about } = home;
  return (
    <section id="about" aria-labelledby="about-title" className="on-light relative bg-white py-24 sm:py-32">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)] lg:self-start">
            <p data-reveal className="eyebrow ornament w-fit text-lions-blue">
              Our club
            </p>
            <h2
              id="about-title"
              data-split
              className="mt-4 text-[clamp(2rem,4.6vw,3.6rem)] leading-[1.05] font-extrabold tracking-[-0.02em] text-navy"
            >
              <AccentText text={about.heading} />
            </h2>
            {about.intro ? (
              <p data-reveal className="mt-6 max-w-md text-muted">
                {about.intro}
              </p>
            ) : null}
          </div>

          <div>
            <p
              data-scrub-words
              className="text-[clamp(1.5rem,2.9vw,2.35rem)] leading-[1.3] font-semibold tracking-[-0.015em] text-navy"
            >
              {about.statement}
            </p>

            <ol data-stagger className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-line sm:grid-cols-2">
              {about.pillars.map((pillar, i) => (
                <li
                  key={pillar.title}
                  className="group relative bg-white p-7 transition-colors duration-500 hover:bg-paper"
                >
                  <span className="font-serif text-2xl text-lions-yellow italic">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 text-xl font-bold text-navy">{pillar.title}</h3>
                  <p className="mt-2 text-muted">{pillar.body}</p>
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-lions-blue transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100"
                  />
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Photo band: clip-reveal on enter, parallax inside the mask. Photos come from Club settings. */}
        {aboutPhotos.length ? (
          <div className={`mt-24 grid gap-4 ${aboutPhotos.length > 1 ? "sm:grid-cols-[1.4fr_1fr]" : ""}`}>
            {aboutPhotos.map((photo, i) => {
              const layout = bandLayout[i] ?? bandLayout[0];
              return (
                <figure
                  key={photo.src}
                  data-clip-reveal
                  className={`relative aspect-[16/10] overflow-hidden rounded-2xl bg-navy ${layout.figure}`}
                >
                  <div data-parallax={layout.parallax} className={`absolute inset-x-0 ${layout.inset}`}>
                    <Image {...photoProps(photo)} alt={photo.alt} fill sizes={layout.sizes} className="object-cover" />
                  </div>
                  {photo.caption ? (
                    <figcaption className="absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-1.5 text-sm font-medium text-navy backdrop-blur">
                      {photo.caption}
                    </figcaption>
                  ) : null}
                </figure>
              );
            })}
          </div>
        ) : null}

        {/* Mission, vision, motto: international statements are labelled and sourced (Section 02). */}
        <div data-stagger className="mt-24 grid gap-5 lg:grid-cols-3">
          <article className="flex flex-col rounded-2xl bg-paper p-8">
            <p className="eyebrow text-lions-blue">Lions International mission</p>
            <p className="mt-1 text-xs font-medium text-muted">Summary</p>
            <p className="mt-5 flex-1 text-lg leading-relaxed text-ink">
              Lions International enables clubs, volunteers and partners to respond to human need through service and
              grant support, connecting healthier lives and stronger communities with peace and understanding across
              borders.
            </p>
            <ExternalLink
              href={lionsLinks.mission}
              className="mt-6 font-semibold text-lions-blue underline-offset-4 hover:underline"
            >
              Read the official mission
            </ExternalLink>
          </article>

          <article className="relative flex flex-col overflow-hidden rounded-2xl bg-lions-blue p-8 text-white">
            <Quote aria-hidden="true" className="absolute -top-2 -right-2 size-32 text-white/10" />
            <p className="eyebrow text-lions-yellow">Vision</p>
            <blockquote className="mt-5 flex-1 font-serif text-[1.7rem] leading-snug italic">
              “To be the global leader in community and humanitarian service.”
            </blockquote>
            <p className="mt-6 text-sm text-white/75">
              — Lions Clubs International.{" "}
              <ExternalLink href={lionsLinks.vision} className="font-semibold text-white underline underline-offset-4">
                Source
              </ExternalLink>
            </p>
          </article>

          <article className="flex flex-col rounded-2xl bg-navy p-8 text-white">
            <p className="eyebrow text-lions-yellow">Motto</p>
            <p className="mt-4 text-[3.4rem] leading-none font-black tracking-[-0.03em] uppercase">We Serve</p>
            <p className="mt-2 text-sm text-white/70">The international motto of Lions Clubs.</p>
            {club.localWording ? (
              <div className="mt-auto border-t border-white/15 pt-5">
                <p className="font-serif text-xl text-lions-yellow italic">“{club.localWording}”</p>
                <p className="mt-1 text-sm text-white/70">Our club’s own words.</p>
              </div>
            ) : null}
          </article>
        </div>
      </div>
    </section>
  );
}
