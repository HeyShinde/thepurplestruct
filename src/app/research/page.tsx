import { Research, ResearchPaper } from "@/components/Research";
import { NavBar } from "@/components/NavBar";
import Footer from "@/components/Footer";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

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

export default async function ResearchPage() {
  const papers = await client.fetch<ResearchPaper[]>(researchQuery);

  return (
    <div>
      <NavBar />
      <main>
        <Research papers={papers} paddingTop="10rem" reverse={true} />
      </main>
      <Footer />
    </div>
  );
} 