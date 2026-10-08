# Project status

Last updated: 6 October 2026. Measured against *Lions Club of Dummalasuriya — Website Requirements*
(the club's requirements document; IDs below refer to it).

**Summary:** the site is feature-complete as a prototype running on live Sanity content. It is not yet
public (`noindex`). Launch depends on the club decisions in [Club decisions](#club-decisions) and the
items in [Remaining work](#remaining-work).

Status key: **Done** · **Partly done** (see note) · **Club** (waiting on a club decision or input) ·
**To do**

## Requirements coverage

### Homepage and core interaction (Section 04)

| ID | Requirement | Status | Notes |
| --- | --- | --- | --- |
| FR01 | Navigation | Done | Sticky header, unmodified emblem linking to top, focus-trapped mobile menu, skip link, headings clear the header after anchor jumps |
| FR02 | Homepage message | Done | "Become a member" primary, "Explore our projects" secondary; installation group photo as hero (hotspot keeps the group in frame) |
| FR03 | About the club | Done | Local identity, pillars, attributed mission and vision with official links |
| FR04 | Impact highlights | Club | Three highlights with the July–September 2026 period. The "selected activities, not lifetime totals" note is an optional field (Club settings → Highlights note), currently empty; the club decides whether to fill it (see D-extra below) |
| FR05 | Calls to action | Done | Membership, volunteering and support buttons all open the enquiry form; nothing implies registration or payment |
| FR06 | External resources | Done | Facebook, Lion Portal, member resources, brand guidance; new tabs use `rel="noopener noreferrer"` and an "opens in new tab" label; no social feed |

### Projects (Section 05)

| ID | Requirement | Status | Notes |
| --- | --- | --- | --- |
| FR07 | Project presentation | Partly done | Title, category, date, place, summary, results and image or illustration per record. The footnote under the timeline was removed; the optional highlights note (FR04) covers the figures |
| FR08 | Accurate figures | Done | 250 and 50 saplings kept separate; no combined total; "eight clubs" shown as participating clubs |
| FR09 | Photo attribution | Club | General captions in use; the elders home record shows its illustration. Needs D03 / D09 to map photos to events |

### Gallery and officers (Sections 06–07)

| ID | Requirement | Status | Notes |
| --- | --- | --- | --- |
| FR10 | Albums | Done | 6 albums, 37 photos, cover, category, count, counter, thumbnails; single-photo albums have no navigation |
| FR11 | Accessible viewer | Done | Arrow keys, Escape, focus trap and return, announced captions, contain-fit, scrolls on short screens |
| FR12 | Image delivery | Done | Next.js image optimiser (WebP/AVIF, responsive sizes), lazy loading, hero preloaded, blur placeholders reserve space |
| FR13 | Officer cards | Done | 8 profiles, square portraits, 4 columns on wide screens, names wrap |
| FR14 | Officer maintenance | Done | `serviceYear`, `order`, `current`/`archived` in Sanity; year comes from Club settings, never the calendar |

### Membership, support and contact (Section 08)

| ID | Requirement | Status | Notes |
| --- | --- | --- | --- |
| FR15 | Membership guide | Done | Three steps, editable in Sanity; no invented rules or fees |
| FR16 | Volunteering | Done | Separate "volunteering" enquiry topic |
| FR17 | Meetings and events | Done (baseline) | Event publishing not commissioned. "Visiting a meeting" is an enquiry topic; `#events` links preselect it |
| FR18 | Donations and partnerships | Done | Enquiry route only; no payments or bank details |
| FR19 | Contact | Club | `tel:+94765646292`, club email, Facebook; no address or map. WhatsApp added as the enquiry channel: club to confirm the number (D10) |

### Brand (Section 09)

| ID | Requirement | Status | Notes |
| --- | --- | --- | --- |
| BR01 | Official emblem | Done | Original file, never recoloured, always on a white disc, never over a photo |
| BR02 | Organisation naming | Done | Local club naming; Lions International links are labelled as external |
| BR03 | Readability | Partly done | Colour pairs chosen for contrast (no yellow on white); formal contrast audit still to do |
| BR04 | Photography | Done | Real club photos only; no stock or AI images |
| BR05 | Presentation | Done | No autoplay, carousels or pop-ups; all motion respects "reduce motion" |

The eight global-cause icons are drawn for this site, not the official Lions cause icons (see
[Club inputs](#club-inputs)).

### Content management (Section 11)

Option B (a simple CMS) is implemented with Sanity: club settings, projects with approved statistics and
sources, officers, albums and photos with alt text, credit and permission record. Enquiries are not
stored (they go to WhatsApp). Individual editor accounts, export and backup procedures are documented in
[editor-guide.md](editor-guide.md) and [maintenance.md](maintenance.md).

Not implemented: a separate "publisher" role. Sanity's free plan has only Administrator and Viewer
roles, so every editor is an Administrator and the club's review step is a process, not a permission.

### Search, measurement and privacy (Section 13)

| ID | Requirement | Status | Notes |
| --- | --- | --- | --- |
| SEO01 | Metadata | Done | Title and description editable in Club settings → Search & sharing |
| SEO02 | Discoverability | Ready | Canonical URLs, `robots.txt` and `sitemap.xml` (home and privacy) in place. At launch set `searchIndexing = true` in `lib/content.ts`, which removes `noindex` and advertises the sitemap |
| SEO03 | Sharing | Ready | Open Graph and Twitter images from the hero photo (1200 × 630, whole group in frame). Structured data (schema.org `NGO`) with only facts shown on the page. Test the preview on launch day ([launch-day.md](launch-day.md#4-check-how-the-link-looks-when-shared)) |
| — | Analytics | Not commissioned | None installed (D10) |
| — | Privacy notice | Club | `/privacy` written from what the site actually does (checked: no cookies or browser storage; the browser contacts only Vercel and Sanity's live API). Names Vercel, Sanity and WhatsApp. Linked from the footer and the form. Club to approve the wording |
| — | Form security | Done | No server endpoint, storage or secrets: the form only builds a WhatsApp link, so there is nothing to attack or leak |
| — | Security headers | Done | HTTPS with HSTS (Vercel), `nosniff`, `Referrer-Policy`, framing blocked (`X-Frame-Options` and `frame-ancestors`), `Permissions-Policy`. No full Content-Security-Policy: it would need per-request nonces, which would stop the page being cached |
| — | Backups | Partly done | Procedure documented and tested manually; not yet scheduled |

### Acceptance tests (Section 14)

| ID | Test | Status | Evidence so far |
| --- | --- | --- | --- |
| AT01 | Content accuracy | Club | Matches Section 02; club sign-off needed |
| AT02 | Projects | Done | Four records, separate sapling figures, shared cleaning effort attributed |
| AT03 | Images and officers | Club | 6 albums / 37 photos / 8 profiles; roster needs sign-off (D02) |
| AT04 | Navigation | Done | Automated browser checks (anchor offsets, menu focus) |
| AT05 | Gallery | Done | Automated browser checks (all albums, keys, thumbnails, single photo) |
| AT06 | Contact and support | Done | Link targets checked; wording reviewed |
| AT07 | Responsive and accessible | Partly done | Edge at 360–1900 px and with reduced motion; axe (WCAG 2.2 AA + best practice) on home, privacy and 404 at desktop and phone width: no violations except two transient scroll-effect states (see note below). Still to do: other browsers, real phones, 200% zoom, screen reader |
| AT08 | Speed and search | Partly done | Lighthouse 13 (9 Oct 2026), see below. CLS 0. Field data (Core Web Vitals) only after launch, once there is traffic |
| AT09 | Optional features | Partly done | WhatsApp form: validation, message content, number, focus and mobile layout tested automatically. Real send to the club number to test on a phone |
| AT10 | Release and recovery | To do | First production deploy, rollback demonstration, restore test record |

## Club decisions

| ID | Decision | Current position |
| --- | --- | --- |
| D01 | Platform and editing | **Proposed:** Sanity CMS (built). Club to confirm and name editors |
| D02 | Officers | Displayed roster awaiting confirmation of spellings, roles and year |
| D03 | Sapling records | Kept separate with general captions; club to say whether 50 is part of 250 and map photos |
| D04 | Meetings | No meeting details published; visitors use the enquiry form |
| D05 | Membership | Three-step guide only |
| D06 | Donations | Enquiries only |
| D07 | Domain and budget | Domain **lionsclubofdummalasuriya.org** connected. Open: account ownership at handover, hosting plan (see [deployment.md](deployment.md#choose-the-hosting-plan)), maintenance terms |
| D08 | Languages | English only |
| D09 | Photo permissions and context | General captions; `permissionConfirmed` is unticked until the club confirms |
| D10 | Enquiries and measurement | **Proposed:** website form that opens WhatsApp to the secretary (built); no analytics. Club to confirm the WhatsApp number, approve the wording and agree who replies |
| D-extra | Impact footnote | Club to decide whether to show the "selected projects only" note. It is an optional Studio field, empty by default, so they can add it themselves |

## Club inputs

- Confirmation of the officer roster (D02) and the sapling photo mapping (D03).
- Photo publication permission (D09).
- Approval of the WhatsApp enquiry form and its wording; confirmation of the WhatsApp number and who
  replies (D10).
- Whether to swap the drawn cause icons for the official Lions Global Causes icons from the brand
  resource hub.
- Domain, hosting plan and account ownership (D07).

## Audit results (9 October 2026)

Lighthouse 13, homepage, with Lighthouse's simulated throttling:

| Run | Performance | Accessibility | Best practices | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- |
| Desktop, live site | 99 | 92 → 96 after fixes | 100 | 1.0 s | 0 | 60 ms |
| Mobile, live site | 65 | 92 → 96 after fixes | 100 | 5.3 s | 0 | 340 ms |
| Mobile, local production build | 77–82 | 96 | — | 4.0–4.6 s | 0 | 190–350 ms |

The SEO score (66) only reflects the deliberate `noindex` before launch.

Fixed after the audit:

- Album cards and the header logo link: visible text is now part of the accessible name (WCAG 2.5.3).
- The scroll-highlighted "Our club" statement no longer puts `aria-label` on a `<p>`.
- "Our club" pillar numbers changed from yellow to Lions blue (yellow on white was 1.85:1).
- The ribbon animation pauses while off screen; the sunburst rotates a wrapper `<div>`, not the SVG.

Recorded, not changed (decorative scroll effects):

- The "Our club" statement's words start pale and brighten as they scroll into reading position, and
  the hero copy fades as it scrolls away. Automated tools flag both in their in-between states; at the
  point a visitor reads them, contrast is full. With "reduce motion" on, neither effect runs.
- Mobile LCP is held back mainly by the amount of animation JavaScript (GSAP, Lenis, Motion) on slow
  phones; the hero photo itself loads in about 0.2 s. Reducing it further means deferring the
  animation system, which risks a flash of content and was not done.

## Remaining work

Before launch:

- [x] Site-wide privacy page (club to approve the wording)
- [x] SEO02 prepared: switch on with `searchIndexing` at launch
- [x] Branded 404 page; favicon, app icons and web manifest
- [x] Lighthouse and axe audit; fixes applied (see below)
- [ ] Move the Playwright browser checks into the repository as a test suite
- [ ] Manual accessibility checks: keyboard-only pass, 200% zoom, a screen reader (NVDA or VoiceOver)
- [ ] Cross-browser and device testing (Chrome, Firefox, Safari/iOS, Android)
- [ ] First deploy following [deployment.md](deployment.md), then the go-live checklist

Handover:

- [ ] Editor training session and the [editor guide](editor-guide.md)
- [ ] Account and renewal ownership record (GitHub, host, Sanity, domain)
- [ ] Test results record (AT01–AT10 as Pass / Fail / Not applicable)
- [ ] Third-party licence notices

Optional, after launch:

- [ ] Scheduled backups
- [ ] Event publishing (FR17), Sinhala and Tamil versions (D08), analytics (D10)
