import type { Photo } from "@/lib/types";

/**
 * Common `next/image` props for a Sanity photo: blur-up placeholder and the
 * editor's hotspot as object-position. Spread it, then pass `alt` explicitly
 * (so it stays visible at each call site) and add `fill`/`sizes` etc.
 */
export function photoProps(photo: Photo) {
  return {
    src: photo.src,
    placeholder: photo.lqip ? ("blur" as const) : ("empty" as const),
    blurDataURL: photo.lqip,
    style: photo.position ? { objectPosition: photo.position } : undefined,
  };
}
