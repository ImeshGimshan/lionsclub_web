"use client";

import { AnimatePresence, motion } from "motion/react";
import { HandHeart, Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { nav } from "@/lib/content";
import { Emblem } from "@/components/ui/brand";
import { useLenis } from "@/components/motion/SmoothScroll";

/**
 * `base` prefixes the in-page links: "" on the homepage, "/" on other pages so the links lead back
 * to the homepage sections. Other pages also get a solid header, since they have no dark hero.
 */
export function Header({ clubName, tagline, base = "" }: { clubName: string; tagline: string; base?: "" | "/" }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) menuButton.current?.focus();
  }, []);

  // Lock page scroll, trap focus and support Escape while the drawer is open.
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const focusables = () =>
      Array.from(drawer.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    focusables()[0]?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
      lenis?.start();
    };
  }, [open, close, lenis]);

  return (
    <>
      <a href="#main" className="btn btn-yellow fixed top-3 left-3 z-[100] -translate-y-24 focus:translate-y-0">
        Skip to content
      </a>

      <header
        data-site-header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
          base || scrolled || open
            ? "bg-navy/92 shadow-[0_10px_40px_-12px_rgb(8_22_41/0.6)] backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-4">
          <a href={`${base}#home`} className="group flex min-w-0 items-center gap-3 text-white">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white p-1 shadow-md transition-transform duration-500 group-hover:rotate-[8deg]">
              <Emblem size={40} preload alt="" />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-[0.95rem] font-bold sm:text-base">{clubName}</span>
              <span className="block text-[0.72rem] font-medium tracking-[0.14em] text-white/70 uppercase">
                {tagline}
              </span>
              <span className="sr-only">{base ? ", homepage" : ", back to top"}</span>
            </span>
          </a>

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={base + item.href}
                className="group relative rounded-full px-3.5 py-2 text-[0.95rem] font-medium text-white/85 transition-colors hover:text-white"
              >
                {item.label}
                <span className="absolute inset-x-3.5 bottom-1 h-0.5 origin-left scale-x-0 rounded bg-lions-yellow transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
              </a>
            ))}
            <a href={`${base}#support`} className="btn btn-yellow ml-3 !min-h-11 !py-2 text-sm">
              <HandHeart className="size-4" aria-hidden="true" />
              Support our work
            </a>
          </nav>

          <button
            ref={menuButton}
            type="button"
            className="grid size-12 place-items-center rounded-full text-white ring-1 ring-white/30 transition hover:bg-white/10 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => (open ? close() : setOpen(true))}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-[3px] overflow-hidden" aria-hidden="true">
          <div data-progress className="h-full origin-left scale-x-0 bg-lions-yellow" />
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            ref={drawer}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-x-0 top-[var(--header-h)] bottom-0 z-40 overflow-y-auto bg-navy lg:hidden"
            data-lenis-prevent
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav aria-label="Mobile" className="container-x flex flex-col gap-1 py-8">
              {[
                ...nav,
                { href: "#officers", label: "Club officers" },
                { href: "#events", label: "Meetings", enquiry: "meeting" },
              ].map((item, i) => (
                <motion.a
                  key={item.href}
                  href={base + item.href}
                  data-enquiry={"enquiry" in item ? item.enquiry : undefined}
                  onClick={() => close(false)}
                  className="flex items-center justify-between border-b border-white/10 py-4 text-2xl font-bold text-white"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  {item.label}
                  <span className="font-serif text-base font-normal text-lions-yellow italic">0{i + 1}</span>
                </motion.a>
              ))}
              <motion.a
                href={`${base}#support`}
                onClick={() => close(false)}
                className="btn btn-yellow mt-8"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <HandHeart className="size-5" aria-hidden="true" />
                Support our work
              </motion.a>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
