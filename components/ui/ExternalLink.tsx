import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

/** External destinations open in a new tab, say so to screen readers, and carry safe rel attributes (FR06). */
export function ExternalLink({
  href,
  children,
  className = "",
  icon = true,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  icon?: boolean;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`group/ext inline-flex items-center gap-1.5 ${className}`}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
      {icon ? (
        <ArrowUpRight
          aria-hidden="true"
          className="size-4 shrink-0 transition-transform duration-300 group-hover/ext:translate-x-0.5 group-hover/ext:-translate-y-0.5"
        />
      ) : null}
    </a>
  );
}
