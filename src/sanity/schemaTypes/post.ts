import katexBlock from './katexBlock';

interface SidebarPromoParent {
    promoType?: "image" | "code";
}

// Assign schema to a variable before export
const blogSchema = {
    name: "blog",
    type: "document",
    title: "Blog",
    fields: [
        {
            name: "title",
            type: "string",
            title: "Title",
            description: "Enter the title of the blog post.",
        },
        {
            name: "slug",
            type: "slug",
            title: "Slug",
            options: {
                source: "title",
                maxLength: 96,
            },
        },
        {
            name: "author",
            type: "reference",
            to: [{ type: "author" }],
            title: "Author",
        },
        {
            name: "categories",
            type: "array",
            title: "Categories",
            of: [{ type: "reference", to: [{ type: "category" }] }],
        },
        {
            title: "Tags",
            name: "tags",
            type: "array",
            of: [{ type: "string" }],
            options: {
                layout: "tags",
            },
        },
        {
            name: "mainImage",
            type: "image",
            title: "Main Image",
            options: {
                hotspot: true,
            },
        },
        {
            name: "updatedAt",
            type: "datetime",
            title: "Updated at",
        },
        {
            name: "excerpt",
            type: "text",
            title: "Excerpt",
            description: "A short summary of the blog post.",
        },
        {
            name: "body",
            type: "array",
            title: "Body",
            of: [
                {
                    type: "block",
                    styles: [
                        { title: "Normal", value: "normal" },
                        { title: "H1", value: "h1" },
                        { title: "H2", value: "h2" },
                        { title: "H3", value: "h3" },
                        { title: "Quote", value: "blockquote" },
                    ],
                    lists: [
                        { title: "Bullet", value: "bullet" },
                        { title: "Numbered", value: "number" },
                    ],
                    marks: {
                        decorators: [
                            { title: "Strong", value: "strong" },
                            { title: "Emphasis", value: "em" },
                            { title: "Code", value: "code" }, // Inline code
                        ],
                        annotations: [
                            {
                                name: "link",
                                type: "object",
                                title: "Link",
                                fields: [
                                    {
                                        name: "href",
                                        type: "url",
                                        title: "URL",
                                    },
                                    {
                                        name: "openInNewTab",
                                        type: "boolean",
                                        title: "Open in new tab",
                                    },
                                    {
                                        name: "rel",
                                        type: "string",
                                        title: "Link Relationship",
                                        options: {
                                            list: [
                                                { title: "Follow", value: "follow" },
                                                { title: "No Follow", value: "nofollow" },
                                                { title: "Sponsored", value: "sponsored" },
                                            ],
                                        },
                                        description: "Choose the relationship for the link.",
                                    },
                                ],
                            },
                        ],
                    },
                },
                katexBlock,
                {
                    name: "codeBlock",
                    type: "object", // Fix: Use an object instead of 'code'
                    title: "Code Block",
                    fields: [
                        {
                            name: "language",
                            type: "string",
                            title: "Language",
                            options: {
                                list: [
                                    { title: "JavaScript", value: "javascript" },
                                    { title: "HTML", value: "html" },
                                    { title: "CSS", value: "css" },
                                    { title: "Python", value: "python" },
                                    { title: "Other", value: "other" },
                                ],
                            },
                        },
                        {
                            name: 'showCopyButton',
                            title: 'Show Copy Button',
                            type: 'boolean',
                            description: 'Enable or disable the copy button for this code block.',
                            initialValue: true, // Default to enabled
                        },
                        {
                            name: "code",
                            type: "text",
                            title: "Code",
                        },
                    ],
                },
                {
                    name: "advertisement",
                    type: "object",
                    title: "Advertisement",
                    fields: [
                        {
                            name: "code",
                            type: "text",
                            title: "Ad Code",
                            description: "Enter custom HTML/JS code for the ad (e.g., Google Adsense)."
                        }
                    ]
                },
                {
                    type: "object",
                    name: "subscribeForm",
                    title: "Newsletter Subscribe Form",
                    fields: [
                        { name: "title", type: "string", title: "Title", initialValue: "Stay Updated" },
                        { name: "description", type: "string", title: "Description", initialValue: "By submitting your email, you'll be the first to know about upcoming updates. You can unsubscribe at any time." }
                    ]
                },
                {
                    type: "image",
                    options: { hotspot: true },
                    fields: [
                        {
                            name: "alt",
                            type: "string",
                            title: "Alternative Text",
                        },
                    ],
                },
            ],
        },
        {
            name: "publishedAt",
            type: "datetime",
            title: "Published at",
        },
        {
            name: "sidebarPromo",
            type: "object",
            title: "Sidebar Promo",
            fields: [
                {
                    name: "promoType",
                    type: "string",
                    title: "Promo Type",
                    options: {
                        list: [
                            { title: "Image", value: "image" },
                            { title: "Code", value: "code" },
                        ],
                    },
                },
                {
                    name: "image",
                    type: "image",
                    title: "Image",
                    options: { hotspot: true },
                    hidden: ({ parent }: { parent: SidebarPromoParent }) => parent?.promoType !== "image",
                },
                {
                    name: "imageLink",
                    type: "url",
                    title: "Image Link",
                    hidden: ({ parent }: { parent: SidebarPromoParent }) => parent?.promoType !== "image",
                },
                {
                    name: 'altText',
                    title: 'Alt Text',
                    type: 'string',
                    hidden: ({ parent }: { parent: SidebarPromoParent }) => parent?.promoType !== 'image'
                },
                {
                    name: "code",
                    type: "text",
                    title: "JavaScript Code",
                    hidden: ({ parent }: { parent: SidebarPromoParent }) => parent?.promoType !== "code",
                    description: "Enter JavaScript code for an ad or script-based promo.",
                },
            ],
        },
    ],
};

export default blogSchema;