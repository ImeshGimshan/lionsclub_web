// Fixed parts of the site that are deliberately not edited in Sanity: Lions
// International links and the eight global causes (official, attributed content)
// and the in-page navigation (tied to the section anchors). Everything else,
// including homepage wording, comes from Sanity via lib/site-data.ts.

// The site's official address: used for the canonical URL and link previews. The www and
// vercel.app addresses serve the same page and point search engines here.
export const siteUrl = "https://lionsclubofdummalasuriya.org";

// Launch switch. While false, every page carries "noindex" and the sitemap is not advertised, so
// search engines leave the site alone during the club's review. Set to true at launch.
export const searchIndexing = false;

export const mailto = (email: string, subject: string) => `mailto:${email}?subject=${encodeURIComponent(subject)}`;

export const lionsLinks = {
  mission: "https://www.lionsclubs.org/en/about-us/our-organization/about-lions-international",
  vision: "https://www.lionsclubs.org/sites/default/files/Board-Policy-Manual/Chapter_1_en.pdf",
  whatIsALion: "https://www.lionsclubs.org/en/about-us/our-membership/what-is-a-lion",
  lionPortal: "https://lionportal.org/",
  memberResources: "https://www.lionsclubs.org/en/member-resource-center",
  brandGuidelines: "https://www.lionsclubs.org/en/resources-for-members/brand-guidelines",
  lionsInternational: "https://www.lionsclubs.org/en",
} as const;

export const causes = [
  { key: "environment", title: "Environment", body: "Care for our surroundings and a healthier planet." },
  { key: "hunger", title: "Hunger", body: "Help people access nutritious food." },
  { key: "vision", title: "Vision", body: "Support sight and people living with vision loss." },
  { key: "diabetes", title: "Diabetes", body: "Promote prevention and better quality of life." },
  { key: "childhood-cancer", title: "Childhood cancer", body: "Support children and families affected by cancer." },
  { key: "disaster", title: "Disaster relief", body: "Help communities respond, recover and rebuild." },
  { key: "humanitarian", title: "Humanitarian", body: "Respond to pressing human needs." },
  { key: "youth", title: "Youth", body: "Encourage young people to learn, thrive and lead." },
] as const;

export type CauseKey = (typeof causes)[number]["key"];

export const nav = [
  { href: "#about", label: "Our club" },
  { href: "#projects", label: "Our projects" },
  { href: "#gallery", label: "Gallery" },
  { href: "#join", label: "Get involved" },
  { href: "#contact", label: "Contact" },
] as const;
