"use client";

import { gsap, MOTION_OK, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Wires every scroll-driven animation on the page from data attributes, so the
 * sections themselves can stay server components:
 *
 *   data-split          heading lines rise out of a mask
 *   data-reveal         element fades up when it enters ("fade": opacity only, so its
 *                       position stays fixed for in-page links that jump to it)
 *   data-stagger        direct children fade up one after another
 *   data-count          number counts up from 0 to its rendered value
 *   data-scrub-words    words brighten as the paragraph scrolls through
 *   data-parallax="n"   element drifts by n * 100% of its height while in view
 *   data-clip-reveal    image wipes open from the bottom
 *   data-timeline       its [data-timeline-fill] child grows with scroll
 *   data-draw           SVG path strokes draw in
 *   data-hero-*         hero copy and photo ease away as you leave the hero
 *   data-progress       page scroll progress bar
 *
 * Nothing runs when the visitor prefers reduced motion.
 */
export function Choreographer() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      const enter = (trigger: Element, start = "top 86%") => ({ trigger, start, once: true });

      gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.1,
              ease: "expo.out",
              stagger: 0.09,
              scrollTrigger: enter(el),
            }),
        });
      });

      const revealY = (_: number, el: HTMLElement) => (el.dataset.reveal === "fade" ? 0 : 36);
      gsap.set("[data-reveal]", { autoAlpha: 0, y: revealY });
      ScrollTrigger.batch("[data-reveal]", {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { autoAlpha: 0, y: revealY },
            { autoAlpha: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.08, overwrite: true },
          ),
      });

      gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((group) => {
        gsap.from(group.children, {
          autoAlpha: 0,
          y: 40,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.07,
          scrollTrigger: enter(group),
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count);
        const counter = { value: 0 };
        el.textContent = "0";
        gsap.to(counter, {
          value: target,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: enter(el, "top 92%"),
          onUpdate: () => {
            el.textContent = Math.round(counter.value).toLocaleString("en-LK");
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-scrub-words]").forEach((el) => {
        // aria "hidden": screen readers get one hidden copy of the sentence instead of an
        // aria-label on the <p>, which is not allowed on paragraphs.
        const split = SplitText.create(el, { type: "words", aria: "hidden" });
        gsap.fromTo(
          split.words,
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const amount = Number(el.dataset.parallax || 0.12) * 100;
        gsap.fromTo(
          el,
          { yPercent: -amount / 2 },
          {
            yPercent: amount / 2,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-clip-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.4,
            ease: "expo.inOut",
            scrollTrigger: enter(el, "top 82%"),
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-timeline]").forEach((line) => {
        const fill = line.querySelector("[data-timeline-fill]");
        if (!fill) return;
        gsap.fromTo(
          fill,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: line, start: "top 60%", end: "bottom 60%", scrub: 0.4 },
          },
        );
      });

      gsap.utils.toArray<SVGPathElement>("[data-draw]").forEach((path) => {
        const length = path.getTotalLength();
        gsap.fromTo(
          path,
          { strokeDasharray: length, strokeDashoffset: length },
          {
            strokeDashoffset: 0,
            duration: 1.8,
            ease: "power2.inOut",
            scrollTrigger: enter(path, "top 80%"),
          },
        );
      });

      const hero = document.querySelector("[data-hero]");
      if (hero) {
        const leave = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
        gsap.to("[data-hero-copy]", { yPercent: -18, autoAlpha: 0.25, ease: "none", scrollTrigger: leave });
        gsap.to("[data-hero-photo]", { yPercent: 10, scale: 0.96, ease: "none", scrollTrigger: leave });
        gsap.to("[data-hero-rays]", { rotate: 40, ease: "none", scrollTrigger: leave });
      }

      gsap.to("[data-progress]", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      });
    });

    // Lines and positions depend on the web fonts; measure again once they land.
    ScrollTrigger.sort();
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => mm.revert();
  });

  return null;
}
