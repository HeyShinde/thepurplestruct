import React from 'react';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { containsLatex } from '@/utils/latexProcessor';
import ProcessedText from '@/components/ProcessedText';

interface PostPaginationProps {
    previousPost?: {
        _id: string;
        title: string;
        slug: { current: string };
        excerpt?: string;
    };
    nextPost?: {
        _id: string;
        title: string;
        slug: { current: string };
        excerpt?: string;
    };
}

const PostPagination: React.FC<PostPaginationProps> = ({ previousPost, nextPost }) => {
    if (!previousPost && !nextPost) return null;

    const renderPostLink = (post: PostPaginationProps['previousPost'], direction: 'previous' | 'next') => {
        if (!post) return null;

        const hasLatexTitle = containsLatex(post.title);
        const isNext = direction === 'next';

        return (
            <Link
                href={`/blog/${post.slug.current}`}
                className="group relative block w-full"
            >
                <div className="relative bg-black/80 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300">
                    <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-purple-400/0 via-purple-400/60 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                         style={{
                             backgroundSize: '200% 100%',
                             animation: 'gradientMove 3s linear infinite',
                             mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                             maskComposite: 'exclude',
                             padding: '1px',
                         }} />

                    <div className="relative z-10">
                        <div className={`flex items-center gap-2 mb-2 ${isNext ? 'md:justify-end' : 'md:justify-start'} justify-start`}>
                            {!isNext && <FaChevronLeft className="w-3 h-3 md:w-4 md:h-4 text-purple-400 flex-shrink-0" />}
                            <span className="text-xs md:text-sm text-purple-400 font-medium">
                                {isNext ? 'Next Post' : 'Previous Post'}
                            </span>
                            {isNext && <FaChevronRight className="w-3 h-3 md:w-4 md:h-4 text-purple-400 flex-shrink-0" />}
                        </div>

                        <h3 className={`font-heading text-base md:text-lg font-semibold text-white group-hover:text-purple-300 transition-colors mb-2 line-clamp-2 ${isNext ? 'md:text-right' : 'md:text-left'} text-left`}>
                            {hasLatexTitle ? (
                                <ProcessedText text={post.title} className="font-heading text-base md:text-lg font-semibold" />
                            ) : (
                                post.title
                            )}
                        </h3>

                        {post.excerpt && (
                            <p className={`text-xs md:text-sm text-neutral-400 line-clamp-2 ${isNext ? 'md:text-right' : 'md:text-left'} text-left`}>
                                {post.excerpt}
                            </p>
                        )}
                    </div>
                </div>
            </Link>
        );
    };

    // Check if both posts exist for proper layout
    const hasBothPosts = previousPost && nextPost;
    const hasOnlyNext = !previousPost && nextPost;

    return (
        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-purple-400/20">
            {/* Mobile: Stack vertically */}
            <div className="block md:hidden space-y-4">
                {previousPost && (
                    <div>
                        {renderPostLink(previousPost, 'previous')}
                    </div>
                )}
                {nextPost && (
                    <div>
                        {renderPostLink(nextPost, 'next')}
                    </div>
                )}
            </div>

            {/* Desktop: Side by side */}
            <div className="hidden md:flex gap-6">
                <div className={`${hasBothPosts ? 'flex-1' : hasOnlyNext ? 'flex-1 ml-auto' : 'flex-1'}`}>
                    {previousPost && renderPostLink(previousPost, 'previous')}
                </div>
                <div className={`${hasBothPosts ? 'flex-1' : 'flex-1'}`}>
                    {nextPost && renderPostLink(nextPost, 'next')}
                </div>
            </div>
        </div>
    );
};

export default PostPagination;
