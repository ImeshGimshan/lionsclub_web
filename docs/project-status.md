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
| FR04 | Impact highlights | Club | Three highlights with the July–September 2026 period. The "selected activities, not lifetime totals" note was removed at the developer's request; the club must accept this or it goes back (see D-extra below) |
| FR05 | Calls to action | Done | Membership, volunteering and support buttons all open the enquiry form; nothing implies registration or payment |
| FR06 | External resources | Done | Facebook, Lion Portal, member resources, brand guidance; new tabs use `rel="noopener noreferrer"` and an "opens in new tab" label; no social feed |

### Projects (Section 05)

| ID | Requirement | Status | Notes |
| --- | --- | --- | --- |
| FR07 | Project presentation | Partly done | Title, category, date, place, summary, results and image or illustration per record. The footnote was removed, as in FR04 |
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
| FR19 | Contact | Done | `tel:+94765646292`, club email, Facebook; no WhatsApp, address or map |

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
sources, officers, albums and photos with alt text, credit and permission record, and a restricted
enquiries store. Individual editor accounts, export and backup procedures are documented in
[editor-guide.md](editor-guide.md) and [maintenance.md](maintenance.md).

Not implemented: a separate "publisher" role. Sanity's free plan has Administrator, Editor and Viewer
roles; drafts must be published by an Editor, so the club's review step is a process, not a permission.

### Search, measurement and privacy (Section 13)

| ID | Requirement | Status | Notes |
| --- | --- | --- | --- |
| SEO01 | Metadata | Done | Title and description editable in Club settings → Search & sharing |
| SEO02 | Discoverability | To do | Canonical URL, `robots.ts`, `sitemap.ts`, `metadataBase` once the domain is known (D07). The page is `noindex` until then |
| SEO03 | Sharing | Partly done | Open Graph and Twitter images from the hero photo (1200 × 630). Test on the final URL |
| — | Analytics | Not commissioned | None installed (D10) |
| — | Privacy notice | Partly done | The form has its own notice. A site-wide privacy page naming Sanity and the host is still needed |
| — | Form security | Done | Server-side validation, spam traps, rate limit, private dataset, server-only token, no personal data in logs |
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
| AT07 | Responsive and accessible | Partly done | Tested in Edge at 360–1900 px and with reduced motion. Still to do: other browsers, real phones, 200% zoom, screen reader |
| AT08 | Speed and search | To do | Lighthouse and Core Web Vitals report; SEO02 |
| AT09 | Optional features | Partly done | Enquiry form: validation, delivery, failure and permissions tested; export and backup test to record |
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
| D07 | Domain and budget | **Open:** domain, hosting plan (see [deployment.md](deployment.md#choose-the-hosting-plan)), maintenance terms |
| D08 | Languages | English only |
| D09 | Photo permissions and context | General captions; `permissionConfirmed` is unticked until the club confirms |
| D10 | Enquiries and measurement | **Proposed:** website enquiry form stored in Sanity (built); no analytics or WhatsApp. Club to approve the form, privacy wording and who checks enquiries |
| D-extra | Impact footnote | Club to accept removal of the "selected projects only" notes from FR04 and FR07, or they are restored |

## Club inputs

- Confirmation of the officer roster (D02) and the sapling photo mapping (D03).
- Photo publication permission (D09).
- Approval of the enquiry form and its privacy notice; the names of the person who checks enquiries
  and a backup (D10).
- Whether to swap the drawn cause icons for the official Lions Global Causes icons from the brand
  resource hub.
- Domain, hosting plan and account ownership (D07).

## Remaining work

Before launch:

- [ ] Site-wide privacy page (hosting, Sanity, enquiry handling, removal requests)
- [ ] SEO02: `metadataBase`, canonical, `app/sitemap.ts`, `app/robots.ts`; remove `noindex`
- [ ] Branded 404 page and proper favicon / app icons (currently the emblem PNG)
- [ ] Move the Playwright browser checks into the repository as a test suite
- [ ] Performance and accessibility audit (Lighthouse, axe, contrast, keyboard, screen reader)
- [ ] Cross-browser and device testing (Chrome, Firefox, Safari/iOS, Android)
- [ ] First deploy following [deployment.md](deployment.md), then the go-live checklist

Handover:

- [ ] Editor training session and the [editor guide](editor-guide.md)
- [ ] Account and renewal ownership record (GitHub, host, Sanity, domain)
- [ ] Test results record (AT01–AT10 as Pass / Fail / Not applicable)
- [ ] Third-party licence notices

Optional, after launch:

- [ ] Scheduled backups
- [ ] Automatic deletion of enquiries past `deleteAfter`
- [ ] Event publishing (FR17), Sinhala and Tamil versions (D08), analytics (D10)
