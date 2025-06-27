// sanity/schemaTypes/katexBlock.ts
const katexBlock = {
    name: 'katexBlock',
    type: 'object',
    title: 'KaTeX Block',
    fields: [
        {
            name: 'expression',
            type: 'string',
            title: 'Expression',
        },
    ],
};

export default katexBlock;