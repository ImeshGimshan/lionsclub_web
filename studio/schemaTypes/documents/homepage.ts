import {HomeIcon} from '@sanity/icons/Home'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {ACCENT_HELP} from '../objects/sectionHeading'

const titleBody = (name: string, title: string) =>
  defineArrayMember({
    type: 'object',
    name,
    title,
    fields: [
      defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required().max(60)}),
      defineField({name: 'body', title: 'Text', type: 'text', rows: 2, validation: (r) => r.required().max(220)}),
    ],
    preview: {select: {title: 'title', subtitle: 'body'}},
  })

/**
 * The homepage's wording, section by section. Facts (contact details, projects,
 * officers) live in their own documents; official Lions International statements
 * and the global causes stay fixed in the website code.
 */
export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'about', title: 'Our club'},
    {name: 'sections', title: 'Section headings'},
    {name: 'join', title: 'Get involved'},
    {name: 'support', title: 'Support'},
    {name: 'extras', title: 'Ribbon & footer'},
  ],
  fields: [
    // Hero
    defineField({
      name: 'heroHeadline',
      title: 'Headline',
      type: 'string',
      group: 'hero',
      validation: (r) => r.required().max(40),
    }),
    defineField({
      name: 'heroHeadlineAccent',
      title: 'Headline, second line',
      type: 'string',
      group: 'hero',
      description: 'Shown in yellow italic under the headline.',
      validation: (r) => r.required().max(40),
    }),
    defineField({name: 'heroIntro', title: 'Intro', type: 'text', rows: 3, group: 'hero', validation: (r) => r.required().max(260)}),
    defineField({name: 'heroPrimaryCta', title: 'Main button', type: 'string', group: 'hero', validation: (r) => r.required().max(28)}),
    defineField({name: 'heroSecondaryCta', title: 'Second button', type: 'string', group: 'hero', validation: (r) => r.required().max(28)}),

    // Our club
    defineField({
      name: 'aboutHeading',
      title: 'Heading',
      type: 'string',
      group: 'about',
      description: ACCENT_HELP,
      validation: (r) => r.required().max(60),
    }),
    defineField({name: 'aboutIntro', title: 'Intro', type: 'text', rows: 2, group: 'about', validation: (r) => r.max(240)}),
    defineField({
      name: 'aboutStatement',
      title: 'Main statement',
      type: 'text',
      rows: 4,
      group: 'about',
      description: 'The large paragraph that lights up word by word as visitors scroll.',
      validation: (r) => r.required().max(400),
    }),
    defineField({
      name: 'pillars',
      title: 'Pillars',
      type: 'array',
      group: 'about',
      of: [titleBody('pillar', 'Pillar')],
      description: 'Shown in a two-column grid, so use an even number.',
      validation: (r) => r.required().min(2).max(6),
    }),

    // Section headings
    defineField({name: 'causesHeading', title: 'Global causes', type: 'sectionHeading', group: 'sections'}),
    defineField({name: 'projectsHeading', title: 'Projects', type: 'sectionHeading', group: 'sections'}),
    defineField({name: 'galleryHeading', title: 'Gallery', type: 'sectionHeading', group: 'sections'}),
    defineField({
      name: 'officersHeading',
      title: 'Officers',
      type: 'sectionHeading',
      group: 'sections',
      description: 'The service year from Club settings is added after the eyebrow automatically.',
    }),
    defineField({name: 'contactHeading', title: 'Contact', type: 'sectionHeading', group: 'sections'}),

    // Get involved
    defineField({name: 'joinHeading', title: 'Section heading', type: 'sectionHeading', group: 'join'}),
    defineField({
      name: 'joinSteps',
      title: 'Joining steps',
      type: 'array',
      group: 'join',
      of: [titleBody('step', 'Step')],
      validation: (r) => r.required().length(3).error('The layout shows exactly three steps'),
    }),
    defineField({name: 'enquiryEyebrow', title: 'Enquiry card: eyebrow', type: 'string', group: 'join', validation: (r) => r.max(60)}),
    defineField({
      name: 'enquiryHeading',
      title: 'Enquiry card: heading',
      type: 'string',
      group: 'join',
      validation: (r) => r.required().max(60),
    }),
    defineField({name: 'enquiryIntro', title: 'Enquiry card: intro', type: 'text', rows: 3, group: 'join', validation: (r) => r.max(320)}),
    defineField({
      name: 'enquiryPoints',
      title: 'Enquiry card: tick points',
      type: 'array',
      group: 'join',
      of: [defineArrayMember({type: 'string', validation: (r) => r.max(60)})],
      validation: (r) => r.max(4),
    }),
    defineField({name: 'volunteerTitle', title: 'Volunteer card: title', type: 'string', group: 'join', validation: (r) => r.required().max(60)}),
    defineField({name: 'volunteerBody', title: 'Volunteer card: text', type: 'text', rows: 3, group: 'join', validation: (r) => r.max(320)}),
    defineField({name: 'faqHeading', title: 'FAQ heading', type: 'string', group: 'join', validation: (r) => r.max(80)}),
    defineField({
      name: 'faqs',
      title: 'Questions and answers',
      type: 'array',
      group: 'join',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faq',
          fields: [
            defineField({name: 'question', title: 'Question', type: 'string', validation: (r) => r.required().max(120)}),
            defineField({name: 'answer', title: 'Answer', type: 'text', rows: 3, validation: (r) => r.required().max(600)}),
          ],
          preview: {select: {title: 'question', subtitle: 'answer'}},
        }),
      ],
    }),

    // Support
    defineField({name: 'supportHeading', title: 'Section heading', type: 'sectionHeading', group: 'support'}),
    defineField({name: 'supportCta', title: 'Button', type: 'string', group: 'support', validation: (r) => r.max(28)}),
    defineField({
      name: 'supportWays',
      title: 'Ways to help',
      type: 'array',
      group: 'support',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'way',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: [
                  {title: 'Coins (donations)', value: 'money'},
                  {title: 'Box (supplies)', value: 'supplies'},
                  {title: 'Sparkles (sponsorship)', value: 'sponsor'},
                  {title: 'Handshake (partnership)', value: 'partner'},
                  {title: 'Heart (other)', value: 'heart'},
                ],
              },
              initialValue: 'heart',
            }),
            defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required().max(40)}),
            defineField({name: 'body', title: 'Text', type: 'text', rows: 2, validation: (r) => r.required().max(160)}),
          ],
          preview: {select: {title: 'title', subtitle: 'body'}},
        }),
      ],
      validation: (r) => r.max(4),
    }),

    // Ribbon & footer
    defineField({
      name: 'marqueeWords',
      title: 'Scrolling ribbon words',
      type: 'array',
      group: 'extras',
      of: [defineArrayMember({type: 'string', validation: (r) => r.max(30)})],
      description: 'Short phrases for the moving "We Serve" ribbon.',
      validation: (r) => r.min(1).max(6),
    }),
    defineField({name: 'footerTagline', title: 'Footer tagline', type: 'string', group: 'extras', validation: (r) => r.max(80)}),
  ],
  preview: {prepare: () => ({title: 'Homepage'})},
})
