# Maintenance

## Backups

Sanity is the only copy of the live content. Back up before significant releases and on a regular
schedule, for example monthly (requirements Sections 11, 13 and AT10).

```bash
cd studio
npx sanity datasets export production ../backups/production-$(date +%F).tar.gz
```

- `backups/` is git-ignored. Store the files somewhere the club controls, such as the club's Google
  Drive next to the original photos.
- The export includes all images, so it is a complete restore point.
- On Sanity's free plan the Studio's History only reaches back a few days, so these exports are the
  real safety net.

### Restore (and test the restore)

Test a backup by importing it into a scratch dataset, never straight over production:

```bash
cd studio
npx sanity datasets create restore-test --visibility private
npx sanity datasets import ../backups/production-YYYY-MM-DD.tar.gz --dataset restore-test
# check it, then remove it:
npx sanity datasets delete restore-test
```

For a real restore into `production`, add `--replace` to the import. That overwrites documents with
the same IDs, so take a fresh export first.

### The seed script

`studio/seed/build-seed.mjs` created the initial content from the original club photos in
`studio/seed/images/club/`. Those photos are **not in the repository** (it is public and they show
identifiable people). The master copies are kept in the club's shared drive; copy them into that folder
before running the seed. The live site doesn't need them, and Sanity exports include every image. **`npm run seed` replaces those documents**, wiping editors' changes to them. Use
it only to rebuild a fresh dataset. For adding fields to live content, patch with `setIfMissing`
instead (see [content-model.md](content-model.md#adding-a-field)).

## Tokens and access

| Item | Where | Rotate when |
| --- | --- | --- |
| Webhook secret (optional) | Vercel env var + Sanity webhook | Same |
| Studio members | sanity.io/manage → Members | Officers change each service year: remove people who no longer edit. On the free plan editors must be **Administrators** (the only other role, Viewer, can't edit) |
| WhatsApp number for enquiries | Studio → Club settings → Contact | The secretary changes |

Never put secrets in the repository, the requirements document or chat messages.

## Updating dependencies

```bash
npm outdated                     # website
npm update                       # within the allowed ranges
cd studio && npm outdated && npm update
```

Major upgrades (Next.js, React, Sanity, GSAP, Tailwind) can be breaking. Next.js ships version-matched
docs in `node_modules/next/dist/docs/`; read the upgrade guide there before bumping. After any upgrade,
run the release checks below.

## Release checks

Before each deploy to production:

```bash
npx tsc --noEmit && npm run lint && npm run build
cd studio && npx sanity schema validate
```

Then in a browser (desktop and phone width):

- [ ] Menu links scroll to each section and clear the sticky header; the mobile menu opens, closes with
      Escape and returns focus
- [ ] Every gallery album opens; arrow keys, Escape, thumbnails and swipe work; photos are uncropped
- [ ] The enquiry form shows errors on an empty submit, and a valid one opens WhatsApp with the
      message addressed to the club number
- [ ] `/#enquiry` and `/#events` land on the form
- [ ] Publishing a small change in the Studio appears on the open site within a few seconds
- [ ] With the OS "reduce motion" setting on, everything is visible and nothing animates
- [ ] Phone, email and Facebook links go to the right places
- [ ] No horizontal scrolling at 360px width

The browser checks were automated with Playwright during development. Adding them to the repository as
a test suite is listed in [project-status.md](project-status.md).

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Build fails: "Club settings" or "Homepage" document is missing | The singleton was unpublished or deleted | Publish it in the Studio |
| Edits don't appear | Not published, or the site origin isn't in Sanity CORS (falls back to a 1-minute refresh) | Press Publish; add the origin with `npx sanity cors add` |
| Enquiries go to the wrong person | WhatsApp number not updated after a change of secretary | Update Club settings → Contact → WhatsApp number |
| Enquiry form missing (only the call button shows) | WhatsApp number is empty | Fill it in and publish |
| A photo looks badly cropped | The hotspot or crop in the Studio | Open the photo in the Studio and adjust the hotspot |
| New Tailwind classes have no effect | The class name was built at runtime | Write class names out in full in the source |
| Section animates oddly or gets stuck | A CSS `transition` on `transform` conflicting with GSAP | Use `transition-[translate]` or remove the transition |
| Studio shows "Unknown field" | Content has a field the schema no longer defines | Unset it in the document, or add the field back |
