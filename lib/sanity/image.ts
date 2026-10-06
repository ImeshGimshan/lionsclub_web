import { createImageUrlBuilder } from "@sanity/image-url";
import type { Photo } from "@/lib/types";
import { dataset, projectId } from "./client";

const builder = createImageUrlBuilder({ projectId, dataset });

/** Image field as returned by the `photoFields` projection in queries.ts. */
export type SanityPhoto = {
  asset?: { _ref: string };
  crop?: { top: number; bottom: number; left: number; right: number };
  hotspot?: { x: number; y: number };
  alt?: string;
  caption?: string;
  lqip?: string;
};

/**
 * Converts a Sanity image into the `Photo` shape the components use. The editor's
 * crop is applied in the URL; the hotspot becomes `object-position` so cover-fit
 * images keep the important part in frame. `next/image` then resizes and caches
 * it, so visitors never request cdn.sanity.io directly.
 */
export function toPhoto(image: SanityPhoto | null | undefined): Photo | undefined {
  const ref = image?.asset?._ref;
  if (!image || !ref) return undefined;
  const match = /-(\d+)x(\d+)-\w+$/.exec(ref);
  if (!match) return undefined;

  const crop = image.crop ?? { top: 0, bottom: 0, left: 0, right: 0 };
  const keepX = 1 - crop.left - crop.right;
  const keepY = 1 - crop.top - crop.bottom;
  const width = Math.round(Number(match[1]) * keepX);
  const height = Math.round(Number(match[2]) * keepY);

  const position = image.hotspot
    ? `${clampPct((image.hotspot.x - crop.left) / keepX)} ${clampPct((image.hotspot.y - crop.top) / keepY)}`
    : undefined;

  return {
    src: builder.image(image).url(),
    width,
    height,
    alt: image.alt ?? "",
    caption: image.caption,
    lqip: image.lqip,
    position,
  };
}

/** 1200×630 crop for Open Graph / social previews, centred on the editor's hotspot. */
export function shareImageUrl(image: SanityPhoto | null | undefined): string | undefined {
  if (!image?.asset?._ref) return undefined;
  return builder.image(image).width(1200).height(630).fit("crop").auto("format").url();
}

const clampPct = (n: number) => `${(Math.min(1, Math.max(0, n)) * 100).toFixed(1)}%`;
