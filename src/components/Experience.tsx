import { client } from "@/sanity/lib/client";
import { ExperienceClient } from "./ExperienceClient";

export async function Experience({ displayLimit, showBackground = true, isMainPage = false }: { displayLimit?: number, showBackground?: boolean, isMainPage?: boolean } = {}) {
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
  return <ExperienceClient experiences={experiences} displayLimit={displayLimit} showBackground={showBackground} isMainPage={isMainPage} />;
}
