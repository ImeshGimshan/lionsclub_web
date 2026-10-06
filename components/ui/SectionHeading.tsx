import { Fragment, type ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "light" | "dark" | "yellow";
  align?: "left" | "center";
  id?: string;
};

/** Eyebrow + split-reveal heading + intro. `tone` matches the background: white, navy/blue, or Lions yellow. */
export function SectionHeading({ eyebrow, title, intro, tone = "light", align = "left", id }: Props) {
  const dark = tone === "dark";
  const centered = align === "center";
  const eyebrowColor = { light: "text-lions-blue", dark: "text-lions-yellow", yellow: "text-navy" }[tone];
  const introColor = { light: "text-muted", dark: "text-white/75", yellow: "text-navy/80" }[tone];
  return (
    <div className={`${centered ? "mx-auto text-center" : ""} max-w-3xl`}>
      <p
        className={`eyebrow ornament ${centered ? "justify-center mx-auto w-fit" : "w-fit"} ${eyebrowColor}`}
        data-reveal
      >
        {eyebrow}
      </p>
      <h2
        id={id}
        data-split
        className={`mt-4 text-[clamp(2rem,4.6vw,3.6rem)] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance ${
          dark ? "text-white" : "text-navy"
        }`}
      >
        {title}
      </h2>
      {intro ? (
        <p
          data-reveal
          className={`mt-5 text-lg leading-relaxed text-pretty ${introColor} ${
            centered ? "mx-auto max-w-2xl" : "max-w-2xl"
          }`}
        >
          {intro}
        </p>
      ) : null}
    </div>
  );
}

/** Renders editor text where *asterisk* segments use the italic accent face. */
export function AccentText({ text, yellow = false }: { text: string; yellow?: boolean }) {
  return (
    <>
      {text.split(/\*([^*]+)\*/g).map((part, i) =>
        i % 2 ? (
          <Accent key={i} yellow={yellow}>
            {part}
          </Accent>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

/** Libre Bodoni italic accent used inside headings. */
export function Accent({ children, yellow = false }: { children: ReactNode; yellow?: boolean }) {
  return (
    <em className={`font-serif font-normal italic tracking-normal ${yellow ? "text-lions-yellow" : "text-lions-blue"}`}>
      {children}
    </em>
  );
}
