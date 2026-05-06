import React, { Suspense } from 'react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import { NavBar } from "@/components/NavBar";
import Footer from "@/components/Footer";

import ProcessedText from '@/components/ProcessedText';
import TableOfContents from "@/components/TableOfContents";
import ShareButtons from '@/components/ShareButtons';
import SubscribeForm from "@/components/SubscribeForm";
import type { BlogPost, SidebarPromo } from '@/types/blog';
import { FaXTwitter } from 'react-icons/fa6';
import { FaLinkedin, FaGithub, FaKaggle } from 'react-icons/fa';
import { SiCodersrank } from 'react-icons/si';
import { IoGlobeOutline } from 'react-icons/io5';

import CodeBlock from './CodeBlock';
import PostHero from './PostHero';
import ScriptExecutor from '@/components/ScriptExecutor';
import { processLatexSSR, containsLatex } from '@/utils/latexProcessor'; // Import the SSR processor

import type { PortableTextSpan, ArbitraryTypedObject } from '@portabletext/types';
import TableComponent from "@/components/TableComponent";
import type { Author, SocialLink } from '@/types/author';
import SocialEmbedBlock from "@/components/SocialEmbedBlock";
const BookmarkButton = React.lazy(() => import('@/components/BookmarkButton'));
import PostPagination from '@/components/PostPagination';
import AdSense from '@/components/AdSense';

// Helper function to process content recursively and preserve formatting
const processContentWithLatex = (children: React.ReactNode, additionalClasses: string = ''): React.ReactNode => {
    return React.Children.map(children, (child) => {
        if (typeof child === 'string') {
            if (containsLatex(child)) {
                return <ProcessedText text={child} className={additionalClasses} />;
            }
            return child;
        }
        
        if (React.isValidElement(child)) {
            // Recursively process children while preserving the element structure
            const processedChildren = processContentWithLatex((child.props as { children?: React.ReactNode }).children, additionalClasses);
            return React.cloneElement(child, {}, processedChildren);
        }
        
        return child;
    });
};

const SidebarPromo = ({ promo }: { promo?: SidebarPromo }) => {
    if (!promo) return null;

    const sidebarRel = promo.sidebarRel ? `${promo.sidebarRel} noopener noreferrer` : 'sponsored noopener noreferrer';

    return (
        <div className="relative group">
            <div className="relative bg-black/80 backdrop-blur-sm rounded-lg p-6 w-full">
                <div className="absolute -inset-px rounded-lg bg-linear-to-r from-purple-400/0 via-purple-400/80 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        backgroundSize: '200% 100%',
                        animation: 'gradientMove 3s linear infinite',
                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        maskComposite: 'exclude',
                        padding: '1px',
                    }} />
                <div className="relative z-10">
                    <span className="text-center font-semibold text-purple-400">{promo.title || 'Advertisement'}</span>
                    {promo.promoType === "image" && (
                        <a href={promo.imageLink || "#"} target="_blank" rel={sidebarRel}>
                            {(promo.imageSource === "link" && promo.imageUrl) ? (
                                <Image
                                    src={promo.imageUrl}
                                    alt={promo.altText || "Promotional content"}
                                    width={300}
                                    height={200}
                                    className="w-full h-auto rounded-lg shadow-lg mt-3.5"
                                />
                            ) : (promo.imageSource === "upload" && promo.image) ? (
                                <Image
                                    src={urlFor(promo.image).url()}
                                    alt={promo.altText || "Promotional content"}
                                    width={300}
                                    height={200}
                                    className="w-full h-auto rounded-lg shadow-lg mt-3.5"
                                />
                            ) : promo.imageUrl ? (
                                <Image
                                    src={promo.imageUrl}
                                    alt={promo.altText || "Promotional content"}
                                    width={300}
                                    height={200}
                                    className="w-full h-auto rounded-lg shadow-lg mt-3.5"
                                />
                            ) : (
                                <div className="w-full h-48 bg-gray-800 rounded-lg shadow-lg mt-3.5 flex items-center justify-center">
                                    <span className="text-gray-400">
                                        {!promo.imageSource ? "Please select image source and provide image URL" :
                                         promo.imageSource === "link" ? "No image URL provided" : 
                                         promo.imageSource === "upload" ? "No image uploaded" : 
                                         "Please select image source"}
                                    </span>
                                </div>
                            )}
                        </a>
                    )}

                    {promo.promoType === "code" && promo.code && (
                        <div id="banner-ad" className="w-full flex items-center justify-center bg-black/40 mt-3.5 rounded-lg p-4">
                            <ScriptExecutor 
                                htmlContent={promo.code}
                                className="w-full"
                            />
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
        <div className="relative group">
            <div className="relative bg-black/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/20">
                <div className="absolute -inset-px rounded-2xl bg-linear-to-r from-purple-400/0 via-purple-400/80 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
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
                                <div className="absolute -inset-1 rounded-full bg-linear-to-r from-purple-400 to-purple-600 opacity-50 blur-sm"></div>
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
                                <div className="absolute -inset-1 rounded-full bg-linear-to-r from-purple-400 to-purple-600 opacity-50 blur-sm"></div>
                                <div className="w-24 h-24 rounded-full bg-linear-to-r from-purple-400 to-purple-600 flex items-center justify-center relative z-10">
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

function injectAds(body: BlogPost['body']) {
    if (!body) return body;
    const newBody: (BlogPost['body'][number] | { _type: string; _key: string })[] = [];
    let paragraphCount = 0;

    body.forEach((block, index: number) => {
        newBody.push(block);
        if (block._type === 'block' && 'style' in block && block.style === 'normal') {
            paragraphCount++;
            // Inject ad after every 3rd paragraph, but not if it's the last block
            if (paragraphCount % 3 === 0 && index < body.length - 1) {
                newBody.push({
                    _type: 'adInsertion',
                    _key: `ad-${paragraphCount}-${index}`,
                });
            }
        }
    });
    return newBody as unknown as BlogPost['body'];
}

export default function BlogPostContent({ post }: { post: BlogPost | null }) {
    if (!post) {
        return (
            <div className="min-h-screen flex flex-col bg-linear-to-b from-purple-950 via-black to-black">
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

    // Process LaTeX in title on server-side for immediate rendering
    const processedTitle = containsLatex(post.title) ? processLatexSSR(post.title) : null;
    
    // Create SEO-friendly title for sharing (remove LaTeX syntax)
    const seoFriendlyTitle = post.title.replace(/\$.*?\$/g, '').replace(/\s+/g, ' ').trim();

    const headings = extractHeadings(post.body);

    const components: PortableTextComponents = {
        types: {
            subscribeForm: ({ value }) => (
                <div className="my-8">
                    <SubscribeForm title={value.title} description={value.description} />
                </div>
            ),
            codeBlock: ({ value }) => <CodeBlock value={value} />,
            table: ({ value }) => <TableComponent value={value} />,
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
                            <div className="absolute -inset-px rounded-lg bg-linear-to-r from-purple-400/0 via-purple-400/80 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
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
            embed: ({ value }) => (
                <SocialEmbedBlock value={value} />
            ),
            adInsertion: () => (
                <div className="my-12">
                    <AdSense 
                        adSlot="2495021187" 
                        layout="in-article"
                        adFormat="fluid"
                    />
                </div>
            ),
        },
        marks: {
            link: ({ children, value }) => {
                const bodyLinkRel = value.bodyLinkRel || 'nofollow';
                const textContent = React.Children.toArray(children).join('');
                const hasLatex = containsLatex(textContent);
                
                return (
                    <a
                        href={value.href}
                        target="_blank"
                        rel={`${bodyLinkRel} noopener noreferrer`}
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                        {hasLatex ? processContentWithLatex(children, "text-purple-400 hover:text-purple-300") : children}
                    </a>
                );
            },
            strong: ({ children }) => {
                const textContent = React.Children.toArray(children).join('');
                if (!textContent.trim()) {
                    return null;
                }
                const hasLatex = containsLatex(textContent);
                
                if (hasLatex) {
                    return (
                        <strong className="font-semibold text-white">
                            {processContentWithLatex(children, "font-semibold text-white")}
                        </strong>
                    );
                }
                
                return <strong className="font-semibold text-purple-200">{children}</strong>;
            },
            em: ({ children }) => {
                const textContent = React.Children.toArray(children).join('');
                const hasLatex = containsLatex(textContent);
                
                if (hasLatex) {
                    return (
                        <span className="italic text-purple-300">
                            {processContentWithLatex(children, "italic text-purple-300")}
                        </span>
                    );
                }
                
                return <em className="italic text-purple-300">{children}</em>;
            },
            code: ({ children }) => {
                const textContent = React.Children.toArray(children).join('');
                const hasLatex = containsLatex(textContent);
                
                if (hasLatex) {
                    return (
                        <span className="text-sm text-purple-400 font-mono bg-gray-800 px-1 py-0.5 rounded">
                            {processContentWithLatex(children, "text-sm text-purple-400")}
                        </span>
                    );
                }
                
                return <code className="text-sm text-purple-400 font-mono bg-gray-800 px-1 py-0.5 rounded">{children}</code>;
            },
        },
        block: {
            h2: ({ children }) => {
                const text = React.Children.toArray(children).join('');
                const id = text.replace(/\$.*?\$/g, '').toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')
                    .replace(/-+/g, '-');
                const hasLatex = containsLatex(text);
                
                return (
                    <h2 
                        id={id} 
                        className="font-heading text-xl md:text-2xl font-semibold mt-8 mb-4 scroll-mt-24 text-purple-400"
                    >
                        {hasLatex ? processContentWithLatex(children, "font-heading text-xl md:text-2xl font-semibold text-purple-400") : children}
                    </h2>
                );
            },
            h3: ({ children }) => {
                const text = React.Children.toArray(children).join('');
                const id = text.replace(/\$.*?\$/g, '').toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')
                    .replace(/-+/g, '-');
                const hasLatex = containsLatex(text);
                
                return (
                    <h3 
                        id={id} 
                        className="font-heading text-lg md:text-xl font-semibold mt-6 mb-3 scroll-mt-24 text-purple-300"
                    >
                        {hasLatex ? processContentWithLatex(children, "font-heading text-lg md:text-xl font-semibold text-purple-300") : children}
                    </h3>
                );
            },
            normal: ({ children }) => {
                const textContent = React.Children.toArray(children).join('');
                const hasLatex = containsLatex(textContent);
                
                return (
                    <p className="font-body text-base md:text-lg mt-4 mb-4 leading-relaxed text-neutral-300">
                        {hasLatex ? processContentWithLatex(children, "font-body text-base md:text-lg leading-relaxed text-neutral-300") : children}
                    </p>
                );
            },
            blockquote: ({ children }) => {
                const textContent = React.Children.toArray(children).join('');
                const hasLatex = containsLatex(textContent);
                
                return (
                    <blockquote className="border-l-4 border-purple-400 pl-4 py-2 my-6 italic text-purple-300">
                        <p className="text-base md:text-lg">
                            {hasLatex ? processContentWithLatex(children, "text-base md:text-lg italic text-purple-300") : children}
                        </p>
                </blockquote>
                );
            },
        },
        list: {
            bullet: ({ children }) => <ul className="list-disc pl-6 mb-6 text-neutral-300 space-y-2">{children}</ul>,
            number: ({ children }) => <ol className="list-decimal pl-6 mb-6 text-neutral-300 space-y-2">{children}</ol>,
        },
        listItem: {
            bullet: ({ children }) => {
                const textContent = React.Children.toArray(children).join('');
                const hasLatex = containsLatex(textContent);
                
                return (
                    <li className="mb-2 text-neutral-300">
                        {hasLatex ? processContentWithLatex(children, "text-neutral-300") : children}
                    </li>
                );
            },
            number: ({ children }) => {
                const textContent = React.Children.toArray(children).join('');
                const hasLatex = containsLatex(textContent);
                
                return (
                    <li className="mb-2 text-neutral-300">
                        {hasLatex ? processContentWithLatex(children, "text-neutral-300") : children}
                    </li>
                );
            },
        },
    };

    return (
        <div className="min-h-screen bg-linear-to-b via-black to-black">
            <NavBar />
            <div className="w-full px-4 md:px-8 lg:px-12 py-10 pb-32">
                <div className="max-w-[2000px] mx-auto">
                    {/* Hero Section - Title loads immediately with SSR LaTeX */}
                    <PostHero 
                        title={post.title}
                        processedTitle={processedTitle ?? undefined}
                        categories={post.categories}
                        publishedAt={post.publishedAt}
                        updatedAt={post.updatedAt}
                    />

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Sidebar - Share Buttons */}
                        <div className="hidden lg:block lg:col-span-1">
                            <div className="sticky top-48 flex flex-col space-y-4 z-20">
                                <ShareButtons url={`https://www.thepurplestruct.com/blog/${post.slug.current}`} title={seoFriendlyTitle}>
                                    <Suspense fallback={<div style={{ width: 48, height: 48 }} />}> 
                                        <BookmarkButton postId={post._id} postTitle={post.title} />
                                    </Suspense>
                                </ShareButtons>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-7">
                            <article className="relative">
                                {/* Featured Image */}
                                <figure className="mb-6 md:mb-12">
                                    <div className="relative group">
                                        <div className="relative bg-black/80 backdrop-blur-sm rounded-2xl p-2 w-full">
                                            <div className="absolute -inset-px rounded-2xl bg-linear-to-r from-purple-400/0 via-purple-400/80 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                style={{
                                                    backgroundSize: '200% 100%',
                                                    animation: 'gradientMove 3s linear infinite',
                                                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                                    maskComposite: 'exclude',
                                                    padding: '1px',
                                                }} />
                                            <Image
                                                src={urlFor(post.mainImage).url()}
                                                alt={seoFriendlyTitle}
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
                                    <div className="flex items-center space-x-4 justify-center">
                                        <ShareButtons url={`https://www.thepurplestruct.com/blog/${post.slug.current}`} title={seoFriendlyTitle} >
                                        <Suspense fallback={<div style={{ width: 48, height: 48 }} />}> 
                                          <BookmarkButton postId={post._id} postTitle={post.title} />
                                        </Suspense>
                                        </ShareButtons>
                                    </div>
                                    <div className="mt-4">
                                        <TableOfContents headings={headings} />
                                    </div>
                                </div>

                                {/* Article Content */}
                                <div className="prose prose-lg prose-invert max-w-none">
                                    <PortableText value={injectAds(post.body)} components={components} />
                                </div>
                                <PostPagination
                                    previousPost={post.previousPost}
                                    nextPost={post.nextPost}
                                />
                                {/* Multiplex Ad */}
                                <div className="mt-12">
                                    <AdSense 
                                        adSlot="8413562270" 
                                        adFormat="autorelaxed"
                                    />
                                </div>
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
        </div>
    );
}