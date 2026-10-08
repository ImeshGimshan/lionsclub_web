import { ArrowUp } from "lucide-react";
import { lionsLinks, nav } from "@/lib/content";
import { getSiteData } from "@/lib/site-data";
import { Emblem, FacebookIcon } from "@/components/ui/brand";
import { ExternalLink } from "@/components/ui/ExternalLink";

const clubLinks = [
  ...nav,
  { href: "#officers", label: "Club officers" },
  // The enquiry card replaced the Meetings section; this opens it with "Visiting a meeting" selected.
  { href: "#events", label: "Meetings", enquiry: "meeting" },
  { href: "#support", label: "Support our work" },
];

const resources = [
  { href: lionsLinks.lionsInternational, label: "Lions International" },
  { href: lionsLinks.lionPortal, label: "Lion Portal" },
  { href: lionsLinks.memberResources, label: "Member resources" },
  { href: lionsLinks.brandGuidelines, label: "Brand guidelines" },
];

/** `base` prefixes the in-page links: "" on the homepage, "/" on other pages. */
export async function Footer({ base = "" }: { base?: "" | "/" }) {
  const { club, home } = await getSiteData();
  return (
    <footer className="relative overflow-hidden bg-navy-900 pt-20 text-white">
      <div className="container-x grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-4">
            <span className="grid size-16 shrink-0 place-items-center rounded-full bg-white p-1.5">
              <Emblem size={52} />
            </span>
            <div>
              <p className="text-lg font-bold">{club.name}</p>
              <p className="text-sm text-white/65">
                {club.district} · {club.locality}
              </p>
            </div>
          </div>
          {home.footerTagline ? (
            <p className="mt-6 max-w-sm font-serif text-xl text-lions-yellow italic">{home.footerTagline}</p>
          ) : null}
          <ExternalLink
            href={club.facebook}
            icon={false}
            className="mt-6 rounded-full bg-white/10 px-4 py-2.5 text-sm font-semibold transition hover:bg-lions-yellow hover:text-navy"
          >
            <FacebookIcon className="size-5" />
            Facebook
          </ExternalLink>
        </div>

        <nav aria-label="Footer">
          <p className="eyebrow text-lions-yellow">Our club</p>
          <ul className="mt-5 space-y-2.5">
            {clubLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={base + link.href}
                  data-enquiry={"enquiry" in link ? link.enquiry : undefined}
                  className="text-white/75 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="eyebrow text-lions-yellow">For Lions</p>
          <ul className="mt-5 space-y-2.5">
            {resources.map((link) => (
              <li key={link.href}>
                <ExternalLink href={link.href} className="text-white/75 transition-colors hover:text-white">
                  {link.label}
                </ExternalLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-x mt-16 flex flex-col gap-4 border-t border-white/10 py-6 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {club.name}
          <span aria-hidden="true" className="mx-2">
            ·
          </span>
          <a href="/privacy" className="underline-offset-4 hover:text-white hover:underline">
            Privacy notice
          </a>
        </p>
        <a
          href={base ? "#main" : "#home"}
          className="inline-flex items-center gap-2 font-semibold text-white/75 hover:text-lions-yellow"
        >
          Back to top
          <ArrowUp className="size-4" aria-hidden="true" />
        </a>
      </div>

      <p
        aria-hidden="true"
        className="text-outline-yellow pointer-events-none [--outline-fill:var(--color-navy-900)] -mb-[0.2em] text-center text-[clamp(4rem,19vw,17rem)] leading-none font-black tracking-[-0.04em] whitespace-nowrap uppercase opacity-60 select-none"
      >
        We Serve
      </p>
    </footer>
  );
}
