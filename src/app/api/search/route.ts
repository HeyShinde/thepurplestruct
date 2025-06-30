import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { NextResponse } from "next/server";

const searchQuery = groq`
  *[_type in ["blog", "course", "project", "research"] && (
    title match "**" + $term + "**" ||
    excerpt match "**" + $term + "**" ||
    description match "**" + $term + "**" ||
    body[].children[].text match "**" + $term + "**" ||
    tags[] match "**" + $term + "**" ||
    keywords[] match "**" + $term + "**"
  )] | score(
    title match $term,
    body[].children[].text match $term
  ) | order(_score desc) [0...10] {
    _id,
    _type,
    title,
    "slug": { "current": slug.current },
    "url": url,
  }
`;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get("term");

    if (!term) {
      return NextResponse.json(
        { message: "Search term is required" },
        { status: 400 }
      );
    }

    // The `pt::text()` function can be used for more comprehensive portable text searches
    // but requires a different query structure. The current approach is a good balance.
    const results = await client.fetch(searchQuery, { term: term });
    // console.log("Search results:", results);

    return NextResponse.json(results);
  } catch {
    // console.error("Search API error:", error);
    return NextResponse.json(
      { message: "An error occurred during search." },
      { status: 500 }
    );
  }
}
