import {ImagesIcon} from '@sanity/icons/Images'
import {defineArrayMember, defineField, defineType} from 'sanity'

/** A gallery album for club life that is not a service project (installation, meetings, socials). */
export const album = defineType({
  name: 'album',
  title: 'Gallery album',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 64},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'For example "Club life", "Fellowship" or "Leadership development".',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'description', title: 'Description', type: 'string'}),
    defineField({
      name: 'photos',
      title: 'Photos',
      type: 'array',
      of: [defineArrayMember({type: 'photo'})],
      options: {layout: 'grid'},
      description: 'The first photo is the cover. Drag to reorder.',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'order',
      title: 'Gallery position',
      type: 'number',
      description: 'Lower numbers appear first. Albums and projects share this ordering.',
      initialValue: 10,
    }),
  ],
  orderings: [{title: 'Gallery position', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'title', category: 'category', media: 'photos.0', photos: 'photos'},
    prepare: ({title, category, media, photos}) => {
      const count = Array.isArray(photos) ? photos.length : 0
      return {title, subtitle: `${category ?? ''} · ${count} ${count === 1 ? 'photo' : 'photos'}`, media}
    },
  },
})
