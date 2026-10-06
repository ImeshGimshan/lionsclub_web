import {EnvelopeIcon} from '@sanity/icons/Envelope'
import {defineField, defineType, type ConditionalPropertyCallback} from 'sanity'

export const ENQUIRY_CATEGORIES = [
  {title: 'Membership', value: 'membership'},
  {title: 'Volunteering', value: 'volunteering'},
  {title: 'Visiting a meeting', value: 'meeting'},
  {title: 'Support or partnership', value: 'support'},
  {title: 'Community need', value: 'community'},
  {title: 'Something else', value: 'other'},
]

export const ENQUIRY_STATUSES = [
  {title: 'New', value: 'new'},
  {title: 'Contacted', value: 'contacted'},
  {title: 'Closed', value: 'closed'},
]

/** Fields sent from the website are locked so the original submission is never altered. */
const fromWebsite: ConditionalPropertyCallback = ({document}) => document?.source === 'website'

/**
 * An enquiry from the website form, stored in the private "enquiries" dataset.
 * Only signed-in Studio users and the website's server can read it.
 */
export const enquiry = defineType({
  name: 'enquiry',
  title: 'Enquiry',
  type: 'document',
  icon: EnvelopeIcon,
  groups: [
    {name: 'handling', title: 'Handling', default: true},
    {name: 'submission', title: 'Submission'},
  ],
  fields: [
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'handling',
      options: {list: ENQUIRY_STATUSES, layout: 'radio', direction: 'horizontal'},
      initialValue: 'new',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'handledBy',
      title: 'Handled by',
      type: 'string',
      group: 'handling',
      description: 'The club member following this up.',
    }),
    defineField({
      name: 'notes',
      title: 'Internal notes',
      type: 'text',
      rows: 4,
      group: 'handling',
      description: 'Only visible in the Studio. Keep it brief and factual.',
    }),

    defineField({
      name: 'category',
      title: 'Enquiry about',
      type: 'string',
      group: ['handling', 'submission'],
      options: {list: ENQUIRY_CATEGORIES},
      readOnly: fromWebsite,
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'name', title: 'Name', type: 'string', group: ['handling', 'submission'], readOnly: fromWebsite, validation: (rule) => rule.required()}),
    defineField({
      name: 'replyMethod',
      title: 'Preferred reply',
      type: 'string',
      group: ['handling', 'submission'],
      options: {list: [{title: 'Email', value: 'email'}, {title: 'Phone', value: 'phone'}], layout: 'radio', direction: 'horizontal'},
      readOnly: fromWebsite,
    }),
    defineField({name: 'email', title: 'Email', type: 'string', group: ['handling', 'submission'], readOnly: fromWebsite}),
    defineField({name: 'phone', title: 'Phone', type: 'string', group: ['handling', 'submission'], readOnly: fromWebsite}),
    defineField({name: 'area', title: 'Area', type: 'string', group: 'submission', readOnly: fromWebsite}),
    defineField({name: 'message', title: 'Message', type: 'text', rows: 5, group: ['handling', 'submission'], readOnly: fromWebsite}),
    defineField({
      name: 'submittedAt',
      title: 'Received',
      type: 'datetime',
      group: 'submission',
      readOnly: fromWebsite,
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'deleteAfter',
      title: 'Delete after',
      type: 'datetime',
      group: 'submission',
      description: 'Enquiries are kept for 12 months, as stated in the website’s privacy notice.',
      readOnly: fromWebsite,
      initialValue: () => {
        const d = new Date()
        d.setFullYear(d.getFullYear() + 1)
        return d.toISOString()
      },
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      group: 'submission',
      options: {list: [{title: 'Website form', value: 'website'}, {title: 'Added manually', value: 'manual'}]},
      initialValue: 'manual',
      readOnly: true,
    }),
  ],
  orderings: [{title: 'Newest first', name: 'newest', by: [{field: 'submittedAt', direction: 'desc'}]}],
  preview: {
    select: {name: 'name', category: 'category', status: 'status', submittedAt: 'submittedAt'},
    prepare: ({name, category, status, submittedAt}) => {
      const cat = ENQUIRY_CATEGORIES.find((c) => c.value === category)?.title ?? category
      const when = submittedAt ? new Date(submittedAt).toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'}) : ''
      const badge = status === 'new' ? '● New' : status === 'contacted' ? 'Contacted' : 'Closed'
      return {title: name || 'Unnamed enquiry', subtitle: [badge, cat, when].filter(Boolean).join(' · ')}
    },
  },
})
