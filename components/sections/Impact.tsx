import { getSiteData } from "@/lib/site-data";

const tiles = [
  "bg-lions-blue text-white ring-1 ring-white/15 [--num:var(--color-lions-yellow)]",
  "bg-lions-yellow text-navy ring-1 ring-white/20 [--num:var(--color-navy)]",
  "bg-white text-navy ring-1 ring-line [--num:var(--color-lions-blue)]",
];

export async function Impact() {
  const { impact } = await getSiteData();
  if (!impact.items.length) return null;
  return (
    <section id="impact" aria-labelledby="impact-title" className="relative flow-root bg-white pb-16 sm:pb-24">
      {/* Tiles straddle the hero's bottom edge: the hero reserves lg:pb-44 for this overlap.
          flow-root on the section keeps this negative margin from collapsing through it, which
          would drag the section's white background up over the hero. */}
      <div className="container-x relative z-10 -mt-12 lg:-mt-28">
        <h2 id="impact-title" className="sr-only">
          Recent impact{impact.period ? `, ${impact.period}` : ""}
        </h2>
        <ul data-stagger className="grid gap-4 md:grid-cols-3">
          {impact.items.map((item, i) => (
            <li
              key={item.label}
              className={`group relative overflow-hidden rounded-2xl p-7 shadow-[0_24px_60px_-28px_rgb(13_34_64/0.55)] transition-[translate] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1.5 sm:p-8 ${tiles[i]}`}
            >
              <span
                aria-hidden="true"
                className="absolute -top-10 -right-10 size-40 rounded-full border-[18px] border-current opacity-[0.07] transition-transform duration-700 group-hover:scale-125"
              />
              {impact.period ? (
                <p className="text-[0.72rem] font-bold tracking-[0.18em] uppercase opacity-75">{impact.period}</p>
              ) : null}
              <p className="mt-3 text-[clamp(3.4rem,7vw,4.8rem)] leading-none font-black tracking-[-0.04em] text-[var(--num)] tabular-nums">
                <span key={item.value} data-count={item.value}>
                  {item.value}
                </span>
              </p>
              <p className="mt-3 max-w-[22ch] text-lg leading-snug font-medium">{item.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
