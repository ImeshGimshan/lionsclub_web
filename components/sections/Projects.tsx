import Image from "next/image";
import { HandHeart, Leaf, MapPin, Sparkles, Users, Utensils } from "lucide-react";
import { photoProps } from "@/lib/photo";
import { getSiteData } from "@/lib/site-data";
import type { ServiceRecord } from "@/lib/types";
import { FacebookIcon } from "@/components/ui/brand";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { AccentText, SectionHeading } from "@/components/ui/SectionHeading";

function Media({ record }: { record: ServiceRecord }) {
  if (record.photo) {
    const portrait = record.photo.height > record.photo.width;
    return (
      <figure>
        <div
          data-clip-reveal
          className={`relative overflow-hidden rounded-2xl bg-navy ${portrait ? "aspect-[4/5]" : "aspect-[4/3]"}`}
        >
          <div data-parallax="0.14" className="absolute -inset-y-[9%] inset-x-0">
            <Image
              {...photoProps(record.photo)}
              alt={record.photo.alt}
              fill
              sizes="(min-width: 1024px) 40vw, 92vw"
              className="object-cover"
            />
          </div>
        </div>
        {record.photo.caption ? (
          <figcaption className="mt-3 text-sm text-muted">{record.photo.caption}</figcaption>
        ) : null}
      </figure>
    );
  }

  // Honest non-photo treatment until a matching photograph is approved (FR09).
  return (
    <figure>
      <div
        data-clip-reveal
        className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-2xl bg-lions-yellow text-navy"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgb(255_255_255/0.45),transparent_55%)]"
        />
        <div className="relative text-center">
          <span className="mx-auto grid size-24 place-items-center rounded-full bg-navy text-lions-yellow shadow-xl">
            <IllustrationIcon category={record.category} />
          </span>
          {record.stat ? (
            <>
              <p className="mt-5 text-[4.5rem] leading-none font-black tracking-[-0.04em]">{record.stat.value}</p>
              <p className="mt-1 text-lg font-semibold">{record.stat.unit}</p>
            </>
          ) : (
            <p className="mt-5 px-6 text-2xl font-extrabold">{record.project}</p>
          )}
        </div>
      </div>
    </figure>
  );
}

function IllustrationIcon({ category }: { category: string }) {
  const props = { className: "size-11", strokeWidth: 1.6, "aria-hidden": true } as const;
  if (category === "Hunger" || category === "Community care") return <Utensils {...props} />;
  if (category === "Environment") return <Leaf {...props} />;
  if (category === "Humanitarian" || category === "Community wellbeing") return <HandHeart {...props} />;
  return <Sparkles {...props} />;
}

export async function Projects() {
  const { club, records, home } = await getSiteData();
  return (
    <section id="projects" aria-labelledby="projects-title" className="on-light relative bg-white py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          id="projects-title"
          eyebrow={home.projects.eyebrow}
          title={<AccentText text={home.projects.title} />}
          intro={home.projects.intro}
        />

        <div data-timeline className="relative mt-20">
          {/* Track + scroll-driven fill */}
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-[11px] w-[3px] rounded bg-line lg:left-1/2 lg:-translate-x-1/2"
          >
            <div data-timeline-fill className="h-full w-full origin-top rounded bg-lions-yellow" />
          </div>

          <ol className="space-y-20 lg:space-y-28">
            {records.map((record, i) => {
              const flip = i % 2 === 1;
              return (
                <li key={record.id} className="relative pl-12 lg:pl-0">
                  <span
                    aria-hidden="true"
                    className="absolute top-1.5 left-0 grid size-[25px] place-items-center rounded-full bg-white ring-[3px] ring-lions-blue lg:left-1/2 lg:-translate-x-1/2"
                  >
                    <span className="size-2.5 rounded-full bg-lions-yellow" />
                  </span>

                  <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-24">
                    <article data-reveal className={flip ? "lg:order-2" : "lg:text-right"}>
                      <div className={`flex flex-wrap items-center gap-2 ${flip ? "" : "lg:justify-end"}`}>
                        <time
                          dateTime={record.dateISO}
                          className="rounded-full bg-lions-yellow px-3.5 py-1 text-sm font-bold text-navy"
                        >
                          {record.date}
                        </time>
                        <span className="rounded-full bg-lions-blue/8 px-3.5 py-1 text-sm font-semibold text-lions-blue">
                          {record.category}
                        </span>
                      </div>
                      <h3 className="mt-5 text-[clamp(1.6rem,3vw,2.3rem)] leading-tight font-extrabold tracking-[-0.02em] text-navy">
                        {record.project}
                      </h3>
                      <p
                        className={`mt-2 flex items-center gap-1.5 font-medium text-muted ${flip ? "" : "lg:justify-end"}`}
                      >
                        <MapPin className="size-4 shrink-0 text-lions-blue" aria-hidden="true" />
                        {record.place}
                      </p>
                      <p className="mt-4 text-lg leading-relaxed text-ink">{record.summary}</p>

                      {record.stat ? (
                        <p className={`mt-6 flex items-baseline gap-3 ${flip ? "" : "lg:justify-end"}`}>
                          <span className="text-5xl font-black tracking-[-0.04em] text-lions-blue tabular-nums">
                            <span key={record.stat.value} data-count={record.stat.value}>
                              {record.stat.value}
                            </span>
                          </span>
                          <span className="font-semibold text-navy">{record.stat.unit}</span>
                        </p>
                      ) : null}

                      {record.facts.length ? (
                        <ul className="mt-4 space-y-1.5 text-muted">
                          {record.facts.map((fact) => (
                            <li key={fact}>{fact}</li>
                          ))}
                        </ul>
                      ) : null}

                      {record.partner ? (
                        <p
                          className={`mt-5 inline-flex items-center gap-2 rounded-xl bg-paper px-4 py-2.5 text-sm font-semibold text-navy`}
                        >
                          <Users className="size-4 text-lions-blue" aria-hidden="true" />
                          {record.partner}
                        </p>
                      ) : null}
                    </article>

                    <div className={flip ? "lg:order-1" : ""}>
                      <Media record={record} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div data-reveal className="mt-20 flex justify-center">
          <ExternalLink href={club.facebook} icon={false} className="btn btn-blue">
            <FacebookIcon className="size-5" />
            Follow our projects
          </ExternalLink>
        </div>
      </div>
    </section>
  );
}
