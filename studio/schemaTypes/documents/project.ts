import {ProjectsIcon} from '@sanity/icons/Projects'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const PROJECT_CATEGORIES = [
  'Environment',
  'Hunger',
  'Vision',
  'Diabetes',
  'Childhood cancer',
  'Disaster relief',
  'Humanitarian',
  'Youth',
  'Community care',
  'Community wellbeing',
]

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: ProjectsIcon,
  groups: [
    {name: 'details', title: 'Details', default: true},
    {name: 'activities', title: 'Dated activities'},
    {name: 'photos', title: 'Photos & gallery'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Project title',
      type: 'string',
      group: 'details',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'details',
      options: {source: 'title', maxLength: 64},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Service category',
      type: 'string',
      group: 'details',
      options: {list: PROJECT_CATEGORIES},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Project summary',
      type: 'text',
      rows: 2,
      group: 'details',
    }),
    defineField({
      name: 'partner',
      title: 'Partner clubs or organisations',
      type: 'string',
      group: 'details',
      description: 'Shown as a badge, for example "Joint programme with eight Lions Clubs". Present shared work as shared.',
    }),
    defineField({
      name: 'activities',
      title: 'Dated activities',
      type: 'array',
      group: 'activities',
      of: [defineArrayMember({type: 'activity'})],
      description: 'Each activity appears on the service timeline. Keep separate events separate.',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'photos',
      title: 'Photos',
      type: 'array',
      group: 'photos',
      of: [defineArrayMember({type: 'photo'})],
      options: {layout: 'grid'},
      description: 'The first photo is the cover. Drag to reorder.',
    }),
    defineField({
      name: 'showInGallery',
      title: 'Show as a gallery album',
      type: 'boolean',
      group: 'photos',
      initialValue: true,
    }),
    defineField({
      name: 'galleryTitle',
      title: 'Album title',
      type: 'string',
      group: 'photos',
      description: 'Optional. Defaults to the project title.',
      hidden: ({parent}) => parent?.showInGallery === false,
    }),
    defineField({
      name: 'galleryDescription',
      title: 'Album description',
      type: 'string',
      group: 'photos',
      hidden: ({parent}) => parent?.showInGallery === false,
    }),
    defineField({
      name: 'galleryOrder',
      title: 'Gallery position',
      type: 'number',
      group: 'photos',
      description: 'Lower numbers appear first. Albums and projects share this ordering.',
      initialValue: 10,
      hidden: ({parent}) => parent?.showInGallery === false,
    }),
  ],
  orderings: [
    {title: 'Title', name: 'title', by: [{field: 'title', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'title', category: 'category', media: 'photos.0', activities: 'activities'},
    prepare: ({title, category, media, activities}) => {
      const count = Array.isArray(activities) ? activities.length : 0
      return {
        title,
        subtitle: [category, count ? `${count} ${count === 1 ? 'activity' : 'activities'}` : null]
          .filter(Boolean)
          .join(' · '),
        media,
      }
    },
  },
})
