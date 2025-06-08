import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import { CoursesList } from '@/components/CoursesList'
import { NavBar } from '@/components/NavBar'

const query = groq`
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

export default async function CoursesPage() {
  const courses = await client.fetch(query)
  return (
    <>
      <NavBar />
      <CoursesList courses={courses} showTitle={true} />
    </>
  )
} 