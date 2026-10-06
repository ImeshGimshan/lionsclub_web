"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { photoProps } from "@/lib/photo";
import type { Album } from "@/lib/types";
import { useLenis } from "@/components/motion/SmoothScroll";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Accessible album viewer (FR10/FR11): arrow keys, Escape, focus trap,
 * swipe on touch, contain-fit images and a scrollable layout on short screens.
 */
export function AlbumViewer({ album, onClose }: { album: Album; onClose: () => void }) {
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  const dialog = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const thumbs = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const lenis = useLenis();
  const total = album.photos.length;
  const single = total === 1;
  const photo = album.photos[index];

  const go = (delta: number) => setState(([i]) => [(i + delta + total) % total, delta]);
  const jump = (to: number) => setState(([i]) => [to, to > i ? 1 : -1]);

  useEffect(() => {
    lenis?.stop();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeButton.current?.focus();
    return () => {
      document.documentElement.style.overflow = prev;
      lenis?.start();
    };
  }, [lenis]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") return onClose();
      if (!single && event.key === "ArrowRight") return go(1);
      if (!single && event.key === "ArrowLeft") return go(-1);
      if (event.key !== "Tab" || !dialog.current) return;
      const items = Array.from(dialog.current.querySelectorAll<HTMLElement>("button:not([disabled])"));
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
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `go` only uses the functional state updater
  }, [onClose, single, total]);

  // Keep the active thumbnail visible.
  useEffect(() => {
    thumbs.current
      ?.querySelector<HTMLElement>(`[data-index="${index}"]`)
      ?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [index]);

  return createPortal(
    <motion.div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      data-lenis-prevent
      className="fixed inset-0 z-[80] flex flex-col overflow-y-auto bg-navy-900/96 text-white backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      transition={{ duration: 0.4 }}
    >
      <div className="container-x flex items-start justify-between gap-4 py-5">
        <div>
          <p className="text-xs font-bold tracking-[0.18em] text-lions-yellow uppercase">{album.category}</p>
          <h3 id={titleId} className="mt-1 text-2xl font-extrabold">
            {album.title}
          </h3>
          <p className="mt-1 max-w-xl text-sm text-white/70">{album.description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          {!single ? (
            <p className="text-sm font-semibold text-white/80 tabular-nums" aria-hidden="true">
              {index + 1} / {total}
            </p>
          ) : null}
          <button
            ref={closeButton}
            type="button"
            onClick={onClose}
            className="grid size-12 place-items-center rounded-full bg-white/10 transition hover:bg-lions-yellow hover:text-navy"
          >
            <X aria-hidden="true" />
            <span className="sr-only">Close album</span>
          </button>
        </div>
      </div>

      <div className="relative flex min-h-[300px] flex-1 items-center justify-center px-4 sm:px-20">
        <motion.div
          layoutId={index === 0 ? `cover-${album.id}` : undefined}
          className="relative h-[min(68svh,900px)] w-full max-w-6xl overflow-hidden"
          transition={{ duration: 0.7, ease }}
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={photo.src}
              custom={direction}
              className="absolute inset-0"
              initial={{ opacity: 0, x: direction * 80, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1, transition: { duration: 0.6, ease } }}
              exit={{ opacity: 0, x: direction * -80, transition: { duration: 0.35 } }}
              drag={single ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={(_, info) => {
                if (info.offset.x < -70) go(1);
                else if (info.offset.x > 70) go(-1);
              }}
            >
              <Image
                {...photoProps(photo)}
                alt={photo.alt}
                fill
                sizes="(min-width: 1200px) 1152px, 100vw"
                className="pointer-events-none object-contain select-none"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {!single ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-2 grid size-12 place-items-center rounded-full bg-white/10 backdrop-blur transition hover:bg-lions-yellow hover:text-navy sm:left-5"
            >
              <ChevronLeft aria-hidden="true" />
              <span className="sr-only">Previous photo</span>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-2 grid size-12 place-items-center rounded-full bg-white/10 backdrop-blur transition hover:bg-lions-yellow hover:text-navy sm:right-5"
            >
              <ChevronRight aria-hidden="true" />
              <span className="sr-only">Next photo</span>
            </button>
          </>
        ) : null}
      </div>

      <p aria-live="polite" className="container-x mt-4 min-h-12 text-center text-white/85">
        {!single ? <span className="sr-only">{`Photo ${index + 1} of ${total}: `}</span> : null}
        {photo.caption ?? photo.alt}
      </p>

      {!single ? (
        <div ref={thumbs} className="flex gap-2 overflow-x-auto px-4 pt-2 pb-6 sm:justify-center">
          {album.photos.map((p, i) => (
            <button
              key={p.src}
              type="button"
              data-index={i}
              onClick={() => jump(i)}
              aria-current={i === index ? "true" : undefined}
              className={`relative size-16 shrink-0 overflow-hidden rounded-lg transition sm:size-[72px] ${
                i === index ? "ring-3 ring-lions-yellow" : "opacity-55 hover:opacity-100"
              }`}
            >
              <Image {...photoProps(p)} alt="" fill sizes="72px" className="object-cover" />
              <span className="sr-only">{`Show photo ${i + 1}: ${p.alt}`}</span>
            </button>
          ))}
        </div>
      ) : null}
    </motion.div>,
    document.body,
  );
}
