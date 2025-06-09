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
      name: 'isFree',
      title: 'Is Free',
      type: 'boolean',
      description: 'Set to true if the course is free. This will override the price field for display.',
      initialValue: false,
    },
    {
      name: 'image',
      title: 'Course Image',
      type: 'image',
      description: 'The main image for the course.',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Keywords for SEO (e.g., "machine learning", "next.js").',
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
    {
      name: 'educationalLevel',
      title: 'Educational Level',
      type: 'string',
      options: {
        list: [
          { title: 'Beginner', value: 'Beginner' },
          { title: 'Intermediate', value: 'Intermediate' },
          { title: 'Advanced', value: 'Advanced' },
          { title: 'All Levels', value: 'All Levels' },
        ],
        layout: 'radio'
      },
      description: 'The educational level of the course.'
    },
    {
      name: 'courseCode',
      title: 'Course Code',
      type: 'string',
      description: 'A unique identifier for the course (e.g., ML-101).'
    },
    {
        name: 'availableLanguage',
        title: 'Available Language',
        type: 'string',
        options: {
            list: [
                { title: 'English', value: 'en-US' },
                { title: 'Spanish', value: 'es' },
                // Add other languages as needed
            ],
            layout: 'radio'
        },
        initialValue: 'en-US',
        description: 'The language the course is taught in.'
    },
    {
        name: 'courseMode',
        title: 'Course Mode',
        type: 'array',
        of: [{ type: 'string' }],
        options: {
            list: [
                { title: 'Online', value: 'online' },
                { title: 'Self-Paced', value: 'self-paced' },
                { title: 'Distance Learning', value: 'distance learning' },
            ]
        },
        description: 'How the course is delivered.'
    },
    {
      name: 'educationalCredentialAwarded',
      title: 'Educational Credential Awarded',
      type: 'string',
      description: 'e.g., "Certificate of Completion". Leave blank if none.'
    }
  ],
}; 



