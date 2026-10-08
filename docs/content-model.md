# Content model (Sanity)

Project `zhxlfgcp`. Schemas live in `studio/schemaTypes/`. The website reads them through one GROQ
query in `lib/sanity/queries.ts`, shaped by `lib/site-data.ts`.

One dataset, `production`, public (read without a token). It holds everything shown on the website
and nothing else: enquiries go to WhatsApp and are never stored in Sanity. The free plan only allows
public datasets, so **never add personal data** (enquiries, member lists, contact details of
beneficiaries) to Sanity.

## Singletons

### Club settings — `siteSettings` (id `siteSettings`)

| Tab | Fields | Used for |
| --- | --- | --- |
| Club | `clubName`, `district`, `multipleDistrict`, `locality`, `serviceYear` (`2026/27` format), `localWording` | Header, hero eyebrow, About, Officers year badge, motto card. The country shown in the header is the last part of `locality`. |
| Contact | `secretaryName`, `secretaryRole`, `email`, `phoneDisplay`, `phoneInternational` (`+digits`), `whatsappNumber` (`+digits`, required), `facebook` | Contact card, call/email links, the number the enquiry form opens in WhatsApp |
| Homepage | `heroPhoto` (required), `aboutPhotos` (max 2), `impactPeriod`, `impactItems` (max 3 × `{value, label}`), `impactNote` (optional, ≤ 160) | Hero photo and caption, Our club photo band, impact tiles and the note under them (hidden when empty) |
| Search & sharing | `seoTitle`, `seoDescription`, `shareImage` | `<title>`, meta description, Open Graph/Twitter image (falls back to the hero photo, cropped to 1200 × 630) |

### Homepage — `homepage` (id `homepage`)

All homepage wording. In heading fields, `*asterisks*` mark the italic accent (`AccentText`).

| Tab | Fields |
| --- | --- |
| Hero | `heroHeadline`, `heroHeadlineAccent`, `heroIntro`, `heroPrimaryCta`, `heroSecondaryCta` |
| Our club | `aboutHeading`, `aboutIntro`, `aboutStatement`, `pillars[]` (`{title, body}`, 2–6, even number recommended) |
| Section headings | `causesHeading`, `projectsHeading`, `galleryHeading`, `officersHeading`, `contactHeading` (each a `sectionHeading`) |
| Get involved | `joinHeading`, `joinSteps[]` (exactly 3), `enquiryEyebrow`, `enquiryHeading`, `enquiryIntro`, `enquiryPoints[]` (max 4), `volunteerTitle`, `volunteerBody`, `faqHeading`, `faqs[]` (`{question, answer}`) |
| Support | `supportHeading`, `supportCta`, `supportWays[]` (max 4 × `{icon, title, body}`; icon is one of `money`, `supplies`, `sponsor`, `partner`, `heart`) |
| Ribbon & footer | `marqueeWords[]` (1–6), `footerTagline` |

The officers eyebrow gets ` · {serviceYear}` appended automatically.

Both singletons are pinned in the desk structure, hidden from "Create new", and can't be deleted,
duplicated or unpublished (`studio/sanity.config.ts`). The site throws a clear error at build time if
either is missing.

## Collections

### Project — `project`

| Field | Notes |
| --- | --- |
| `title`, `slug`, `category` | Category is one of the 8 global causes plus "Community care" and "Community wellbeing" |
| `summary`, `partner` | Partner shows as a badge on the timeline (present shared work as shared) |
| `activities[]` | One or more `activity` objects (below). **Each activity is one timeline entry.** |
| `photos[]` | Album photos; the first is the cover |
| `showInGallery`, `galleryTitle`, `galleryDescription`, `galleryOrder` | Gallery album built from the project's photos |

### Activity — `activity` (object inside a project)

| Field | Notes |
| --- | --- |
| `date`, `place`, `summary` | Required. Timeline is sorted by `date` across all projects. |
| `facts[]` | Extra verified statements, shown as a list. Don't repeat the headline figure. |
| `statistic` | `{value, unit, source}`. If `value` is set, `unit` and `source` are required by validation. |
| `image` | Optional timeline photo. Fallbacks: the project's first photo (no caption), then an illustration that shows the statistic. |
| `confirmedBy`, `reviewDate` | Record-keeping (not shown) |

### Gallery album — `album`

`title`, `slug`, `category`, `description`, `photos[]` (at least 1), `order`. The gallery merges
albums with projects that have photos, sorted by `order` / `galleryOrder` (lower first).

### Officer — `officer`

`name`, `role` (fixed list of eight roles), `serviceYear`, `portrait`, `order`, `status`
(`current` | `archived`). The site shows `status == "current"` ordered by `order`. Archive past
officers rather than deleting them.

## Shared types

### Photo — `photo` (image with hotspot)

| Field | Notes |
| --- | --- |
| `alt` | Required, 10–200 characters. Describe what's visible; don't identify people from their faces. |
| `caption` | Optional; shown under timeline photos and in the photo viewer (falls back to `alt` there) |
| `credit` | Defaults to "Lions Club of Dummalasuriya" |
| `permissionConfirmed` | Tick once the club confirms publication permission |

The site requests `asset`, `crop`, `hotspot`, `alt`, `caption` and the asset's `metadata.lqip`.

### Section heading — `sectionHeading`

`eyebrow` (≤ 60), `title` (≤ 90, supports `*accent*`), `intro` (≤ 240).

## Adding a field

1. Add it to the schema in `studio/schemaTypes/…` and run `npx sanity schema validate` in `studio/`.
2. Add it to the GROQ projection in `lib/sanity/queries.ts`.
3. Map it in `lib/site-data.ts` and add it to `lib/types.ts`.
4. Use it in the component. Hide the element when the value is empty.
5. If it needs an initial value for existing content, patch the live document with
   `setIfMissing` rather than re-running the seed (which replaces documents).
