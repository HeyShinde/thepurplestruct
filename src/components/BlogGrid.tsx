import { client } from "@/sanity/lib/client";
import { BlogGridClient } from "./BlogGridClient";
import type { PortableTextBlock } from '@portabletext/types';

export interface SidebarPromo {
  promoType?: "image" | "code";
  image?: { asset: { url: string } };
  imageLink?: string;
  altText?: string;
  code?: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  author: { _ref: string };
  categories: { _ref: string }[];
  tags: string[];
  mainImage: { asset: { url: string } };
  updatedAt: string;
  excerpt: string;
  body: PortableTextBlock[];
  publishedAt: string;
  sidebarPromo: SidebarPromo;
}

interface BlogGridProps {
  displayLimit?: number;
  paddingTop?: string;
  categorySlug?: string;
  title?: string;
  description?: string;
}

const baseQuery = `| order(publishedAt desc) {
          _id,
          title,
          slug,
          author,
          categories,
          tags,
          mainImage,
          updatedAt,
          excerpt,
          body,
          publishedAt,
          sidebarPromo
        }`;
        
export async function BlogGrid({ displayLimit, paddingTop, categorySlug, title, description }: BlogGridProps) {
  let query;
  const params: { categorySlug?: string } = {};

  if (categorySlug) {
    query = `*[_type == "blog" && $categorySlug in categories[]->slug.current] ${baseQuery}`;
    params.categorySlug = categorySlug;
  } else {
    query = `*[_type == "blog"] ${baseQuery}`;
  }

  const posts: BlogPost[] = await client.fetch(query, params);

  return (
    <BlogGridClient 
      posts={posts} 
      displayLimit={displayLimit} 
      paddingTop={paddingTop} 
      title={title}
      description={description}
    />
  );
} 