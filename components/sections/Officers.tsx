"use client";

import Image from "next/image";
import { motion, type Variants } from "motion/react";
import { photoProps } from "@/lib/photo";
import type { Heading, Officer } from "@/lib/types";
import { AccentText, SectionHeading } from "@/components/ui/SectionHeading";

const ease = [0.16, 1, 0.3, 1] as const;
const photo: Variants = { rest: { scale: 1 }, hover: { scale: 1.06, transition: { duration: 0.8, ease } } };
const wash: Variants = { rest: { y: "101%" }, hover: { y: "0%", transition: { duration: 0.6, ease } } };
const line: Variants = { rest: { scaleX: 0.18 }, hover: { scaleX: 1, transition: { duration: 0.6, ease } } };

export function Officers({
  officers,
  serviceYear,
  heading,
}: {
  officers: Officer[];
  serviceYear: string;
  heading: Heading;
}) {
  return (
    <section id="officers" aria-labelledby="officers-title" className="on-light relative bg-paper py-24 sm:py-32">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            id="officers-title"
            eyebrow={`${heading.eyebrow} · ${serviceYear}`}
            title={<AccentText text={heading.title} />}
            intro={heading.intro}
          />
          <span
            data-reveal
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white"
          >
            <span className="size-2 rounded-full bg-lions-yellow" aria-hidden="true" />
            {serviceYear} Board
          </span>
        </div>

        <ul data-stagger className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
          {officers.map((officer) => (
            <li key={officer.id}>
              <motion.figure initial="rest" animate="rest" whileHover="hover" className="group">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-navy">
                  <motion.div variants={photo} className="absolute inset-0">
                    <Image
                      {...photoProps(officer.portrait)}
                      alt={`${officer.name}, ${officer.role}`}
                      fill
                      sizes="(min-width: 1024px) 280px, (min-width: 768px) 30vw, 46vw"
                      className="object-cover"
                    />
                  </motion.div>
                  <motion.div
                    variants={wash}
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-lions-blue/85 to-transparent"
                  />
                </div>
                <figcaption className="mt-4">
                  <p className="text-[0.72rem] font-bold tracking-[0.14em] text-lions-blue uppercase">{officer.role}</p>
                  <p className="mt-1 text-lg leading-snug font-bold text-pretty text-navy">{officer.name}</p>
                  <motion.span
                    variants={line}
                    aria-hidden="true"
                    className="mt-3 block h-[3px] w-full origin-left rounded bg-lions-yellow"
                  />
                </figcaption>
              </motion.figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
