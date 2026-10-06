import { ArrowRight, Coins, Handshake, Heart, Package, Sparkles } from "lucide-react";
import { getSiteData } from "@/lib/site-data";
import { AccentText, SectionHeading } from "@/components/ui/SectionHeading";

const iconClass =
  "size-9 text-lions-blue transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-rotate-12 group-hover:scale-110";

/** Icon chosen per "way to help" in the Studio. */
function WayIcon({ icon }: { icon: string }) {
  const props = { className: iconClass, strokeWidth: 1.6, "aria-hidden": true } as const;
  if (icon === "money") return <Coins {...props} />;
  if (icon === "supplies") return <Package {...props} />;
  if (icon === "sponsor") return <Sparkles {...props} />;
  if (icon === "partner") return <Handshake {...props} />;
  return <Heart {...props} />;
}

/** Enquiries only: no online payments or bank details until the club confirms them (FR18). */
export async function Support() {
  const { support } = (await getSiteData()).home;
  return (
    <section
      id="support"
      aria-labelledby="support-title"
      className="on-light relative isolate bg-lions-yellow text-navy"
    >
      {/* Curved edges */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="absolute inset-x-0 -top-px h-12 w-full text-white sm:h-20"
      >
        <path d="M0 0h1440v20C1080 80 360 80 0 20Z" fill="currentColor" />
      </svg>

      <div className="container-x py-28 sm:py-36">
        <div className="grid items-end gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <SectionHeading
              id="support-title"
              tone="yellow"
              eyebrow={support.eyebrow}
              title={<AccentText text={support.title} />}
              intro={support.intro}
            />
          </div>
          <div data-reveal className="lg:justify-self-end">
            <a href="#enquiry" data-enquiry="support" className="btn bg-navy text-white hover:bg-lions-blue">
              {support.cta}
              <ArrowRight className="size-5" aria-hidden="true" />
            </a>
          </div>
        </div>

        <ul data-stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {support.ways.map((way) => (
            <li
              key={way.title}
              className="group rounded-2xl bg-white/55 p-7 ring-1 ring-navy/10 backdrop-blur transition-colors duration-500 hover:bg-white"
            >
              <WayIcon icon={way.icon} />
              <h3 className="mt-5 text-xl font-bold">{way.title}</h3>
              <p className="mt-2 text-navy/80">{way.body}</p>
            </li>
          ))}
        </ul>
      </div>

      <svg
        aria-hidden="true"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="absolute inset-x-0 -bottom-px h-12 w-full text-white sm:h-20"
      >
        <path d="M0 80h1440V60C1080 0 360 0 0 60Z" fill="currentColor" />
      </svg>
    </section>
  );
}
