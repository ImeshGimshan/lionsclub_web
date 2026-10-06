# Deployment

The website deploys to **Vercel**; the Studio deploys to **Sanity's free hosting**. Content and
images are already in Sanity's cloud, so nothing needs migrating.

## Choose the hosting plan

Vercel's free **Hobby** plan is for non-commercial personal use only. Vercel counts a project as
commercial if anyone involved is paid, including "receiving payment to create, update, or host the
site" ([Vercel fair-use guidelines](https://vercel.com/docs/limits/fair-use-policy)). Asking for
donations doesn't count.

| Situation | Plan |
| --- | --- |
| Built and maintained by volunteers | Vercel Hobby (free) |
| Developer paid for the work | Vercel Pro, or Netlify's free plan (allows commercial use; Next.js runs through Netlify's adapter) |

Whichever you choose, the accounts (GitHub, Vercel, Sanity, domain) should be **owned by the club**, or
transferred at handover (requirements Section 14).

## 1. Put the code on GitHub

```bash
git remote add origin https://github.com/<club-account>/<repo>.git
git push -u origin main
```

The repository can be public. Nothing secret or personal is committed:

- `.env.local` (the enquiry token) is git-ignored.
- The original club photos (`studio/seed/images/`) are git-ignored because they show identifiable
  people. The site doesn't need them: every photo it shows is served from Sanity.
- Enquiries live in the private Sanity dataset, never in the code.

Before every push, check that `git status` lists no `.env` file and no photos.

## 2. Create the Vercel project

1. vercel.com → **Add New → Project** → import the repository.
2. Framework: **Next.js** (detected). Root directory: the repository root. Leave the build settings at
   their defaults. The `studio/` folder isn't part of the website build.
3. **Environment variables** (Settings → Environment Variables, for Production and Preview):

   | Name | Value |
   | --- | --- |
   | `SANITY_ENQUIRIES_WRITE_TOKEN` | Copy from your `.env.local` (required for the form) |
   | `SANITY_REVALIDATE_SECRET` | Only if you set up the webhook in step 6 |

4. **Deploy.** You get an address such as `https://<project>.vercel.app`.

`vercel.json` sets the server region to Mumbai (`bom1`), the closest to Sri Lanka. Pages themselves are
served from Vercel's global CDN.

## 3. Allow the site in Sanity (live updates)

The browser connects to Sanity's Live Content API, which only accepts approved origins:

```bash
cd studio
npx sanity cors add https://<project>.vercel.app --no-credentials
```

Do **not** enable "Allow credentials". Repeat for the custom domain later (and `www.` if used).
Without this, the site still works but refreshes only once a minute instead of within seconds.

## 4. Deploy the Studio

```bash
cd studio
npm run deploy        # choose a hostname, e.g. dummalasuriya-lions → https://dummalasuriya-lions.sanity.studio
```

Then invite editors at **sanity.io/manage → project → Members**. Give each person their own login.
Hosted Studios on `*.sanity.studio` are allowed automatically; no CORS step needed.

## 5. Custom domain

When the club decides the domain (D07): Vercel → Project → **Settings → Domains** → add it and follow
the DNS instructions. Then add the domain to Sanity CORS (step 3).

## 6. Optional: publish webhook

Live updates refresh the page whenever someone has the site open. To refresh it immediately even when
nobody does:

1. Generate a long random string and set it as `SANITY_REVALIDATE_SECRET` in Vercel; redeploy.
2. sanity.io/manage → **API → Webhooks → Create**:
   - URL: `https://<your-domain>/api/revalidate`
   - Dataset: `production`
   - Trigger on: create, update, delete
   - Secret: the same string
   - HTTP method: POST

## Go-live checklist

- [ ] Club approvals received (see [project-status.md](project-status.md))
- [ ] `SANITY_ENQUIRIES_WRITE_TOKEN` set in Vercel; a test enquiry arrives in the Studio and is deleted
- [ ] Production domain added to Sanity CORS; publishing a small change shows on the open site within seconds
- [ ] Studio deployed; secretary and a backup editor invited and able to sign in
- [ ] Site-wide privacy page published
- [ ] In `app/layout.tsx`, remove `robots: { index: false, follow: false }`
- [ ] Set `metadataBase` to the production URL; add `app/sitemap.ts` and `app/robots.ts`
- [ ] Share the URL on Facebook/WhatsApp to check the preview image and text
- [ ] Run the checks in [maintenance.md](maintenance.md#release-checks) on the live URL
- [ ] Take the first backup ([maintenance.md](maintenance.md#backups))

## Rolling back

Vercel keeps every deployment. **Deployments → (a previous one) → Promote to Production** restores it
instantly. Content changes are rolled back separately, in the Studio's History or from a backup.
