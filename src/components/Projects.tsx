import { client } from "@/sanity/lib/client";
import { ProjectsClient } from "./ProjectsClient";

export async function Projects({ displayLimit }: { displayLimit?: number }) {
  const projects = await client.fetch(`*[_type == "project"]|order(_createdAt desc){
                title,
                description,
                longDescription,
                bulletPoints,
                techStack,
                "src": src,
                ctaText,
    ctaLink,
    keywords
  }`);

  return <ProjectsClient projects={projects} displayLimit={displayLimit} />;
}
