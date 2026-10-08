"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  MessageCircle,
  MessageSquareText,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  ENQUIRY_CATEGORIES,
  MESSAGE_MAX,
  enquiryMessage,
  isCategory,
  validateEnquiry,
  whatsappUrl,
  type EnquiryCategory,
  type EnquiryField,
  type FieldErrors,
} from "@/lib/enquiry";
import { ScrollTrigger } from "@/lib/gsap";
import type { Club, Homepage } from "@/lib/types";
import { Sunburst } from "@/components/ui/brand";

const ease = [0.16, 1, 0.3, 1] as const;

const placeholders: Record<EnquiryCategory, string> = {
  membership: "Anything you’d like the secretary to know, or questions about joining (optional).",
  volunteering: "Which activities interest you, and when you’re usually free (optional).",
  meeting: "Which meeting or activity you’d like to visit (optional).",
  support: "What you’d like to offer: supplies, sponsorship or a partnership (optional).",
  community: "Briefly describe the need in your community.",
  other: "How can we help?",
};

const fieldOrder: EnquiryField[] = ["name", "area", "message"];

// White inputs on Lions blue, with a yellow focus ring to match the card's buttons.
const inputClass = (invalid: boolean) =>
  `mt-2 block w-full rounded-xl border-2 bg-white px-4 py-3 text-base text-ink transition-[border-color,box-shadow] outline-none placeholder:text-muted/70 focus:shadow-[0_0_0_4px_rgb(235_183_0/0.6)] ${
    invalid ? "border-[#ff9b8f] focus:border-[#ff9b8f]" : "border-transparent focus:border-lions-yellow"
  }`;

const pillFocus =
  "has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-lions-yellow";

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message ? (
        <motion.p
          id={id}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-[#ffd0c9]"
        >
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          {message}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}

function Label({ htmlFor, children, optional }: { htmlFor: string; children: ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block font-semibold text-white">
      {children}
      {optional ? <span className="ml-1.5 text-sm font-normal text-white/65">(optional)</span> : null}
    </label>
  );
}

type ClubContact = Pick<Club, "name" | "phoneDisplay" | "phoneHref">;

/**
 * Website enquiry form (requirements Section 08, optional form), styled as the
 * Lions-blue "come and meet the club" card. It also covers meeting visits, so the
 * `#events` anchor lands here. Submitting opens WhatsApp with the message ready to
 * send to the club's number; the website itself receives and stores nothing.
 * Buttons elsewhere preselect a topic with `data-enquiry="..."`.
 */
export function EnquiryForm({
  club,
  whatsapp,
  copy,
}: {
  club: ClubContact;
  /** International WhatsApp number. Without it the form is not shown. */
  whatsapp?: string;
  copy: Homepage["enquiry"];
}) {
  const [category, setCategory] = useState<EnquiryCategory>("membership");
  // Bumping the key remounts the panel, which resets the form and the action state.
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    // Arriving via the old Meetings anchor (/#events): start on "Visiting a meeting".
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the URL hash is only known on the client
    if (location.hash === "#events") setCategory("meeting");
    const onClick = (event: MouseEvent) => {
      const trigger = (event.target as Element).closest<HTMLElement>("[data-enquiry]");
      const value = trigger?.dataset.enquiry;
      if (value && isCategory(value)) setCategory(value);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div
      id="enquiry"
      tabIndex={-1}
      data-reveal="fade"
      className="on-dark relative isolate overflow-hidden rounded-[28px] bg-lions-blue px-6 py-10 text-white outline-none sm:px-10 lg:px-14 lg:py-14"
    >
      <div aria-hidden="true" className="absolute -top-1/3 -right-1/4 -z-10 aspect-square w-[80%] opacity-45">
        <Sunburst rays={28} className="sunburst size-full" />
      </div>

      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        {/* Keeps the old "Meetings & events" anchor working (sitemap #events). */}
        <div id="events" className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
          {copy.eyebrow ? (
            <p className="eyebrow text-lions-yellow">
              <MessageSquareText className="size-4" aria-hidden="true" />
              {copy.eyebrow}
            </p>
          ) : null}
          <h3
            data-split
            className="mt-4 text-[clamp(2rem,4.4vw,3.3rem)] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance"
          >
            {copy.heading}
          </h3>
          {copy.intro ? <p className="mt-5 max-w-md text-lg text-white/80">{copy.intro}</p> : null}
          {copy.points.length ? (
            <ul className="mt-7 space-y-3 text-white/90">
              {copy.points.map((point) => (
                <li key={point} className="flex items-center gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-lions-yellow text-navy">
                    <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          ) : null}
          <p className="mt-9 text-sm font-semibold text-white/70">Prefer to talk?</p>
          <a href={club.phoneHref} className="btn btn-ghost-light mt-3">
            <Phone className="size-5" aria-hidden="true" />
            Call {club.phoneDisplay}
          </a>
        </div>

        {whatsapp ? (
          <EnquiryPanel
            key={formKey}
            club={club}
            whatsapp={whatsapp}
            category={category}
            setCategory={setCategory}
            onReset={() => setFormKey((k) => k + 1)}
          />
        ) : null}
      </div>
    </div>
  );
}

function EnquiryPanel({
  club,
  whatsapp,
  category,
  setCategory,
  onReset,
}: {
  club: ClubContact;
  whatsapp: string;
  category: EnquiryCategory;
  setCategory: (c: EnquiryCategory) => void;
  onReset: () => void;
}) {
  const [errors, setErrors] = useState<FieldErrors>({});
  // Bumped on every failed attempt so the error summary takes focus again.
  const [attempt, setAttempt] = useState(0);
  const [sent, setSent] = useState<{ name: string; url: string } | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  // The confirmation mounts only after the form's exit animation, so focus it as it appears.
  const focusOnMount = useCallback((el: HTMLHeadingElement | null) => el?.focus(), []);
  const uid = useId();
  const id = (field: string) => `${uid}-${field}`;
  const errorList = fieldOrder.filter((f) => errors[f]);

  // Move focus to the error summary so screen readers announce the problems.
  useEffect(() => {
    if (attempt) summaryRef.current?.focus();
  }, [attempt]);
  useEffect(() => {
    // The card's height changed; re-measure scroll animations further down the page.
    const t = setTimeout(() => ScrollTrigger.refresh(), 450);
    return () => clearTimeout(t);
  }, [sent]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const text = (key: string) => String(form.get(key) ?? "").trim();
    const values = { category, name: text("name"), area: text("area"), message: text("message") };
    const found = validateEnquiry(values);
    setErrors(found);
    if (Object.keys(found).length) {
      setAttempt((n) => n + 1);
      return;
    }
    const url = whatsappUrl(whatsapp, enquiryMessage(values, club.name));
    // Opened from the submit event, so browsers treat it as user-initiated rather than a pop-up.
    window.open(url, "_blank", "noopener,noreferrer");
    setSent({ name: values.name, url });
  };

  const describedBy = (field: EnquiryField) => (errors[field] ? id(`${field}-error`) : undefined);

  return (
    <AnimatePresence mode="wait" initial={false}>
      {sent ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease } }}
          exit={{ opacity: 0, y: -12 }}
          className="grid place-items-center rounded-3xl bg-white/8 px-6 py-14 text-center ring-1 ring-white/15"
        >
          <motion.span
            initial={{ scale: 0.4, rotate: -20 }}
            animate={{ scale: 1, rotate: 0, transition: { type: "spring", stiffness: 260, damping: 16, delay: 0.1 } }}
            className="grid size-20 place-items-center rounded-full bg-lions-yellow text-navy"
          >
            <CheckCircle2 className="size-10" aria-hidden="true" />
          </motion.span>
          <h3 ref={focusOnMount} tabIndex={-1} className="mt-6 text-3xl font-extrabold tracking-[-0.02em] outline-none">
            Almost there, {sent.name.split(" ")[0]}.
          </h3>
          <p className="mt-3 max-w-md text-lg text-white/85" role="status">
            Your message is ready in WhatsApp. Press <strong className="text-white">Send</strong> there and the
            secretary will reply in the same chat.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={sent.url} target="_blank" rel="noopener noreferrer" className="btn btn-yellow">
              <MessageCircle className="size-5" aria-hidden="true" />
              WhatsApp didn’t open? Try again
              <span className="sr-only"> (opens WhatsApp)</span>
            </a>
            <button type="button" onClick={onReset} className="btn btn-ghost-light">
              Write another message
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          noValidate
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
          aria-label="Enquiry form"
        >
          <p className="text-sm text-white/70">All fields are required unless marked optional.</p>

          <AnimatePresence>
            {errorList.length ? (
              <motion.div
                ref={summaryRef}
                tabIndex={-1}
                role="alert"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 overflow-hidden rounded-2xl bg-white outline-none"
              >
                <div className="border-l-[6px] border-[#b42318] p-5">
                  <p className="font-bold text-[#7a271a]">Please check the following:</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-[#7a271a]">
                    {errorList.map((field) => (
                      <li key={field}>
                        <a className="underline underline-offset-2" href={`#${id(field)}`}>
                          {errors[field]}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Topic: radio buttons styled as pills, with a sliding yellow highlight. */}
          <fieldset className="mt-6">
            <legend className="font-semibold text-white">What is your enquiry about?</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {ENQUIRY_CATEGORIES.map((option) => {
                const checked = category === option.value;
                return (
                  <label
                    key={option.value}
                    className={`relative cursor-pointer rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${pillFocus} ${
                      checked ? "text-navy" : "bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20"
                    }`}
                  >
                    {checked ? (
                      <motion.span
                        layoutId={`${uid}-pill`}
                        className="absolute inset-0 rounded-full bg-lions-yellow"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    ) : null}
                    <input
                      type="radio"
                      name="category"
                      value={option.value}
                      checked={checked}
                      onChange={() => setCategory(option.value)}
                      className="sr-only"
                    />
                    <span className="relative">{option.label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor={id("name")}>Your name</Label>
              <input
                id={id("name")}
                name="name"
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={describedBy("name")}
                className={inputClass(Boolean(errors.name))}
              />
              <FieldError id={id("name-error")} message={errors.name} />
            </div>

            <div>
              <Label htmlFor={id("area")} optional>
                Your area
              </Label>
              <input
                id={id("area")}
                name="area"
                autoComplete="address-level2"
                placeholder="e.g. Dummalasuriya"
                aria-invalid={Boolean(errors.area)}
                aria-describedby={describedBy("area")}
                className={inputClass(Boolean(errors.area))}
              />
              <FieldError id={id("area-error")} message={errors.area} />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor={id("message")} optional={category !== "community" && category !== "other"}>
                Message
              </Label>
              <textarea
                id={id("message")}
                name="message"
                rows={4}
                maxLength={MESSAGE_MAX}
                placeholder={placeholders[category]}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={describedBy("message")}
                className={`${inputClass(Boolean(errors.message))} resize-y`}
              />
              <FieldError id={id("message-error")} message={errors.message} />
            </div>
          </div>

          {/* Privacy notice: describes what actually happens to the details (Section 13). */}
          <details className="group mt-6 rounded-2xl bg-white/8 p-5 text-sm text-white/80 ring-1 ring-white/15">
            <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold text-white">
              <ShieldCheck className="size-5 text-lions-yellow" aria-hidden="true" />
              How your message is sent
              <span
                className="ml-auto text-lg text-lions-yellow transition-transform group-open:rotate-45"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <div className="mt-3 space-y-2 leading-relaxed">
              <p>
                The button opens WhatsApp with your message ready. Nothing is sent until you press Send in WhatsApp, and
                this website does not receive or store anything you type here.
              </p>
              <p>
                Once you send it, the club secretary sees your name, message and WhatsApp number, and uses them only to
                reply to you. WhatsApp is a service run by Meta.
              </p>
              <p>
                To have your messages deleted, ask the secretary in the same chat or call{" "}
                <a className="font-semibold text-lions-yellow underline underline-offset-2" href={club.phoneHref}>
                  {club.phoneDisplay}
                </a>
                . More in our{" "}
                <a className="font-semibold text-lions-yellow underline underline-offset-2" href="/privacy">
                  privacy notice
                </a>
                .
              </p>
            </div>
          </details>

          <button type="submit" className="btn btn-yellow mt-8 w-full sm:w-auto sm:min-w-56">
            <MessageCircle className="size-5" aria-hidden="true" />
            Continue in WhatsApp
            <ArrowRight className="size-5" aria-hidden="true" />
            <span className="sr-only"> (opens WhatsApp)</span>
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
