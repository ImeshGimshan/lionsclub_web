import "server-only";

import { cache } from "react";
import { sanity } from "@/lib/sanity/client";
import { shareImageUrl, toPhoto, type SanityPhoto } from "@/lib/sanity/image";
import { siteQuery } from "@/lib/sanity/queries";
import type { Album, Heading, Homepage, Photo, ServiceRecord, SiteData, TitleBody } from "@/lib/types";

type RawActivity = {
  _key: string;
  date: string;
  place: string;
  summary: string;
  facts?: string[];
  statistic?: { value?: number; unit?: string };
  image?: SanityPhoto;
};

type RawProject = {
  id: string;
  title: string;
  category: string;
  summary?: string;
  partner?: string;
  showInGallery?: boolean;
  galleryTitle?: string;
  galleryDescription?: string;
  galleryOrder?: number;
  activities?: RawActivity[];
  photos?: SanityPhoto[];
};

type RawAlbum = {
  id: string;
  title: string;
  category: string;
  description?: string;
  order?: number;
  photos?: SanityPhoto[];
};

type RawResult = {
  settings: {
    clubName: string;
    district: string;
    multipleDistrict?: string;
    locality: string;
    serviceYear: string;
    localWording?: string;
    secretaryName: string;
    secretaryRole?: string;
    email: string;
    phoneDisplay: string;
    phoneInternational: string;
    facebook: string;
    heroPhoto?: SanityPhoto;
    aboutPhotos?: SanityPhoto[];
    impactPeriod?: string;
    impactItems?: { value: number; label: string }[];
    impactNote?: string;
    seoTitle?: string;
    seoDescription?: string;
    shareImage?: SanityPhoto;
  } | null;
  home: RawHome | null;
  projects: RawProject[];
  albums: RawAlbum[];
  officers: { _id: string; name: string; role: string; portrait?: SanityPhoto }[];
};

type RawHeading = Partial<Heading> | null;
type RawHome = {
  heroHeadline?: string;
  heroHeadlineAccent?: string;
  heroIntro?: string;
  heroPrimaryCta?: string;
  heroSecondaryCta?: string;
  aboutHeading?: string;
  aboutIntro?: string;
  aboutStatement?: string;
  pillars?: TitleBody[];
  causesHeading?: RawHeading;
  projectsHeading?: RawHeading;
  galleryHeading?: RawHeading;
  officersHeading?: RawHeading;
  contactHeading?: RawHeading;
  joinHeading?: RawHeading;
  joinSteps?: TitleBody[];
  enquiryEyebrow?: string;
  enquiryHeading?: string;
  enquiryIntro?: string;
  enquiryPoints?: string[];
  volunteerTitle?: string;
  volunteerBody?: string;
  faqHeading?: string;
  faqs?: { question: string; answer: string }[];
  supportHeading?: RawHeading;
  supportCta?: string;
  supportWays?: (TitleBody & { icon?: string })[];
  marqueeWords?: string[];
  footerTagline?: string;
};

const heading = (h: RawHeading | undefined): Heading => ({
  eyebrow: h?.eyebrow ?? "",
  title: h?.title ?? "",
  intro: h?.intro ?? undefined,
});

function toHomepage(h: RawHome): Homepage {
  return {
    hero: {
      headline: h.heroHeadline ?? "",
      accent: h.heroHeadlineAccent ?? "",
      intro: h.heroIntro ?? "",
      primaryCta: h.heroPrimaryCta ?? "Become a member",
      secondaryCta: h.heroSecondaryCta ?? "Explore our projects",
    },
    about: {
      heading: h.aboutHeading ?? "",
      intro: h.aboutIntro,
      statement: h.aboutStatement ?? "",
      pillars: h.pillars ?? [],
    },
    causes: heading(h.causesHeading),
    projects: heading(h.projectsHeading),
    gallery: heading(h.galleryHeading),
    officers: heading(h.officersHeading),
    contact: heading(h.contactHeading),
    join: {
      ...heading(h.joinHeading),
      steps: h.joinSteps ?? [],
      volunteerTitle: h.volunteerTitle ?? "",
      volunteerBody: h.volunteerBody,
      faqHeading: h.faqHeading,
      faqs: h.faqs ?? [],
    },
    enquiry: {
      eyebrow: h.enquiryEyebrow,
      heading: h.enquiryHeading ?? "",
      intro: h.enquiryIntro,
      points: h.enquiryPoints ?? [],
    },
    support: {
      ...heading(h.supportHeading),
      cta: h.supportCta ?? "Discuss how to help",
      ways: (h.supportWays ?? []).map((w) => ({ ...w, icon: w.icon ?? "heart" })),
    },
    marquee: h.marqueeWords ?? [],
    footerTagline: h.footerTagline,
  };
}

// Activity dates are calendar dates with no time, so format them in UTC.
const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );

const photos = (list?: SanityPhoto[]) => (list ?? []).map(toPhoto).filter((p): p is Photo => Boolean(p));

/** Everything the homepage needs, fetched once per render and shaped for the components. */
export const getSiteData = cache(async (): Promise<SiteData> => {
  const raw = await sanity.fetch<RawResult>(siteQuery);
  const s = raw.settings;
  if (!s) throw new Error('Sanity: the "Club settings" document is missing or unpublished.');
  if (!raw.home) throw new Error('Sanity: the "Homepage" document is missing or unpublished.');

  const records: ServiceRecord[] = raw.projects
    .flatMap((project) => {
      const cover = toPhoto(project.photos?.[0]);
      return (project.activities ?? []).map((a): ServiceRecord => {
        const own = toPhoto(a.image);
        const photo = own ?? cover;
        return {
          id: `${project.id}-${a._key}`,
          project: project.title,
          category: project.category,
          date: formatDate(a.date),
          dateISO: a.date,
          place: a.place,
          summary: a.summary,
          facts: a.facts ?? [],
          stat:
            a.statistic?.value !== undefined && a.statistic.unit
              ? { value: a.statistic.value, unit: a.statistic.unit }
              : undefined,
          // Only captions an editor wrote are shown; a reused cover gets none.
          photo: photo && { ...photo, caption: own?.caption ?? "" },
          partner: project.partner,
        };
      });
    })
    .sort((a, b) => a.dateISO.localeCompare(b.dateISO));

  const albums: (Album & { order: number })[] = [
    ...raw.projects
      .filter((p) => p.showInGallery !== false && (p.photos?.length ?? 0) > 0)
      .map((p) => ({
        id: p.id,
        title: p.galleryTitle ?? p.title,
        category: p.category,
        description: p.galleryDescription ?? p.summary,
        photos: photos(p.photos),
        order: p.galleryOrder ?? 10,
      })),
    ...raw.albums.map((a) => ({
      id: a.id,
      title: a.title,
      category: a.category,
      description: a.description,
      photos: photos(a.photos),
      order: a.order ?? 10,
    })),
  ]
    .filter((a) => a.photos.length > 0)
    .sort((a, b) => a.order - b.order);

  return {
    club: {
      name: s.clubName,
      district: s.district,
      multipleDistrict: s.multipleDistrict,
      locality: s.locality,
      country: s.locality.split(",").pop()?.trim() || s.locality,
      serviceYear: s.serviceYear,
      localWording: s.localWording,
      secretary: { name: s.secretaryName, role: s.secretaryRole ?? "Secretary" },
      email: s.email,
      phoneDisplay: s.phoneDisplay,
      phoneHref: `tel:${s.phoneInternational}`,
      facebook: s.facebook,
    },
    home: toHomepage(raw.home),
    seo: {
      title: s.seoTitle ?? s.clubName,
      description: s.seoDescription ?? "",
      image: shareImageUrl(s.shareImage) ?? shareImageUrl(s.heroPhoto),
    },
    heroPhoto: toPhoto(s.heroPhoto),
    aboutPhotos: photos(s.aboutPhotos),
    impact: { period: s.impactPeriod, items: s.impactItems ?? [], note: s.impactNote?.trim() || undefined },
    records,
    albums: albums.map(({ id, title, category, description, photos }) => ({
      id,
      title,
      category,
      description,
      photos,
    })),
    officers: raw.officers.flatMap((o) => {
      const portrait = toPhoto(o.portrait);
      return portrait ? [{ id: o._id, name: o.name, role: o.role, portrait }] : [];
    }),
  };
});
