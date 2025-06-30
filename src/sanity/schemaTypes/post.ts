import type { Rule } from 'sanity';

interface SidebarPromoParent {
    promoType?: "image" | "code";
    imageSource?: "upload" | "link";
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
            name: "wordCount",
            type: "number",
            title: "Word Count",
            description: "Enter the total word count of the article. You can use an online tool to calculate this from the post body.",
            validation: (Rule: Rule) => Rule.positive().integer(),
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
                                        name: "bodyLinkRel",
                                        type: "string",
                                        title: "Link Relationship",
                                        options: {
                                            list: [
                                                { title: "Follow", value: "follow" },
                                                { title: "No Follow", value: "nofollow" },
                                                { title: "Sponsored", value: "sponsored" },
                                                { title: "UGC", value: "ugc" },
                                            ],
                                        },
                                        description: "Choose the relationship for the link.",
                                    },
                                ],
                            },
                        ],
                    },
                },
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
                {
                    name: "table",
                    type: "object",
                    title: "Table",
                    fields: [
                        {
                            name: "headers",
                            type: "array",
                            title: "Table Headers",
                            of: [{ type: "string" }],
                            description: "Enter the column headers for your table.",
                        },
                        {
                            name: "rows",
                            type: "array",
                            title: "Table Rows",
                            of: [
                                {
                                    type: "object",
                                    fields: [
                                        {
                                            name: "cells",
                                            type: "array",
                                            title: "Row Cells",
                                            of: [{ type: "string" }],
                                            description: "Enter the cell values for this row.",
                                        },
                                    ],
                                },
                            ],
                            description: "Add rows to your table. Each row should have the same number of cells as headers.",
                        },
                        {
                            name: "caption",
                            type: "string",
                            title: "Table Caption",
                            description: "Optional caption for the table.",
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
                    name: "imageSource",
                    type: "string",
                    title: "Image Source",
                    options: {
                        list: [
                            { title: "Upload Image", value: "upload" },
                            { title: "External Link", value: "link" },
                        ],
                    },
                    hidden: ({ parent }: { parent: SidebarPromoParent }) => parent?.promoType !== "image",
                },
                {
                    name: "image",
                    type: "image",
                    title: "Upload Image",
                    options: { hotspot: true },
                    hidden: ({ parent }: { parent: SidebarPromoParent }) => parent?.promoType !== "image" || parent?.imageSource !== "upload",
                },
                {
                    name: "imageUrl",
                    type: "url",
                    title: "Image URL",
                    description: "Enter the URL of the external image",
                    hidden: ({ parent }: { parent: SidebarPromoParent }) => parent?.promoType !== "image" || parent?.imageSource !== "link",
                },
                {
                    name: "imageLink",
                    type: "url",
                    title: "Image Link",
                    hidden: ({ parent }: { parent: SidebarPromoParent }) => parent?.promoType !== "image",
                },
                {
                    name: "sidebarRel",
                    type: "string",
                    title: "Link Relationship (rel)",
                    options: {
                        list: [
                            { title: "Follow", value: "follow" },
                            { title: "No Follow", value: "nofollow" },
                            { title: "Sponsored", value: "sponsored" },
                            { title: "UGC", value: "ugc" },
                        ],
                    },
                    description: "Choose the relationship for the sidebar promo link.",
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
        {
            name: "keywords",
            title: "Keywords",
            type: "array",
            of: [{ type: "string" }],
            description: "Keywords for SEO (e.g., \"machine learning\", \"next.js\").",
        },
    ],
};

export default blogSchema;