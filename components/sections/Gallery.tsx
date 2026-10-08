"use client";

import Image from "next/image";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { ArrowRight, Images } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { photoProps } from "@/lib/photo";
import type { Album, Heading } from "@/lib/types";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useLenis } from "@/components/motion/SmoothScroll";
import { AccentText, SectionHeading } from "@/components/ui/SectionHeading";
import { AlbumViewer } from "./AlbumViewer";

const PIN_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const ease = [0.16, 1, 0.3, 1] as const;

const fan = (i: number): Variants => ({
  rest: { rotate: [0, -4, 5][i], x: [0, -6, 8][i], y: [0, 6, 10][i] },
  hover: {
    rotate: [0, -13, 12][i],
    x: [0, -46, 46][i],
    y: [-10, 6, 12][i],
    transition: { duration: 0.6, ease },
  },
});

const arrow: Variants = { rest: { x: 0 }, hover: { x: 6, transition: { duration: 0.4, ease } } };

function usePinned() {
  const [pinned, setPinned] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(PIN_QUERY);
    const update = () => setPinned(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return pinned;
}

function AlbumCard({
  album,
  onOpen,
  onFocus,
}: {
  album: Album;
  onOpen: (el: HTMLButtonElement) => void;
  onFocus: (el: HTMLElement) => void;
}) {
  const stack = album.photos.slice(0, 3);
  const count = album.photos.length;
  return (
    <motion.button
      type="button"
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
      onClick={(e) => onOpen(e.currentTarget)}
      onFocus={(e) => onFocus(e.currentTarget)}
      className="group block w-full text-left lg:w-[min(340px,28vw,calc((100svh-470px)*0.75))] lg:min-w-[240px] lg:shrink-0"
    >
      <div className="relative aspect-[4/5] w-full">
        {/* Back cards first so the cover sits on top. */}
        {[...stack].reverse().map((photo, r) => {
          const i = stack.length - 1 - r;
          return (
            <motion.div
              key={photo.src}
              variants={fan(i)}
              layoutId={i === 0 ? `cover-${album.id}` : undefined}
              className={`absolute inset-0 overflow-hidden rounded-2xl bg-navy-900 shadow-[0_30px_60px_-25px_rgb(0_0_0/0.8)] ${
                i === 0 ? "ring-1 ring-white/10" : "ring-4 ring-white/90"
              }`}
              style={{ zIndex: 3 - i }}
            >
              <Image
                {...photoProps(photo)}
                alt=""
                fill
                sizes="(min-width: 1024px) 380px, (min-width: 640px) 46vw, 92vw"
                className={`object-cover transition-[filter] duration-700 ${i === 0 ? "group-hover:brightness-105" : "brightness-90"}`}
              />
            </motion.div>
          );
        })}
        <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl bg-gradient-to-t from-navy-900/85 via-transparent to-transparent" />
        <span className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-navy">
          <Images className="size-3.5" aria-hidden="true" />
          {count} {count === 1 ? "photo" : "photos"}
        </span>
        <div className="absolute inset-x-5 bottom-5 z-10">
          <p className="text-xs font-bold tracking-[0.18em] text-lions-yellow uppercase">{album.category}</p>
          <p className="mt-1.5 text-2xl leading-tight font-extrabold text-white">{album.title}</p>
        </div>
      </div>
      <span className="mt-4 inline-flex items-center gap-2 font-semibold text-white/85 group-hover:text-lions-yellow">
        View album
        <motion.span variants={arrow} className="inline-flex">
          <ArrowRight className="size-4" aria-hidden="true" />
        </motion.span>
      </span>
    </motion.button>
  );
}

export function Gallery({ albums, heading }: { albums: Album[]; heading: Heading }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const pinned = usePinned();
  const lenis = useLenis();
  const [open, setOpen] = useState<Album | null>(null);

  useGSAP(
    () => {
      if (!pinned || !track.current || !section.current) return;
      const distance = () => Math.max(0, track.current!.scrollWidth - window.innerWidth + 80);
      const tween = gsap.to(track.current, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      trigger.current = tween.scrollTrigger ?? null;
      // This pin is created after the page-wide triggers; re-order by page position and re-measure.
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
      return () => {
        trigger.current = null;
      };
    },
    { scope: section, dependencies: [pinned], revertOnUpdate: true },
  );

  // Keyboard users tabbing through a pinned row: scroll the page so the focused card is on screen.
  const bringIntoView = useCallback(
    (el: HTMLElement) => {
      const st = trigger.current;
      if (!st || !track.current) return;
      const span = track.current.scrollWidth - window.innerWidth + 80;
      if (span <= 0) return;
      const center = el.offsetLeft + el.offsetWidth / 2 - window.innerWidth / 2;
      const progress = gsap.utils.clamp(0, 1, center / span);
      const y = st.start + (st.end - st.start) * progress;
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo({ top: y });
    },
    [lenis],
  );

  const openAlbum = (album: Album) => (el: HTMLButtonElement) => {
    opener.current = el;
    setOpen(album);
  };

  const close = useCallback(() => {
    setOpen(null);
    // Return focus to the album that opened the viewer (FR11).
    requestAnimationFrame(() => opener.current?.focus({ preventScroll: true }));
  }, []);

  return (
    <section
      id="gallery"
      ref={section}
      aria-labelledby="gallery-title"
      className="relative overflow-hidden bg-navy py-24 text-white sm:py-32 lg:flex lg:min-h-svh lg:flex-col lg:justify-center lg:pt-[calc(var(--header-h)+1.5rem)] lg:pb-10"
    >
      <div className="container-x flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <SectionHeading
          id="gallery-title"
          tone="dark"
          eyebrow={heading.eyebrow}
          title={<AccentText text={heading.title} yellow />}
          intro={heading.intro}
        />
        {pinned ? (
          <p className="hidden shrink-0 items-center gap-2 text-sm text-white/60 lg:flex" aria-hidden="true">
            Keep scrolling <ArrowRight className="size-4 text-lions-yellow" />
          </p>
        ) : null}
      </div>

      <div className="mt-12 lg:mt-10">
        <div
          ref={track}
          className={
            pinned
              ? "flex w-max gap-10 pr-10 pl-[max(40px,calc((100vw-1240px)/2+40px))]"
              : "container-x grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
          }
        >
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} onOpen={openAlbum(album)} onFocus={bringIntoView} />
          ))}
        </div>
      </div>

      <AnimatePresence>{open ? <AlbumViewer key={open.id} album={open} onClose={close} /> : null}</AnimatePresence>
    </section>
  );
}
