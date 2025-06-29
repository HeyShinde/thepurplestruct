import { client } from "@/sanity/lib/client";
import { ProjectsClient } from "./ProjectsClient";

export async function Projects({ displayLimit, isMainPage = false }: { displayLimit?: number, isMainPage?: boolean }) {
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

  return <ProjectsClient projects={projects} displayLimit={displayLimit} isMainPage={isMainPage} />;
}
