import { client } from "@/sanity/lib/client";
import { ExperienceClient } from "./ExperienceClient";

export async function Experience({ displayLimit, showBackground = true }: { displayLimit?: number, showBackground?: boolean } = {}) {
  const experiences = await client.fetch(`*[_type == "experience"]|order(date desc){
    _id,
    title,
    company,
    description,
    date,
    skills,
    achievements,
    responsibilities,
    keywords
  }`);
  return <ExperienceClient experiences={experiences} displayLimit={displayLimit} showBackground={showBackground} />;
}
