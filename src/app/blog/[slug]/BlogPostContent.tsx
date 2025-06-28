import React from 'react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import { NavBar } from "@/components/NavBar";
import Footer from "@/components/Footer";

import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import ProcessedText from '@/components/ProcessedText';
import TableOfContents from "@/components/TableOfContents";
import ShareButtons from '@/components/ShareButtons';
import SubscribeForm from "@/components/SubscribeForm";
import type { BlogPost } from '@/types/blog';
import { FaXTwitter } from 'react-icons/fa6';
import { FaLinkedin, FaGithub, FaKaggle } from 'react-icons/fa';
import { SiCodersrank } from 'react-icons/si';
import { IoGlobeOutline } from 'react-icons/io5';

import CodeBlock from './CodeBlock';
import PostHero from './PostHero';

import type { PortableTextSpan, ArbitraryTypedObject } from '@portabletext/types';

interface SidebarPromo {
    promoType?: "image" | "code";
    image?: SanityImage;
    imageLink?: string;
    altText?: string;
    code?: string;
}

interface SanityImage {
    asset: {
        _ref: string;
        _type: 'reference';
    };
    alt?: string;
}

interface SocialLink {
    platform: string;
    url: string;
}

interface Author {
    name: string;
    image: SanityImage | null;
    bio?: string;
    socialLinks?: SocialLink[];
}

const SidebarPromo = ({ promo }: { promo?: SidebarPromo }) => {
    if (!promo) return null;

    return (
        <div className="relative group">
            <div className="relative bg-black/80 backdrop-blur-sm rounded-lg p-6 w-full">
                <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-purple-400/0 via-purple-400/80 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        backgroundSize: '200% 100%',
                        animation: 'gradientMove 3s linear infinite',
                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        maskComposite: 'exclude',
                        padding: '1px',
                    }} />
                <div className="relative z-10">
                    <span className="text-center font-semibold text-purple-400">Advertisement</span>
                    {promo.promoType === "image" && promo.image && (
                        <a href={promo.imageLink || "#"} target="_blank" rel="noopener noreferrer">
                            <Image
                                src={urlFor(promo.image).url()}
                                alt="Promotional content"
                                width={300}
                                height={200}
                                className="w-full h-auto rounded-lg shadow-lg mt-3.5"
                            />
                        </a>
                    )}

                    {promo.promoType === "code" && promo.code && (
                        <div id="banner-ad" className="w-full flex items-center justify-center bg-black/40 mt-3.5 rounded-lg">
                            <div dangerouslySetInnerHTML={{ __html: promo.code }} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

function extractHeadings(body: BlogPost['body']) {
    return body?.map(block => {
        if (block._type === 'block' && (block.style === 'h2' || block.style === 'h3')) {
            const level = block.style === 'h2' ? 2 : 3;
            const text = block.children
                .map((child: ArbitraryTypedObject | PortableTextSpan) =>
                    typeof (child as PortableTextSpan).text === 'string' ? (child as PortableTextSpan).text : ''
                )
                .join('');
            const id = text.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
                .replace(/-+/g, '-');
            return { level, text, id };
        }
    }).filter(Boolean) as { level: number; text: string; id: string }[];
}

function renderAuthorCard(author: Author) {
    const getSocialIcon = (platform: string) => {
        switch (platform.toLowerCase()) {
            case 'linkedin':
                return <FaLinkedin className="w-5 h-5 text-purple-400" />;
            case 'github':
                return <FaGithub className="w-5 h-5 text-purple-400" />;
            case 'kaggle':
                return <FaKaggle className="w-5 h-5 text-purple-400" />;
            case 'codersrank':
                return <SiCodersrank className="w-5 h-5 text-purple-400" />;
            case 'x':
                return <FaXTwitter className="w-5 h-5 text-purple-400" />;
            default:
                return <IoGlobeOutline className="w-5 h-5 text-purple-400" />;
        }
    };

    return (
        <div className="relative">
            <div className="relative bg-black/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/20">
                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400/0 via-purple-400/80 to-purple-400/0"
                    style={{
                        backgroundSize: '200% 100%',
                        animation: 'gradientMove 3s linear infinite',
                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        maskComposite: 'exclude',
                        padding: '1px',
                    }} />
                <div className="relative z-10">
                    <div className="flex flex-col items-center text-center mb-6">
                        {author.image ? (
                            <div className="relative mb-4">
                                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 opacity-50 blur-sm"></div>
                                <Image
                                    src={urlFor(author.image).url()}
                                    alt={author.name}
                                    width={96}
                                    height={96}
                                    className="w-24 h-24 rounded-full object-cover relative z-10"
                                />
                            </div>
                        ) : (
                            <div className="relative mb-4">
                                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 opacity-50 blur-sm"></div>
                                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center relative z-10">
                                    <span className="text-white text-2xl font-semibold">
                                        {author.name?.charAt(0) || '?'}
                                    </span>
                                </div>
                            </div>
                        )}
                        <h2 className="font-heading text-2xl font-semibold text-purple-400 mb-2">{author.name}</h2>
                        {author.bio && (
                            <p className="font-body text-sm text-neutral-300 max-w-sm">{author.bio}</p>
                        )}
                    </div>
                    {author.socialLinks && author.socialLinks.length > 0 && (
                        <div className="flex justify-center gap-4">
                            {author.socialLinks.map((link: SocialLink, index: number) => (
                                <a
                                    key={index}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 rounded-xl bg-black/40 hover:bg-black/60 transition-colors border border-purple-400/20"
                                    title={link.platform}
                                >
                                    {getSocialIcon(link.platform)}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function BlogPostContent({ post }: { post: BlogPost | null }) {
    if (!post) {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-950 via-black to-black">
                <NavBar />
                <div className="flex-1 flex flex-col justify-center items-center w-full px-[12%]">
                    <h4 className="text-center mb-2 text-lg font-heading text-purple-400">Blog</h4>
                    <h2 className="text-center text-5xl font-heading text-white">Post not found</h2>
                    <p className="text-center mt-5 text-neutral-300">The requested post could not be found.</p>
                </div>
                <Footer />
            </div>
        );
    }

    const headings = extractHeadings(post.body);

    const components: PortableTextComponents = {
        types: {
            subscribeForm: ({ value }) => (
                <div className="my-8">
                    <SubscribeForm title={value.title} description={value.description} />
                </div>
            ),
            codeBlock: ({ value }) => <CodeBlock value={value} />,
            advertisement: ({ value }) => (
                <div className="my-8 px-4 py-6 max-w-max mx-auto bg-black/80 backdrop-blur-sm rounded-lg border border-purple-400/20">
                    <span className="text-center font-semibold text-purple-400">Advertisement</span>
                    <div className="mt-3.5" dangerouslySetInnerHTML={{ __html: value.code }} />
                </div>
            ),
            image: ({ value }) => (
                <div className="my-6 flex justify-center">
                    <div className="relative group">
                        <div className="relative bg-black/80 backdrop-blur-sm rounded-lg p-2 w-full">
                            <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-purple-400/0 via-purple-400/80 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{
                                    backgroundSize: '200% 100%',
                                    animation: 'gradientMove 3s linear infinite',
                                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                    maskComposite: 'exclude',
                                    padding: '1px',
                                }} />
                            <Image
                                src={urlFor(value).url()}
                                alt={value.alt || 'Blog content image'}
                                width={800}
                                height={600}
                                className="rounded-lg shadow-md max-w-full h-auto relative z-10"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>
            ),
        },
        marks: {
            link: ({ children, value }) => {
                const rel = value.linkRel || 'follow';
                return (
                    <a
                        href={value.href}
                        target="_blank"
                        rel={`${rel} noopener noreferrer`}
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                        {children}
                    </a>
                );
            },
            strong: ({ children }) => (
                <strong className="font-semibold text-purple-400">{children}</strong>
            ),
            em: ({ children }) => (
                <em className="italic text-purple-300">{children}</em>
            ),
            code: ({ children }) => (
                <strong className="text-sm text-purple-400">{children}</strong>
            ),
        },
        block: {
            h1: ({ children }) => (
                <h1 className="font-heading text-3xl font-bold mt-6 text-white">
                    {children}
                </h1>
            ),
            h2: ({ children }) => {
                const text = children?.toString() || '';
                const id = text.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')
                    .replace(/-+/g, '-');
                return (
                    <h2 
                        id={id} 
                        className="font-heading text-xl md:text-2xl font-semibold mt-8 mb-4 scroll-mt-24 text-purple-400"
                    >
                        {children}
                    </h2>
                );
            },
            h3: ({ children }) => {
                const text = children?.toString() || '';
                const id = text.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')
                    .replace(/-+/g, '-');
                return (
                    <h3 
                        id={id} 
                        className="font-heading text-lg md:text-xl font-semibold mt-6 mb-3 scroll-mt-24 text-purple-300"
                    >
                        {children}
                    </h3>
                );
            },
            normal: ({ children }) => {
                // Check if any child contains math expressions
                const hasMatch = React.Children.toArray(children).some(child => 
                    typeof child === 'string' && (child.includes('$') || child.includes('$$'))
                );

                if (hasMatch) {
                    const textContent = React.Children.toArray(children).join('');
                    return (
                        <p className="font-body text-lg mt-3 text-neutral-300">
                            <ProcessedText text={textContent} />
                        </p>
                    );
                }

                return (
                    <p className="font-body text-lg mt-3 text-neutral-300">
                        {children}
                    </p>
                );
            },
            blockquote: ({ children }) => (
                <blockquote className="font-body border-l-4 border-purple-400 pl-4 italic text-purple-300 mt-6">
                    <p>{children}</p>
                </blockquote>
            ),
        },
        list: {
            bullet: ({ children }) => <ul className="list-disc pl-5 mb-4 text-neutral-300">{children}</ul>,
            number: ({ children }) => <ol className="list-decimal pl-5 mb-4 text-neutral-300">{children}</ol>,
        },
        listItem: {
            bullet: ({ children }) => {
                // Process list items for math as well
                const textContent = React.Children.toArray(children).join('');
                const hasMatch = textContent.includes('$');
                
                if (hasMatch) {
                    return (
                        <li className="mb-2">
                            <ProcessedText text={textContent} />
                        </li>
                    );
                }
                
                return <li className="mb-2">{children}</li>;
            },
            number: ({ children }) => {
                // Process list items for math as well
                const textContent = React.Children.toArray(children).join('');
                const hasMatch = textContent.includes('$');
                
                if (hasMatch) {
                    return (
                        <li className="mb-2">
                            <ProcessedText text={textContent} />
                        </li>
                    );
                }
                
                return <li className="mb-2">{children}</li>;
            },
        },
    };

    return (
        <div className="min-h-screen bg-gradient-to-b via-black to-black">
            <NavBar />
            <div className="w-full px-4 md:px-8 lg:px-12 py-10 pb-32">
                <div className="max-w-[2000px] mx-auto">
                    {/* Hero Section */}
                    <PostHero 
                        title={post.title}
                        categories={post.categories}
                        publishedAt={post.publishedAt}
                        updatedAt={post.updatedAt}
                    />

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Sidebar - Share Buttons */}
                        <div className="hidden lg:block lg:col-span-1">
                            <div className="sticky top-48">
                                <ShareButtons url={`https://www.heyshinde.com/blog/${post.slug.current}`} title={post.title} />
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-7">
                            <article className="relative">
                                {/* Featured Image */}
                                <figure className="mb-6 md:mb-12">
                                    <div className="relative group">
                                        <div className="relative bg-black/80 backdrop-blur-sm rounded-2xl p-2 w-full">
                                            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-400/0 via-purple-400/80 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                style={{
                                                    backgroundSize: '200% 100%',
                                                    animation: 'gradientMove 3s linear infinite',
                                                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                                    maskComposite: 'exclude',
                                                    padding: '1px',
                                                }} />
                                            <Image
                                                src={urlFor(post.mainImage).url()}
                                                alt={post.title}
                                                width={1200}
                                                height={630}
                                                className="w-full h-auto rounded-xl shadow-lg relative z-10"
                                                priority
                                            />
                                        </div>
                                    </div>
                                </figure>

                                {/* Mobile Share Buttons and Table of Contents */}
                                <div className="block lg:hidden mb-8">
                                    <div className="flex flex-col gap-4">
                                        <ShareButtons url={`https://www.heyshinde.com/blog/${post.slug.current}`} title={post.title} />
                                        <TableOfContents headings={headings} />
                                    </div>
                                </div>

                                {/* Article Content */}
                                <div className="prose prose-lg prose-invert max-w-none">
                                    <PortableText value={post.body} components={{
                                        ...components,
                                        block: {
                                            h1: ({ children }) => (
                                                <h1 className="font-heading text-2xl md:text-3xl font-bold mt-8 mb-6 text-white">
                                                    {children}
                                                </h1>
                                            ),
                                            h2: ({ children }) => {
                                                const text = children?.toString() || '';
                                                const id = text.toLowerCase()
                                                    .replace(/[^a-z0-9]+/g, '-')
                                                    .replace(/^-+|-+$/g, '')
                                                    .replace(/-+/g, '-');
                                                return (
                                                    <h2 
                                                        id={id} 
                                                        className="font-heading text-xl md:text-2xl font-semibold mt-8 mb-4 scroll-mt-24 text-purple-400"
                                                    >
                                                        {children}
                                                    </h2>
                                                );
                                            },
                                            h3: ({ children }) => {
                                                const text = children?.toString() || '';
                                                const id = text.toLowerCase()
                                                    .replace(/[^a-z0-9]+/g, '-')
                                                    .replace(/^-+|-+$/g, '')
                                                    .replace(/-+/g, '-');
                                                return (
                                                    <h3 
                                                        id={id} 
                                                        className="font-heading text-lg md:text-xl font-semibold mt-6 mb-3 scroll-mt-24 text-purple-300"
                                                    >
                                                        {children}
                                                    </h3>
                                                );
                                            },
                                            normal: ({ children }) => {
                                                // Check if any child contains math expressions
                                                const hasMatch = React.Children.toArray(children).some(child => 
                                                    typeof child === 'string' && (child.includes('$') || child.includes('$$'))
                                                );

                                                if (hasMatch) {
                                                    const textContent = React.Children.toArray(children).join('');
                                                    return (
                                                        <p className="font-body text-base md:text-lg mt-4 mb-4 leading-relaxed text-neutral-300">
                                                            <ProcessedText text={textContent} />
                                                        </p>
                                                    );
                                                }

                                                return (
                                                    <p className="font-body text-base md:text-lg mt-4 mb-4 leading-relaxed text-neutral-300">
                                                        {children}
                                                    </p>
                                                );
                                            },
                                            blockquote: ({ children }) => (
                                                <blockquote className="border-l-4 border-purple-400 pl-4 py-2 my-6 italic text-purple-300">
                                                    <p className="text-base md:text-lg">{children}</p>
                                                </blockquote>
                                            ),
                                        },
                                        list: {
                                            bullet: ({ children }) => <ul className="list-disc pl-6 mb-6 text-neutral-300 space-y-2">{children}</ul>,
                                            number: ({ children }) => <ol className="list-decimal pl-6 mb-6 text-neutral-300 space-y-2">{children}</ol>,
                                        },
                                        listItem: {
                                            bullet: ({ children }) => {
                                                const textContent = React.Children.toArray(children).join('');
                                                const hasMatch = textContent.includes('$');
                                        
                                                if (hasMatch) {
                                                    return (
                                                        <li className="mb-2">
                                                            <ProcessedText text={textContent} />
                                                        </li>
                                                    );
                                                }
                                        
                                                return <li className="mb-2">{children}</li>;
                                            },
                                            number: ({ children }) => {
                                                const textContent = React.Children.toArray(children).join('');
                                                const hasMatch = textContent.includes('$');
                                        
                                                if (hasMatch) {
                                                    return (
                                                        <li className="mb-2">
                                                            <ProcessedText text={textContent} />
                                                        </li>
                                                    );
                                                }
                                        
                                                return <li className="mb-2">{children}</li>;
                                            },
                                        },
                                    }} />
                                </div>

                                {/* Subscribe Form */}
                                <section className="mt-12 md:mt-16">
                                    <SubscribeForm />
                                </section>
                            </article>
                        </div>

                        {/* Right Sidebar */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-36 space-y-8">
                                {/* Table of Contents - Desktop Only */}
                                <div className="hidden lg:block">
                                    <TableOfContents headings={headings} />
                                </div>

                                {/* Author Card */}
                                {post.author && renderAuthorCard(post.author)}

                                {/* Sidebar Promo */}
                                {post.sidebarPromo && (
                                    <div>
                                        <SidebarPromo promo={post.sidebarPromo} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <GoogleAnalytics gaId="G-FJVPQ93W3W" />
            <GoogleTagManager gtmId="AW-16574029012" />
        </div>
    );
} 