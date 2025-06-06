export default {
  name: 'course',
  title: 'Course',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
    },
    {
      name: 'image',
      title: 'Course Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'sections',
      title: 'Course Sections',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'section' }] }],
    },
    {
      name: 'tutor',
      title: 'Tutor',
      type: 'reference',
      to: [{ type: 'author' }],
    },
    {
      name: 'whatYouWillLearn',
      title: "What You'll Learn",
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'requirements',
      title: 'Requirements',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'badges',
      title: 'Badges',
      type: 'array',
      of: [{ type: 'string' }],
    },
  ],
}; 



