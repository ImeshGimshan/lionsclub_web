"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

/**
 * Lenis smooth scrolling driven by GSAP's ticker so ScrollTrigger stays in sync.
 * Skipped entirely when the visitor prefers reduced motion; native scrolling
 * plus `scroll-padding-top` then handles in-page links.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({ autoRaf: false, lerp: 0.09, wheelMultiplier: 1 });
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the instance only exists on the client
    setLenis(instance);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  // In-page anchors: glide with Lenis, then move focus to the target.
  useEffect(() => {
    // Layout can still shift just after load (the pinned gallery adds scroll length once it
    // mounts), so a jump started then would land short. Remember the target for a few seconds
    // and re-aim whenever ScrollTrigger re-measures, unless the visitor scrolls themselves.
    let pending: { target: HTMLElement; until: number } | null = null;
    const remember = (target: HTMLElement) => (pending = { target, until: Date.now() + 4000 });
    const cancel = () => (pending = null);

    const focus = (target: HTMLElement) => {
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };
    const go = (target: HTMLElement, immediate = false) => {
      if (lenis) {
        lenis.scrollTo(target, {
          // No offset: Lenis already subtracts the CSS scroll-padding-top that clears the sticky header.
          duration: 1.4,
          immediate,
          // The mobile menu stops Lenis while open; its links close it in this same click.
          force: true,
          onComplete: () => focus(target),
        });
      } else {
        target.scrollIntoView({ block: "start" });
      }
    };

    // Arriving from a shared link such as /#enquiry.
    const initial = location.hash ? document.querySelector<HTMLElement>(location.hash) : null;
    if (initial) remember(initial);

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = link?.getAttribute("href");
      if (!link || !hash) return;
      if (hash === "#" || hash === "#top") {
        if (!lenis) return;
        event.preventDefault();
        cancel();
        lenis.scrollTo(0, { duration: 1.4, force: true });
        history.pushState(null, "", location.pathname);
        return;
      }
      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;
      remember(target);
      if (!lenis) return; // native jump; re-aimed on refresh if the layout shifts
      event.preventDefault();
      go(target);
      history.pushState(null, "", hash);
    };

    const onRefresh = () => {
      if (pending && Date.now() < pending.until) go(pending.target, !lenis || pending.target === initial);
      else pending = null;
    };

    document.addEventListener("click", onClick);
    ScrollTrigger.addEventListener("refresh", onRefresh);
    const userScroll = ["wheel", "touchmove", "keydown"] as const;
    userScroll.forEach((type) => window.addEventListener(type, cancel, { passive: true }));
    return () => {
      document.removeEventListener("click", onClick);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      userScroll.forEach((type) => window.removeEventListener(type, cancel));
    };
  }, [lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
