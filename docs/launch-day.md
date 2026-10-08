# Launch day

Step-by-step for making lionsclubofdummalasuriya.org public. It takes about an hour, most of it
waiting for checks. Everything else is already in place: domain, HTTPS, Studio, WhatsApp form,
privacy notice, 404 page, icons, sitemap, structured data and security headers.

## The day before

- [ ] All commits pushed; `git status` says "up to date with origin/main"
- [ ] On the live domain, these work: `/privacy`, `/robots.txt`, `/sitemap.xml`, a made-up address
      such as `/test` (branded 404 page), and the browser-tab icon
- [ ] The club has signed off (see [project-status.md](project-status.md#club-decisions)):
  - [ ] officer names, roles and service year
  - [ ] sapling figures and photo captions
  - [ ] permission to publish the photos
  - [ ] the WhatsApp number in Club settings → Contact
  - [ ] the privacy notice at `/privacy`
- [ ] The club Gmail is a member of the Sanity project as **Administrator**, and has signed in to
      <https://lions-dummalasuriya.sanity.studio>
- [ ] A content backup exists (`backups/production-…-prelaunch.tar.gz`) and a copy is in the club's
      Google Drive with the original photos

If something the club hasn't approved is still on the site, fix or remove it in the Studio first.
Going public is the club's decision.

## 1. Turn on search indexing

In `lib/content.ts`:

```ts
export const searchIndexing = true;
```

```bash
git add lib/content.ts
git commit -m "chore: launch: allow search engines to index the site"
git push
```

Vercel deploys in 1–2 minutes (Vercel → Deployments shows "Ready").

## 2. Check the switch worked

```bash
curl -s https://lionsclubofdummalasuriya.org/ | grep -o '<meta name="robots"[^>]*>'
# expected: index, follow

curl -s https://lionsclubofdummalasuriya.org/robots.txt
# expected to end with: Sitemap: https://lionsclubofdummalasuriya.org/sitemap.xml
```

Or open the site, right-click → View page source, and search for `robots`.

## 3. Google Search Console

1. Go to <https://search.google.com/search-console> and sign in, ideally with the **club's** Google
   account so the club owns the property.
2. **Add property → Domain** → `lionsclubofdummalasuriya.org`.
3. Google shows a TXT record (`google-site-verification=…`). In Namecheap → Domain List → Manage →
   **Advanced DNS → Add New Record**: type **TXT Record**, host `@`, value = the text Google gave.
   Save, wait a few minutes, then press **Verify** in Google. Leave the TXT record in place
   permanently.
4. **Sitemaps** → enter `sitemap.xml` → Submit.
5. **URL inspection** → paste `https://lionsclubofdummalasuriya.org/` → **Request indexing**.

Google usually lists a new site within a few days to two weeks. Searching the club name before then
showing nothing is normal.

Optional: <https://www.bing.com/webmasters> → **Import from Google Search Console** covers Bing
(and the search engines that use it) in one click.

## 4. Check how the link looks when shared

- **Facebook:** <https://developers.facebook.com/tools/debug/> → paste the URL → **Scrape Again**. The
  preview should show the installation group photo, the title and the description.
- **WhatsApp:** send the link to yourself. It should show the same photo and title. WhatsApp caches
  previews, so if you shared the link before launch, an old preview may show for a while.

## 5. Final checks on a real phone

- [ ] The site opens on mobile data (not just Wi-Fi)
- [ ] The menu works and links land on the right sections
- [ ] An album opens and swipes
- [ ] The enquiry form opens WhatsApp addressed to the club number (send one clearly marked test,
      then delete the chat)
- [ ] **Add to Home Screen** shows the Lions emblem icon and the club name

## 6. Announce

- Update the **Website** field on the club's Facebook page to `https://lionsclubofdummalasuriya.org`.
- Post the link on the Facebook page and in the club's WhatsApp groups.
- Optional: add the link to the district or Lion Portal club listing, if the club keeps one there.

## If something goes wrong

| Problem | Do this |
| --- | --- |
| A mistake in the content | Fix it in the Studio and press Publish; the site updates within seconds |
| The new deployment is broken | Vercel → Deployments → the previous one → **Promote to Production** |
| The club wants the site hidden again | Set `searchIndexing = false`, push. To also drop pages Google already listed, use Search Console → **Removals** |

## The first month

- Look at Search Console once a week: **Pages** (indexing errors) and **Performance** (searches).
- Take a backup after the first round of edits ([maintenance.md](maintenance.md#backups)), then
  monthly.
- Keep Namecheap **Auto-Renew** on for the domain.
