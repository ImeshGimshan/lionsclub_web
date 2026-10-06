import { ArrowRight, ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { mailto } from "@/lib/content";
import { getSiteData } from "@/lib/site-data";
import { FacebookIcon, Sunburst } from "@/components/ui/brand";
import { AccentText, SectionHeading } from "@/components/ui/SectionHeading";

const rowClass = "group flex items-center gap-5 rounded-2xl p-4 -mx-4 transition-colors duration-300 hover:bg-white/8";

export async function Contact() {
  const { club, home } = await getSiteData();
  return (
    <section id="contact" aria-labelledby="contact-title" className="on-light bg-white pt-16 pb-24 sm:pb-32">
      <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <SectionHeading
            id="contact-title"
            eyebrow={home.contact.eyebrow}
            title={<AccentText text={home.contact.title} />}
            intro={home.contact.intro}
          />
          <a href="#enquiry" data-enquiry="other" data-reveal className="btn btn-blue mt-8">
            Send us a message
            <ArrowRight className="size-5" aria-hidden="true" />
          </a>
        </div>

        <div
          data-reveal
          className="relative isolate overflow-hidden rounded-[28px] bg-navy p-8 text-white shadow-[0_40px_80px_-40px_rgb(13_34_64/0.8)] sm:p-10"
        >
          <div aria-hidden="true" className="absolute -right-1/3 -bottom-1/2 -z-10 aspect-square w-full opacity-40">
            <Sunburst rays={30} className="sunburst size-full" />
          </div>
          <p className="eyebrow text-lions-yellow">Your club contact · {club.serviceYear}</p>
          <p className="mt-3 text-3xl font-extrabold">{club.secretary.name}</p>
          <p className="text-white/70">
            {club.secretary.role}, {club.name}
          </p>

          <ul className="mt-8 space-y-1">
            <li>
              <a href={club.phoneHref} className={rowClass}>
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-lions-yellow text-navy transition-transform duration-500 group-hover:rotate-[-12deg]">
                  <Phone className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm text-white/65">Call the secretary</span>
                  <span className="block text-lg font-bold">{club.phoneDisplay}</span>
                </span>
              </a>
            </li>
            <li>
              <a href={mailto(club.email, "Enquiry from the website")} className={rowClass}>
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-lions-yellow text-navy transition-transform duration-500 group-hover:rotate-[-12deg]">
                  <Mail className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm text-white/65">Email the club</span>
                  <span className="block text-lg font-bold break-all sm:break-normal">{club.email}</span>
                </span>
              </a>
            </li>
            <li>
              <a href={club.facebook} target="_blank" rel="noopener noreferrer" className={rowClass}>
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-lions-yellow text-navy transition-transform duration-500 group-hover:rotate-[-12deg]">
                  <FacebookIcon className="size-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm text-white/65">Our official Facebook page</span>
                  <span className="block text-lg font-bold">{club.name}</span>
                </span>
                <ArrowUpRight
                  className="size-5 shrink-0 text-white/60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>

          <div className="mt-8 flex items-start gap-3 border-t border-white/15 pt-6 text-sm text-white/70">
            <MapPin className="mt-0.5 size-4 shrink-0 text-lions-yellow" aria-hidden="true" />
            <p>
              {club.locality}
              <br />
              {[club.district, club.multipleDistrict].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
