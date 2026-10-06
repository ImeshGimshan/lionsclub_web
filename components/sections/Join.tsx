import { ArrowRight, HeartHandshake } from "lucide-react";
import { getSiteData } from "@/lib/site-data";
import { AccentText, SectionHeading } from "@/components/ui/SectionHeading";
import { EnquiryForm } from "./EnquiryForm";
import { Faq } from "./Faq";

export async function Join() {
  const { club, home } = await getSiteData();
  const { join } = home;
  return (
    <section id="join" aria-labelledby="join-title" className="on-light relative bg-white py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          id="join-title"
          eyebrow={join.eyebrow}
          align="center"
          title={<AccentText text={join.title} />}
          intro={join.intro}
        />

        {/* Membership guide (FR15) with a connector that draws itself in. */}
        <div className="relative mt-16">
          <svg
            aria-hidden="true"
            viewBox="0 0 1000 40"
            preserveAspectRatio="none"
            className="absolute top-8 right-[16%] left-[16%] hidden h-10 w-[68%] text-lions-yellow md:block"
          >
            <path
              data-draw
              d="M0 20 C 160 -10, 340 50, 500 20 S 840 -10, 1000 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <ol data-stagger className="relative grid gap-10 md:grid-cols-3 md:gap-8">
            {join.steps.map((step, i) => (
              <li key={step.title} className="text-center">
                <span className="mx-auto grid size-16 place-items-center rounded-full bg-lions-blue text-2xl font-black text-white ring-8 ring-white">
                  {i + 1}
                </span>
                <h3 className="mt-6 text-xl font-bold text-navy">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Enquiry card: also covers meeting visits (replaces the old Meetings section).
            Submissions go to the private Sanity "enquiries" dataset. */}
        <div className="mt-16">
          <EnquiryForm club={club} copy={home.enquiry} />
        </div>

        <div className="mt-24 grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
          {/* Volunteering is a separate route from membership (FR16). */}
          <aside
            data-reveal
            className="relative overflow-hidden rounded-[28px] bg-navy p-8 text-white sm:p-10 lg:self-start"
          >
            <HeartHandshake className="size-12 text-lions-yellow" strokeWidth={1.5} aria-hidden="true" />
            <h3 className="mt-6 text-3xl font-extrabold tracking-[-0.02em]">{join.volunteerTitle}</h3>
            {join.volunteerBody ? <p className="mt-4 text-white/80">{join.volunteerBody}</p> : null}
            <a href="#enquiry" data-enquiry="volunteering" className="btn btn-yellow mt-8">
              Ask about volunteering
              <ArrowRight className="size-5" aria-hidden="true" />
            </a>
          </aside>

          <div>
            <p data-reveal className="eyebrow ornament w-fit text-lions-blue">
              Before you join
            </p>
            {join.faqHeading ? (
              <h3 data-split className="mt-4 mb-8 text-3xl font-extrabold tracking-[-0.02em] text-navy">
                {join.faqHeading}
              </h3>
            ) : null}
            <div data-reveal>
              <Faq faqs={join.faqs} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
