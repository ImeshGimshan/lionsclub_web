import Image from "next/image";
import { useId, type SVGProps } from "react";

/**
 * The official Lions International emblem, untouched (BR01): never recoloured,
 * cropped or placed over a busy photo. It always sits on a plain surface.
 */
export function Emblem({ size = 48, className = "", preload = false }: { size?: number; className?: string; preload?: boolean }) {
  return (
    <Image
      src="/images/lions-emblem.png"
      alt="Lions International emblem"
      width={size}
      height={size}
      preload={preload}
      className={className}
    />
  );
}

/**
 * Original radiating-rays motif (not derived from the emblem artwork), used as
 * a quiet Lions-gold texture behind navy sections.
 */
export function Sunburst({ rays = 36, className = "", ...props }: SVGProps<SVGSVGElement> & { rays?: number }) {
  const gradientId = useId();
  const paths = Array.from({ length: rays }, (_, i) => {
    const a = (i / rays) * Math.PI * 2;
    const w = (Math.PI / rays) * 0.42;
    const r = 100;
    const x1 = 100 + Math.cos(a - w) * r;
    const y1 = 100 + Math.sin(a - w) * r;
    const x2 = 100 + Math.cos(a + w) * r;
    const y2 = 100 + Math.sin(a + w) * r;
    return `M100 100L${x1.toFixed(2)} ${y1.toFixed(2)}L${x2.toFixed(2)} ${y2.toFixed(2)}Z`;
  }).join("");
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" focusable="false" className={className} {...props}>
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ebb700" stopOpacity="0.55" />
          <stop offset="70%" stopColor="#ebb700" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#ebb700" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d={paths} fill={`url(#${gradientId})`} />
    </svg>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
      <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9Z" />
    </svg>
  );
}
