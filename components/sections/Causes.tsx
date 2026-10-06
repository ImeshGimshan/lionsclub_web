"use client";

import { useState } from "react";
import { causes, lionsLinks } from "@/lib/content";
import { CauseIcon } from "@/components/ui/CauseIcon";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { AccentText, SectionHeading } from "@/components/ui/SectionHeading";
import type { Heading } from "@/lib/types";

/**
 * The eight Lions global causes. On large screens they form a row of tall
 * panels: the hovered or focused one widens and turns Lions blue, the rest
 * collapse to slim columns with a vertical label. Smaller screens get a plain
 * two-column list with everything visible. All text stays in the DOM, so screen
 * readers hear every cause regardless of which panel is open.
 */
export function Causes({ heading }: { heading: Heading }) {
  const [active, setActive] = useState(0);

  return (
    <section aria-labelledby="causes-title" className="on-light relative overflow-hidden bg-paper py-24 sm:py-32">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            id="causes-title"
            eyebrow={heading.eyebrow}
            title={<AccentText text={heading.title} />}
            intro={heading.intro}
          />
          <ExternalLink
            href={lionsLinks.whatIsALion}
            className="shrink-0 font-semibold text-lions-blue underline-offset-4 hover:underline"
          >
            About Lions International
          </ExternalLink>
        </div>

        <ul data-stagger className="mt-14 grid gap-3 sm:grid-cols-2 lg:flex lg:h-[440px]">
          {causes.map((cause, i) => (
            <li
              key={cause.key}
              data-active={i === active}
              tabIndex={0}
              aria-labelledby={`cause-${cause.key}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={`relative overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-line outline-none focus-visible:ring-4 focus-visible:ring-lions-blue/40 lg:flex lg:min-w-0 lg:flex-[1_1_0%] lg:cursor-default lg:flex-col lg:p-5 lg:transition-[flex-grow,background-color,box-shadow] lg:duration-700 lg:ease-[var(--ease-out-expo)] cause-open:flex-[4.6_1_0%] cause-open:bg-lions-blue cause-open:shadow-[0_30px_60px_-30px_rgb(0_51_141/0.7)] cause-open:ring-lions-blue`}
            >
              {/* Oversized ghost icon behind the open panel. */}
              <CauseIcon
                cause={cause.key}
                strokeWidth={1}
                className={`pointer-events-none absolute -right-12 -bottom-12 hidden size-72 -rotate-12 text-white opacity-0 transition-opacity duration-700 lg:block cause-open:opacity-10`}
              />

              <div className="flex items-center gap-4 lg:flex-col lg:items-start lg:gap-3">
                <span
                  className={`font-serif text-3xl leading-none text-lions-blue italic transition-colors duration-500 cause-open:text-lions-yellow cause-open:text-5xl`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`grid size-12 shrink-0 place-items-center rounded-2xl bg-lions-blue/8 text-lions-blue transition-[background-color,color,transform] duration-500 cause-open:bg-lions-yellow cause-open:text-navy cause-open:-rotate-6`}
                >
                  <CauseIcon cause={cause.key} className="size-6" strokeWidth={1.8} />
                </span>
              </div>

              {/* Collapsed label, read upwards like a book spine. */}
              <span
                aria-hidden="true"
                className={`absolute bottom-5 left-1/2 hidden -translate-x-1/2 rotate-180 text-lg font-bold whitespace-nowrap text-navy transition-opacity duration-300 [writing-mode:vertical-rl] lg:block cause-open:opacity-0`}
              >
                {cause.title}
              </span>

              <div
                className={`mt-5 lg:mt-auto lg:w-[min(21rem,100%)] lg:translate-y-4 lg:opacity-0 lg:transition-[opacity,translate] lg:duration-500 cause-open:translate-y-0 cause-open:opacity-100 cause-open:delay-200`}
              >
                <h3
                  id={`cause-${cause.key}`}
                  className={`text-xl font-bold text-navy lg:text-[1.9rem] lg:leading-tight lg:tracking-[-0.02em] cause-open:text-white`}
                >
                  {cause.title}
                </h3>
                <p className={`mt-2 text-muted lg:text-lg cause-open:text-white/80`}>{cause.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
