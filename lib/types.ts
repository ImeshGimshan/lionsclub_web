export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  /** Tiny blurred preview from Sanity, used while the full image loads. */
  lqip?: string;
  /** CSS object-position from the editor's hotspot. */
  position?: string;
};

export type Club = {
  name: string;
  district: string;
  multipleDistrict?: string;
  locality: string;
  /** Last part of the locality, e.g. "Sri Lanka". */
  country: string;
  serviceYear: string;
  localWording?: string;
  secretary: { name: string; role: string };
  email: string;
  phoneDisplay: string;
  phoneHref: string;
  /** International number the enquiry form messages on WhatsApp, e.g. "+94765646292". */
  whatsapp?: string;
  facebook: string;
};

export type Impact = {
  period?: string;
  items: { value: number; label: string }[];
  note?: string;
};

export type ServiceRecord = {
  id: string;
  project: string;
  category: string;
  date: string;
  dateISO: string;
  place: string;
  summary: string;
  facts: string[];
  stat?: { value: number; unit: string };
  photo?: Photo & { caption: string };
  partner?: string;
};

export type Album = {
  id: string;
  title: string;
  category: string;
  description?: string;
  photos: Photo[];
};

export type Officer = { id: string; name: string; role: string; portrait: Photo };

/** Eyebrow + heading + intro. In `title`, *asterisks* mark the italic accent. */
export type Heading = { eyebrow: string; title: string; intro?: string };
export type TitleBody = { title: string; body: string };

export type Homepage = {
  hero: { headline: string; accent: string; intro: string; primaryCta: string; secondaryCta: string };
  about: { heading: string; intro?: string; statement: string; pillars: TitleBody[] };
  causes: Heading;
  projects: Heading;
  gallery: Heading;
  officers: Heading;
  contact: Heading;
  join: Heading & {
    steps: TitleBody[];
    volunteerTitle: string;
    volunteerBody?: string;
    faqHeading?: string;
    faqs: { question: string; answer: string }[];
  };
  enquiry: { eyebrow?: string; heading: string; intro?: string; points: string[] };
  support: Heading & { cta: string; ways: (TitleBody & { icon: string })[] };
  marquee: string[];
  footerTagline?: string;
};

export type Seo = { title: string; description: string; image?: string };

export type SiteData = {
  club: Club;
  home: Homepage;
  seo: Seo;
  heroPhoto?: Photo;
  aboutPhotos: Photo[];
  impact: Impact;
  records: ServiceRecord[];
  albums: Album[];
  officers: Officer[];
};
