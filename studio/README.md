# Sanity Studio — Lions Club of Dummalasuriya

Content editing for the club website. Project `zhxlfgcp`, two workspaces:

| Workspace | URL path | Dataset | Contents |
| --- | --- | --- | --- |
| Website content | `/website` | `production` (public) | Club settings, homepage wording, projects, albums, officers |
| Enquiries | `/enquiries` | `enquiries` (private) | Enquiry form submissions |

```bash
npm install
npm run dev       # http://localhost:3333
npm run build     # check the Studio builds
npm run deploy    # publish to https://lions-dummalasuriya.sanity.studio
```

| Path | Purpose |
| --- | --- |
| `sanity.config.ts` | Workspaces and singleton rules (Club settings, Homepage) |
| `structure.ts` | Desk structure for website content |
| `schemaTypes/documents/` | `siteSettings`, `homepage`, `project`, `album`, `officer` |
| `schemaTypes/objects/` | `photo`, `activity`, `sectionHeading` |
| `schemaTypes/enquiries/` | `enquiry` schema and its desk structure |
| `seed/` | The script that created the initial content. It reads the original photos from `seed/images/club/`, which is git-ignored; get them from the club's shared drive |

**`npm run seed` replaces the seeded documents in `production`** and wipes editors' changes to them.
Use it only on a fresh dataset.

More detail:

- [Editor guide](../docs/editor-guide.md): for club editors
- [Content model](../docs/content-model.md): every type and field
- [Maintenance](../docs/maintenance.md): backups, tokens, restoring
