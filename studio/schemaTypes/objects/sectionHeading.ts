import {defineField, defineType} from 'sanity'

export const ACCENT_HELP =
  'Wrap words in *asterisks* to show them in the italic accent style, e.g. "Service that *means something.*"'

/** Eyebrow + heading + intro used at the top of each homepage section. */
export const sectionHeading = defineType({
  name: 'sectionHeading',
  title: 'Section heading',
  type: 'object',
  options: {collapsible: true, collapsed: false},
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      description: 'Small label above the heading.',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'title',
      title: 'Heading',
      type: 'string',
      description: ACCENT_HELP,
      validation: (rule) => rule.required().max(90),
    }),
    defineField({name: 'intro', title: 'Intro', type: 'text', rows: 2, validation: (rule) => rule.max(240)}),
  ],
  preview: {select: {title: 'title', subtitle: 'eyebrow'}},
})
