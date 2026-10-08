"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Endless "We Serve" ribbon. It drifts on its own, speeds up with scroll
 * velocity and flips direction when the visitor scrolls back up.
 */
export function Marquee({ words, tone = "navy" }: { words: string[]; tone?: "navy" | "yellow" }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const loop = gsap.to(track.current, { xPercent: -50, duration: 40, ease: "none", repeat: -1, paused: true });
        let direction = 1;
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          // Only animate while the ribbon is on screen, so it costs nothing elsewhere on the page.
          onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
          onUpdate: (self) => {
            if (self.direction !== direction) direction = self.direction;
            const boost = gsap.utils.clamp(1, 6, 1 + Math.abs(self.getVelocity()) / 400);
            gsap.to(loop, { timeScale: boost * direction, duration: 0.25, overwrite: true });
            gsap.to(loop, { timeScale: direction, duration: 1.2, delay: 0.25, overwrite: false });
          },
        });
        if (st.isActive) loop.play();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const yellow = tone === "yellow";
  const sequence = (copy: number) =>
    words.map((word, i) => (
      <span key={`${copy}-${i}`} className="flex items-center gap-8 pr-8">
        <span className={i % 2 === 0 ? "" : yellow ? "text-outline" : "text-outline-yellow"}>{word}</span>
        <span aria-hidden="true" className={yellow ? "text-lions-blue" : "text-lions-yellow"}>
          ✦
        </span>
      </span>
    ));

  return (
    <div
      ref={root}
      aria-hidden="true"
      className={`relative overflow-hidden py-6 select-none ${
        yellow
          ? "bg-lions-yellow text-navy [--outline-fill:var(--color-lions-yellow)]"
          : "bg-navy text-white [--outline-fill:var(--color-navy)]"
      }`}
    >
      <div
        ref={track}
        className="flex w-max text-[clamp(2.2rem,6vw,4.5rem)] leading-none font-black tracking-[-0.02em] whitespace-nowrap uppercase"
      >
        {sequence(0)}
        {sequence(1)}
      </div>
    </div>
  );
}
