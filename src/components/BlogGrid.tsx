import { client } from "@/sanity/lib/client";
import { BlogGridClient } from "./BlogGridClient";

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  author: { _ref: string };
  categories: { _ref: string }[];
  tags: string[];
  mainImage: any;
  updatedAt: string;
  excerpt: string;
  body: any[];
  publishedAt: string;
  sidebarPromo: any;
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