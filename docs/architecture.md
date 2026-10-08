# Architecture

A single-page Next.js site whose content lives in Sanity. Visitors get a cached, pre-rendered page;
editors' changes refresh it within seconds.

```
            ┌──────────── Sanity (project zhxlfgcp) ────────────┐
            │  production dataset (public)                       │
            │  settings, homepage, projects, albums, officers,   │
            │  images                                            │
            └──────▲───────────────────▲─────────────────────────┘
       GROQ query  │      live events  │ (browser)
                   │                   │
┌──────────────────┴───────────┐   ┌───┴──────────────────────┐        ┌──────────────────────┐
│ Next.js server               │   │ Visitor's browser         │ wa.me  │ WhatsApp             │
│ app/page.tsx → getSiteData() │◄──│ SanityLiveRefresh         │───────►│ club's enquiry number│
│ ISR, revalidate = 60 s       │   │ EnquiryForm (no server)   │        │                      │
└──────────────────────────────┘   └───────────────────────────┘        └──────────────────────┘
```

## Rendering and data

- **One route**, `app/page.tsx`, composed of section components in `components/sections/`. Section
  order follows the sitemap in the requirements (Home, Our club, Projects, Gallery, Officers, Get
  involved, Support, Contact). Anchors such as `#about`, `#projects` and `#events` are stable.
- **`lib/site-data.ts`** runs one GROQ query (`lib/sanity/queries.ts`) and maps the result into the
  view models in `lib/types.ts`. It is wrapped in React `cache()`, so every server component can call
  `getSiteData()` and only one request is made per render.
- **Server vs client components.** Most sections are server components. Interactive ones (header,
  causes panels, gallery and viewer, officers, FAQ, enquiry form, ribbon) are client components that
  receive their data as props.
- **Published content only.** The Sanity client uses `perspective: "published"` and no token, so
  drafts never reach the site.
- **`lib/content.ts`** holds content deliberately kept out of the CMS: Lions International links, the
  eight global causes and the menu.

## Caching and freshness

| Mechanism | Where | Effect |
| --- | --- | --- |
| ISR, `revalidate = 60` | `app/page.tsx` | The page is static and rebuilt at most once a minute, on the next visit after it goes stale |
| Live Content API | `components/SanityLiveRefresh.tsx` → `app/actions.ts` | Open browsers hear about publishes and call a server action that runs `revalidatePath("/")`; the open page re-renders with fresh data in ~2–3 s |
| Optional webhook | `app/api/revalidate/route.ts` | Signed Sanity webhook for refreshing even when nobody has the site open |

The server reads Sanity with `useCdn: false`, so a rebuild triggered by a publish never picks up a
stale cached API response. Request volume stays low because the page itself is cached.

Live updates need each site origin in Sanity's **CORS origins** (no credentials). See
[deployment.md](deployment.md).

## Images

- All photos are Sanity image assets. `lib/sanity/image.ts` turns them into a `Photo` object: the
  editor's **crop** is applied in the URL, the **hotspot** becomes CSS `object-position`, and a tiny
  **LQIP** blur is used as the placeholder.
- Images are rendered with `next/image` through Next's optimiser (`remotePatterns` in
  `next.config.ts` allows only this project's `cdn.sanity.io` path), so visitors load them from the
  website rather than from Sanity directly.
- The hero photo uses `preload` and is never faded in, because it is the Largest Contentful Paint.
- The only file in `public/images` is the official Lions emblem.

## Enquiry form

See [enquiries.md](enquiries.md). In short: the form validates in the browser, builds a message and
opens a `wa.me` link to the club's WhatsApp number. The website has no server code, storage or
secrets for enquiries.

## Motion system

| Library | Used for |
| --- | --- |
| **GSAP** + ScrollTrigger + SplitText (`components/motion/Choreographer.tsx`) | All scroll animations, declared with data attributes |
| **Lenis** (`components/motion/SmoothScroll.tsx`) | Smooth scrolling on GSAP's ticker; in-page anchor handling |
| **Motion** (`motion/react`) | Hover variants, mobile menu, FAQ accordion, form transitions, album → viewer morph |
| **CSS only** | Hero intro (paints before hydration), rotating rays, cause panels' open/close |

Scroll animations are opt-in through attributes, so sections stay server components:

| Attribute | Effect |
| --- | --- |
| `data-split` | Heading lines rise out of a mask |
| `data-reveal` / `data-reveal="fade"` | Fade up on enter / opacity only (position stays fixed for anchor jumps) |
| `data-stagger` | Direct children fade up in sequence |
| `data-count` | Number counts up from 0 |
| `data-scrub-words` | Words brighten as the paragraph scrolls through |
| `data-parallax="0.12"` | Drift by that fraction of the element's height |
| `data-clip-reveal` | Wipe open from the bottom |
| `data-timeline` + `data-timeline-fill` | Line grows with scroll |
| `data-draw` | SVG path draws in |

Rules learned the hard way:

- **Never put a CSS `transition` on `transform`** for an element GSAP animates; they fight and the
  element sticks part-way. Use `transition-[translate]` for Tailwind hover lifts.
- **Don't fade or hide a form or anchor target** with a y-offset reveal; links measure its position
  while it is shifted. Use `data-reveal="fade"` or no reveal.
- **The pinned gallery adds scroll length after mount.** `SmoothScroll` re-aims in-progress anchor
  jumps after each `ScrollTrigger.refresh`, so `/#enquiry` deep links land correctly.
- **Negative top margins collapse through parents.** The impact strip's section uses `flow-root` so
  its white background doesn't cover the hero.
- **Tailwind only generates classes written out in full.** Never assemble class names at runtime
  (the cause panels use a `cause-open:` custom variant defined in `app/globals.css` instead).

**Reduced motion:** with `prefers-reduced-motion: reduce`, GSAP animations are skipped (`gsap.matchMedia`),
Lenis is not started, Motion follows the setting (`MotionConfig reducedMotion="user"`), and CSS
animations are cut to near zero. All content stays visible.

## Brand and accessibility

- **Emblem:** `public/images/lions-emblem.png`, the official file. Never recoloured, cropped or placed
  over a photo; it always sits on a plain white disc (BR01).
- **Colours** (tokens in `app/globals.css`): Lions blue `#00338D`, yellow `#EBB700`, navy `#0D2240`.
  Never put yellow text on white or white text on yellow (about 1.9:1 contrast).
- **Type:** Roboto (variable, self-hosted by `next/font`) for text; Libre Bodoni italic as the accent
  face. Headings use `*asterisks*` in Sanity to mark accent words (`AccentText`).
- **Focus:** visible yellow outline on dark backgrounds, blue on light (`.on-light` / `.on-dark`).
  Anchor targets with `tabindex="-1"` don't show a ring.
- **Keyboard:** skip link, focus-trapped mobile menu and photo viewer, focus returned on close, arrow
  keys in the viewer.

## Studio

`studio/` is a standalone Sanity Studio with one workspace, **Website content** (path `/website`,
dataset `production`), hosted at <https://lions-dummalasuriya.sanity.studio>. Schemas are in
`studio/schemaTypes/`; the desk structure is `studio/structure.ts`. Details in
[content-model.md](content-model.md).
