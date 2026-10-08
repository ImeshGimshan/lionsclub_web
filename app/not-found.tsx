import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, HandHeart, Images, Users } from "lucide-react";
import { Emblem, Sunburst } from "@/components/ui/brand";
import { getSiteData } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Page not found",
};

const links = [
  { href: "/#projects", label: "Our projects", Icon: Images },
  { href: "/#join", label: "Get involved", Icon: Users },
  { href: "/#support", label: "Support our work", Icon: HandHeart },
];

export default async function NotFound() {
  const { club } = await getSiteData();
  return (
    <main
      id="main"
      className="on-dark relative isolate grid min-h-svh place-items-center overflow-hidden bg-navy px-4 py-16 text-center text-white"
    >
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -z-10 aspect-square w-[150vmax] -translate-1/2 opacity-30"
      >
        <Sunburst rays={36} className="sunburst size-full" />
      </div>

      <div className="max-w-xl">
        <Link href="/" className="mx-auto grid size-24 place-items-center rounded-full bg-white p-2 shadow-xl">
          <Emblem size={80} />
          <span className="sr-only">{club.name} homepage</span>
        </Link>
        <p className="mt-10 eyebrow justify-center text-lions-yellow">Error 404</p>
        <h1 className="mt-4 text-[clamp(2.4rem,7vw,4.2rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-balance">
          This page has wandered off.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-white/80">
          The link may be old or mistyped. Everything about the {club.name} is on the homepage.
        </p>
        <Link href="/" className="btn btn-yellow mt-9">
          <ArrowLeft className="size-5" aria-hidden="true" />
          Go to the homepage
        </Link>
        <ul className="mt-10 flex flex-wrap justify-center gap-3">
          {links.map(({ href, label, Icon }) => (
            <li key={href}>
              <a
                href={href}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-semibold ring-1 ring-white/20 transition-colors hover:bg-white/20"
              >
                <Icon className="size-4 text-lions-yellow" aria-hidden="true" />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
