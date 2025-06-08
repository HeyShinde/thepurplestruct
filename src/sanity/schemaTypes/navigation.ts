import { defineField, defineType } from 'sanity'
import { FaBars } from 'react-icons/fa'

export default defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  icon: FaBars,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'A descriptive title for this navigation menu (e.g., "Main Menu").',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      description: 'A unique identifier for this menu, used to fetch it in the code.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Menu Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'URL',
              type: 'string',
              description: 'The internal or external URL for this menu item (e.g., "/about" or "https://example.com").',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'show',
              title: 'Display On',
              type: 'string',
              options: {
                list: [
                  { title: 'Both', value: 'both' },
                  { title: 'Mobile Only', value: 'mobile' },
                  { title: 'Desktop Only', value: 'desktop' },
                ],
                layout: 'radio',
              },
              initialValue: 'both',
              description: 'Choose where this menu item should be displayed.',
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
    }),
  ],
}) 