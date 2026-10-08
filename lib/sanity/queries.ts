const photoFields = `asset, crop, hotspot, alt, caption, "lqip": asset->metadata.lqip`;

export const siteQuery = /* groq */ `{
  "settings": *[_id == "siteSettings"][0]{
    clubName, district, multipleDistrict, locality, serviceYear, localWording,
    secretaryName, secretaryRole, email, phoneDisplay, phoneInternational, whatsappNumber, facebook,
    heroPhoto{${photoFields}},
    aboutPhotos[]{${photoFields}},
    impactPeriod, impactItems[]{value, label}, impactNote,
    seoTitle, seoDescription, shareImage{${photoFields}}
  },
  "home": *[_id == "homepage"][0]{
    heroHeadline, heroHeadlineAccent, heroIntro, heroPrimaryCta, heroSecondaryCta,
    aboutHeading, aboutIntro, aboutStatement, pillars[]{title, body},
    causesHeading, projectsHeading, galleryHeading, officersHeading, contactHeading,
    joinHeading, joinSteps[]{title, body},
    enquiryEyebrow, enquiryHeading, enquiryIntro, enquiryPoints,
    volunteerTitle, volunteerBody, faqHeading, faqs[]{question, answer},
    supportHeading, supportCta, supportWays[]{icon, title, body},
    marqueeWords, footerTagline
  },
  "projects": *[_type == "project" && defined(slug.current)]{
    "id": slug.current, title, category, summary, partner,
    showInGallery, galleryTitle, galleryDescription, galleryOrder,
    activities[]{_key, date, place, summary, facts, statistic, image{${photoFields}}},
    photos[]{${photoFields}}
  },
  "albums": *[_type == "album" && defined(slug.current) && count(photos) > 0]{
    "id": slug.current, title, category, description, order,
    photos[]{${photoFields}}
  },
  "officers": *[_type == "officer" && status == "current"] | order(order asc){
    _id, name, role, serviceYear,
    portrait{${photoFields}}
  }
}`;
