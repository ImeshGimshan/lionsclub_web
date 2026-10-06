import {ImageIcon} from '@sanity/icons/Image'
import {defineField, defineType} from 'sanity'

/**
 * A club photograph with the metadata the requirements ask for (Section 06):
 * meaningful alt text, an accurate caption, a credit and a publication-permission record.
 */
export const photo = defineType({
  name: 'photo',
  title: 'Photo',
  type: 'image',
  icon: ImageIcon,
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description:
        'Describe what is visible for people using screen readers. Do not name people from their faces alone.',
      validation: (rule) => rule.required().min(10).max(200),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Shown under the photo. Leave empty to reuse the alt text.',
    }),
    defineField({
      name: 'credit',
      title: 'Credit',
      type: 'string',
      initialValue: 'Lions Club of Dummalasuriya',
    }),
    defineField({
      name: 'permissionConfirmed',
      title: 'Publication permission confirmed',
      type: 'boolean',
      description:
        'Tick once the club has confirmed this photo may be published, especially for children or vulnerable beneficiaries.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {media: 'asset', title: 'alt', subtitle: 'caption'},
  },
})
