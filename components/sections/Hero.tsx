import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { photoProps } from "@/lib/photo";
import { getSiteData } from "@/lib/site-data";
import { Emblem, Sunburst } from "@/components/ui/brand";

const delay = (s: number) => ({ animationDelay: `${s}s` });

export async function Hero() {
  const { club, heroPhoto, home } = await getSiteData();
  const { hero } = home;
  return (
    <section
      id="home"
      data-hero
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-navy pt-[calc(var(--header-h)+2.5rem)] pb-24 text-white lg:pt-[calc(var(--header-h)+4.5rem)] lg:pb-44"
    >
      {/* Rays + glow: GSAP turns the wrapper on scroll, CSS spins the rays slowly. */}
      <div
        data-hero-rays
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-[62%] -z-10 aspect-square w-[150vmax] -translate-x-1/2 -translate-y-1/2 opacity-60"
      >
        <Sunburst rays={44} className="sunburst size-full" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_70%_45%,rgb(0_51_141/0.65),transparent_70%),linear-gradient(180deg,transparent_60%,rgb(8_22_41/0.9))]"
      />

      <div className="container-x grid items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div data-hero-copy>
          <p className="eyebrow hero-fade text-lions-yellow" style={delay(0.05)}>
            <span className="h-px w-8 bg-lions-yellow" aria-hidden="true" />
            {[club.district, club.country].join(" · ")}
          </p>

          <h1
            id="hero-title"
            className="mt-6 text-[clamp(2.6rem,5.8vw,4.75rem)] leading-[0.98] font-black tracking-[-0.035em] text-balance"
          >
            <span className="hero-line">
              <span style={delay(0.1)}>{hero.headline}</span>
            </span>
            <span className="hero-line">
              <span style={delay(0.22)} className="font-serif font-normal tracking-[-0.01em] text-lions-yellow italic">
                {hero.accent}
              </span>
            </span>
          </h1>

          <p className="hero-fade mt-6 max-w-xl text-lg leading-relaxed text-white/80" style={delay(0.45)}>
            {hero.intro}
          </p>

          <div className="hero-fade mt-8 flex flex-wrap gap-3" style={delay(0.6)}>
            <a href="#join" className="btn btn-yellow">
              {hero.primaryCta}
              <ArrowRight className="size-5" aria-hidden="true" />
            </a>
            <a href="#projects" className="btn btn-ghost-light">
              {hero.secondaryCta}
            </a>
          </div>
        </div>

        <div data-hero-photo className="relative">
          {/* No fade on the photo: it is the LCP element, so it must paint immediately. */}
          {heroPhoto ? (
            <figure>
              <div className="frame hero-photo relative shadow-[0_40px_90px_-20px_rgb(0_0_0/0.65)]">
                <div className="overflow-hidden rounded-[3px]">
                  <Image
                    {...photoProps(heroPhoto)}
                    alt={heroPhoto.alt}
                    width={heroPhoto.width}
                    height={heroPhoto.height}
                    preload
                    sizes="(min-width: 1240px) 580px, (min-width: 1024px) 48vw, 92vw"
                    className="h-auto w-full"
                  />
                </div>
                {/* Emblem on its own plain disc, clear of the photograph's subjects (BR01). */}
                <div
                  className="hero-fade absolute -top-8 -right-4 grid size-20 place-items-center rounded-full bg-white p-2 shadow-[0_0_0_6px_rgb(13_34_64),0_0_40px_rgb(235_183_0/0.35)] sm:-top-10 sm:-right-8 sm:size-24 sm:p-2.5"
                  style={delay(0.9)}
                >
                  <Emblem size={72} />
                </div>
              </div>
              {heroPhoto.caption ? (
                <figcaption className="mt-5 flex items-start gap-3 text-sm text-white/75">
                  <span className="mt-2 h-px w-6 shrink-0 bg-lions-yellow" aria-hidden="true" />
                  <span>{heroPhoto.caption}</span>
                </figcaption>
              ) : null}
            </figure>
          ) : null}
        </div>
      </div>
    </section>
  );
}
