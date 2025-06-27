import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    defineField({
      name: 'date',
      title: 'Date (Month & Year)',
      type: 'date',
      options: {
        dateFormat: 'MMMM YYYY',
      },
      validation: (Rule) => Rule.required(),
      description: 'Select the month and year for this experience.',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'company',
      title: 'Company Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'skills',
      title: 'Skills',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'Name' },
            { name: 'icon', type: 'string', title: 'Icon URL' }
          ]
        }
      ],
    }),
    defineField({
      name: 'achievements',
      title: 'Achievements',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'responsibilities',
      title: 'Responsibilities',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Title' },
            { name: 'description', type: 'text', title: 'Description' },
            { name: 'impact', type: 'string', title: 'Impact' },
          ]
        }
      ],
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Keywords for SEO.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
    },
    prepare(selection) {
      const { title, date } = selection;
      const formattedDate = date ? new Date(date).toLocaleString('default', { month: 'long', year: 'numeric' }) : '';
      return {
        title: title,
        subtitle: formattedDate,
      };
    },
  },
}); 