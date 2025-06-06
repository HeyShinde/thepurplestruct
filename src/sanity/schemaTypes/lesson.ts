export default {
  name: 'lesson',
  title: 'Lesson',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        { type: 'block' },
      ],
    },
    {
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
    },
    {
      name: 'duration',
      title: 'Duration (minutes)',
      type: 'number',
    },
    {
      name: 'order',
      title: 'Order',
      type: 'number',
    },
  ],
}; 