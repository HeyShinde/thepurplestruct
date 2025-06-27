const section = {
  name: 'section',
  title: 'Section',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'order',
      title: 'Order',
      type: 'number',
    },
    {
      name: 'lessons',
      title: 'Lessons',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'lesson' }] }],
    },
  ],
};

export default section; 