# Lions Club of Dummalasuriya — website

The public website of the Lions Club of Dummalasuriya (Lions District 306 D11, Sri Lanka), with content
managed in Sanity.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · GSAP + Lenis + Motion ·
Sanity (Studio in [`studio/`](studio/))

> **Status:** feature-complete prototype running on live Sanity content. The page is `noindex` until
> launch. See [docs/project-status.md](docs/project-status.md) for what is left.

## Quick start

Requirements: Node.js 22.12 or newer (Sanity Studio needs it; the site alone runs on 20.9+) and npm.

```bash
# Website
npm install
npm run dev                     # http://localhost:3000

# Sanity Studio (content editing), in a second terminal
cd studio
npm install
npm run dev                     # http://localhost:3333
```

The site reads published content straight from the Sanity project `zhxlfgcp`, so it works without
any local content setup or environment variables.

## Scripts

| Where | Command | What it does |
| --- | --- | --- |
| root | `npm run dev` | Development server with hot reload |
| root | `npm run build` / `npm start` | Production build / serve it |
| root | `npm run lint` | ESLint |
| root | `npx tsc --noEmit` | Type-check |
| `studio/` | `npm run dev` | Sanity Studio locally |
| `studio/` | `npm run deploy` | Publish the Studio to <https://lions-dummalasuriya.sanity.studio> |
| `studio/` | `npm run seed` | **Replaces** seeded documents with the initial content — see the warning in [docs/maintenance.md](docs/maintenance.md) |

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | No (defaults to `zhxlfgcp`) | Sanity project |
| `NEXT_PUBLIC_SANITY_DATASET` | No (defaults to `production`) | Public content dataset |
| `SANITY_REVALIDATE_SECRET` | Only with the optional publish webhook | Verifies calls to `/api/revalidate` |

Never commit `.env.local`; it is git-ignored.

## Project layout

```
app/                    Routes: homepage, /privacy, 404, layout + metadata, robots, sitemap, manifest,
                        icons, server actions, /api/revalidate
components/
  sections/             One component per page section (Hero, About, Projects, Gallery, …)
  motion/               Smooth scrolling, scroll animations, providers
  ui/                   Shared pieces (headings, emblem, icons, links)
lib/
  sanity/               Sanity client, GROQ query, image helpers
  site-data.ts          Fetches and shapes all page content
  content.ts            Fixed content kept in code (Lions links, global causes, menu)
  enquiry.ts            Enquiry form fields, validation and the WhatsApp message
public/images/          Official Lions emblem only (all photos live in Sanity)
public/icons/           Home-screen icons generated from the emblem
studio/                 Sanity Studio: schemas, desk structure and seed script (original photos are not committed)
docs/                   Project documentation (below)
```

## Documentation

| Document | For | Covers |
| --- | --- | --- |
| [docs/editor-guide.md](docs/editor-guide.md) | Club editors | Updating projects, photos, officers and wording in the Studio; replying to WhatsApp enquiries |
| [docs/architecture.md](docs/architecture.md) | Developers | How the site is built: data flow, caching, live updates, motion system |
| [docs/content-model.md](docs/content-model.md) | Developers | Every Sanity document type and how it maps to the page |
| [docs/enquiries.md](docs/enquiries.md) | Developers, club | Enquiry form: WhatsApp flow, validation, privacy |
| [docs/deployment.md](docs/deployment.md) | Developers | Deploying to Vercel, Studio hosting, domains, go-live checklist |
| [docs/maintenance.md](docs/maintenance.md) | Developers | Backups, tokens, updates, testing, troubleshooting |
| [docs/launch-day.md](docs/launch-day.md) | Developer | Step-by-step for going public: search indexing, Google Search Console, share previews |
| [docs/project-status.md](docs/project-status.md) | Everyone | Requirements coverage, open club decisions, remaining work |

## Brand rules in one line

Use the official Lions emblem unaltered on a plain background, keep Lions blue `#00338D`, yellow
`#EBB700` and navy `#0D2240`, Roboto for text, and attribute Lions International statements. Details in
[docs/architecture.md](docs/architecture.md#brand-and-accessibility).
