import {CalendarIcon} from '@sanity/icons/Calendar'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * One dated service record inside a project (PR01–PR04 in the requirements).
 * Each activity becomes one entry on the website's service timeline.
 */
export const activity = defineType({
  name: 'activity',
  title: 'Dated activity',
  type: 'object',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      options: {dateFormat: 'D MMMM YYYY'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'place',
      title: 'Place',
      type: 'string',
      description: 'For example "Sarana Elders Home, Weerapokuna".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Short description',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: 'facts',
      title: 'Approved facts',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      description: 'Short, verified statements shown as a list. Do not combine figures from separate activities.',
    }),
    defineField({
      name: 'statistic',
      title: 'Headline figure',
      type: 'object',
      description: 'Optional. Leave empty until the club has verified the number.',
      options: {collapsible: true, collapsed: false},
      fields: [
        defineField({name: 'value', title: 'Value', type: 'number', validation: (rule) => rule.min(0)}),
        defineField({
          name: 'unit',
          title: 'Unit / label',
          type: 'string',
          description: 'For example "saplings donated" or "Lions clubs took part".',
        }),
        defineField({
          name: 'source',
          title: 'Source of this figure',
          type: 'string',
          description: 'Where the number comes from, for example the club record or report.',
        }),
      ],
      validation: (rule) =>
        rule.custom((stat?: {value?: number; unit?: string; source?: string}) => {
          if (!stat || stat.value === undefined) return true
          if (!stat.unit) return 'Add a unit so the figure is not ambiguous'
          if (!stat.source) return 'Record the source of this figure before publishing'
          return true
        }),
    }),
    defineField({
      name: 'image',
      title: 'Timeline photo',
      type: 'photo',
      description:
        'Optional. Only choose a photo you know belongs to this date. Otherwise the project cover is used, or an illustration if the project has no photos.',
    }),
    defineField({
      name: 'confirmedBy',
      title: 'Confirmed by',
      type: 'string',
      description: 'The club member who confirmed this record.',
    }),
    defineField({
      name: 'reviewDate',
      title: 'Review date',
      type: 'date',
    }),
  ],
  preview: {
    select: {date: 'date', place: 'place', media: 'image', value: 'statistic.value', unit: 'statistic.unit'},
    prepare: ({date, place, media, value, unit}) => ({
      title: [date, place].filter(Boolean).join(' · '),
      subtitle: value !== undefined ? `${value} ${unit ?? ''}` : undefined,
      media,
    }),
  },
})
