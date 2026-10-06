import {UserIcon} from '@sanity/icons/User'
import {defineField, defineType} from 'sanity'

export const OFFICER_ROLES = [
  'President',
  'Vice President',
  'Secretary',
  'Treasurer',
  'Service Chairperson',
  'Membership Chairperson',
  'LCIF Chairperson',
  'Marketing & Communications Chairperson',
]

/** Officer profile (FR13/FR14): one portrait, role and name. No biographies or private contact details. */
export const officer = defineType({
  name: 'officer',
  title: 'Officer',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Display name',
      type: 'string',
      description: 'As the club wants it shown, for example "Lion Pabasara Herath".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      options: {list: OFFICER_ROLES},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'serviceYear',
      title: 'Service year',
      type: 'string',
      placeholder: '2026/27',
      validation: (rule) =>
        rule.required().regex(/^\d{4}\/\d{2}$/, {name: 'service year', invert: false}).error('Use the format 2026/27'),
    }),
    defineField({
      name: 'portrait',
      title: 'Portrait',
      type: 'photo',
      description: 'Square head-and-shoulders photo works best.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers appear first.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Current', value: 'current'},
          {title: 'Archived', value: 'archived'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'current',
      description: 'Archive officers from earlier years instead of deleting them.',
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [{title: 'Display order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'name', role: 'role', year: 'serviceYear', status: 'status', media: 'portrait'},
    prepare: ({title, role, year, status, media}) => ({
      title,
      subtitle: `${role ?? ''} · ${year ?? ''}${status === 'archived' ? ' · archived' : ''}`,
      media,
    }),
  },
})
