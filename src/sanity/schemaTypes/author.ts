import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'Shinde',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      initialValue: 'Full-stack developer passionate about AI, web development, and creating innovative solutions.',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'GitHub', value: 'github' },
                  { title: 'Kaggle', value: 'kaggle' },
                  { title: 'CodersRank', value: 'codersrank' },
                  { title: 'X (Twitter)', value: 'x' },
                ],
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
      initialValue: [
        {
          platform: 'linkedin',
          url: 'https://www.linkedin.com/in/heyshinde',
        },
        {
          platform: 'github',
          url: 'https://github.com/heyshinde',
        },
        {
          platform: 'kaggle',
          url: 'https://kaggle.com/heyshinde',
        },
        {
          platform: 'codersrank',
          url: 'https://profile.codersrank.io/user/heyshinde',
        },
        {
          platform: 'x',
          url: 'https://x.com/heyshinde',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
}); 