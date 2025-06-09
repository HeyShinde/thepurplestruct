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
import { Metadata } from 'next';

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

export async function generateMetadata(): Promise<Metadata> {
  const pageUrl = "https://developer.heyshinde.com";
  const imageUrl = `${pageUrl}/images/profile-img.webp`; // Ensure this is the correct path to your image
  const name = "Shinde Aditya";
  const jobTitle = "Machine Learning Engineer";

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${pageUrl}/#person`, // Unique identifier for this Person object
    name: name,
    givenName: "Aditya",
    familyName: "Shinde",
    alternateName: "HeyShinde",
    url: pageUrl,
    image: imageUrl,
    jobTitle: jobTitle,
    disambiguatingDescription: "Machine Learning Engineer, Author, and Co-founder of...", // Add your co-founder info
    "alumniOf": {
      "@type": "CollegeOrUniversity",
      "name": "Woxsen University",
      "sameAs": "https://en.wikipedia.org/wiki/Woxsen_University"
    },
    gender: "Male",
    nationality: "Indian",
    address: {
      "@type": "PostalAddress",
      "addressLocality": "Hyderabad",
      "addressRegion": "Telangana",
      "addressCountry": "IN"
    },
    knowsAbout: [
      "Machine Learning", "Large Language Models", "Artificial Intelligence", "MLOps", "Python", "Deep Learning" // Add more skills
    ],
    sameAs: [
      "https://www.linkedin.com/in/heyshinde/",
      "https://github.com/heyshinde",
      "https://x.com/heyshinde",
      "https://www.kaggle.com/heyshinde",
      "https://www.instagram.com/heyshinde",
      "https://www.goodreads.com/author/show/52899939.Shinde_Aditya",
      "https://www.youtube.com/@heyshinde" // Add your YouTube channel
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Self Employed',
    },
    parent: [
      { "@type": "Person", "name": "Shinde Ghanshyam" },
      { "@type": "Person", "name": "Shinde Anasuya" }
    ],
    sibling: {
      "@type": "Person",
      "name": "Shinde Komal"
    },
    worksAuthored: [
      {
        "@type": "Book",
        "name": "Her: A Poet's Silent Longing",
        "url": "https://www.amazon.com/Her-Silent-Longing-Shinde-Aditya/dp/B0DNH9DTC9/",
        "datePublished": "2024-09-28", // Corrected date format
        "numberOfPages": 142,
        "inLanguage": "en-US",
        "bookFormat": [
          "https://schema.org/EBook",
          "https://schema.org/Paperback",
          "https://schema.org/Hardcover"
        ],
        "isbn": [
          "979-8895881613",
          "979-8895881620"
        ],
        "sameAs": [
          "https://www.amazon.com/gp/product/B0D5HQQDCX/",
          "https://www.amazon.com/Her-Silent-Longing-Shinde-Aditya/dp/B0DK1PW6KW/",
          "https://www.amazon.com/Her-Silent-Longing-Shinde-Aditya/dp/B0DNH9DTC9/",
          "https://www.amazon.in/HER-Silent-Longing-Shinde-Aditya-ebook/dp/B0D5HQQDCX/",
          "https://www.amazon.in/HER-Silent-Longing-Shinde-Aditya/dp/B0DK1PW6KW/",
          "https://www.amazon.in/HER-Silent-Longing-Shinde-Aditya/dp/B0DK1DNH2P/",
          "https://www.goodreads.com/book/show/221463592-her"
        ],
        "author": {
          "@id": `${pageUrl}/#person`
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5",
          "reviewCount": 3,
          "bestRating": "5",
          "worstRating": "1"
        }
      }
    ]
  };

  return {
    title: `${name} | ${jobTitle}`,
    description: "The personal portfolio and blog of Shinde Aditya, a Machine Learning Engineer specializing in LLMs, MLOps, and AI.",
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${name} | ${jobTitle}`,
      description: "Explore the work and thoughts of a dedicated ML Engineer.",
      url: pageUrl,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} | ${jobTitle}`,
      description: "The personal portfolio and blog of Aditya Shinde, a Machine Learning Engineer.",
      images: [imageUrl],
    },
    other: {
      "application/ld+json": JSON.stringify(jsonLd),
    }
  };
}

export default async function Home() {
  const courses = await client.fetch(coursesQuery);
  const researchPapers = await client.fetch(researchQuery);

  return (
    <div>
      <NavBar />
      <main>
        <Hero />
        <section id="about" className="scroll-mt-20">
          <AboutMe />
        </section>
        <section className="bg-gradient-to-b from-black to-purple-950">
          <Experience displayLimit={2} showBackground={false} />
        </section>
        <Projects displayLimit={4}/>
        <Research displayLimit={3} showTitle={true} />
        <CoursesList courses={courses} displayLimit={3} />
        <BlogGrid displayLimit={3} />
      </main>
      <Footer/>
    </div>
  );
}
