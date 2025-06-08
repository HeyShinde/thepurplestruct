import { AboutMe } from "@/components/AboutMe";
import { Experience } from "@/components/Experience";
import Hero from "@/components/Hero";
import { NavBar } from "@/components/NavBar";
import { Projects } from "@/components/Projects";
import { Research } from "@/components/Research";
import { BlogGrid } from "@/components/BlogGrid";
import  Footer  from "@/components/Footer";
import { CoursesList } from "@/components/CoursesList";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

const coursesQuery = groq`
  *[_type == "course"] {
    _id,
    title,
    slug,
    description,
    price,
    "imageUrl": image.asset->url,
    "lessons": count(sections[]->lessons[]),
  }
`

const researchQuery = groq`
  *[_type == "research"] | order(year desc) {
    title,
    url,
    doi,
    authors,
    year,
    venue,
    abstract,
    longDescription,
    bulletPoints
  }
`;

export default async function Home() {
  const courses = await client.fetch(coursesQuery);
  const researchPapers = await client.fetch(researchQuery);

  return (
    <div>
      <NavBar />
      <main>
        <Hero />
        <AboutMe />
        <section className="bg-gradient-to-b from-black to-purple-950">
          <Experience displayLimit={2} />
        </section>
        <Projects displayLimit={4}/>
        <Research papers={researchPapers} displayLimit={3} showTitle={true} />
        <CoursesList courses={courses} displayLimit={3} />
        <BlogGrid displayLimit={3} />
      </main>
      <Footer/>
    </div>
  );
}
