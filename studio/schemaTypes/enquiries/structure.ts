import {CheckmarkCircleIcon} from '@sanity/icons/CheckmarkCircle'
import {ClockIcon} from '@sanity/icons/Clock'
import {EnvelopeIcon} from '@sanity/icons/Envelope'
import {InboxIcon} from '@sanity/icons/Inbox'
import {TrashIcon} from '@sanity/icons/Trash'
import type {StructureResolver} from 'sanity/structure'

const newestFirst = [{field: 'submittedAt', direction: 'desc' as const}]

export const enquiriesStructure: StructureResolver = (S) => {
  const list = (title: string, filter: string, icon: typeof InboxIcon) =>
    S.listItem()
      .title(title)
      .icon(icon)
      .child(S.documentList().title(title).filter(filter).defaultOrdering(newestFirst))

  return S.list()
    .title('Enquiries')
    .items([
      list('New', '_type == "enquiry" && status == "new"', InboxIcon),
      list('Contacted', '_type == "enquiry" && status == "contacted"', ClockIcon),
      list('Closed', '_type == "enquiry" && status == "closed"', CheckmarkCircleIcon),
      S.divider(),
      // Retention: past their delete-after date. Delete these (privacy notice says 12 months).
      list('Due for deletion', '_type == "enquiry" && deleteAfter < now()', TrashIcon),
      list('All enquiries', '_type == "enquiry"', EnvelopeIcon),
    ])
}
