# Enquiry form (WhatsApp)

Visitors send membership, volunteering, meeting, support and community enquiries from the
**Get involved** section. The form builds a message and opens WhatsApp with it, addressed to the
club's number. The visitor presses Send in WhatsApp and the secretary replies in the same chat.

**The website receives and stores nothing.** There is no server code, database, token or email
service behind the form.

This is the optional enquiry form in Section 08 of the requirements (decision D10). It adds WhatsApp as
a contact channel, which FR19 says needs the club's confirmation; see
[project-status.md](project-status.md).

## Flow

```
components/sections/EnquiryForm.tsx (client)
  1. visitor picks a topic, enters name, area (optional), message
  2. validate               lib/enquiry.ts → validateEnquiry()
  3. build message          lib/enquiry.ts → enquiryMessage()
  4. open link              lib/enquiry.ts → whatsappUrl()  →  https://wa.me/<number>?text=…
  5. show "Almost there"    with a "Try again" link to the same chat
```

- `wa.me` opens the WhatsApp app on phones and WhatsApp Web or Desktop on computers.
- The number comes from **Club settings → Contact → WhatsApp number for enquiries**
  (`whatsappNumber`, required, `+` and digits). If it were ever empty the form is hidden and only the
  call button shows.
- Other buttons preselect the topic with `data-enquiry="volunteering"` (and `href="#enquiry"`). Arriving
  at `/#events` preselects "Visiting a meeting".

Example message:

```
Hello Lions Club of Dummalasuriya,

I'm Nimal from Kuliyapitiya. I'd like to ask about becoming a member.

When is the next meeting?

(Sent from the club website)
```

## Fields and validation

| Field | Rule |
| --- | --- |
| Topic | One of: membership, volunteering, meeting, support, community, other |
| Name | 2–100 characters |
| Area | Optional, up to 100 characters |
| Message | Optional, up to 1,000 characters (keeps the link short); at least 10 characters for "community" and "other" |

No email, phone or consent fields: WhatsApp already gives the secretary the visitor's number, and the
visitor decides whether to send.

Labels, topics and the "How your message is sent" notice are in code (`lib/enquiry.ts`,
`components/sections/EnquiryForm.tsx`) because they must match how the form behaves. The card's
heading, intro and tick points are editable in **Homepage → Get involved**.

## Privacy

- Nothing typed in the form leaves the visitor's device until they press Send in WhatsApp.
- Once sent, the message, name and WhatsApp number are in the secretary's WhatsApp, a service run by
  Meta. The site-wide privacy page must say so.
- Messages stay with whoever holds the number. When the secretary changes, update the number in the
  Studio; past chats stay on the previous secretary's phone, so the club should agree how those are
  handed over or deleted.
- Accessibility: labelled fields, an error summary that receives focus and links to each field,
  `aria-invalid` and `aria-describedby`, and the confirmation heading receives focus.

## Testing it

After each deploy, on a phone and on a computer:

- [ ] An empty submit shows the error summary
- [ ] A valid submit opens WhatsApp with the message ready, addressed to the club number
- [ ] Sending it reaches the secretary (send one clearly marked test, then delete the chat)
- [ ] `/#events` lands on the form with "Visiting a meeting" selected
