# Enquiry form

Visitors send membership, volunteering, meeting, support and community enquiries from the
**Get involved** section. Submissions are stored in Sanity for the secretary to follow up. There are
no email notifications by design: the club checks the Studio.

This corresponds to the optional enquiry form in Section 08 of the requirements (decision D10). The
club must approve the form and its privacy wording before launch.

## Flow

```
EnquiryForm.tsx (client)
  └─ <form action={submitEnquiry}>
       app/enquiry-actions.ts (server action)
         1. read fields            lib/enquiry.ts → readEnquiry()
         2. spam traps             honeypot field "website", minimum fill time 3 s
         3. validate               lib/enquiry.ts → validateEnquiry()
         4. rate limit             5 per IP per 10 minutes (per server instance)
         5. create document        lib/sanity/enquiries.ts → private "enquiries" dataset
       ◄─ EnquiryState: success | error (field errors + values to refill)
```

- Other buttons preselect the topic with `data-enquiry="volunteering"` (and `href="#enquiry"`). Arriving
  at `/#events` preselects "Visiting a meeting".
- Bots that trip a spam trap get a normal-looking success and nothing is stored.
- On a storage failure the visitor sees an error that offers the phone and email instead; the server
  logs the error message only, never the person's details.

## Fields and validation

| Field | Rule |
| --- | --- |
| Topic | One of: membership, volunteering, meeting, support, community, other |
| Name | 2–100 characters |
| Reply by | `email` or `phone`; only the chosen detail is stored |
| Email | Basic address format, when email is chosen |
| Phone | 9–15 digits after removing spaces, `+`, `-`, brackets |
| Area | Optional, up to 100 characters |
| Message | Optional, up to 2,000 characters; at least 10 characters for "community" and "other" |
| Consent | Must confirm they read how details are used |

Labels, topics and the privacy notice are deliberately in code (`lib/enquiry.ts`,
`components/sections/EnquiryForm.tsx`), because they must match how the form behaves. The card's
heading, intro and tick points are editable in **Homepage → Get involved**.

## Privacy

- **Storage:** private dataset; anonymous API requests return nothing. Readable only by signed-in Studio
  users and the server.
- **Token:** `SANITY_ENQUIRIES_WRITE_TOKEN` is an Editor token used only on the server. It never reaches
  the browser. Editor tokens can write to every dataset in the project, so treat it as a secret.
- **Minimisation:** only one contact detail; no ID documents or dates of birth.
- **Retention:** each enquiry gets `deleteAfter = submittedAt + 12 months` (`RETENTION_MONTHS` in
  `lib/enquiry.ts`). The privacy notice states 12 months. If you change one, change the other.
- **Deletion is manual:** the Studio's **Due for deletion** list shows expired enquiries; the club deletes
  them. Automating this (for example a scheduled job) is possible future work.
- **Accessibility:** labelled fields, error summary that receives focus and links to each field,
  `aria-invalid` and `aria-describedby` on fields, values kept after an error, and an announced
  success message.

The site-wide privacy notice required by Section 13 still needs writing (see
[project-status.md](project-status.md)). It must name Sanity.io and the hosting provider.

## Studio workflow

Enquiries workspace → **New** → reply → set **Contacted**, **Handled by**, notes → **Closed**. Full
steps for the club are in the [editor guide](editor-guide.md#handling-enquiries).

## Rotating the token

```bash
cd studio
npx sanity tokens list                                   # find the old token's id
npx sanity tokens add "Website enquiry form (server only)" --role=editor
# put the new value in .env.local and the host's environment variables, redeploy, then:
npx sanity tokens delete <old-token-id> --yes
```

## Testing it

Submit a clearly labelled test enquiry, confirm it appears under **New**, then delete it. Also check
that an empty submit shows the error summary, and that `/#enquiry` lands on the form.
