import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import { CoursesList } from '@/components/CoursesList'
import { NavBar } from '@/components/NavBar'
import { Metadata } from 'next';

const query = groq`
  *[_type == "course"] {
    _id,
    title,
    slug,
    description,
    price,
    isFree,
    educationalLevel,
    whatYouWillLearn,
    requirements,
    tutor->{
      name
    },
    "imageUrl": image.asset->url,
    "lessons": count(sections[]->lessons[]),
  }
`
const pageUrl = "https://www.heyshinde.com/courses";

export async function generateMetadata(): Promise<Metadata> {
  const courses = await client.fetch(query);
  const name = "Courses by Aditya Shinde";
  const description = "Explore a range of courses on Machine Learning, AI, and software development, designed to enhance your skills.";

  const itemListElement = courses.map((course: any, index: number) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Course',
      url: `${pageUrl}/${course.slug.current}`,
      name: course.title,
      description: course.description,
      provider: {
        '@type': 'Person',
        name: course.tutor.name,
        '@id': 'https://www.heyshinde.com/#person'
      },
      educationalLevel: course.educationalLevel,
      teaches: course.whatYouWillLearn,
      coursePrerequisites: course.requirements,
      offers: {
        '@type': 'Offer',
        price: course.isFree ? 0 : course.price,
        priceCurrency: 'USD',
        category: course.isFree ? 'Free' : 'Paid'
      }
    }
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: name,
    description: description,
    itemListElement: itemListElement,
  };

  return {
    title: name,
    description: description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: name,
      description: description,
      url: pageUrl,
      type: 'website',
    },
    other: {
      "application/ld+json": JSON.stringify(jsonLd),
    }
  };
}

export default async function CoursesPage() {
  const courses = await client.fetch(query)
  return (
    <>
      <NavBar />
      <CoursesList courses={courses} showTitle={true} />
    </>
  )
} 