import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import { Metadata } from 'next';
import { urlFor } from '@/sanity/lib/image';
import { NavBar } from '@/components/NavBar';
import Footer from '@/components/Footer';
import { CourseDetails, CourseDetailsType } from './CourseDetails';

// --- GROQ Query ---
const query = groq`
  *[_type == "course" && slug.current == $slug][0]{
    ...,
    "imageUrl": image.asset->url,
    sections[]->{
      ...,
      lessons[]-> {
        _id,
        title,
        order,
        duration
      }
    },
    tutor-> {
      name,
      image,
      bio,
      socialLinks
    },
    keywords
  }
`;

// Define the params type
export type ParamsType = Promise<{ slug: string }>;

// --- Generate Metadata ---
export async function generateMetadata({ params }: { params: ParamsType }): Promise<Metadata> {
    const { slug } = await params;
    const course = await client.fetch<CourseDetailsType>(query, { slug });
    
    if (!course) {
        return {
            title: 'Course Not Found'
        }
    }
    
    const pageUrl = `https://www.heyshinde.com/courses/${course.slug.current}`;
    const imageUrl = course.image ? urlFor(course.image).url() : '';
    const homePageUrl = "https://www.heyshinde.com";
    
    const courseJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: course.title,
        description: course.description,
        url: pageUrl,
        image: imageUrl,
        courseCode: course.courseCode,
        educationalLevel: course.educationalLevel,
        availableLanguage: course.availableLanguage,
        coursePrerequisites: course.requirements,
        teaches: course.whatYouWillLearn,
        educationalCredentialAwarded: course.educationalCredentialAwarded,
        provider: {
            '@type': 'Person',
            '@id': 'https://www.heyshinde.com/#person',
            name: course.tutor?.name,
        },
        hasCourseInstance: {
            '@type': 'CourseInstance',
            courseMode: course.courseMode || ['online', 'self-paced'],
            instructor: {
                '@type': 'Person',
                '@id': 'https://www.heyshinde.com/#person',
                name: course.tutor?.name,
            }
        },
        offers: {
            '@type': 'Offer',
            price: course.price,
            priceCurrency: 'USD',
            category: course.price === 0 ? 'Free' : 'Paid',
        },
    };

    const breadcrumbJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: homePageUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Courses',
          item: `${homePageUrl}/courses`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: course.title,
          item: pageUrl,
        },
      ],
    };

    return {
        title: course.title,
        description: course.description,
        keywords: course.keywords || [],
        alternates: {
            canonical: pageUrl,
        },
        openGraph: {
            title: course.title,
            description: course.description,
            url: pageUrl,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: course.title,
                },
            ],
            type: 'article', // Using article type for better social sharing
        },
        other: {
            "application/ld+json": JSON.stringify([courseJsonLd, breadcrumbJsonLd]),
        }
    };
}

// --- Page Component ---
export default async function CoursePage({ params }: { params: ParamsType }) {
    const { slug } = await params;
    const course = await client.fetch<CourseDetailsType>(query, { slug });

    if (!course) {
        return <div className="min-h-screen flex items-center justify-center bg-black text-white">Course not found.</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-900/80 via-black to-black/90 text-white flex flex-col">
            <div className="w-full backdrop-blur-md z-50">
                <NavBar />
            </div>
            <div className="pt-16">
                <CourseDetails course={course} />
            </div>
            <Footer />
        </div>
    );
}