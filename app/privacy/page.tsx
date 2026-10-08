import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSiteData } from "@/lib/site-data";

export const revalidate = 60;

// Update this date whenever the notice changes. The wording describes what the site actually does
// (no cookies, no storage, enquiries via WhatsApp), so review it whenever that changes.
const lastUpdated = "9 October 2026";

export async function generateMetadata(): Promise<Metadata> {
  const { club } = await getSiteData();
  return {
    title: `Privacy notice | ${club.name}`,
    description: `How the ${club.name} website handles your information, including enquiries sent on WhatsApp.`,
    alternates: { canonical: "/privacy" },
  };
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line pt-8 first:border-t-0 first:pt-0">
      <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-navy">{title}</h2>
      <div className="mt-4 space-y-4 text-ink/85 [&_a]:font-semibold [&_a]:text-lions-blue [&_a]:underline [&_a]:underline-offset-2 [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}

export default async function PrivacyPage() {
  const { club } = await getSiteData();
  const contact = (
    <>
      the club {club.secretary.role.toLowerCase()} at <a href={`mailto:${club.email}`}>{club.email}</a> or{" "}
      <a href={club.phoneHref} className="whitespace-nowrap">
        {club.phoneDisplay}
      </a>
    </>
  );
  return (
    <>
      <Header
        clubName={club.name}
        tagline={[club.district.replace(/^Lions\s+/i, ""), club.country].join(" · ")}
        base="/"
      />
      <main id="main" tabIndex={-1} className="on-light outline-none">
        <div className="bg-navy pt-[var(--header-h)] text-white">
          <div className="container-x py-16 sm:py-20">
            <p className="eyebrow text-lions-yellow">Your information</p>
            <h1 className="mt-4 text-[clamp(2.4rem,6vw,4rem)] leading-[1.05] font-extrabold tracking-[-0.03em]">
              Privacy notice
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-white/80">
              What happens to your information when you use this website or contact the {club.name}.
            </p>
            <p className="mt-6 text-sm text-white/60">Last updated {lastUpdated}</p>
          </div>
        </div>

        <div className="container-x py-16 sm:py-20">
          <div className="max-w-3xl space-y-10">
            <Section title="Who we are">
              <p>
                This website belongs to the {club.name}, a local Lions club in {club.district}, {club.locality}. You can
                reach us through {contact}.
              </p>
            </Section>

            <Section title="What this website collects">
              <p>Very little. This website:</p>
              <ul>
                <li>has no accounts or sign-ups;</li>
                <li>does not use cookies, analytics or advertising trackers;</li>
                <li>does not store anything you type into the enquiry form.</li>
              </ul>
            </Section>

            <Section title="Enquiries sent on WhatsApp">
              <p>
                The enquiry form does not send anything itself. When you press <strong>Continue in WhatsApp</strong>, it
                opens WhatsApp with your message ready, addressed to the club’s WhatsApp number. Nothing is sent until
                you press Send in WhatsApp.
              </p>
              <p>
                Once you send it, the club {club.secretary.role.toLowerCase()} receives your name, your message and your
                WhatsApp number and profile. We use them only to reply to you. We do not add you to groups or broadcast
                lists without asking, and we do not share your details with anyone else.
              </p>
              <p>
                WhatsApp is run by Meta. Its{" "}
                <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
                  privacy policy
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>{" "}
                explains how it handles messages.
              </p>
            </Section>

            <Section title="Phone, email and Facebook">
              <p>
                If you call, email or message us on Facebook, we use your details only to reply. Those services handle
                your information under their own terms.
              </p>
            </Section>

            <Section title="Technical information">
              <p>Like every website, this one needs some technical information to work:</p>
              <ul>
                <li>
                  <strong>Hosting.</strong> The site is hosted by Vercel. Its servers receive standard request
                  information, such as your IP address, browser type and the page you asked for, to deliver the site and
                  protect it from abuse.
                </li>
                <li>
                  <strong>Content updates.</strong> The site’s text and photos are managed with Sanity. While a page is
                  open, your browser keeps a connection to Sanity so new content appears without reloading, which means
                  Sanity also receives connection information such as your IP address.
                </li>
              </ul>
              <p>The club does not receive or keep this technical information.</p>
            </Section>

            <Section title="Photos on this website">
              <p>
                The photos show club members and people at our service activities. If you appear in a photo and would
                like it removed, or a caption corrected, contact {contact}. We will act on your request promptly.
              </p>
            </Section>

            <Section title="Links to other websites">
              <p>
                We link to Lions International, Facebook and other websites. They have their own privacy policies, which
                apply when you visit them.
              </p>
            </Section>

            <Section title="Questions and requests">
              <p>
                To ask what information the club holds about you, or to have your messages deleted, contact {contact}.
              </p>
              <p>If this notice changes, we will update it here and change the date at the top.</p>
            </Section>
          </div>
        </div>
      </main>
      <Footer base="/" />
    </>
  );
}
